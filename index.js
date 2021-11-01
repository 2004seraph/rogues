"use strict";
const gameChecksum = "71b86381497a97812e1e7bb5c9a86951f74ba9b3ba3b5d11f6cb018a4fa9529f"

const fs = require('fs')
let serverDir = './serverData'
if (!fs.existsSync(serverDir)){
  fs.mkdirSync(serverDir)
}

//set up CLI
const consoleManager = require("./modules/console.js")
global.CLI = new consoleManager.cli(require('./modules/commands.js').commands)

//set up player database
const playerDatabase = require("./modules/database.js")
global.PlayerDatabase = new playerDatabase()
PlayerDatabase.initializeTable(function() {
  CLI.prompt()//start CLI
})

//serve web page
const express = require('express')
const app = express()
const PORT = process.env['PORT']
app.use(express.static('web'))
const webServer = app.listen(PORT, function() {
  CLI.printLine("Started Rogues Server")
})

//listen to the webserver's connection
const socketio = require('socket.io')
const io = socketio(webServer)

//load in server functions
const {accountEvents, gameEvents, matchMaking} = require("./modules/serverFunctions.js")
global.GlobalServerInfo = {
  username: {
    min: 3,
    max: 12
  },
  password: {
    min: 6,
    max: 24
  },
  motd: "",
  roomCode: {
    max: 6
  }
}

//server globals
global.allowSignups = true
global.matchServers = true
global.concurrentUsers = 0
global.concurrentOnlineUsers = 0
global.connectionsLimit = 6
global.runningRooms = {}
//var lastRequest = null
//global.updateLastRequest = function() {lastRequest = Date.now()}
global.spamStop = false

io.on('connection', function(socket) {
  //limit connections to protect server
  if (io.engine.clientsCount > connectionsLimit) {
    socket.emit("blocked", {code: "maxOnlineUsers"})
    socket.disconnect()
    return
  }

  socket.once('checkSum', (data) => {
    if (data.hash === gameChecksum) {
      //authorised
    } else {
      //socket.emit("blocked", {code: "modifiedGame"})
      //socket.disconnect()
    }
  })

  //they are not signed in
  socket.authorised = null
  
  //cooldowns
  socket.accountCooldown = {
    timer: setInterval(function() {
      if (socket.accountCooldown.time > 0) {
        socket.accountCooldown.time -= 100
        //console.log(socket.accountCooldown.time)
      }
    }, 100),
    time: 0
  }
  
  CLI.printLine("connected to " + socket.id)
  concurrentUsers++
  //handshake
  socket.emit("globalServerInfo", GlobalServerInfo)

  //disconnect
  socket.once('disconnecting', (reason) => {
    CLI.printLine(socket.id + " disconnected: " + reason)
    if (socket.authorised != null) {
      accountEvents.signOut({ID: socket.authorised}, io, socket)
    }
    concurrentUsers--
  })

  //when packets happen
  let accountMethodNames = Object.keys(accountEvents)
  for (let accountAction of accountMethodNames) {
    socket.on(accountAction, (data) => {
      accountEvents[accountAction](data, io, socket)
    })
  }
  let matchmakingNames = Object.keys(matchMaking)
  for (let matchAction of matchmakingNames) {
    socket.on(matchAction, (data) => {
      matchMaking[matchAction](data, io, socket)
    })
  }

  let gameMethodNames = Object.keys(gameEvents)
  for (let gameAction of gameMethodNames) {
    socket.on(gameAction, (data) => {gameEvents[gameAction](data, io, socket)})
  }
})

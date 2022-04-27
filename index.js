"use strict";
const gameChecksum = ""

const fs = require('fs')
let serverDir = './serverData'
if (!fs.existsSync(serverDir)) {
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
const { accountEvents, gameEvents, matchMaking } = require("./modules/serverFunctions.js")
global.GlobalServerInfo = {
  username: {
    min: 3,
    max: 7
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
global.connectionsLimit = 100
global.runningRooms = {}
//var lastRequest = null
//global.updateLastRequest = function() {lastRequest = Date.now()}
global.spamStop = false

//matchmaker
setInterval(() => {
  let matchMakers = []
  let currentSockets = Array.from(io.sockets.sockets)
  for (let socket of currentSockets) {
    let socketObject = socket[1]
    if (socketObject.matchmake == true) {
      matchMakers.push(socketObject)
    }
  }

  for (let i = matchMakers.length - 1; i > 0; i--) {
    if (matchMakers.length >= 2) {
      let player = io.sockets.sockets.get(matchMakers[i].id)
      player.matchmake = false
      matchMakers.splice(i, 1)

      let opponentIndex = Math.floor(Math.random(matchMakers.length))
      let opponent = matchMakers[opponentIndex]
      opponent.matchmake = false
      matchMakers.splice(opponentIndex, 1)
      i--

      matchMaking["createRoom"](null, io, player)
      let roomCode = player.id.substring(0, 6).toUpperCase()
      matchMaking["joinRoom"]({room: roomCode}, io, opponent)

      let room = io.sockets.adapter.rooms.get(roomCode)
      room.competitive = true//the elo of the players will be affected
    } else {
      //not enough players to matchmake
      return
    }
  }
}, 1000)

io.on('connection', function(socket) {
  //limit connections to protect server
  if (io.engine.clientsCount > connectionsLimit) {
    socket.emit("blocked", { code: "maxOnlineUsers" })
    socket.disconnect()
    return
  }

  //they are not signed in
  socket.authorised = null
  socket.matchmake = false

  //cooldowns
  socket.accountCooldown = {
    timer: setInterval(function() {
      if (socket.accountCooldown.time > 0) {
        socket.accountCooldown.time -= 100
      }
    }, 100),
    time: 0
  }
  socket.valueChecker = setInterval(() => {
    if (socket.authorised == null) {socket.matchmake = false}
  }, 100)

  CLI.printLine("connected to " + socket.id)
  concurrentUsers++
  //handshake
  socket.emit("globalServerInfo", GlobalServerInfo)

  //disconnect
  socket.once('disconnecting', (reason) => {
    CLI.printLine(socket.id + " disconnected: " + reason)
    if (socket.authorised != null) {
      accountEvents.signOut({ ID: socket.authorised }, io, socket)
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
    socket.on(gameAction, (data) => { gameEvents[gameAction](data, io, socket) })
  }
})

"use strict";
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
const {accountEvents, gameEvents} = require("./modules/serverFunctions.js")
global.GlobalServerInfo = {
  username: {
    min: 3,
    max: 12
  },
  password: {
    min: 6,
    max: 24
  }
}

//server globals
global.allowSignups = true
global.concurrentUsers = 0

io.on('connection', function(socket) {
  CLI.printLine("connected to " + socket.conn.remoteAddress)
  concurrentUsers++
  io.emit("globalServerInfo", GlobalServerInfo)

  //disconnect
  socket.on('disconnect', function() {
    CLI.printLine(socket.conn.remoteAddress + " disconnected")
    concurrentUsers--
  })

  //when packets happen
  let accountMethodNames = Object.keys(accountEvents)
  for (let accountAction of accountMethodNames) {
    socket.on(accountAction, (data) => {accountEvents[accountAction](data, io)})
  }

  // let gameMethodNames = Object.keys(gameEvents)
  // for (let gameAction of gameMethodNames) {
  //   socket.on(gameAction, (data) => {gameEvents[gameAction](data, io)})
  // }
})



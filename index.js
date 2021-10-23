"use strict";
const consoleManager = require("./console.js")
global.CLI = new consoleManager.cli(require('./commands.js').commands)

const playerDatabase = require("./database.js")
global.PlayerDatabase = new playerDatabase()
PlayerDatabase.initializeTable(function() {
  CLI.prompt()//start CLI
})

const socketio = require('socket.io')
const express = require('express')
const expressObject = express()

//serve web page
const PORT = process.env['PORT']
expressObject.use(express.static('web'))
const webServer = expressObject.listen(PORT, function() {
  CLI.printLine("Started Rogues Server")
})

global.concurrentUsers = 0

//listen to the webserver's connection
const io = socketio(webServer)
global.allowSignups = true

const {accountEvents, gameEvents} = require("./serverFunctions.js")

io.on('connection', function(socket) {
  CLI.printLine("connected to " + socket.id)
  concurrentUsers++

  //disconnect
  socket.on('disconnect', function() {
    CLI.printLine(socket.id + " disconnected")
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
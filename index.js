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

//listen to the webserver's connection
const io = socketio(webServer)

io.on('connection', function(socket) {
  CLI.printLine("connected to " + socket.id)

  //disconnect
  socket.on('disconnect', function() {
    CLI.printLine(socket.id + " disconnected")
  })

  //when packets happen
  socket.on("showAllTheMen", function(data) {
    //io.emit("response", data)
    // addUser("Doge", "asmda", function() {
        // queryUsername("DogTurd", function(rec) {
        // console.log(rec)
    // })
  })
})
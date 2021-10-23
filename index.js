"use strict";
const consoleManager = require("./console.js")
const printLine = consoleManager.printLine

const playerDatabase = require("./database.js")
var PlayerDatabase = new playerDatabase()
PlayerDatabase.initializeTable(function() {
  CLIsystem.prompt()
  commands.dumpDatabase.command()
})

const socketio = require('socket.io')
const express = require('express')

const expressObject = express()

//serve web page
const PORT = process.env['PORT']
expressObject.use(express.static('web'))
const webServer = expressObject.listen(PORT, function() {
  printLine("Started Rogues Server")
})

var commands = {
  "stop": {
    "aliases": ["shutdown", "close"],
    "command": function(...args) {
      printLine("shutdown server")
      process.exit(0)
    }
  },
  "dumpDatabase": {
    "aliases": ["showUsers", "census"],
    "command": function(...args) {
      printLine("All Users:")
      PlayerDatabase.printDatabase(function(rec) {
        printLine(rec)
      })
    }
  },
  "createUser": {
    "aliases": ["addUser", "createAccount", "addAccount"],
    "command": function(...args) {
      PlayerDatabase.addUser(args[0], args[1])
    }
  },
  "echo": {
    "aliases": [],
    "command": function(...args) {
      printLine(args)
    }
  }
}
var CLIsystem = new consoleManager.cli(commands)

//listen to the webserver's connection
const io = socketio(webServer)

io.on('connection', function(socket) {
  printLine("connected to " + socket.id)

  //disconnect
  socket.on('disconnect', function() {
    printLine(socket.id + " disconnected")
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
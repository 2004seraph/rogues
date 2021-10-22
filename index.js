"use strict";

const playerDatabase = require("./database.js")
var PlayerDatabase = new playerDatabase()
PlayerDatabase.initializeTable()

const socketio = require('socket.io')
const express = require('express')

const expressObject = express()

//serve web page
const PORT = process.env['PORT']
expressObject.use(express.static('web'))
const webServer = expressObject.listen(PORT, function() {
 console.log("Started Rogues Server")
})

//listen to the webserver's connection
const io = socketio(webServer)

io.on('connection', function(socket) {
  console.log("connected to " + socket.id)

  //disconnect
  socket.on('disconnect', function() {
    console.log(socket.id + " disconnected")
  })

  //when packets happen
  socket.on("showAllTheMen", function(data) {
    //io.emit("response", data)
    // addUser("DogTurd", "assmda", function() {
        // queryUsername("DogTurd", function(rec) {
        // console.log(rec)
    // })
    PlayerDatabase.printDatabase(function(rec) {
      console.log(rec)
    })
  })
})
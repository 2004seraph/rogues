const socketio = require('socket.io')
const express = require('express')

const expressObject = express()

//serve web page
expressObject.use(express.static('web'))
const webServer = expressObject.listen(3000, function() {
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
  socket.on("message", function(data) {
    io.emit("response", data)
  })
})
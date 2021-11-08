"use strict";
exports.accountEvents = {
  "requestSignup": function(data, io, socket) {
    if (allowSignups) {
      let rUsername = data.username.toString().trim().toUpperCase()
      //allow names within the max length and only ascii characters, doesnt block spaces (REGEX)
      if (rUsername.length > GlobalServerInfo.username.min && rUsername.length < GlobalServerInfo.username.max && /^[\x00-\x7F]+$/.test(rUsername)) {
        PlayerDatabase.queryUsername(rUsername, function(rec) {
          if (rec == undefined) {//if there is no one with that username
            if (socket.accountCooldown.time == 0) {//if they are not in cooldown
              PlayerDatabase.addUser(rUsername, data.passwordHash, 1000, function() {
                PlayerDatabase.queryUsername(rUsername, function(rec) {
                  socket.emit("signupCode", {code: "successful"})
                  //if they are signed in, sign them out
                  exports.accountEvents["signOut"](null, io, socket)

                  exports.accountEvents["signIn"](rec.ID, io, socket)//to sign them in at account creation
                  socket.accountCooldown.time = 50000
                })
              })
            } else {
              //bro stop spamming plz
              socket.emit("signupCode", {code: "creationCooldown"})
            }
          } else {
            //username taken
            socket.emit("signupCode", {code: "usernameTaken"})
          }
        })
      } else {
        //they have breached the username limits
        socket.emit("signupCode", {code: "badUsername"})
      }
    }
  },
  "requestLogin": function(data, io, socket) {
    PlayerDatabase.queryUsername(data.username.toString().trim().toUpperCase(), function(rec) {
      if (rec) {//if that username exists
        PlayerDatabase.isOnline(rec.ID, function(status) {
          if (status == "false") {//if the requested account is offline
            if (data.passwordHash.length == 64 && rec.PasswordHash === data.passwordHash) {//password correct?
              if (socket.authorised != null) {//are they signing into an account when they are already signed in? if so, log them out first
                exports.accountEvents["signOut"]({ID: socket.authorised}, io, socket, function() {
                  exports.accountEvents["signIn"](rec.ID, io, socket)
                })
              } else {
                exports.accountEvents["signIn"](rec.ID, io, socket)
              }
            } else {
              //wrong password
              socket.emit("loginCode", {code: "badpassword"})
            }
          } else {
            socket.emit("loginCode", {code: "alreadyonline"})
          }
        })
      } else {
        //username does not exist
        socket.emit("loginCode", {code: "badusername"})
      }
    })
  },
  "requestUserData": function(data, io, socket) {
    if (socket.authorised != null) {//if this socket is actually logged in to the account they want to query
      PlayerDatabase.queryUserID(socket.authorised.id, function(rec) {
        if (rec) {//if that id exists
          //only give them the essentials
          let userDataGrant = {
            Elo: rec.Elo,
            Data: rec.Data,
            Username: rec.Username
          }
          socket.emit("userDataCode", {code: "successful", userData: userDataGrant})
        } else {
          //?????
          exports.accountEvents["signOut"](rec.ID, io, socket)
          socket.emit("blocked", {code: "accountAuthDesync"})
          socket.disconnect()
        }
      })
    } else {//they are not signed in and authorised
      //console.log("bad")
      socket.emit("userDataCode", {code: "badAuth"})
      //kill connection? malicious traffic?
      // socket.emit("blocked", {code: "badAuth"})
      // socket.disconnect()
    }
  },
  "requestGameStatistics": function(data, io, socket) {
    //highscores and concurrent users
    PlayerDatabase.getRankings(0, 9, function(sel) {
      socket.emit("gameStatisticsCode", {code: "successful", onlineUsers: concurrentOnlineUsers, rankings: sel})
    })
  },
  "signOut": function(data, io, socket, callback=function() {}) {//NETWORKED/NON-NETWORKED FUNCTION
    if (socket.authorised != null) {
      //remove any rooms this socket has made
      exports.matchMaking["deleteRoom"](null, io, socket)

      concurrentOnlineUsers--

      exports.matchMaking["stopMatchmake"](null, io, socket)
      
      //socket.openRoom = false
      PlayerDatabase.setOnlineStatus(socket.authorised.id, "false", function() {//sign them out
        callback()
      })

      //remove who this connection identifies as
      socket.authorised = null
    } else {
      //HACKER
    }
  },
  "signIn": function(id, io, socket) {//NON NETWORKED FUNCTION
    PlayerDatabase.updateUserLoginDate(id, function() {//update last login
      PlayerDatabase.setOnlineStatus(id, "true", function() {//update online status
        //if they are already logged in, log them out -AND THEN sign them in
        concurrentOnlineUsers++
        socket.authorised = {
          id: id
        }//store who this connection identifies as
        
        socket.emit("loginCode", {code: "successful"})
        CLI.printLine(socket.id + " authenticated to ROGUESID[" + id + "]")
      })
    })
  },
  "getUserData": function(id, callback=function(rec) {}) {//NON NETWORKED FUNCTION
    PlayerDatabase.queryUserID(id, function(rec) {
      if (rec) {
        callback(rec)
      }
    })
  }
}

//stop hosts from joining their own rooms
exports.matchMaking = {
  "joinRoom": function(data, io, socket) {
    if (socket.authorised != null) {//if they are signed in
      let roomCode
      try {
        roomCode = data.room.toString().trim().toUpperCase()//cleanse
      } catch (err) {
        socket.emit("roomCode", {code: "invalidRoomCode"})
        return
      }

      let room = io.sockets.adapter.rooms.get(roomCode)
      if (room) {//if the room exists
        if (room.players < 2) {// and there is space
          room.players++
          socket.join(roomCode)
          exports.accountEvents["getUserData"](socket.authorised.id, (rec) => {//give client details to host
            socket.to(roomCode).emit("roomCode", {code: "opponentJoined", opponentName: rec.Username, opponentElo: rec.Elo})//broadcast to the other players in the room (host)
          })

          //this is all just to find the joinee opponent
          let clientIds = Array.from(room)//this will also include any room variables, be careful
          let hostAccountID = io.sockets.sockets.get(clientIds[0]).authorised.id
          exports.accountEvents["getUserData"](hostAccountID, (hostAccount) => {
            socket.emit("roomCode", {code: "joinedRoom", host: hostAccount.Username, hostElo: hostAccount.Elo})
          })
          //legacy code, fallback to this if there is a failiure
          //let rooms = Array.from(io.sockets.adapter.rooms)
          // for (let room of rooms) {
          //   if (room[0] == roomCode) {//find the current room
          //     let clientIds = Array.from(room[1])
          //     let hostAccountID = io.sockets.sockets.get(clientIds[0]).authorised.id//get the authorised account from the host socket (always index zero, because they created the room)
          //     exports.accountEvents["getUserData"](hostAccountID, (hostAccount) => {//give host details to client
          //       socket.emit("roomCode", {code: "joinedRoom", host: hostAccount.Username, hostElo: hostAccount.Elo})
          //     })
          //     break
          //   }
          // }
        } else {
          socket.emit("roomCode", {code: "roomFull"})
        }
      } else {
       socket.emit("roomCode", {code: "roomNoExist"})
      }
    } else {
      socket.emit("roomCode", {code: "noAuth"})
    }
  },
  "createRoom": function(data, io, socket) {
    if (socket.authorised != null) {//if they are signed in
      let roomCode = socket.id.substring(0, 6).toUpperCase()
      if (true) {//this should never be false, since the socketid is always unique
        //runningRooms[roomCode] = {name: "room_" + roomCode, ready: {player1: false, player2: false}, players: 1}
        socket.emit("roomCode", {code: "successfulCreation", room: roomCode})
        socket.join(roomCode)

        let room = io.sockets.adapter.rooms.get(roomCode)
        room.players = 1
      } else {
        socket.emit("roomCode", {code: "alreadyInRoom"})
      }
    } else {
      socket.emit("roomCode", {code: "noAuth"})
    }
  },
  "ready": function(data, io, socket) {
    if (socket.authorised != null) {//if they are signed in
      try {
        let roomCode = Array.from(socket.rooms)[1]
        let room = io.sockets.adapter.rooms.get(roomCode)
        room.ready[data.player] = true
      } catch (err) {
        //no room exists or room has disbanded
      }
    }
  },
  "deleteRoom": function(data, io, socket) {
    //this only works if they are the host
    let roomCode = socket.id.substring(0, 6).toUpperCase()
    //let rooms = Array.from(io.sockets.adapter.rooms)
    let room = io.sockets.adapter.rooms.get(roomCode)
    if (room) {
    //for (let room of rooms) {
    //  if (room[0] == roomCode) {//find the current room
        let clientIds = Array.from(room)
        socket.to(roomCode).emit("roomCode", {code: "opponentLeft"})
        socket.matchmake = false
        //try for the possible two residents of the room
        try {
          io.sockets.sockets.get(clientIds[0]).leave(roomCode)
          //console.log("1")
        } catch (err) {}
        try {
          io.sockets.sockets.get(clientIds[1]).leave(roomCode)
          //console.log("2")
        } catch (err) {}
        //break
      //}
    }
    //client code
    let roomsTheyHaveJoined = Array.from(socket.rooms)
    roomsTheyHaveJoined.shift()//remove the socketio default room of the same name as the socket id
    for (let room of roomsTheyHaveJoined) {
      console.log(room)
      socket.to(room).emit("roomCode", {code: "opponentLeft"})//broadcast to the others this one has left
      socket.leave(room)
    }
  },
  "characterSelectCode": function(data, io, socket) {
    //this only works if they are the host
    if (socket.authorised != null) {//if they are signed in
      try {
        let room = Array.from(socket.rooms)[1]
        socket.to(room).emit("characterSelectCode", data)
      } catch (err) {
        console.log(err)
      }
    }
  },
  "readyContinue": function(data, io, socket) {
    //this only works if they are the host
    if (socket.authorised != null) {//if they are signed in
      try {
        let room = Array.from(socket.rooms)[1]
        if (data.code == "start") {//choose a map
          let selection = [data.selection1, data.selection2][Math.floor(Math.random() * 2)]
          data.serverSelection = selection
        }
        io.to(room).emit("readyContinue", data)
      } catch (err) {
        console.log(err)
      }
    }
  },
  "levelSelectCode": function(data, io, socket) {
    //this only works if they are the host
    if (socket.authorised != null) {//if they are signed in
      try {
        let room = Array.from(socket.rooms)[1]
        socket.to(room).emit("levelSelectCode", data)
      } catch (err) {
        console.log("levelSelectError")
      }
    }
  },
  "availibleForRandom": function(data, io, socket) {
    if (socket.authorised != null) {//if they are signed in
      socket.matchmake = true
    }
  },
  "stopMatchmake": function(data, io, socket) {
    socket.matchmake = false
  }
}

exports.gameEvents = {
  "positionUpdate": function(data, io, socket) {
    try {
      let room = Array.from(socket.rooms)[1]
      socket.to(room).emit("positionUpdate", data)
    } catch (err) {
      console.log(err)
    }
  },
  "attackUpdate": function(data, io, socket) {
    try {
      let room = Array.from(socket.rooms)[1]
      socket.to(room).emit("attackUpdate", data)
    } catch (err) {
      console.log(err)
    }
  },
  "statusUpdate": function(data, io, socket) {
    try {
      let room = Array.from(socket.rooms)[1]
      socket.to(room).emit("statusUpdate", data)
    } catch (err) {
      console.log(err)
    }
  }
}
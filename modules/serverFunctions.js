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
                  //exports.accountEvents["signIn"](rec.ID, io, socket)//to sign them in at account creation
                  socket.accountCooldown.time = 10000
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
      if (Object.keys(runningRooms).includes(roomCode)) {
        if (runningRooms[roomCode].players < 2) {//if the room exists and there is space
          runningRooms[roomCode].players++
          socket.join(roomCode)

          //this is all just to find their opponent
          let rooms = Array.from(io.sockets.adapter.rooms)
          for (let room of rooms) {
            if (room[0] == roomCode) {//find the current room
              let clientIds = Array.from(room[1])
              let hostAccountID = io.sockets.sockets.get(clientIds[0]).authorised.id//get the authorised account from the host socket (always index zero, because they created the room)
              exports.accountEvents["getUserData"](hostAccountID, (hostAccount) => {
                socket.emit("roomCode", {code: "joinedRoom", opponent: hostAccount.Username})
              })
              break
            }
          }
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
      if (!Object.keys(runningRooms).includes(roomCode)) {//if the room doesnt Already exist
        runningRooms[roomCode] = {name: "room_" + roomCode, ready: {player1: false, player2: false}, players: 1}
        socket.emit("roomCode", {code: "successfulCreation", room: roomCode})
        socket.join(roomCode)
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
        let room = Array.from(socket.rooms)[1]
        runningRooms[roomCode].ready[data.player] = true
      } catch (err) {
        //no room exists or room has disbanded
      }
    }
  },
  "deleteRoom": function(data, io, socket) {
    //this only works if they are the host
    let roomCode = socket.id.substring(0, 6).toUpperCase()
    let rooms = Array.from(io.sockets.adapter.rooms)
    for (let room of rooms) {
      if (room[0] == roomCode) {//find the current room
        let clientIds = Array.from(room[1])
        socket.to(roomCode).emit("roomCode", {code: "opponentLeft"})
        //try for the possible two residents of the room
        try {
          io.sockets.sockets.get(clientIds[0]).leave(roomCode)
        } catch (err) {}
        try {
          io.sockets.sockets.get(clientIds[1]).leave(roomCode)
        } catch (err) {}
        break
      }
    }
    if (Object.keys(runningRooms).includes(roomCode)) {
      delete runningRooms[roomCode]
    }

    //client code
    let roomsTheyHaveJoined = Array.from(socket.rooms)
    roomsTheyHaveJoined.shift()//remove the socketio default room of the same name as the socket id
    for (let room of roomsTheyHaveJoined) {
      console.log(room)
      socket.to(room).emit("roomCode", {code: "opponentLeft"})//broadcast to the others this one has left
      delete runningRooms[room]
    }
  }
}

exports.gameEvents = {}
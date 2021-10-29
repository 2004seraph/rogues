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
  }
}

exports.matchMaking = {
  "joinRoom": function(data, io, socket) {
    if (socket.authorised != null) {//if they are signed in
      try {
        socket.join(data.room)
      } catch (err) {
        CLI.printLine("Join room error: " + err)
      }
    }
  },
  "createRoom": function(data, io, socket) {
    if (socket.authorised != null) {//if they are signed in
      socket.openRoom = true
    }
  }
}

exports.gameEvents = {}
"use strict";
exports.accountEvents = {
  "requestSignup": function(data, io, socket) {
    if (allowSignups) {
      let rUsername = data.username.toString().trim().toUpperCase()

      //allow names within the max length and only ascii characters, doesnt block spaces
      if (rUsername.length > GlobalServerInfo.username.min && rUsername.length < GlobalServerInfo.username.max && /^[\x00-\x7F]+$/.test(rUsername)) {
        PlayerDatabase.queryUsername(rUsername, function(rec) {
          if (rec == undefined) {//if there is no one with that username
            if (socket.accountCooldown.time == 0) {//if they are not in cooldown
              PlayerDatabase.addUser(rUsername, data.passwordHash, 1000, function() {
                PlayerDatabase.queryUsername(rUsername, function(rec) {
                  socket.emit("signupCode", {code: "successful", userID: rec.ID, autoLogin: true})
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
    PlayerDatabase.queryUsername(data.username.toString().toUpperCase(), function(rec) {
      if (rec) {//if that username exists
        PlayerDatabase.isOnline(rec.ID, function(status) {
          if (status == "false") {//if the requested account is offline
            if (data.passwordHash.length == 64 && rec.PasswordHash === data.passwordHash) {//password correct?
              if (socket.authorised != rec.ID) {//are they signing into an account theyve signed into (client bug)
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
    PlayerDatabase.queryUserID(data.ID, function(rec) {
      if (rec) {//if that id exists
        //if this socket is actually logged in to the account they want to query
        if (socket.authorised != null && socket.authorised == data.ID) {
          //only give them the essentials
          let userDataGrant = {
            Elo: rec.Elo,
            Data: rec.Data,
            Username: rec.Username
          }
          socket.emit("userDataCode", {code: "successful", userData: userDataGrant})
        } else {
          socket.emit("userDataCode", {code: "badAuth"})
          //HACKER!!!!!!! SOUND THE ALARM!!!!!!!!!!!!!!!!!!!!!!
          socket.emit("blocked", {code: "noAuthorisation"})
          socket.disconnect()
        }
      } else {
        //id does not exist
        socket.emit("userDataCode", {code: "badID"})
        //kill connection? malicious traffic?
        socket.emit("blocked", {code: "badUserID"})
        socket.disconnect()
      }
      updateLastRequest()
    })
  },
  "requestGameStatistics": function(data, io, socket) {
    //highscores and concurrent users
    PlayerDatabase.getRankings(0, 9, function(sel) {
      socket.emit("gameStatisticsCode", {code: "successful", onlineUsers: concurrentOnlineUsers, rankings: sel})
    })
  },
  "signOut": function(data, io, socket, callback=function() {}) {//NETWORKED/NON-NETWORKED FUNCTION
    if (data.ID == socket.authorised) {
      concurrentOnlineUsers--
      //remove who this connection identifies as
      socket.authorised = null
      PlayerDatabase.setOnlineStatus(data.ID, "false", function() {//sign them out
        callback()
      })
    } else {
      //HACKER
    }
  },
  "signIn": function(id, io, socket) {//NON NETWORKED FUNCTION
    PlayerDatabase.updateUserLoginDate(id, function() {//update last login
      PlayerDatabase.setOnlineStatus(id, "true", function() {//update online status
        //if they are already logged in, log them out -AND THEN sign them in
        if (socket.authorised != null) {
          exports.accountEvents["signOut"]({ID: socket.authorised}, io, socket, function() {
            concurrentOnlineUsers++
            socket.authorised = id//store who this connection identifies as
            
            socket.emit("loginCode", {code: "successful", userID: id})
            CLI.printLine(socket.id + " authenticated to ROGUESID[" + id + "]")
          })
        } else {
          concurrentOnlineUsers++
          socket.authorised = id//store who this connection identifies as
          
          socket.emit("loginCode", {code: "successful", userID: id})
          CLI.printLine(socket.id + " authenticated to ROGUESID[" + id + "]")
        }
      })
    })
  }
}

exports.gameEvents = {}
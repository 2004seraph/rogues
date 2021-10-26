"use strict";
exports.accountEvents = {
  "requestSignup": function(data, io, socket) {
    if (allowSignups) {
      let rUsername = data.username.toString().trim().toUpperCase()

      //allow names within the mx length and only ascii characters
      if (rUsername.length > GlobalServerInfo.username.min && rUsername.length < GlobalServerInfo.username.max && /^[\x00-\x7F]+$/.test(rUsername)) {
        PlayerDatabase.queryUsername(rUsername, function(rec) {
          if (rec == undefined) {//if there is no one with that username
            PlayerDatabase.addUser(rUsername, data.passwordHash, function() {
              PlayerDatabase.queryUsername(rUsername, function(rec) {
                socket.emit("signupCode", {code: "successful", userID: rec.ID, autoLogin: true})
              })
            })
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
        if (data.passwordHash.length == 64 && rec.PasswordHash === data.passwordHash) {
          PlayerDatabase.updateUserLoginDate(rec.ID, function() {
            socket.emit("loginCode", {code: "successful", userID: rec.ID})
            CLI.printLine(rec.ID.toString() + " logged in!")
            concurrentOnlineUsers++
            //store who this connection identifies as
            socket.authorised = rec.ID
          })
        } else {
          //wrong password
          socket.emit("loginCode", {code: "badpassword"})
        }
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
  "signOut": function(data, io, socket) {
    concurrentOnlineUsers--
    //store who this connection identifies as
    socket.authorised = null
  }
}

exports.gameEvents = {}
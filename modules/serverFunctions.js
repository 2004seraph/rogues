"use strict";
exports.accountEvents = {
  "requestSignup": function(data, io) {
    if (allowSignups) {
      let rUsername = data.username.toString().trim().toUpperCase()

      //allow names within the mx length and only ascii characters
      if (rUsername.length > GlobalServerInfo.username.min && rUsername.length < GlobalServerInfo.username.max && /^[\x00-\x7F]+$/.test(rUsername)) {
        PlayerDatabase.queryUsername(rUsername, function(rec) {
          if (rec == undefined) {//if there is no one with that username
            PlayerDatabase.addUser(rUsername, data.passwordHash, function() {
              PlayerDatabase.queryUsername(rUsername, function(rec) {
                io.emit("signupCode", {code: "successful", userID: rec.ID, autoLogin: true})
              })
            })
          } else {
            //username taken
            io.emit("signupCode", {code: "usernameTaken"})
          }
        })
      } else {
        //they have breached the username limits
        io.emit("signupCode", {code: "badUsername"})
      }
    }
  },
  "requestLogin": function(data, io) {
    PlayerDatabase.queryUsername(data.username.toString().toUpperCase(), function(rec) {
      if (rec) {//if that username exists
        if (data.passwordHash.length == 64 && rec.PasswordHash === data.passwordHash) {
          PlayerDatabase.updateUserLoginDate(rec.ID, function() {
            io.emit("loginCode", {code: "successful", userID: rec.ID})
            CLI.printLine(rec.ID.toString() + " logged in!")
          })
        } else {
          //wrong password
          io.emit("loginCode", {code: "badpassword"})
        }
      } else {
        //username does not exist
        io.emit("loginCode", {code: "badusername"})
      }
    })
  },
  "requestUserData": function(data, io) {
    PlayerDatabase.queryUserID(data.ID, function(rec) {
      if (rec) {//if that id exists
        io.emit("userDataCode", {code: "successful", userData: rec})
      } else {
        //id does not exist
        io.emit("userDataCode", {code: "badID"})
        //kill connection? malicious traffic?
      }
    })
  },
  "requestGameStatistics": function(data, io) {
    //highscores and concurrent users
  }
}

exports.gameEvents = {}
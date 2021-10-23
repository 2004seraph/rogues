"use strict";
exports.accountEvents = {
  "requestSignup": function(data, io) {
    if (allowSignups) {
      let rUsername = data.username.toString().trim()

      //allow names within the mx length and only ascii characters
      if (rUsername.length < process.env['usernameMaxLength'] && /^[\x00-\x7F]+$/.test(rUsername)) {
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
    PlayerDatabase.queryUsername(data.username, function(rec) {
      if (rec) {//if that username exists
        if (rec.PasswordHash == data.passwordHash) {
          PlayerDatabase.updateUserLoginDate(rec.ID, function() {
            io.emit("loginCode", {code: "successful", userID: rec.ID})
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
  }
}

exports.gameEvents = {}
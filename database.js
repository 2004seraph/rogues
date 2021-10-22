"use strict";
const sqlite3 = require('sqlite3').verbose()

//global.
//possible problem if this is async
var PlayerDatabase = new sqlite3.Database('PlayerDatabase.db')
PlayerDatabase.run("CREATE TABLE if not exists Players (ID INTEGER PRIMARY KEY autoincrement, JoinDate DEFAULT CURRENT_TIMESTAMP, Username char(12) DEFAULT player, PasswordHash char(30), Data TEXT DEFAULT '{}')", function(err) {
    if (err !== null) {
      console.log("Database Initialization Error:", err)
    } else {
      console.log("Loaded Database")
    }
  }
)

function addUser(username, passwordHash, callback=function() {}) {
  PlayerDatabase.run(`INSERT INTO Players(Username, PasswordHash) VALUES(?, ?)`, [username, passwordHash], function(err) {
    if (err) {
      console.log("Add User Error:", err)
    } else {
      console.log("Added Player", username, "To Database")
      callback()
    }
  })
}

function queryUsername(username, callback=function(rec) {}) {
  PlayerDatabase.get(`SELECT * FROM Players WHERE Username='${username}'`, function(err, record) {
    if (err) {
      console.log("Username Query Error:", err)
    } else {
      callback(record)
    }
  })
}
function queryUserID(userID, callback=function(rec) {}) {
  PlayerDatabase.get(`SELECT * FROM Players WHERE ID='${userID}'`, function(err, record) {
    if (err) {
      console.log("Username Query Error:", err)
    } else {
      callback(record)
    }
  })
}

global.printDatabase = function(callback=function(rec) {}) {
  PlayerDatabase.all(`SELECT * FROM Players`, function(err, record) {
    if (err) {
      console.log("Database Print Error:", err)
    } else {
      callback(record)
    }
  })
}
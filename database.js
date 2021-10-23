"use strict";
const sqlite3 = require('sqlite3').verbose()
var printLine = require("./console.js").printLine

module.exports = class PlayerDatabase {
  constructor(db='PlayerDatabase.db') {
    this.database = new sqlite3.Database(db)
  }

  initializeTable(callback=function() {}) {
    this.database.run("CREATE TABLE if not exists Players (ID INTEGER PRIMARY KEY autoincrement, JoinDate DEFAULT CURRENT_TIMESTAMP, Username char(12) DEFAULT player, PasswordHash char(30), Data TEXT DEFAULT '{}')", function(err) {
        if (err !== null) {
          printLine("Database Initialization Error:", err)
        } else {
          printLine("Loaded Database")
          callback()
        }
      }
    )
  }

  addUser(username, passwordHash, callback=function() {}) {
    this.database.run(`INSERT INTO Players(Username, PasswordHash) VALUES(?, ?)`, [username, passwordHash], function(err) {
      if (err) {
        printLine("Add User Error:", err)
      } else {
        printLine("Added Player", username, "To Database")
        callback()
      }
    })
  }

  queryUsername(username, callback=function(rec) {}) {
    this.database.get(`SELECT * FROM Players WHERE Username='${username}'`, function(err, record) {
      if (err) {
        printLine("Username Query Error:", err)
      } else {
        callback(record)
      }
    })
  }
  queryUserID(userID, callback=function(rec) {}) {
    this.database.get(`SELECT * FROM Players WHERE ID='${userID}'`, function(err, record) {
      if (err) {
        printLine("User ID Query Error:", err)
      } else {
        callback(record)
      }
    })
  }

  printDatabase(callback=function(rec) {}) {
    this.database.all(`SELECT * FROM Players`, function(err, record) {
      if (err) {
        printLine("Database Print Error:", err)
      } else {
        record.forEach((reci) => {
          callback(reci)
        })
      }
    })
  }
}
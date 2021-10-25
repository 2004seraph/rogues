"use strict";
const sqlite3 = require('sqlite3').verbose()

module.exports = class PlayerDatabase {
  constructor(db='./serverData/PlayerDatabase.db') {
    this.database = new sqlite3.Database(db)
  }

  initializeTable(callback=function() {}) {
    this.database.run("CREATE TABLE if not exists Players (ID INTEGER PRIMARY KEY autoincrement, JoinDate DEFAULT CURRENT_TIMESTAMP, Username char(12) DEFAULT player, PasswordHash char(30), LastLogin DEFAULT 'Never', Data TEXT DEFAULT '{}', Elo INT DEFAULT 1000)", function(err) {
        if (err !== null) {
          CLI.printLine("Database Initialization Error:")
          CLI.printLine(err)
        } else {
          CLI.printLine("Loaded Database")
          callback()
        }
      }
    )
  }

  deleteTable(callback=function() {}) {
    this.database.run(`DROP TABLE IF EXISTS Players`, function(err) {
      if (err) {
        CLI.printLine("Delete Table Error:")
        CLI.printLine(err)
      } else {
        CLI.printLine("Deleted Players Table")
        callback()
      }
    })
  }

  addUser(username, passwordHash, callback=function() {}) {
    let date = new Date()
    // Convert it to an ISO string
    let sqliteDate = date.toISOString().replace(/T/, ' ').replace(/\..+/, '')

    this.database.run(`INSERT INTO Players(Username, PasswordHash) VALUES(?, ?)`, [username, passwordHash], function(err) {
      if (err) {
        CLI.printLine("Add User Error:")
        CLI.printLine(err)
      } else {
        CLI.printLine("Added Player " + username.toString() + " To Database")
        callback()
      }
    })
  }

  updateUserLoginDate(userid, callback=function() {}) {
    let date = new Date()
    // Convert it to an ISO string
    let sqliteDate = date.toISOString().replace(/T/, ' ').replace(/\..+/, '')

    this.database.run(`UPDATE Players SET LastLogin=? WHERE ID=?`, [sqliteDate, userid], function(err) {
      if (err) {
        CLI.printLine("Login Date Update Error:")
        CLI.printLine(err)
      } else {
        callback()
      }
    })
  }

  removeUserID(id, callback=function() {}) {
    this.database.run(`DELETE FROM Players WHERE ID=?`, id, function(err) {
      if (err) {
        CLI.printLine("Remove User Error:")
        CLI.printLine(err)
      } else {
        CLI.printLine("Removed Player " + id.toString() + " From Database")
        callback()
      }
    })
  }

  queryUsername(username, callback=function(rec) {}) {
    this.database.get(`SELECT * FROM Players WHERE Username=?`, username, function(err, record) {
      if (err) {
        CLI.printLine("Username Query Error:")
        CLI.printLine(err)
      } else {
        if (record) {
          record.Data = JSON.parse(record.Data)
        }
        callback(record)
      }
    })
  }
  queryUserID(userID, callback=function(rec) {}) {
    this.database.get(`SELECT * FROM Players WHERE ID=?`, userID, function(err, record) {
      if (err) {
        CLI.printLine("User ID Query Error:")
        CLI.printLine(err)
      } else {
        if (record) {
          record.Data = JSON.parse(record.Data)
        }
        callback(record)
      }
    })
  }

  printDatabase(callback=function(rec) {}) {
    this.database.all(`SELECT * FROM Players`, function(err, record) {
      if (err) {
        CLI.printLine("Database Print Error:")
        CLI.printLine(err)
      } else {
        record.forEach((reci) => {
          reci.Data = JSON.parse(reci.Data)
          callback(reci)
        })
      }
    })
  }
}
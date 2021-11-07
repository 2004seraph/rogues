"use strict";
const sqlite3 = require('sqlite3').verbose()

module.exports = class PlayerDatabase {
  constructor(db='./serverData/PlayerDatabase.db') {
    this.database = new sqlite3.Database(db)
  }

  initializeTable(callback=function() {}) {
    this.database.run("CREATE TABLE if not exists Players (ID INTEGER PRIMARY KEY autoincrement, JoinDate DEFAULT CURRENT_TIMESTAMP, Username char(12) DEFAULT player, PasswordHash char(30), LastLogin DEFAULT 'Never', Data TEXT DEFAULT '{}', Elo INT DEFAULT 1000, Online TEXT DEFAULT 'false')", (err) => {
        if (err !== null) {
          CLI.printLine("Database Initialization Error:")
          CLI.printLine(err)
        } else {
          this.database.run(`UPDATE Players SET Online=?`, ["false"], function(err2) {//log out all players
            if (err2) {
              CLI.printLine("User Online Initialization Error:")
              CLI.printLine(err2)
            } else {
              CLI.printLine("Loaded Database")
              callback()
            }
          })
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

  resetUserData(callback=function() {}) {
    this.database.run(`UPDATE Players SET Data=?`, ['{}'], function(err) {
      if (err) {
        CLI.printLine("Reser User Data Error:")
        CLI.printLine(err)
      } else {
        callback()
      }
    })
  }

  resetUserElo(callback=function() {}) {
    this.database.run(`UPDATE Players SET Elo=?`, [1000], function(err) {
      if (err) {
        CLI.printLine("Reser User Elo Error:")
        CLI.printLine(err)
      } else {
        callback()
      }
    })
  }

  addUser(username, passwordHash, elo, callback=function() {}) {
    let date = new Date()
    // Convert it to an ISO string
    let sqliteDate = date.toISOString().replace(/T/, ' ').replace(/\..+/, '')

    this.database.run(`INSERT INTO Players(Username, PasswordHash, Elo) VALUES(?, ?, ?)`, [username, passwordHash, elo], function(err) {
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

  getRankings(first=0, last=10, callback=function(sel) {}) {
    this.database.all("SELECT Username, Elo FROM Players ORDER BY Elo DESC", (err, rows) => {
      if (err) {
        CLI.printLine("Ranking Query Error:")
        CLI.printLine(err)
      } else {
        let rowIndex = 0
        let selection = []
        rows.forEach((row) => {
          if (rowIndex >= first && rowIndex < last) {
            selection.push(row)
          }
          rowIndex++
        })

        //CLI.printLine(selection)
        callback(selection)
      }
    })
  }

  isOnline(userID, callback=function(req) {}) {
    this.database.get(`SELECT * FROM Players WHERE ID=?`, userID, function(err, record) {
      if (err) {
        CLI.printLine("Online Status Query Error:")
        CLI.printLine(err)
      } else {
        if (record) {
          callback(record.Online)
        } else {
          CLI.printLine("Online Status Query Error: Does not exist")
        }
      }
    })
  }
  setOnlineStatus(userID, status, callback=function() {}) {
    this.database.run(`UPDATE Players SET Online=? WHERE ID=?`, [status, userID], function(err) {
      if (err) {
        CLI.printLine("Online Status Update Error:")
        CLI.printLine(err)
      } else {
        callback()
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
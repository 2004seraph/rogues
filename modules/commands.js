"use strict";
//quality of life CLI for testing and basic management
exports.commands = {
  "motd": {
    "command": function(args) {
      let argString = ""
      for (let ele of args) {
        argString += " " + ele.toString()
      }
      GlobalServerInfo.motd = argString
    }
  },
  "stop": {
    "command": function(args) {
      CLI.printLine("shutdown server")
      process.exit(0)
    }
  },
  "census": {
    "command": function(args) {
      CLI.printLine("All Users:")
      PlayerDatabase.printDatabase(function(rec) {
        CLI.printLine(rec)
      })
    }
  },
  "user": {
    "command": function(args) {
      PlayerDatabase.addUser(args[0].toString().trim().toUpperCase(), sha256Hash(args[1]), args[2])
    }
  },
  "echo": {
    "command": function(args) {
      CLI.printLine(args)
    }
  },
  "nuke": {
    "command": function() {
      PlayerDatabase.deleteTable(function() {
        CLI.printLine("Rebuilding Table")
        PlayerDatabase.initializeTable(function() {
          PlayerDatabase.addUser("SAMMOT", sha256Hash("password"), 5000)
        })
        //log everyone out
        // let sockets = io.sockets.sockets
        // for (let socketId in sockets) {
        //   let s = sockets[socketId]
        //   accountEvents["signOut"](null, io, s)
        // }
        
      })
    }
  },
  "clearUserData":  {
    "command": function(args) {
      PlayerDatabase.resetUserData(function() {
        CLI.printLine("Cleared User Data")
      })
    }
  },
  "clearUserElo":  {
    "command": function(args) {
      PlayerDatabase.resetUserElo(function() {
        CLI.printLine("Reset User Elo")
      })
    }
  },
  "allowSignups": {
    "command": function(args) {
      if (args[0] == "false") {
        allowSignups = false
      } else {
        allowSignups = true
      }
      CLI.printLine("Set Signups to " + allowSignups)
    }
  },
  "users": {
    "command": function(args) {
      CLI.printLine("Users: " + concurrentUsers)
    }
  },
  "online": {
    "command": function(args) {
      CLI.printLine("Online Users: " + concurrentOnlineUsers)
    }
  },
  "evaluate": {
    "command": function(args) {
      try {
        let arbitraryCode = new Function (args[0])
        CLI.printLine(arbitraryCode())
      } catch (err) {
        CLI.printLine(err)
      }
    }
  },
  "limitUsers": {
    "command": function(args) {
      try {
        if (args.length == 0) {
          CLI.printLine("Connections are limited to " + connectionsLimit.toString())
        } else {
          connectionsLimit = parseInt(args[0])
          CLI.printLine("Limited connections to " + connectionsLimit.toString())
        }
      } catch (err) {
        CLI.printLine(err)
      }
    }
  },
  "detectSpam": {
    "command": function(args) {
      if (args.length == 0) {
        spamStop = true
      } else {
        spamStop = false
      }
      CLI.printLine("Set spam detection to: " + spamStop)
    }
  },
  "rankings": {
    "command": function(args) {
      //CLI.printLine(PlayerDatabase.getRankings())
    }
  },
  "removeUser": {
    "command": function(args) {
      PlayerDatabase.removeUserID(args[0])
    }
  }
}

const crypto = require('crypto')
const sha256Hash = function(message) {
  const sha256HashObject = crypto.createHash('sha256')
  sha256HashObject.update(message)
  return sha256HashObject.digest("hex")
}
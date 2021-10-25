"use strict";
//quality of life CLI for testing and basic management
exports.commands = {
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
      PlayerDatabase.addUser(args[0], sha256Hash(args[1]))
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
        PlayerDatabase.initializeTable()
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
      CLI.printLine("Online Users: " + concurrentUsers)
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
  }
}

const crypto = require('crypto')
const sha256Hash = function(message) {
  const sha256HashObject = crypto.createHash('sha256')
  sha256HashObject.update(message)
  return sha256HashObject.digest("hex")
}
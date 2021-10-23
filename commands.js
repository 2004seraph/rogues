"use strict";
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
      PlayerDatabase.addUser(args[0], args[1])
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
  }
}
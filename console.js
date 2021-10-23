"use strict";
const readline = require('readline')

const printLine = function(...args) {
  console.log("\n" + JSON.stringify(args).replace('"','').replace('[','').replace(']','').replace('"',''))
}

exports.printLine = printLine

exports.cli = class CLI {
  constructor(commands={}) {
    this.commands = commands
    this.consoleInput = readline.createInterface(process.stdin, process.stdout)
    this.consoleInput.setPrompt('Rogues-Server> ')
    this.consoleInput.on('line', (line) => {
      this.lineReader(line)
    })

    this.locked = true
  }

  lineReader(line) {
    let commandNames = Object.keys(this.commands)
    let ran = false
    var lineArguments = line.split(" ")

    for (let name of commandNames) {
      if (lineArguments[0].toUpperCase() == name.toUpperCase()) {
        lineArguments.shift()
        this.commands[name].command(lineArguments)
        ran = true
      } else {
        for (let alias of this.commands[name].aliases) {
          if (lineArguments[0].toUpperCase() == alias.toUpperCase()) {
            lineArguments.shift()
            this.commands[name].command(lineArguments)
            ran = true
          }
        }
      }
    }
    if (!ran && line != "") {
      printLine("Invalid Rogues-Server command")
    }

    this.prompt()
  }

  prompt() {
    if (!this.locked) {
      this.consoleInput.prompt()
    }
  }
}

printLine("Loaded CLI")
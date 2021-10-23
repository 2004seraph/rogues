"use strict";
const readline = require('readline')

exports.cli = class CLI {
  constructor(commands={}, prompt="Rogues-Server> ") {
    this.commands = commands
    this.wordPrompt = prompt
    this.consoleInput = readline.createInterface(process.stdin, process.stdout)
    this.consoleInput.setPrompt(this.wordPrompt)
    this.consoleInput.on('line', (line) => {
      this.lineReader(line)
    })

    this.locked = false

    this.printLine("Loaded CLI")
  }

  lineReader(line) {
    let commandNames = Object.keys(this.commands)
    let ran = false
    let lineArguments = line.split(" ")

    for (let name of commandNames) {
      if (lineArguments[0].toUpperCase() == name.toUpperCase()) {
        lineArguments.shift()
        this.commands[name].command(lineArguments)
        ran = true//if error
        break
      }
    }
    if (!ran && line != "") {
      this.printLine("Invalid Rogues-Server command")
    }
    //infinite CLI prompt
    this.prompt()
  }

  prompt() {
    if (!this.locked) {
      this.consoleInput.prompt()
    }
  }

  printLine(args) {
    this.consoleInput.pause()
    this.prompt(false)
    console.log(args)
    this.prompt()
    this.consoleInput.resume()
  }
}

      //alias code - might be broken
      // else {
      //   for (let alias of this.commands[name].aliases) {
      //     if (lineArguments[0].toUpperCase() == alias.toUpperCase()) {
      //       lineArguments.shift()
      //       this.commands[name].command(lineArguments)
      //       ran = true
      //     }
      //   }
      // }

          // this.consoleInput.pause()
    // this.consoleInput.write(args)
    // this.consoleInput.write("\n")
    // this.consoleInput.resume()
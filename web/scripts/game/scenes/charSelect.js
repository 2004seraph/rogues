"use strict";
loadScenes.charScene = function() {
  ScenesManager.scenes[CHARACTERSELECT] = {
    preCompute: function() {
      this.readyStar = ASSETS.namedImages.starEmbelum
      this.unreadyStar = ASSETS.namedImages.starEmbelum.tint(0, 80, 0)

      this.playerCard = 200
      this.playerCardheight = 230
      this.cardSpacing = 60
      this.amountOfCharacters = Object.keys(characters).length

      this.screendivider = 100
    },
    start: function() {
      let cornerWidth = 240
      gameButtons.back = createButton("Back")
        .parent('P5Container')
        .position(10, 10)
        .size(cornerWidth, 50)
        .mousePressed(() => {
          ScenesManager.changeScene(MAINMENU, mainInterfaceSpeed)
      })
      gameButtons.continueSelection = createButton("Continue")
        .parent('P5Container')
        .position(CANX - cornerWidth - 10, 10)
        .size(cornerWidth, 50)
        .mousePressed(() => {
          if (ScenesManager.scenes[CHARACTERSELECT].selection.player1 !== null && ScenesManager.scenes[CHARACTERSELECT].selection.player2 !== null) {
            ScenesManager.changeScene(LEVELSELECT, mainInterfaceSpeed)
          }
      })

      let resetWidth = 400
      gameButtons.resetSelection = createButton("Reset Selection")
        .parent('P5Container')
        .position(CANX/2 - resetWidth/2, 10)
        .size(resetWidth, 50)
        .mousePressed(() => {
          if (ScenesManager.scenes[CHARACTERSELECT].selection.player1 !== null) {
            ScenesManager.scenes[CHARACTERSELECT].selection.player1 = null
            ScenesManager.scenes[CHARACTERSELECT].selection.player2 = null
          }
      })

      for (let i = 0; i < this.amountOfCharacters; i++) {
        let x = CANX/2 - (this.amountOfCharacters/2) * this.playerCard + i * (this.playerCard + this.cardSpacing) - this.cardSpacing/2
        let y = 140

        gameButtons[("characterSelect" + (i).toString())] = createButton(i)
        .parent('P5Container')
        .position(x, y)
        .size(this.playerCard, this.playerCardheight)
        .mousePressed(() => {
          if (ScenesManager.scenes[CHARACTERSELECT].selection.player1 === null) {
            ScenesManager.scenes[CHARACTERSELECT].selection.player1 = i
          } else {
            if (ScenesManager.scenes[CHARACTERSELECT].selection.player2 === null) {
              ScenesManager.scenes[CHARACTERSELECT].selection.player2 = i
            }
          }
        })
      }
    },
    showStats: function(char, x, y) {
      let seperation = (CANX/2 - 20)/2

      let nameString = characters[char].name
      fill(255)
      text(nameString, x + seperation - textWidth(nameString)/2, y)

      let statsObject = {
        "Size:": Math.floor((characters[char].dimensions.width * characters[char].dimensions.height) / 10).toString(),
        "Weight:": (Math.floor(characters[char].physics.mass * characters[char].physics.maxFallSpeed)).toString(),
        "Speed:": (Math.floor((characters[char].physics.maxSpeedLR) * (characters[char].physics.acceleration))).toString(),
        "Jumps:": characters[char].physics.totalJumps.toString(),
        "Power:": "-",
        "Defense:": characters[char].game.defence.toString()
      }
      fill(0)
      let statKeys = Object.keys(statsObject)
      let t = 30
      for (let i = 0; i < statKeys.length; i++) {
        text(statKeys[i], x + 10, y + 10 + t * i + t)
        text(statsObject[statKeys[i]], x + 10 + seperation, y + 10 + t * i + t)
      }
    },
    run: function() {
      background(0)
      image(ASSETS.namedImages.characterSelect, 0, 0, CANX, CANY)
      
      //selected characters
      fill(100)
      let x = 10
      let y = CANY/2 + this.screendivider
      rect(x, y, CANX/2 - 20, CANY/2 - 10 - this.screendivider)
      if (this.selection.player1 !== null) {
        this.showStats(this.selection.player1, x, y)
      }

      fill(100)
      x = CANX/2 + 10
      rect(x, y, CANX/2 - 20, CANY/2 - 10 - this.screendivider)
      if (this.selection.player2 !== null) {
        this.showStats(this.selection.player2, x, y)
      }

      //character selection
      for (let i = 0; i < this.amountOfCharacters; i++) {
        x = CANX/2 - (this.amountOfCharacters/2) * this.playerCard + i * (this.playerCard + this.cardSpacing) - this.cardSpacing/2
        y = 140

        let extra = 12
        if (this.selection.player1 === i) {
          fill(0, 255, 255)
          rect(x - extra*2, y - extra*2, this.playerCard + extra * 4, this.playerCardheight + extra * 4)
          push()
          textAlign(LEFT, BOTTOM)
          text("Player 1", x, y - extra*2 - 2)
          pop()
        }
        if (this.selection.player2 === i) {
          fill(255, 0, 255)
          rect(x - extra, y - extra, this.playerCard + extra * 2, this.playerCardheight + extra * 2)
          push()
          textAlign(LEFT, TOP)
          text("Player 2", x, y + this.playerCardheight + extra*2)
          pop()
        }

        push()
        fill(0, 0, 255, 80)
        stroke(255)
        strokeWeight(1)
        rect(x, y, this.playerCard, this.playerCardheight)
        image(ASSETS.characterImages[characters[i].profilePicture], x, y)
        fill(255)
        text(characters[i].name, x, this.playerCardheight)
        pop()
      }

      //embelum
      push()
      imageMode(CENTER, CENTER)
      image(this.readyStar, CANX/2, CANY/2 + this.screendivider)
      pop()

      if (keyIsDown(27)) {
        this.selection.player2 = null
        this.selection.player1 = null
      }
    },
    selection: {
      player1: null,
      player2: null
    }
  }
}
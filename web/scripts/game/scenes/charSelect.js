"use strict";
loadScenes.charScene = function() {
  ScenesManager.scenes[CHARACTERSELECT] = {
    preCompute: function() {
      this.readyStar = ASSETS.namedImages.starEmbelum
      this.unreadyStar = ASSETS.namedImages.starEmbelum.tint(0, 80, 0)

      this.playerCard = 180
      this.playerCardheight = 200
      this.cardSpacing = 60
      this.amountOfCharacters = Object.keys(characters).length

      this.screendivider = 100
    },
    start: function() {
      particleSystems.charBoxes = new ParticleSystem(0, 0)
      for (let i = 0; i < 300; i++) {
        let charBoxesParameters = {
          width: Math.random() * 5 + 1,
          speed: Math.random() * 3,
          color: 180 + Math.random() * 180,
        }
        let charBoxesDisplay = function(worldPosition) {
          push()
          colorMode(HSB)
          fill(this.parameters.color, 80, 255)
          noStroke()
          rect(worldPosition.x + this.pos.x, worldPosition.y + this.pos.y, this.parameters.width, this.parameters.width)
          pop()
        }
        let charBoxesUpdate = function(worldPosition) {
          this.pos.y -= this.parameters.speed
        }
        let charBoxesDestroy = function() {
          if (collideRectRect(this.pos.x, this.pos.y, this.parameters.width, this.parameters.width, 0, 0, CANX, CANY)) {
            return false
          } else {
            this.pos = {
              x: this.pos.x,
              y: CANY - 0.01
            }
          }
        }
        particleSystems.charBoxes.addParticle(Math.random() * CANX, Math.random() * CANY, {destroyFunction: charBoxesDestroy, displayFunction: charBoxesDisplay, updateFunction: charBoxesUpdate, parameters: charBoxesParameters})
      }
      
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
        .attribute("disabled", "")
        .mousePressed(() => {
          if (this.selection.player1 !== null && this.selection.player2 !== null) {
            ScenesManager.changeScene(LEVELSELECT, mainInterfaceSpeed)
          }
      })

      let resetWidth = 400
      gameButtons.resetSelection = createButton("Reset Selection")
        .parent('P5Container')
        .position(CANX/2 - resetWidth/2, 10)
        .size(resetWidth, 50)
        .attribute("disabled", "")
        .mousePressed(() => {
          if (this.selection.player1 !== null) {
            this.selection.player1 = null
            this.selection.player2 = null
          }
      })

      for (let i = 0; i < this.amountOfCharacters; i++) {
        let x = CANX/2 - (this.amountOfCharacters/2) * this.playerCard + i * (this.playerCard + this.cardSpacing) - ((this.amountOfCharacters != 1) ? this.cardSpacing/2 : 0)
        let y = 140

        gameButtons[("characterSelect" + (i).toString())] = createButton("")
        .parent('P5Container')
        .position(x, y)
        .class("characterChoose")
        .size(this.playerCard, this.playerCardheight)
        .style("background-image: url(assets/characters/" + (i + 1).toString() + "/preview.png), linear-gradient(rgb(75, 0, 173), rgb(255, 0, 212));")
        .mousePressed(() => {
          if (this.selection.player1 === null) {
            this.selection.player1 = i
          } else {
            if (this.selection.player2 === null) {
              this.selection.player2 = i
            }
          }
        })
        gameButtons.chartitle = createDiv(characters[i].name)
          .parent(gameButtons[("characterSelect" + (i).toString())])
          .style("position: absolute; bottom: 0")
      }
    },
    showStats: function(char, x, y, p) {
      let spacing = ScenesManager.scenes[MAINMENU].spacing
      let heightMult = ScenesManager.scenes[MAINMENU].heightMult

      push()
      textAlign(CENTER, TOP)
      let seperation = (CANX/2 - 20)/2

      let nameString = characters[char].name
      fill(0, 255, 255)
      text("Player " + p + ": " + nameString, x + seperation, y + spacing)
      
      textAlign(LEFT, TOP)
      let statsObject = {
        "Size:": Math.floor((characters[char].dimensions.width * characters[char].dimensions.height) / 10).toString(),
        "Weight:": (Math.floor(characters[char].physics.mass * characters[char].physics.maxFallSpeed)).toString(),
        "Speed:": (Math.floor((characters[char].physics.maxSpeedLR) * (characters[char].physics.acceleration))).toString(),
        "Jumps:": characters[char].physics.totalJumps.toString(),
        "Power:": "-",
        "Defense:": characters[char].game.defence.toString()
      }
      fill(255)
      let statKeys = Object.keys(statsObject)
      let t = 30
      for (let i = 0; i < statKeys.length; i++) {
        text(statKeys[i], x + spacing, y + t * i + t + spacing*2)
        text(statsObject[statKeys[i]], x + spacing + seperation, y + t * i + t + spacing*2)
      }
      pop()
    },
    run: function() {
      if (this.selection.player1 !== null) {
        gameButtons.resetSelection.removeAttribute("disabled")
      } else {
        gameButtons.resetSelection.attribute("disabled", "")
      }
      if (this.selection.player1 !== null && this.selection.player2 !== null) {
        gameButtons.continueSelection.removeAttribute("disabled")
      } else {
        gameButtons.continueSelection.attribute("disabled", "")
      }
      background(0)
      updateParticleSystems()
      image(ASSETS.namedImages.characterSelect, 0, 0, CANX, CANY)
      
      //selected characters
      fill(55, 0, 55, 195)
      stroke(0, 255, 255)
      strokeWeight(2)
      let x = 10
      let y = CANY/2 + this.screendivider
      rect(x, y, CANX/2 - 20, CANY/2 - 10 - this.screendivider)
      if (this.selection.player1 !== null) {
        this.showStats(this.selection.player1, x, y, "one")
      }
      x = CANX/2 + 10
      rect(x, y, CANX/2 - 20, CANY/2 - 10 - this.screendivider)
      if (this.selection.player2 !== null) {
        this.showStats(this.selection.player2, x, y, "two")
      }

      //character selection
      for (let i = 0; i < this.amountOfCharacters; i++) {
        let x = CANX/2 - (this.amountOfCharacters/2) * this.playerCard + i * (this.playerCard + this.cardSpacing) - ((this.amountOfCharacters != 1) ? this.cardSpacing/2 : 0)
        let y = 140

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
        //image(ASSETS.characterImages[characters[i].profilePicture], x, y)
        //fill(255)
        //text(characters[i].name, x, this.playerCardheight)
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
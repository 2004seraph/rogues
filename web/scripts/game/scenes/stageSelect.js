"use strict";
loadScenes.stageScene = function() {
  ScenesManager.scenes[LEVELSELECT] = {
    preCompute: function() {
      this.playerCard = 180
      this.playerCardheight = 200
      this.cardSpacing = 60
      this.amountOfLevels = Object.keys(levels).length

      this.screendivider = 100
    },

    start: function() {
      this.stageSelection = {
        player1: null,
        player2: null
      }
      this.selection = null
      
      let cornerWidth = 240
      gameButtons.back = createButton("Back")
        .parent('P5Container')
        .position(10, 10)
        .size(cornerWidth, 50)
        .mousePressed(() => {
          doSound("back")
          if (playingOnline) {
            socket.emit("readyContinue", {code: "char"})
          } else {
            ScenesManager.changeScene(CHARACTERSELECT, mainInterfaceSpeed)
          }
      })
      gameButtons.continueSelection = createButton("Continue")
        .parent('P5Container')
        .attribute("disabled", "")
        .position(CANX - cornerWidth - 10, 10)
        .size(cornerWidth, 50)
        .mousePressed(() => {
          if (this.stageSelection.player1 !== null && this.stageSelection.player2 !== null) {
            if (!playingOnline) {
              this.selection = [this.stageSelection.player1, this.stageSelection.player2][Math.floor(Math.random() * 2)]
              ScenesManager.changeScene(GAME, mainInterfaceSpeed * 7)
            } else {
              socket.emit("readyContinue", {code: "start", selection1: this.stageSelection.player1, selection2: this.stageSelection.player2})
            }
            doSound("click")
          }
      })

      let resetWidth = 400
      gameButtons.resetSelection = createButton("Reset Selection")
        .parent('P5Container')
        .attribute("disabled", "")
        .position(CANX/2 - resetWidth/2, 10)
        .size(resetWidth, 50)
        .mousePressed(() => {
          if (this.stageSelection.player1 !== null) {
            this.stageSelection.player1 = null
            if (!playingOnline) {
              this.stageSelection.player2 = null
            } else {
              socket.emit("levelSelectCode", {stage: null})
            }
            doSound("click")
          }
      })

      for (let i = 0; i < this.amountOfLevels; i++) {
        let x = CANX/2 - (this.amountOfLevels/2) * this.playerCard + i * (this.playerCard + this.cardSpacing) - this.cardSpacing
        let y = 140

        gameButtons[("levelSelect" + (i).toString())] = createButton("")
        .parent('P5Container')
        .position(x, y)
        .class("characterChoose")
        .size(this.playerCard, this.playerCardheight)
        .style("background-image: url(assets/levels/" + (i + 1).toString() + "/preview.png), linear-gradient(rgb(75, 0, 173), rgb(255, 0, 212));")
        .style("image-rendering: auto;")
        .mousePressed(() => {
          if (this.stageSelection.player1 === null) {
            this.stageSelection.player1 = i
            doSound("choose")
            if (playingOnline) {
              socket.emit("levelSelectCode", {stage: i})
            }
          } else {
            if (this.stageSelection.player2 === null && !playingOnline) {
              this.stageSelection.player2 = i
              doSound("choose")
            }
          }
        })
        gameButtons.leveltitle = createDiv(levels[i].name)
          .parent(gameButtons[("levelSelect" + (i).toString())])
          .style("position: absolute; bottom: 0")
      }
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
    },
    run: function() {
      if (!(currentPacket == null) && playingOnline) {
        switch (currentPacket.name) {
          case "roomCode":
            switch (currentPacket.data.code) {
              case "opponentLeft":
                ScenesManager.changeScene(MAINMENU, mainInterfaceSpeed)//leave room
                break
            }
            resetPacket()
            break
          case "levelSelectCode":
            this.stageSelection.player2 = currentPacket.data.stage
            resetPacket()
            break
          case "readyContinue":
            switch (currentPacket.data.code) {
              case "start":
                this.selection = currentPacket.data.serverSelection
                ScenesManager.changeScene(GAME, mainInterfaceSpeed)
                break
              case "char":
                ScenesManager.changeScene(CHARACTERSELECT, mainInterfaceSpeed)
                break
            }
            resetPacket()
            break
        }
      }

      if (this.stageSelection.player1 !== null) {
        gameButtons.resetSelection.removeAttribute("disabled")
      } else {
        gameButtons.resetSelection.attribute("disabled", "")
      }
      if (this.stageSelection.player1 !== null && this.stageSelection.player2 !== null) {
        gameButtons.continueSelection.removeAttribute("disabled")
      } else {
        gameButtons.continueSelection.attribute("disabled", "")
      }

      if (!ScenesManager.transition.transitioning) {
        background(0)
      }
      updateParticleSystems()
      image(ASSETS.namedImages.characterSelect, 0, 0, CANX, CANY)

      for (let i = 0; i < this.amountOfLevels; i++) {
        let x = CANX/2 - (this.amountOfLevels/2) * this.playerCard + i * (this.playerCard + this.cardSpacing) - this.cardSpacing
        let y = 140
        let extra = 12
        if (this.stageSelection.player1 === i) {
          fill(0, 255, 255)
          rect(x - extra*2, y - extra*2, this.playerCard + extra * 4, this.playerCardheight + extra * 4)
          push()
          textAlign(LEFT, BOTTOM)
          text("Player 1", x, y - extra*2 - 2)
          pop()
        }
        if (this.stageSelection.player2 === i) {
          fill(255, 0, 255)
          rect(x - extra, y - extra, this.playerCard + extra * 2, this.playerCardheight + extra * 2)
          push()
          textAlign(LEFT, TOP)
          text("Player 2", x, y + this.playerCardheight + extra*3)
          pop()
        }
      }
    },
    stageSelection: {
      player1: null,
      player2: null
    },
    selection: null
  }
}
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
          ScenesManager.changeScene(CHARACTERSELECT, mainInterfaceSpeed)
      })
      gameButtons.continueSelection = createButton("Continue")
        .parent('P5Container')
        .attribute("disabled", "")
        .position(CANX - cornerWidth - 10, 10)
        .size(cornerWidth, 50)
        .mousePressed(() => {
          if (this.stageSelection.player1 !== null && this.stageSelection.player2 !== null) {
            this.selection = [this.stageSelection.player1, this.stageSelection.player2][Math.floor(Math.random() * 2)]
            console.log(this.selection)
            ScenesManager.changeScene(GAME, mainInterfaceSpeed)
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
            this.stageSelection.player2 = null
          }
      })

      for (let i = 0; i < this.amountOfLevels; i++) {
        let x = CANX/2 - (this.amountOfLevels/2) * this.playerCard + i * (this.playerCard + this.cardSpacing) - this.cardSpacing/2
        let y = 140

        gameButtons[("levelSelect" + (i).toString())] = createButton("")
        .parent('P5Container')
        .position(x, y)
        .class("characterChoose")
        .size(this.playerCard, this.playerCardheight)
        .style("background-image: url(assets/levels/" + (i + 1).toString() + "/preview.png), linear-gradient(rgb(75, 0, 173), rgb(255, 0, 212));")
        .mousePressed(() => {
          if (this.stageSelection.player1 === null) {
            this.stageSelection.player1 = i
          } else {
            if (this.stageSelection.player2 === null) {
              this.stageSelection.player2 = i
            }
          }
        })
        gameButtons.leveltitle = createDiv(levels[i].name)
          .parent(gameButtons[("levelSelect" + (i).toString())])
          .style("position: absolute; bottom: 0")
      }
    },
    run: function() {
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
      background(0)
    },
    stageSelection: {
      player1: null,
      player2: null
    },
    selection: null
  }
}
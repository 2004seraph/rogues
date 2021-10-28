"use strict";
loadScenes.gameScene = function() {
  ScenesManager.scenes[GAME] = {
    start: function() {
      initialiseLevel(ScenesManager.scenes[LEVELSELECT].selection, ScenesManager.scenes[CHARACTERSELECT].selection.player1, ScenesManager.scenes[CHARACTERSELECT].selection.player2)

      //reset some things
      this.parallax = {x: 0, y: 0}
      this.gameOver = null
      this.gameOverStuff = []
    },
    run: function() {
      background(100)
      if (dynamicCamera) {cameraTrack()}
      
      let playerParallax = {x: (isNaN(CANX/2 - averagePlayerPosition().x) != true) ? (CANX/2 - averagePlayerPosition().x) : 0, y: (isNaN(CANY/2 - averagePlayerPosition().y) != true) ? (CANY/2 - averagePlayerPosition().y) : 0}

      let speed = 0.5
      this.parallax.x += (playerParallax.x - this.parallax.x)/(1/speed)
      this.parallax.y += (playerParallax.y - this.parallax.y)/(1/speed)

      let currentStage = gameState.currentLevel
      if (currentStage.images[1] != null) {
        image(ASSETS.levelImages[currentStage.images[1]], 0 + this.parallax.x/(PARRALAX*1.15) - ((CANX * 1.5) - CANX)/2, 0 + this.parallax.y/(PARRALAX*1.15) - ((CANY * 1.5) - CANY)/2, CANX * 1.5, CANY * 1.5)
      }
      if (currentStage.images[2] != null) {
        image(ASSETS.levelImages[currentStage.images[2]], 0 + this.parallax.x/(PARRALAX*2.5), 0 + this.parallax.y/(PARRALAX*2.5), CANX, CANY)
      }
      if (currentStage.images[3] != null) {
        image(ASSETS.levelImages[currentStage.images[3]], 0, 0, CANX, CANY)
      }

      //DEBUG
      if (showColliders) {
        for (let collider of gameState.levelColliders) {
          collider.debug()
        }
      }

      let index = 0
      let totalPlayers = Object.keys(gameState.players).length

      for (let player in gameState.players) {
        let p = gameState.players[player]
        p.show()
        if (this.gameOver == null) {//FREEZE THE GAME WHEN ITS OVER
          p.update()
        }
        
        //if they are in the death zone
        //the lose condition only runs if the player is outside the bounds, this is risky
        if (!collideRectRect(p.pos.x, p.pos.y, p.character.dimensions.width, p.character.dimensions.height, -100, -100, CANX + 200, CANY + 200)) {
          // console.log(player + " is out")
          // p.death()
          if (p.death()) {
            switch (player) {
              case "one":
                this.gameOver = {lost: player, won: "two"}
                break
              case "two":
                this.gameOver = {lost: player, won: "one"}
                break
            }
            this.createGameOverButtons()
          }
        }

        //GAMER TAGS
        push()
        fill(255)
        textSize(20)
        let gamerTagText = (index + 1).toString()
        let arrow = "▼"

        if (relativeGamerTagHeights) {
          let relativeTagHeight = 30
          text(gamerTagText, p.pos.x + (p.character.dimensions.width) / 2 - textWidth(gamerTagText) / 2, p.pos.y - relativeTagHeight - textAscent() - 1)

          textFont("Arial")
          text(arrow, p.pos.x + (p.character.dimensions.width) / 2 - textWidth(arrow) / 2, p.pos.y - relativeTagHeight)
        } else {
          text(gamerTagText, p.pos.x + (p.character.dimensions.width) / 2 - textWidth(gamerTagText) / 2, p.pos.y - (GAMERTAGHEIGHT - p.character.dimensions.height) - textAscent())

          textFont("Arial")
          text(arrow, p.pos.x + (p.character.dimensions.width) / 2 - textWidth(arrow) / 2, p.pos.y - (GAMERTAGHEIGHT - p.character.dimensions.height))
        }
        pop()
        
        this.drawDamageBox(CANX / totalPlayers * index + (CANX / totalPlayers)/2, CANY - 100, p)
        index++
      }

      if (this.gameOver != null) {
        this.gameOverScreen()
      }
    },
    parallax: {x: 0, y: 0},
    gameOver: null,
    gameOverStuff: [],
    createGameOverButtons: function() {
      let width = CANX/3
      let height = CANY/3
      let spacing = ScenesManager.scenes[MAINMENU].spacing
      let heightMult = ScenesManager.scenes[MAINMENU].heightMult

      let buttonSize = 300
      let bHeight = buttonSize * heightMult

      this.gameOverStuff.timeLevel = 100
      this.gameOverStuff.cameraTime = 100
      this.gameOverStuff.showDelay = this.gameOverStuff.timeLevel
      this.gameOverStuff.inBoxSize = {
        x: CANX - 0.1,
        y: CANY - 0.1
      }

      gameButtons.rematch = createButton('Rematch')
        .parent('P5Container')
        .size(buttonSize, bHeight)
        .position(CANX/2 - buttonSize/2, CANY/2 - spacing/2)
        .mousePressed(() => {
          ScenesManager.changeScene(CHARACTERSELECT, mainInterfaceSpeed)
        })
        .hide()
      gameButtons.back = createButton('Exit')
        .parent('P5Container')
        .size(buttonSize, bHeight)
        .position(CANX/2 - buttonSize/2, CANY/2 + spacing/2 + bHeight)
        .mousePressed(() => {
          ScenesManager.changeScene(MAINMENU, mainInterfaceSpeed)
          ScenesManager.scenes[CHARACTERSELECT].selection = {
          player1: null,
          player2: null
        }
        })
        .hide()
      
    },
    gameOverScreen: function() {
      let width = CANX/3
      let height = CANY/2.5
      let spacing = ScenesManager.scenes[MAINMENU].spacing
      let heightMult = ScenesManager.scenes[MAINMENU].heightMult

      push()
      resetGameMatrix()
      noStroke()
      rectMode(CENTER, CENTER)
      textAlign(CENTER, TOP)
      if (this.gameOverStuff.cameraTime > 0) {
        this.gameOverStuff.cameraTime--
      } else {
        this.gameOverStuff.showDelay--
        if (this.gameOverStuff.showDelay > 0) {
          let speed = map(this.gameOverStuff.showDelay, 0, this.gameOverStuff.timeLevel, 1, 4)
          this.gameOverStuff.inBoxSize.x += (map(this.gameOverStuff.showDelay, this.gameOverStuff.timeLevel, 0, CANX, width) - this.gameOverStuff.inBoxSize.x) / speed
          this.gameOverStuff.inBoxSize.y += (map(this.gameOverStuff.showDelay, this.gameOverStuff.timeLevel, 0, CANY, height) - this.gameOverStuff.inBoxSize.y) / speed
          fill(180, 0, 255, map(this.gameOverStuff.showDelay, this.gameOverStuff.timeLevel, 0, 0, 180))
          if (frameCount % 2 == 0) {
            rect(CANX/2, CANY/2, this.gameOverStuff.inBoxSize.x, this.gameOverStuff.inBoxSize.y)
          }
        } else {
          fill(180, 0, 255, 180)
          stroke(255)
          rect(CANX/2, CANY/2, width, height)
          if (this.gameOverStuff.showDelay < -50) {
            fill(0, 255, 255, 255)
            text("GAME OVER", CANX/2, CANY/2 - height/2 + spacing)
          }
          if (this.gameOverStuff.showDelay < -75) {
            text("PLAYER " + this.gameOver.won + "\nhas won", CANX/2, CANY/2 - height/4 - spacing)
          }
          if (this.gameOverStuff.showDelay < -100) {
            gameButtons.rematch.show()
          }
          if (this.gameOverStuff.showDelay < -125) {
            gameButtons.back.show()
          }
        }
      }
      pop()
    },
    drawDamageBox: function(x, y, player) {
      push()
      resetGameMatrix()
      textSize(20)
      let location = {x: x - 100, y: y, w: 200, h: 70}

      strokeWeight(3)
      stroke(255)
      fill(0, 0, 60, 180)
      rect(location.x, location.y, location.w, location.h)
      textAlign(RIGHT, TOP)
      fill(0, 255, 255, 255)
      noStroke()
      text(player.damage.toString() + "% DMG", location.x + location.w - 10, location.y + 10)
      if (player.lives > 0) {
        text(player.lives.toString() + " Lives", location.x + location.w - 10, location.y + 35)
      } else {
        text("Dead", location.x + location.w - 10, location.y + 35)
      }
      strokeWeight(3)
      stroke(255)
      fill(0, 0, 0, 255)
      rect(location.x + 5, location.y + 5, location.h - 10, location.h - 10)
      let pfpImage = ASSETS.characterImages[player.character.profilePicture]
      let resize = 2
      image(pfpImage, location.x + 5 + resize, location.y + 5 + resize, location.h - 10 - resize*2, location.h - 10 - resize*2, 0, 0, location.h - 10, location.h - 10)
      pop()
    }
  }
}

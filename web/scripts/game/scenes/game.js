loadScenes.gameScene = function() {
  ScenesManager.scenes[GAME] = {
    start: function() {
      initialiseLevel(scenes[LEVELSELECT].selection, scenes[CHARACTERSELECT].selection.player1, scenes[CHARACTERSELECT].selection.player2)
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
        p.update()

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
        
        drawDamageBox(CANX / totalPlayers * index + (CANX / totalPlayers)/2, CANY - 100, p)
        index++
      }
    },
    parallax: {x: 0, y: 0}
  }
}
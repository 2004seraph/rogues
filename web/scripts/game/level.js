"use strict";
function initialiseLevel(levelID, player1, player2) {
  gameState.currentLevel = levels[levelID]
  gameState.levelColliders = []
  
  gameState.players.one = new Player(200, 200, controlSchemes[0])
  gameState.players.one.setCharacter(player1)
  //gameState.players.one.controls = controlSchemes[0]
  if (!playingOnline) {
    gameState.players.two = new Player(CANX - 300, 50, controlSchemes[1])
    gameState.players.two.setCharacter(player2)
  }
  //gameState.players.two.controls = controlSchemes[1]

  for (let c = 0; c < gameState.currentLevel.colliders.length; c++) {
    let col = gameState.currentLevel.colliders[c]
    
    gameState.levelColliders.push(new BoxCollider(col[0], col[1], col[2], col[3]))//, col[4], col[5], col[6], col[7], col[8], col[9]))
  }
}
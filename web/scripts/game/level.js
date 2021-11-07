"use strict";
function initialiseLevel(levelID, player1, player2) {
  gameState.currentLevel = levels[levelID]
  gameState.levelColliders = []
  
  gameState.players.one = new Player(gameState.currentLevel.respawnArea.x + Math.random() * gameState.currentLevel.respawnArea.w, gameState.currentLevel.respawnArea.y + Math.random() * gameState.currentLevel.respawnArea.h, controlSchemes[0])
  gameState.players.one.setCharacter(player1)
  
  if (!playingOnline) {
    gameState.players.two = new Player(gameState.currentLevel.respawnArea.x + Math.random() * gameState.currentLevel.respawnArea.w, gameState.currentLevel.respawnArea.y + Math.random() * gameState.currentLevel.respawnArea.h, controlSchemes[1])
    gameState.players.two.setCharacter(player2)
  } else {
    //make it a dummy player if it is online
    gameState.players.two = new Player(gameState.currentLevel.respawnArea.x + Math.random() * gameState.currentLevel.respawnArea.w, gameState.currentLevel.respawnArea.y + Math.random() * gameState.currentLevel.respawnArea.h, null)
    gameState.players.two.setCharacter(player2)
  }
  

  for (let c = 0; c < gameState.currentLevel.colliders.length; c++) {
    let col = gameState.currentLevel.colliders[c]
    gameState.levelColliders.push(new BoxCollider(col[0], col[1], col[2], col[3]))//, col[4], col[5], col[6], col[7], col[8], col[9]))
  }
}
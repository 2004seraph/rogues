"use strict";
function attackCheck(thisPlayer) {
  let totalDamage = 0
  let throwVector = {x: 0, y: 0}
  let stun = 0

  let thisPlayersHitbox = new Rectangle(thisPlayer.pos.x, thisPlayer.pos.y, thisPlayer.character.dimensions.width, thisPlayer.character.dimensions.height)

  for (let p in gameState.players) {
    let otherPlayer = gameState.players[p]
    
    if (thisPlayer != otherPlayer) {

      for (let otherPlayersHitbox in otherPlayer.activeHitboxes) {
        let theHitbox = otherPlayer.activeHitboxes[otherPlayersHitbox]

        let theHitboxRectangle = new Rectangle(otherPlayer.pos.x + theHitbox.move.area.x, otherPlayer.pos.y + theHitbox.move.area.y, theHitbox.move.area.w, theHitbox.move.area.h)

        if (collideRectRectObject(thisPlayersHitbox, theHitboxRectangle)) {
          totalDamage += theHitbox.move.damage
          stun = theHitbox.move.stun
          throwVector.x = theHitbox.move.direction.x * PUNCHPOWER * theHitbox.move.direction.m * (1 + thisPlayer.damage/10)
          throwVector.y = theHitbox.move.direction.y * PUNCHPOWER * theHitbox.move.direction.m * (1 + thisPlayer.damage/10)

          if (!spamHitboxes) {
            theHitbox.delta = 10000
          }
        }
      }
    }
  }

  return {
    damage: totalDamage, 
    launch: throwVector, 
    stun: stun
  }
}
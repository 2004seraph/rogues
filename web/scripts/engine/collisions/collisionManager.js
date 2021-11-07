"use strict";
function collideRectRect(x1, y1, w1, h1, x2, y2, w2, h2) {
  if ((x1 + w1 > x2) && (x1 < x2 + w2)) {
    if ((y2 + h2 > y1) && (y2 < y1 + h1)) {
      return true
    }
  }
  return false
}

function collideRectRectObject(rect1, rect2) {
  return collideRectRect(rect1.x, rect1.y, rect1.w, rect1.h, rect2.x, rect2.y, rect2.w, rect2.h)
}

function collide(sprite, tiles) {
  //work out which side the player hits first and void the other collsion
  let corrected_velocity = sprite.velocity
  let corrected_position = sprite.position

  let dimensions = sprite.dimensions

  let yHit = false
  let xHit = false

  for (var tile of tiles) {
    //let t = tiles[tile]
    let collide_check = tile.collideDetect(sprite)

    corrected_position.add(collide_check)

    if (collide_check.x != 0) {
      xHit = true
    }
    if (collide_check.y != 0) {
      yHit = true
    }
  }

  //MAKE IT SO THAT IT IS THE RIGHT SIGN
  if (xHit) {
    corrected_velocity.set(0, corrected_velocity.y)
  }
  if (yHit) {
    corrected_velocity.set(corrected_velocity.x, 0)
  }

  return {
    pos: corrected_position,
    vel: corrected_velocity,
    has: {x: xHit, y: yHit}
  }
}
"use strict";
var loadScenes = {}

function createScenes() {
  let loadScenesKeys = Object.keys(loadScenes)
  console.log(loadScenesKeys)
  for (let sceneLoadFunction of loadScenesKeys) {
    loadScenes[sceneLoadFunction]()
  }
}

function drawDamageBox(x, y, player) {
  push()
  resetGameMatrix()
  let location = {x: x - 100, y: y, w: 200, h: 70}

  strokeWeight(3)
  stroke(255)
  fill(0, 0, 60, 130)
  rect(location.x, location.y, location.w, location.h)
  textAlign(RIGHT, TOP)
  fill(0, 255, 255, 255)
  text(player.damage.toString() + "%", location.x + location.w - 10, location.y)
  
  fill(0, 0, 0, 255)
  rect(location.x + 5, location.y + 5, location.h - 10, location.h - 10)
  let pfpImage = ASSETS.characterImages[player.character.profilePicture]
  let resize = 2
  image(pfpImage, location.x + 5 + resize, location.y + 5 + resize, location.h - 10 - resize*2, location.h - 10 - resize*2, 0, 0, location.h - 10, location.h - 10)
  pop()
}
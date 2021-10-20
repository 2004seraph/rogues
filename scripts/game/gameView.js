"use strict";
//camera settings
let minimumScale = 1//0.4
let maximumScale = 1.75//2
let fallOff = 50
let currentZoom = 1

//default screen limits, these are pretty redundant
let boundaries = {
  x: 0,
  y: 0,
  w: aspectRatio.w * screenScale,
  h: aspectRatio.h * screenScale
}

var gameCamera = new Camera(-900/2, -700/2, 1, 0.07)

function cameraTrack() {
  let averagePlayerLocation = averagePlayerPosition()
  
  //they both must be onscreen, otherwise pan to the whole level
  if (!(averagePlayerLocation.x) || !(averagePlayerLocation.x)) {
    averagePlayerLocation = {
      x: CANX/2,
      y: CANY/2
    }
  }

  currentZoom = minimumScale + (fallOff/(1 + distanceBetweenPoints(anOnscreenPlayer(), averagePlayerLocation)))//1.5 = activation level
  if (maximumScale < currentZoom) {currentZoom = maximumScale}

  gameCamera.update()
  gameCamera.pan(-averagePlayerLocation.x, -averagePlayerLocation.y)
  gameCamera.zoomScale(currentZoom)
  gameCamera.show()
}


function averagePlayerPosition() {
  let count = 0
  let pos = {
    x: 0,
    y: 0
  }

  for (let player in gameState.players) {
    let p = gameState.players[player]

    if (p.pos.x > boundaries.x && p.pos.x < boundaries.x + boundaries.w && p.pos.y > boundaries.y && p.pos.y < boundaries.y + boundaries.h) {
      pos.x += p.pos.x
      pos.y += p.pos.y

      count++
    }
  }

  pos.x /= count
  pos.y /= count

  return pos
}


function anOnscreenPlayer() {
  for (let player in gameState.players) {
    let p = gameState.players[player]

    if (p.pos.x > boundaries.x && p.pos.x < boundaries.x + boundaries.w && p.pos.y > boundaries.y && p.pos.y < boundaries.y + boundaries.h) {
      return {x: p.pos.x, y: p.pos.y}
    }
  }

  //zoom out to view the whole stage
  return {x: 0, y: 0}
}


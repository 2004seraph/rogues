"use strict";

p5.disableFriendlyErrors = true

var CANX, CANY, Canvas, ScenesManager, Loader
var resolutionMultiplier = 1

var gameState = {
  currentLevel: null,
  levelColliders: [],
  players: {},
  authorisedUser: null
}

function setup() {
  CANX = aspectRatio.w * screenScale// * resolutionMultiplier
  CANY = aspectRatio.h * screenScale// * resolutionMultiplier

  Canvas = createCanvas(CANX, CANY)
  Canvas.parent("P5Container")
  
  frameRate(FRAMERATE)

  //audio policy
  getAudioContext().suspend()

  //nearest neighbor scaling for the pixel art
  if (noImageSmooth) {
    let context = Canvas.elt.getContext('2d')//could be replaced with 'drawingcontext'
    context.imageSmoothingEnabled = false
    context.mozImageSmoothingEnabled = false//depreciated
    context.webkitImageSmoothingEnabled = false
    context.msImageSmoothingEnabled = false
  }

  Loader = new LoadingBar(50, CANY/2 - 50, CANX - 100, 100, rootJSONFiles)
  loadGameAssets()
  ScenesManager = new SceneManager({}, LOADINGSCREEN)
  createScenes()

  textAlign(CENTER, CENTER)
  textSize(28)
  noStroke()
}

function draw() {
  resetGameMatrix()
  ScenesManager.update()
}

function resetGameMatrix() {
  resetMatrix()
  if (resolutionMultiplier != 0) {
    scale(resolutionMultiplier)
    translate(CANX * (1-resolutionMultiplier), CANY * (1-resolutionMultiplier))
  }

  drawingContext.shadowOffsetX = 0
  drawingContext.shadowOffsetY = 0
}

function timeScaler() {
  return deltaTime / 16
}

function keyPressed() {
  //console.log(keyCode, key)
  userStartAudio()
  switch (keyCode) {
    case SHIFT:
      //gotoGame()
      break
  }
  
  //prevent default for ALL player controls
  if (ScenesManager.currentScene == GAME) {
    for (let scheme = 0; scheme < controlSchemes.length; scheme++) {
      for (let schemeKey in controlSchemes[scheme]) {
        if (controlSchemes[scheme][schemeKey] == keyCode) {
          return false
        }
      }
    }
  }
}

function mousePressed() {
  //console.log(mouseX, mouseY)
  userStartAudio()
}
/*

socket.emit("message", {data})
*/

//hashMessage("sam").then((digest) => {console.log(digest)})
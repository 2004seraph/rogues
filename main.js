"use strict";
var CANX, CANY, Canvas, ScenesManager, Loader

var gameState = {
  currentLevel: null,
  levelColliders: [],
  players: {},
  authorisedUser: null
}

p5.disableFriendlyErrors = true

var resolutionMultiplier = 1

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
  ScenesManager = new SceneManager(createScenes(), LOADINGSCREEN)

  textAlign(CENTER, CENTER)
  textSize(28)
  noStroke()

  console.log(createGraphics.toString())
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
  switch (key) {
    case "l":
      gotoGame()
      break
  }
  
  //prevent default for ALL player controls
  for (let scheme = 0; scheme < controlSchemes.length; scheme++) {
    for (let schemeKey in controlSchemes[scheme]) {
      if (controlSchemes[scheme][schemeKey] == keyCode) {
        return false
      }
    }
  }
}

function mousePressed() {
  //console.log(mouseX, mouseY)
  userStartAudio()
}
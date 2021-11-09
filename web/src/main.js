"use strict";
import p5 from "./scripts/libraries/p5.min.js"
import "./scripts/libraries/p5.sound.min.js"

import LoadingBar from "./scripts/engine/loader.js"
import SceneManager from "./scripts/engine/sceneManager.js"

import Globals from "./scripts/game/globals.js"
import settings from "./scripts/game/parameters.js"
import constants from "./scripts/game/constants.js"
import {createScenes} from "./scripts/game/scenes.js"


import {loadGameAssets, rootJSONFiles} from "./scripts/game/assetLoader.js"

p5.disableFriendlyErrors = true

//turn off console.log()s
// console.log = function(...args) {
//   return true
// }

var resolutionMultiplier = 1//half-implemented

Globals.GameState = {
  currentLevel: null,
  levelColliders: [],
  players: {}
}

const sketch = (p) => {
  p.setup = () => {
    Globals.CANX = settings.aspectRatio.w * settings.screenScale
    Globals.CANY = settings.aspectRatio.h * settings.screenScale

    Globals.Canvas = p.createCanvas(Globals.CANX, Globals.CANY)
      .style("z-index: 0")
    Globals.Canvas.parent("P5Container")
    
    p.frameRate(constants.FRAMERATE)

    Globals.P5 = p

    //audio policy
    p.getAudioContext().suspend()

    //nearest neighbor scaling for the pixel art
    if (settings.noImageSmooth) {
      let context = Globals.Canvas.elt.getContext('2d')//could be replaced with 'drawingcontext'
      context.imageSmoothingEnabled = false
      context.mozImageSmoothingEnabled = false
      context.webkitImageSmoothingEnabled = false
      context.msImageSmoothingEnabled = false
    }

    Globals.Loader = new LoadingBar(p, 50, Globals.CANY/2 - 50, Globals.CANX - 100, 100, rootJSONFiles)
    Globals.ScenesManager = new SceneManager({}, constants.LOADINGSCREEN)
    
    loadGameAssets()
    createScenes()

    p.textAlign(p.CENTER, p.CENTER)
    p.textSize(28)
    p.noStroke()
  }

  p.draw = () => {
    Globals.resetGameMatrix(p)
    Globals.ScenesManager.update()
    //promptsUpdate()
  }

  p.keyPressed = () => {
    //console.log(keyCode, key)
    //userStartAudio()
    // switch (keyCode) {
    //   case SHIFT:
    //     gotoGame()
    //     break
    //   case ENTER:
    //     let hub = ScenesManager.scenes[MAINMENU]
    //     //the code is here because it needs to fire only on one press
    //     if (ScenesManager.currentScene == MAINMENU) {
    //       if (hub.showAccountBox) {
    //         if (hub.accountBoxStuff.usernameInput.elt === document.activeElement || hub.accountBoxStuff.passwordInput.elt === document.activeElement) {
    //           logIn()
    //         } else if (hub.accountBoxStuff.usernameCreate.elt === document.activeElement || hub.accountBoxStuff.passwordCreate1.elt === document.activeElement || hub.accountBoxStuff.passwordCreate2.elt === document.activeElement) {
    //           signUp()
    //         } else {
    //           if (hub.accountBoxStuff.usernameInput.value().length > hub.accountBoxStuff.usernameCreate.value().length) {
    //             logIn()
    //           } else if (hub.accountBoxStuff.usernameInput.value().length < hub.accountBoxStuff.usernameCreate.value().length) {
    //             signUp()
    //           } else {
    //             //nothing
    //           }
    //         }
    //       } else if (hub.showGameBox) {
    //         joinGame()
    //       }
    //     }
    //     break
    // }
    
    // //prevent default for ALL player controls
    // if (ScenesManager.currentScene == GAME) {
    //   for (let scheme = 0; scheme < controlSchemes.length; scheme++) {
    //     for (let schemeKey in controlSchemes[scheme]) {
    //       if (controlSchemes[scheme][schemeKey] == keyCode) {
    //         return false
    //       }
    //     }
    //   }
    // }
  }

  p.mousePressed = () => {
    //console.log(mouseX, mouseY)
    //userStartAudio()
  }
}

let containerElement = document.getElementById("P5Container")
new p5(sketch, containerElement)

Globals.resetGameMatrix = () => {
  Globals.P5.resetMatrix()
  if (resolutionMultiplier != 0) {
    Globals.P5.scale(resolutionMultiplier)
    Globals.P5.translate(Globals.CANX * (1-resolutionMultiplier), Globals.CANY * (1-resolutionMultiplier))
  }

  Globals.P5.drawingContext.shadowOffsetX = 0
  Globals.P5.drawingContext.shadowOffsetY = 0
}

Globals.timeScaler = () => {
  return Globals.P5.deltaTime / 16
}


Globals.doSound = (s) => {
  switch (s) {
    case "click":
      ASSETS.sounds.click_2.setVolume(0.6)
      ASSETS.sounds.click_2.play()
      break
    case "choose":
      ASSETS.sounds.click_1.setVolume(0.5)
      ASSETS.sounds.click_1.play()
      break
    case "back":
      ASSETS.sounds.click_3.setVolume(0.7)
      ASSETS.sounds.click_3.play()
      break
    case "punch":
      ASSETS.sounds.punch.setVolume(0.52)
      ASSETS.sounds.punch.play()
      break
    case "death":
      ASSETS.sounds.death.setVolume(0.25)
      ASSETS.sounds.death.play()
      break
    case "pound":
      ASSETS.sounds.pound.setVolume(0.25)
      ASSETS.sounds.pound.play()
      break
  }
}
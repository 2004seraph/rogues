"use strict";
class SceneManager {
  constructor(scenesObject, startingScene=0, autoInitialize=false) {
    this.transition = {
      frameDelta: 0,
      frameLimit: 0,
      targetScene: null,
      transitioning: false
    }

    this.scenes = scenesObject
    this.currentScene = startingScene
    this._firstRun = autoInitialize
  }

  update() {
    if (this.currentScene > -1) {
      if (this._firstRun) {
       this._firstRun = false
       this.scenes[this.currentScene].start()
      }

      this.scenes[this.currentScene].run()
      updateButtons()
    }
    this._present()
  }

  changeScene(target, time) {
    this.transition.frameDelta = 0
    this.transition.frameLimit = time
    this.transition.targetScene = target

    this.transition.transitioning = true
  }

  _present() {
    if (this.transition.transitioning == true) {
      if (this.transition.frameDelta > this.transition.frameLimit || this.transition.frameLimit == 0) {
        this.transition.transitioning = false

        this.currentScene = this.transition.targetScene
        
        clearButtons()
        this.scenes[this.currentScene].start()
      }
      this.transition.frameDelta += timeScaler()
    } else {
      if (this.transition.frameDelta > 0) {
        this.transition.frameDelta -= timeScaler()
      } else {
        //transition over
      }
    }

    //fading
    push()
    noStroke()
    fill(0, 0, 0, map(this.transition.frameDelta, 0, this.transition.frameLimit + 1, 0, 255))
    rect(0, 0, CANX, CANY)
    pop()
  }
}
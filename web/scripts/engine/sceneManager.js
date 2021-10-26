"use strict";
class SceneManager {
  constructor(scenesObject, startingScene=0, autoInitialize=false, faderCanvas) {
    this.transition = {
      frameDelta: 0,
      frameLimit: 0,
      targetScene: null,
      transitioning: false,
      faderP5Instance: new p5((sketch) => {
        sketch.setup = () => {
          faderCanvas = sketch.createCanvas(CANX, CANY)
          faderCanvas.parent("P5Container")
            .position(0, 0)
            .style("z-index: 2")
            .style("pointer-events: none")
          
          try {
            sketch.getAudioContext().suspend()
          } catch (err) {
            console.log(err)
          }
        }
        sketch.draw = () => {
          sketch.clear()
          sketch.background(0, 0, 0, map(this.transition.frameDelta, 0, this.transition.frameLimit + 1, 0, 255))
        }
      })
    }

    this.scenes = scenesObject
    this.currentScene = startingScene
    this._firstRun = autoInitialize
  }

  preCompute() {
    let sceneKeys = Object.keys(this.scenes)
    for (let scene of sceneKeys) {
      if (this.scenes[scene].hasOwnProperty("preCompute")) {
        this.scenes[scene].preCompute()
      }
    }
  }

  update() {
    if (this.currentScene > -1) {
      if (this._firstRun) {
       this._firstRun = false
       this.scenes[this.currentScene].start()
      }

      this.scenes[this.currentScene].run()
      //updateButtons()
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
        clearButtons()
        
        this.transition.transitioning = false

        this.currentScene = this.transition.targetScene
        
        //this.transition.frameDelta = this.transition.frameLimit + 1
        clearPrompt()
        this.scenes[this.currentScene].start()
      }
      this.transition.frameDelta += timeScaler()
    } else {
      if (this.transition.frameDelta > 0) {
        this.transition.frameDelta -= timeScaler()
      } else {
        this.transition.frameDelta = 0
        //transition over
      }
    }

    //fading
    // push()
    // noStroke()
    // fill(0, 0, 0, map(this.transition.frameDelta, 0, this.transition.frameLimit + 1, 0, 255))
    // rect(0, 0, CANX, CANY)
    // pop()
  }
}
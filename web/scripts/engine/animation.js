"use strict";
class Animation {
  constructor(animationData = {}, repeat=false) {
    this.animationData = animationData
    this.currentFrame = 0
    this.frameTimeDelta = 0

    this.sheet = null
    this.frames = []
    this.flippedFrames = []

    this.repeat = repeat
    this.complete = false

    this.debugVerbose = false
  }

  setData(dataPromise) {
    if (typeof dataPromise == "string") {
      this.animationData = loadJSON(dataPromise, () => {
        this.load()
      })
    } else {
      this.animationData = dataPromise
    }
  }

  load() {
    loadUp()
    if (this.debugVerbose) {console.log("Loaded animation meta:", this.animationData)}
    this.sheet = loadImage(this.animationData.meta.image, () => {
      this.trim()
    })
  }

  trim() {
    loadUp()
    
    if (this.debugVerbose) {console.log("Loaded spritesheet: '", this.animationData.meta.image, "'")}
    for (let f in this.animationData.frames) {
      let frameData = this.animationData.frames[f]
      let rightFrame = this.sheet.get(frameData.frame.x, frameData.frame.y, frameData.frame.w, frameData.frame.h)
      this.frames.push(rightFrame)
      this.flippedFrames.push(rightFrame.flip(X))
    }
    if (this.debugVerbose) {console.log("Trimmed spritesheet: '", this.animationData.meta.image, "'")}
  }

  play(x, y, w=0, h=0, flip=false) {//you pass in the character width so it knows where to draw the flip from
    if (!this.complete) {
      this.frameTimeDelta += deltaTime
      if (this.frameTimeDelta > this.animationData.frames[this.currentFrame].duration) {
        this.frameTimeDelta = 0
        this.currentFrame++
      }
      if (this.currentFrame > this.frames.length - 1) {
        this.currentFrame = 0
        if (!this.repeat) {
          this.complete = true
        }
      }

      let yOffset = 0
      if (this.animationData.hasOwnProperty("meta") && this.animationData.meta.hasOwnProperty("feet") && this.animationData.meta.feet) {
        let img = this.flippedFrames[Math.floor(this.currentFrame)]
        yOffset = h - img.height
      }

      if (!flip) {
        image(this.frames[Math.floor(this.currentFrame)], x, y + yOffset)
      } else {
        let img = this.flippedFrames[Math.floor(this.currentFrame)]
        image(img, x - (img.width - w), y + yOffset)
      }
    }
  }

  reset() {
    this.currentFrame = 0
    this.frameTimeDelta = 0
    this.complete = false
  }

  isComplete() {
    return this.complete
  }
}
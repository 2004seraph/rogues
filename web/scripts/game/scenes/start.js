"use strict";
loadScenes.startScene = function() {
  ScenesManager.scenes[STARTSCREEN] = {
    preCompute: function() {
      for (let i = 0; i < 100; i++) {
        this.titleImgs.push(ASSETS.namedImages.titleImg.tint(i/100 * 255, 255, 255))
      }
      for (let i = 0; i < 100; i++) {
        this.titleImgs.push(ASSETS.namedImages.titleImg.tint(255 - i/100 * 255, 255, 255))
      }
    },
    start: function() {
      textFont("joystixmonospace")
      //ASSETS.fonts.common
      gameButtons.playButton = createButton('Play')
        .parent('P5Container')
        .position(CANX - 512 + 140, CANY - 250)
        .size(512-140, 64)
        .class("startButtons")
        .mousePressed(() => {
          ScenesManager.changeScene(MAINMENU, mainInterfaceSpeed)
          doSound("click")
      })

      gameButtons.creditsButton = createButton('Credits')
        .parent('P5Container')
        .position(CANX - 512 + 140, CANY - 180)
        .size(512-140, 64)
        .class("startButtons")
        .attribute("disabled", "")
        .mousePressed(() => {
          ScenesManager.changeScene(CREDITS, mainInterfaceSpeed)
          doSound("click")
      })
      //ASSETS.sounds.introSong.loop()
    },
    run: function() {
      background(0)
      let bright = 512
      
      push()
      colorMode(HSB)
      for (let bar = 0; bar < CANY; bar++) {
        let push = (Math.cos(frameCount/60 + bar/360) + 1) * 50
        let myColor = 200 + push
        let sat = ((Math.floor(Math.cos(bar) * 57) + frameCount) % 10 == 0) ? 80 : 255//bars
        let val = ((Math.floor(Math.sin(bar) * 57) + frameCount) % 45 == 0) ? Math.random() * 255 : 255//bars
        fill(myColor, sat, val)
        rect(0, bar, CANX, 1)
      }
      pop()

      image(ASSETS.namedImages.mainMenuBG, 0, 0, CANX, CANY)
      
      let embPos = {x: 90, y: 90}
      this.mouseDirection.set(embPos.x - mouseX, embPos.y - mouseY).rotate(Math.PI/2)
      this.spin += (this.mouseDirection.heading() - this.spin)/5 * timeScaler()

      push()
      colorMode(HSB)
      imageMode(CENTER, CENTER)
      translate(embPos.x, embPos.y)
      rotate(this.spin)
      //lazer (disabled)
      if (mouseIsPressed && false) {
        push()
        strokeWeight(2)
        stroke(255)
        // for (let i = 0; i < CANX + CANY; i++) {
        //   if (i % 40 == 0) {
        //     let segmentLevel = i
        //     let segmentHeight = Math.sin(i + frameCount) * 20
        //     let offset = (Math.random() - Math.random()) * 10
        //     stroke(190 + Math.random() * 60, 255, 255)
        //     line(offset, segmentLevel, offset, segmentLevel+segmentHeight)
        //   }
        // }
        line(0, 0, 0, CANY+CANX)
        pop()
      }
      image(ASSETS.namedImages.starEmbelum, 1, 1)
      pop()

      image(this.titleImgs[Math.floor(this.titleIndex)], 210, 43)

      this.titleIndex++
      if (this.titleIndex > this.titleImgs.length - 1) {
        this.titleIndex = 0
      }
    },

    titleImgs: [],
    titleIndex: 0,
    mouseDirection: createVector(0, 0),
    spin: 0
  }
}
loadScenes.startScene = function() {
  ScenesManager.scenes[STARTSCREEN] = {
    start: function() {
      //ASSETS.fonts.common
      buttons.playButton = new Button(CANX - 512 + 140, CANY - 250, 512, 64, 
        function () {
          if (!(this.mouseOver)) {
            image(this.buttonVars.image, this.spacial.x - Logistic_S_Curve(this.buttonVars.change * timeScaler()) * 40, this.spacial.y)
          } else {
            image(this.buttonVars.tinted, this.spacial.x - Logistic_S_Curve(this.buttonVars.change * timeScaler()) * 40, this.spacial.y)
          }
          if (this.mouseOver == false) {
            if (this.buttonVars.change > 0) {
              this.buttonVars.change -= this.buttonVars.rate
            }
          }
        }, {
          clickedFunction: function () {
            this.disable()
            ScenesManager.changeScene(MAINMENU, mainInterfaceSpeed)
          }, mouseOverFunction: function () {
            if (this.buttonVars.change < 1) {
              this.buttonVars.change += this.buttonVars.rate
            }
          }
        }, {
          image: ASSETS.namedImages.playImg,
          change: 0,
          rate: 0.06,
          tinted: ASSETS.namedImages.playImg.tint(55, 255, 255)
        }
      )
      buttons.creditsButton = new Button(CANX - 256 + 50, CANY - 180, 512, 64, 
        function () {
          if (!(this.mouseOver)) {
            image(this.buttonVars.image, this.spacial.x - Logistic_S_Curve(this.buttonVars.change * timeScaler()) * 40, this.spacial.y)
          } else {
            image(this.buttonVars.tinted, this.spacial.x - Logistic_S_Curve(this.buttonVars.change * timeScaler()) * 40, this.spacial.y)
          }
          if (this.mouseOver == false) {
            if (this.buttonVars.change > 0) {
              this.buttonVars.change -= this.buttonVars.rate
            }
          }
        }, {
          clickedFunction: function () {
            //this.disable()
            //ScenesManager.changeScene(CREDITS, mainInterfaceSpeed)
          }, mouseOverFunction: function () {
            if (this.buttonVars.change < 1) {
              this.buttonVars.change += this.buttonVars.rate
            }
          }
        }, {
          image: ASSETS.namedImages.creditImg,
          change: 0,
          rate: 0.06,
          tinted: ASSETS.namedImages.creditImg.tint(55, 255, 255)
        }
      )

      for (let i = 0; i < 100; i++) {
        this.titleImgs.push(ASSETS.namedImages.titleImg.tint(i/100 * 255, 255, 255))
      }
      for (let i = 0; i < 100; i++) {
        this.titleImgs.push(ASSETS.namedImages.titleImg.tint(255 - i/100 * 255, 255, 255))
      }

      //ASSETS.sounds.introSong.loop()
    },
    run: function() {
      background(0)
      let bright = 512
      
      for (let bar = 0; bar < CANY; bar++) {
        let push = (Math.cos(frameCount/60) + 1) * 50
        let z = 1.2
        let x = bar/CANY
        let myColor = color((bright) * x/z + push, (bright/2) * ( x)/z, (bright) * (1 - x)/z)
        fill(myColor)
        rect(0, bar, CANX, 1)
      }

      image(ASSETS.namedImages.mainMenuBG, 0, 0, CANX, CANY)
      
      let embPos = {x: 90, y: 90}
      this.mouseDirection.set(embPos.x - mouseX, embPos.y - mouseY).rotate(Math.PI/2)
      this.spin += (this.mouseDirection.heading() - this.spin)/5 * timeScaler()
      push()
      imageMode(CENTER, CENTER)
      translate(embPos.x, embPos.y)
      rotate(this.spin)
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
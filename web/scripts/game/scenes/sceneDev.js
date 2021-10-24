function devScene() {
  ScenesManager.scenes[MAINMENU] = {
    start: function() {
      //background moving boxes
      particleSystems.hubDataBoxes = new ParticleSystem(300, 0)
      for (let i = 0; i < 300; i++) {
        let dataBoxParameters = {
          width: Math.random() * CANX,
          height: Math.random() * 50 + 10,
          speed: Math.random() * 5,
          color: 180 + Math.random() * 180,
          index: i,
          alpha: Math.random(),
          sat: 50 + Math.random() * 150
        }
        let dataBoxDisplay = function(worldPosition) {
          push()
          colorMode(HSB)
          fill(this.parameters.color, this.parameters.sat, 255, this.parameters.alpha * Math.sin(frameCount/60 + this.parameters.index) ** 2)
          noStroke()
          rect(worldPosition.x + this.pos.x, worldPosition.y + this.pos.y, this.parameters.width, this.parameters.height)
          pop()
        }
        let dataBoxUpdate = function(worldPosition) {
          this.pos.x -= this.parameters.speed
        }
        let dataBoxDestroy = function() {
          if (collideRectRect(this.pos.x, this.pos.y, this.parameters.width, this.parameters.height, 0, 0, CANX, CANY)) {
            return false
          } else {
            this.pos = {
              x: CANX - 0.01,
              y: this.pos.y
            }
          }
        }
        particleSystems.hubDataBoxes.addParticle(Math.random() * CANX, Math.random() * CANY, {destroyFunction: dataBoxDestroy, displayFunction: dataBoxDisplay, updateFunction: dataBoxUpdate, parameters: dataBoxParameters})
      }

      //online, offline, back, account
      this.buttonSize = 450
      this.spacing = 20
      this.buttonLevel = 170//lower = bottom
      this.heightMult = 1/4.5

      let b_height = this.buttonSize * this.heightMult

      buttons.offlinePlayButton = new Button(CANX/2 - this.buttonSize - this.spacing, CANY/2 - this.buttonLevel, this.buttonSize, b_height, 
        function () {
          if (!(this.mouseOver)) {
            //image(this.buttonVars.image, this.spacial.x, this.spacial.y)
          } else {
            //image(this.buttonVars.tinted, this.spacial.x, this.spacial.y)
          }

          textAlign(LEFT, TOP)
          fill(255)
          rect(this.spacial.x, this.spacial.y, this.spacial.w, this.spacial.h)
          fill(0)
          text("Local Play", this.spacial.x, this.spacial.y)

        }, {
          clickedFunction: function () {
            this.disable()
            ScenesManager.changeScene(CHARACTERSELECT, mainInterfaceSpeed)
          }, mouseOverFunction: function () {

          }
        }, {
          image: null,
          tinted: null//.tint(55, 255, 255)
        }
      )
      buttons.onlinePlayButton = new Button(CANX/2 - this.buttonSize - this.spacing, CANY/2 - this.buttonLevel + b_height + this.spacing, this.buttonSize * 0.6 + this.spacing, b_height, 
        function () {
          if (!(this.mouseOver)) {
            //image(this.buttonVars.image, this.spacial.x, this.spacial.y)
          } else {
            //image(this.buttonVars.tinted, this.spacial.x, this.spacial.y)
          }

          textAlign(LEFT, TOP)
          fill(255)
          rect(this.spacial.x, this.spacial.y, this.spacial.w, this.spacial.h)
          fill(0)
          text("Online Play", this.spacial.x, this.spacial.y)

        }, {
          clickedFunction: function () {
            //this.disable()
            //ScenesManager.changeScene(GAME, mainInterfaceSpeed)
          }, mouseOverFunction: function () {

          }
        }, {
          image: null,
          tinted: null//.tint(55, 255, 255)
        }
      )
      buttons.onlinePlayButton.state = false

      buttons.accountInfo = new Button(CANX/2 - this.buttonSize*0.4 + this.spacing, CANY/2 - this.buttonLevel + b_height + this.spacing, this.buttonSize * 0.4 - this.spacing*2, b_height, 
        function () {
          if (!(this.mouseOver)) {
            //image(this.buttonVars.image, this.spacial.x, this.spacial.y)
          } else {
            //image(this.buttonVars.tinted, this.spacial.x, this.spacial.y)
          }

          textAlign(LEFT, TOP)
          fill(255)
          rect(this.spacial.x, this.spacial.y, this.spacial.w, this.spacial.h)
          fill(0)
          text("Accoun\nt", this.spacial.x, this.spacial.y)

        }, {
          clickedFunction: () => {
            //this.disable()
            //ScenesManager.changeScene(STARTSCREEN, mainInterfaceSpeed)
            globalButtonState(false)
            this.showAccountBox = true
            clearButtons()

            let inter = 10
            let idfs = 270

            this.accountBoxStuff.usernameInput = createInput()
              .attribute('placeholder', 'Username')
              .attribute('maxlength', globalServerInfo.username.max)
              .attribute("autocomplete", "username")
              .attribute("spellcheck", false)
              .parent('P5Container')
              .size(idfs)
            this.accountBoxStuff.usernameInput.position(CANX/2 - this.buttonSize + inter - this.spacing, CANY/2 - this.buttonLevel + b_height + this.spacing + inter)

            this.accountBoxStuff.passwordInput = createInput('', 'password')
              .attribute('placeholder', 'Password')
              .attribute('maxlength', globalServerInfo.username.max)
              .attribute("autocomplete", "current-password")
              .attribute("spellcheck", false)
              .parent('P5Container')
              .size(idfs)
            this.accountBoxStuff.passwordInput.position(CANX/2 - this.buttonSize + inter - this.spacing, CANY/2 - this.buttonLevel + b_height + this.spacing + inter*2 + this.accountBoxStuff.usernameInput.size().height)
            //console.log(this.accountBoxStuff.usernameInput.size())
            this.accountBoxStuff.login = createButton('Log In')
              .parent('P5Container')
              .size(this.buttonSize - idfs- this.spacing*2, this.accountBoxStuff.usernameInput.size().height*2 + inter)
            this.accountBoxStuff.login.position(CANX/2 - this.buttonSize + inter + idfs, CANY/2 - this.buttonLevel + b_height + this.spacing + inter)
            this.accountBoxStuff.login.mousePressed(logIn)

            //buttons.login = new Button(CANX/2, CANY/2, 99.6, 80)
          }
        }, {
          image: null,
          tinted: null//.tint(55, 255, 255)
        }
      )
      buttons.hubToMenu = new Button(CANX/2 - this.buttonSize - this.spacing, CANY/2 - this.buttonLevel + b_height*2 + this.spacing*2+ this.spacing*2, this.buttonSize, b_height, 
        function () {
          if (!(this.mouseOver)) {
            //image(this.buttonVars.image, this.spacial.x, this.spacial.y)
          } else {
            //image(this.buttonVars.tinted, this.spacial.x, this.spacial.y)
          }

          textAlign(LEFT, TOP)
          fill(255)
          rect(this.spacial.x, this.spacial.y, this.spacial.w, this.spacial.h)
          fill(0)
          text("Back", this.spacial.x, this.spacial.y)
        }, {
          clickedFunction: function () {
            this.disable()
            ScenesManager.changeScene(STARTSCREEN, mainInterfaceSpeed)
          }, mouseOverFunction: function () {

          }
        }, {
          image: null,
          tinted: null//.tint(55, 255, 255)
        }
      )
      this.flippedBg = ASSETS.namedImages.modeSelectBG.tint(0, 255, 0)
    },
    run: function() {
      if (this.showAccountBox) {
        image(this.flippedBg, 0, 0)
      } else {
        image(ASSETS.namedImages.modeSelectBG, 0, 0)
      }
      updateParticleSystems()
      fill(Math.sin(frameCount/60)**2 * 255, 0, Math.cos(frameCount/60)**2 * 255, Math.cos(frameCount/60 + 90)**2 * 80 + 100)
      rect(0, 0, CANX, CANY)
      

      let b_height = this.buttonSize * this.heightMult

      fill(55, 0, 55, 180)
      stroke(0)
      strokeWeight(2)
      rect(CANX/2 - this.buttonSize - this.spacing - this.spacing, CANY/2 - this.buttonLevel - this.spacing, this.buttonSize*2 + this.spacing*2 + this.spacing*2, b_height*3 + this.spacing*4 + this.spacing*2)
      noStroke()
      fill(0)
      rect(CANX/2 + this.spacing, CANY/2 - this.buttonLevel, this.buttonSize, b_height*3 + this.spacing*4)
      fill(255)
      text("Highscores and Info", CANX/2 + this.spacing, CANY/2 - this.buttonLevel)

      if (this.showAccountBox) {
        this.accountDialog()
      }
    },
    accountDialog: function() {
      let b_height = this.buttonSize * this.heightMult
      fill(100)
      rect(CANX/2 - this.buttonSize - this.spacing, CANY/2 - this.buttonLevel + b_height + this.spacing, this.buttonSize, b_height)

      if (keyIsDown(ENTER)) {
        //logIn()
      }
    },
    buttonSize: 0,
    buttonLevel: 0,
    spacing: 0,
    heightMult: 0,
    showAccountBox: false,
    accountBoxStuff: {},
    flippedBg: null
  }
}
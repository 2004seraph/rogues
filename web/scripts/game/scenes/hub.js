"use strict";
loadScenes.hubScene = function() {
  ScenesManager.scenes[MAINMENU] = {
    preCompute: function() {
      //background moving boxes
      particleSystems.hubDataBoxes = new ParticleSystem(0, 0)
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
      this.flippedBg = ASSETS.namedImages.modeSelectBG.tint(0, 255, 0)

      //online, offline, back, account
      this.buttonSize = 450
      this.spacing = 20
      this.buttonLevel = 170//lower = bottom
      this.heightMult = 1/4.5
    },
    start: function() {
      let b_height = this.buttonSize * this.heightMult

      gameButtons.offlinePlayButton = createButton("Offline Play")
        .parent('P5Container')
        .position(CANX/2 - this.buttonSize - this.spacing, CANY/2 - this.buttonLevel)
        .size(this.buttonSize, b_height).mousePressed(() => {
          ScenesManager.changeScene(CHARACTERSELECT, mainInterfaceSpeed)
      })

      gameButtons.onlinePlayButton = createButton("Online Play")
        .parent('P5Container')
        .position(CANX/2 - this.buttonSize - this.spacing, CANY/2 - this.buttonLevel + b_height + this.spacing)
        .size(this.buttonSize * 0.6 + this.spacing, b_height)
        .mousePressed(() => {
      })

      if (accountData == null) {
        gameButtons.onlinePlayButton.attribute("disabled", "")
      }

      gameButtons.accountInfo = createButton("Account")
        .parent('P5Container')
        .position(CANX/2 - this.buttonSize*0.4 + this.spacing, CANY/2 - this.buttonLevel + b_height + this.spacing)
        .size(this.buttonSize * 0.4 - this.spacing*2, b_height)
        .mousePressed(() => {
          this.showAccountBox = true
          clearButtons()

          let inter = this.spacing/2
          let idfs = 270

          //sign in
          this.accountBoxStuff.usernameInput = createInput()
            .attribute('placeholder', 'Username')
            .attribute('maxlength', globalServerInfo.username.max)
            .attribute("autocomplete", "username")
            .attribute("spellcheck", false)
            .parent('P5Container')
            .size(idfs)
          this.accountBoxStuff.usernameInput.position(CANX/2 - this.buttonSize + inter - this.spacing, CANY/2 - this.buttonLevel + inter+ this.accountBoxStuff.usernameInput.size().height)

          this.accountBoxStuff.passwordInput = createInput('', 'password')
            .attribute('placeholder', 'Password')
            .attribute('maxlength', globalServerInfo.password.max)
            .attribute("autocomplete", "current-password")
            .attribute("spellcheck", false)
            .parent('P5Container')
            .size(idfs)
          this.accountBoxStuff.passwordInput.position(CANX/2 - this.buttonSize + inter - this.spacing, CANY/2 - this.buttonLevel + inter*2 + this.accountBoxStuff.usernameInput.size().height*2)

          this.accountBoxStuff.login = createButton('Log In')
            .parent('P5Container')
            .size(this.buttonSize - idfs- this.spacing*2, this.accountBoxStuff.usernameInput.size().height*2 + inter)
          this.accountBoxStuff.login.position(CANX/2 - this.buttonSize + inter + idfs, CANY/2 - this.buttonLevel + inter+ this.accountBoxStuff.usernameInput.size().height)
          this.accountBoxStuff.login.mousePressed(() => {
            logIn()
            //this.logDone()
          })

          //sign up
          this.accountBoxStuff.usernameCreate = createInput()
            .attribute('placeholder', 'Username')
            .attribute('maxlength', globalServerInfo.username.max)
            .attribute("autocomplete", "username")
            .attribute("spellcheck", false)
            .parent('P5Container')
            .size(idfs)
          this.accountBoxStuff.usernameCreate.position(CANX/2 - this.buttonSize + inter - this.spacing, CANY/2 - this.buttonLevel + b_height+ this.accountBoxStuff.usernameInput.size().height*2 + this.spacing + inter)

          this.accountBoxStuff.passwordCreate1 = createInput('', 'password')
            .attribute('placeholder', 'Password')
            .attribute('maxlength', globalServerInfo.password.max)
            .attribute("autocomplete", "new-password")
            .attribute("spellcheck", false)
            .parent('P5Container')
            .size(idfs)
          this.accountBoxStuff.passwordCreate1.position(CANX/2 - this.buttonSize + inter - this.spacing, CANY/2 - this.buttonLevel + b_height+ this.accountBoxStuff.usernameInput.size().height*3 + this.spacing + inter*2)
          this.accountBoxStuff.passwordCreate2 = createInput('', 'password')
            .attribute('placeholder', 'Confirm')
            .attribute('maxlength', globalServerInfo.password.max)
            .attribute("autocomplete", "new-password")
            .attribute("spellcheck", false)
            .parent('P5Container')
            .size(idfs)
          this.accountBoxStuff.passwordCreate2.position(CANX/2 - this.buttonSize + inter - this.spacing, CANY/2 - this.buttonLevel + b_height+ this.accountBoxStuff.usernameInput.size().height*4 + this.spacing + inter*3)
          this.accountBoxStuff.createAccount = createButton('Sign Up')
            .parent('P5Container')
            .size(this.buttonSize - idfs- this.spacing*2, this.accountBoxStuff.usernameInput.size().height*3 + inter*2)
          this.accountBoxStuff.createAccount.position(CANX/2 - this.buttonSize + inter + idfs, CANY/2 - this.buttonLevel + inter+ this.accountBoxStuff.usernameInput.size().height*2 + b_height + this.spacing)
          this.accountBoxStuff.createAccount.mousePressed(() => {
            signUp()
          })

          //back
          this.accountBoxStuff.back = createButton('Back')
            .parent('P5Container')
            .size(this.buttonSize, this.accountBoxStuff.usernameInput.size().height)
          this.accountBoxStuff.back.position(CANX/2 - this.buttonSize - this.spacing, CANY/2 - this.buttonLevel + b_height*3 + this.spacing*2 + 2)
          this.accountBoxStuff.back.mousePressed(() => {
            this.logDone()
          })
      })
      if (socket.connected == false) {
        gameButtons.accountInfo.attribute("disabled", "")
      }
      gameButtons.hubToMenu = createButton('Back')
        .parent('P5Container')
        .position(CANX/2 - this.buttonSize - this.spacing, CANY/2 - this.buttonLevel + b_height*2 + this.spacing*2+ this.spacing*2) 
        .size(this.buttonSize, b_height)
        .mousePressed(() => {
            ScenesManager.changeScene(STARTSCREEN, mainInterfaceSpeed)
      })
    },
    run: function() {
      textAlign(LEFT, TOP)
      if (this.showAccountBox) {
        image(this.flippedBg, 0, 0)
        fill(0, 0, 255, 140)
      } else {
        image(ASSETS.namedImages.modeSelectBG, 0, 0)
        fill(125, 0, 215, 120)
      }
      updateParticleSystems()
      //fill(Math.sin(frameCount/60)**2 * 255, 0, Math.cos(frameCount/60)**2 * 255, Math.cos(frameCount/60 + 90)**2 * 80 + 100)
      rect(0, 0, CANX, CANY)

      let b_height = this.buttonSize * this.heightMult

      fill(55, 0, 55, 180)
      stroke(0)
      strokeWeight(2)
      rect(CANX/2 - this.buttonSize - this.spacing*2, CANY/2 - this.buttonLevel - this.spacing, this.buttonSize*2 + this.spacing*4, b_height*3 + this.spacing*6)

      noStroke()
      fill(0)
      rect(CANX/2 + this.spacing, CANY/2 - this.buttonLevel, this.buttonSize, b_height*3 + this.spacing*4)

      fill(255)
      text("Highscores and Info", CANX/2 + this.spacing, CANY/2 - this.buttonLevel)
      
      if (this.showAccountBox) {
        this.accountDialog()
      }

      push()
      textAlign(LEFT, BOTTOM)
      if (gameState.authorisedUser != null && accountData != null) {
        text("Signed into: " + accountData.Username.toString(), CANX/2 - this.buttonSize - this.spacing*2, CANY/2 - this.buttonLevel - this.spacing)
      } else {
        text("Not Signed In", CANX/2 - this.buttonSize - this.spacing*2, CANY/2 - this.buttonLevel - this.spacing)
      }
      pop()

      if (socket.connected == false) {
        gameButtons.accountInfo.attribute("disabled", "")
      } else {
        gameButtons.accountInfo.removeAttribute("disabled")
      }
    },
    accountDialog: function() {
      let b_height = this.buttonSize * this.heightMult
      push()
      text("SIGN IN TO ROGUES", CANX/2 - this.buttonSize - this.spacing/2, CANY/2 - this.buttonLevel + this.spacing/2)
      fill(0, 255, 255, 80)
      stroke(255)
      rect(CANX/2 - this.buttonSize - this.spacing, CANY/2 - this.buttonLevel, this.buttonSize, b_height+ this.accountBoxStuff.usernameInput.size().height)
      pop()

      push()
      text("CREATE A ROGUES ID", CANX/2 - this.buttonSize - this.spacing/2, CANY/2 - this.buttonLevel + b_height+ this.accountBoxStuff.usernameInput.size().height + this.spacing + this.spacing/2)
      fill(0, 255, 255, 80)
      stroke(255)
      rect(CANX/2 - this.buttonSize - this.spacing, CANY/2 - this.buttonLevel + b_height+ this.accountBoxStuff.usernameInput.size().height + this.spacing, this.buttonSize, b_height*2 + this.spacing - this.accountBoxStuff.usernameInput.size().height)
      pop()

      if (keyIsDown(ENTER)) {
        if (this.accountBoxStuff.usernameInput.elt === document.activeElement || this.accountBoxStuff.passwordInput.elt === document.activeElement) {
          logIn()
        } else if (this.accountBoxStuff.usernameCreate.elt === document.activeElement || this.accountBoxStuff.passwordCreate1.elt === document.activeElement || this.accountBoxStuff.passwordCreate2.elt === document.activeElement) {
          signUp()
        } else {
          if (this.accountBoxStuff.usernameInput.value().length > this.accountBoxStuff.usernameCreate.value().length) {
            logIn()
          } else {
            signUp()
          }
        }
      }

      if (!(currentPacket == null)) {
        switch (currentPacket.name) {
          case "loginCode":
            switch (currentPacket.data.code) {
              case "successful":
                gameState.authorisedUser = currentPacket.data.userID
                //console.log("Logged into:", gameState.authorisedUser)
                socket.emit("requestUserData", {ID: gameState.authorisedUser, latency: latency})
                break
              case "badpassword":
                console.log("bad password")
                break
              case "badusername":
                console.log("bad username")
                break
            }
            break
          case "signupCode":
            switch (currentPacket.data.code) {
              case "successful":
                break
              case "usernameTaken":
                break
            }
            break
          case "userDataCode":
            switch (currentPacket.data.code) {
              case "successful":
                accountData = currentPacket.data.userData
                this.logDone()
                break
              case "badID":
                window.close()
                break
            }
            break
        }
        resetPacket()
      }
    },
    buttonSize: 0,
    buttonLevel: 0,
    spacing: 0,
    heightMult: 0,
    showAccountBox: false,
    accountBoxStuff: {},
    flippedBg: null,
    logDone: function() {
      this.showAccountBox = false
      let keys = Object.keys(this.accountBoxStuff)
      for (let key of keys) {
        this.accountBoxStuff[key].remove()
      }
      this.start()
    }
  }
}
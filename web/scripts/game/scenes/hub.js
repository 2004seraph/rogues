"use strict";
loadScenes.hubScene = function() {
  ScenesManager.scenes[MAINMENU] = {
    preCompute: function() {
      this.flippedBg = ASSETS.namedImages.modeSelectBG.tint(0, 255, 0)
      this.accountOnlineImg = ASSETS.namedImages.account.tint(255, 0, 255)
      //this.accountOnlineImg = this.accountOnlineImg.resize(16, 16)

      //online, offline, back, account
      //this.buttonSize = 450
      //this.spacing = 20
      //this.buttonLevel = 170//lower = bottom
      //this.heightMult = 1/4.5
    },
    start: function() {
      playingOnline = false
      
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
      let b_height = this.buttonSize * this.heightMult

      gameButtons.logoutButton = createButton("Logout")
        .parent('P5Container')
        .attribute("title", "Sign out")
        .size(this.buttonSize*0.4, this.spacing*2)
        .position(CANX/2 + this.buttonSize + this.spacing*2 - this.buttonSize*0.4, CANY/2 - this.buttonLevel - this.spacing*3)
        .mousePressed(() => {
          logOut()
          doSound("back")
      })

      if (accountData != null) {

      } else {
        gameButtons.logoutButton.attribute("disabled", "")
      }

      gameButtons.offlinePlayButton = createButton("Offline Play")
        .parent('P5Container')
        .position(CANX/2 - this.buttonSize - this.spacing, CANY/2 - this.buttonLevel)
        .attribute("title", "Play on the same keyboard")
        .size(this.buttonSize, b_height).mousePressed(() => {
          ScenesManager.changeScene(CHARACTERSELECT, mainInterfaceSpeed)
          doSound("click")
      })

      gameButtons.onlinePlayButton = createButton("Online Play")
        .parent('P5Container')
        .position(CANX/2 - this.buttonSize - this.spacing, CANY/2 - this.buttonLevel + b_height + this.spacing)
        .size(this.buttonSize * 0.6 + this.spacing, b_height)
        .attribute("title", "Play with someone across the world")
        .mousePressed(() => {
          if (accountData != null) {
            doSound("click")
            this.showGameBox = true
            clearButtons()

            let inter = this.spacing/2
            let idfs = 270

            //Join a game
            this.gameBoxStuff.joinCodeInput = createInput()
              .attribute('placeholder', 'Game code')
              .attribute("spellcheck", false)
              .parent('P5Container')
              .size(this.buttonSize - inter*3)
            this.gameBoxStuff.joinCodeInput.position(CANX/2 - this.buttonSize + inter - this.spacing, CANY/2 - this.buttonLevel + inter+ this.gameBoxStuff.joinCodeInput.size().height)
            this.gameBoxStuff.joinGameButton = createButton('Join game')
              .parent('P5Container')
              .size(this.gameBoxStuff.joinCodeInput.size().width, this.gameBoxStuff.joinCodeInput.size().height)
              .position(CANX/2 - this.buttonSize + inter - this.spacing, CANY/2 - this.buttonLevel + inter*2 + this.gameBoxStuff.joinCodeInput.size().height*2)
              .mousePressed(() => {
                joinGame()
                doSound("click")
              })
            //create a game
            this.gameBoxStuff.createGameButton = createButton('create game')
              .parent('P5Container')
              .size(this.gameBoxStuff.joinCodeInput.size().width + inter*2, this.gameBoxStuff.joinCodeInput.size().height*2 + inter)
              .position(CANX/2 - this.buttonSize - this.spacing, CANY/2 - this.buttonLevel + inter*5 + this.gameBoxStuff.joinCodeInput.size().height*3)
              .mousePressed(() => {
                createGame()
                doSound("click")
              })

            //matchmake
            this.gameBoxStuff.matchmakeButton = createButton('join random')
              .parent('P5Container')
              .size(this.gameBoxStuff.joinCodeInput.size().width + inter*2, this.gameBoxStuff.joinCodeInput.size().height*2 + inter)
              .position(CANX/2 - this.buttonSize - this.spacing, CANY/2 - this.buttonLevel + inter*7 + this.gameBoxStuff.joinCodeInput.size().height*5)
              .mousePressed(() => {
                matchmakeGame()
                doSound("click")
              })

            //back
            this.gameBoxStuff.back = createButton('Back')
              .parent('P5Container')
              .size(this.buttonSize, this.gameBoxStuff.joinCodeInput.size().height)
              .position(CANX/2 - this.buttonSize - this.spacing, CANY/2 - this.buttonLevel + b_height*3 + this.spacing*2 + 2)
              .mousePressed(() => {
                this.logDone()
                doSound("back")
            })
          }
      })

      if (accountData == null) {
        gameButtons.onlinePlayButton.attribute("disabled", "").attribute("title", "Sign in to play online")
      }

      gameButtons.accountInfo = createButton("")
        .parent('P5Container')
        .position(CANX/2 - this.buttonSize*0.4 + this.spacing, CANY/2 - this.buttonLevel + b_height + this.spacing)
        .size(this.buttonSize * 0.4 - this.spacing*2, b_height)
        .id("accountButton")
        .attribute("title", "Account")
        .mousePressed(() => {
          doSound("click")
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
            doSound("click")
            //this.logDone()
          })

          //sign up
          this.accountBoxStuff.usernameCreate = createInput()
            .attribute('placeholder', 'Username')
            .attribute('maxlength', globalServerInfo.username.max)
            .attribute("autocomplete", "nickname")
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
            doSound("click")
          })

          //back
          this.accountBoxStuff.back = createButton('Back')
            .parent('P5Container')
            .size(this.buttonSize, this.accountBoxStuff.usernameInput.size().height)
          this.accountBoxStuff.back.position(CANX/2 - this.buttonSize - this.spacing, CANY/2 - this.buttonLevel + b_height*3 + this.spacing*2 + 2)
          this.accountBoxStuff.back.mousePressed(() => {
            this.logDone()
            doSound("back")
          })
      })
      if (socket.connected == false) {
        gameButtons.accountInfo.attribute("disabled", "")
        gameButtons.logoutButton.attribute("disabled", "")
      }
      gameButtons.hubToMenu = createButton('Back')
        .parent('P5Container')
        .position(CANX/2 - this.buttonSize - this.spacing, CANY/2 - this.buttonLevel + b_height*2 + this.spacing*2+ this.spacing*2) 
        .size(this.buttonSize, b_height)
        .mousePressed(() => {
            ScenesManager.changeScene(STARTSCREEN, mainInterfaceSpeed)
            doSound("back")
      })
    },
    run: function() {
      textAlign(LEFT, TOP)
      noStroke()
      if (this.showAccountBox) {
        image(this.flippedBg, 0, 0)
        fill(0, 0, 255, 140)
      } else if (this.showGameBox) {
        image(this.flippedBg, 0, 0)
        fill(0, 255, 255, 140)
      } else {
        image(ASSETS.namedImages.modeSelectBG, 0, 0)
        fill(125, 0, 215, 120)
      }
      updateParticleSystems()
      rect(0, 0, CANX, CANY)//tint everything to tie it together

      let b_height = this.buttonSize * this.heightMult
      
      //main wrapper
      push()
      fill(55, 0, 55, 195)
      stroke(0)
      strokeWeight(2)
      rect(CANX/2 - this.buttonSize - this.spacing*2, CANY/2 - this.buttonLevel - this.spacing, this.buttonSize*2 + this.spacing*4, b_height*3 + this.spacing*6)
      pop()

      //highscores board
      push()
      textSize(24)
      let inter = this.spacing/2
      if (!(currentStatsPacket == null)) {
        switch (currentStatsPacket.name) {
          case "gameStatisticsCode":
            switch (currentStatsPacket.data.code) {
              case "successful":
                this.rankings = currentStatsPacket.data.rankings
                this.onlineUsers = currentStatsPacket.data.onlineUsers
                break
            }
            currentStatsPacket = null
            break
        }
      }
      //wrapper
      stroke(255, 0, 100)
      fill(60, 0, 255)
      rect(CANX/2 + this.spacing, CANY/2 - this.buttonLevel, this.buttonSize, b_height*3 + this.spacing*4)
      //server info wrapper
      fill(123, 36, 255)
      rect(CANX/2 + this.spacing + inter, CANY/2 - this.buttonLevel + inter, this.buttonSize - inter*2, b_height - inter*2)
      fill(255)
      textAlign(CENTER, TOP)
      text("Server Info", CANX/2 + this.spacing + inter + (this.buttonSize - inter*2)/2, CANY/2 - this.buttonLevel + inter*2)
      image(this.accountOnlineImg, CANX/2 + this.spacing + inter*2, CANY/2 - this.buttonLevel + inter + b_height/2 - inter, 32, 32)
      fill(0, 255, 255)
      textAlign(LEFT, CENTER)
      if (this.onlineUsers != null) {
        text(this.onlineUsers.toString() + " Online Players", CANX/2 + this.spacing + inter*3 + 32, CANY/2 - this.buttonLevel + inter*1.75 + b_height/2)
      } else {
        text("Retrieving...", CANX/2 + this.spacing + inter*3 + 32, CANY/2 - this.buttonLevel + inter*1.75 + b_height/2)
      }
      //rankings
      fill(123, 36, 255)
      rect(CANX/2 + this.spacing + inter, CANY/2 - this.buttonLevel + b_height, this.buttonSize - inter*2, b_height*3 - inter*3)
      textAlign(CENTER, TOP)
      fill(255)
      text("Rankings", CANX/2 + this.spacing + inter + (this.buttonSize - inter*2)/2, CANY/2 - this.buttonLevel + b_height + inter)
      fill(0, 255, 255)
      if (this.rankings != null) {
        //show the top 9 players
        for (let r = 0; r < this.rankings.length; r++) {
          let record = this.rankings[r]
          textAlign(LEFT, TOP)
          text((r + 1).toString() + ". " + record.Username, CANX/2 + this.spacing + inter*2, CANY/2 - this.buttonLevel + b_height + this.spacing * r + this.spacing*2)
          textAlign(RIGHT, TOP)
          text(record.Elo, CANX/2 + this.spacing + this.buttonSize - inter*2, CANY/2 - this.buttonLevel + b_height + this.spacing * r + this.spacing*2)
        }

        //then add the current player's ranking below
        if (accountData != null) {
          textAlign(LEFT, TOP)
          text(accountData.Username + "[YOU]", CANX/2 + this.spacing + inter*2, CANY/2 - this.buttonLevel + b_height + this.spacing * 9 + this.spacing*2 + inter)
          textAlign(RIGHT, TOP)
          text(accountData.Elo, CANX/2 + this.spacing + this.buttonSize - inter*2, CANY/2 - this.buttonLevel + b_height + this.spacing * 9 + this.spacing*2 + inter)
        }
      } else {
        textAlign(LEFT, TOP)
        text("Retrieving...", CANX/2 + this.spacing + inter*2, CANY/2 - this.buttonLevel + b_height + inter*2 + this.spacing)
      }
      pop()

      if (this.showAccountBox) {
        this.accountDialog()
      } else if (this.showGameBox) {
        this.gameBox()
      }

      //ACCOUNT STATUS
      push()
      fill(255)
      textAlign(LEFT, BOTTOM)
      if (accountData != null) {
        text("Signed into: " + accountData.Username.toString(), CANX/2 - this.buttonSize - this.spacing*2, CANY/2 - this.buttonLevel - this.spacing)
      } else {
        text("Not Signed In", CANX/2 - this.buttonSize - this.spacing*2, CANY/2 - this.buttonLevel - this.spacing)
      }
      pop()

      if (socket.connected == false) {
        gameButtons.accountInfo.attribute("disabled", "")
        gameButtons.logoutButton.attribute("disabled", "")
        this.rankings = null
        this.onlineUsers = null
      } else {
        gameButtons.accountInfo.removeAttribute("disabled")
        if (frameCount % 200 == 0) {
          socket.emit("requestGameStatistics", {latency: latency})
        }
      }
      if (accountData == null) {
        gameButtons.logoutButton.attribute("disabled", "")
        gameButtons.onlinePlayButton.attribute("disabled", "").attribute("title", "Sign in to play online")
      }
    },
    gameBox: function() {
      let b_height = this.buttonSize * this.heightMult
      push()
      fill(111, 90, 250, 130)
      stroke(255)
      rect(CANX/2 - this.buttonSize - this.spacing, CANY/2 - this.buttonLevel, this.buttonSize, b_height+ this.gameBoxStuff.joinCodeInput.size().height)
      noStroke()
      fill(245, 196, 255)
      text("JOIN A FRIEND", CANX/2 - this.buttonSize - this.spacing/2, CANY/2 - this.buttonLevel + this.spacing/2)
      pop()

      if (!(currentPacket == null)) {
        switch (currentPacket.name) {
          case "roomCode":
            switch (currentPacket.data.code) {
              case "alreadyInRoom":
                setPrompt(new Prompt(10, 10, "Already created a room", 300))
                break
              case "noAuth":
                setPrompt(new Prompt(10, 10, "Not signed in", 300))
                break
              case "successfulCreation":
                setPrompt(new Prompt(10, 10, "Created room", 300))
                //successful
                console.log("room created:", currentPacket.data.room)
                break
              case "joinedRoom":
                setPrompt(new Prompt(10, 10, "Joined room", 300))
                break
              case "roomFull":
                setPrompt(new Prompt(10, 10, "Room full", 300))
                break
              case "roomNoExist":
                setPrompt(new Prompt(10, 10, "Room doesn't exist", 300))
                break
            }
            resetPacket()
            break
        }
      }
    },
    accountDialog: function() {
      let b_height = this.buttonSize * this.heightMult
      push()
      fill(111, 90, 250, 130)
      stroke(255)
      rect(CANX/2 - this.buttonSize - this.spacing, CANY/2 - this.buttonLevel, this.buttonSize, b_height+ this.accountBoxStuff.usernameInput.size().height)
      noStroke()
      fill(245, 196, 255)
      text("SIGN IN TO ROGUES", CANX/2 - this.buttonSize - this.spacing/2, CANY/2 - this.buttonLevel + this.spacing/2)
      pop()

      push()
      fill(111, 90, 250, 130)
      stroke(255)
      rect(CANX/2 - this.buttonSize - this.spacing, CANY/2 - this.buttonLevel + b_height+ this.accountBoxStuff.usernameInput.size().height + this.spacing, this.buttonSize, b_height*2 + this.spacing - this.accountBoxStuff.usernameInput.size().height)
      noStroke()
      fill(245, 196, 255)
      text("CREATE A ROGUES ID", CANX/2 - this.buttonSize - this.spacing/2, CANY/2 - this.buttonLevel + b_height+ this.accountBoxStuff.usernameInput.size().height + this.spacing + this.spacing/2)
      pop()

      if (!(currentPacket == null)) {
        switch (currentPacket.name) {
          case "loginCode":
            switch (currentPacket.data.code) {
              case "successful":
                socket.emit("requestUserData", {latency: latency})
                setPrompt(new Prompt(10, 10, "Signed in", 300))
                break
              case "badpassword":
                setPrompt(new Prompt(10, 10, "Wrong password", 300))
                break
              case "badusername":
                setPrompt(new Prompt(10, 10, "Wrong username", 300))
                break
              case "alreadyonline":
                setPrompt(new Prompt(10, 10, "Account currently online", 300))
                break
            }
            resetPacket()
            break
          case "signupCode":
            switch (currentPacket.data.code) {
              case "successful":
                setPrompt(new Prompt(10, 10, "Account created", 300))
                break
              case "usernameTaken":
                setPrompt(new Prompt(10, 10, "Username taken", 300))
                break
              case "creationCooldown":
                setPrompt(new Prompt(10, 10, "Too Many sign ups", 300))
                break
            }
            resetPacket()
            break
          case "userDataCode":
            switch (currentPacket.data.code) {
              case "successful":
                accountData = currentPacket.data.userData
                this.logDone()
                break
              case "badAuth":
                console.log("badauth")
                break
            }
            resetPacket()
            break
        }
      }
    },
    buttonSize: 450,
    buttonLevel: 170,
    spacing: 20,
    heightMult: 1/4.5,
    showAccountBox: false,
    accountBoxStuff: {},
    showGameBox: false,
    gameBoxStuff: {},
    logDone: function() {
      this.showAccountBox = false
      this.showGameBox = false
      let keys = Object.keys(this.accountBoxStuff)
      for (let key of keys) {
        this.accountBoxStuff[key].remove()
      }
      let keys2 = Object.keys(this.gameBoxStuff)
      for (let key2 of keys2) {
        this.gameBoxStuff[key2].remove()
      }
      this.start()
    },
    flippedBg: null,
    rankings: null,
    onlineUsers: null,
    accountOnlineImg: null
  }
}
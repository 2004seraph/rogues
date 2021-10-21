"use strict";
function createScenes() {
  let scenes = {}

  scenes[LOADINGSCREEN] = {
    start: function() {},
    run: function() {
      background(0, 0, 255)
      Loader.show()
      
      if (Loader.complete() && gameLoaded == false) {
        gameLoaded = true
        ScenesManager.changeScene(STARTSCREEN, mainInterfaceSpeed * 3)
      }
    }
  }

  //STARTSCREEN
  scenes[STARTSCREEN] = {
    start: function() {
      textFont(ASSETS.fonts.common)

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

  //MAINMENU
  scenes[MAINMENU] = {
    start: function() {
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
          clickedFunction: function () {
            //this.disable()
            //ScenesManager.changeScene(STARTSCREEN, mainInterfaceSpeed)
          }, mouseOverFunction: function () {

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
    },
    run: function() {
      image(ASSETS.namedImages.modeSelectBG, 0, 0)

      let b_height = this.buttonSize * this.heightMult

      fill(255, 0, 255)
      rect(CANX/2 - this.buttonSize - this.spacing - this.spacing, CANY/2 - this.buttonLevel - this.spacing, this.buttonSize*2 + this.spacing*2 + this.spacing*2, b_height*3 + this.spacing*4 + this.spacing*2)
      
      fill(0)
      rect(CANX/2 + this.spacing, CANY/2 - this.buttonLevel, this.buttonSize, b_height*3 + this.spacing*4)
      fill(255)
      text("Highscores", CANX/2 + this.spacing, CANY/2 - this.buttonLevel)
    },

    buttonSize: 0,
    buttonLevel: 0,
    spacing: 0,
    heightMult: 0
  }

  scenes[CHARACTERSELECT] = {
    start: function() {
      let cornerWidth = 240
      buttons.back = new Button(10, 10, cornerWidth, 50, 
        function () {
          textAlign(LEFT, TOP)
          fill(255)
          rect(this.spacial.x, this.spacial.y, this.spacial.w, this.spacial.h)
          fill(0)
          text("Back", this.spacial.x, this.spacial.y)

        }, {
          clickedFunction: function () {
            this.disable()
            ScenesManager.changeScene(MAINMENU, mainInterfaceSpeed)
          }, mouseOverFunction: function () {

          }
        }
      )
      buttons.continueSelection = new Button(CANX - cornerWidth - 10, 10, cornerWidth, 50, 
        function () {
          textAlign(LEFT, TOP)
          if (scenes[CHARACTERSELECT].selection.player1 !== null && scenes[CHARACTERSELECT].selection.player2 !== null) {
            fill(255)
          } else {
            fill(80)
          }
          rect(this.spacial.x, this.spacial.y, this.spacial.w, this.spacial.h)
          fill(0)
          text("Continue", this.spacial.x, this.spacial.y)

        }, {
          clickedFunction: function () {
            if (scenes[CHARACTERSELECT].selection.player1 !== null && scenes[CHARACTERSELECT].selection.player2 !== null) {
              this.disable()
              ScenesManager.changeScene(LEVELSELECT, mainInterfaceSpeed)
            }
            }, mouseOverFunction: function () {

            }
          }
      )

      let resetWidth = 400
      buttons.resetSelection = new Button(CANX/2 - resetWidth/2, 10, resetWidth, 50, 
        function () {
          if (scenes[CHARACTERSELECT].selection.player1 !== null) {
            textAlign(LEFT, TOP)
            fill(255)
            rect(this.spacial.x, this.spacial.y, this.spacial.w, this.spacial.h)
            fill(0)
            text("Reset Selection", this.spacial.x, this.spacial.y)
          }
        }, {
          clickedFunction: function () {
            if (scenes[CHARACTERSELECT].selection.player1 !== null) {
              scenes[CHARACTERSELECT].selection.player1 = null
              scenes[CHARACTERSELECT].selection.player2 = null
            }
            }, mouseOverFunction: function () {

            }
          }
      )

      this.readyStar = ASSETS.namedImages.starEmbelum
      this.unreadyStar = ASSETS.namedImages.starEmbelum.tint(0, 80, 0)

      this.playerCard = 200
      this.playerCardheight = 230
      this.cardSpacing = 60
      this.amountOfCharacters = Object.keys(characters).length

      this.screendivider = 100

      for (let i = 0; i < this.amountOfCharacters; i++) {
        let x = CANX/2 - (this.amountOfCharacters/2) * this.playerCard + i * (this.playerCard + this.cardSpacing) - this.cardSpacing/2
        let y = 140

        buttons[("characterSelect" + (i).toString())] = new Button(x, y, this.playerCard, this.playerCardheight, 
          function () {
          }, {
            clickedFunction: function () {
              if (scenes[CHARACTERSELECT].selection.player1 === null) {
                scenes[CHARACTERSELECT].selection.player1 = this.buttonVars.character
              } else {
                if (scenes[CHARACTERSELECT].selection.player2 === null) {
                  scenes[CHARACTERSELECT].selection.player2 = this.buttonVars.character
                }
              }
            }, mouseOverFunction: function () {
            }
          }, {
            character: i
          }
        )
      }

      this.showStats = function(char, x, y) {
        let seperation = (CANX/2 - 20)/2

        let nameString = characters[char].name
        fill(255)
        text(nameString, x + seperation - textWidth(nameString)/2, y)

        let statsObject = {
          "Size:": Math.floor((characters[char].dimensions.width * characters[char].dimensions.height) / 10).toString(),
          "Weight:": (Math.floor(characters[char].physics.mass * characters[char].physics.maxFallSpeed)).toString(),
          "Speed:": (Math.floor((characters[char].physics.maxSpeedLR) * (characters[char].physics.acceleration))).toString(),
          "Jumps:": characters[char].physics.totalJumps.toString(),
          "Power:": "-",
          "Defense:": characters[char].game.defence.toString()
        }
        fill(0)
        let statKeys = Object.keys(statsObject)
        for (let i = 0; i < statKeys.length; i++) {
          text(statKeys[i], x + 10, y + 10 + textAscent() * i + textAscent())
          text(statsObject[statKeys[i]], x + 10 + seperation, y + 10 + textAscent() * i + textAscent())
        }
      }
    },
    run: function() {
      background(0)
      image(ASSETS.namedImages.characterSelect, 0, 0, CANX, CANY)
      
      //selected characters
      fill(100)
      let x = 10
      let y = CANY/2 + this.screendivider
      rect(x, y, CANX/2 - 20, CANY/2 - 10 - this.screendivider)
      if (this.selection.player1 !== null) {
        this.showStats(this.selection.player1, x, y)
      }

      fill(100)
      x = CANX/2 + 10
      rect(x, y, CANX/2 - 20, CANY/2 - 10 - this.screendivider)
      if (this.selection.player2 !== null) {
        this.showStats(this.selection.player2, x, y)
      }

      //character selection
      for (let i = 0; i < this.amountOfCharacters; i++) {
        x = CANX/2 - (this.amountOfCharacters/2) * this.playerCard + i * (this.playerCard + this.cardSpacing) - this.cardSpacing/2
        y = 140

        let extra = 12
        if (this.selection.player1 === i) {
          fill(0, 255, 255)
          rect(x - extra*2, y - extra*2, this.playerCard + extra * 4, this.playerCardheight + extra * 4)
          push()
          textAlign(LEFT, BOTTOM)
          text("Player 1", x, y - extra*2 - 2)
          pop()
        }
        if (this.selection.player2 === i) {
          fill(255, 0, 255)
          rect(x - extra, y - extra, this.playerCard + extra * 2, this.playerCardheight + extra * 2)
          push()
          textAlign(LEFT, TOP)
          text("Player 2", x, y + this.playerCardheight + extra*2)
          pop()
        }

        push()
        fill(0, 0, 255, 80)
        stroke(255)
        strokeWeight(1)
        rect(x, y, this.playerCard, this.playerCardheight)
        image(ASSETS.characterImages[characters[i].profilePicture], x, y)
        fill(255)
        text(characters[i].name, x, this.playerCardheight)
        pop()
      }

      //embelum
      push()
      imageMode(CENTER, CENTER)
      image(this.readyStar, CANX/2, CANY/2 + this.screendivider)
      pop()

      if (keyIsDown(27)) {
        this.selection.player2 = null
        this.selection.player1 = null
      }
    },
    selection: {
      player1: null,
      player2: null
    },
    showStats: function() {}
  }

  scenes[LEVELSELECT] = {
    start: function() {
      background(0)
      this.selection = 1
      ScenesManager.changeScene(GAME, mainInterfaceSpeed)
    }, run: function() {},
    selection: null
  }

  //GAME TESTING
  scenes[GAME] = {
    start: function() {
      initialiseLevel(scenes[LEVELSELECT].selection, scenes[CHARACTERSELECT].selection.player1, scenes[CHARACTERSELECT].selection.player2)
    },
    run: function() {
      background(100)
      if (dynamicCamera) {cameraTrack()}
      
      let playerParallax = {x: (isNaN(CANX/2 - averagePlayerPosition().x) != true) ? (CANX/2 - averagePlayerPosition().x) : 0, y: (isNaN(CANY/2 - averagePlayerPosition().y) != true) ? (CANY/2 - averagePlayerPosition().y) : 0}

      let speed = 0.5
      this.parallax.x += (playerParallax.x - this.parallax.x)/(1/speed)
      this.parallax.y += (playerParallax.y - this.parallax.y)/(1/speed)

      let currentStage = gameState.currentLevel
      if (currentStage.images[1] != null) {
        image(ASSETS.levelImages[currentStage.images[1]], 0 + this.parallax.x/(PARRALAX*1.15) - ((CANX * 1.5) - CANX)/2, 0 + this.parallax.y/(PARRALAX*1.15) - ((CANY * 1.5) - CANY)/2, CANX * 1.5, CANY * 1.5)
      }
      if (currentStage.images[2] != null) {
        image(ASSETS.levelImages[currentStage.images[2]], 0 + this.parallax.x/(PARRALAX*2.5), 0 + this.parallax.y/(PARRALAX*2.5), CANX, CANY)
      }
      if (currentStage.images[3] != null) {
        image(ASSETS.levelImages[currentStage.images[3]], 0, 0, CANX, CANY)
      }

      //DEBUG
      if (showColliders) {
        for (let collider of gameState.levelColliders) {
          collider.debug()
        }
      }

      let index = 0
      let totalPlayers = Object.keys(gameState.players).length

      for (let player in gameState.players) {
        let p = gameState.players[player]
        p.show()
        p.update()

        //GAMER TAGS
        push()
        fill(255)
        textSize(20)
        let gamerTagText = (index + 1).toString()
        let arrow = "▼"

        if (relativeGamerTagHeights) {
          let relativeTagHeight = 30
          text(gamerTagText, p.pos.x + (p.character.dimensions.width) / 2 - textWidth(gamerTagText) / 2, p.pos.y - relativeTagHeight - textAscent() - 1)

          textFont("Arial")
          text(arrow, p.pos.x + (p.character.dimensions.width) / 2 - textWidth(arrow) / 2, p.pos.y - relativeTagHeight)
        } else {
          text(gamerTagText, p.pos.x + (p.character.dimensions.width) / 2 - textWidth(gamerTagText) / 2, p.pos.y - (GAMERTAGHEIGHT - p.character.dimensions.height) - textAscent())

          textFont("Arial")
          text(arrow, p.pos.x + (p.character.dimensions.width) / 2 - textWidth(arrow) / 2, p.pos.y - (GAMERTAGHEIGHT - p.character.dimensions.height))
        }
        pop()
        
        drawDamageBox(CANX / totalPlayers * index + (CANX / totalPlayers)/2, CANY - 100, p)
        index++
      }
    },
    parallax: {x: 0, y: 0}
  }

  //CREDITS
  scenes[CREDITS] = {
    start: function() {
    },
    run: function() {
    }
  }

  return scenes
}


function drawDamageBox(x, y, player) {
  push()
  resetGameMatrix()
  let location = {x: x - 100, y: y, w: 200, h: 70}

  strokeWeight(3)
  stroke(255)
  fill(0, 0, 60, 130)
  rect(location.x, location.y, location.w, location.h)
  textAlign(RIGHT, TOP)
  fill(0, 255, 255, 255)
  text(player.damage.toString() + "%", location.x + location.w - 10, location.y)
  
  fill(0, 0, 0, 255)
  rect(location.x + 5, location.y + 5, location.h - 10, location.h - 10)
  let pfpImage = ASSETS.characterImages[player.character.profilePicture]
  let resize = 2
  image(pfpImage, location.x + 5 + resize, location.y + 5 + resize, location.h - 10 - resize*2, location.h - 10 - resize*2, 0, 0, location.h - 10, location.h - 10)
  pop()
}
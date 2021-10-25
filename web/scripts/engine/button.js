"use strict";
var gameButtons = {}
var buttons = {}

function updateButtons() {
  let bk = Object.keys(buttons)
  for (let prop in buttons) {
    //if the buttons are cleared in a button function, stop execution
    if (Object.keys(buttons).length > 0) {
      buttons[prop].update()
    } else {
      break
    }
    if (Object.keys(buttons).length > 0) {
      buttons[prop].run()
    } else {
      break
    }
  }
}

function globalButtonState(s=false) {
  for (let prop in buttons) {
    buttons[prop].state = s
  }
}

function clearButtons() {
  let butts = Object.keys(gameButtons)
  for (let butty of butts) {
    gameButtons[butty].remove()
  }
}

class Button {
  constructor(x, y, w, h, 
    displayFunction=null, 
    logic={}, 
    buttonVars = {}, 
    show=true
  ) {

    if (logic.hasOwnProperty("clickedFunction") == false) {
      logic.clickedFunction = function() {}
    }
    if (logic.hasOwnProperty("pressedFunction") == false) {
      logic.pressedFunction = function() {}
    }
    if (logic.hasOwnProperty("releasedFunction") == false) {
      logic.releasedFunction = function() {}
    }
    if (logic.hasOwnProperty("mouseOverFunction") == false) {
      logic.mouseOverFunction = function() {}
    }

    this.state = true//active
    this.spacial = {
      x: x,
      y: y,
      w: w,
      h: h
    }
    this.show = show

    this.clicked = false
    this.pressed = false
    this.mouseOver = false
    this.released = false

    this.deltaHeld = 0

    this._displayFunction = displayFunction

    this._clickedFunction = logic.clickedFunction
    this._pressedFunction = logic.pressedFunction
    this._releasedFunction = logic.releasedFunction
    this._mouseOverFunction = logic.mouseOverFunction

    this.buttonVars = buttonVars

    this._clickCheck = false

    this.debug = false
  }

  run() {
    if (this.show) {
      if (this.debug || this._displayFunction === null) {
        push()
        let expand = 0

        strokeWeight(3)
        if (this.mouseOver) {
          stroke(0, 255, 0)
        } else {
          stroke(255)
        }

        fill(100)
        if (this.pressed) {
          fill(255, 0, 0)
        }
        if (this.released) {
          fill(0, 255, 255)
          expand = 20
        }

        rect(this.spacial.x - expand/2, this.spacial.y - expand/2, this.spacial.w + expand, this.spacial.h + expand)

        fill(0)
        noStroke()
        textAlign(CENTER, CENTER)
        textSize(32)
        text("PLACEHOLDER", this.spacial.x + this.spacial.w/2, this.spacial.y + this.spacial.h/2)
        pop()
      }
      
      if (this._displayFunction !== null) {
        this._displayFunction()
      }

      if (this.state) {
        if (this.mouseOver) {
          this._mouseOverFunction()
        }
        if (this.pressed) {
          this.deltaHeld++
          this._pressedFunction()
        }
        if (this.clicked) {
          this._clickedFunction()
        }
        if (this.released) {
          this.deltaHeld = 0
          this._releasedFunction()
        }
      
        this.clicked = false
        this.released = false
      }
    }
  }

  enable() {
    this.state = true
  }
  disable() {
    this.clicked = false
    this.pressed = false
    this.mouseOver = false
    this.released = false

    this.state = false
  }
  showButton() {
    this.show = true
  }
  hideButton() {
    this.clicked = false
    this.pressed = false
    this.mouseOver = false
    this.released = false
    
    this.show = false
  }

  update() {
    let bs = 1 / (resolutionMultiplier * (1/resolutionMultiplier))
    // noFill()
    // stroke(255, 255, 0)
    // rect(this.spacial.x / bs, this.spacial.y / bs, this.spacial.w / bs, this.spacial.h / bs)

    // fill(0, 0, 255)
    // ellipse(mouseX * 1/(resolutionMultiplier) - CANX * resolutionMultiplier, mouseY * 1/(resolutionMultiplier) - CANX * resolutionMultiplier, 10, 10)

    if (this.state && this.show) {
      if (mouseX * 1/(resolutionMultiplier) - CANX * (1-resolutionMultiplier) > this.spacial.x / bs && mouseX * 1/(resolutionMultiplier) - CANX * (1-resolutionMultiplier) < this.spacial.x / bs + this.spacial.w / bs && mouseX > 0 && mouseX < CANX) {
        if (mouseY * 1/(resolutionMultiplier) - CANY * (1-resolutionMultiplier) > this.spacial.y / bs && mouseY * 1/(resolutionMultiplier) - CANY * (1-resolutionMultiplier) < this.spacial.y / bs + this.spacial.h / bs && mouseY > 0 && mouseY < CANY) {
          this.mouseOver = true
          //cursor('pointer')

          if (mouseIsPressed) {
            this.pressed = true
            this._clickCheck = true
          } else {
            this._depress()
            if (this._clickCheck == true) {
              this._clickCheck = false
              this.clicked = true
            }
          }
        } else {
          this.mouseOver = false
          if (mouseIsPressed == false) {
            this._depress()
          }
        }
      } else {
        this.mouseOver = false
        //cursor('default')

        if (mouseIsPressed == false) {
          this._depress()
        }
      }
    }


    // if (this.state == false) {
    //   if (mouseX > this.spacial.x && mouseX < this.spacial.x + this.spacial.w && mouseX > 0 && mouseX < CANX) {
    //     if (mouseY > this.spacial.y && mouseY < this.spacial.y + this.spacial.h && mouseY > 0 && mouseY < CANY) {
    //       //cursor('not-allowed')
    //     } else {
    //       //cursor('default')
    //     }
    //   } else {
    //     //cursor('default')
    //   }
    // }
  }

  _depress() {
    if (this.pressed == true) {
      this.released = true
    }

    this.pressed = false
  }
}
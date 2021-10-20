"use strict";
class LoadingBar {
  constructor(x, y, width, height, roots) {
    this.pos = {x: x, y: y}
    this.dimensions = {width: width, height: height}

    this.totalItems = roots
    this.currentItems = 0

    this.barProgress = 0

    this.smooth = 3
  }

  show() {
    if (this.totalItems > 0) {
      this.barProgress += (map(this.currentItems, 0, this.totalItems, 0, this.dimensions.width) - this.barProgress)/this.smooth * timeScaler()

      // var rad = 50
      // var clr1  = 'hsl(0,100%,100%)'; // we are not seeing this part of the gradient
      // var clr2  = 'hsl(180,100%,100%)';
      // var grd=drawingContext.createRadialGradient(-rad/3,-rad/3,rad,-rad/3,-rad/3,0);
      // grd.addColorStop(0.0,clr1);
      // grd.addColorStop(1.0,clr2);
      // drawingContext.fillStyle = grd;

      fill(180, 2, 255)
      drawingContext.shadowColor = 'darkblue'
      drawingContext.shadowOffsetX = 5
      drawingContext.shadowOffsetY = -5
      rect(this.pos.x, this.pos.y, this.dimensions.width, this.dimensions.height)

      fill(255)
      drawingContext.shadowOffsetX = 0
      drawingContext.shadowOffsetY = 0
      if (!this.complete()) {
        rect(this.pos.x, this.pos.y, this.barProgress, this.dimensions.height, 0, 20, 20, 0)
      } else {
        rect(this.pos.x, this.pos.y, this.barProgress, this.dimensions.height)
      }
    }
    
    fill(0)
    text("LOADING GAME", this.pos.x + this.dimensions.width/2, this.pos.y + this.dimensions.height/2)
  }

  increment() {
    this.currentItems++
  }

  changeLimit(a) {
    this.totalItems += a
    this.barProgress = map(this.currentItems, 0, this.totalItems, 0, this.dimensions.width)
  }

  complete() {
    if (this.currentItems >= this.totalItems) {
      return true
    }
    
    return false
  }
}
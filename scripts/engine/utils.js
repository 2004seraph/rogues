"use strict";
//P5 HELPER FUNCTIONS
p5.Image.prototype.tint = function (r, g, b, a=255) {
  let tintedImage = createGraphics(this.width, this.height)
	tintedImage.tint(r, g, b, a)
	tintedImage.image(this, 0, 0)
  
  return tintedImage
}
p5.Image.prototype.resize = function (x, y) {
  let newImage = createGraphics(x, y)
	newImage.image(this, 0, 0, x, y)
  
  return newImage
}
p5.Image.prototype.flip = function (dir) {
  let newImage = createGraphics(this.width, this.height)
  if (dir == X) {
    newImage.scale(-1, 1)
    newImage.image(this, 0, 0, -this.width, this.height)
  } else {
    newImage.scale(1, -1)
    newImage.image(this, 0, 0, this.width, -this.height)
  }
  return newImage
}
function onScreen(x, y) {
  if (x > 0 && x < CANX) {
    if (y > 0 && y < CANY) {
      return true
    }
  }

  return false
}

//MATH
function Logistic_S_Curve(x, shape=12) {
  let min = 0
  let max = 1
  let mean = 0.5//middle value
  let balance = 1//weight between the increase and decrease

  return min + (max - min) * 1/(1 + Math.exp(-shape * (x - mean))) ** balance
}

function distanceBetweenPoints(pointOne, pointTwo) {
  return Math.sqrt((pointOne.x - pointTwo.x) ** 2 + (pointOne.y - pointTwo.y) ** 2)
}
function magnitude(point) {
  return Math.sqrt((point.x) ** 2 + (point.y) ** 2)
}

function makeMatrix(w, h, principle=0) {
  return new Array(h).fill(principle).map(() => new Array(w).fill(principle))
}

class Rectangle {
  constructor(x, y, w, h=w, t=1, data={}) {
    this.x = x
    this.y = y
    this.w = w
    this.h = h

    this.t=1

    this.data = data
  }

  show() {
    push()
    strokeWeight(this.t)
    rect(this.x, this.y, this.w, this.h)
    pop()
  }
}
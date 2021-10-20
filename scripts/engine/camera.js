"use strict";
class Camera {
  constructor(x, y, zoom=1, speed=0.5) {
    this.pos = {
      x: x,
      y: y
    }
    this._requestedPosition = {
      x: x,
      y: y
    }

    this.zoom = zoom
    this._requestedZoom = zoom

    this.speed = speed
  }

  show() {
    translate(CANX/2, CANY/2)
    scale(this.zoom)

    translate(this.pos.x, this.pos.y)
  }

  pan(x, y) {
    this._requestedPosition.x = x
    this._requestedPosition.y = y
  }

  zoomScale(s) {
    this._requestedZoom = s
  }

  update() {
    if (distanceBetweenPoints(this._requestedPosition, this.pos) > 1 && magnitude(this._requestedPosition) < magnitude({x: CANX, y: CANY}) && magnitude(this._requestedPosition) > 0) {
      this.pos.x += (this._requestedPosition.x - this.pos.x)/(1/this.speed) * timeScaler()
      this.pos.y += (this._requestedPosition.y - this.pos.y)/(1/this.speed) * timeScaler()
    }

    this.zoom += (this._requestedZoom - this.zoom)/(1/this.speed) * timeScaler()


    if (this.pos.x * this.zoom > -CANX/2 * resolutionMultiplier) {
      this.pos.x = -CANX/2 / this.zoom
    }
    if (this.pos.y * this.zoom > -CANY/2 * resolutionMultiplier) {
      this.pos.y = -CANY/2 / this.zoom
    }
    if (this.pos.x * this.zoom - (-CANX * this.zoom) < CANX/2 * resolutionMultiplier) {
      this.pos.x = CANX/2 / this.zoom - CANX
    }
    if (this.pos.y * this.zoom - (-CANY * this.zoom) < CANY/2 * resolutionMultiplier) {
      this.pos.y = CANY/2 / this.zoom - CANY
    }
  }
}

//have a camera cut off point
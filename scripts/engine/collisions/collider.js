"use strict";
class BoxCollider {
  constructor(x, y, width, height, thickness=10, top=true, bottom=true, left=true, right=true, cornerCrush=5) {
    this.pos = createVector(x, y)

    this.dimensions = {
      w: width,
      h: height
    }

    this.overlap = thickness

    this.cornerCrush = cornerCrush

    this.sides = {
      top: (top) ? new Rectangle(x + this.cornerCrush, y, width - this.cornerCrush*2, this.overlap, 1, {color: color(255, 0, 0)}) : null, 
      bottom: (bottom) ? new Rectangle(x + this.cornerCrush, y + height - this.overlap, width - this.cornerCrush*2, this.overlap, 1, {color: color(255, 255, 0)}) : null, 
      left: (left) ? new Rectangle(x, y + this.cornerCrush, this.overlap, height - this.cornerCrush*2, 1, {color: color(0, 255, 0)}) : null, 
      right: (right) ? new Rectangle(x + width - this.overlap, y + this.cornerCrush, this.overlap, height - this.cornerCrush*2, 1, {color: color(0, 0, 255)}) : null
    }
  }

  debug(color="white") {
    push()
    fill(255, 255, 255, 80)
    stroke(color)
    rect(this.pos.x, this.pos.y, this.dimensions.w, this.dimensions.h)
    pop()

    for (var object in this.sides) {
      let s = this.sides[object]
      if (s) {
        push()
        noFill()
        stroke(s.data.color)
        s.show()
        pop()
      }
    }
  }

  collideDetect(obj) {
    let objRect = new Rectangle(obj.position.x, obj.position.y, obj.dimensions.w, obj.dimensions.h)

    let correction = createVector(0, 0)

    for (var side in this.sides) {
      let s = this.sides[side]

      if (s === null) {
        continue
      }

      if (collideRectRectObject(s, objRect)) {
        switch (side) {
          case "top":
            correction.set(0, this.sides.top.y - (objRect.y + objRect.h))
            break
          case "bottom":
            correction.set(0, (this.sides.bottom.y + this.sides.bottom.h) - objRect.y)
            break
          case "left":
            correction.set(this.sides.top.x - (objRect.x + objRect.w) - this.cornerCrush, 0)
            break
          case "right":
            correction.set((this.sides.bottom.x + this.sides.bottom.w) - objRect.x + this.cornerCrush, 0)
            break
          
          return correction
        }
      }
    }

    return correction
  }
}
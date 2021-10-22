"use strict";
class Player {
  constructor(x, y, controlScheme) {
    this.pos = createVector(x, y)
    this.velocity = createVector(0, 0)

    this.controls = controlScheme

    this.character = null
    this.charID = null
    
    this.collisions = null
    this.grounded = false

    this.invulnerable = 0
    this.stunned = 0

    this.jumpLock = false
    this.deltaJumps = 0
    this.jumpCooldown = 0
    this.moveCoolDown = 0

    this.damage = 0
    this.lives = 3

    this.queuedHitboxes = []
    this.activeHitboxes = []

    this.facingDirection = RIGHT
    this.queuedPropulsion = {
      delta: 0,
      move: false
    }
    this.moveAnimation = false
    this.attackAnimation = false


    this.stunAnimation = new Animation()
  }

  setCharacter(id) {
    this.charID = id
    this.character = characters[this.charID]

    // let stunnedAnimationFrames = []
    // let tintLevels = 30
    // for (let i = 0; i < tintLevels; i++) {
    //   stunnedAnimationFrames.push(ASSETS.animations[this.charID].movement.idle.tint(i/tintLevels * 255, 255, 1 - i/tintLevels * 255))
    // }
  }

  move() {
    let inputVector = createVector(0, 0)
    this.moveAnimation = ASSETS.animations[this.charID].movement.idle

    if (this.stunned == 0 && this.moveCoolDown == 0) {
      //if (this.grounded || (keyIsDown(this.controls.jump) && this.jumpLock == false && (this.deltaJumps + 1 < this.character.physics.totalJumps && this.jumpCooldown == 0))) {
        if (keyIsDown(this.controls.left)) {
          //a
          inputVector.set(-1, inputVector.y)
          this.facingDirection = LEFT
        }
        if (keyIsDown(this.controls.right)) {
          //d
          inputVector.set(1, inputVector.y)
          this.facingDirection = RIGHT
        }
        if (keyIsDown(this.controls.right) || keyIsDown(this.controls.left)) {
          this.moveAnimation = ASSETS.animations[this.charID].movement.run
        }

      if (keyIsDown(this.controls.jump)) {
        //w
        //jump
        if (this.jumpLock == false) {
          if (this.deltaJumps + 1 < this.character.physics.totalJumps && this.jumpCooldown == 0) {
            this.deltaJumps++
            this.jumpCooldown = this.character.physics.jumpFrameDelay
            this.velocity.set(this.velocity.x, -this.character.physics.jumpForce * timeScaler())
          }
        }

        //prevent holding down to jump
        if (lockJumpHold) {
          this.jumpLock = true
        }
      } else {
        this.jumpLock = false
      }

      if (keyIsDown(this.controls.down)) {
        //s
        //fastfall
        inputVector.set(inputVector.x, 1)
      }
    }

    inputVector.normalize()

    //potential error, maybe change to .mag()
    //slow down
    if (inputVector.x == 0) {
      if (this.grounded) {
        this.velocity.set(this.velocity.x/this.character.physics.friction, this.velocity.y)//constantly slow the player down if they are on the ground
      } else {
        this.velocity.set(this.velocity.x/this.character.physics.airResistance, this.velocity.y)//air resistance
      }
    }

    //apply max speed limits
    if (this.velocity.x > this.character.physics.maxSpeedLR) {
      this.velocity.set(this.character.physics.maxSpeedLR, this.velocity.y)
    }
    if (this.velocity.x < -this.character.physics.maxSpeedLR) {
      this.velocity.set(-this.character.physics.maxSpeedLR, this.velocity.y)
    }

    this.velocity.add(inputVector.mult(this.character.physics.acceleration * timeScaler()))
  }

  update() {
    //gameplay
    if (this.invulnerable == 0) {
      let {damage, launch, stun} = attackCheck(this)
      this.damage += damage
      if (this.stunned < stun) {
        this.stunned = stun
      }
      if (launch.x + launch.y !== 0) {
        console.log
        this.velocity.set(launch.x, launch.y)
      }
    }

    //if the moves propel you in a direction
    if (this.queuedPropulsion.move !== false) {
      this.queuedPropulsion.delta += timeScaler()
      if (this.queuedPropulsion.delta > this.queuedPropulsion.move.frameOffset) {
        if (this.queuedPropulsion.delta < this.queuedPropulsion.move.frameOffset + this.queuedPropulsion.move.frameSpan) {
          this.velocity.set(this.queuedPropulsion.move.vector.x * this.queuedPropulsion.move.speed, this.queuedPropulsion.move.vector.y * this.queuedPropulsion.move.speed)
        } else {
          this.queuedPropulsion.move = false
        }
      }
    } else {
      //if there is no move propulsion, assume normal input
      
      this.move()//take user control input
      if (this.velocity.y > this.character.physics.maxFallSpeed) {
        this.velocity.set(this.velocity.x, this.character.physics.maxFallSpeed)
      }
      if (this.velocity.y < -this.character.physics.maxFallSpeed) {
        this.velocity.set(this.velocity.x, -this.character.physics.maxFallSpeed)
      }

      //this weird if statement is meant to stop the players not colliding when the user tabs out of the game
      if (!this.grounded) {
        this.velocity.add(0, GRAVITY * this.character.physics.mass * timeScaler())//constantly pull the player down with gravity
      } else {
        this.velocity.add(0, 1)
      }
    }

    this.pos.add(this.velocity)//actually move the player.mult( deltaTime / 10 )
    
    //all the sprite properties of the player being put into an object
    let spriteInfo = {
      position: createVector(this.pos.x, this.pos.y),
      velocity: createVector(this.velocity.x, this.velocity.y),
      dimensions: {
        w: this.character.dimensions.width,
        h: this.character.dimensions.height
      }
    }

    this.collisions = collide(spriteInfo, gameState.levelColliders)//check for collsions
    this.velocity.set(this.collisions.vel)//apply the change to position (undo overlap)
    let pastPos = this.pos.copy()
    this.pos.set(this.collisions.pos)//cancel velocity in the respective direction if their is a collsion

    if (this.jumpCooldown > 0) {
      this.jumpCooldown -= timeScaler()
      if (this.jumpCooldown < 0) {
        this.jumpCooldown = 0
      }
    }
    //recharge jumps if the player is still on the y-axis and has been corrected upwards
    if (this.collisions !== null) {
      if (this.grounded) {
        this.deltaJumps = 0
      }
    }

    //decrement stun time
    if (this.stunned > 0) {
      this.stunned -= timeScaler()
      if (this.stunned < 0) {
        this.stunned = 0
      }
    }

    //decrement invulnerable time
    if (this.invulnerable > 0) {
      this.invulnerable -= timeScaler()
      if (this.invulnerable < 0) {
        this.invulnerable = 0
      }
    }

    this.attack()

    //check if player is on the grounded
    if (this.velocity.y == 0 && (pastPos.y - this.pos.y) > 0) {
      this.grounded = true
    } else {
      this.grounded = false
    }
  }

  show() {
    //show an attack animation first (if there is one) and if there is no current attack, show the movement animation (if there is one)
    if (this.attackAnimation != false) {
      this.attackAnimation.play(this.pos.x, this.pos.y, (this.facingDirection == RIGHT) ? null : this.character.dimensions.width)
      if (this.attackAnimation.isComplete()) {
        this.attackAnimation = false
      }
    } else {
      if (this.moveAnimation instanceof Animation) {
        this.moveAnimation.play(this.pos.x, this.pos.y, (this.facingDirection == RIGHT) ? null : this.character.dimensions.width)//this.character
      }
    }

    if (showHitboxes) {
      push()
      //player hitbox
      noFill()
      strokeWeight(1)
      if (this.collisions !== null) {
        if (this.collisions.has.x || this.collisions.has.y) {
          stroke(255, 0, 0)
        } else {
          stroke(255)
        }
      }
      rect(this.pos.x, this.pos.y, this.character.dimensions.width, this.character.dimensions.height)

      //attack hitboxes
      noStroke()
      fill(255, 255, 0, 120)
      for (let hitbox of this.activeHitboxes) {
        rect(this.pos.x + hitbox.move.area.x, this.pos.y + hitbox.move.area.y, hitbox.move.area.w, hitbox.move.area.h)
      }
      pop()
    }
  }

  attack() {
    if (this.moveCoolDown == 0 && this.stunned == 0) {
      //find where the player is attacking, with precedence of left/right then up/down, finally, use facing
      let direction = (keyIsDown(this.controls.left)) ? LEFT : ((keyIsDown(this.controls.right)) ? RIGHT : ((keyIsDown(this.controls.up)) ? UP : ((keyIsDown(this.controls.down)) ? DOWN : (this.facingDirection))))

      let moveType = (keyIsDown(this.controls.lightAttack)) ? LIGHT : ((keyIsDown(this.controls.heavyAttack)) ? HEAVY : ((keyIsDown(this.controls.specialAttack)) ? SPECIAL : null))

      if ((direction == DOWN && this.grounded == true) || moveType === null) {
        //do not allow downward attacks on the ground
      } else {
        if (keyIsDown(this.controls.lightAttack)) {
          this.startMove(direction, LIGHT)
          return
        }
        if (keyIsDown(this.controls.heavyAttack)) {
          this.startMove(direction, HEAVY)
          return
        }
        if (keyIsDown(this.controls.specialAttack)) {
          this.startMove(direction, SPECIAL)
          return
        }

        this.startMove(direction, moveType)
      }
    }

    //iterate the delta time since the move was used, if the delta exceeds the frameOffset, activate the hitbox
    for (let move = this.queuedHitboxes.length - 1; move >= 0; move--) {
      this.queuedHitboxes[move].delta += deltaTime
      if (this.queuedHitboxes[move].delta > this.queuedHitboxes[move].move.frameOffset) {
        this.activeHitboxes.push({delta: 0, move: this.queuedHitboxes[move].move})
        this.queuedHitboxes.splice(move, 1)
      }
    }

    //if an active hitbox has outlived its frameSpan, kill it
    for (let box = this.activeHitboxes.length - 1; box >= 0; box--) {
      this.activeHitboxes[box].delta += timeScaler()
      if (this.activeHitboxes[box].delta > this.activeHitboxes[box].move.frameSpan) {
        this.activeHitboxes.splice(box, 1)
      }
    }

    //apply move cooldown
    if (this.moveCoolDown > 0) {
      this.moveCoolDown -= timeScaler()
      if (this.moveCoolDown < 0) {
        this.moveCoolDown = 0
      }
    }
  }


  startMove(direction, whatMove) {
    switch (direction) {
      case UP:
        break
      case DOWN:
        if (whatMove == HEAVY) {
          return
        }
        break
      case LEFT:
        break
      case RIGHT:
        break
    }
    let moveData = this.character.attacks[direction][whatMove]

    this.moveCoolDown = moveData.frameCooldown
    
    this.attackAnimation = ASSETS.animations[this.charID][direction][whatMove]
    this.attackAnimation.reset()
    
    for (let hitbox of moveData.hitboxes) {
      this.queuedHitboxes.push({delta: 0, move: hitbox})
    }
    //only queue the movement if there actually is one defined
    if (moveData.movement.frameSpan > 0) {
      this.queuedPropulsion.delta = 0
      this.queuedPropulsion.move = moveData.movement
    }
  }
}
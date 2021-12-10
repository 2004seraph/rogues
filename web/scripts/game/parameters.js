"use strict";
//DISPLAY
var screenScale = 200
var aspectRatio = {
  w: 6,
  h: 4
}

var mainInterfaceSpeed = 5

//debug
var showColliders = false
var showHitboxes = false

//visual stuff
var relativeGamerTagHeights = false
var noImageSmooth = true//or else it uglifies pixel graphics
var dynamicCamera = true

//gameplay
var lockJumpHold = true//prevent holding down to jump
var spamHitboxes = false

//control schemes
var controlSchemes = []
controlSchemes[0] = {
  up: 87,
  down: 83,
  left: 65,
  right: 68,
  jump: 32,
  lightAttack: 66,
  heavyAttack: 78,
  specialAttack: 77,
  dodge: 16
}
controlSchemes[1] = {
  up: 38,
  down: 40,
  left: 37,
  right: 39,
  jump: 45,
  lightAttack: 188,
  heavyAttack: 190,
  specialAttack: 191
}
"use strict";
export default {
//DISPLAY
  screenScale: 200,
  aspectRatio: {
    w: 6,
    h: 4
  },

  mainInterfaceSpeed: 5,

//debug
  showColliders: false,
  showHitboxes: true,

//visual stuff
  relativeGamerTagHeights: false,
  noImageSmooth: true,//or else it uglifies pixel graphics
  dynamicCamera: true,

//gameplay
  lockJumpHold: true,//prevent holding down to jump
  spamHitboxes: false,

//control schemes
  controlSchemes: [
    {
      up: 87,
      down: 83,
      left: 65,
      right: 68,
      jump: 32,
      lightAttack: 66,
      heavyAttack: 78,
      specialAttack: 77,
      dodge: 16
    },
    {
      up: 38,
      down: 40,
      left: 37,
      right: 39,
      jump: 45,
      lightAttack: 188,
      heavyAttack: 190,
      specialAttack: 191
    }
  ]
}
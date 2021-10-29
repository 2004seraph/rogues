"use strict";
loadScenes.roomsScene = function() {
  ScenesManager.scenes[ROOMSCREEN] = {
    preCompute: function() {
      this.playerCard = 180
      this.playerCardheight = 200
      this.cardSpacing = 60
      this.amountOfLevels = Object.keys(levels).length

      this.screendivider = 100
    },
    start: function() {
    },
    run: function() {
    },
  }
}
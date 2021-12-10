"use strict";
loadScenes.loadingScene = function() {
  ScenesManager.scenes[LOADINGSCREEN] = {
    start: function() {},
    run: function() {
      //background(0, 0, 255)
      let moveX = (Math.sin(frameCount/30))**2 * -300
      let moveY = (Math.sin(frameCount/30))**2 * -300
      let g0 = drawingContext.createLinearGradient(moveX, moveY, CANX, CANY)
      g0.addColorStop(0.0, '#001652')
      g0.addColorStop(0.5, '#004ed4')
      g0.addColorStop(1.0, '#007362')
      drawingContext.fillStyle = g0

      rect(0, 0, CANX, CANY)
      Loader.show()
      
      if (Loader.complete() && gameLoaded == false) {
        gameLoaded = true
        ScenesManager.preCompute()
        ScenesManager.changeScene(STARTSCREEN, mainInterfaceSpeed * 3)
      }
    }
  }
}
"use strict";
loadScenes.loadingScene = function() {
  ScenesManager.scenes[LOADINGSCREEN] = {
    start: function() {},
    run: function() {
      background(0, 0, 255)
      Loader.show()
      
      if (Loader.complete() && gameLoaded == false) {
        gameLoaded = true
        ScenesManager.preCompute()
        ScenesManager.changeScene(STARTSCREEN, mainInterfaceSpeed * 3)
      }
    }
  }
}
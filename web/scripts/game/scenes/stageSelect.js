loadScenes.stageScene = function() {
  ScenesManager.scenes[LEVELSELECT] = {
    start: function() {
      background(0)
      this.selection = 1
      ScenesManager.changeScene(GAME, mainInterfaceSpeed)
    }, run: function() {},
    selection: null
  }
}
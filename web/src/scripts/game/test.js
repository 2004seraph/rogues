"use strict";
function gotoGame() {
  ScenesManager.scenes[CHARACTERSELECT].selection.player1 = 0
  ScenesManager.scenes[CHARACTERSELECT].selection.player2 = 0
  ScenesManager.scenes[LEVELSELECT].selection = 0
  ScenesManager.changeScene(GAME, 0)
}
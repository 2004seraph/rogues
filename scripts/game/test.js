"use strict";
function gotoGame() {
  ScenesManager.scenes[CHARACTERSELECT].selection.player1 = 0
  ScenesManager.scenes[CHARACTERSELECT].selection.player2 = 0
  ScenesManager.changeScene(LEVELSELECT, 0)
}
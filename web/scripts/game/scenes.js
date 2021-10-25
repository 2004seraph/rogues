"use strict";
var loadScenes = {}
function createScenes() {
  let loadScenesKeys = Object.keys(loadScenes)
  for (let sceneLoadFunction of loadScenesKeys) {
    loadScenes[sceneLoadFunction]()
  }
}
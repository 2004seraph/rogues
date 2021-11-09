"use strict";
export var loadScenes = {}
export function createScenes() {
  let loadScenesKeys = Object.keys(loadScenes)
  for (let sceneLoadFunction of loadScenesKeys) {
    loadScenes[sceneLoadFunction]()
  }
}
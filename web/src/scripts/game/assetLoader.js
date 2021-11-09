"use strict";
import Globals from "./globals.js"

export var rootJSONFiles = 5//5//just the count of json files
export var loadScenes = {}

export var ASSETS = {
  levelImages: {},
  characterImages: {},
  namedImages: {},
  animations: {},
  sounds: {},
  fonts: {}
}

export var gameLoaded = false

export let fontParse, levels, namedImagesParse, soundsParse, characters

export function loadGameAssets() {
  fontParse = Globals.P5.loadJSON("./JSON/fonts.json", continueFontLoading)//useless, since the game only has one font, might as well hard code it
  levels = Globals.P5.loadJSON("./JSON/levels.json", continueLevelLoading)
  namedImagesParse = Globals.P5.loadJSON("./JSON/images.json", continueNamedAssetsLoading)
  soundsParse = Globals.P5.loadJSON("./JSON/jukebox.json", continueSoundLoading)
  characters = Globals.P5.loadJSON("./JSON/characters.json", continueCharacterLoading)
}
function continueFontLoading() {
  Globals.Loader.changeLimit(Object.keys(fontParse).length)
  Globals.Loader.increment()

  for (let f in fontParse) {
    let fontPath = fontParse[f]
    ASSETS.fonts[f] = Globals.P5.loadFont(fontPath, loadUp)
  }
}
function continueLevelLoading() {
  Globals.Loader.changeLimit(Object.keys(levels).length * 4)
  Globals.Loader.increment()
  //level images
  for (let level in levels) {
    let levelData = levels[level]
    
    //level pfp
    if (levelData.previewImage != null) {
      ASSETS.levelImages[levelData.previewImage] = Globals.P5.loadImage(levelData.previewImage, loadUp)
    } else {
      Globals.Loader.increment()
    }
    
    //stage layered-images
    for (let parallaxIndex = 1; parallaxIndex < 4; parallaxIndex++) {
      if (levelData.images[parallaxIndex] != null) {
        ASSETS.levelImages[levelData.images[parallaxIndex]] = Globals.P5.loadImage(levelData.images[parallaxIndex], loadUp)
      } else {
        Globals.Loader.increment()
      }
    }
  }
}
function continueNamedAssetsLoading() {
  Globals.Loader.changeLimit(Object.keys(namedImagesParse).length)
  Globals.Loader.increment()

  for (let a in namedImagesParse) {
    let assetPath = namedImagesParse[a]
    ASSETS.namedImages[a] = Globals.P5.loadImage(assetPath, loadUp)
  }
}
function continueSoundLoading() {
  Globals.Loader.changeLimit(Object.keys(soundsParse).length)
  Globals.Loader.increment()

  for (let a in soundsParse) {
    let assetPath = soundsParse[a]
    ASSETS.sounds[a] = Globals.P5.loadSound(assetPath, loadUp)
  }
}

function continueCharacterLoading() {
  Globals.Loader.changeLimit(Object.keys(characters).length * 13)
  Globals.Loader.increment()//because it has loaded the character JSON file

  for (let c in characters) {
    //profile picture
    let char = characters[c]
    ASSETS.characterImages[char.profilePicture] = Globals.P5.loadImage(char.profilePicture, loadUp)

    ASSETS.animations[c] = {}
    ASSETS.animations[c].movement = {}

    //movement animations
    for (let mov in char.movementAnimations) {
      let movementAnim = char.movementAnimations[mov]
      if (movementAnim != null) {
        console.log("Loaded:", c, movementAnim)
        Globals.Loader.changeLimit(2)
        ASSETS.animations[c].movement[mov] = new Animation()
        ASSETS.animations[c].movement[mov].setData(movementAnim)
        ASSETS.animations[c].movement[mov].repeat = true
      } else {
        console.log("Char:", c, "[skipped movement animation]")
      }
      Globals.Loader.increment()//replace
    }

    //attacks animations
    for (let dir in char.attacks) {
      let direction = char.attacks[dir]
      ASSETS.animations[c][dir] = {}

      for (let moveType in direction) {
        let move = direction[moveType]

        if (move.animation != null) {
          console.log("Loaded:", c, move.animation)
          Globals.Loader.changeLimit(2)
          ASSETS.animations[c][dir][moveType] = new Animation()
          ASSETS.animations[c][dir][moveType].setData(move.animation)
        } else {
          ASSETS.animations[c][dir][moveType] = null
          console.log("Char:", c, "[skipped attack animation]")
        }
        Globals.Loader.increment()//replace
      }
    }
  }
}
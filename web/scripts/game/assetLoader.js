"use strict";
let rootJSONFiles = 4//5//just the count of json files
var loadScenes = {}

var ASSETS = {
  levelImages: {},
  characterImages: {},
  namedImages: {},
  animations: {},
  sounds: {}
}

var gameLoaded = false

let fontParse, levels, namedImagesParse, soundsParse, characters

function loadGameAssets() {
  //fontParse = loadJSON("scripts/game/JSON/fonts.json", continueFontLoading)//useless, since the game only has one font, might as well hard code it
  levels = loadJSON("scripts/game/JSON/levels.json", continueLevelLoading)
  namedImagesParse = loadJSON("scripts/game/JSON/images.json", continueNamedAssetsLoading)
  soundsParse = loadJSON("scripts/game/JSON/jukebox.json", continueSoundLoading)
  characters = loadJSON("scripts/game/JSON/characters.json", continueCharacterLoading)
}
// function continueFontLoading() {
//   Loader.changeLimit(Object.keys(fontParse).length)
//   loadUp()

//   for (let f in fontParse) {
//     let fontPath = fontParse[f]
//     ASSETS.fonts[f] = loadFont(fontPath, loadUp)
//   }
// }
function continueLevelLoading() {
  Loader.changeLimit(Object.keys(levels).length * 4)
  loadUp()
  //level images
  for (let level in levels) {
    let levelData = levels[level]
    
    //level pfp
    if (levelData.previewImage != null) {
      ASSETS.levelImages[levelData.previewImage] = loadImage(levelData.previewImage, loadUp)
    } else {
      loadUp()
    }
    
    //stage layered-images
    for (let parallaxIndex = 1; parallaxIndex < 4; parallaxIndex++) {
      if (levelData.images[parallaxIndex] != null) {
        ASSETS.levelImages[levelData.images[parallaxIndex]] = loadImage(levelData.images[parallaxIndex], loadUp)
      } else {
        loadUp()
      }
    }
  }
}
function continueNamedAssetsLoading() {
  Loader.changeLimit(Object.keys(namedImagesParse).length)
  loadUp()

  for (let a in namedImagesParse) {
    let assetPath = namedImagesParse[a]
    ASSETS.namedImages[a] = loadImage(assetPath, loadUp)
  }
}
function continueSoundLoading() {
  Loader.changeLimit(Object.keys(soundsParse).length)
  loadUp()

  for (let a in soundsParse) {
    let assetPath = soundsParse[a]
    ASSETS.sounds[a] = loadSound(assetPath, loadUp)
  }
}

function continueCharacterLoading() {
  Loader.changeLimit(Object.keys(characters).length * 15)
  loadUp()//because it has loaded the character JSON file

  for (let c in characters) {
    //profile picture
    let char = characters[c]
    ASSETS.characterImages[char.profilePicture] = loadImage(char.profilePicture, loadUp)

    ASSETS.animations[c] = {}
    ASSETS.animations[c].movement = {}

    //movement animations
    for (let mov in char.movementAnimations) {
      let movementAnim = char.movementAnimations[mov]
      if (movementAnim != null) {
        console.log("Loaded:", c, movementAnim)
        Loader.changeLimit(2)
        ASSETS.animations[c].movement[mov] = new Animation()
        ASSETS.animations[c].movement[mov].setData(movementAnim)
        ASSETS.animations[c].movement[mov].repeat = true
        //loadUp()
      } else {
        console.log(c, "skipped movement animation")
        //loadUp()
      }
      loadUp()//replace
    }

    //attacks animations
    for (let dir in char.attacks) {
      let direction = char.attacks[dir]
      ASSETS.animations[c][dir] = {}

      for (let moveType in direction) {
        let move = direction[moveType]

        if (move.animation != null) {
          Loader.changeLimit(2)
          ASSETS.animations[c][dir][moveType] = new Animation()
          ASSETS.animations[c][dir][moveType].setData(move.animation)
          //loadUp()
        } else {
          ASSETS.animations[c][dir][moveType] = null
          console.log(c, "skipped attack animation")
          //loadUp()
        }
        loadUp()//replace
      }
    }
  }
}

function loadUp() {
  Loader.increment()
}
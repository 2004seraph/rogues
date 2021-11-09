"use strict";
export default {
  //SCENES
  LOADINGSCREEN: 0,
  STARTSCREEN: 1,
  MAINMENU: 2,
  GAME: 3,
  CREDITS: 4,
  CHARACTERSELECT: 5,
  LEVELSELECT: 6,

  //GAME (numerical constants)
  GRAVITY: 0.6,
  PARRALAX: 10,
  PUNCHPOWER: 1,

  MAXDXPERFRAME: 60,
  MAXDYPERFRAME: 60,
  MOVEDDECAY: 1.1,

  MAXDAMAGE: 600,
  //visual
  GAMERTAGHEIGHT: 90,
  FRAMERATE: 60,

  //FUNCTIONS
  X: 0,
  Y: 1,

  //DIRECTIONS (it is critical for the game to function that these are strings, do not change)
  UP: "up",
  DOWN: "down",
  LEFT: "left",
  RIGHT: "right",
  NEUTRAL: "neutral",

  LIGHT: "light",
  HEAVY: "heavy",
  SPECIAL: "special"
}
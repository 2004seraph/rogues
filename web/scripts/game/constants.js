"use strict";
//SCENES
const LOADINGSCREEN = 0
const STARTSCREEN = 1
const MAINMENU = 2
const GAME = 3
const CREDITS = 4
const CHARACTERSELECT = 5
const LEVELSELECT = 6

//GAME (numerical constants)
const GRAVITY = 0.6
const PARRALAX = 10
const PUNCHPOWER = 1
//visual
const GAMERTAGHEIGHT = 90
const FRAMERATE = 60

//FUNCTIONS
const X = 0
const Y = 1

//DIRECTIONS (it is critical for the game to function that these are strings, do not change)
const UP = "up"
const DOWN = "down"
const LEFT = "left"
const RIGHT = "right"
const NEUTRAL = "neutral"

const LIGHT = "light"
const HEAVY = "heavy"
const SPECIAL = "special"
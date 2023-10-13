'use strict';
p5.disableFriendlyErrors = true;

//turn off console.log()s
// console.log = function(...args) {
//   return true
// }

var CANX, CANY, Canvas, ScenesManager, Loader, FaderCanvas;
var resolutionMultiplier = 1; //half-implemented

var gameState = {
	currentLevel: null,
	levelColliders: [],
	players: {}
};

function setup() {
	CANX = aspectRatio.w * screenScale; // * resolutionMultiplier
	CANY = aspectRatio.h * screenScale; // * resolutionMultiplier

	Canvas = createCanvas(CANX, CANY).style('z-index: 0');
	Canvas.parent('P5Container');

	frameRate(FRAMERATE);

	//audio policy
	getAudioContext().suspend();

	//nearest neighbor scaling for the pixel art
	if (noImageSmooth) {
		let context = Canvas.elt.getContext('2d'); //could be replaced with 'drawingcontext'
		context.imageSmoothingEnabled = false;
		context.mozImageSmoothingEnabled = false;
		context.webkitImageSmoothingEnabled = false;
		context.msImageSmoothingEnabled = false;
	}

	Loader = new LoadingBar(50, CANY / 2 - 50, CANX - 100, 100, rootJSONFiles);
	ScenesManager = new SceneManager({}, LOADINGSCREEN, FaderCanvas);

	loadGameAssets();
	createScenes();

	textAlign(CENTER, CENTER);
	textSize(28);
	noStroke();
}

function draw() {
	resetGameMatrix();
	ScenesManager.update();
	promptsUpdate();
}

function resetGameMatrix() {
	resetMatrix();
	if (resolutionMultiplier != 0) {
		scale(resolutionMultiplier);
		translate(
			CANX * (1 - resolutionMultiplier),
			CANY * (1 - resolutionMultiplier)
		);
	}

	drawingContext.shadowOffsetX = 0;
	drawingContext.shadowOffsetY = 0;
}

function timeScaler() {
	return deltaTime / 16;
}

function keyPressed() {
	//console.log(keyCode, key)
	userStartAudio();
	switch (keyCode) {
		case SHIFT:
			//gotoGame()
			break;
		case ENTER:
			let hub = ScenesManager.scenes[MAINMENU];
			//the code is here because it needs to fire only on one press
			if (ScenesManager.currentScene == MAINMENU) {
				if (hub.showAccountBox) {
					if (
						hub.accountBoxStuff.usernameInput.elt === document.activeElement ||
						hub.accountBoxStuff.passwordInput.elt === document.activeElement
					) {
						logIn();
					} else if (
						hub.accountBoxStuff.usernameCreate.elt === document.activeElement ||
						hub.accountBoxStuff.passwordCreate1.elt ===
							document.activeElement ||
						hub.accountBoxStuff.passwordCreate2.elt === document.activeElement
					) {
						signUp();
					} else {
						if (
							hub.accountBoxStuff.usernameInput.value().length >
							hub.accountBoxStuff.usernameCreate.value().length
						) {
							logIn();
						} else if (
							hub.accountBoxStuff.usernameInput.value().length <
							hub.accountBoxStuff.usernameCreate.value().length
						) {
							signUp();
						} else {
							//nothing
						}
					}
				} else if (hub.showGameBox) {
					joinGame();
				}
			}
			break;
	}

	//prevent default for ALL player controls
	if (ScenesManager.currentScene == GAME) {
		for (let scheme = 0; scheme < controlSchemes.length; scheme++) {
			for (let schemeKey in controlSchemes[scheme]) {
				if (controlSchemes[scheme][schemeKey] == keyCode) {
					return false;
				}
			}
		}
	}
}

function mousePressed() {
	//console.log(mouseX, mouseY)
	userStartAudio();
}

function doSound(s) {
	switch (s) {
		case 'click':
			ASSETS.sounds.click_2.setVolume(0.6);
			ASSETS.sounds.click_2.play();
			break;
		case 'choose':
			ASSETS.sounds.click_1.setVolume(0.5);
			ASSETS.sounds.click_1.play();
			break;
		case 'back':
			ASSETS.sounds.click_3.setVolume(0.7);
			ASSETS.sounds.click_3.play();
			break;
		case 'punch':
			ASSETS.sounds.punch.setVolume(0.52);
			ASSETS.sounds.punch.play();
			break;
		case 'death':
			ASSETS.sounds.death.setVolume(0.25);
			ASSETS.sounds.death.play();
			break;
		case 'pound':
			ASSETS.sounds.pound.setVolume(0.25);
			ASSETS.sounds.pound.play();
			break;
	}
}

"use strict";

var currentPrompt = null

function clearPrompt() {
  if (currentPrompt != null) {
    currentPrompt.element.remove()
  }
  currentPrompt = null
}

function setPrompt(p) {
  clearPrompt()
  currentPrompt = p
}

function promptsUpdate() {
  if (currentPrompt != null) {
    currentPrompt.update()
  }
}

class Prompt {
  constructor(x, y, t, l) {
    this.lifeSpan = l
    this.lifeTime = 0

    let b_height = ScenesManager.scenes[MAINMENU].buttonSize * ScenesManager.scenes[MAINMENU].heightMult

    this.element = createElement("div", t)
      .position(x, y)
      .class("prompt")
      .parent("P5Container")
      .attribute("title", "Click to remove")
      .size(ScenesManager.scenes[MAINMENU].buttonSize, 60)//270
      .mouseClicked(() => {
        this.element.remove()
      })
  }

  update() {
    this.lifeTime++
    if (this.lifeTime > this.lifeSpan) {
      this.element.remove()
    }
  }
}
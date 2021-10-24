"use strict";

function logIn() {
  let username = ScenesManager.scenes[MAINMENU].accountBoxStuff.usernameInput.value()
  let password = ScenesManager.scenes[MAINMENU].accountBoxStuff.passwordInput.value()

  hashMessage(password).then((digest) => {
    socket.emit("requestLogin", {username: username.toString().toUpperCase(), passwordHash: digest})
  })
}

function signUp() {
  let username = ScenesManager.scenes[MAINMENU].accountBoxStuff.usernameCreate.value()
  let password1 = ScenesManager.scenes[MAINMENU].accountBoxStuff.passwordCreate1.value()
  let password2 = ScenesManager.scenes[MAINMENU].accountBoxStuff.passwordCreate2.value()

  if (password1 == password2) {
    hashMessage(password1).then((digest) => {
      socket.emit("requestSignup", {username: username.toString().toUpperCase(), passwordHash: digest})
    })
  }
}
"use strict";

function logIn() {
  let username = ScenesManager.scenes[MAINMENU].accountBoxStuff.usernameInput.value()
  let password = ScenesManager.scenes[MAINMENU].accountBoxStuff.passwordInput.value()

  hashMessage(password).then((digest) => {
    socket.emit("requestLogin", {username: username.toString().toUpperCase(), passwordHash: digest})
  })
}
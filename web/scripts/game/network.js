"use strict";
var socket = io()
console.log(socket)

var currentPacket = null

var globalServerInfo = null
socket.on("globalServerInfo", function(data) {
  globalServerInfo = data
})

let packetHeaders = ["loginCode", "signupCode", "userDataCode"]
for (let header of packetHeaders) {
  socket.on(header, function(data) {
    currentPacket = {name: header, data: data}
  })
}

var accountData = null

var lastTransmission = null

function updateTransmission() {
  lastTransmission = Date.now()
}

function resetPacket() {
  currentPacket = null
}

function logIn() {
  let username = ScenesManager.scenes[MAINMENU].accountBoxStuff.usernameInput.value().toString().toUpperCase()
  let password = ScenesManager.scenes[MAINMENU].accountBoxStuff.passwordInput.value()

  if (accountData != null) {
    if (username == accountData.Username) {
      console.log("already logged in")
      return
    }
  }

  if (lastTransmission != null && Date.now() - lastTransmission < globalServerInfo.transmission.wait) {
    return
  }

  if (password.length > globalServerInfo.password.min && password.length < globalServerInfo.password.max) {
    if (username.length > globalServerInfo.username.min && username.length < globalServerInfo.username.max) {
    } else {
      return
    }
  } else {
    return
  }

  hashMessage(password).then((digest) => {
    updateTransmission()
    socket.emit("requestLogin", {username: username, passwordHash: digest})
  })
}

function signUp() {
  let username = ScenesManager.scenes[MAINMENU].accountBoxStuff.usernameCreate.value()
  let password1 = ScenesManager.scenes[MAINMENU].accountBoxStuff.passwordCreate1.value()
  let password2 = ScenesManager.scenes[MAINMENU].accountBoxStuff.passwordCreate2.value()

  if (lastTransmission != null && Date.now() - lastTransmission < globalServerInfo.transmission.wait) {
    return
  }

  if (password1 == password2 && password1.length > globalServerInfo.password.min && password1.length < globalServerInfo.password.max) {
    if (username.length > globalServerInfo.username.min && username.length < globalServerInfo.username.max) {
      hashMessage(password1).then((digest) => {
        updateTransmission()
        socket.emit("requestSignup", {username: username.toString().toUpperCase(), passwordHash: digest})
      })
    }
  }
}
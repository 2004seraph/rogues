"use strict";
var socket = io()

var currentPacket = null

function resetPacket() {
  currentPacket = null
}

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

  if (password1 == password2 && password1.length > globalServerInfo.password.min && password1.length < globalServerInfo.password.max) {
    if (username.length > globalServerInfo.username.min && username.length < globalServerInfo.username.max) {
      hashMessage(password1).then((digest) => {
        socket.emit("requestSignup", {username: username.toString().toUpperCase(), passwordHash: digest})
      })
    }
  }
}

let packetHeaders = ["loginCode", "signupCode", "userDataCode"]

for (let header of packetHeaders) {
  socket.on(header, function(data) {
    //console.log("loginCode", data)
    currentPacket = {name: header, data: data}
  })
}

// socket.on("loginCode", function(data) {
//   //console.log("loginCode", data)
//   currentPacket = {name: "loginCode", data: data}
// })
// socket.on("signupCode", function(data) {
//   //console.log("signupCode", data)
//   currentPacket = {name: "signupCode", data: data}
// })
// socket.on("userDataCode", function(data) {
//   //console.log("userDataCode", data)
//   currentPacket = {name: "userDataCode", data: data}
// })
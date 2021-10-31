"use strict";
var socket = io()
socket.on("blocked", function(data) {
  console.warn("#############################################")
  console.warn("CONNECTION TO THE SERVER WAS BLOCKED, REASON:", data.code)
  console.warn("#############################################")
  accountData = null
  gameState.authorisedUser = null
})
socket.on("disconnect", function(data) {
  console.warn("server connection lost")
  accountData = null
  ScenesManager.changeScene(MAINMENU, mainInterfaceSpeed)
  setPrompt(new Prompt(10, 10, "Server connection lost", 300))
})
socket.on("connect", () => {
  setPrompt(new Prompt(10, 10, "Server connection established", 300))
})
socket.on("userDataCode", function(data) {
  if (data.code == "badAuth") {
    location.reload()
  }
})
// socket.on("refreshUpdate", function(data) {
//   console.warn("Server Update")
//   accountData = null
//   gameState.authorisedUser = null
//   location.reload()
// })

var latency = null
// setInterval(() => {
//   const start = Date.now()
//   socket.volatile.emit("ping", () => {
//     latency = Date.now() - start
//   })
// }, 5000)

var currentPacket = null//auth
var currentStatsPacket = null//stats

var playingOnline = false

var globalServerInfo = null
socket.on("globalServerInfo", function(data) {
  globalServerInfo = data
})

let packetHeaders = ["loginCode", "signupCode", "userDataCode", "gameStatisticsCode", "roomCode"]
for (let header of packetHeaders) {
  socket.on(header, function(data) {
    currentPacket = {name: header, data: data}
  })
}
let statPacketHeaders = ["gameStatisticsCode"]
for (let statHeader of statPacketHeaders) {
  socket.on(statHeader, function(data) {
    currentStatsPacket = {name: statHeader, data: data}
  })
}

//just a cache for userdata
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
      setPrompt(new Prompt(10, 10, "Already logged in", 300))
      return
    }
  }

  if (username.length > globalServerInfo.username.min && username.length < globalServerInfo.username.max) {
    if (password.length > globalServerInfo.password.min && password.length < globalServerInfo.password.max) {
    } else {
      setPrompt(new Prompt(10, 10, "Invalid Password", 300))
      return
    }
  } else {
    setPrompt(new Prompt(10, 10, "Invalid Username", 300))
    return
  }

  hashMessage(password).then((digest) => {
    updateTransmission()
    socket.emit("requestLogin", {username: username, passwordHash: digest, latency: latency})
  })
}

function logOut() {
  socket.emit("signOut", {latency: latency})
  
  accountData = null
  setPrompt(new Prompt(10, 10, "Logged out", 300))
}

function signUp() {
  let username = ScenesManager.scenes[MAINMENU].accountBoxStuff.usernameCreate.value()
  let password1 = ScenesManager.scenes[MAINMENU].accountBoxStuff.passwordCreate1.value()
  let password2 = ScenesManager.scenes[MAINMENU].accountBoxStuff.passwordCreate2.value()
  
  if (username.length > globalServerInfo.username.min && username.length < globalServerInfo.username.max) {
    if (password1 == password2) {
      if (password1.length > globalServerInfo.password.min && password1.length < globalServerInfo.password.max) {
        hashMessage(password1).then((digest) => {
          updateTransmission()
          socket.emit("requestSignup", {username: username.toString().toUpperCase(), passwordHash: digest, latency: latency})
        })
      } else {
        setPrompt(new Prompt(10, 10, "Bad password length", 300))
      }
    } else {
      setPrompt(new Prompt(10, 10, "Passwords don't match", 300))
    }
  } else {
    setPrompt(new Prompt(10, 10, "Bad username length", 300))
  }
}


function joinGame() {
  let code = ScenesManager.scenes[MAINMENU].gameBoxStuff.joinCodeInput.value().toString().trim()
  if (code.length < 6) {
    setPrompt(new Prompt(10, 10, "Bad code", 300))
  } else {
    socket.emit("joinRoom", {room: code})
  }
}

function createGame() {
  socket.emit("createRoom")
}

function matchmakeGame() {
}
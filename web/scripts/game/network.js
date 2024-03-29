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
  if (playingOnline) {
    ScenesManager.changeScene(MAINMENU, mainInterfaceSpeed)
  }
  setPrompt(new Prompt(10, 10, "Server connection lost", 300))
})
socket.on("connect", () => {
  setPrompt(new Prompt(10, 10, "Server connection established", 300))

  //game checksum
  hashMessage(JSON.stringify(Object.keys(window)) + Player.toString() + attackCheck.toString() + collide.toString() + collideRectRectObject.toString() + collideRectRect.toString() + BoxCollider.toString()).then((digest) => {
    //console.log(digest)
    socket.emit("checkSum", {hash: digest})
  })
})
socket.on("userDataCode", function(data) {
  if (data.code == "badAuth") {
    location.reload()
  }
})

var latency = null
var playingOnline = false

var globalServerInfo = null
socket.on("globalServerInfo", function(data) {
  globalServerInfo = data
})

var currentPacket = null//auth
var currentStatsPacket = null//stats
var currentGamePacket = null
var imopPacket = null

var opponent = ""

let packetHeaders = ["loginCode", "signupCode", "userDataCode", "roomCode", "characterSelectCode", "readyContinue", "levelSelectCode"]
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
let gameHeaders = ["positionUpdate", "attackUpdate"]
for (let gameHeader of gameHeaders) {
  socket.on(gameHeader, function(data) {
    currentGamePacket = {name: gameHeader, data: data}
  })
}
let importantHeaders = ["statusUpdate"]
for (let imop of importantHeaders) {
  socket.on(imop, function(data) {
    imopPacket = {name: imop, data: data}
  })
}
var positionPacket
socket.on("positionUpdate", function(data) {
  positionPacket = data
})

//just a cache for userdata
var accountData = null

var lastTransmission = null
function updateTransmission() {
  lastTransmission = Date.now()
}

function resetPacket() {
  currentPacket = null
}

function resetGamePacket() {
  currentGamePacket = null
}

function resetImopPacket() {
  imopPacket = null
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
    socket.volatile.emit("requestLogin", {username: username, passwordHash: digest, latency: latency})
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
          socket.volatile.emit("requestSignup", {username: username.toString().toUpperCase(), passwordHash: digest, latency: latency})
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
  socket.emit("availibleForRandom")
}

function joinGame() {
  let code = ScenesManager.scenes[MAINMENU]
    .gameBoxStuff
    .joinCodeInput
    .value()
    .toString()
    .trim()
    
  if (code.length < 6) {
    setPrompt(new Prompt(10, 10, "Bad code", 300))
  } else {
    socket.emit("joinRoom", {room: code})
  }
}
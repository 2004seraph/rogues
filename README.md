# **Rogues-Online**
My College Computer Science project; a 2D web-based multiplayer platform fighting game.

[Play now](https://rogues.seraph.parts/)

## Operation
To start the webserver which hosts and serves the game, type this into shell within the project root directory - supplying a port number as an environment variable.
```console
~/rogues$ PORT=<port> node index.js
```

## TODO List
### Musts:
   - [x] when you tab out and tab back in the colliders will break
   - [x] update position every frame
   - [x] update attacks as they are made
   - [x] update everything else every 10 frames
   - [x] add all login prompts
   - [x] show usernames on gameover screen in multiplayer
   - [ ] add one more stage
   - [x] add speedy character
   - [ ] add heavy character
   - [ ] add first median character
   - [ ] add second median character
   - [x] add competitve matchmaking for Elo
   - [ ] make interace gradienty
### Coulds:
   - [ ] lobby text-chat
### Maybe:
   - [ ] 2^n stepped screen resolution changes
   - [ ] finish implementing scalable resolution
   - [ ] try vector-midpoint collsion detection
   - [ ] minify the game

## Bugs:
  ### Game
    - [OPEN ] characters playing the exact same animation will both use the same animation progress, hence, will both iterate the animations progress.
    - [OPEN ] very rarely players wont both load the same map in multiplayer if they both vote on different stages.
    - [OPEN ] very rarely the game will just not load.
    - [FIXED] very rarely the character/stage select screen will fail in multiplayer, choices do not sync and the lobby stops; it is because clients aren't being left properly from rooms
    - [OPEN ] moves are dropped
    - [OPEN ] client side server-player sometimes does attacks for no reason
    - [OPEN ] Damage Desyncs

  ### Commands
    - 'nuke' command does not log out authenticated sockets

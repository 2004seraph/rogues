# **Rogues Online**
My College Computer Science project; a 2D web-based multiplayer platform fighting game.

[Play online now](https://rogues.seraph.parts/) - Also available as a Progressive Web App. You may also check out the GitHub pages deployment, but that has no backend server, so no online functionality.

Be warned this app is broken by AdBlockers.

## Operation
To start the webserver which hosts and serves the game, type this into shell within the project root directory - supplying a port number as an environment variable.
```console
~/rogues$ PORT=<port> node index.js
```

## TODOs
### Musts
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
### Coulds
   - [ ] lobby text-chat
### Maybes
   - [ ] 2^n stepped screen resolution changes
   - [ ] finish implementing scalable resolution
   - [ ] try vector-midpoint collsion detection
   - [ ] minify the game

## Known Issues
  ### Client
    - [OPEN ] very rarely the game will not load on start. This is fixed by refreshing the page.
    - [OPEN ] characters playing the exact same move will both use the same animation progress, so both will perform the move animation twice as fast.
    - [OPEN ] very rarely players wont both load the same map in multiplayer if they both vote on different stages.
    - [OPEN ] sometimes some moves are not registered by the server.
    - [OPEN ] client side server-player sometimes does attacks for no reason.
    - [OPEN ] damage desyncs during online versus matches.
    
    - [FIXED] very rarely the character/stage select screen will fail in multiplayer, choices do not sync and the lobby stops; it is because clients aren't being left properly from rooms.

  ### Server
    - 'nuke' command does not log out authenticated sockets, leading to an inconsistent server state.

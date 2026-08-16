# Grid Duel

A no-build, browser-based local multiplayer Tic-Tac-Toe game. Completed matches and statistics are persisted in `localStorage`.

## Run locally

Open `index.html` in a modern browser. For the most reliable local development experience, serve this folder with any static server, for example VS Code's **Live Server** extension.

No package installation or build step is required.

## Structure

- `index.html` — game setup and local match UI
- `history.html` — searchable, removable match archive
- `scoreboard.html` — aggregate statistics and player leaderboard
- `css/style.css` — responsive shared UI and animations
- `js/game.js` — game state, turn handling, and win/draw detection
- `js/storage.js` — browser persistence adapter and theme preference
- `js/history.js` / `js/scoreboard.js` — page-specific rendering

## Extending to online play

`js/game.js` owns presentation and local board state, while `js/storage.js` exposes the persistence boundary (`getGames`, `addGame`, `removeGame`, and `clearGames`). To add a backend, implement the same methods through an API and introduce a `MatchTransport` module that sends moves and receives remote board updates through WebSockets or Socket.IO. The screens can remain unchanged while the local click handler becomes a transport request/response flow.

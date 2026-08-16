/* Storage adapter: replace its public methods with HTTP/WebSocket calls when an online service is added. */
const GameStorage = (() => {
  const HISTORY_KEY = "grid-duel.history.v1";
  const THEME_KEY = "grid-duel.theme.v1";
  function read() { try { const data = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]"); return Array.isArray(data) ? data : []; } catch { return []; } }
  function write(games) { try { localStorage.setItem(HISTORY_KEY, JSON.stringify(games)); return true; } catch { return false; } }
  function addGame(game) { const games = read(); games.unshift({ id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`, ...game }); return write(games); }
  function removeGame(id) { return write(read().filter((game) => game.id !== id)); }
  function clearGames() { return write([]); }
  function getStats(games = read()) { const stats = { total: games.length, xWins: 0, oWins: 0, draws: 0, players: {} }; games.forEach((g) => { if (g.result === "draw") stats.draws++; else if (g.result === "x") stats.xWins++; else stats.oWins++; [[g.playerX, "x"], [g.playerO, "o"]].forEach(([name, symbol]) => { if (!stats.players[name]) stats.players[name] = { name, games: 0, wins: 0 }; stats.players[name].games++; if (g.result === symbol) stats.players[name].wins++; }); }); return stats; }
  function setupTheme() { const toggle = document.getElementById("theme-toggle"); const saved = localStorage.getItem(THEME_KEY); if (saved === "light") document.documentElement.dataset.theme = "light"; toggle?.addEventListener("click", () => { const next = document.documentElement.dataset.theme === "light" ? "dark" : "light"; document.documentElement.dataset.theme = next === "light" ? "light" : ""; localStorage.setItem(THEME_KEY, next); }); }
  return { getGames: read, addGame, removeGame, clearGames, getStats, setupTheme };
})();
document.addEventListener("DOMContentLoaded", GameStorage.setupTheme);

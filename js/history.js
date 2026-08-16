document.addEventListener("DOMContentLoaded", () => {
  const list = document.getElementById("history-list");
  const search = document.getElementById("history-search");
  const count = document.getElementById("history-count");
  const notice = document.createElement("div");
  notice.className = "toast";
  notice.setAttribute("role", "status");
  notice.setAttribute("aria-live", "polite");
  document.body.append(notice);

  const formatDate = (iso) => new Intl.DateTimeFormat(undefined, { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(iso));
  const escapeHtml = (value) => { const div = document.createElement("div"); div.textContent = value; return div.innerHTML; };
  function showNotice(text) { notice.textContent = text; notice.classList.add("is-visible"); setTimeout(() => notice.classList.remove("is-visible"), 2500); }

  function render() {
    const query = search.value.trim().toLowerCase();
    const games = GameStorage.getGames().filter((game) => `${game.playerX} ${game.playerO}`.toLowerCase().includes(query));
    count.textContent = `${games.length} ${games.length === 1 ? "match" : "matches"}`;
    if (!games.length) {
      list.innerHTML = `<div class="empty-state"><div>⌘</div><h2>${query ? "No matches found" : "No games played yet"}</h2><p>${query ? "Try another player name." : "Start your first match to begin building your record."}</p><a class="start-button compact" href="index.html">Play a game <span>→</span></a></div>`;
      return;
    }
    list.innerHTML = `<div class="history-head"><span>Players</span><span>Result</span><span>Played</span><span></span></div>${games.map((game) => {
      const result = game.result === "draw" ? "Draw" : `${game.winner} won`;
      return `<article class="history-row"><div class="players"><span class="avatar x">X</span><b>${escapeHtml(game.playerX)}</b><span class="versus">vs</span><span class="avatar o">O</span><b>${escapeHtml(game.playerO)}</b></div><div><span class="result-badge ${game.result}">${result}</span><small>${game.moves} moves · ${game.durationSeconds || 0}s</small></div><time datetime="${game.playedAt}">${formatDate(game.playedAt)}</time><button class="delete-button" data-id="${game.id}" type="button" aria-label="Delete this game">×</button></article>`;
    }).join("")}`;
    list.querySelectorAll(".delete-button").forEach((button) => button.addEventListener("click", () => {
      if (confirm("Delete this match from history?")) { GameStorage.removeGame(button.dataset.id); render(); showNotice("Match removed from history"); }
    }));
  }

  search.addEventListener("input", render);
  document.getElementById("clear-history").addEventListener("click", () => {
    if (GameStorage.getGames().length && confirm("Clear all saved game history? This cannot be undone.")) { GameStorage.clearGames(); render(); showNotice("All game history cleared"); }
  });
  render();
});

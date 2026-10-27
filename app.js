const items = window.ITEMS || [];
const $ = s => document.querySelector(s);

const esc = s => String(s ?? "").replace(/[&<>"']/g, c =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const eur = n => n == null ? "" : "≈ " + n.toLocaleString("de-AT") + " €";
const done = it => it.status && it.status !== "хотим";

function pic(it) {
  return `<div class="pic">${it.img
    ? `<img src="${esc(it.img)}" alt="${esc(it.name)}" loading="lazy">`
    : `<span class="no">${esc(it.id)}</span>`}</div>`;
}

function renderGrid() {
  $("#grid").innerHTML = items.length
    ? items.map(it => `
      <a class="card${done(it) ? " done" : ""}" href="#${esc(it.id)}">
        ${pic(it)}
        <div class="name">${esc(it.name)}</div>
        <div class="dim">${[eur(it.price), done(it) && it.status].filter(Boolean).map(esc).join(" · ")}</div>
      </a>`).join("")
    : `<div class="empty dim">пока пусто</div>`;
}

function renderItem(it) {
  const buy = (it.buy || []).map(b => `
    <li>
      ${b.url ? `<a href="${esc(b.url)}" target="_blank" rel="noopener">${esc(b.where)} ↗</a>` : `<span>${esc(b.where)}</span>`}
      <span class="dim">${esc(eur(b.price))}</span>
    </li>`).join("");
  const diy = (it.diy || []).map(s => `<li>${esc(s)}</li>`).join("");
  $("#item").innerHTML = `
    <a class="close" href="#">закрыть</a>
    <div class="body">
      ${pic(it)}
      <div>
        <h1>${esc(it.name)}</h1>
        <div class="dim">${[it.id, eur(it.price), done(it) && it.status].filter(Boolean).map(esc).join(" · ")}</div>
        ${it.note ? `<h2 class="dim">заметка</h2><p class="prose">${esc(it.note)}</p>` : ""}
        ${buy ? `<h2 class="dim">где купить</h2><ul class="rows">${buy}</ul>` : ""}
        ${diy ? `<h2 class="dim">как сделать</h2><ol class="prose">${diy}</ol>` : ""}
        ${it.reel ? `<h2 class="dim">рилс</h2><a href="${esc(it.reel)}" target="_blank" rel="noopener">открыть ↗</a>` : ""}
      </div>
    </div>`;
}

function route() {
  const it = items.find(it => it.id === decodeURIComponent(location.hash.slice(1)));
  $("#item").hidden = !it;
  document.body.style.overflow = it ? "hidden" : "";
  if (it) { renderItem(it); $("#item").scrollTop = 0; }
}

addEventListener("hashchange", route);
addEventListener("keydown", e => { if (e.key === "Escape" && !$("#item").hidden) location.hash = ""; });

renderGrid();
route();

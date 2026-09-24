// ================== Onglets ==================
const tabs = document.querySelectorAll("[data-tab]");
const panels = document.querySelectorAll(".panel");

function showTab(id, scroll = true) {
  if (!document.getElementById("tab-" + id)) id = "accueil";
  panels.forEach((p) => p.classList.toggle("active", p.id === "tab-" + id));
  document.querySelectorAll(".tab").forEach((t) => t.classList.toggle("active", t.dataset.tab === id));
  history.replaceState(null, "", "#" + id);
  if (scroll) window.scrollTo({ top: 0 });
}

tabs.forEach((t) =>
  t.addEventListener("click", (e) => {
    e.preventDefault();
    showTab(t.dataset.tab);
  })
);
showTab(location.hash.slice(1) || "accueil", false);
window.addEventListener("hashchange", () => showTab(location.hash.slice(1)));

// ================== Stockage local (sécurisé) ==================
const store = {
  get(key, fallback) {
    try {
      const v = localStorage.getItem(key);
      return v === null ? fallback : JSON.parse(v);
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  },
};

// ================== Compteur ==================
const START = new Date(2021, 2, 30, 0, 0, 0); // 30 mars 2021
const $ = (id) => document.getElementById(id);

// Date "from" décalée de n mois, en restant sur le dernier jour si le mois est plus court
function addMonths(from, n) {
  const y = from.getFullYear(), m = from.getMonth() + n;
  const last = new Date(y, m + 1, 0).getDate();
  return new Date(y, m, Math.min(from.getDate(), last), from.getHours(), from.getMinutes(), from.getSeconds());
}

function diffParts(from, to) {
  let total = (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth());
  if (addMonths(from, total) > to) total -= 1;
  const anchor = addMonths(from, total);
  let rest = to - anchor;
  const days = Math.floor(rest / 86400000);
  rest -= days * 86400000;
  const hours = Math.floor(rest / 3600000);
  rest -= hours * 3600000;
  const minutes = Math.floor(rest / 60000);
  rest -= minutes * 60000;
  const seconds = Math.floor(rest / 1000);
  return { years: Math.floor(total / 12), months: total % 12, days, hours, minutes, seconds };
}

function updateCounter() {
  const now = new Date();
  const p = diffParts(START, now);
  $("c-years").textContent = p.years;
  $("c-months").textContent = p.months;
  $("c-days").textContent = p.days;
  $("c-hours").textContent = String(p.hours).padStart(2, "0");
  $("c-minutes").textContent = String(p.minutes).padStart(2, "0");
  $("c-seconds").textContent = String(p.seconds).padStart(2, "0");

  const totalDays = Math.floor((now - START) / 86400000);
  $("s-days").textContent = totalDays.toLocaleString("fr-FR");
  $("s-weeks").textContent = Math.floor(totalDays / 7).toLocaleString("fr-FR");

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  let next = new Date(now.getFullYear(), 2, 30);
  if (next < today) next = new Date(now.getFullYear() + 1, 2, 30);
  const untilNext = Math.round((next - today) / 86400000);
  if (untilNext === 0) {
    $("s-next").textContent = "🎉";
    $("s-next-label").textContent = "Joyeux anniversaire !";
  } else {
    $("s-next").textContent = untilNext;
    $("s-next-label").textContent = `jours avant nos ${next.getFullYear() - 2021} ans`;
  }
}
updateCounter();
setInterval(updateCounter, 1000);

// ================== New York ==================
const CATEGORIES = {
  incontournable: "Incontournables",
  vue: "Vues",
  balade: "Balades",
  food: "Food",
  culture: "Culture",
  soiree: "Soirées",
  romantique: "Romantique",
};

const ACTIVITIES = [
  { id: "central-park", cat: "balade", emoji: "🌳", title: "Central Park à vélo", desc: "Louer des vélos et faire le tour : Bow Bridge, Bethesda Fountain, Strawberry Fields.", tip: "Pique-nique sur Sheep Meadow avec des bagels." },
  { id: "brooklyn-bridge", cat: "incontournable", emoji: "🌉", title: "Traverser le Brooklyn Bridge", desc: "À pied depuis Manhattan vers Dumbo, pour arriver face à la skyline.", tip: "Y aller tôt le matin pour éviter la foule." },
  { id: "dumbo", cat: "romantique", emoji: "📸", title: "Photo à Dumbo", desc: "La fameuse vue sur le Manhattan Bridge depuis Washington Street, puis Brooklyn Bridge Park au coucher du soleil.", tip: "Glace à la Brooklyn Ice Cream Factory." },
  { id: "top-rock", cat: "vue", emoji: "🏙️", title: "Top of the Rock", desc: "La meilleure vue sur l'Empire State Building et Central Park.", tip: "Réserver le créneau du coucher du soleil." },
  { id: "edge", cat: "vue", emoji: "🔺", title: "Edge ou Summit One Vanderbilt", desc: "Terrasse vitrée suspendue (Edge) ou salles de miroirs spectaculaires (Summit).", tip: "Summit : parfait pour des photos folles à deux." },
  { id: "highline", cat: "balade", emoji: "🌿", title: "High Line & Chelsea Market", desc: "Ancienne voie ferrée transformée en jardin suspendu, jusqu'à Hudson Yards et The Vessel.", tip: "Déjeuner au Chelsea Market (tacos, homard)." },
  { id: "soho", cat: "balade", emoji: "🛍️", title: "Shopping à SoHo", desc: "Petites rues pavées, boutiques et façades en fonte, puis Nolita et Little Italy.", tip: "" },
  { id: "west-village", cat: "romantique", emoji: "🏡", title: "Flâner dans le West Village", desc: "Les rues les plus charmantes de NY, l'immeuble de Friends, Bleecker Street.", tip: "Cupcake chez Magnolia Bakery." },
  { id: "statue", cat: "incontournable", emoji: "🗽", title: "Statue de la Liberté", desc: "Ferry gratuit de Staten Island pour la voir sans payer, ou la visite officielle avec Ellis Island.", tip: "Le Staten Island Ferry au coucher du soleil = magique." },
  { id: "times-square", cat: "incontournable", emoji: "✨", title: "Times Square de nuit", desc: "Les écrans géants, l'effervescence… à faire au moins une fois.", tip: "Monter sur les marches rouges TKTS pour la vue." },
  { id: "broadway", cat: "soiree", emoji: "🎭", title: "Un show à Broadway", desc: "Le Roi Lion, Wicked, Hamilton, Moulin Rouge… une soirée inoubliable.", tip: "Billets moins chers via TodayTix ou le guichet TKTS." },
  { id: "rooftop", cat: "soiree", emoji: "🍸", title: "Cocktail sur un rooftop", desc: "230 Fifth, Westlight à Williamsburg ou Le Bain pour une vue de nuit.", tip: "Réserver en fin de journée pour le golden hour." },
  { id: "jazz", cat: "soiree", emoji: "🎷", title: "Soirée jazz", desc: "Village Vanguard, Blue Note ou Smalls Jazz Club pour une ambiance intime.", tip: "" },
  { id: "met", cat: "culture", emoji: "🖼️", title: "Le MET", desc: "Un des plus grands musées du monde. Ne pas rater le temple de Dendur et le rooftop l'été.", tip: "" },
  { id: "moma", cat: "culture", emoji: "🎨", title: "Le MoMA", desc: "Van Gogh, Monet, Warhol, Frida Kahlo… l'art moderne à son meilleur.", tip: "" },
  { id: "grand-central", cat: "culture", emoji: "🚉", title: "Grand Central & NY Public Library", desc: "Le hall mythique, la Whispering Gallery (se murmurer des mots doux !) et la bibliothèque.", tip: "Chacun dans un coin de la Whispering Gallery 💬" },
  { id: "pizza", cat: "food", emoji: "🍕", title: "La vraie pizza new-yorkaise", desc: "Joe's Pizza, Prince Street Pizza ou Lucali à Brooklyn.", tip: "" },
  { id: "bagel", cat: "food", emoji: "🥯", title: "Bagel & brunch", desc: "Russ & Daughters, Ess-a-Bagel, ou un brunch à Jack's Wife Freda.", tip: "" },
  { id: "katz", cat: "food", emoji: "🥪", title: "Pastrami chez Katz's", desc: "Le sandwich culte (et la scène de Quand Harry rencontre Sally).", tip: "Garder le ticket à l'entrée !" },
  { id: "smorgasburg", cat: "food", emoji: "🌮", title: "Smorgasburg à Williamsburg", desc: "Marché street-food du week-end au bord de l'eau, puis balade à Williamsburg.", tip: "Samedi à Williamsburg, dimanche à Prospect Park." },
  { id: "roosevelt", cat: "romantique", emoji: "🚡", title: "Téléphérique de Roosevelt Island", desc: "Survoler l'East River pour le prix d'un ticket de métro.", tip: "" },
  { id: "carriage", cat: "romantique", emoji: "🛶", title: "Barque à Central Park", desc: "Ramer sur le lac du Loeb Boathouse, comme dans les films.", tip: "Ouvert d'avril à novembre." },
  { id: "coney", cat: "balade", emoji: "🎡", title: "Coney Island", desc: "Fête foraine vintage, plage et hot-dogs Nathan's au bout de la ligne de métro.", tip: "Idéal l'été." },
  { id: "basket", cat: "soiree", emoji: "🏀", title: "Match des Knicks", desc: "Assister à un match NBA au Madison Square Garden.", tip: "Saison d'octobre à avril." },
];

const ITINERARY = [
  { day: "Jour 1", theme: "Midtown", items: ["Grand Central & Library", "Times Square", "Top of the Rock au coucher du soleil", "Show à Broadway"] },
  { day: "Jour 2", theme: "Central Park & musées", items: ["Bagel pour le petit-déj", "Central Park à vélo", "Barque au Loeb Boathouse", "Le MET"] },
  { day: "Jour 3", theme: "Downtown", items: ["Statue de la Liberté", "Wall Street & 9/11 Memorial", "SoHo & Little Italy", "Pastrami chez Katz's"] },
  { day: "Jour 4", theme: "Brooklyn", items: ["Brooklyn Bridge à pied", "Photo à Dumbo", "Smorgasburg & Williamsburg", "Rooftop Westlight"] },
  { day: "Jour 5", theme: "Chelsea & Village", items: ["High Line", "Chelsea Market", "West Village", "Soirée jazz"] },
];

let activityState = store.get("ny-activities", {});
let currentFilter = "tout";

function renderFilters() {
  const f = $("filters");
  const entries = [["tout", "Tout"], ["envie", "♡ Nos envies"], ...Object.entries(CATEGORIES)];
  f.innerHTML = "";
  entries.forEach(([key, label]) => {
    const b = document.createElement("button");
    b.className = "chip" + (key === currentFilter ? " active" : "");
    b.textContent = label;
    b.addEventListener("click", () => {
      currentFilter = key;
      renderFilters();
      renderActivities();
    });
    f.appendChild(b);
  });
}

function renderActivities() {
  const wrap = $("activities");
  wrap.innerHTML = "";
  const list = ACTIVITIES.filter((a) => {
    if (currentFilter === "tout") return true;
    if (currentFilter === "envie") return activityState[a.id]?.want;
    return a.cat === currentFilter;
  });

  if (!list.length) {
    wrap.innerHTML = '<p class="subtitle" style="grid-column:1/-1;text-align:center">Rien ici pour l\'instant — ajoutez des activités avec ♡ !</p>';
  }

  list.forEach((a) => {
    const st = activityState[a.id] || {};
    const card = document.createElement("article");
    card.className = "activity" + (st.want ? " wanted" : "") + (st.done ? " done" : "");
    card.innerHTML = `
      <div class="activity-top"><span class="emoji">${a.emoji}</span><span class="tag">${CATEGORIES[a.cat]}</span></div>
      <h4>${a.title}</h4>
      <p>${a.desc}</p>
      ${a.tip ? `<div class="tip">💡 ${a.tip}</div>` : ""}
      <div class="activity-actions">
        <button class="btn want-btn ${st.want ? "on" : ""}">${st.want ? "♥ On veut" : "♡ Envie"}</button>
        <button class="btn done-btn ${st.done ? "on" : ""}">${st.done ? "✓ Fait" : "Fait ?"}</button>
      </div>`;
    card.querySelector(".want-btn").addEventListener("click", (e) => {
      toggle(a.id, "want");
      if (!st.want) burst(e.clientX, e.clientY);
    });
    card.querySelector(".done-btn").addEventListener("click", () => toggle(a.id, "done"));
    wrap.appendChild(card);
  });
  updateProgress();
}

function toggle(id, key) {
  activityState[id] = { ...(activityState[id] || {}), [key]: !activityState[id]?.[key] };
  store.set("ny-activities", activityState);
  renderActivities();
}

function updateProgress() {
  const wanted = ACTIVITIES.filter((a) => activityState[a.id]?.want);
  const done = wanted.filter((a) => activityState[a.id]?.done);
  $("progress-text").textContent = wanted.length
    ? `${wanted.length} envie${wanted.length > 1 ? "s" : ""} · ${done.length} faite${done.length > 1 ? "s" : ""}`
    : "Aucune envie cochée pour l'instant";
  $("progress-fill").style.width = wanted.length ? (done.length / wanted.length) * 100 + "%" : "0";
}

function renderItinerary() {
  $("itinerary").innerHTML = ITINERARY.map(
    (d) => `<div class="day"><h4>${d.day}</h4><div class="theme">${d.theme}</div><ul>${d.items.map((i) => `<li>${i}</li>`).join("")}</ul></div>`
  ).join("");
}

// Date de départ + compte à rebours
const dateInput = $("trip-date");
dateInput.value = store.get("ny-date", "");
function updateTripCountdown() {
  const out = $("trip-countdown");
  if (!dateInput.value) {
    out.textContent = "Choisissez une date ✈️";
    return;
  }
  const [y, m, d] = dateInput.value.split("-").map(Number);
  const target = new Date(y, m - 1, d);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const days = Math.round((target - today) / 86400000);
  if (days > 1) out.textContent = `J-${days} avant New York ✈️`;
  else if (days === 1) out.textContent = "Départ demain ! 🧳";
  else if (days === 0) out.textContent = "C'est aujourd'hui ! 🗽";
  else out.textContent = "Souvenirs de New York 💕";
}
dateInput.addEventListener("change", () => {
  store.set("ny-date", dateInput.value);
  updateTripCountdown();
});

// Notes
const notes = $("trip-notes");
notes.value = store.get("ny-notes", "");
notes.addEventListener("input", () => store.set("ny-notes", notes.value));

renderFilters();
renderActivities();
renderItinerary();
updateTripCountdown();

// ================== Je t'aime ==================
const LOVES = [
  ["Je t'aime", "Français", "🇫🇷"],
  ["I love you", "Anglais", "🇬🇧"],
  ["Te quiero", "Espagnol", "🇪🇸"],
  ["Ti amo", "Italien", "🇮🇹"],
  ["Ich liebe dich", "Allemand", "🇩🇪"],
  ["Eu te amo", "Portugais", "🇵🇹"],
  ["Ik hou van jou", "Néerlandais", "🇳🇱"],
  ["Σ' αγαπώ", "Grec", "🇬🇷"],
  ["Я тебя люблю", "Russe", "🇷🇺"],
  ["愛してる", "Japonais", "🇯🇵"],
  ["我爱你", "Chinois", "🇨🇳"],
  ["사랑해", "Coréen", "🇰🇷"],
  ["أحبك", "Arabe", "🇲🇦"],
  ["אני אוהב אותך", "Hébreu", "🇮🇱"],
  ["Seni seviyorum", "Turc", "🇹🇷"],
  ["Kocham cię", "Polonais", "🇵🇱"],
  ["Jag älskar dig", "Suédois", "🇸🇪"],
  ["Jeg elsker deg", "Norvégien", "🇳🇴"],
  ["Rakastan sinua", "Finnois", "🇫🇮"],
  ["Miluji tě", "Tchèque", "🇨🇿"],
  ["Te iubesc", "Roumain", "🇷🇴"],
  ["Szeretlek", "Hongrois", "🇭🇺"],
  ["मैं तुमसे प्यार करता हूँ", "Hindi", "🇮🇳"],
  ["Mahal kita", "Tagalog", "🇵🇭"],
  ["Aku cinta kamu", "Indonésien", "🇮🇩"],
  ["Anh yêu em", "Vietnamien", "🇻🇳"],
  ["Nakupenda", "Swahili", "🇰🇪"],
  ["Maite zaitut", "Basque", "💚"],
  ["T'estimo", "Catalan", "💛"],
  ["Tha gaol agam ort", "Gaélique écossais", "🏴󠁧󠁢󠁳󠁣󠁴󠁿"],
  ["Mi amas vin", "Espéranto", "⭐"],
  ["Ti tengu caru", "Corse", "🏝️"],
];

const PHOTOS = [
  { src: "photos/let-damour.jpg", caption: "Let d'amour" },
  { src: "photos/bisou-soiree.jpg", caption: "Nos soirées" },
  { src: "photos/plage.jpg", caption: "Toi & moi" },
  { src: "photos/grimaces.jpg", caption: "Pour toujours" },
];

function renderLove() {
  const grid = $("love-grid");
  const photoEvery = Math.ceil(LOVES.length / PHOTOS.length);
  LOVES.forEach(([phrase, lang, flag], i) => {
    if (i % photoEvery === 0) {
      const ph = PHOTOS[i / photoEvery];
      const fig = document.createElement("figure");
      fig.className = "love-photo";
      fig.innerHTML = `<img src="${ph.src}" alt="Laetitia et Raph" loading="lazy" /><span>${ph.caption}</span>`;
      grid.appendChild(fig);
    }
    const card = document.createElement("button");
    card.className = "love-card";
    card.setAttribute("aria-label", `${phrase} — ${lang}`);
    card.innerHTML = `
      <div class="love-inner">
        <div class="love-face love-front"><div class="phrase">${phrase}</div><div class="heart">♥</div></div>
        <div class="love-face love-back"><div class="flag">${flag}</div><div class="lang">${lang}</div></div>
      </div>`;
    card.addEventListener("click", (e) => {
      card.classList.toggle("flipped");
      burst(e.clientX, e.clientY);
    });
    grid.appendChild(card);
  });
}
renderLove();

// ================== Petits cœurs ==================
function burst(x, y) {
  for (let i = 0; i < 5; i++) {
    const h = document.createElement("span");
    h.className = "float-heart";
    h.textContent = "♥";
    h.style.left = x + (Math.random() * 60 - 30) + "px";
    h.style.top = y + (Math.random() * 20 - 10) + "px";
    h.style.animationDelay = i * 0.08 + "s";
    h.style.fontSize = 0.9 + Math.random() * 0.9 + "rem";
    document.body.appendChild(h);
    setTimeout(() => h.remove(), 2000);
  }
}

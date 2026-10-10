// ---------- Mobile nav ----------
const toggle = document.querySelector(".nav-toggle");
const links = document.querySelector(".nav-links");
toggle.addEventListener("click", () => {
  const open = links.classList.toggle("open");
  toggle.setAttribute("aria-expanded", open);
});
links.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => {
    links.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  })
);

// ---------- Hero mini-game ----------
const COLORS = ["#4d8dff", "#2bb673", "#ff6b35", "#8b5cf6", "#ff5c8a", "#14b8a6"];
const TOTAL = 10;
let round = 1;
let answer = 5;

const $ = (id) => document.getElementById(id);
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

function newRound() {
  const useAdd = Math.random() < 0.5;
  let a, b, c;
  if (useAdd) {
    a = rand(1, 9); b = rand(1, 9); c = a + b;
    $("eqOp").textContent = "+";
    $("gameKicker").textContent = "SIMPLE ADDITION";
  } else {
    a = rand(5, 15); b = rand(1, a - 1); c = a - b;
    $("eqOp").textContent = "−";
    $("gameKicker").textContent = "SIMPLE SUBTRACTION";
  }
  answer = b;
  $("eqA").textContent = a;
  $("eqC").textContent = c;
  $("slot").textContent = "?";
  $("slot").classList.remove("correct");
  $("feedback").textContent = "";
  $("gameRound").textContent = `Game ${round}/${TOTAL}`;
  $("gameBar").style.width = `${(round / TOTAL) * 100}%`;

  // Six consecutive options that include the answer
  const start = Math.max(1, answer - rand(0, 5));
  const box = $("answers");
  box.innerHTML = "";
  for (let i = 0; i < 6; i++) {
    const n = start + i;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = n;
    btn.style.background = COLORS[i];
    btn.setAttribute("aria-label", `Answer ${n}`);
    btn.addEventListener("click", () => choose(btn, n));
    box.appendChild(btn);
  }
}

function choose(btn, n) {
  if (n === answer) {
    $("slot").textContent = n;
    $("slot").classList.add("correct");
    $("feedback").textContent = ["Great job! ⭐", "Well done! 🎉", "You got it! 👏"][rand(0, 2)];
    $("answers").querySelectorAll("button").forEach((b) => (b.disabled = true));
    setTimeout(() => {
      round = round >= TOTAL ? 1 : round + 1;
      newRound();
    }, 1200);
  } else {
    btn.classList.add("wrong");
    btn.disabled = true;
    $("feedback").textContent = "Try again!";
  }
}
newRound();

// ---------- Practice tabs ----------
document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach((t) => {
      t.classList.toggle("active", t === tab);
      t.setAttribute("aria-selected", t === tab);
    });
    document.querySelectorAll(".tab-panel").forEach((p) =>
      p.classList.toggle("active", p.dataset.panel === tab.dataset.tab)
    );
  });
});

// ---------- Characters ----------
const chars = [
  { name: "Country A", a: "#f4c7a1", b: "#8d5524" },
  { name: "Country B", a: "#e0ac69", b: "#c68642" },
  { name: "Country C", a: "#8d5524", b: "#f1c27d" },
  { name: "Country D", a: "#c68642", b: "#5c3a21" },
  { name: "Country E", a: "#ffdbac", b: "#a0522d" },
];
$("charRow").innerHTML = chars
  .map(
    (c) => `
  <div class="char">
    <div class="char-pair">
      <span class="avatar" style="background:${c.a}" title="Reading guide"></span>
      <span class="avatar" style="background:${c.b}" title="Maths guide"></span>
    </div>
    <strong>${c.name}</strong>
    <small>READING · MATHS</small>
  </div>`
  )
  .join("");

// ---------- Count-up stats ----------
const fmt = (n) => n.toLocaleString("en-US");
const countObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = +el.dataset.count;
      const suffix = el.dataset.suffix || "";
      const start = performance.now();
      const dur = 1400;
      const tick = (t) => {
        const p = Math.min((t - start) / dur, 1);
        el.textContent = fmt(Math.round(target * (1 - Math.pow(1 - p, 3)))) + (p === 1 ? suffix : "");
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      countObserver.unobserve(el);
    });
  },
  { threshold: 0.5 }
);
document.querySelectorAll("[data-count]").forEach((el) => countObserver.observe(el));

// ---------- Reveal on scroll ----------
const revealObserver = new IntersectionObserver(
  (entries) =>
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("in");
        revealObserver.unobserve(e.target);
      }
    }),
  { threshold: 0.12 }
);
document
  .querySelectorAll(".section-title, .card, .stat, .world, .g, .steps li, .tab")
  .forEach((el) => {
    el.classList.add("reveal");
    revealObserver.observe(el);
  });

// ---------- Contact form (front-end only) ----------
$("contactForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const form = e.target;
  let ok = true;
  form.querySelectorAll("[required]").forEach((f) => {
    const valid = f.type === "checkbox" ? f.checked : f.checkValidity() && f.value.trim();
    f.classList.toggle("invalid", !valid);
    if (!valid) ok = false;
  });
  const status = $("formStatus");
  if (!ok) {
    status.className = "form-status err";
    status.textContent = "Please fill in the highlighted fields.";
    return;
  }
  // TODO: connect to a real backend or form service (e.g. Formspree, Netlify Forms).
  status.className = "form-status ok";
  status.textContent = "Thanks! We'll be in touch within three working days.";
  form.reset();
});

$("year").textContent = new Date().getFullYear();

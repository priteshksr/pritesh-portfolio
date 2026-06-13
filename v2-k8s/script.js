// ── Year ──
const year = document.getElementById("year");
if (year) year.textContent = String(new Date().getFullYear());

// ── Cluster uptime counter ──
const uptimeEl = document.getElementById("uptime");
const start = Date.now();
function tickUptime() {
  if (!uptimeEl) return;
  const s = Math.floor((Date.now() - start) / 1000);
  const hh = String(Math.floor(s / 3600)).padStart(2, "0");
  const mm = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  uptimeEl.textContent = `${hh}:${mm}:${ss}`;
}
setInterval(tickUptime, 1000);
tickUptime();

// ── Live node CPU/MEM meters ──
const cpuBars = document.querySelectorAll("[data-cpu]");
const memBars = document.querySelectorAll("[data-mem]");
function jitter(base, spread) {
  return Math.max(8, Math.min(96, base + (Math.random() * spread - spread / 2)));
}
function updateMeters() {
  cpuBars.forEach((b) => { b.style.width = jitter(45, 30) + "%"; });
  memBars.forEach((b) => { b.style.width = jitter(60, 24) + "%"; });
}
updateMeters();
setInterval(updateMeters, 1600);

// ── Node hover highlight ──
document.querySelectorAll(".node").forEach((node) => {
  node.addEventListener("mouseenter", () => node.classList.add("hot"));
  node.addEventListener("mouseleave", () => node.classList.remove("hot"));
});

// ── Namespace switching ──
const tabs = document.querySelectorAll(".ns-tab");
const panels = document.querySelectorAll(".ns-panel");
const kcNs = document.getElementById("kc-ns");
const kcRes = document.getElementById("kc-resource");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const ns = tab.dataset.ns;
    const res = tab.dataset.res;

    tabs.forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");

    panels.forEach((p) => {
      p.classList.toggle("hidden", p.dataset.panel !== ns);
    });

    if (kcNs) kcNs.textContent = ns;
    if (kcRes) kcRes.textContent = res;
  });
});

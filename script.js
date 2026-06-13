// ── Scroll reveal ──
const revealElements = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  },
  { threshold: 0.15 }
);
revealElements.forEach((item) => observer.observe(item));

// ── Year ──
const year = document.getElementById("year");
if (year) year.textContent = String(new Date().getFullYear());

// ── Typing terminal ──
const typedEl = document.getElementById("typed");

const lines = [
  { t: "$ whoami", cls: "cmd" },
  { t: "pritesh-singh :: devops & platform engineer", cls: "out" },
  { t: "$ terraform apply -auto-approve", cls: "cmd" },
  { t: "Apply complete! 24 added, 0 changed, 0 destroyed.", cls: "ok" },
  { t: "$ kubectl get pods -n platform", cls: "cmd" },
  { t: "api-gateway     Running   1/1", cls: "out" },
  { t: "argocd-server   Running   1/1", cls: "out" },
  { t: "$ docker build -t app:latest .", cls: "cmd" },
  { t: "Successfully built and tagged app:latest", cls: "ok" },
  { t: "$ argocd app sync platform --prune", cls: "cmd" },
  { t: "Synced -> Healthy ✓ deploy live", cls: "ok" },
];

const colors = {
  cmd: "#cfe8ff",
  out: "#8aa0c2",
  ok: "#3ddc84",
};

let lineIdx = 0;
let charIdx = 0;

function typeLoop() {
  if (!typedEl) return;
  if (lineIdx >= lines.length) {
    setTimeout(() => {
      typedEl.innerHTML = "";
      lineIdx = 0;
      charIdx = 0;
      typeLoop();
    }, 3500);
    return;
  }

  const line = lines[lineIdx];

  if (charIdx === 0) {
    const span = document.createElement("span");
    span.dataset.idx = String(lineIdx);
    span.style.color = colors[line.cls] || "#cfe8ff";
    span.style.display = "block";
    typedEl.appendChild(span);
  }

  const span = typedEl.querySelector(`span[data-idx="${lineIdx}"]`);
  span.textContent = line.t.slice(0, charIdx + 1);
  charIdx++;

  if (charIdx >= line.t.length) {
    lineIdx++;
    charIdx = 0;
    setTimeout(typeLoop, line.cls === "cmd" ? 320 : 220);
  } else {
    setTimeout(typeLoop, line.cls === "cmd" ? 38 : 12);
  }
}

typeLoop();

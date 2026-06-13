// progressive enhancement
document.documentElement.classList.add("js");
document.body.classList.add("js");

// ── Boot screen ──
window.addEventListener("load", () => {
  setTimeout(() => document.getElementById("boot")?.classList.add("done"), 1500);
});

// ── Year ──
const year = document.getElementById("year");
if (year) year.textContent = String(new Date().getFullYear());

// ── Download CV ──
document.getElementById("cvBtn")?.addEventListener("click", () => window.print());

// ── Scroll reveal ──
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
}, { threshold: 0.1 });
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
window.addEventListener("load", () => setTimeout(() => document.querySelectorAll(".reveal:not(.in)").forEach((el) => el.classList.add("in")), 1800));

// ── Projects (data → flip cards) ──
// 👉 TO ADD YOUR LINKS: edit the `links` object on each project below.
//    Set code/live/blog to your URLs. Leave "" to hide that button.
const PROJECTS = [
  {
    title: "Azure DevOps + Terraform Platform",
    desc: "Reusable Infrastructure-as-Code platform provisioning Azure landing zones and services consistently, with policy and tagging baked in.",
    tags: ["azure", "terraform", "azure-devops", "iac", "ci-cd"],
    arch: [
      "Git push ➔ Azure DevOps pipeline ➔ terraform plan/apply",
      "Reusable Terraform modules per Azure service",
      "Policy + tagging enforced for compliance",
      "Remote state with locking in Azure Storage",
    ],
    problem: "Manual, inconsistent Azure provisioning caused config drift and slow, error-prone releases.",
    fix: "Built a Terraform + Azure DevOps IaC pipeline — deploy speed up 40%, deployment errors down 50%.",
    links: { code: "", live: "", blog: "" },
  },
  {
    title: "GitOps Delivery onto AKS (ArgoCD)",
    desc: "Containerized applications delivered to Azure Kubernetes Service via GitOps, with declarative, auditable, self-healing deployments.",
    tags: ["kubernetes", "aks", "argocd", "docker", "gitops"],
    arch: [
      "Git repo = source of truth ➔ ArgoCD reconcile ➔ AKS",
      "Multi-stage Dockerfiles, image scanning",
      "Declarative manifests, resource limits/requests",
      "Integrated with Azure DevOps pipelines",
    ],
    problem: "Imperative deployments to Kubernetes were hard to audit and recover.",
    fix: "Adopted ArgoCD GitOps — self-healing, auditable rollouts integrated with the AKS + Azure DevOps flow.",
    links: { code: "", live: "", blog: "" },
  },
  {
    title: "Databricks Asset Bundle Automation",
    desc: "Automated provisioning and deployment of Azure Databricks workspaces and jobs using Databricks Asset Bundles.",
    tags: ["databricks", "automation", "azure", "ci-cd", "python"],
    arch: [
      "Pipeline ➔ Databricks Asset Bundle deploy",
      "Workspace, jobs & clusters as code",
      "Environment promotion (dev ➔ prod)",
      "Versioned, repeatable deployments",
    ],
    problem: "Manual Databricks setup was slow and inconsistent across environments.",
    fix: "Automated with Asset Bundles — setup time reduced by over 80% with repeatable promotion.",
    links: { code: "", live: "", blog: "" },
  },
  {
    title: "CI/CD for .NET + Azure Function Apps",
    desc: "End-to-end CI/CD for .NET applications and serverless Function Apps, with APIM integration for performance.",
    tags: ["dotnet", "azure-functions", "apim", "ci-cd", "azure-devops"],
    arch: [
      "Build ➔ test ➔ deploy to Azure Web/Function Apps",
      "Azure API Management integration",
      "Blue/green-style release control",
      "Automated rollbacks on failure",
    ],
    problem: "Manual .NET releases caused downtime and infrequent deployments.",
    fix: "Built CI/CD with Function Apps + APIM — downtime down 30%, release frequency up 25%.",
    links: { code: "", live: "", blog: "" },
  },
  {
    title: "VMware / HyperV → Azure Migration",
    desc: "Large-scale migration of on-prem virtualized estates to Azure using Azure Migrate, with automated pre/post validation.",
    tags: ["azure", "migration", "powershell", "automation"],
    arch: [
      "Azure Migrate assessment ➔ replication ➔ cutover",
      "PowerShell pre-checks & post-checks",
      "Daily replication + health monitoring",
      "Rollback-safe cutover runbooks",
    ],
    problem: "Manual migrations risked errors and downtime at scale.",
    fix: "Automated validation + monitoring — 99.9% migration success, errors down 40%.",
    links: { code: "", live: "", blog: "" },
  },
  {
    title: "Observability: Azure Monitor + ELK",
    desc: "Unified monitoring, logging and alerting across platform services for faster incident response.",
    tags: ["azure-monitor", "app-insights", "elk", "observability"],
    arch: [
      "Azure Monitor + Application Insights telemetry",
      "Log Analytics queries & dashboards",
      "ELK stack for centralized logs",
      "Actionable alerting on SLOs",
    ],
    problem: "Slow incident diagnosis from fragmented logs and metrics.",
    fix: "Implemented Azure Monitor, App Insights & Log Analytics — issue resolution time down 45%.",
    links: { code: "", live: "", blog: "" },
  },
];

const grid = document.getElementById("projGrid");
if (grid) {
  const linkBtn = (href, label, icon, todo) => {
    const cls = todo ? "plink todo" : "plink";
    const safeHref = todo ? "#" : href;
    const rel = href && href.startsWith("http") ? ' target="_blank" rel="noreferrer"' : "";
    const title = todo ? ' title="Add your link in script.js (PROJECTS → links)"' : "";
    return `<a class="${cls}" href="${safeHref}"${rel}${title}>${icon} ${label}</a>`;
  };

  const renderLinks = (links = {}) => {
    const items = [
      ["code", "Code", "▸"],
      ["live", "Live", "◉"],
      ["blog", "Blog", "✎"],
    ];
    const html = items
      .map(([key, label, icon]) => {
        const url = (links[key] || "").trim();
        return linkBtn(url, label, icon, !url);
      })
      .join("");
    return `<div class="proj-links">${html}</div>`;
  };

  PROJECTS.forEach((p) => {
    const card = document.createElement("div");
    card.className = "flip reveal";
    card.innerHTML = `
      <div class="flip-inner">
        <div class="face front">
          <button class="proj-zoom" type="button">flip ⤿</button>
          <h3>${p.title}</h3>
          <p class="proj-desc">${p.desc}</p>
          <div class="proj-tags">${p.tags.map((t) => `<span>${t}</span>`).join("")}</div>
        </div>
        <div class="face back">
          <button class="proj-zoom" type="button">back ⤾</button>
          <p class="label">// architecture</p>
          <ul class="arch">${p.arch.map((a) => `<li>${a}</li>`).join("")}</ul>
          <p class="pf"><b>Problem:</b> ${p.problem}</p>
          <p class="pf fix"><b>Fix:</b> ${p.fix}</p>
          ${renderLinks(p.links)}
        </div>
      </div>`;
    card.querySelectorAll(".proj-zoom").forEach((btn) =>
      btn.addEventListener("click", (e) => { e.stopPropagation(); card.classList.toggle("flipped"); })
    );
    // don't flip the card when clicking a real link
    card.querySelectorAll(".proj-links a").forEach((a) =>
      a.addEventListener("click", (e) => {
        e.stopPropagation();
        if (a.classList.contains("todo")) e.preventDefault();
      })
    );
    grid.appendChild(card);
    io.observe(card);
  });
}

// ── Contact form → mailto ──
document.getElementById("contactForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = encodeURIComponent(document.getElementById("cName").value);
  const email = encodeURIComponent(document.getElementById("cEmail").value);
  const msg = encodeURIComponent(document.getElementById("cMsg").value);
  const body = `From: ${decodeURIComponent(name)} (${decodeURIComponent(email)})%0D%0A%0D%0A${msg}`;
  window.location.href = `mailto:priteshksingh001@gmail.com?subject=${encodeURIComponent("Portfolio contact from " + decodeURIComponent(name))}&body=${body}`;
});

// ════════════════════════════════════════════════════════════════
//  Mini interactive terminal
// ════════════════════════════════════════════════════════════════
(function () {
  const screen = document.getElementById("termScreen");
  const out = document.getElementById("termOut");
  const input = document.getElementById("termCmd");
  const typedEl = document.getElementById("termTyped");
  if (!screen || !out || !input) return;

  const history = [];
  let hIdx = -1;

  const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  function print(html, cls = "") { const d = document.createElement("div"); d.className = "row " + cls; d.innerHTML = html; out.appendChild(d); screen.scrollTop = screen.scrollHeight; }
  function printCmd(c) { print(`<span class="term-prompt">pritesh@devops:~$</span> ${esc(c)}`); }

  const CMD = {
    help: () => `<span class="t-cyan">commands:</span>
  <span class="t-green">about</span>       summary       <span class="t-green">experience</span>  work history
  <span class="t-green">skills</span>      tech stack    <span class="t-green">certs</span>       certifications
  <span class="t-green">contact</span>     reach me      <span class="t-green">projects</span>    jump to projects
  <span class="t-green">whoami</span>      who am I      <span class="t-green">clear</span>       clear screen`,
    about: () => `Pritesh Singh — DevOps &amp; Platform Engineer (9+ yrs).
Azure-first cloud &amp; data platforms: Terraform, AKS, ArgoCD, GitOps, CI/CD.`,
    skills: () => `cloud   : Azure, AWS, AKS, Kubernetes, Docker, Linux
iac/cd  : Terraform, Ansible, Azure DevOps, ArgoCD, GitHub Actions
data    : Azure Data Factory, Databricks
lang    : Python, PowerShell, Shell
observe : Azure Monitor, App Insights, ELK, Grafana`,
    experience: () => `<span class="t-green">Platform Engineer</span> @ Current Org        Present
<span class="t-green">Senior Associate</span>  @ PwC                 2022-2024
<span class="t-green">Cloud Engineer</span>    @ LTI                 2019-2022
<span class="t-green">Sr. Sw Analyst</span>    @ Capgemini           2017-2019`,
    certs: () => `[✓] CKAD — Certified Kubernetes Application Developer
[✓] AZ-400 — Microsoft DevOps Solutions
[✓] HashiCorp Terraform Associate (003)
[✓] AWS Solutions Architect — Associate`,
    contact: () => `email    : <a href="mailto:priteshksingh001@gmail.com">priteshksingh001@gmail.com</a>
phone    : <a href="tel:+918078688376">+91 8078688376</a>
linkedin : <a href="https://www.linkedin.com/in/pritesh-singh-3a781751/" target="_blank" rel="noreferrer">in/pritesh-singh-3a781751</a>`,
    whoami: () => "pritesh — automating your infra while you read this.",
    projects: () => { document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" }); return `<span class="t-muted">scrolling to projects…</span>`; },
    clear: () => { out.innerHTML = ""; return null; },
    sudo: () => `<span class="t-red">[sudo]</span> <span class="t-muted">nice try 😏 — no root here.</span>`,
  };

  function run(raw) {
    const line = raw.trim();
    printCmd(raw);
    if (line) { history.push(line); hIdx = history.length; }
    if (!line) return;
    const cmd = line.split(/\s+/)[0];
    if (cmd in CMD) { const r = CMD[cmd](); if (r !== null && r !== undefined) print(`<span class="term-out">${r}</span>`); }
    else print(`<span class="t-red">command not found: ${esc(cmd)}</span> <span class="t-muted">— type 'help'</span>`);
  }

  function sync() { typedEl.textContent = input.value; }
  input.addEventListener("input", sync);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") { const v = input.value; input.value = ""; sync(); run(v); }
    else if (e.key === "ArrowUp") { e.preventDefault(); if (hIdx > 0) { hIdx--; input.value = history[hIdx] || ""; sync(); } }
    else if (e.key === "ArrowDown") { e.preventDefault(); if (hIdx < history.length - 1) { hIdx++; input.value = history[hIdx] || ""; } else { hIdx = history.length; input.value = ""; } sync(); }
  });
  screen.addEventListener("click", () => input.focus({ preventScroll: true }));

  // greeting
  print(`<span class="t-green">Welcome.</span> This is a live shell — type <span class="t-green">help</span> to explore.`);
})();

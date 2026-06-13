// ════════════════════════════════════════════════════════════════
//  pritesh@portfolio — interactive terminal
//  A real command interpreter with a virtual filesystem.
// ════════════════════════════════════════════════════════════════

const USER = "pritesh";
const HOST = "portfolio";

// ── Virtual filesystem ──
const FS = {
  "about.txt":
`Pritesh Singh — DevOps & Platform Engineer.
9+ years automating cloud infrastructure on Azure & AWS.
I treat infrastructure as code, run platforms like products,
and automate anything I'd otherwise do twice.

Focus: Azure · Kubernetes · Terraform · ArgoCD · GitOps · CI/CD.`,

  "skills.txt":
`Cloud & Platform : Azure, AWS, AKS, Kubernetes, Docker, Linux/Windows Server
IaC & GitOps      : Terraform, Ansible, ArgoCD, Azure DevOps, Infra pipelines
Data Platform     : Azure Data Factory, Databricks, release governance
Scripting         : Python, PowerShell, Shell, REST APIs
Observability     : Azure Monitor, App Insights, ELK
Security          : Azure IAM, Azure AD`,

  "certifications.txt":
`[✓] Certified Kubernetes Application Developer (CKAD)
[✓] AZ-400  Microsoft DevOps Solutions
[✓] HashiCorp Terraform Associate (003)
[✓] AWS Certified Solutions Architect — Associate`,

  "contact.txt":
`email    : <a href="mailto:priteshksingh001@gmail.com">priteshksingh001@gmail.com</a>
phone    : <a href="tel:+918078688376">+91 8078688376</a>
linkedin : <a href="https://www.linkedin.com/in/pritesh-singh-3a781751/" target="_blank" rel="noreferrer">in/pritesh-singh-3a781751</a>`,

  "experience": {
    "platform-engineer.md":
`# Platform Engineer  [CURRENT · Running]
org: Current Organization | Present

- Platform engineering for Azure data platforms with Terraform + GitOps.
- Reusable deploy patterns across ADF, Databricks, ArgoCD and AKS.
- Improved reliability, release velocity and operational visibility.`,

    "pwc.md":
`# PWC — Senior Associate
2022 - 2024

- Led Azure DevOps pipelines with Terraform — deploy speed +40%.
- CI/CD for .NET + Azure Function Apps — reduced downtime.
- Azure Monitor + App Insights — issue resolution time -45%.
- Automated Databricks deployments with Asset Bundles — setup time -80%.`,

    "lti.md":
`# LTI — Cloud Engineer
2019 - 2022

- Azure DevOps pipelines for Django/Python and .NET apps (+40% deploy freq).
- Automated testing with Selenium/Python/PowerShell — manual testing -70%.
- Ansible agent rollout on Linux/Windows — setup time -50%.
- Migrated HyperV/VMware to Azure — 99.9% migration success.`,

    "capgemini.md":
`# Capgemini — Sr. Software Analyst
2017 - 2019

- Managed Windows servers across public & private cloud.
- Automated VMware vSphere + Active Directory tasks — effort -90%.
- Built Django dashboards for server resource utilization.
- Created AWS landing zones with CloudFormation.`
  }
};

// ── State ──
let cwd = []; // path segments from home
const history = [];
let histIdx = -1;

// ── DOM ──
const output = document.getElementById("output");
const screen = document.getElementById("screen");
const input = document.getElementById("cmd");
const typed = document.getElementById("typed");
const caret = document.getElementById("caret");
const promptEl = document.getElementById("prompt");
const themeBtn = document.getElementById("themeBtn");

// ── Helpers ──
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const cwdStr = () => "~" + (cwd.length ? "/" + cwd.join("/") : "");

function setPrompt() {
  promptEl.innerHTML = `${USER}@${HOST}:<span class="path">${cwdStr()}</span>$`;
}

function nodeAt(segments) {
  let node = FS;
  for (const seg of segments) {
    if (node && typeof node === "object" && seg in node && typeof node[seg] === "object") {
      node = node[seg];
    } else {
      return null;
    }
  }
  return node;
}

function print(html = "", cls = "") {
  const div = document.createElement("div");
  div.className = "row " + cls;
  div.innerHTML = html;
  output.appendChild(div);
  screen.scrollTop = screen.scrollHeight;
}

function printCommand(cmd) {
  print(`<span class="line-cmd"><span class="pfx">${USER}@${HOST}</span>:<span class="path">${cwdStr()}</span>$ ${esc(cmd)}</span>`);
}

// ════════════════════════════════════════════════════════════════
//  Commands
// ════════════════════════════════════════════════════════════════
const COMMANDS = {
  help() {
    return `<span class="out-cyan">Available commands</span>
  <span class="out-green">about</span>          who I am
  <span class="out-green">experience</span>     work history
  <span class="out-green">skills</span>         tech stack
  <span class="out-green">certs</span>          certifications
  <span class="out-green">contact</span>        how to reach me
  <span class="out-green">projects</span>       what I've shipped

<span class="out-cyan">Filesystem</span>
  <span class="out-green">ls [dir]</span>       list files       <span class="out-green">cd &lt;dir&gt;</span>   change directory
  <span class="out-green">cat &lt;file&gt;</span>     read a file       <span class="out-green">pwd</span>        print path
  <span class="out-green">tree</span>           show file tree

<span class="out-cyan">DevOps toys</span>
  <span class="out-green">kubectl get pods</span>   <span class="out-green">terraform apply</span>   <span class="out-green">docker ps</span>   <span class="out-green">git log</span>

<span class="out-cyan">Misc</span>
  <span class="out-green">neofetch</span>  <span class="out-green">history</span>  <span class="out-green">date</span>  <span class="out-green">echo</span>  <span class="out-green">theme</span>  <span class="out-green">clear</span>

<span class="out-muted">tip: use ↑/↓ for history, Tab to autocomplete.</span>`;
  },

  about: () => FS["about.txt"],
  skills: () => FS["skills.txt"],
  "skills.txt": () => FS["skills.txt"],
  certs: () => FS["certifications.txt"],
  certifications: () => FS["certifications.txt"],
  contact: () => FS["contact.txt"],

  experience() {
    const e = FS["experience"];
    return Object.keys(e).map((f) => e[f]).join("\n\n<span class='out-muted'>" + "─".repeat(40) + "</span>\n\n");
  },

  projects() {
    return `<span class="out-cyan">Selected work</span>
  • <span class="out-green">terraform-azure-platform</span>  reusable IaC modules for Azure landing zones
  • <span class="out-green">gitops-argocd-aks</span>         app-of-apps delivery onto AKS
  • <span class="out-green">databricks-asset-bundles</span>  automated workspace + job deployments
  • <span class="out-green">ci-cd-accelerator</span>         pipeline templates for .NET / Python

<span class="out-muted">(ask me for details — see 'contact')</span>`;
  },

  ls(args) {
    const target = args[0];
    let segs = cwd.slice();
    if (target && target !== ".") {
      segs = resolvePath(target);
      if (!segs) return `<span class="out-red">ls: ${esc(target)}: No such directory</span>`;
    }
    const node = nodeAt(segs);
    if (!node) return `<span class="out-red">ls: not a directory</span>`;
    return Object.keys(node)
      .map((k) => (typeof node[k] === "object" ? `<span class="dir">${k}/</span>` : `<span class="file">${k}</span>`))
      .join("   ");
  },

  cd(args) {
    const target = args[0];
    if (!target || target === "~") { cwd = []; return ""; }
    if (target === "..") { cwd.pop(); return ""; }
    const segs = resolvePath(target);
    if (!segs) return `<span class="out-red">cd: ${esc(target)}: No such directory</span>`;
    const node = nodeAt(segs);
    if (!node || typeof node !== "object") return `<span class="out-red">cd: ${esc(target)}: Not a directory</span>`;
    cwd = segs;
    return "";
  },

  cat(args) {
    if (!args[0]) return `<span class="out-red">cat: missing file operand</span>`;
    const segs = resolvePath(args[0]);
    if (!segs) return `<span class="out-red">cat: ${esc(args[0])}: No such file</span>`;
    const parent = nodeAt(segs.slice(0, -1));
    const name = segs[segs.length - 1];
    if (parent && typeof parent[name] === "string") return parent[name];
    if (parent && typeof parent[name] === "object") return `<span class="out-red">cat: ${esc(args[0])}: Is a directory</span>`;
    return `<span class="out-red">cat: ${esc(args[0])}: No such file</span>`;
  },

  pwd: () => "/home/pritesh" + (cwd.length ? "/" + cwd.join("/") : ""),

  tree() {
    const walk = (node, prefix) => {
      const keys = Object.keys(node);
      return keys.map((k, i) => {
        const last = i === keys.length - 1;
        const branch = last ? "└── " : "├── ";
        const isDir = typeof node[k] === "object";
        let line = prefix + branch + (isDir ? `<span class="dir">${k}/</span>` : `<span class="file">${k}</span>`);
        if (isDir) line += "\n" + walk(node[k], prefix + (last ? "    " : "│   "));
        return line;
      }).join("\n");
    };
    return `<span class="dir">~</span>\n` + walk(FS, "");
  },

  "kubectl"(args) {
    if (args[0] === "get" && (args[1] === "pods" || args[1] === "po")) {
      return `<span class="out-muted">NAME                          READY   STATUS    RESTARTS   AGE</span>
api-gateway-7d9f8c            1/1     <span class="out-green">Running</span>   0          42d
argocd-server-5c7b9           1/1     <span class="out-green">Running</span>   0          42d
terraform-controller-0        1/1     <span class="out-green">Running</span>   0          42d
databricks-job-runner-2k      1/1     <span class="out-green">Running</span>   0          12d
monitoring-grafana-9xz        1/1     <span class="out-green">Running</span>   0          42d
pritesh-skills-deploy-abc     1/1     <span class="out-green">Running</span>   0          9y`;
    }
    if (args[0] === "get" && (args[1] === "nodes" || args[1] === "no")) {
      return `<span class="out-muted">NAME     STATUS   ROLES           AGE   VERSION</span>
node-1   <span class="out-green">Ready</span>    control-plane   9y    v1.31.0
node-2   <span class="out-green">Ready</span>    worker          9y    v1.31.0
node-3   <span class="out-green">Ready</span>    worker          9y    v1.31.0`;
    }
    return `<span class="out-amber">usage: kubectl get [pods|nodes]</span>`;
  },

  terraform(args) {
    if (args[0] === "apply" || args[0] === "plan") {
      return `<span class="out-cyan">Initializing modules...</span>
<span class="out-cyan">Initializing provider plugins... azurerm, azuread</span>

  <span class="out-green">+</span> azurerm_resource_group.platform
  <span class="out-green">+</span> azurerm_kubernetes_cluster.aks
  <span class="out-green">+</span> azurerm_data_factory.adf
  <span class="out-green">+</span> azurerm_databricks_workspace.dbx

<span class="out-green">Apply complete! Resources: 24 added, 0 changed, 0 destroyed.</span>`;
    }
    return `<span class="out-amber">usage: terraform [plan|apply]</span>`;
  },

  docker(args) {
    if (args[0] === "ps") {
      return `<span class="out-muted">CONTAINER ID   IMAGE              STATUS         PORTS</span>
a1b2c3d4e5f6   portfolio:latest   <span class="out-green">Up 42 days</span>     0.0.0.0:443->443
f6e5d4c3b2a1   argocd:stable      <span class="out-green">Up 42 days</span>     8080/tcp
9z8y7x6w5v4u   grafana:11         <span class="out-green">Up 42 days</span>     3000/tcp`;
    }
    return `<span class="out-amber">usage: docker ps</span>`;
  },

  git(args) {
    if (args[0] === "log") {
      return `<span class="out-amber">commit a6c5056</span> (HEAD -> main)
  Redesign portfolio with DevOps-themed UI
<span class="out-amber">commit 477c913</span>
  Save terminal theme as backup
<span class="out-amber">commit 95eb176</span>
  Create GitHub Pages DevOps portfolio
<span class="out-muted">  ... 9 years of commits ...</span>`;
    }
    return `<span class="out-amber">usage: git log</span>`;
  },

  neofetch() {
    return `<span class="out-green">       _____           </span>   <span class="out-cyan">${USER}@${HOST}</span>
<span class="out-green">      / ___/__  ____ _  </span>   ────────────────
<span class="out-green">      \\__ \\/ _ \\/ __ \`/  </span>   <span class="out-green">role</span>     DevOps & Platform Engineer
<span class="out-green">     ___/ /  __/ /_/ /   </span>   <span class="out-green">exp</span>      9+ years
<span class="out-green">    /____/\\___/\\__, /    </span>   <span class="out-green">cloud</span>    Azure · AWS
<span class="out-green">              /____/     </span>   <span class="out-green">orch</span>     Kubernetes · ArgoCD
                          <span class="out-green">iac</span>      Terraform · Ansible
                          <span class="out-green">uptime</span>   99.9%
                          <span class="out-green">shell</span>    /bin/zsh`;
  },

  history: () => history.map((h, i) => `  ${String(i + 1).padStart(3)}  ${esc(h)}`).join("\n") || "(empty)",
  date: () => new Date().toString(),
  echo: (args) => esc(args.join(" ")),
  whoami: () => "pritesh — the one automating your infra while you read this.",

  theme() {
    cycleTheme();
    return `<span class="out-cyan">theme → ${document.documentElement.dataset.theme}</span>`;
  },

  clear() { output.innerHTML = ""; return null; },

  // easter eggs
  sudo: () => `<span class="out-red">[sudo] password for guest:</span> <span class="out-muted">nice try 😏 — you don't have root here.</span>`,
  "rm": (args) => args.join(" ").includes("-rf")
    ? `<span class="out-red">rm: refusing to remove '/' — this incident will be reported. 🚨</span>`
    : `<span class="out-amber">rm: nothing to remove (this is a portfolio, not prod).</span>`,
  exit: () => `<span class="out-muted">There is no exit. Only more YAML. 📄</span>`,
  coffee: () => `<span class="out-amber">☕ brewing... deploy responsibly.</span>`,
};

// aliases
COMMANDS.k = COMMANDS.kubectl;
COMMANDS.tf = COMMANDS.terraform;
COMMANDS.cert = COMMANDS.certs;

// ── Path resolver ──
function resolvePath(p) {
  let segs = p.startsWith("~") || p.startsWith("/") ? [] : cwd.slice();
  const parts = p.replace(/^~\/?/, "").replace(/^\//, "").split("/").filter(Boolean);
  for (const part of parts) {
    if (part === ".") continue;
    if (part === "..") { segs.pop(); continue; }
    segs.push(part);
  }
  // validate intermediate dirs exist (final may be file)
  let node = FS;
  for (let i = 0; i < segs.length; i++) {
    if (node && typeof node === "object" && segs[i] in node) {
      node = node[segs[i]];
    } else {
      return null;
    }
  }
  return segs;
}

// ── Execute ──
function run(raw) {
  const line = raw.trim();
  printCommand(raw);
  if (line) { history.push(line); histIdx = history.length; }
  if (!line) return;

  const parts = line.split(/\s+/);
  const cmd = parts[0];
  const args = parts.slice(1);

  if (cmd in COMMANDS) {
    const result = COMMANDS[cmd](args);
    if (result !== null && result !== undefined && result !== "") print(`<div class="out">${result}</div>`);
  } else {
    print(`<span class="out-red">zsh: command not found: ${esc(cmd)}</span> <span class="out-muted">— type 'help'</span>`);
  }
  setPrompt();
}

// ── Tab autocomplete ──
function autocomplete() {
  const val = input.value;
  const parts = val.split(/\s+/);
  if (parts.length === 1) {
    const matches = Object.keys(COMMANDS).filter((c) => c.startsWith(parts[0]));
    if (matches.length === 1) { input.value = matches[0] + " "; }
    else if (matches.length > 1) { printCommand(val); print(`<span class="out-muted">${matches.join("   ")}</span>`); }
  } else {
    // complete file/dir in cwd
    const frag = parts[parts.length - 1];
    const node = nodeAt(cwd) || {};
    const matches = Object.keys(node).filter((k) => k.startsWith(frag));
    if (matches.length === 1) {
      parts[parts.length - 1] = matches[0] + (typeof node[matches[0]] === "object" ? "/" : "");
      input.value = parts.join(" ");
    } else if (matches.length > 1) {
      printCommand(val); print(`<span class="out-muted">${matches.join("   ")}</span>`);
    }
  }
  syncTyped();
}

// ── Input mirroring ──
function syncTyped() { typed.textContent = input.value; }

input.addEventListener("input", syncTyped);

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const v = input.value;
    input.value = ""; syncTyped();
    run(v);
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    if (histIdx > 0) { histIdx--; input.value = history[histIdx] || ""; syncTyped(); }
  } else if (e.key === "ArrowDown") {
    e.preventDefault();
    if (histIdx < history.length - 1) { histIdx++; input.value = history[histIdx] || ""; }
    else { histIdx = history.length; input.value = ""; }
    syncTyped();
  } else if (e.key === "Tab") {
    e.preventDefault();
    autocomplete();
  } else if (e.key === "l" && e.ctrlKey) {
    e.preventDefault();
    output.innerHTML = "";
  }
});

// keep focus on the hidden input
function focusInput() { input.focus({ preventScroll: true }); }
screen.addEventListener("click", focusInput);
document.addEventListener("click", (e) => {
  if (e.target.closest(".hintbar") || e.target.closest("a")) return;
  focusInput();
});

// hint buttons
document.querySelectorAll(".hintbar button").forEach((btn) => {
  btn.addEventListener("click", () => {
    const c = btn.dataset.cmd;
    input.value = ""; syncTyped();
    run(c);
    focusInput();
  });
});

// theme toggle
const THEMES = ["matrix", "amber", "blue"];
function cycleTheme() {
  const cur = document.documentElement.dataset.theme || "matrix";
  const next = THEMES[(THEMES.indexOf(cur) + 1) % THEMES.length];
  document.documentElement.dataset.theme = next;
}
themeBtn.addEventListener("click", () => { cycleTheme(); focusInput(); });

// ── Boot sequence ──
const boot = [
  { t: "Booting pritesh-cluster...", c: "out-muted" },
  { t: "[ OK ] Mounted virtual filesystem", c: "out-green" },
  { t: "[ OK ] Started CI/CD daemon", c: "out-green" },
  { t: "[ OK ] Reconciled GitOps state (ArgoCD: Healthy)", c: "out-green" },
  { t: "[ OK ] All systems operational", c: "out-green" },
  { t: "", c: "" },
];

let bootIdx = 0;
function bootSeq() {
  if (bootIdx < boot.length) {
    const b = boot[bootIdx++];
    print(`<span class="${b.c}">${b.t}</span>`);
    setTimeout(bootSeq, 230);
  } else {
    print(`<span class="out-cyan">Welcome — this is an interactive terminal. Type <span class="out-green">help</span> to begin.</span>`);
    print("");
    document.documentElement.dataset.theme = "matrix";
    setPrompt();
    focusInput();
  }
}

document.documentElement.dataset.theme = "matrix";
bootSeq();

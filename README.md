# Pritesh Singh — Portfolio (GitHub Pages)

Static, GitHub Pages-ready portfolio. No build step.

## Versions

| Path | Audience | Description |
|------|----------|-------------|
| `/` (root) | **Recruiters / HR** | Clean, professional, everything visible by scrolling. One-click contact + Download CV. |
| `/v3-interactive/` | Engineers | A real interactive terminal — type commands to explore. |
| `/v2-k8s/` | Engineers | Animated Kubernetes cluster-map theme. |
| `/backup-v1-terminal/` | Backup | Original terminal-styled static page. |

## Run locally

```bash
python3 -m http.server 8080
```

Open `http://localhost:8080`.

## Download CV

The root site’s **Download CV** button uses the browser’s print-to-PDF with a
print-optimized stylesheet, so recruiters get a clean one-page PDF instantly.

## Deploy (GitHub Pages)

Settings → Pages → Deploy from branch → `main` → `/root`.
Live at: https://priteshksr.github.io/pritesh-portfolio/

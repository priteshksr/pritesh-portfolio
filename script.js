// progressive enhancement (content visible without JS)
document.documentElement.classList.add("js");
document.body.classList.add("js");

// year
const year = document.getElementById("year");
if (year) year.textContent = String(new Date().getFullYear());

// scroll reveal
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);
document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

// safety: reveal everything shortly after load
window.addEventListener("load", () => {
  setTimeout(() => document.querySelectorAll(".reveal:not(.in)").forEach((el) => el.classList.add("in")), 1000);
});

// tile spotlight follows cursor
document.querySelectorAll(".tile").forEach((tile) => {
  tile.addEventListener("mousemove", (e) => {
    const r = tile.getBoundingClientRect();
    tile.style.setProperty("--mx", `${e.clientX - r.left}px`);
    tile.style.setProperty("--my", `${e.clientY - r.top}px`);
  });
});

// Download CV -> print to PDF
const printBtn = document.getElementById("printBtn");
if (printBtn) printBtn.addEventListener("click", () => window.print());

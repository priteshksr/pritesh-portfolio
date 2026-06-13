// progressive enhancement flag (content is visible without JS)
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
  { threshold: 0.12 }
);
document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

// fallback: ensure everything shows even if observer never fires
window.addEventListener("load", () => {
  setTimeout(() => {
    document.querySelectorAll(".reveal:not(.in)").forEach((el) => el.classList.add("in"));
  }, 1200);
});

// Download CV -> print to PDF
function printCV() { window.print(); }
["printBtn", "printBtn2"].forEach((id) => {
  const btn = document.getElementById(id);
  if (btn) btn.addEventListener("click", printCV);
});

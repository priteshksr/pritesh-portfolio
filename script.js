const revealElements = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.15 }
);

revealElements.forEach((item) => observer.observe(item));

const year = document.getElementById("year");
if (year) {
  year.textContent = String(new Date().getFullYear());
}

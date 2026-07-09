const b = document.querySelector(".mobile-toggle"),
  n = document.querySelector(".navlinks");
n.classList.remove("open");
b.setAttribute("aria-expanded", "false");
if (b && n) {
  b.addEventListener("click", () => {
    const o = n.classList.toggle("open");
    b.setAttribute("aria-expanded", String(o));
  });
}

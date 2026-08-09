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

document.querySelectorAll('a[href*="wa.me"]').forEach((link) => {
  link.addEventListener("click", () => {
    if (typeof gtag === "function") {
      gtag("event", "whatsapp_click", {
        contact_method: "whatsapp",
        cta_source: link.textContent.trim() || "whatsapp_link",
        page_language: document.documentElement.lang || "unknown",
      });
    }
  });
});

document.querySelectorAll('a[href^="mailto:"]').forEach((link) => {
  link.addEventListener("click", () => {
    if (typeof gtag === "function") {
      gtag("event", "email_click", {
        contact_method: "email",
        cta_source: link.textContent.trim() || "email_link",
        page_language: document.documentElement.lang || "unknown",
      });
    }
  });
});

(() => {
  const key = "bridgepoint.pending-enquiry.v1";
  const maxAge = 30 * 60 * 1000;
  // Treat legacy file URLs and clean public routes as the same form journey.
  function normalizePath(path) {
    return typeof path === "string" ? path.replace(/\.html$/, "") : null;
  }
  const form = document.querySelector(
    'form[name="bridgepoint-enquiry"], form[name="bridgepoint-enquiry-es"]'
  );

  function clearPending() {
    try {
      sessionStorage.removeItem(key);
    } catch (_) {
      // Tracking must never interfere with the native form submission.
    }
  }

  if (form) {
    // A return to the form, including browser Back, abandons any old attempt.
    clearPending();
    window.addEventListener("pageshow", clearPending);
    form.addEventListener("submit", (event) => {
      clearPending();
      if (event.defaultPrevented || !form.checkValidity()) return;
      try {
        sessionStorage.setItem(key, JSON.stringify({
          source: normalizePath(location.pathname),
          destination: normalizePath(new URL(form.action, location.href).pathname),
          submittedAt: Date.now(),
        }));
      } catch (_) {
        // No reliable deduplication storage: skip analytics, not the enquiry.
      }
    });
    return;
  }

  if (!/^\/thank-you(?:-es)?(?:\.html)?$/.test(location.pathname)) return;
  let pending;
  try {
    pending = JSON.parse(sessionStorage.getItem(key));
    // Consume before queuing: reloads, revisits and language changes cannot reuse it.
    sessionStorage.removeItem(key);
  } catch (_) {
    clearPending();
    return;
  }
  if (!pending) return;
  const age = Date.now() - pending.submittedAt;
  const navigation = performance.getEntriesByType("navigation")[0];
  let referrer;
  try {
    referrer = new URL(document.referrer);
  } catch (_) {
    return;
  }
  if (
    !Number.isFinite(age) || age < 0 || age > maxAge ||
    normalizePath(pending.destination) !== normalizePath(location.pathname) ||
    referrer.origin !== location.origin ||
    normalizePath(referrer.pathname) !== normalizePath(pending.source) ||
    (navigation && navigation.type !== "navigate")
  ) return;

  if (typeof window.gtag === "function") {
    window.gtag("event", "form_enquiry", {
      contact_method: "form",
      cta_source: "project_enquiry_form",
      page_language: document.documentElement.lang,
    });
  }
})();

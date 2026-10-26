(() => {
  const dialog = document.querySelector('#horizon-plan-dialog');
  const opener = document.querySelector('[data-plan-open]');
  if (!dialog || !opener) return;
  const zoom = dialog.querySelector('[data-plan-zoom]');
  opener.addEventListener('click', () => dialog.showModal());
  dialog.querySelector('[data-plan-close]').addEventListener('click', () => dialog.close());
  zoom.addEventListener('click', () => {
    zoom.setAttribute('aria-pressed', String(dialog.classList.toggle('plan-zoomed')));
  });
  dialog.addEventListener('close', () => {
    dialog.classList.remove('plan-zoomed');
    zoom.setAttribute('aria-pressed', 'false');
    opener.focus();
  });
})();

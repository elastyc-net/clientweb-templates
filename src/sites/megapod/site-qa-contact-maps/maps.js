(() => {
  const root = document.querySelector('[data-mp-contact-page]');
  if (!root) return;
  const dialog = root.querySelector('.mp-location-dialog');
  if (!dialog) return;
  const title = dialog.querySelector('[data-mp-map-title]');
  const address = dialog.querySelector('[data-mp-map-address]');
  const panels = [...dialog.querySelectorAll('[data-mp-map-panel]')];
  const directions = dialog.querySelector('[data-mp-map-directions]');
  let opener;

  root.querySelectorAll('[data-mp-open-map]').forEach(button => {
    button.addEventListener('click', () => {
      opener = button;
      title.textContent = button.dataset.mpMapName;
      address.textContent = button.dataset.mpMapAddress;
      directions.href = button.dataset.mpMapDirections;
      panels.forEach(panel => { panel.hidden = panel.dataset.mpMapPanel !== button.dataset.mpMapIndex; });
      dialog.showModal();
    });
  });
  dialog.querySelector('[data-mp-close-map]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const box = dialog.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    panels.forEach(panel => { panel.hidden = true; });
    if (opener?.isConnected) opener.focus({ preventScroll: true });
  });
})();

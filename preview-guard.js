/* Static preview: retain the original form, but never submit to production. */
document.addEventListener('submit', function (event) {
  if (!event.target.matches('.elementor-form')) return;
  event.preventDefault();
  event.stopImmediatePropagation();
  let notice = event.target.querySelector('[data-preview-notice]');
  if (!notice) {
    notice = document.createElement('p');
    notice.dataset.previewNotice = '';
    notice.setAttribute('role', 'status');
    event.target.appendChild(notice);
  }
  notice.textContent = document.documentElement.lang.startsWith('en')
    ? 'Preview: this form does not send messages. Please contact studio@estatestar.de.'
    : 'Testversion: Dieses Formular versendet keine Nachrichten. Kontakt: studio@estatestar.de.';
}, true);

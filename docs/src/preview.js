(function () {
  'use strict';

  const code = document.getElementById('embed-code');
  const button = document.getElementById('copy-embed');
  const status = document.getElementById('copy-status');
  const bannerUrl = new URL('banner.html', window.location.href).href.split('#')[0];
  const embed = `<iframe
  src="${bannerUrl}"
  title="SR008 interactive Chrome banner"
  loading="eager"
  scrolling="no"
  style="display:block;width:100%;aspect-ratio:1800/430;border:0;border-radius:12px;overflow:hidden;background:transparent"
></iframe>`;

  code.textContent = embed;

  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(embed);
    } catch {
      const field = document.createElement('textarea');
      field.value = embed;
      field.setAttribute('readonly', '');
      field.style.position = 'fixed';
      field.style.opacity = '0';
      document.body.appendChild(field);
      field.select();
      document.execCommand('copy');
      field.remove();
    }

    button.textContent = 'Copied';
    status.textContent = 'Embed code copied to clipboard.';
    window.setTimeout(() => {
      button.textContent = 'Copy Embed Code';
      status.textContent = '';
    }, 1600);
  });
}());

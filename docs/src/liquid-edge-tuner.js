const frame = document.getElementById('liquid-edge-banner');
const ranges = [...document.querySelectorAll('[data-edge-setting]')];
const resetButton = document.getElementById('reset-edge-settings');
const copyButton = document.getElementById('copy-edge-settings');
const status = document.getElementById('edge-tuner-status');

const defaults = Object.fromEntries(
  ranges.map((input) => [input.dataset.edgeSetting, Number(input.defaultValue)]),
);

function valueDecimals (input) {
  const step = String(input.step || '1');
  return step.includes('.') ? step.split('.')[1].length : 0;
}

function updateControl (input) {
  const value = Number(input.value);
  const minimum = Number(input.min);
  const maximum = Number(input.max);
  const progress = ((value - minimum) / Math.max(maximum - minimum, 0.0001)) * 100;
  input.style.setProperty('--range-progress', `${progress}%`);
  const unit = input.dataset.unit || '';
  input.closest('.edge-control').querySelector('output').textContent =
    `${value.toFixed(valueDecimals(input))}${unit}`;
}

function settings () {
  return Object.fromEntries(
    ranges.map((input) => [input.dataset.edgeSetting, Number(input.value)]),
  );
}

function sendSettings () {
  const targetOrigin = location.origin === 'null' ? '*' : location.origin;
  frame.contentWindow?.postMessage({
    type: 'sr008-liquid-edge-config',
    values: settings(),
  }, targetOrigin);
}

async function copySettings () {
  const value = `// Liquid metal edge settings\n${JSON.stringify(settings(), null, 2)}`;
  try {
    await navigator.clipboard.writeText(value);
  } catch (_) {
    const textarea = document.createElement('textarea');
    textarea.value = value;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.append(textarea);
    textarea.select();
    document.execCommand('copy');
    textarea.remove();
  }
  status.textContent = 'Liquid edge settings copied.';
}

for (const input of ranges) {
  updateControl(input);
  input.addEventListener('input', () => {
    updateControl(input);
    sendSettings();
    status.textContent = '';
  });
}

resetButton.addEventListener('click', () => {
  for (const input of ranges) {
    input.value = defaults[input.dataset.edgeSetting];
    updateControl(input);
  }
  sendSettings();
  status.textContent = 'Liquid edge settings reset.';
});

copyButton.addEventListener('click', copySettings);
frame.addEventListener('load', sendSettings);

addEventListener('message', (event) => {
  if (location.origin !== 'null' && event.origin !== location.origin) return;
  if (event.data?.type === 'sr008-liquid-edge-ready') sendSettings();
});

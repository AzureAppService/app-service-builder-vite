/// <reference types="vite/client" />

import './style.css';

const greeting = document.querySelector<HTMLParagraphElement>('#greeting');
const publicGreeting = import.meta.env.VITE_SAMPLE_GREETING || 'Hello from Vite.';
if (greeting) {
  // VITE_* values are public build-time data. textContent avoids interpreting HTML.
  greeting.textContent = publicGreeting;
}

const healthButton = document.querySelector<HTMLButtonElement>('[data-health-check]');
const healthStatus = document.querySelector<HTMLParagraphElement>('#health-status');
healthButton?.addEventListener('click', async () => {
  if (!healthStatus) return;
  healthButton.disabled = true;
  healthStatus.textContent = 'Checking this app...';
  try {
    const response = await fetch('/health', { cache: 'no-store', signal: AbortSignal.timeout(5000) });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    if ((await response.text()).trim() !== 'OK') throw new Error('Unexpected health response');
    healthStatus.textContent = 'Healthy: /health returned HTTP 200 and OK. Static-file liveness only.';
  } catch (error) {
    healthStatus.textContent = `Health check failed: ${error instanceof Error ? error.message : 'Request failed'}. Retry the check.`;
  } finally {
    healthButton.disabled = false;
  }
});

document.querySelector<HTMLAnchorElement>('a[href="#customize"]')?.addEventListener('click', () => {
  const customize = document.querySelector<HTMLDetailsElement>('#customize');
  if (customize) customize.open = true;
});

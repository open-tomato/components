/**
 * The review page's only script, inlined as text: it filters the page by
 * shape of change, keeps one verdict per batch in localStorage, under a key named after the run, and writes the
 * accept command and the red list from them. The page still reads without
 * it; storage that throws (a private window) just keeps verdicts in memory.
 */
export const VERDICT_SCRIPT: string = String.raw`
(() => {
  const storageKey = 'visual-review:' + document.body.dataset.run;
  const batches = [...document.querySelectorAll('.batch')];
  let verdicts = {};
  try { verdicts = JSON.parse(localStorage.getItem(storageKey) || '{}'); } catch { verdicts = {}; }
  const save = () => { try { localStorage.setItem(storageKey, JSON.stringify(verdicts)); } catch {} };
  const render = () => {
    const green = [], red = [];
    for (const batch of batches) {
      const key = batch.dataset.key, verdict = verdicts[key] || '';
      batch.classList.toggle('green', verdict === 'green');
      batch.classList.toggle('red', verdict === 'red');
      batch.classList.toggle('decided', verdict !== '');
      const item = document.querySelector('[data-index="' + key + '"]');
      item.className = verdict ? verdict + ' decided' : '';
      if (verdict === 'green') green.push(key);
      if (verdict === 'red') red.push(batch.dataset.name + ' (' + key + ')');
    }
    document.getElementById('progress').textContent = (green.length + red.length) + ' of ' + batches.length + ' decided: ' + green.length + ' green, ' + red.length + ' red';
    document.getElementById('accept').value = green.length ? 'bun run visual:accept ' + green.join(' ') : '';
    document.getElementById('red').value = red.join('\n');
  };
  for (const batch of batches) {
    batch.querySelector('.verdict').addEventListener('click', (event) => {
      const button = event.target.closest('[data-verdict]');
      if (!button) return;
      const verdict = button.dataset.verdict;
      if (verdict) verdicts = { ...verdicts, [batch.dataset.key]: verdict };
      else { const { [batch.dataset.key]: _, ...rest } = verdicts; verdicts = rest; }
      save();
      render();
      if (verdict) {
        const next = batches.slice(batches.indexOf(batch) + 1).find((other) => !verdicts[other.dataset.key] && other.offsetParent !== null);
        if (next) next.scrollIntoView({ block: 'start' });
      }
    });
  }
  document.getElementById('undecided').addEventListener('change', (event) => document.body.classList.toggle('undecided', event.target.checked));
  const filters = [...document.querySelectorAll('[data-filter]')];
  for (const button of filters) {
    button.addEventListener('click', () => {
      const shape = button.dataset.filter;
      if (shape) document.body.dataset.shape = shape;
      else delete document.body.dataset.shape;
      for (const other of filters) other.classList.toggle('active', other === button);
    });
  }
  render();
})();
`;

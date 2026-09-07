'use strict';

const docs = window.MERCURY_DOCS;

function escapeHtml(value) {
  return String(value).replace(/[&<>"]/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;'
  })[character]);
}

function renderApi(selectedId) {
  const selected = docs.helpers.find(helper => helper.id === selectedId) || docs.helpers[0];
  document.querySelector('[data-api-tabs]').innerHTML = docs.helpers.map(helper =>
    `<button type="button" role="tab" aria-selected="${helper.id === selected.id}" data-helper="${helper.id}">${escapeHtml(helper.name)}</button>`
  ).join('');
  document.querySelector('[data-api-panel]').innerHTML = `
    <h3>${escapeHtml(selected.signature)}</h3>
    <p>${escapeHtml(selected.description)}</p>
    <ul>${selected.notes.map(note => `<li>${escapeHtml(note)}</li>`).join('')}</ul>
    <pre><code>${escapeHtml(selected.example)}</code></pre>
    <button class="copy" type="button" data-copy-api>Copy example</button>
  `;
  document.querySelectorAll('[data-helper]').forEach(button => {
    button.addEventListener('click', () => renderApi(button.dataset.helper));
  });
  document.querySelector('[data-copy-api]').addEventListener('click', event => copyText(selected.example, event.currentTarget));
}

function renderFeatures() {
  document.querySelector('[data-feature-grid]').innerHTML = docs.features.map(feature => `
    <article class="feature-card">
      <h3>${escapeHtml(feature.name)}</h3>
      <p>${escapeHtml(feature.detail)}</p>
    </article>
  `).join('');
}

function renderModes(selectedId) {
  const selected = docs.modes.find(mode => mode.id === selectedId) || docs.modes[0];
  document.querySelector('[data-mode-tabs]').innerHTML = docs.modes.map(mode =>
    `<button type="button" role="tab" aria-selected="${mode.id === selected.id}" data-mode="${mode.id}">${escapeHtml(mode.name)}</button>`
  ).join('');
  document.querySelector('[data-mode-panel]').innerHTML = `
    <h3>${escapeHtml(selected.name)}</h3>
    <dl><div><dt>Reads</dt><dd>${escapeHtml(selected.reads)}</dd></div><div><dt>Writes</dt><dd>${escapeHtml(selected.writes)}</dd></div><div><dt>Approval</dt><dd>${escapeHtml(selected.confirmation)}</dd></div><div><dt>History</dt><dd>${escapeHtml(selected.history)}</dd></div></dl>
    <p>${escapeHtml(selected.note)}</p>`;
  document.querySelectorAll('[data-mode]').forEach(button => button.addEventListener('click', () => renderModes(button.dataset.mode)));
}

function renderPrivacy(selectedId) {
  const selected = docs.privacyStages.find(stage => stage.id === selectedId) || docs.privacyStages[0];
  document.querySelector('[data-privacy-tabs]').innerHTML = docs.privacyStages.map(stage =>
    `<button type="button" role="tab" aria-selected="${stage.id === selected.id}" data-privacy-stage="${stage.id}">${escapeHtml(stage.name)}</button>`
  ).join('');
  document.querySelector('[data-privacy-panel]').innerHTML = `<p class="eyebrow">${escapeHtml(selected.name)}</p><h3>${escapeHtml(selected.title)}</h3><p>${escapeHtml(selected.detail)}</p>`;
  document.querySelectorAll('[data-privacy-stage]').forEach(button => button.addEventListener('click', () => renderPrivacy(button.dataset.privacyStage)));
}

function renderRecipe(selectedTitle) {
  const selected = docs.recipes.find(recipe => recipe.title === selectedTitle) || docs.recipes[0];
  document.querySelector('[data-recipe-tabs]').innerHTML = docs.recipes.map(recipe =>
    `<button type="button" aria-pressed="${recipe.title === selected.title}" data-recipe="${escapeHtml(recipe.title)}">${escapeHtml(recipe.title)}</button>`
  ).join('');
  document.querySelector('[data-recipe-source]').textContent = selected.source;
  document.querySelectorAll('[data-recipe]').forEach(button => button.addEventListener('click', () => renderRecipe(button.dataset.recipe)));
  document.querySelector('[data-copy-recipe]').onclick = event => copyText(selected.source, event.currentTarget);
}

function renderExample(form) {
  const values = new FormData(form);
  const output = {
    method: 'jira.updateIssue',
    arguments: [
      values.get('key'),
      { fields: { summary: `[${values.get('status')}] ${values.get('summary')}` } }
    ]
  };
  document.querySelector('[data-example-output]').textContent = JSON.stringify(output, null, 2);
}

function setupPricing() {
  const form = document.querySelector('[data-pricing-form]');
  if (!form) return;

  const total = form.querySelector('[data-pricing-total]');
  const summary = form.querySelector('[data-pricing-summary]');
  const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

  function render() {
    const users = Number(form.elements.users.value);
    try {
      const estimate = globalThis.MERCURY_PRICING.calculateMonthlyPrice(users);
      total.textContent = currency.format(estimate.total);
      summary.textContent = users <= 10
        ? `${users.toLocaleString('en-US')} users on the $10 flat plan`
        : estimate.lines.map(line => `${line.users.toLocaleString('en-US')} × ${currency.format(line.rate)}`).join(' + ');
    } catch (error) {
      total.textContent = 'Enter 1–100,000 users';
      summary.textContent = error.message;
    }
  }

  form.addEventListener('submit', event => {
    event.preventDefault();
    render();
  });
  form.elements.users.addEventListener('input', render);
  render();
}

async function copyText(value, button) {
  await navigator.clipboard.writeText(value);
  const previous = button.textContent;
  button.textContent = 'Copied';
  window.setTimeout(() => { button.textContent = previous; }, 1200);
}

function setupSearch() {
  const dialog = document.querySelector('[data-search-dialog]');
  const input = document.querySelector('[data-search-input]');
  const results = document.querySelector('[data-search-results]');

  function search() {
    const query = input.value.trim().toLowerCase();
    const matches = query
      ? docs.search.filter(item => `${item.title} ${item.section} ${item.text}`.toLowerCase().includes(query)).slice(0, 6)
      : docs.search.slice(0, 6);
    results.innerHTML = matches.length
      ? matches.map(item => `<a class="search-result" href="${item.href}"><strong>${escapeHtml(item.title)}</strong><span>${escapeHtml(item.section)}</span></a>`).join('')
      : '<p class="search-empty">No matching documentation.</p>';
    results.querySelectorAll('a').forEach(link => link.addEventListener('click', () => dialog.close()));
  }

  function openSearch() {
    dialog.showModal();
    search();
    window.setTimeout(() => input.focus(), 0);
  }

  document.querySelector('[data-search-open]').addEventListener('click', openSearch);
  input.addEventListener('input', search);
  document.addEventListener('keydown', event => {
    if (event.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
      event.preventDefault();
      openSearch();
    }
  });
}

const legacyAnchors = new Set([
  'mercury-getting-started',
  'mercury-example',
  'mercury-privacy-policy',
  'mercury-data-security-and-privacy-for-atlassian-plugins',
  'mercury-terms-of-service',
  'mercury-eula-for-atlassian-plugins'
]);

if (legacyAnchors.has(location.hash.slice(1))) {
  location.replace(`./legacy.html${location.hash}`);
} else {
  renderApi(docs.helpers[0].id);
  renderRecipe(docs.recipes[0].title);
  renderFeatures();
  renderModes(docs.modes[0].id);
  renderPrivacy(docs.privacyStages[0].id);
  const exampleForm = document.querySelector('[data-example-form]');
  exampleForm.addEventListener('submit', event => {
    event.preventDefault();
    renderExample(exampleForm);
  });
  renderExample(exampleForm);
  setupPricing();
  document.querySelector('[data-copy-output]').addEventListener('click', event => {
    copyText(document.querySelector('[data-example-output]').textContent, event.currentTarget);
  });
  setupSearch();
}

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
      <span class="status ${feature.status}">${feature.status === 'available' ? 'Implemented' : feature.status === 'testing' ? 'In testing' : feature.status}</span>
      <h3>${escapeHtml(feature.name)}</h3>
      <p>${escapeHtml(feature.detail)}</p>
    </article>
  `).join('');
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
  renderFeatures();
  const exampleForm = document.querySelector('[data-example-form]');
  exampleForm.addEventListener('submit', event => {
    event.preventDefault();
    renderExample(exampleForm);
  });
  renderExample(exampleForm);
  document.querySelector('[data-copy-output]').addEventListener('click', event => {
    copyText(document.querySelector('[data-example-output]').textContent, event.currentTarget);
  });
  setupSearch();
}

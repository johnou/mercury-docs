import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';

const pages = {
  'index.html': ['site.css', 'content.js', 'site.js'],
  'cloud-privacy.html': ['site.css'],
  'cloud-terms.html': ['site.css'],
  'data-retention.html': ['site.css'],
  'support.html': ['site.css'],
};
const digests = new Map();

for (const name of new Set(Object.values(pages).flat())) {
  const assetPath = new URL(`../assets/${name}`, import.meta.url);
  digests.set(name, createHash('sha256')
    .update(await readFile(assetPath))
    .digest('hex')
    .slice(0, 12));
}

for (const [pageName, assets] of Object.entries(pages)) {
  const pagePath = new URL(`../${pageName}`, import.meta.url);
  let page = await readFile(pagePath, 'utf8');
  for (const name of assets) {
    const reference = new RegExp(`\\./assets/${name.replace('.', '\\.')}(?:\\?v=[a-f0-9]+)?`, 'g');
    if (!reference.test(page)) throw new Error(`${pageName} does not reference assets/${name}`);
    page = page.replace(reference, `./assets/${name}?v=${digests.get(name)}`);
  }
  await writeFile(pagePath, page);
}

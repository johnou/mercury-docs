import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';

const pagePath = new URL('../index.html', import.meta.url);
const assets = ['site.css', 'content.js', 'site.js'];
let page = await readFile(pagePath, 'utf8');

for (const name of assets) {
  const assetPath = new URL(`../assets/${name}`, import.meta.url);
  const digest = createHash('sha256')
    .update(await readFile(assetPath))
    .digest('hex')
    .slice(0, 12);
  const reference = new RegExp(`\\./assets/${name.replace('.', '\\.')}(?:\\?v=[a-f0-9]+)?`, 'g');
  if (!reference.test(page)) throw new Error(`index.html does not reference assets/${name}`);
  page = page.replace(reference, `./assets/${name}?v=${digest}`);
}

await writeFile(pagePath, page);

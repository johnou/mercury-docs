import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const pages = ['index.html', 'cloud-privacy.html', 'data-retention.html', 'cloud-terms.html', 'support.html', 'legacy.html'];
const failures = [];

for (const page of pages) {
  const path = join(root, page);
  const html = readFileSync(path, 'utf8');
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
  if (duplicates.length) failures.push(`${page}: duplicate IDs ${[...new Set(duplicates)].join(', ')}`);

  for (const match of html.matchAll(/\b(?:href|src)="([^"#]+)(?:#[^"]*)?"/g)) {
    const reference = match[1];
    if (/^(?:https?:|mailto:|data:)/.test(reference)) continue;
    const clean = reference.split('?')[0];
    if (!existsSync(resolve(dirname(path), clean))) failures.push(`${page}: missing ${reference}`);
  }

  for (const match of html.matchAll(/(?:href|src)="([^"?]+)\?v=([a-f0-9]{12})"/g)) {
    const asset = resolve(dirname(path), match[1]);
    const expected = createHash('sha256').update(readFileSync(asset)).digest('hex').slice(0, 12);
    if (match[2] !== expected) failures.push(`${page}: stale version for ${basename(asset)}`);
  }
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Checked ${pages.length} pages: local links, IDs, and asset versions are valid.`);
}

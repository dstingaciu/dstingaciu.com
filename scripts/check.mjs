import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

export const root = fileURLToPath(new URL('../', import.meta.url));

/** Check publication-critical contracts without introducing build dependencies. */
export async function checkSite(directory = root) {
  const html = await readFile(resolve(directory, 'index.html'), 'utf8');
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(new Set(ids).size, ids.length, 'HTML IDs must be unique');
  assert.equal((html.match(/<h1\b/g) || []).length, 1, 'One primary heading is required');
  assert.match(html, /<html lang="en">/, 'Document language is required');
  assert.match(html, /name="description" content="[^"]+"/, 'Description is required');
  assert.match(html, /rel="canonical" href="https:\/\/dstingaciu\.com\/"/, 'Canonical URL is required');
  const resources = new Set();
  for (const [, raw] of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    if (raw.startsWith('#')) {
      assert.ok(ids.includes(raw.slice(1)), `Missing section: ${raw}`);
    } else if (!/^(?:https?:|mailto:|data:)/.test(raw)) {
      const path = resolve(directory, decodeURIComponent(raw.replace(/^\//, '')));
      assert.ok(!relative(directory, path).startsWith('..'), `Resource outside site: ${raw}`);
      await access(path);
      resources.add(path);
    }
  }
  for (const [, id] of html.matchAll(/aria-(?:labelledby|controls)="([^"]+)"/g)) {
    id.split(/\s+/).forEach((value) => assert.ok(ids.includes(value), `Missing ARIA target: ${value}`));
  }
  for (const [anchor] of html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)) {
    assert.match(anchor, /rel="[^"]*noopener/, 'New tabs require noopener');
  }
  for (const [image] of html.matchAll(/<img\b[^>]*>/g)) {
    assert.match(image, /\balt="[^"]*"/, 'Images need alternative text');
    assert.match(image, /\bwidth="\d+"/, 'Images need dimensions to prevent layout shift');
    assert.match(image, /\bheight="\d+"/, 'Images need dimensions to prevent layout shift');
  }
  const structured = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  assert.equal(JSON.parse(structured[1])['@type'], 'Person');
  const manifest = JSON.parse(await readFile(resolve(directory, 'site.webmanifest'), 'utf8'));
  await Promise.all(manifest.icons.map((icon) => access(resolve(directory, icon.src.replace(/^\//, '')))));
  await access(resolve(directory, 'images/social-preview.png'));
  return { resources: resources.size, sections: ids.length };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = await checkSite();
  console.log(`Site checks passed: ${result.resources} local resources, ${result.sections} unique IDs, valid metadata and accessibility references.`);
}

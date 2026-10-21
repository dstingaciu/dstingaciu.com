import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, access } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { checkSite, root } from '../scripts/check.mjs';
import { buildSite } from '../scripts/build.mjs';
import vm from 'node:vm';

test('the production output has all linked assets and omits historical files', async () => {
  const output = await mkdtemp(join(tmpdir(), 'portfolio-build-'));
  const result = await buildSite(output);
  assert.ok(result.bytes > 0);
  await checkSite(output);
  await assert.rejects(access(join(output, 'assets/files/Dan Stingaciu resume old old.pdf')));
  await assert.rejects(access(join(output, '.git')));
  await assert.rejects(access(join(output, 'tests')));
});

test('the engineering selector updates its accessible state and description', async () => {
  const buttons = ['interface', 'services', 'infrastructure'].map((layer) => ({
    dataset: { layer }, attributes: {},
    setAttribute(name, value) { this.attributes[name] = value; }
  }));
  let click;
  const figure = { dataset: {} };
  const selector = {
    hidden: true,
    addEventListener(type, handler) { if (type === 'click') click = handler; },
    querySelectorAll() { return buttons; }
  };
  const description = { textContent: '' };
  const elements = { '.system-figure': figure, '.layer-selector': selector, '#layer-description': description };
  const script = await readFile(join(root, 'assets/js/main.js'), 'utf8');
  vm.runInNewContext(script, {
    document: { querySelector: (key) => elements[key] || null, querySelectorAll: () => [] },
    window: {}
  });
  assert.equal(selector.hidden, false);
  for (const button of buttons) {
    click({ target: { closest: () => button } });
    assert.equal(figure.dataset.layer, button.dataset.layer);
    assert.equal(button.attributes['aria-pressed'], 'true');
    assert.equal(buttons.filter((item) => item.attributes['aria-pressed'] === 'true').length, 1);
    assert.ok(description.textContent.length > 40);
  }
  assert.match(description.textContent, /Kubernetes/);
  click({ target: { closest: () => null } });
  assert.equal(figure.dataset.layer, 'infrastructure');
});

test('enhancements tolerate missing optional UI and browser observer APIs', async () => {
  const script = await readFile(join(root, 'assets/js/main.js'), 'utf8');
  assert.doesNotThrow(() => vm.runInNewContext(script, {
    document: { querySelector: () => null, querySelectorAll: () => [] }, window: {}
  }));
});

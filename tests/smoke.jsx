// Runtime smoke test: runs every activity generator + render to static markup.
import { renderToStaticMarkup } from 'react-dom/server';
import { ACTIVITY_LIST, generateActivity, renderActivityToElement } from '../src/activities/registry.js';

let failures = 0;
const tested = [];

for (const a of ACTIVITY_LIST) {
  try {
    // default config
    const cfg = {};
    for (const f of a.configSchema) cfg[f.key] = f.default;
    // try a few seed variants + some extreme values
    const variants = [
      { seed: 'test1' },
      { seed: 'abc', ...pickExtremes(a.configSchema) },
    ];
    for (const v of variants) {
      const result = generateActivity(a.id, { ...cfg, ...v });
      if (!result || !result.data) throw new Error('no data');
      const el = renderActivityToElement(a.id, { ...cfg, ...v }, { showAnswers: true });
      const html = renderToStaticMarkup(el);
      if (!html || html.length < 20) throw new Error('empty render');
    }
    tested.push(`✓ ${a.id}`);
  } catch (e) {
    failures++;
    console.error(`✗ ${a.id}: ${e.message}`);
  }
}

function pickExtremes(schema) {
  const out = {};
  for (const f of schema) {
    if (f.type === 'range') out[f.key] = f.max;
    if (f.type === 'select') out[f.key] = f.options[f.options.length - 1].value;
    if (f.type === 'theme') out[f.key] = 'vehicles';
    if (f.type === 'text') out[f.key] = 'ABC';
  }
  return out;
}

console.log(tested.join('\n'));
console.log(`\n${ACTIVITY_LIST.length} activities, ${failures} failures.`);
if (failures > 0) process.exit(1);

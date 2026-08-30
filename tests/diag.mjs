import { build } from 'esbuild';
import { pathToFileURL } from 'url';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// bundle a tiny renderer
const src = `
import { renderToStaticMarkup } from 'react-dom/server';
import { renderActivityToElement, generateActivity } from '../src/activities/registry.js';
const cfg = { grade: 'grade2', count: 4, seed: 'diag' };
const res = generateActivity('addition', cfg);
console.log('OPERANDS:', res.data.items.map(i=>i.left+'+'+i.right).join(', '));
const el = renderActivityToElement('addition', cfg, { showAnswers: true });
const html = renderToStaticMarkup(el);
const s = html.indexOf('ws-vgrid');
console.log('HAS ws-vgrid:', s > -1);
console.log(html.slice(Math.max(0,html.indexOf('ws-v-op')-120), html.indexOf('ws-v-op')+620));
`;
await build({ stdin: { contents: src, resolveDir: __dirname, loader: 'jsx' }, bundle: true, outfile: path.join(__dirname, 'diag-out.mjs'), format: 'esm', platform: 'node', packages: 'external', jsx: 'automatic' });
await import(pathToFileURL(path.join(__dirname, 'diag-out.mjs')).href);

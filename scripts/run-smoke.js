// Bundles and runs the generator smoke test.
import esbuild from 'esbuild';
import { pathToFileURL } from 'url';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

await esbuild.build({
  entryPoints: [path.join(__dirname, '..', 'tests', 'smoke.jsx')],
  bundle: true,
  outfile: path.join(__dirname, '..', 'tests', 'out.js'),
  format: 'esm',
  platform: 'node',
  packages: 'external',
  jsx: 'automatic',
});

const outUrl = pathToFileURL(path.join(__dirname, '..', 'tests', 'out.js')).href;
await import(outUrl);

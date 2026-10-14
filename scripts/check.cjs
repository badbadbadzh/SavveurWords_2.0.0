'use strict';
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const {execFileSync} = require('node:child_process');
const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'docs/index.html'), 'utf8');
let scripts = 0;
for (const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
  if (/\bsrc\s*=/.test(match[1]) || /type\s*=\s*["'](?:application\/ld\+json|application\/json)["']/i.test(match[1])) continue;
  new vm.Script(match[2], {filename:'docs/index.html:inline-' + (++scripts)});
}
for (const name of ['auth-service.cjs', 'bili-state.cjs', 'music-service.cjs', 'scripts/start.cjs', 'scripts/preview.cjs', 'scripts/check.cjs']) {
  execFileSync(process.execPath, ['--check', path.join(root, name)], {stdio:'pipe'});
}
for (const resource of ['tesseract.min.js', 'worker.min.js', 'core/tesseract-core-lstm.wasm.js', 'core/tesseract-core-lstm.wasm', 'lang/eng.traineddata.gz', 'lang/chi_sim.traineddata.gz']) {
  if (!fs.statSync(path.join(root, 'docs/ocr', resource)).size) throw Error('Missing OCR resource: ' + resource);
}
for (const match of html.matchAll(/<(?:script|img)\b[^>]*\bsrc=["']([^"']+)["']/gi)) {
  if (/^(?:data:|https?:|\/\/|blob:)/.test(match[1]) || match[1].includes('${')) continue;
  if (!fs.existsSync(path.resolve(root, 'docs', match[1]))) throw Error('Missing page resource: ' + match[1]);
}
console.log(`OK: ${scripts} inline scripts, local services and bundled OCR resources.`);

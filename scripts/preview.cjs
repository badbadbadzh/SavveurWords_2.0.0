'use strict';
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const ROOT = path.resolve(__dirname, '../docs');
const types = {'.html':'text/html; charset=utf-8', '.js':'application/javascript; charset=utf-8', '.wasm':'application/wasm', '.gz':'application/gzip', '.png':'image/png', '.txt':'text/plain; charset=utf-8'};
function createPreviewServer(prefix = '/') {
  if (!/^\/(?:[A-Za-z0-9_.-]+\/)*$/.test(prefix)) throw Error('Invalid URL prefix');
  return http.createServer((req, res) => {
    if (!['GET', 'HEAD'].includes(req.method)) {res.writeHead(405); return res.end();}
    let pathname;
    try {pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);} catch {res.writeHead(400); return res.end();}
    if (!pathname.startsWith(prefix)) {res.writeHead(404); return res.end();}
    const relative = pathname.slice(prefix.length) || 'index.html';
    const file = path.resolve(ROOT, relative);
    if (relative.includes('\0') || relative.split(/[\\/]/).some(part => part.startsWith('.')) || !file.startsWith(ROOT + path.sep)) {
      res.writeHead(403); return res.end();
    }
    fs.stat(file, (error, stat) => {
      if (error || !stat.isFile()) {res.writeHead(404); return res.end();}
      res.writeHead(200, {'Content-Type':types[path.extname(file)] || 'application/octet-stream', 'Content-Length':stat.size, 'X-Content-Type-Options':'nosniff', 'Cache-Control':'no-cache'});
      if (req.method === 'HEAD') return res.end();
      const stream = fs.createReadStream(file);
      stream.on('error', () => res.destroy());
      stream.pipe(res);
    });
  });
}
if (require.main === module) {
  const prefix = process.argv.find(arg => arg.startsWith('--prefix='))?.slice(9) || '/';
  const port = Number(process.env.PORT || 4173);
  createPreviewServer(prefix).listen(port, '127.0.0.1', () => {
    console.log(`静态网页预览：http://127.0.0.1:${port}${prefix}`);
    console.log('此模式与 GitHub Pages 类似；本地账号服务和音乐搜索服务未启动。');
  }).on('error', error => {console.error(error.message); process.exitCode = 1;});
}
module.exports = {createPreviewServer};

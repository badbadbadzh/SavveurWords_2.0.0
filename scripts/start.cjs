'use strict';
// Keep both local services in this process: Ctrl+C closes only these listeners.
const {spawn} = require('node:child_process');
const servers = [];
async function listen(server, port, host) {
  servers.push(server);
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(port, host, resolve);
  });
}
function stop() {
  for (const server of servers) {
    server.close();
    server.closeAllConnections?.();
  }
}
async function main() {
  const music = require('../music-service.cjs');
  const auth = require('../auth-service.cjs');
  await listen(music.makeServer(), 8765, '127.0.0.1');
  await listen(auth.makeServer(), Number(process.env.SAVVEUR_AUTH_PORT || 8787), process.env.SAVVEUR_AUTH_HOST || '127.0.0.1');
  const url = 'http://127.0.0.1:8765/';
  console.log('拯词 2.0.0 已启动：' + url);
  console.log('保持这个窗口开启；按 Ctrl+C 关闭本次启动的服务。');
  if (process.argv.includes('--open')) {
    const command = process.platform === 'win32' ? 'explorer.exe' : process.platform === 'darwin' ? 'open' : 'xdg-open';
    const opener = spawn(command, [url], {stdio:'ignore', windowsHide:true});
    opener.on('error', () => console.log('请在浏览器打开上面的地址。'));
    opener.unref();
  }
}
process.once('SIGINT', stop);
process.once('SIGTERM', stop);
main().catch(error => {
  stop();
  if (error.code === 'EADDRINUSE') {
    console.error(`端口 ${error.port || '8765 / 8787'} 已被占用。请先关闭旧的拯词服务，或直接使用已打开的版本。`);
  } else console.error(error.message);
  process.exitCode = 1;
});

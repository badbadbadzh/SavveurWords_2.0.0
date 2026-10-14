# 拯词 · SavveurWords 2.0.0

背单词、从照片导入词表、安排复习，也可以在词汇图谱里看看词与词的联系。

这是 2.0.0 的源码发布目录。现有应用保留在 `docs/index.html`，OCR 引擎和语言数据随项目提供。日常使用不需要构建，也不需要安装 npm 依赖。

## 有哪些功能

- 词库管理与多种背词练习。
- 图片识词：JPG、PNG、WebP；英文和简体中文；识别后可编辑、去重，再确认导入。
- 单词书分栏识别，可调整英文列和中文列的范围。
- Smart Memory 复习安排与记忆状态。当前为实验性本地调度和估计值，并非官方 FSRS 实现。
- Neural Network 词汇关系图、搜索与词条详情。
- 朝日娘桌宠、背景与音频交互。
- 可选的账号同步服务，以及 B 站音乐搜索本地服务。

## 本地使用

安装 [Node.js](https://nodejs.org/) 22 或更高版本，然后在项目目录运行：

```sh
npm start
```

打开 **http://127.0.0.1:8765/**。Windows 也可以双击 `打开拯词.cmd`。保持启动窗口开启，按 `Ctrl+C` 关闭这次启动的服务。

如果旧版拯词正在运行，请先从旧版关闭入口停止它，再启动这个版本；启动器不会强制结束占用端口的其他程序。

仅预览与 GitHub Pages 相同的静态网页：

```sh
npm run preview
```

打开 **http://127.0.0.1:4173/**。请使用 HTTP/HTTPS 地址，不要直接双击 HTML；浏览器可能阻止 `file://` 下的 OCR worker 加载。

## 发布到 GitHub Pages

仓库发布后，打开 **Settings → Pages**，选择：

- Source：**Deploy from a branch**
- Branch：**main**
- Folder：**/docs**

保存并等待 GitHub 部署完成。若仓库名为 `SavveurWords_2.0.0`、账号为 `badbadbadzh`，网页地址将是：

**https://badbadbadzh.github.io/SavveurWords_2.0.0/**

这个地址只有在仓库发布并成功启用 Pages 后才能访问。免费个人账号可使用公开仓库发布 Pages。详见 [GitHub Pages 发布来源说明](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)。

### 网页和本地版本的区别

| 功能 | GitHub Pages | 本地启动 |
| --- | --- | --- |
| 背词、词库、复习与图谱 | 可用，数据保存在当前浏览器 | 可用 |
| 图片 OCR | 可用，图片在浏览器内识别 | 可用 |
| 背景与桌宠 | 可用 | 可用 |
| 账号注册、登录与跨设备同步 | 需要另行部署 HTTPS 账号服务 | 提供本机账号服务；跨设备仍需共享的服务地址 |
| B 站音乐搜索 | 需要运行配套服务；Pages 不提供此后端 | 提供本地搜索服务，结果受 B 站网络及服务状态影响 |

GitHub Pages 只托管静态文件，不会执行项目中的 Node 服务。首次使用线上页面时可以选择本地试用。浏览器按网址隔离存储，旧的 `file://` / `localhost` 数据不会自动出现在 GitHub Pages 地址下；原浏览器中的数据仍保留。

## 可选账号服务

`auth-service.cjs` 可独立运行。若要跨电脑登录，需部署到自己的 Node 主机并提供 HTTPS，配置：

```text
SAVVEUR_AUTH_HOST=0.0.0.0
SAVVEUR_AUTH_PORT=8787
SAVVEUR_AUTH_DATA=/persistent-data/auth-data.json
SAVVEUR_AUTH_ORIGINS=https://badbadbadzh.github.io
```

然后运行 `node auth-service.cjs`。首次访问网页时使用 `?auth=https://你的账号服务域名` 设置服务地址。`SAVVEUR_AUTH_ORIGINS` 填网页的来源（协议和域名），不含仓库路径。账号服务保存密码哈希、会话哈希和同步数据；这些数据文件不属于公开源码。

## 文件结构

```text
docs/                 GitHub Pages 发布目录
  index.html          现有 2.0.0 应用
  ocr/                Tesseract.js、WASM、英文与中文语言数据
  pets/               朝日娘桌宠透明图片源文件
  licenses/           第三方许可证
auth-service.cjs      可选账号服务
music-service.cjs     本地网页与 B 站搜索服务
bili-state.cjs        B 站页面数据解析
scripts/              本地启动、预览和语法检查
```

修改后可运行 `npm run check` 检查脚本语法与 OCR 文件。现有 HTML 中保留内嵌资源，方便保持版本行为一致。

## 源码与素材

项目当前未指定开源许可证，公开仓库不等于放弃代码或素材的权利。第三方软件的来源和许可见 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。

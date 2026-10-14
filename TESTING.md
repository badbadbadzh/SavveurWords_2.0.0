# GitHub 发布目录验证

验证日期：2026-10-14。运行环境：Node.js 24.16.0、Chrome 无头浏览器。

- 现有 2.0.0 HTML 原样复制到 `docs/index.html`，复制后的文件内容一致。
- `node scripts/check.cjs`：13 个内嵌脚本、服务与启动脚本语法通过，OCR 文件完整。
- 在 `/SavveurWords_2.0.0/` 子目录模拟 GitHub Pages：页面加载、Smart Memory 页、词汇图谱搜索与节点详情通过。
- 使用英文／中文测试词表图片：本地 OCR 识别出 6 条预览记录，编辑单词后确认导入，刷新仍保留。
- OCR worker 与简体中文语言数据从同一仓库子目录加载；该流程未访问外部 OCR 资源，也没有未捕获的页面异常。
- 本地 Node 服务的 `/`、`/index.html`、旧版 HTML 地址、OCR worker 和 WASM 资源均正常返回。
- 静态预览只提供 `docs`，无法从网页地址访问根目录账号服务文件或账号数据。

这些是本地测试结果。GitHub Pages 的实际发布、云端账号部署和 B 站在线搜索可用性需在相应服务配置完成后验证。

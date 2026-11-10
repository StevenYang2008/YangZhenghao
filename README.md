# 杨正昊 · 个人网站

一个根据个人简历制作的中文单页作品集，面向软件工程 / 计算机方向的专业展示。

![网站预览](preview.png)

## 特点

- 纯静态站点：HTML + CSS + 原生 JavaScript，**零依赖、无需构建**
- 响应式布局，已适配 320px – 1440px 视口
- 深色编辑感视觉，衬线中文标题、网格与噪点质感
- 滚动渐入、数字滚动、卡片微倾斜、导航高亮
- 项目区内置一个可用的计算器交互复刻，支持鼠标与键盘
- 支持 `prefers-reduced-motion`，兼顾动效敏感用户
- 包含 favicon、PWA manifest、社交分享封面与 Person 结构化数据
- 简历 PDF 可直接从站点下载

## 本地预览

直接双击 `index.html` 即可。若需要完整测试复制邮箱等浏览器 API，建议启动一个本地服务器：

```bash
# 任选其一，在项目目录执行
python -m http.server 8000
npx serve .
```

然后访问 `http://localhost:8000`。

## 文件结构

```text
个人网站/
├── index.html              # 页面结构
├── preview.png             # 预览图（README 使用）
├── site.webmanifest        # PWA 配置
├── robots.txt
|—— favicon.svg
└── assets/
    ├── css/style.css       # 全部样式与响应式规则
    ├── js/main.js          # 交互与计算器逻辑
    ├── resume.pdf          # 简历文件（下载按钮指向这里）
    ├── icon-192.png
    ├── icon-512.png
    ├── apple-touch-icon.png
    └── og-cover.png        # 社交分享封面（1200 × 630）
```

## 部署

这是一个纯静态站点，把整个目录上传即可。

**GitHub Pages**

1. 新建仓库，将本目录所有文件推送到 `main` 分支根目录
2. 仓库 `Settings → Pages`，Source 选择 `Deploy from a branch`，分支选 `main` / `root`
3. 几分钟后访问 `https://<用户名>.github.io/<仓库名>/`

**Netlify / Vercel**

将文件夹直接拖入 Netlify Drop，或在 Vercel 中导入仓库，框架选择 “Other”，无需构建命令，输出目录为根目录。

部署后建议：

- 把 `index.html` 中 `og:image` 的 `assets/og-cover.png` 改成完整网址（如 `https://your-domain.com/assets/og-cover.png`），否则部分社交平台无法抓取封面
- 按需补充 `robots.txt` 的站点地图地址
- 如果绑定自定义域名，可再加一个 `CNAME` 文件（GitHub Pages）

## 内容与自定义

- **主色**：`assets/css/style.css` 顶部的 `:root` 中修改 `--accent`（当前为朱橙色 `#ff5a2f`）与背景色
- **文案**：全部在 `index.html` 中，按区块搜索即可
- **简历**：替换 `assets/resume.pdf`，保持文件名不变即可
- **头像 / 照片**：当前使用“杨”字视觉卡片，如需真实照片，可将 `.profile-mark` 内的内容替换为 `<img>`，并同步调整样式
- **项目计算器**：位于 `#calculator`，逻辑在 `assets/js/main.js` 末尾；原项目为 C++ 桌面程序，网页版仅作交互复刻

## 已验证

- 320 / 390 / 768 / 1024 / 1440 宽度下无横向溢出
- 计算器：四则运算、开平方、百分比、正负号、错误恢复、键盘输入
- 移动端菜单开合、Esc 关闭、导航锚点与高亮
- 无控制台报错、无资源加载失败
- 减少动效模式下内容完整可见

## 说明

站点为纯前端静态页面，邮箱等信息会公开在页面源码中；如不希望被爬虫收集，可在部署后增加简单的邮箱混淆或联系表单服务。
# YangZhenghao
# YangZhenghao

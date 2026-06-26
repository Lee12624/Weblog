# 梦回廊 — Lee 的个人网站

二次元风格的静态个人网站，包含**文字**（博客）、**造物**（项目）、**关于**三个板块。

🌐 [weblog-a1q.pages.dev](https://weblog-a1q.pages.dev)

## 技术栈

- **Next.js 16** — App Router，静态导出
- **Tailwind CSS v4** — 样式
- **Markdown** — 文件驱动的内容管理（frontmatter + 自定义解析器）
- **Cloudflare Pages** — 部署

## 功能

- 📝 基于 Markdown 的博客系统（支持标签、阅读时间）
- 🛠️ 项目展示（支持技术栈、链接、GitHub）
- 🌸 樱花粒子动画 + 一言（Hitokoto）每日台词
- ⏰ 实时时钟（日式日期格式）
- 📊 页面导航进度条
- 🌙 深色主题

## 快速开始

```bash
npm install
npm run dev      # 开发 → http://localhost:3000
npm run build    # 构建 → out/
```

## 内容管理

所有内容在 `content/` 目录下，直接编辑 `.md` 文件即可。

### 写文章

在 `content/posts/` 下新建 `.md` 文件：

```md
---
title: 我的文章标题
date: 2026-06-26
excerpt: 一句话摘要
tags: [标签1, 标签2]
---

文章内容（Markdown 格式）...
```

> **文件名用英文**（会变成 URL），标题在 frontmatter 里写中文。

### 添加项目

在 `content/projects/` 下新建 `.md` 文件：

```md
---
title: 项目名称
description: 项目描述
date: 2026-06-26
tech: [Next.js, Tailwind]
link: https://example.com
github: https://github.com/xxx
---

详细介绍...
```

### 修改"关于"页面

直接编辑 `content/about.md`：

```md
---
title: 关于我
subtitle: 思いを綴る、桜の廊下で
---

在这里写自我介绍...
```

## 目录结构

```
├── content/
│   ├── about.md              # 关于页面
│   ├── posts/                # 博客文章
│   └── projects/             # 项目
├── public/images/            # 静态图片
├── src/
│   ├── app/                  # 页面路由
│   │   ├── blog/             # /blog
│   │   ├── projects/         # /projects
│   │   └── about/            # /about
│   ├── components/           # 组件
│   └── lib/                  # 工具函数
└── out/                      # 构建输出
```

## 部署

项目配置为 Cloudflare Pages 静态部署：

- **Build command:** `npm run build`
- **Build output dir:** `out`

推送即自动部署。

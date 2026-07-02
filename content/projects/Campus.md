---
title: Campus agent
description: 一个 SpringAI + RGA 的AI项目，RESTful API 设计。
date: 2025-11-20
tech: [Java, SpringAI, ToolCalling, MySQL, RAG]
github: https://github.com/Lee12624/agent-campus
---

## 项目简介

- 一个亲切可爱的 AI 校园学姐，帮助学生和老师解答校园问题。
- 支持知识库问答（RAG）、工具调用（天气/搜索/PDF 生成）、多轮对话记忆和用户认证。

### 实现的功能

- **AI 智能对话** — 基于阿里云 DashScope（通义千问 qwen3-max），支持流式 SSE 输出
- **RAG 知识库** — 加载校园文档（学生手册、校园知识等），基于向量检索增强问答
- **工具调用** — 联网搜索、网页抓取、天气查询（高德 API）、PDF 生成、文件操作
- **多轮对话** — MySQL 持久化会话记忆，支持对话历史查看与清除
- **JWT 认证** — 用户注册/登录，会话隔离
- **现代前端** — Vue 3 + TypeScript + Element Plus，响应式聊天界面

### 学到了什么

- 熟悉 Spring AI 框架的使用
- 用 RAG、ToolCalling 给AI大模型进行赋能
- 项目部署服务器流程

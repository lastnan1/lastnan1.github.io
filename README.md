# 个人研究网站

硕士研究进度看板 + 论文知识库，托管于 GitHub Pages：**https://lastnan1.github.io**

---

## 目录结构

```
personal web/
├── index.html          主页（实验进度看板）
├── knowledge.html      论文知识库主页
├── style.css           全站样式（学术编辑风）
├── main.js             主页 JS（从 experiments.json 动态渲染）
├── experiments.json    实验进度数据（唯一需要手动更新的文件）
├── papers.json         论文索引（由 build-papers.js 自动生成，勿手动修改）
├── build-papers.js     论文构建脚本
├── papers/             论文 MD 笔记 + 生成的 HTML
│   ├── 2026-06-04/
│   │   ├── 01-BRDR-平衡残差衰减率.md
│   │   ├── 01-BRDR-平衡残差衰减率.html   ← 脚本生成
│   │   └── ...
│   └── 2026-06-05/
│       └── ...
├── .gitignore
└── README.md
```

---

## 一、更新实验进度

只需编辑 `experiments.json`，推送后 GitHub Pages 自动更新。

### 字段说明

```json
{
  "profile": {
    "name": "你的姓名",
    "subtitle": "研究方向简介",
    "email": "your@email.com",
    "github": "https://github.com/lastnan1",
    "siteLastUpdated": "2026-06-05"   ← 每次发版改为今天日期
  },
  "experiments": [
    {
      "id": "pinn-acoustic",
      "title": "实验标题",
      "status": "in-progress",        ← planned / in-progress / completed / paused
      "progress": 65,                  ← 整体进度百分比 0–100
      "featured": true,                ← true = 大卡片（主实验），false = 副卡片
      "lastUpdated": "2026-06-01",     ← 本实验最近更新日期
      "summary": "一段描述",
      "highlights": ["亮点1", "亮点2"],  ← 仅 featured=true 时显示
      "milestones": [
        { "label": "里程碑名称", "status": "done" }
                                       ← done / in-progress / pending
      ],
      "tags": ["PyTorch", "PINN"],
      "links": { "github": "https://github.com/..." }
    }
  ]
}
```

### 操作步骤

```powershell
# 编辑 experiments.json 后推送
cd "D:\personal web"
git add experiments.json
git commit -m "更新实验进度 YYYY-MM-DD"
git push
```

---

## 二、新增论文笔记

### 步骤 1：写论文笔记

在 `D:\study\root\note\每日论文\YYYY-MM-DD\` 下新建 MD 文件，格式如下：

```markdown
---
tags: [AI, PINN, 论文汇报, 自适应权重]
date: 2026-06-06
paper_title: "论文英文全名"
venue: "期刊/会议名"
venue_grade: "SCI 一区"       ← CCF-A / SCI 一区 / SCI / 预印本
doi: "10.xxxx/xxxxx"          ← 可选
arxiv: "2408.xxxxx"           ← 可选
---

# 论文中文简称（Venue 年份）

## 元信息

- **作者 / 年份**：作者名, 年份
- **发表于**：...
- **链接**：https://doi.org/... | https://arxiv.org/abs/...

## 核心内容

...

## 创新点

1. ...

## 相关汇报

| 汇报 | 关联理由 |
|------|----------|
| [[日期/文件名]] | 说明 |

## 与我研究的关联

...

## 备注

...
```

### 步骤 2：复制 MD 到网站目录

```powershell
# 复制单个日期文件夹（示例）
Copy-Item -Recurse "D:\study\root\note\每日论文\2026-06-06" "D:\personal web\papers\"
```

### 步骤 3：运行构建脚本

```powershell
cd "D:\personal web"
node build-papers.js
```

脚本会自动：
- 为每篇 MD 生成同名 `.html`（包含样式、导航、wikilink 跳转）
- 刷新 `papers.json` 索引

### 步骤 4：推送到 GitHub

```powershell
git add .
git commit -m "新增论文笔记 2026-06-06"
git push
```

---

## 三、本地预览

> 必须通过 HTTP 服务器访问，直接双击 `index.html` 会因 `fetch` 跨域失败导致数据不加载。

```powershell
cd "D:\personal web"
npx serve .
# 浏览器打开 http://localhost:3000
```

---

## 四、发布到 GitHub Pages

仓库已配置 GitHub Pages（`main` 分支根目录），直接 `git push` 即生效，等待约 1 分钟后在 https://lastnan1.github.io 查看。

若页面无变化，强制刷新：`Ctrl + Shift + R`

---

## 五、常用命令速查

| 操作 | 命令 |
|------|------|
| 本地预览 | `npx serve .` |
| 构建论文 HTML | `node build-papers.js` |
| 推送所有变更 | `git add . && git commit -m "描述" && git push` |
| 仅推送实验进度 | `git add experiments.json && git commit -m "更新进度" && git push` |
| 查看状态 | `git status` |

---

## 六、注意事项

- `papers.json` 和 `papers/**/*.html` 均由脚本自动生成，**不要手动修改**
- `siteLastUpdated` 字段每次发版时手动改为当天日期，老师在页面顶部能直接看到
- 中国大陆访问 Google Fonts 可能较慢，字体已配置降级到微软雅黑等本地字体
- `.agents/` 和 `skills-lock.json` 已在 `.gitignore` 中忽略，无需关注

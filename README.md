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
├── build-experiment-results.js  实验结果构建脚本
├── experiment-results.config.json  实验结果源目录配置（手动维护）
├── experiment-results/  实验结果页 + 图片（脚本生成，勿手改 HTML）
│   ├── manifest.json   ← 主页据此显示「实验结果」链接
│   └── pinn-acoustic/
│       ├── results.html
│       ├── wavefield_comparison.png
│       ├── loss_curves.png
│       └── comparison_table.md
├── papers/             论文 MD 笔记 + PDF + 生成的 HTML
│   ├── 2026-06-04/
│   │   ├── 01-BRDR-平衡残差衰减率.md
│   │   ├── 01-BRDR-平衡残差衰减率.html   ← 脚本生成
│   │   ├── 2407.01613.pdf                ← 有 arXiv 时由脚本自动复制
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

## 本地 PDF

![[2407.01613.pdf]]

- arXiv：https://arxiv.org/abs/2407.01613
```

无 arXiv 的期刊论文写：

```markdown
## 本地 PDF

> 暂无本地 PDF（本篇无 arXiv 预印本，仅期刊/会议发表）。

- DOI：https://doi.org/10.xxxx/xxxxx
```

### 步骤 2：同步笔记到网站目录

```powershell
# 复制单个日期文件夹（先删旧目录，避免嵌套重复）
$date = "2026-06-06"
Remove-Item -Recurse -Force "D:\personal web\papers\$date" -ErrorAction SilentlyContinue
Copy-Item -Recurse "D:\study\root\note\每日论文\$date" "D:\personal web\papers\"
```

可选：在笔记目录先下载 PDF，构建脚本会自动同步：

```powershell
powershell -ExecutionPolicy Bypass -File "D:\study\root\note\每日论文\_arxiv-papers\download_all.ps1"
```

### 步骤 3：运行构建脚本

```powershell
cd "D:\personal web"
node build-papers.js
```

脚本会自动：
- 从笔记目录复制 PDF 到 `papers/YYYY-MM-DD/`（若本地已有则跳过）
- 为每篇 MD 生成同名 `.html`（含 PDF/DOI 主按钮、wikilink 跳转）
- 刷新 `papers.json` 索引（含 `readLink` 字段）

### PDF / DOI 链接规则

每篇论文有一个主阅读按钮，优先级如下：

| 优先级 | 条件 | 按钮 |
|--------|------|------|
| 1 | 同目录有 `{arxiv_id}.pdf` | **PDF ↗**（本地文件） |
| 2 | frontmatter 有 `arxiv:` 但无本地 PDF | **PDF ↗**（arXiv 在线 PDF） |
| 3 | 仅有 `doi:` | **DOI ↗**（期刊页面） |

知识库卡片和单篇论文页顶部均显示该按钮；正文 `![[xxx.pdf]]` 也会转为可点击链接。

### 步骤 4：推送到 GitHub

```powershell
git add .
git commit -m "新增论文笔记 2026-06-06"
git push
```

---

## 三、同步实验结果

将本地实验项目**指定结果文件夹**同步到网站，生成独立结果页；有结果的实验卡片会自动出现「实验结果 ↗」链接。

一个项目下常有多个结果目录（如 `outputs`、`outputs_quick`、`outputs_full`），通过 `outputDir` 指定要展示哪一个。

### 配置

编辑 [`experiment-results.config.json`](experiment-results.config.json)，`id` 需与 `experiments.json` 中一致：

```json
{
  "_defaults": {
    "projectRoot": "D:/study/Project/project"
  },
  "pinn-acoustic": {
    "outputDir": "outputs_full",
    "title": "PINN 声波正演对比研究",
    "images": [
      { "file": "wavefield_comparison.png", "caption": "六种方案波场对比" },
      { "file": "loss_curves.png", "caption": "训练损失曲线" }
    ],
    "table": "comparison_table.md"
  }
}
```

| 字段 | 说明 |
|------|------|
| `_defaults.projectRoot` | 实验代码项目根目录，多个实验可共用 |
| `outputDir` | **要同步的结果子文件夹名**（相对 `projectRoot`），如 `outputs_full` / `outputs_quick` |
| `projectRoot` | 可选，覆盖 `_defaults`（不同实验来自不同项目时） |
| `outputLabel` | 可选，结果页显示名；默认用 `outputDir` |
| `sourceDir` | 可选，直接写完整路径（兼容旧配置，与 `outputDir` 二选一） |

切换展示文件夹时，只需改 `outputDir` 后重新运行 `node build-experiment-results.js`：

```json
"outputDir": "outputs_quick"
```

### 操作步骤

```powershell
# 1. 从云端下载最新 outputs（若本地尚无 PNG）
python D:\study\Project\project\scripts\download_jupyter_outputs.py

# 2. 构建结果页
cd "D:\personal web"
node build-experiment-results.js

# 3. 推送
git add experiment-results/ experiment-results.config.json build-experiment-results.js
git commit -m "更新 PINN 实验结果"
git push
```

脚本会复制图片与对比表、生成 `experiment-results/{id}/results.html` 和 `manifest.json`。缺失 PNG 时仍会生成页面（含对比表 + 图片占位提示）。

---

## 四、本地预览

> 必须通过 HTTP 服务器访问，直接双击 `index.html` 会因 `fetch` 跨域失败导致数据不加载。

```powershell
cd "D:\personal web"
npx serve .
# 浏览器打开 http://localhost:3000
```

---

## 五、发布到 GitHub Pages

仓库已配置 GitHub Pages（`main` 分支根目录），直接 `git push` 即生效，等待约 1 分钟后在 https://lastnan1.github.io 查看。

若页面无变化，强制刷新：`Ctrl + Shift + R`

---

## 六、常用命令速查

| 操作 | 命令 |
|------|------|
| 本地预览 | `npx serve .` |
| 构建论文 HTML | `node build-papers.js` |
| 构建实验结果页 | `node build-experiment-results.js` |
| 推送所有变更 | `git add . && git commit -m "描述" && git push` |
| 仅推送实验进度 | `git add experiments.json && git commit -m "更新进度" && git push` |
| 查看状态 | `git status` |

---

## 七、注意事项

- `papers.json` 和 `papers/**/*.html` 均由脚本自动生成，**不要手动修改**
- `experiment-results/manifest.json` 和 `experiment-results/**/results.html` 由 `build-experiment-results.js` 生成，**不要手动修改**
- `papers/**/*.pdf` 由构建脚本从笔记目录复制，会进入 Git 仓库（单篇约 1–5 MB）
- 复制日期文件夹时务必先 `Remove-Item` 旧目录，避免出现 `papers/2026-06-04/2026-06-04/` 嵌套重复
- `siteLastUpdated` 字段每次发版时手动改为当天日期，老师在页面顶部能直接看到
- 中国大陆访问 Google Fonts 可能较慢，字体已配置降级到微软雅黑等本地字体
- `.agents/` 和 `skills-lock.json` 已在 `.gitignore` 中忽略，无需关注

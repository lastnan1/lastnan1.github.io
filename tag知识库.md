# 通用本地 Tag 知识库搭建指南

## 1. 什么是本地 Tag 知识库

本地 Tag 知识库是一套把本地资料整理成可浏览、可维护、可被 Agent 检索使用的轻量系统。它不要求一开始就接入复杂数据库或向量检索，核心是先建立稳定的资料目录、受控 tag 词表、结构化 `index.json`，再用本地前端工具维护这些索引。

它适合以下场景：

- 竞品分析库。
- 设计参考库。
- 技术方案库。
- 美术风格参考库。
- 音效参考库。
- 项目复盘库。
- 内部文档资料库。
- 游戏调研报告库。

核心原则：

```text
原始文档保存事实和证据，index.json 保存可解释的检索入口，本地 browser 负责浏览和维护，Agent 读取原文后再推理。
```

这个系统的目标不是把所有正文塞进一个大 JSON，也不是让 Agent 只读标签就下结论。正确用法是：先用 tag 和 index 找到候选资料，再读取原始文档，最后基于证据回答问题或生成方案。

## 2. 从零搭建目录结构

推荐从一个独立目录开始，例如：

```text
knowledge_base/
  records.json
  index.json
  _index_backups/
  items/
    001-example-document/
      overview.md
      detail.md
      sources.md
  browser/
    server.js
    index.html
    main.js
    styles.css
```

目录职责：

| 路径 | 职责 |
|---|---|
| `records.json` | 保存来自外部来源或人工录入的事实字段，例如标题、作者、来源链接、创建时间 |
| `index.json` | 保存检索字段、受控 tag、条目到文档目录的映射 |
| `_index_backups/` | 每次写回 `index.json` 前自动备份 |
| `items/` | 保存每个知识条目的原始正文文件 |
| `browser/` | 保存本地浏览和维护工具 |

如果知识库规模很小，可以先只保留：

```text
knowledge_base/
  index.json
  items/
```

但一旦需要多人维护、Agent 使用或持续新增资料，就应尽早补齐 `records.json`、备份目录和本地 browser。

## 3. 原始文档、事实记录、index 的职责边界

### 3.1 原始文档

原始文档是知识库的证据层。它保存正文、来源、截图说明、引用、人工分析等内容。

示例：

```text
items/001-example-document/
  overview.md
  detail.md
  sources.md
```

原则：

- 原始文档要能独立阅读。
- 原始文档不应因为 tag 调整而被改写。
- Agent 输出结论前必须读取相关原始文档，不能只读 `index.json`。
- 如果文档里有外部事实，应在正文或 `sources.md` 中保留来源。

### 3.2 事实记录

`records.json` 用来保存稳定事实字段。它不是必须存在，但推荐在知识库会长期增长时使用。

示例：

```json
[
  {
    "id": "001-example-document",
    "title": "Example Document",
    "author": "Unknown",
    "source_url": "https://example.com",
    "created_at": "2026-01-01",
    "source_path": "items/001-example-document"
  }
]
```

事实字段和人工检索字段要分开。标题、作者、来源、时间属于事实；`best_for`、`tags`、`annotation_notes` 属于人工检索标注。

### 3.3 Index

`index.json` 是知识库的第一检索入口。它回答的问题是：

- 哪些文档可能和当前问题相关？
- 这些文档适合哪些使用场景？
- 它们拥有哪些可复用 tag？
- 读取它们时应该关注什么？

`index.json` 不应该保存大段正文，也不应该保存 Agent 的一次性推理结论。它保存的是长期可复用的检索信息。

## 4. `index.json` 推荐 schema

推荐结构：

```json
{
  "version": 1,
  "source": "records.json",
  "field_sources": {
    "id": "records.json id or stable directory name",
    "title": "records.json title",
    "source_path": "items directory path",
    "best_for": "manual annotation selected from vocabulary.best_for_pool",
    "tags": "manual annotation selected from vocabulary.tag_taxonomy",
    "categories": "manual annotation selected from vocabulary.category_taxonomy",
    "annotation_notes": "manual note explaining retrieval value"
  },
  "vocabulary": {
    "policy": "Reuse existing tags first. Add new tags only when they express a reusable retrieval need. Every new tag must be back-checked against existing items.",
    "best_for_pool": [
      "onboarding",
      "scope control",
      "risk analysis"
    ],
    "tag_taxonomy": {
      "domain": [
        "design",
        "engineering",
        "art",
        "audio"
      ],
      "method": [
        "case study",
        "checklist",
        "postmortem"
      ],
      "theme": [
        "workflow",
        "production",
        "quality"
      ]
    },
    "category_taxonomy": {
      "format": [
        "reference",
        "guide",
        "decision record"
      ]
    },
    "backfill_audit_notes": []
  },
  "items": [
    {
      "id": "001-example-document",
      "title": "Example Document",
      "aliases": [],
      "source_path": "items/001-example-document",
      "primary_files": [
        "overview.md",
        "detail.md",
        "sources.md"
      ],
      "facts": {
        "author": "Unknown",
        "source_url": "https://example.com",
        "created_at": "2026-01-01"
      },
      "best_for": [
        "scope control"
      ],
      "tags": {
        "domain": [
          "design"
        ],
        "method": [
          "case study"
        ]
      },
      "categories": [
        "reference"
      ],
      "annotation_status": "reviewed",
      "annotation_notes": "Use when comparing lightweight planning workflows and scope boundaries."
    }
  ]
}
```

字段说明：

| 字段 | 作用 |
|---|---|
| `version` | index schema 版本 |
| `source` | 事实记录来源，可指向 `records.json` |
| `field_sources` | 说明每类字段来自哪里，避免事实和人工标注混淆 |
| `vocabulary` | 受控 tag 池和维护规则 |
| `items` | 知识条目列表 |
| `best_for` | 文档最适合支持的检索意图 |
| `tags` | 分组 tag，用于组合筛选 |
| `categories` | 更高层级的分类 |
| `annotation_notes` | 解释这个文档为什么值得在某类问题中被读取 |

如果某个领域确实需要专用字段，可以在 `facts` 内扩展，不要破坏 `items`、`vocabulary`、`source_path` 这些通用入口。

## 5. 每新增一个文档时的 index 更新流程

每添加一个新文档，都必须同步更新 `index.json`。不要等很多文档积累后再集中补 index；那会导致 tag 池失控、旧文档漏标、Agent 检索入口不可解释。

新增文档必须执行以下流程：

1. 建立稳定目录和 ID。
   - 在 `items/` 下创建文档目录。
   - 确定稳定 `id`，后续不要随意改。
   - 写入 `title`、`source_path`、`primary_files`。

2. 补齐事实字段。
   - 如果使用 `records.json`，先把标题、作者、来源、时间等事实写入 `records.json`。
   - 在 `index.json` 的 `facts` 中同步必要事实。
   - 不确定的事实用 `null` 或注明待确认，不要把推测写成事实。

3. 阅读文档摘要或正文。
   - 至少阅读 `overview.md` 或等价摘要文件。
   - 如果摘要不足以判断 tag，要阅读相关正文段落。
   - 标注前先明确：这个文档未来会帮助别人解决什么检索问题？

4. 检查已有 tag 池。
   - 先查看 `vocabulary.best_for_pool`。
   - 再查看 `vocabulary.tag_taxonomy` 的各个 group。
   - 最后查看 `vocabulary.category_taxonomy`。
   - 优先复用已有 tag，不要因为措辞不同就新增同义 tag。

5. 给新文档选择已有 tag。
   - `best_for` 选择 1 到 5 个最重要的使用意图。
   - `tags.<group>` 选择可组合检索的领域、方法、主题、对象等。
   - `categories` 选择少量高层分类。
   - `annotation_notes` 写清楚为什么这个文档适合这些 tag。

6. 判断是否需要新增 tag。
   - 只有当现有 tag 无法表达重要、可复用的检索意图时，才新增 tag。
   - 新 tag 必须能被未来多个文档复用。
   - 单个文档的特殊细节写进 `annotation_notes`，不要创建过细 tag。

7. 新增 tag 后回测旧文档。
   - 搜索或浏览已有 `items`，找出之前哪些文档也适合这个新 tag。
   - 对适合的旧文档同步补标。
   - 如果没有旧文档适合，在 `vocabulary.backfill_audit_notes` 记录原因。

8. 保存前校验。
   - 新文档引用的所有 tag 必须存在于 `vocabulary`。
   - 新增 tag 必须至少存在于对应 tag 池。
   - `source_path` 必须指向存在的文档目录。
   - `primary_files` 必须指向存在的正文文件。
   - `id` 必须唯一。

9. 写回并备份。
   - 写回 `index.json` 前先备份到 `_index_backups/`。
   - 失败时保留旧版本。
   - 写回后重新读取 JSON，确认能正常解析。

明确禁止：

- 只新增文档正文，不更新 `index.json`。
- 新增 tag 但不回测旧文档。
- 为单个文档创建过细 tag。
- 用同义词重复扩充 tag 池。
- 把临时搜索词写进长期 vocabulary。
- 把 Agent 一次性结论写成文档事实。

## 6. Vocabulary / tag 池设计与维护规则

### 6.1 Tag 粒度

tag 要服务于长期检索，而不是复述文档标题。

合适的 tag：

```text
scope control
risk analysis
case study
production
workflow
engineering
```

不合适的 tag：

```text
very good document
interesting idea
the exact feature from document 001
design stuff
misc
```

推荐粒度：

- 比具体文档更抽象。
- 比大而空的领域词更具体。
- 能被多个文档复用。
- 用户或 Agent 看到后能理解检索意图。

### 6.2 Tag 分组

推荐分组：

| group | 用途 |
|---|---|
| `domain` | 文档所属领域，例如 design、engineering、art |
| `method` | 文档类型或方法，例如 checklist、case study、postmortem |
| `theme` | 主题，例如 workflow、quality、production |
| `audience` | 适合谁读，例如 producer、designer、engineer |
| `risk` | 涉及的风险，例如 scope creep、performance、maintenance |

不是每个知识库都需要所有分组。分组越少，维护越容易；分组越多，检索越精细。初版建议从 3 到 5 个分组开始。

### 6.3 Tag 生命周期

新增 tag：

- 必须说明检索用途。
- 必须回测旧文档。
- 必须写入 vocabulary。

重命名 tag：

- 必须同步更新所有 `items` 中的引用。
- 必须避免造成同义词并存。

删除 tag：

- 必须从所有 `items` 中移除引用。
- 如果是合并到另一个 tag，应先迁移再删除。

废弃 tag：

- 如果担心删除会影响历史记录，可以先在维护记录中标记 deprecated。
- 新文档不再使用废弃 tag。

## 7. 本地 Browser 应具备的功能

本地 browser 是给人和 Agent 维护知识库的工具。它不必复杂，但要覆盖最关键的维护动作。

### 7.1 浏览和筛选

基础能力：

- 展示所有 `best_for`，并显示每个 tag 的文档数量。
- 按 `tags.<group>` 展示分组 tag。
- 展示 `categories`。
- 支持搜索 tag。
- 支持搜索文档标题、ID、路径、注释。
- 支持多个 tag 组合筛选，默认使用交集。

### 7.2 文档详情

基础能力：

- 显示文档标题、ID、路径、事实字段。
- 显示完整 tag 树。
- 显示 `annotation_notes`。
- 提供打开原始正文的入口。
- 显示当前文档的索引状态，例如 draft、reviewed、needs_backfill。

### 7.3 Index 维护

基础能力：

- 给单个文档添加或移除 tag。
- 编辑 `annotation_notes`。
- 新增、重命名、删除 vocabulary tag。
- 按 tag 批量添加或移除文档。
- 新增 tag 时提示回测旧文档。
- 保存前显示影响范围。
- 保存前自动备份。

### 7.4 原文阅读

基础能力：

- 根据 `source_path` 读取文档目录。
- 按 `primary_files` 顺序展示 Markdown。
- 解析标题目录。
- 显示当前文件路径。
- 支持从筛选结果跳转到阅读页。

文件顺序应该由 `index.json` 或 browser 配置决定，而不是写死在代码里。

## 8. API 与数据流

本地 browser 可以用一个轻量 HTTP 服务实现。推荐 API 如下。

### 8.1 `GET /api/index`

返回完整 `index.json` 和派生出的 tag 到文档反向索引。

返回示例：

```json
{
  "index": {},
  "tagToItems": []
}
```

### 8.2 `GET /api/item?id=<item_id>`

返回单个文档的元数据和可读正文文件。

返回示例：

```json
{
  "item": {},
  "files": [
    {
      "name": "overview.md",
      "content": "# Overview"
    }
  ]
}
```

### 8.3 `POST /api/item-tags`

保存单个文档的 tag、分类、注释和状态。

请求示例：

```json
{
  "id": "001-example-document",
  "best_for": [
    "scope control"
  ],
  "tags": {
    "domain": [
      "design"
    ]
  },
  "categories": [
    "reference"
  ],
  "annotation_notes": "Use for scope-boundary discussions.",
  "annotation_status": "reviewed"
}
```

### 8.4 `POST /api/tag-membership`

按 tag 批量增删文档。

请求示例：

```json
{
  "action": "add",
  "scope": "tags",
  "group": "theme",
  "tag": "workflow",
  "ids": [
    "001-example-document",
    "002-another-document"
  ]
}
```

### 8.5 `POST /api/vocabulary`

维护 tag 池。

请求示例：

```json
{
  "action": "create",
  "scope": "tags",
  "group": "theme",
  "tag": "workflow"
}
```

支持动作：

```text
create
rename
delete
```

任何会写回 `index.json` 的 API 都必须：

- 先校验请求。
- 先备份当前 index。
- 写入临时文件。
- 重新解析临时文件。
- 成功后替换主文件。
- 返回备份路径和最新反向索引。

## 9. Agent 如何使用这个知识库

Agent 使用知识库时，要遵守三层判断：

```text
index 负责找候选，原文负责提供证据，Agent 负责推理。
```

推荐流程：

1. 理解用户问题。
2. 把问题拆成可检索意图。
3. 先读取 `vocabulary`，选择已有 tag。
4. 用 `index.json` 找候选文档。
5. 选择少量最相关文档。
6. 读取这些文档的原文。
7. 区分原文事实、人工解释和自己的推断。
8. 输出答案时说明使用了哪些文档。
9. 如果产生长期有用的结论，再写入项目文档或新知识条目。

Agent 禁止：

- 只读 `index.json` 就给出结论。
- 把 `annotation_notes` 当成最终证据。
- 没读原文却声称某文档支持某观点。
- 遇到没有合适 tag 的问题时随意发明 tag。
- 绕过新增文档流程直接批量生成 index。

推荐 Agent 提示词要点：

```text
你可以使用 index.json 找候选文档，但最终回答必须基于原始文档。
新增文档时必须同步更新 index。
新增 tag 前必须检查已有 tag 池。
新增 tag 后必须回测旧文档并补标或记录原因。
```

## 10. 校验、备份、验收清单

### 10.1 保存前校验

每次保存 `index.json` 前至少检查：

- JSON 可以解析。
- `items` 是数组。
- 每个 `id` 唯一。
- 每个 `source_path` 存在。
- 每个 `primary_files` 文件存在。
- 每个文档引用的 `best_for` 都存在于 `vocabulary.best_for_pool`。
- 每个文档引用的 `tags.<group>` 都存在于 `vocabulary.tag_taxonomy.<group>`。
- 每个文档引用的 `categories` 都存在于 `vocabulary.category_taxonomy` 的某个分组。
- 删除 tag 时没有留下悬空引用。
- 重命名 tag 时所有旧引用都已迁移。

### 10.2 备份策略

每次写回前备份：

```text
knowledge_base/_index_backups/index.<timestamp>.json
```

写回策略：

- 不直接覆盖主文件。
- 先写临时文件。
- 解析临时文件成功后再替换。
- 失败时保留旧主文件。
- 备份文件不要自动覆盖。

### 10.3 最小验收清单

一个可交付的本地 Tag 知识库至少满足：

- 有稳定的 `knowledge_base/` 目录。
- 有 `index.json`。
- 有 `vocabulary`。
- 有 `items` 条目列表。
- 每个条目有稳定 `id` 和 `source_path`。
- 每个条目能打开原始正文。
- 每个 tag 引用都能在 vocabulary 中找到。
- 每次新增文档都同步更新 index。
- 每次新增 tag 都完成旧文档回测。
- 每次保存 index 前自动备份。
- Browser 能浏览 tag、筛选文档、编辑 tag、打开原文。
- Agent 使用时先用 index 找候选，再读原文给结论。

### 10.4 扩展路线

第一阶段先完成：

- 本地目录。
- `index.json`。
- 受控 vocabulary。
- 简单 browser。
- 保存校验和备份。

第二阶段再增加：

- 章节级索引。
- 全文搜索。
- SQLite FTS 或 BM25。
- 文档阅读页中的章节定位。

第三阶段再考虑：

- embedding。
- hybrid retrieval。
- rerank。
- 多知识库配置。
- Agent 自动维护辅助。

不要在第一阶段就用复杂检索替代 tag index。受控 tag 的价值在于稳定、可解释、可维护；全文检索和向量检索应该作为证据召回补充，而不是替代入口。

## 11. 总结

本地 Tag 知识库的关键不是前端页面本身，而是建立一套持续维护的知识入口：

```text
每个文档入库时就更新 index；每个新 tag 都回测旧文档；每个结论都回到原文证据。
```

只要守住这三点，这套系统就可以从一个很小的本地目录逐步成长为可供人和 Agent 一起使用的知识库。

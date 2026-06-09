---
tags:
  - AI
  - PINN
  - 论文汇报
  - 阅读路径
date: 2026-06-09
paper_title: "Adam: A Method for Stochastic Optimization"
venue: "ICLR"
venue_grade: "经典/奠基"
arxiv: "1412.6980"
reading_path_order: 10
reading_path_phase: "阶段2-深度学习里程碑"
---

# Adam: A Method for Stochastic Optimization

## 方法图示

```mermaid
flowchart TD
    Image[输入图像] --> Conv[CNN卷积层]
    Conv --> Pool[池化_BN_Dropout]
    Pool --> FC[全连接]
    FC --> Output[分类输出]
```

## 元信息

- **作者 / 年份**：Kingma & Ba / 2014
- **发表于**：ICLR
- **阅读路径序号**：10（阶段2-深度学习里程碑）
- **链接**：https://arxiv.org/abs/1412.6980

## 核心内容

PINN 常用优化器

## 创新点

1. **阅读定位**：PINN 常用优化器
2. **阶段**：阶段2-深度学习里程碑 系统阅读清单第 10 篇。
3. 详见原文；本篇为阅读路径导读归档。

## 相关汇报

| 汇报 | 关联理由 |
|------|----------|
| [[2026-06-06/04-MultiAdam-尺度不变优化器]] | 同一论文或同主题已有深度日报 |

## 与我研究的关联

作为 PINN 声波正演与损失自适应权重研究的**背景阅读**；阶段 4–5 与当前实验（A–F 方案、λ 平衡）直接相关。

## 备注

- 汇报批次：2026-06-09 阅读路径批量导入
- 源笔记：[[AI/PINN/阅读路径/阶段2-深度学习里程碑/10-Adam]]

## 本地 PDF

![[1412.6980.pdf]]

- arXiv：https://arxiv.org/abs/1412.6980
- 文件：`每日论文/2026-06-09/1412.6980.pdf`

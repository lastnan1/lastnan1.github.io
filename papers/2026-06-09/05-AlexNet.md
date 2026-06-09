---
tags:
  - AI
  - PINN
  - 论文汇报
  - 阅读路径
date: 2026-06-09
paper_title: "ImageNet Classification with Deep Convolutional Neural Networks (AlexNet)"
venue: "NeurIPS"
venue_grade: "经典"
reading_path_order: 5
reading_path_phase: "阶段2-深度学习里程碑"
---

# ImageNet Classification with Deep Convolutional Neural Ne...

## 方法图示

```mermaid
flowchart TD
    Image[输入图像] --> Conv[CNN卷积层]
    Conv --> Pool[池化_BN_Dropout]
    Pool --> FC[全连接]
    FC --> Output[分类输出]
```

## 元信息

- **作者 / 年份**：Krizhevsky, Sutskever & Hinton / 2012
- **发表于**：NeurIPS
- **阅读路径序号**：5（阶段2-深度学习里程碑）
- **链接**：https://papers.nips.cc/paper/4824-imagenet-classification-with-deep-convolutional-neural-networks

## 核心内容

深度学习复兴起点

## 创新点

1. **阅读定位**：深度学习复兴起点
2. **阶段**：阶段2-深度学习里程碑 系统阅读清单第 5 篇。
3. 详见原文；本篇为阅读路径导读归档。

## 相关汇报

| 汇报 | 关联理由 |
|------|----------|
| [[AI/PINN/阅读路径/_index]] | 系统阅读路径总索引 |

## 与我研究的关联

作为 PINN 声波正演与损失自适应权重研究的**背景阅读**；阶段 4–5 与当前实验（A–F 方案、λ 平衡）直接相关。

## 备注

- 汇报批次：2026-06-09 阅读路径批量导入
- 源笔记：[[AI/PINN/阅读路径/阶段2-深度学习里程碑/05-AlexNet]]

## 本地 PDF

> 暂无本地 PDF。
- 在线：https://papers.nips.cc/paper/4824-imagenet-classification-with-deep-convolutional-neural-networks

---
tags:
  - AI
  - PINN
  - 论文汇报
  - 阅读路径
date: 2026-06-09
paper_title: "Gradient-based learning applied to document recognition"
venue: "Proc. IEEE"
venue_grade: "经典/奠基"
doi: "10.1109/5.726791"
reading_path_order: 3
reading_path_phase: "阶段1-深度学习基础"
---

# Gradient-based learning applied to document recognition

## 方法图示

```mermaid
flowchart LR
    Input[输入_x] --> Net[前馈网络]
    Net --> Loss[损失_L]
    Loss --> Backprop[反向传播]
    Backprop --> Update[更新权重_W]
```

## 元信息

- **作者 / 年份**：LeCun et al. / 1998
- **发表于**：Proc. IEEE
- **阅读路径序号**：3（阶段1-深度学习基础）
- **链接**：http://yann.lecun.com/exdb/publis/pdf/lecun-98.pdf

## 核心内容

CNN + 梯度学习经典，LeNet-5

## 创新点

1. **阅读定位**：CNN + 梯度学习经典，LeNet-5
2. **阶段**：阶段1-深度学习基础 系统阅读清单第 3 篇。
3. 详见原文；本篇为阅读路径导读归档。

## 相关汇报

| 汇报 | 关联理由 |
|------|----------|
| [[AI/PINN/阅读路径/_index]] | 系统阅读路径总索引 |

## 与我研究的关联

作为 PINN 声波正演与损失自适应权重研究的**背景阅读**；阶段 4–5 与当前实验（A–F 方案、λ 平衡）直接相关。

## 备注

- 汇报批次：2026-06-09 阅读路径批量导入
- 源笔记：[[AI/PINN/阅读路径/阶段1-深度学习基础/03-LeNet5]]

## 本地 PDF

> 暂无 arXiv 预印本；使用 DOI 或已下载非 arXiv PDF。

- DOI：https://doi.org/10.1109/5.726791
- 本地副本：`每日论文/2026-06-09/lecun-98-lenet5.pdf`

---
tags:
  - AI
  - PINN
  - 论文汇报
  - 阅读路径
date: 2026-06-09
paper_title: "A Deep Learning Approach to Solving Partial Differential Equations"
venue: "JCP"
venue_grade: "SCI一区"
doi: "10.1016/j.jcp.2018.08.029"
arxiv: "1708.07469"
reading_path_order: 12
reading_path_phase: "阶段3-科学计算与神经PDE"
---

# A Deep Learning Approach to Solving Partial Differential ...

## 方法图示

```mermaid
flowchart TD
    Collocation[配点采样] --> NN[神经网络_u_theta]
    NN --> PDEres[PDE残差]
    PDEres --> Loss[物理损失]
    Loss --> Optim[梯度下降]
```

## 元信息

- **作者 / 年份**：Sirignano & Spiliopoulos / 2018
- **发表于**：JCP
- **阅读路径序号**：12（阶段3-科学计算与神经PDE）
- **链接**：https://arxiv.org/abs/1708.07469

## 核心内容

用 DNN 解 PDE，PINN 前身之一

## 创新点

1. **阅读定位**：用 DNN 解 PDE，PINN 前身之一
2. **阶段**：阶段3-科学计算与神经PDE 系统阅读清单第 12 篇。
3. 详见原文；本篇为阅读路径导读归档。

## 相关汇报

| 汇报 | 关联理由 |
|------|----------|
| [[AI/PINN/阅读路径/_index]] | 系统阅读路径总索引 |

## 与我研究的关联

作为 PINN 声波正演与损失自适应权重研究的**背景阅读**；阶段 4–5 与当前实验（A–F 方案、λ 平衡）直接相关。

## 备注

- 汇报批次：2026-06-09 阅读路径批量导入
- 源笔记：[[AI/PINN/阅读路径/阶段3-科学计算与神经PDE/12-DNN解PDE]]

## 本地 PDF

![[1708.07469.pdf]]

- arXiv：https://arxiv.org/abs/1708.07469
- 文件：`每日论文/2026-06-09/1708.07469.pdf`

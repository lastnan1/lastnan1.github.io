---
tags:
  - AI
  - PINN
  - 论文汇报
  - 阅读路径
date: 2026-06-09
paper_title: "B-PINNs: Bayesian Physics-Informed Neural Networks for Forward and Inverse PDE Problems with Noisy Data"
venue: "JCP"
venue_grade: "SCI一区"
doi: "10.1016/j.jcp.2020.109913"
arxiv: "2003.06097"
reading_path_order: 18
reading_path_phase: "阶段4-PINN核心与经典"
---

# B-PINNs: Bayesian Physics-Informed Neural Networks for Fo...

## 方法图示

```mermaid
flowchart TD
    Domain[计算域] --> PINN[PINN网络]
    PINN --> Lpde[L_PDE]
    PINN --> Lbc[L_BC_IC]
    Lpde --> Total[总损失]
    Lbc --> Total
    Total --> Adam[Adam优化]
```

## 元信息

- **作者 / 年份**：Yang, Meng & Karniadakis / 2021
- **发表于**：JCP
- **阅读路径序号**：18（阶段4-PINN核心与经典）
- **链接**：https://arxiv.org/abs/2003.06097

## 核心内容

不确定性量化

## 创新点

1. **阅读定位**：不确定性量化
2. **阶段**：阶段4-PINN核心与经典 系统阅读清单第 18 篇。
3. 详见原文；本篇为阅读路径导读归档。

## 相关汇报

| 汇报 | 关联理由 |
|------|----------|
| [[AI/PINN/阅读路径/_index]] | 系统阅读路径总索引 |

## 与我研究的关联

作为 PINN 声波正演与损失自适应权重研究的**背景阅读**；阶段 4–5 与当前实验（A–F 方案、λ 平衡）直接相关。

## 备注

- 汇报批次：2026-06-09 阅读路径批量导入
- 源笔记：[[AI/PINN/阅读路径/阶段4-PINN核心与经典/18-B-PINN]]

## 本地 PDF

![[2003.06097.pdf]]

- arXiv：https://arxiv.org/abs/2003.06097
- 文件：`每日论文/2026-06-09/2003.06097.pdf`

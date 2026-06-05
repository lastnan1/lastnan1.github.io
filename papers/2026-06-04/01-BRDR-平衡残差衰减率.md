---
tags:
  - AI
  - PINN
  - 论文汇报
  - 自适应权重
date: 2026-06-04
paper_title: "Self-adaptive weights based on balanced residual decay rate for physics-informed neural networks and deep operator networks"
venue: "Journal of Computational Physics"
venue_grade: "SCI 一区"
doi: "10.1016/j.jcp.2025.114226"
arxiv: "2407.01613"
---

# Self-adaptive weights based on balanced residual decay rate (BRDR)

## 元信息

- **作者 / 年份**：Wenqian Chen, Amanda A. Howard, Panos Stinis 等, 2025
- **发表于**：Journal of Computational Physics（等级：SCI 一区）
- **链接**：https://doi.org/10.1016/j.jcp.2025.114226 | https://arxiv.org/abs/2407.01613
- **引用数**：待查（新发表）

## 核心内容

指出 plain PINN 失败主因是各配点残差收敛速度相差数个量级，最慢者主导全局收敛；提出 BRDR（Balanced Residual Decay Rate）点级自适应权重，使各点残差衰减率趋于平衡，并推广至 PIDeepONet 与小批量训练。

## 创新点

1. 用「逆残差衰减率」刻画配点级收敛速度，从机理上解释多目标损失不平衡，而非仅调全局 λ。
2. 点级权重有界（平均为 1），计算开销低，相对 NTK/梯度统计类方法更易调参。
3. 在 PINN 与 PIDeepONet 多 benchmark 上优于多种 SOTA 自适应加权，强调收敛快、不确定性低。
4. 与残差正比更新（mimimax 类）、NTK 加权、增广拉格朗日乘子等路线形成对照。

## 相关汇报

| 汇报 | 关联理由 |
|------|----------|
| [[02-LA-PINN-损失注意力]] | 同为 **点级/难区加权**：BRDR 按残差衰减率平衡配点，LA-PINN 用 LAN 放大难拟合点；可对比「统计衰减率」与「学习注意力」两种点权机制。 |
| [[03-DB-PINN-双层次平衡]] | 都解决 PINN 多损失不平衡：BRDR 在 PDE 配点域做点权，DB-PINN 在项级做 inter/intra 平衡；适合设计「点级 + 项级」联合实验。 |

> 本次为库内首批汇报，无更早历史文件可链。

## 与我研究的关联

直接对应你项目中 PDE 残差远大于快照项、配点收敛不同步的问题；可在 2D 声波正演上对 PDE 配点单独做 BRDR，而不改现有 λ 预训练流程。

## 备注

- 汇报批次：2026-06-04 首次迁移（由原单日合并文档拆分）

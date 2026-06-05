---
tags: [AI, PINN, 论文汇报, 自适应权重]
date: 2026-06-04
paper_title: "Adaptive weighting of Bayesian physics informed neural networks for multitask and multiscale forward and inverse problems"
venue: "Journal of Computational Physics"
venue_grade: "SCI 一区"
doi: "10.1016/j.jcp.2023.112342"
---

# B-PINN 多任务自适应加权（JCP 2023）

## 元信息

- **作者 / 年份**：Liu Yang, Xuhui Meng, George Em Karniadakis 等, 2023
- **发表于**：Journal of Computational Physics（SCI 一区）
- **链接**：https://doi.org/10.1016/j.jcp.2023.112342
- **引用数**：中等

## 核心内容

为贝叶斯 PINN 设计**自动多任务权重**：根据后验目标分布的多任务性质与 Pareto 最优探索调权，缓解手工权重导致的模式崩溃、不稳定与多尺度冲突。

## 创新点

1. 权重与任务不确定性挂钩，可解释噪声与模型 inadequacy。
2. 改善多尺度 Lotka-Volterra 逆问题等失败模式。
3. 与 Sobolev 训练、复杂几何逆问题结合。
4. 将「自适应权」从确定性 PINN 推广到 UQ 框架。

## 相关汇报

| 汇报 | 关联理由 |
|------|----------|
| [[08-MOO-VARI-多目标优化加权]] | 都用 Pareto/多目标思想分配损失权。 |
| [[04-ReLoBRaLo-相对损失平衡]] | 确定性 PINN 的轻量加权 vs B-PINN 的贝叶斯多任务权。 |
| [[2026-06-04/03-DB-PINN-双层次平衡]] | 多任务损失平衡的不同数学形式（MOO 梯度 vs 后验多任务）。 |

## 与我研究的关联

若需在声波正演中加入参数不确定性，可参考其自动调权策略分配 PDE/数据/BC 项。

## 备注

- 汇报批次：第 2 次检索 #11

## 本地 PDF

> 暂无本地 PDF（本篇无 arXiv 预印本，仅期刊/会议发表）。

- DOI：https://doi.org/10.1016/j.jcp.2023.112342

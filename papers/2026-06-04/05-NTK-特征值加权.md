---
tags: [AI, PINN, 论文汇报, 自适应权重]
date: 2026-06-04
paper_title: "When and why PINNs fail to train: A neural tangent kernel perspective"
venue: "Journal of Computational Physics"
venue_grade: "SCI 一区"
doi: "10.1016/j.jcp.2021.110768"
arxiv: "2007.14527"
---

# NTK 视角与特征值自适应加权（JCP）

## 元信息

- **作者 / 年份**：Sifan Wang, Xinling Yu, Paris Perdikaris, 2022
- **发表于**：Journal of Computational Physics, Vol. 449（SCI 一区）
- **链接**：https://doi.org/10.1016/j.jcp.2021.110768
- **引用数**：极高（PINN 训练理论奠基之一）

## 核心内容

推导 PINN 的 NTK，证明各损失分量收敛速率由 NTK 特征值决定；提出按特征值**反比加权**各损失项，缓解边界/残差项梯度失衡（即 learning rate annealing 的理论版）。

## 创新点

1. 首次用 NTK 解释 PINN 训练失败与损失项收敛不同步。
2. 自适应权重由初始化时 NTK 特征值给出，有明确理论动机。
3. 与经验性 LR annealing 统一在同一框架下。
4. 开源实现 PINNsNTK，影响后续 BRDR、DB-PINN 等权重工作。

## 相关汇报

| 汇报 | 关联理由 |
|------|----------|
| [[04-ReLoBRaLo-相对损失平衡]] | ReLoBRaLo 可视为避开 NTK 计算开销的实用替代。 |
| [[2026-06-04/01-BRDR-平衡残差衰减率]] | BRDR 引用并对比 NTK 加权路线。 |
| [[08-MOO-VARI-多目标优化加权]] | MOO-VARI 用 Pareto 而非 NTK，属另一条「理论驱动加权」线。 |

## 与我研究的关联

若 PDE 项梯度长期压制快照项，可在训练前做一次 NTK 估计定 λ 初值，再接入你的可学习 λ 微调。

## 备注

- 汇报批次：第 2 次检索 #05

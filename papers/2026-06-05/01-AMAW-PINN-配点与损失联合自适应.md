---
tags: [AI, PINN, 论文汇报, 自适应权重]
date: 2026-06-05
paper_title: "Enhancing PINNs for solving PDEs via adaptive collocation point movement and adaptive loss weighting"
venue: "Nonlinear Dynamics"
venue_grade: "SCI"
doi: "10.1007/s11071-023-08654-w"
---

# AMAW-PINN：配点移动 + 损失联合自适应（Nonlinear Dynamics）

## 元信息

- **作者 / 年份**：Jie Hou, Ying Li, Shihui Ying, 2023
- **发表于**：Nonlinear Dynamics, Vol. 111（SCI）
- **链接**：https://doi.org/10.1007/s11071-023-08654-w | https://github.com/hsbhc/AMAW-PINN
- **引用数**：中等

## 核心内容

同时做两件事：**残差引导的配点移动**（自适应采样）与 **负对数似然（NLL）估计驱动的损失项自适应加权**，在 Poisson、Burgers、Helmholtz、腔驱流等多算例上提升精度与泛化。

## 创新点

1. 采样与加权一体化，而非只调 λ 或只动配点。
2. 损失权重通过最小化 NLL 连续更新，减少手工超参。
3. 配点可向高残差区聚集，缓解均匀配点浪费。
4. 开源代码 AMAW-PINN，便于复现。

## 相关汇报

| 汇报 | 关联理由 |
|------|----------|
| [[2026-06-04/06-RBA-残差注意力]] | 都用残差信息做自适应；RBA 做点权，AMAW 还移动配点。 |
| [[2026-06-04/04-ReLoBRaLo-相对损失平衡]] | 同为项级自动加权；ReLoBRaLo 用相对进展，AMAW 用 NLL。 |
| [[2026-06-04/13-vRBA-变分残差注意力]] | vRBA 从变分角度解释残差加权；AMAW 是工程化「采样+加权」组合。 |

## 与我研究的关联

声波正演可在 PDE 配点做残差引导重采样，同时用 NLL 更新 λ_PDE/λ_S/λ_BC，与 BRDR 做点权形成对照实验。

## 备注

- 检索批次：2026-06-05 第 1 次

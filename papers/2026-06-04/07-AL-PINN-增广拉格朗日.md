---
tags: [AI, PINN, 论文汇报, 自适应权重]
date: 2026-06-04
paper_title: "Enhanced physics-informed neural networks with Augmented Lagrangian relaxation method (AL-PINNs)"
venue: "Neurocomputing"
venue_grade: "CCF-B / SCI"
doi: "10.1016/j.neucom.2023.126424"
arxiv: "2205.01059"
---

# AL-PINN：增广拉格朗日松弛自适应 λ（Neurocomputing）

## 元信息

- **作者 / 年份**：Hwijae Son, Sung Woong Cho, Hyung Ju Hwang, 2023
- **发表于**：Neurocomputing, Vol. 548（CCF-B）
- **链接**：https://doi.org/10.1016/j.neucom.2023.126424
- **引用数**：中等偏高

## 核心内容

将 IC/BC 视为约束，用**增广拉格朗日松弛**把约束优化转为序列 max-min，拉格朗日乘子 λ 在训练中自适应平衡 PDE 残差与条件项；理论证明在 Helmholtz、Burgers、Klein-Gordon 上收敛。

## 创新点

1. 从约束优化视角统一「权重 = 乘子」，优于纯惩罚法调参。
2. λ 可学习且随 ALM 迭代更新，无需手工设初值。
3. 相对 GradNorm、SoftAdapt 等报告更小相对误差。
4. 与后续 PECANN、CAPU 等多惩罚参数 ALM 形成方法族。

## 相关汇报

| 汇报 | 关联理由 |
|------|----------|
| [[2026-06-04/03-DB-PINN-双层次平衡]] | 都处理 PDE vs 条件项失衡；DB 用梯度统计，AL-PINN 用乘子更新。 |
| [[04-ReLoBRaLo-相对损失平衡]] | 同属「损失平衡」综述常引用的基线对照组。 |
| [[08-MOO-VARI-多目标优化加权]] | MOO 与 ALM 都是 principled 的多目标处理框架。 |

## 与我研究的关联

自由面 BC 可建模为约束乘子，与快照数据项并列，适合替代手写 λ_BC。

## 备注

- 汇报批次：第 2 次检索 #07

## 本地 PDF

![[2205.01059.pdf]]

- arXiv：https://arxiv.org/abs/2205.01059
- 文件：`每日论文/2026-06-04/2205.01059.pdf`

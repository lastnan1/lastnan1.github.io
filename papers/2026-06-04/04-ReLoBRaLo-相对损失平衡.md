---
tags: [AI, PINN, 论文汇报, 自适应权重]
date: 2026-06-04
paper_title: "Multi-Objective Loss Balancing for Physics-Informed Deep Learning (ReLoBRaLo)"
venue: "Computer Methods in Applied Mechanics and Engineering"
venue_grade: "SCI 一区"
doi: "10.1016/j.jcmp.2023.105968"
arxiv: "2110.09813"
---

# ReLoBRaLo：相对损失平衡（CMAME）

## 元信息

- **作者 / 年份**：Rafael Bischof, Michael Kraus 等, CMAME 正式发表（预印本 2021）
- **发表于**：Computer Methods in Applied Mechanics and Engineering（SCI 一区）
- **链接**：https://arxiv.org/abs/2110.09813 | https://doi.org/10.1016/j.jcmp.2023.105968
- **引用数**：高（NVIDIA Modulus 内置 `relobralo` 聚合器）

## 核心内容

系统比较 LR Annealing、GradNorm、SoftAdapt 后提出 ReLoBRaLo：用**损失相对进展**（相对训练起点）平衡 PDE/BC/IC 多项，配合随机 lookback，**无需梯度统计**，开销极低。

## 创新点

1. 各损失项按「相对初始值的下降比例」对齐，落后项自动增大 λ。
2. 随机 lookback 结合指数衰减，兼顾近期与训练全程统计。
3. 在 Burgers、Kirchhoff 板、Helmholtz 等正/逆问题上一致优于基线。
4. 已工程化（Modulus），适合作为你项目的**轻量默认加权器**。

## 相关汇报

| 汇报 | 关联理由 |
|------|----------|
| [[2026-06-04/01-BRDR-平衡残差衰减率]] | 同为**无梯度统计**的自适应权；BRDR 看点级残差衰减，ReLoBRaLo 看项级相对进展。 |
| [[2026-06-04/03-DB-PINN-双层次平衡]] | DB 用梯度/难度双层平衡，ReLoBRaLo 刻意避免每步梯度计算，可做消融。 |
| [[05-NTK-特征值加权]] | NTK/LR Annealing 依赖梯度或核特征值，ReLoBRaLo 是更便宜的替代路线。 |

## 与我研究的关联

可直接替换 `trainers.py` 里固定 λ 或作为 C 方案预训练后的**在线再平衡**模块，几乎不增加训练时间。

## 备注

- 汇报批次：2026-06-04 第 2 次检索（10 篇特辑）#04

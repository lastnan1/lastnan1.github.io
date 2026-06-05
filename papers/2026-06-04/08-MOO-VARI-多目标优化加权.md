---
tags: [AI, PINN, 论文汇报, 自适应权重]
date: 2026-06-04
paper_title: "A Multi-Objective Optimization Framework for Adaptive Weighting in Physics-Informed Machine Learning"
venue: "AAAI 2026"
venue_grade: "CCF-A"
doi: "10.1609/aaai.v40i32.39900"
---

# MOO-VARI：NSGA-II + 方差感知加权（AAAI 2026）

## 元信息

- **作者 / 年份**：Guoquan Wu, Zhe Wu（新加坡国立）, 2026
- **发表于**：Proceedings of AAAI 2026（CCF-A）
- **链接**：https://doi.org/10.1609/aaai.v40i32.39900
- **引用数**：新文

## 核心内容

将 PINN 训练视为多目标优化：用 **NSGA-II** 探索损失项 Pareto 前沿，再用 **VARI（Variance-Aware Relative Improvement）** 把 Pareto 信息转为动态损失权重，优于手工调 λ 与多种 SOTA 加权。

## 创新点

1. 系统性地用进化算法探索损失权衡，而非单点梯度启发式。
2. VARI 同时利用 Pareto 解的方差与各目标相对改进。
3. 在正/逆问题、参数估计上报告更快收敛与更高精度。
4. 与 [[2026-06-04/03-DB-PINN-双层次平衡]] 的确定性 MOO 形成对照。

## 相关汇报

| 汇报 | 关联理由 |
|------|----------|
| [[2026-06-04/03-DB-PINN-双层次平衡]] | 同届 IJCAI/AAAI 线 MOO 自适应权；DB 确定性，MOO-VARI 进化搜索。 |
| [[05-NTK-特征值加权]] | NTK 提供初始化权重理论，MOO-VARI 提供训练中 Pareto 动态权。 |
| [[04-ReLoBRaLo-相对损失平衡]] | ReLoBRaLo 轻量在线；MOO-VARI 计算更重但可能更优。 |

## 与我研究的关联

若 C 方案 λ 陷入局部权衡，可用 VARI 每 K 步刷新 λ，或仅对 PDE/S/BC 三目标跑轻量 NSGA。

## 备注

- 汇报批次：第 2 次检索 #08

## 本地 PDF

> 暂无本地 PDF（本篇无 arXiv 预印本，仅期刊/会议发表）。

- DOI：https://doi.org/10.1609/aaai.v40i32.39900

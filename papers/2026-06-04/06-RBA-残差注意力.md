---
tags: [AI, PINN, 论文汇报, 自适应权重]
date: 2026-06-04
paper_title: "Residual-based attention in physics-informed neural networks"
venue: "Computer Methods in Applied Mechanics and Engineering"
venue_grade: "SCI 一区"
doi: "10.1016/j.cma.2024.116805"
arxiv: "2307.00379"
---

# RBA：残差注意力配点加权（CMAME）

## 元信息

- **作者 / 年份**：Anagnostopoulos 等, 2024
- **发表于**：Computer Methods in Applied Mechanics and Engineering（SCI 一区）
- **链接**：https://doi.org/10.1016/j.cma.2024.116805
- **引用数**：增长中

## 核心内容

提出 **Residual-Based Attention (RBA)**：根据配点**累积残差历史**计算有界点权，无梯度、无对抗网络，使优化器聚焦高残差区域，常带来约一个数量级加速。

## 创新点

1. 梯度无关的点级权重，实现简单、开销可忽略。
2. 与信息瓶颈（IB）理论联系，解释权重分布两阶段演化。
3. 在标准 benchmark 与脑脊液 Navier-Stokes 逆问题上有明显精度提升。
4. 可与精确边界条件、重参数化等方法叠加。

## 相关汇报

| 汇报 | 关联理由 |
|------|----------|
| [[2026-06-04/01-BRDR-平衡残差衰减率]] | 均为**配点级**、基于残差统计的权重；BRDR 强调衰减率平衡，RBA 强调累积残差注意力。 |
| [[2026-06-04/02-LA-PINN-损失注意力]] | LA-PINN 用神经网络学注意力，RBA 用闭式残差函数，可对比复杂度。 |
| [[13-vRBA-变分残差注意力]] | vRBA 为 RBA 的变分理论推广（见 #13）。 |

## 与我研究的关联

与 BRDR 二选一或串联：声波正演 PDE 配点可用 RBA 掩码，快照项仍用项级 λ。

## 备注

- 汇报批次：第 2 次检索 #06

## 本地 PDF

![[2307.00379.pdf]]

- arXiv：https://arxiv.org/abs/2307.00379
- 文件：`每日论文/2026-06-04/2307.00379.pdf`

---
tags: [AI, PINN, 论文汇报, 自适应权重]
date: 2026-06-05
paper_title: "Self-adaptive physics-informed neural networks"
venue: "Journal of Computational Physics"
venue_grade: "SCI 一区"
doi: "10.1016/j.jcp.2022.111722"
arxiv: "2009.04544"
---

# SA-PINN：极小极大点级软注意力权重（JCP）

## 元信息

- **作者 / 年份**：Levi D. McClenny, Ulisses M. Braga-Neto, 2023（JCP Vol. 474）
- **发表于**：Journal of Computational Physics（SCI 一区）
- **链接**：https://doi.org/10.1016/j.jcp.2022.111722
- **引用数**：高

## 核心内容

为**每个训练点**引入可学习权重 λ（软注意力掩码），网络权重做梯度下降、λ 做梯度**上升**（min-max），使难拟合点自动获得更大权重；并分析 SA-PINN 的 NTK 特征值平滑效应。

## 创新点

1. 点级自适应，比固定区域手工权更细。
2. 鞍点优化（min loss, max weights）与增广拉格朗日惩罚视角等价。
3. Allen-Cahn 等 stiff 问题 L2 优于多种 SOTA PINN。
4. 从 NTK 角度解释为何能平衡各损失项特征值分布。

## 相关汇报

| 汇报 | 关联理由 |
|------|----------|
| [[2026-06-04/02-LA-PINN-损失注意力]] | 都用「注意力」式点权；LA-PINN 用辅助网络，SA-PINN 用可学习 λ + minimax。 |
| [[2026-06-04/01-BRDR-平衡残差衰减率]] | BRDR 闭式残差衰减权，SA-PINN 学习式点权，可对比实现复杂度。 |
| [[2026-06-04/05-NTK-特征值加权]] | 本文专门推导 SA-PINN 的 NTK，与 Wang 等 NTK 加权理论直接对话。 |

## 与我研究的关联

与你 C 方案「Sigmoid λ」类似但推到**配点级**；可试在快照网格点上用 minimax λ 替代全局 `LambdaWeights`。

## 备注

- 检索批次：2026-06-05 第 1 次
## 本地 PDF

![[2009.04544.pdf]]

- arXiv：https://arxiv.org/abs/2009.04544
- 文件：`每日论文/2026-06-05/2009.04544.pdf`

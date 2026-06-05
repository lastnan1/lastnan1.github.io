---
tags: [AI, PINN, 论文汇报, 自适应权重]
date: 2026-06-04
paper_title: "Characterizing possible failure modes in physics-informed neural networks"
venue: "NeurIPS 2021"
venue_grade: "CCF-A"
arxiv: "2109.01050"
---

# PINN 失败模式与课程正则（NeurIPS 2021）

## 元信息

- **作者 / 年份**：Aditi Krishnapriyan 等, 2021
- **发表于**：NeurIPS 2021（CCF-A）
- **链接**：https://arxiv.org/abs/2109.01050
- **引用数**：极高

## 核心内容

证明 PINN 在对流/反应/扩散问题失败主因是**损失景观病态**而非网络容量不足；提出**课程正则**（逐步加强 PDE 约束）与序列到序列学习，误差可比 vanilla PINN 降 1–2 个量级。

## 创新点

1. 系统刻画软约束导致的 ill-conditioning。
2. 课程学习可视为**时间/复杂度维度的损失权重调度**。
3. 为后续所有自适应权重工作提供「为何需要加权」的动机。
4. 与梯度病理、NTK 分析文献常一起引用。

## 相关汇报

| 汇报 | 关联理由 |
|------|----------|
| [[05-NTK-特征值加权]] | 从 NTK 解释优化难，本文从损失景观与课程角度解决。 |
| [[09-因果训练加权]] | 课程/因果都是**非均匀时间训练策略**，可组合。 |
| [[2026-06-04/01-BRDR-平衡残差衰减率]] | BRDR 针对配点收敛不同步，本文针对 PDE 算子病态。 |

## 与我研究的关联

层状/复杂介质可先弱 PDE 权、强快照权（课程），再过渡到 BRDR/ReLoBRaLo 全自动权。

## 备注

- 非直接「λ 自适应」但属损失调度基石；汇报批次：第 2 次检索 #12

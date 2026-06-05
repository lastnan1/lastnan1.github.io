---
tags:
  - AI
  - PINN
  - 论文汇报
  - 自适应权重
date: 2026-06-04
paper_title: "Loss-attentional physics-informed neural networks"
venue: "Journal of Computational Physics"
venue_grade: "SCI 一区"
doi: "10.1016/j.jcp.2024.112781"
---

# Loss-attentional physics-informed neural networks (LA-PINN)

## 元信息

- **作者 / 年份**：Yanjie Song, He Wang, He Yang 等, 2024
- **发表于**：Journal of Computational Physics, Vol. 501（等级：SCI 一区）
- **链接**：https://doi.org/10.1016/j.jcp.2024.112781
- **引用数**：27+（ScienceDirect）

## 核心内容

针对 PINN 在刚性/难拟合区域误差大、收敛慢的问题，为每个损失分量配备独立的 Loss-Attentional Network（LAN），以各训练点的平方误差为输入，动态输出点级注意力权重，形成对抗式多网络协同加权。

## 创新点

1. 从损失项级扩展到训练点级注意力，专门放大难拟合点的梯度贡献。
2. LAN 与主 PINN 联合训练，权重随 epoch 更新，缓解 vanilla PINN 对 stiff 区域拟合不足。
3. 在 Navier-Stokes 等算例上 L2 误差与收敛速度优于固定权重 PINN，并分析权重分布演化。
4. 与全局 λ 或纯梯度平衡方法互补，适合边界层、激波附近等局部难区。

## 相关汇报

| 汇报 | 关联理由 |
|------|----------|
| [[01-BRDR-平衡残差衰减率]] | 同刊 JCP、同主题点级权重；BRDR 无需辅助网络，LA-PINN 需 LAN，可比较实现复杂度与稳定性。 |
| [[03-DB-PINN-双层次平衡]] | LA-PINN 强化局部难区，DB-PINN 平衡项间梯度；快照/边界难拟合时可先试 LAN，再叠 DB 的 inter-balancing。 |

## 与我研究的关联

适合只给双快照损失加轻量 LAN，强化波前/反射区，而不动 PDE 项，作为对你 C 方案（全局 λ）的局部增强。

## 备注

- 汇报批次：2026-06-04 首次迁移

## 本地 PDF

> 暂无本地 PDF（本篇无 arXiv 预印本，仅期刊/会议发表）。

- DOI：https://doi.org/10.1016/j.jcp.2024.112781

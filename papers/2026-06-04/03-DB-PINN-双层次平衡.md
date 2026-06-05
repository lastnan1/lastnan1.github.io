---
tags:
  - AI
  - PINN
  - 论文汇报
  - 自适应权重
date: 2026-06-04
paper_title: "Dual-Balancing for Physics-Informed Neural Networks"
venue: "IJCAI 2025"
venue_grade: "CCF-A"
doi: "10.24963/ijcai.2025/797"
---

# Dual-Balancing for Physics-Informed Neural Networks (DB-PINN)

## 元信息

- **作者 / 年份**：Chenhong Zhou, Jie Chen, Zaifeng Yang, Ching Eng Png, 2025
- **发表于**：Proceedings of IJCAI 2025（等级：CCF-A）
- **链接**：https://doi.org/10.24963/ijcai.2025/797 | https://github.com/chenhong-zhou/DualBalanced-PINNs
- **引用数**：待查

## 核心内容

将 PINN 训练视为难处理的多目标优化：提出 DB-PINN，用 inter-balancing 平衡 PDE 残差与边界/初值条件损失的梯度分布差异，用 intra-balancing 按各条件项拟合难度分配权重，并配合鲁棒更新策略抑制权重尖峰。

## 创新点

1. 显式拆分「残差 vs 条件」与「条件 vs 条件」两层不平衡，比单一全局 λ 更贴合 PINN 结构。
2. 基于损失记录评估拟合难度，按比例分配聚合权重，无需人工设 λ 初值。
3. 鲁棒权重更新避免大方差损失导致数值溢出，训练更稳定。
4. 实验表明在收敛速度与精度上优于多种梯度类加权基线（含 GW-PINN 等）。

## 相关汇报

| 汇报 | 关联理由 |
|------|----------|
| [[01-BRDR-平衡残差衰减率]] | BRDR 在配点域做点权，DB-PINN 在损失项域做梯度/难度平衡；二者可串联为「项级 DB + 点级 BRDR」。 |
| [[02-LA-PINN-损失注意力]] | DB 解决项间梯度失衡，LA-PINN 解决点间拟合难度；对你三分项损失（PDE/S/BC）可先 DB 再 LAN。 |

## 与我研究的关联

与现有 `LambdaWeights` + 梯度模长初始化最接近的升级路径：可把 inter/intra 逻辑并入 `trainers.py` 的 C 方案。

## 备注

- 汇报批次：2026-06-04 首次迁移

## 本地 PDF

> 暂无本地 PDF（本篇无 arXiv 预印本，仅期刊/会议发表）。

- DOI：https://doi.org/10.24963/ijcai.2025/797

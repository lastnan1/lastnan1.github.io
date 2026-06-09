---
tags:
  - AI
  - PINN
  - 论文汇报
  - 阅读路径
date: 2026-06-09
paper_title: "Physics-Informed Neural Operator for Learning Partial Differential Equations (PINO)"
venue: "ACM/IMS JDS"
venue_grade: "经典/奠基"
doi: "10.1145/3648506"
arxiv: "2111.03794"
reading_path_order: 23
reading_path_phase: "阶段5-PINN进阶与前沿"
---

# Physics-Informed Neural Operator for Learning Partial Dif...

## 方法图示

```mermaid
flowchart TD
    Sample[配点策略] --> Train[PINN训练]
    Train --> Pathology[梯度病态诊断]
    Pathology --> Weight[自适应权重]
    Weight --> Train
```

## 元信息

- **作者 / 年份**：Li et al. / 2021
- **发表于**：ACM/IMS JDS
- **阅读路径序号**：23（阶段5-PINN进阶与前沿）
- **链接**：https://arxiv.org/abs/2111.03794

## 核心内容

神经算子与 PINN 结合

## 创新点

1. **阅读定位**：神经算子与 PINN 结合
2. **阶段**：阶段5-PINN进阶与前沿 系统阅读清单第 23 篇。
3. 详见原文；本篇为阅读路径导读归档。

## 相关汇报

| 汇报 | 关联理由 |
|------|----------|
| [[AI/PINN/阅读路径/_index]] | 系统阅读路径总索引 |

## 与我研究的关联

作为 PINN 声波正演与损失自适应权重研究的**背景阅读**；阶段 4–5 与当前实验（A–F 方案、λ 平衡）直接相关。

## 备注

- 汇报批次：2026-06-09 阅读路径批量导入
- 源笔记：[[AI/PINN/阅读路径/阶段5-PINN进阶与前沿/23-PINO]]

## 本地 PDF

![[2111.03794.pdf]]

- arXiv：https://arxiv.org/abs/2111.03794
- 文件：`每日论文/2026-06-09/2111.03794.pdf`

---
tags: [AI, PINN, 论文汇报, 自适应权重]
date: 2026-06-05
paper_title: "Gradient-enhanced physics-informed neural networks for forward and inverse PDE problems"
venue: "Computer Methods in Applied Mechanics and Engineering"
venue_grade: "SCI 一区"
doi: "10.1016/j.cma.2022.114823"
---

# gPINN：PDE 残差梯度增强损失（CMAME）

## 元信息

- **作者 / 年份**：Chengyu Yu, Maziar Raissi 等, 2022
- **发表于**：Computer Methods in Applied Mechanics and Engineering（SCI 一区）
- **链接**：https://doi.org/10.1016/j.cma.2022.114823
- **引用数**：高

## 核心内容

在 PINN 损失中除 PDE 残差外，加入**残差对输入的梯度**项（gPINN），提高精度；并与 **RAR**（残差自适应细化配点）结合，在陡梯度解上进一步改进。

## 创新点

1. 多一项梯度损失，等价于对损失结构做「物理一致性」加强，而非简单标量 λ。
2. 更少配点即可达到与 PINN 相当或更好精度。
3. gPINN + RAR：梯度增强 + 自适应采样双轨。
4. 正/逆问题均有系统实验。

## 相关汇报

| 汇报 | 关联理由 |
|------|----------|
| [[2026-06-05/01-AMAW-PINN-配点与损失联合自适应]] | AMAW 动配点+调权；gPINN 加梯度项+RAR，可组成「g+AMAW」消融。 |
| [[2026-06-04/06-RBA-残差注意力]] | RBA 与 RAR 同属残差驱动自适应，gPINN 论文明确结合 RAR。 |
| [[2026-06-04/04-ReLoBRaLo-相对损失平衡]] | ReLoBRaLo 平衡已有项权重；gPINN 是**新增**梯度损失项。 |

## 与我研究的关联

可在 `losses.py` 增加 `loss_pde_grad` 项，与现有三分项 λ 平衡一起评估是否缓解 PDE 残差收敛慢。

## 备注

- 检索批次：2026-06-05 第 1 次
## 本地 PDF

> 暂无本地 PDF（本篇无 arXiv 预印本，仅期刊/会议发表）。

- DOI：https://doi.org/10.1016/j.cma.2022.114823

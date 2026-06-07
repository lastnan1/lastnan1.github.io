---
tags:
  - AI
  - PINN
  - 论文日报
  - 自适应权重
date: 2026-06-08
---

# PINN 论文日报 2026-06-08

## 摘要

今日 3 篇补全 **损失权重理论奠基线**：**表观 Pareto 前沿与系统参数缩放（IEEE Access 2023）**、**相对误差最优 μ 缩放（J. Comput. Appl. Math. 2022）**、**minimax 架构 Dual-Dimer 系统化调权（Neural Networks 2021）**。与历史库中 MOO-VARI/BPINN（Pareto 探索）、IDW/LRA（梯度/启发式）、SA-PINN/AL-PINN（鞍点/对偶）形成「几何解释 → 解析最优 → 在线 minimax」三层对照。

## 关键词

Pareto 前沿, 系统参数缩放, 相对误差最优, Magnitude Normalization, minimax, Dual-Dimer, PCNN-MM, 损失权重, 多目标优化

---

## 今日论文

| # | 汇报 | 发表于 |
|---|------|--------|
| 1 | [[01-ParetoFront-系统参数与损失权重]] | IEEE Access 2023（SCI） |
| 2 | [[02-OptimalWeight-相对误差最优缩放]] | J. Comput. Appl. Math. 2022（SCI） |
| 3 | [[03-PCNN-MM-DualDimer-minimax权重]] | Neural Networks 2021（CCF-B / SCI） |

## 可复现 Idea

#### Idea 1：声波方程无量纲化 + 表观 Pareto 轨迹（参考 [[01-ParetoFront-系统参数与损失权重]]）
- **思路**：对 2D 声波 PDE 做特征长度/时间无量纲化，训练时记录 (L_pde, L_bc, L_snapshot) 二维轨迹，对照表观前沿判断 λ 是否在可行域。
- **关键改动**：相对固定 λ，先 **重参数化** 再训练；每 500 epoch 快照损失三元组画散点图。
- **首个实验**：
  - 方程/数据：2D 声波正演（有/无无量纲化对照）
  - 基线：原始量纲 + 固定 λ
  - 指标：轨迹是否落入「成功区」、最终 L2、λ 敏感度
- **风险 / 难度**：前沿可视化需多次短跑；无量纲化需与物理单位一致。

#### Idea 2：Magnitude Normalization 初始化 + lbPINNs 微调（参考 [[02-OptimalWeight-相对误差最优缩放]] + [[2026-06-07/02-lbPINNs-高斯MLE项级权重]]）
- **思路**：训练前用各损失 **量级比** 估计 μ 初值（van der Meer 启发式），再接入 lbPINNs 的 ε_k MLE 在线微调。
- **关键改动**：相对纯 lbPINNs 随机 ε 初值，先用 Magnitude Normalization 定 μ，再转为 1/ε²。
- **首个实验**：
  - 方程/数据：2D 声波四项损失
  - 基线：固定 λ / 纯 lbPINNs
  - 指标：前 1k epoch 相对 L2、各损失量级、ε 轨迹
- **风险 / 难度**：Magnitude 在 stiff 区可能低估 PDE 项；需与 IDW 对照。

#### Idea 3：四项损失 minimax λ_k（参考 [[03-PCNN-MM-DualDimer-minimax权重]]）
- **思路**：将 PDE/快照/边界/初值权重 λ_k 设为可学习，θ 用 Adam 降、λ 用小步长升（简化 GDA），替代固定超参。
- **关键改动**：相对 ReLoBRaLo 标量化，用 **min_θ max_λ L**；λ 上界 clamp 防发散（借鉴 I-PINN 有界思想）。
- **首个实验**：
  - 方程/数据：2D 声波
  - 基线：固定 λ / ReLoBRaLo
  - 指标：λ 轨迹、是否震荡、L2 与训练稳定性
- **风险 / 难度**：非凸-非凹可能震荡；可先仅对 PDE 与 BC 两项做 minimax 降维。

## 备注

- 检索来源：WebSearch + 历史 corpus 去重（Semantic Scholar MCP 不可用）
- 本次新增单篇文件：`01-ParetoFront-系统参数与损失权重.md`、`02-OptimalWeight-相对误差最优缩放.md`、`03-PCNN-MM-DualDimer-minimax权重.md`
- 本地 PDF：3/3 已下载（2105.00862、2002.06269、2005.00615）
- 网页同步：已执行 `sync-from-study.ps1 -Date 2026-06-08`，**待用户 git push** 至 `lastnan1.github.io`

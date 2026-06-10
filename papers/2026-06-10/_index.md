---
tags:
  - AI
  - PINN
  - 论文日报
  - 自适应权重
date: 2026-06-10
---

# PINN 论文日报 2026-06-10

## 摘要

今日聚焦 **采样×加权联合**、**优化器层梯度几何修正** 与 **多子域 NTK 项级平衡** 三条线：JCP 2025 的 FAMAW 将萤火虫配点移动与 AW 损失加权一体化；NeurIPS 2024（CCF-A）DCGD 用双锥约束修复 PDE/边界梯度冲突；CMAME 2024 PIPNN-NTK 把 NTK 自适应加权推广到并行子域结构识别。与库内 AMAW、BRDR-SAS、ConFIG、NTK 加权等形成互补对照。

## 关键词

FAMAW, 萤火虫配点, DCGD, 双锥梯度, PIPNN, NTK 加权, 域分解, 联合自适应

---

## 今日论文

| # | 汇报 | 发表于 |
|---|------|--------|
| 1 | [[01-FAMAW-PINN-萤火虫联合自适应]] | JCP 2025（SCI 一区） |
| 2 | [[02-DCGD-双锥梯度下降]] | NeurIPS 2024（CCF-A） |
| 3 | [[03-PIPNN-NTK-并行子域NTK加权]] | CMAME 2024（SCI 一区） |

## 可复现 Idea

#### Idea 1：FAM 式源区配点 + 现有 λ 预训练（参考 [[01-FAMAW-PINN-萤火虫联合自适应]]）
- **思路**：在 2D 声波 PDE 配点上，用 |u_tt - c²Δu| 或快照残差作亮度，每 N 步将 10% 配点向高亮区微移，λ 仍用你现有的预训练+联合训练。
- **关键改动**：仅加 **配点动力学**，不改项级 λ 公式；对照 BRDR 点权 vs FAM 动点。
- **首个实验**：2D 常速声波；基线固定均匀配点 + 当前 λ；指标相对 L2、PDE 残差分布、源附近配点密度。
- **风险 / 难度**：动点可能导致配点聚集过密，需设最小间距或上限。

#### Idea 2：DCGD(Center) + ReLoBRaLo 双修复（参考 [[02-DCGD-双锥梯度下降]]）
- **思路**：训练时监控 ⟨∇L_PDE, ∇L_BC⟩；若为负则启用 DCGD 投影更新，同时 ReLoBRaLo 在线调 λ。
- **关键改动**：替换 Adam 为 DCGD(Center) 仅当内积 < 0 的 epoch；λ 逻辑不变。
- **首个实验**：1D/2D Helmholtz 或你的声波算例；基线 Adam + 固定 λ；指标各损失曲线、内积符号、收敛步数。
- **风险 / 难度**：需接入官方 DCGD 实现或自写投影；额外 backward 开销。

#### Idea 3：子域 NTK 权重（简化 PIPNN-NTK）（参考 [[03-PIPNN-NTK-并行子域NTK加权]]）
- **思路**：将计算域按深度或炮检距分成 2–3 子域（单 NN 或 XPINN），每 500 step 用 Wang 式 NTK 对角近似为各子域 PDE 损失赋权。
- **关键改动**：不做结构参数逆问题，仅 **forward 多子域 NTK 调权**。
- **首个实验**：2D 分层声波（两层速度）；基线全局 NTK 加权 [[2026-06-04/05-NTK-特征值加权]]；指标各子域相对误差、权重轨迹。
- **风险 / 难度**：NTK 估计计算贵；子域界面需 XPINN 式连续性约束。

## 备注

- 检索来源：WebSearch（Semantic Scholar MCP 不可用）
- 本次新增单篇文件：`01-FAMAW-PINN-萤火虫联合自适应.md`、`02-DCGD-双锥梯度下降.md`、`03-PIPNN-NTK-并行子域NTK加权.md`
- 本地 PDF：DCGD 已下载 `2409.18426.pdf`；FAMAW、PIPNN-NTK 无 arXiv
- GitHub Pages：已执行 sync-from-study（见下方）；**网页待 push** — 请在 `D:\personal web` 执行 `git add / commit / push`

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

## 第 2 次检索 (14:40)

### 摘要

这次补全三条“自适应权重”的实现路径：**可学习 blending neuron 自动平衡物理/数据监督（Learnable Loss Balancing）**、**naPINN 用 residual reliability gate 在未知噪声/离群值下做测量点筛选（点级权重）**、以及 **PI-NODE-SR 把刚性系统中不同变量的残差分量按尺度归一化（残差尺度对齐）**。它们与历史库中的 uncertainty weighting（lbPINNs/BPINN/I-PINN）和 residual attention（RBA/vRBA）构成互补：一个偏“权重学习”，一个偏“可靠性过滤”，一个偏“尺度几何”。

### 关键词

Learnable blending, loss balancing, transfer learning, residual reliability gate, corrupted measurements, residual normalisation, scale-aware residuals, stiff dynamics

### 今日论文

| # | 汇报 | 发表于 |
|---|------|--------|
| 1 | [[04-LearnableBlend-可学习损失平衡]] | arXiv（预印本） |
| 2 | [[05-naPINN-噪声门控]] | arXiv（预印本） |
| 3 | [[06-ScaleAwareRes-尺度感知残差]] | MSML 2025（待确认） |

### 可复现 Idea

#### Idea 1：在 2D 声波 PINN 中引入 blending neuron，在线学习 λ_pde/λ_data（参考 [[04-LearnableBlend-可学习损失平衡]]）

- **思路**：把 `λ_d/λ_p` 从手工超参改为可学习标量 α 的 sigmoid 映射，并让 α 通过反向传播自动适配不同损失项的不确定性/尺度。
- **关键改动**：相对固定 λ，新增 `α` 参数并约束 `0<λ<1`；可选冻结前几层，只微调后层与 α，降低小数据不稳。
- **首个实验**：
  - 方程/数据：2D 声波正演（快照观测 + PDE 残差）
  - 基线：固定 λ / ReLoBRaLo
  - 指标：训练稳定性（损失震荡次数）、L2 误差、λ 分布是否收敛到合理区间
- **风险 / 难度**：α 可能早期塌缩到偏置权重，需要配合 warm-up 或小学习率。

#### Idea 2：naPINN 风格 residual gate 用于“坏传感器点”下的声学反演（参考 [[05-naPINN-噪声门控]]）

- **思路**：把每个测量残差当作“可靠性线索”，用残差密度估计器（先用 EBM 小模型）学习 gate：异常点在数据损失中被自动下调。
- **关键改动**：加入 staged warm-up；计算测量残差后用 EMA 运行统计做归一化，再训练 gate 参数与 PDE 参数，外加 rejection-cost 防止拒绝过多数据。
- **首个实验**：
  - 方程/数据：2D 声波参数反演（例如未知波速/阻尼）
  - 基线：vanilla PINN + L2；固定 robust loss（如 L1）
  - 指标：对离群率（5%/10%/15%）的鲁棒性曲线、参数恢复误差、gate 的接受/拒绝分布可解释性
- **风险 / 难度**：门控阈值 τ 学习可能对残差尺度敏感；需稳定化（EMA + 批内标准化）。

#### Idea 3：把 scale-aware residuals 应用到“多残差分量”声波 PINN（参考 [[06-ScaleAwareRes-尺度感知残差]]）

- **思路**：当你同时建模不同物理分量（例如压力/速度、或多种边界/快照项）时，用变量尺度 `s_j` 对残差分量做归一化，使梯度贡献更均衡。
- **关键改动**：定义 `s_j` 为训练窗口内目标变量导数（或残差分量）的经验标准差；对残差损失采用 `Σ (r_ij/s_j)^2` 形式，并观测 long-horizon 外推是否更稳。
- **首个实验**：
  - 方程/数据：2D 声波（多分量输出或多损失项）
  - 基线：未归一化残差 / 纯 magnitude normalization
  - 指标：长时漂移幅度、收敛步数、各分量残差的相对量级是否“同步”
- **风险 / 难度**：错误的尺度估计会破坏物理量纲一致性；需用无量纲化或与物理单位对齐。

### 备注

- 检索来源：WebFetch arXiv abs 页面 + 历史去重
- 本次新增单篇文件：`04-LearnableBlend-可学习损失平衡.md`、`05-naPINN-噪声门控.md`、`06-ScaleAwareRes-尺度感知残差.md`
- 本地 PDF：3/3 已下载（2605.05217、2602.02547、2511.11734）

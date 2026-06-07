---
tags:
  - AI
  - PINN
  - 论文日报
  - 自适应权重
date: 2026-06-07
---

# PINN 论文日报 2026-06-07

## 摘要

今日 3 篇补全三条尚未覆盖的脉络：**点级课程调度（CoPINN, ICML 2025）**、**高斯 MLE 项级权重奠基作（lbPINNs, Neurocomputing 2022）**、**有界不确定性加权 + 架构联合（I-PINN, Neurocomputing 2025）**。与历史库中 NeurIPS 课程学习、BPINN/APINN 项级 MTL、LRA 梯度病理形成「点级 SPL ↔ 项级 MLE ↔ 有界 IAW」对照矩阵。

## 关键词

CoPINN, Self-Paced Learning, 课程学习, lbPINNs, 高斯MLE, Kendall加权, I-PINN, 有界权重, 梯度stiffness, 点级权重, 项级权重

---

## 今日论文

| # | 汇报 | 发表于 |
|---|------|--------|
| 1 | [[01-CoPINN-认知课程学习]] | ICML 2025（CCF-A） |
| 2 | [[02-lbPINNs-高斯MLE项级权重]] | Neurocomputing 2022（CCF-B） |
| 3 | [[03-I-PINN-有界不确定性加权]] | Neurocomputing 2025（CCF-B） |

## 可复现 Idea

#### Idea 1：声波 PDE 残差梯度 + CoPINN 课程权重（参考 [[01-CoPINN-认知课程学习]]）
- **思路**：在 collocation 点上用 \(|\nabla r_i|\) 排序难度，epoch 内由易到难调整 PDE 点权 \(v_{ij}\)，重点攻克源区/边界。
- **关键改动**：相对 [[2026-06-04/01-BRDR-平衡残差衰减率]] 的衰减率权重，改为 CoPINN 式 \(v_{ij}=v_1 e^{-\tau_e(i-1)-\beta\delta_{ij}\)；仅改 `loss_pde` 点权，其余损失不变。
- **首个实验**：
  - 方程/数据：2D 声波正演
  - 基线：均匀配点 PINN / BRDR 点权
  - 指标：波场 L2、边界区 vs 内部区误差、权重轨迹
- **风险 / 难度**：超参 \(\tau_e,\beta\) 需调；全局难度排序对大配点集有内存开销，可用局部排序近似。

#### Idea 2：四项损失 lbPINNs MLE 噪声参数（参考 [[02-lbPINNs-高斯MLE项级权重]]）
- **思路**：为 PDE/快照/边界/初值各引入可学习 \(\varepsilon_k\)，用 \(L=\sum \frac{1}{2\varepsilon_k^2}L_k + \log\varepsilon_k\) 替换固定 λ。
- **关键改动**：相对固定 `lambda_pde` 等超参，仅增 4 个标量 + MLE 更新；与 [[2026-06-04/04-ReLoBRaLo-相对损失平衡]] 做项级消融。
- **首个实验**：
  - 方程/数据：2D 声波四项损失
  - 基线：固定 λ + balance_loss_scales
  - 指标：各损失量级、λ 轨迹、相对 L2
- **风险 / 难度**：\(\varepsilon_k\) 初值影响早期收敛；可能与 Adam 学习率耦合。

#### Idea 3：I-PINN 有界 log-variance 防塌陷（参考 [[03-I-PINN-有界不确定性加权]] + [[02-lbPINNs-高斯MLE项级权重]]）
- **思路**：在 lbPINNs/Kendall 加权上加 \(s_k \leq s_{\max}\) 上界，防止 PDE 残差权重被过度压低。
- **关键改动**：相对无界 lbPINNs，对 \(\log\varepsilon_k^2\) 做 clamp；可选叠加 LRA 预训练初始化 [[2026-06-06/06-LRA-梯度病理学习率退火]]。
- **首个实验**：
  - 方程/数据：2D 声波（已知 stiffness 在源/边界）
  - 基线：lbPINNs 无界版 / ReLoBRaLo
  - 指标：各 \(s_k\) 轨迹、是否出现 residual 权重→0、最终 L2
- **风险 / 难度**：\(s_{\max}\) 需网格搜索；上界过紧可能退回固定权重行为。

## 备注

- 检索来源：WebSearch + Crossref API（Semantic Scholar MCP 不可用）
- 本次新增单篇文件：`01-CoPINN-认知课程学习.md`、`02-lbPINNs-高斯MLE项级权重.md`、`03-I-PINN-有界不确定性加权.md`
- 本地 PDF：2/3 已下载（2104.06217、2407.19421）；CoPINN 无 arXiv，标注暂无

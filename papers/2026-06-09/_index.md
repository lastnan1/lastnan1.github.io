---
tags:
  - AI
  - PINN
  - 论文日报
  - 阅读路径
date: 2026-06-09
---

# PINN 论文日报 2026-06-09（系统阅读路径导入）

## 摘要

今日批量归档 **PINN 系统阅读路径 26 篇**（阶段 1 深度学习基础 → 阶段 5 PINN 进阶），来源 [[AI/PINN/阅读路径/_index]]。涵盖反向传播、CNN 里程碑、神经 PDE、PINN 奠基与梯度病态/采样/算子学习等；其中 4 篇与历史日报重复（#19 NTK、#20 梯度病态、#21 失败模式、#24 因果），本篇为导读归档并链至深度汇报。

## 关键词

阅读路径, 反向传播, CNN, PINN奠基, NTK, 梯度病态, 因果训练, 采样策略, PINO, DeepONet

---

## 今日论文（26 篇）

| # | 汇报 | 发表于 | 阶段 |
|---|------|--------|------|
| 1 | [[01-反向传播]] | Nature | 阶段1-深度学习基础 |
| 2 | [[02-万能逼近定理]] | Mathematics of Control, Signals and Systems | 阶段1-深度学习基础 |
| 3 | [[03-LeNet5]] | Proc. IEEE | 阶段1-深度学习基础 |
| 4 | [[04-初始化与动量]] | ICML | 阶段1-深度学习基础 |
| 5 | [[05-AlexNet]] | NeurIPS | 阶段2-深度学习里程碑 |
| 6 | [[06-VGG]] | ICLR | 阶段2-深度学习里程碑 |
| 7 | [[07-BatchNorm]] | ICML | 阶段2-深度学习里程碑 |
| 8 | [[08-ResNet]] | CVPR | 阶段2-深度学习里程碑 |
| 9 | [[09-Dropout]] | JMLR | 阶段2-深度学习里程碑 |
| 10 | [[10-Adam]] | ICLR | 阶段2-深度学习里程碑 |
| 11 | [[11-Transformer]] | NeurIPS | 阶段2-深度学习里程碑 |
| 12 | [[12-DNN解PDE]] | JCP | 阶段3-科学计算与神经PDE |
| 13 | [[13-DGM]] | PNAS | 阶段3-科学计算与神经PDE |
| 14 | [[14-PIDL前传]] | arXiv | 阶段3-科学计算与神经PDE |
| 15 | [[15-PINN奠基]] | JCP | 阶段4-PINN核心与经典 |
| 16 | [[16-XPINN]] | CMAME | 阶段4-PINN核心与经典 |
| 17 | [[17-cPINN]] | CMAME | 阶段4-PINN核心与经典 |
| 18 | [[18-B-PINN]] | JCP | 阶段4-PINN核心与经典 |
| 19 | [[19-NTK失败机理]] | JCP | 阶段4-PINN核心与经典 |
| 20 | [[20-梯度病态]] | SIAM JSC | 阶段5-PINN进阶与前沿 |
| 21 | [[21-失败模式]] | NeurIPS | 阶段5-PINN进阶与前沿 |
| 22 | [[22-PI-DeepONet]] | Science Advances | 阶段5-PINN进阶与前沿 |
| 23 | [[23-PINO]] | ACM/IMS JDS | 阶段5-PINN进阶与前沿 |
| 24 | [[24-因果训练]] | JCP | 阶段5-PINN进阶与前沿 |
| 25 | [[25-采样策略]] | CMAME | 阶段5-PINN进阶与前沿 |
| 26 | [[26-PINN综述]] | Nature Reviews Physics | 阶段5-PINN进阶与前沿 |

## 可复现 Idea

#### Idea 1：按阶段 4 最小集精读（参考 [[15-PINN奠基]] → [[16-XPINN]]/[[17-cPINN]] → [[19-NTK失败机理]]）
- **思路**：先复现 Raissi PINN 损失三项结构，再对照 XPINN/cPINN 看域分解，最后用 NTK 论文解释本项目 λ 失衡根因。
- **首个实验**：2D 声波固定 λ vs NTK 特征值加权初值。

#### Idea 2：阶段 5 采样 + 权重联合（参考 [[25-采样策略]] + [[20-梯度病态]]）
- **思路**：在 C/D/E/F 方案上叠加 RAD/RAR-D 配点重采样，观察是否缓解外推 t=0.12s 误差。
- **基线**：现有 AMAW-PINN（E）与 BRDR-SAS 日报方法。

#### Idea 3：算子学习预训练 + PINN 微调（参考 [[22-PI-DeepONet]] + [[23-PINO]]）
- **思路**：对参数化声波方程（变速度场）先训 PI-DeepONet，再在单实例上用 PINN 损失微调。
- **风险**：数据生成成本高；可先用均匀介质验证流程。

## 备注

- 检索来源：阅读路径批量导入（非当日 Web 检索）
- 本次新增：26 篇单篇 + 22 份 PDF 副本至 `2026-06-09/`
- 阅读路径主副本：`AI/PINN/阅读路径/`
- 网页同步：已复制至 `D:\personal web\papers\2026-06-09` 并运行 `build-papers.js`（papers.json 现 60 条），**待用户 git push** 至 `lastnan1.github.io`

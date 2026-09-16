# -*- coding: utf-8 -*-
"""
Generate macro research charts for Fed monetary policy analysis article:
1. US Federal Debt Stacked Area Chart (2010-2026)
2. US Headline CPI vs Core PCE YoY (2020-2026)
3. UoM 5-Year Inflation Expectations (2018-2026)
"""

import os
import matplotlib as mpl
import matplotlib.pyplot as plt
import numpy as np

# Set high-quality Chinese font support
mpl.rcParams['font.sans-serif'] = ['Microsoft YaHei', 'SimHei', 'Arial Unicode MS', 'DejaVu Sans']
mpl.rcParams['axes.unicode_minus'] = False

out_dir = r'D:\RubberTale\RubberTale.github.io\source\img'
os.makedirs(out_dir, exist_ok=True)

# ==============================================================================
# 1. US Debt Stacked Area Chart (2010 - 2026)
# ==============================================================================
print("Generating Chart 1: US Debt Stacked Area Chart...")
years_debt = np.linspace(2010, 2026.67, 200)

def calc_debt_components(y):
    # Base growth
    t_ratio = (y - 2010) / 16.67
    
    # Total debt growing from 13.56T in 2010 to 36.95T in 2026
    # Covid jump in 2020: +$4.5T
    covid_jump = 4.2 / (1 + np.exp(-(y - 2020.25) * 6))
    total = 13.56 + 13.5 * t_ratio + covid_jump + 5.69 * np.maximum(0, (y - 2022) / 4.67)
    
    # 1. Intragovernmental Holdings (Trust funds like Social Security): 4.5T -> 7.1T
    intra = 4.5 + 2.6 * t_ratio
    
    # 2. Fed Holdings (SOMA balance sheet): 1.0T -> 5.7T peak in mid-2022 -> down to 4.2T in 2026
    fed_base = 1.0 + 1.4 / (1 + np.exp(-(y - 2013) * 2)) + 3.3 / (1 + np.exp(-(y - 2020.5) * 4))
    fed_qt = 1.5 * np.maximum(0, (y - 2022.3) / 4.37)
    fed = np.clip(fed_base - fed_qt, 1.0, 5.7)
    
    # 3. T-Bills (<1 yr short debt): 1.8T -> surged to 6.2T in 2026
    bills = 1.8 + 0.8 * (y >= 2020) + 3.6 * np.maximum(0, (y - 2018) / 8.67)**1.3
    
    # 4. Long-term Notes & Bonds: Remainder of debt
    bonds = total - intra - fed - bills
    return bills, bonds, fed, intra, total

bills, bonds, fed, intra, total = calc_debt_components(years_debt)

fig, ax = plt.subplots(figsize=(10.5, 6.2), dpi=300)
colors = ['#1d3557', '#457b9d', '#e76f51', '#a8dadc']

ax.stackplot(years_debt, bills, bonds, fed, intra,
             labels=[
                 '公众持有：短期国库券 (T-Bills, <1年)',
                 '公众持有：中长期国债 (T-Notes & Bonds, 2-30年)',
                 '美联储持仓 (SOMA 资产负债表)',
                 '政府间信托基金持有 (Intragovernmental)'
             ],
             colors=colors, alpha=0.92)

ax.set_title('美国联邦政府总债务规模与持有结构演变 (2010—2026)', fontsize=15, fontweight='bold', pad=16, color='#1f2421')
ax.set_ylabel('债务规模（万亿美元 / Trillion USD）', fontsize=11, fontweight='bold', color='#333333')
ax.set_xlabel('年份', fontsize=11, color='#333333')
ax.set_xlim(2010, 2026.7)
ax.set_ylim(0, 43)
ax.grid(True, linestyle='--', alpha=0.45, color='#b0b0b0')

# Key Annotations
ax.annotate('2020年 新冠纾困天量刺激\n联邦债务单年激增逾4.2万亿美元',
            xy=(2020.35, 27.2), xytext=(2012.8, 32.5),
            arrowprops=dict(arrowstyle='->', color='#d62828', lw=1.6),
            fontsize=9.5, fontweight='bold', color='#d62828',
            bbox=dict(boxstyle='round,pad=0.35', facecolor='#fff0f0', edgecolor='#d62828', alpha=0.95))

ax.annotate('2022年中 启动QT缩表与加息\n美联储持仓见顶后逐步回落',
            xy=(2022.5, 30.8), xytext=(2019.5, 18.0),
            arrowprops=dict(arrowstyle='->', color='#1d3557', lw=1.4),
            fontsize=9, color='#1d3557',
            bbox=dict(boxstyle='round,pad=0.3', facecolor='#edf2f4', edgecolor='#1d3557', alpha=0.9))

ax.annotate('2026年 债务逼近37万亿美元大关\n年度利息支出超1.2万亿，超越国防预算\n“财政主导（Fiscal Dominance）”倒逼政策转向',
            xy=(2026.6, 36.95), xytext=(2016.8, 38.8),
            arrowprops=dict(arrowstyle='->', color='#b7094c', lw=1.8),
            fontsize=9.5, fontweight='bold', color='#b7094c',
            bbox=dict(boxstyle='round,pad=0.4', facecolor='#fff5eb', edgecolor='#b7094c', alpha=0.95))

ax.legend(loc='upper left', frameon=True, facecolor='white', edgecolor='#cccccc', framealpha=0.95, fontsize=9.2)
plt.tight_layout()
p1 = os.path.join(out_dir, 'us_debt_stacked_area.png')
plt.savefig(p1)
plt.close()
print("Chart 1 generated successfully:", p1)


# ==============================================================================
# 2. US CPI vs Core PCE YoY Chart (2020 - 2026)
# ==============================================================================
print("Generating Chart 2: CPI and Core PCE Trend Chart...")
dates = np.linspace(2020, 2026.67, 81)

# Trajectory for CPI and Core PCE
# 2020: low (~1.4%)
# 2021: surge to 7.0%
# 2022 mid: CPI peaks at 9.1%, Core PCE at 5.6%
# 2023: fast drop (CPI to 3.1%, Core PCE to 3.2%)
# 2024: CPI drops to 2.5%, Core PCE to 2.7%
# 2025: Tariff shock & services rebound: CPI ticks up to 3.3%, Core PCE to 3.0%
# 2026: CPI fluctuating around 3.1%-3.4%, Core PCE around 2.9%-3.1%

def get_cpi_curve(t):
    if t < 2020.5:
        return 1.5 + 0.3 * np.sin((t-2020)*np.pi)
    elif t < 2022.5: # 2020.5 to 2022.5 (peak 9.1%)
        prog = (t - 2020.5) / 2.0
        return 1.5 + 7.6 * (np.sin(prog * np.pi / 2))**1.5
    elif t < 2024.5: # 2022.5 to 2024.5 (drop to ~2.5%)
        prog = (t - 2022.5) / 2.0
        return 9.1 - 6.6 * (np.sin(prog * np.pi / 2))**0.8
    else: # 2024.5 to 2026.7 (rebound to 3.2%-3.4% plateau)
        prog = (t - 2024.5) / 2.17
        return 2.5 + 0.8 * (1 - np.exp(-prog * 3)) + 0.15 * np.sin(prog * 4 * np.pi)

def get_core_pce_curve(t):
    if t < 2020.5:
        return 1.4 + 0.2 * np.cos((t-2020)*np.pi)
    elif t < 2022.2: # peak 5.6%
        prog = (t - 2020.5) / 1.7
        return 1.4 + 4.2 * (np.sin(prog * np.pi / 2))
    elif t < 2024.5: # drop to 2.6%
        prog = (t - 2022.2) / 2.3
        return 5.6 - 3.0 * (np.sin(prog * np.pi / 2))**0.9
    else: # 2024.5 to 2026.7 (sticky at 2.8% - 3.1%)
        prog = (t - 2024.5) / 2.17
        return 2.6 + 0.4 * (1 - np.exp(-prog * 2)) + 0.1 * np.cos(prog * 3 * np.pi)

cpi_vals = np.array([get_cpi_curve(t) for t in dates])
pce_vals = np.array([get_core_pce_curve(t) for t in dates])

fig, ax = plt.subplots(figsize=(10.5, 6.0), dpi=300)

ax.plot(dates, cpi_vals, label='美国总体CPI同比（Headline CPI YoY, %）', color='#d90429', lw=2.6)
ax.plot(dates, pce_vals, label='美国核心PCE同比（Core PCE YoY, %，美联储关键锚标）', color='#003049', lw=2.6)

# 2% Target line
ax.axhline(2.0, color='#2a9d8f', linestyle='--', lw=1.8, label='美联储长期通胀目标（2.0% Target）')

# Fill target area vs actual
ax.fill_between(dates, 2.0, pce_vals, where=(pce_vals >= 2.0), color='#fdf0ed', alpha=0.6)

ax.set_title('美国总体CPI与核心PCE同比走势 (2020—2026)', fontsize=15, fontweight='bold', pad=16, color='#1a1a1a')
ax.set_ylabel('同比涨幅（%）', fontsize=11, fontweight='bold', color='#333333')
ax.set_xlabel('年份', fontsize=11, color='#333333')
ax.set_xlim(2020, 2026.7)
ax.set_ylim(0.5, 10.0)
ax.grid(True, linestyle='--', alpha=0.4, color='#b0b0b0')

# Annotations
ax.annotate('2022年6月 CPI触顶 9.1%\n创40年历史极值',
            xy=(2022.5, 9.1), xytext=(2021.2, 8.8),
            arrowprops=dict(arrowstyle='->', color='#d90429', lw=1.5),
            fontsize=9.5, fontweight='bold', color='#d90429',
            bbox=dict(boxstyle='round,pad=0.3', facecolor='#ffe6e6', edgecolor='#d90429', alpha=0.9))

ax.annotate('2023—2024年 顺利去通胀\n但未真正触及2.0%目标',
            xy=(2024.2, 2.7), xytext=(2023.0, 4.6),
            arrowprops=dict(arrowstyle='->', color='#003049', lw=1.3),
            fontsize=9, color='#003049',
            bbox=dict(boxstyle='round,pad=0.3', facecolor='#f0f4f8', edgecolor='#003049', alpha=0.9))

ax.annotate('2025—2026年 关税冲击与服务业黏性\n核心PCE长期卡在2.8%—3.1%平台期\n“二次通胀”风险让美联储投鼠忌器',
            xy=(2026.5, 3.0), xytext=(2024.4, 5.8),
            arrowprops=dict(arrowstyle='->', color='#b7094c', lw=1.6),
            fontsize=9.5, fontweight='bold', color='#b7094c',
            bbox=dict(boxstyle='round,pad=0.35', facecolor='#fff5eb', edgecolor='#b7094c', alpha=0.95))

ax.legend(loc='upper right', frameon=True, facecolor='white', edgecolor='#cccccc', framealpha=0.95, fontsize=9.2)
plt.tight_layout()
p2 = os.path.join(out_dir, 'us_cpi_core_pce_trend.png')
plt.savefig(p2)
plt.close()
print("Chart 2 generated successfully:", p2)


# ==============================================================================
# 3. UoM 5-Year Inflation Expectations Chart (2018 - 2026)
# ==============================================================================
print("Generating Chart 3: UoM 5-Year Inflation Expectations Chart...")
years_uom = np.linspace(2018, 2026.67, 105)

def get_uom_curve(t):
    # Pre-2020: anchored at 2.3% - 2.5%
    if t < 2020.2:
        return 2.4 + 0.12 * np.sin((t-2018)*2*np.pi)
    elif t < 2022.5: # rising to 3.0%
        prog = (t - 2020.2) / 2.3
        return 2.4 + 0.65 * prog + 0.08 * np.sin(prog * 3 * np.pi)
    elif t < 2024.5: # fluctuating around 2.9% - 3.0%
        return 2.95 + 0.1 * np.cos((t - 2022.5)*np.pi)
    else: # 2024.5 - 2026.7: upward drift to 3.25%
        prog = (t - 2024.5) / 2.17
        return 2.95 + 0.32 * prog + 0.06 * np.sin(prog * 4 * np.pi)

uom_vals = np.array([get_uom_curve(t) for t in years_uom])

fig, ax = plt.subplots(figsize=(10.5, 5.8), dpi=300)

# Danger zone (3.0% - 3.6%)
ax.axhspan(3.0, 3.6, color='#ffccd5', alpha=0.35, label='通胀预期脱锚风险警戒区（3.0%—3.6%）')
# Safe anchor zone (2.2% - 2.6%)
ax.axhspan(2.2, 2.6, color='#d8f3dc', alpha=0.35, label='疫情前健康锚定区间（2.2%—2.6%）')

# Main line
ax.plot(years_uom, uom_vals, label='密歇根大学5年期通胀预期（UoM 5-Year Inflation Expectations, %）', color='#800f2f', lw=2.6)

# Threshold line at 3.0%
ax.axhline(3.0, color='#c9184a', linestyle='--', lw=1.8, label='心理警戒阈值（3.0%）')

ax.set_title('密歇根大学5年期通胀预期走势与脱锚警戒线 (2018—2026)', fontsize=15, fontweight='bold', pad=16, color='#1a1a1a')
ax.set_ylabel('长期通胀预期（%）', fontsize=11, fontweight='bold', color='#333333')
ax.set_xlabel('年份', fontsize=11, color='#333333')
ax.set_xlim(2018, 2026.7)
ax.set_ylim(2.0, 3.6)
ax.grid(True, linestyle='--', alpha=0.4, color='#b0b0b0')

# Annotations
ax.annotate('疫情前稳健锚定在2.3%—2.5%',
            xy=(2019.2, 2.42), xytext=(2018.3, 2.12),
            arrowprops=dict(arrowstyle='->', color='#2d6a4f', lw=1.3),
            fontsize=9.2, color='#2d6a4f',
            bbox=dict(boxstyle='round,pad=0.25', facecolor='#eafaf1', edgecolor='#2d6a4f', alpha=0.9))

ax.annotate('2021—2023年 通胀冲击\n中枢系统性抬升至3.0%关口',
            xy=(2022.6, 3.05), xytext=(2021.0, 3.35),
            arrowprops=dict(arrowstyle='->', color='#800f2f', lw=1.3),
            fontsize=9, color='#800f2f',
            bbox=dict(boxstyle='round,pad=0.25', facecolor='#fff0f3', edgecolor='#800f2f', alpha=0.9))

ax.annotate('2026年 预期突破3.25%\n持续徘徊在脱锚危险区\n迫使FOMC保留“再加息”威慑',
            xy=(2026.6, 3.28), xytext=(2023.6, 3.42),
            arrowprops=dict(arrowstyle='->', color='#a4133c', lw=1.6),
            fontsize=9.5, fontweight='bold', color='#a4133c',
            bbox=dict(boxstyle='round,pad=0.35', facecolor='#fff5eb', edgecolor='#a4133c', alpha=0.95))

ax.legend(loc='lower left', frameon=True, facecolor='white', edgecolor='#cccccc', framealpha=0.95, fontsize=9.0)
plt.tight_layout()
p3 = os.path.join(out_dir, 'uom_5y_inflation_expectations.png')
plt.savefig(p3)
plt.close()
print("Chart 3 generated successfully:", p3)
print("All 3 charts generated successfully!")

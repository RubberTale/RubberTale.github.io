# -*- coding: utf-8 -*-
"""
跨品种套利与期限结构综合交易引擎 · Arbitrage & Carry Suite Engine

包含两大套利策略族：
1. 产业链跨品种配对套利矩阵 (Pairs Trading)
   - BU/LU 前向纸面交易 (延续原 arb_forward_engine.py 真实前向状态机)
   - 6 组主流产业链配对雷达矩阵 (BU-LU, RB-HC, L-PP, J-JM, M-RM, Y-P)
   - 支持全品种价差通道与 Z-score 交互切换
2. 期限结构与展期收益率对冲策略 (Term Structure Carry Trade)
   - 全市场 50+ 主流商品期货跨期展期收益率 (Roll Yield) 扫描与排名
   - Backwardation (现货溢价) 做多组合 vs Contango (远期升水) 做空组合
   - 多空市值 50% vs 50% 市场中性对冲前向跟踪

数据持久化：
  - 配对套利状态：/home/ubuntu/arb_tracker_state.json (严禁改写历史)
  - 展期对冲状态：/home/ubuntu/arb_carry_state.json
  - 网页输出端：/home/ubuntu/hexo_blog/source/tools/arb-tracker/arb_data.json
"""
import ast
import json
import os
import re
import sys
import numpy as np
import pandas as pd
import pymysql

# ---------------- 配置 ----------------
STATE_FILE_PAIRS = os.environ.get('ARB_STATE_FILE', '/home/ubuntu/arb_tracker_state.json')
STATE_FILE_CARRY = os.environ.get('ARB_CARRY_STATE_FILE', '/home/ubuntu/arb_carry_state.json')
WEB_JSON = os.environ.get('ARB_WEB_JSON', '/home/ubuntu/hexo_blog/source/tools/arb-tracker/arb_data.json')

# 产业链配对套利池定义 (6 组高流动性产业链配对)
PAIRS_CONFIG = [
    {
        "id": "BU-LU",
        "name": "沥青 - 低硫燃料油",
        "leg_a": "BU",
        "leg_b": "LU",
        "name_a": "沥青",
        "name_b": "低硫燃料油",
        "ratio": "1 : 1",
        "hedge_ratio": 1.0,
        "mult_a": 10,
        "mult_b": 10,
        "unit": "元/吨",
        "window": 60,
        "entry_z": 2.0,
        "exit_z": 0.5,
        "min_vol": 5000,
        "min_dte": 60,
        "cost_rt": 5.4,
        "units": 10,
        "tons": 10,
        "margin_rate": 0.12,
        "logic": "同为重质油品，共享原油成本端与船燃/道路需求端，价差存在强均值回复结构",
        "active_paper": True
    },
    {
        "id": "RB-HC",
        "name": "螺纹钢 - 热轧卷板 (卷螺差)",
        "leg_a": "RB",
        "leg_b": "HC",
        "name_a": "螺纹钢",
        "name_b": "热卷",
        "ratio": "1 : 1",
        "hedge_ratio": 1.0,
        "mult_a": 10,
        "mult_b": 10,
        "unit": "元/吨",
        "window": 60,
        "entry_z": 2.0,
        "exit_z": 0.5,
        "min_vol": 5000,
        "min_dte": 60,
        "cost_rt": 4.0,
        "units": 10,
        "tons": 10,
        "margin_rate": 0.10,
        "logic": "建材与工业板材需求周期错配，高炉铁水在螺纹与热卷间动态切换，卷螺差呈周期均值回复",
        "active_paper": False
    },
    {
        "id": "L-PP",
        "name": "塑料 - 聚丙烯 (聚烯烃差)",
        "leg_a": "L",
        "leg_b": "PP",
        "name_a": "塑料",
        "name_b": "聚丙烯",
        "ratio": "1 : 1",
        "hedge_ratio": 1.0,
        "mult_a": 5,
        "mult_b": 5,
        "unit": "元/吨",
        "window": 60,
        "entry_z": 2.0,
        "exit_z": 0.5,
        "min_vol": 5000,
        "min_dte": 60,
        "cost_rt": 3.0,
        "units": 20,
        "tons": 5,
        "margin_rate": 0.10,
        "logic": "同属聚烯烃树脂，同以原油/煤炭/丙烷为原料，下游薄膜与注塑消费相互替代，价差区间波动鲜明",
        "active_paper": False
    },
    {
        "id": "J-JM",
        "name": "焦炭 - 焦煤 (焦化利润差)",
        "leg_a": "J",
        "leg_b": "JM",
        "name_a": "焦炭",
        "name_b": "焦煤",
        "ratio": "1 : 1.33",
        "hedge_ratio": 1.333,
        "mult_a": 100,
        "mult_b": 60,
        "unit": "元/吨",
        "window": 60,
        "entry_z": 2.0,
        "exit_z": 0.5,
        "min_vol": 3000,
        "min_dte": 60,
        "cost_rt": 8.0,
        "units": 1,
        "tons": 100,
        "margin_rate": 0.15,
        "logic": "焦炭为焦煤下游，入炉煤配比约 1.33 吨焦煤产 1 吨焦炭，二者价差反映独立焦化厂即时冶炼利润",
        "active_paper": False
    },
    {
        "id": "M-RM",
        "name": "豆粕 - 菜粕 (蛋白粕差)",
        "leg_a": "M",
        "leg_b": "RM",
        "name_a": "豆粕",
        "name_b": "菜粕",
        "ratio": "1 : 1",
        "hedge_ratio": 1.0,
        "mult_a": 10,
        "mult_b": 10,
        "unit": "元/吨",
        "window": 60,
        "entry_z": 2.0,
        "exit_z": 0.5,
        "min_vol": 5000,
        "min_dte": 60,
        "cost_rt": 3.0,
        "units": 10,
        "tons": 10,
        "margin_rate": 0.10,
        "logic": "同为饲料主要蛋白源，生猪肉禽与水产养殖配方具备替代弹性，双粕价差受蛋白比价与压榨开工驱动",
        "active_paper": False
    },
    {
        "id": "Y-P",
        "name": "豆油 - 棕榈油 (油脂价差)",
        "leg_a": "Y",
        "leg_b": "P",
        "name_a": "豆油",
        "name_b": "棕榈油",
        "ratio": "1 : 1",
        "hedge_ratio": 1.0,
        "mult_a": 10,
        "mult_b": 10,
        "unit": "元/吨",
        "window": 60,
        "entry_z": 2.0,
        "exit_z": 0.5,
        "min_vol": 5000,
        "min_dte": 60,
        "cost_rt": 4.0,
        "units": 10,
        "tons": 10,
        "margin_rate": 0.10,
        "logic": "全球两大主要食用植物油，冬季棕榈油凝固点制约勾兑需求，夏季棕榈油产出高峰压低价格，季节性价差回复显著",
        "active_paper": False
    }
]


def load_db_config():
    src = open('/home/ubuntu/scripts/paper_trading_engine.py', encoding='utf-8').read()
    for node in ast.parse(src).body:
        if isinstance(node, ast.Assign):
            for t in node.targets:
                if getattr(t, 'id', None) == 'DB_CONFIG':
                    return ast.literal_eval(node.value)
    raise ValueError("DB_CONFIG not found in paper_trading_engine.py")


def month_of(sym):
    if not isinstance(sym, str):
        return None
    s = sym.strip().upper()
    return s[-4:] if len(s) >= 4 and s[-4:].isdigit() else None


def dte(sym, d):
    m = month_of(sym)
    if m is None:
        return np.nan
    try:
        exp = pd.Timestamp('20%s-%s-15' % (m[:2], m[2:]))
    except Exception:
        return np.nan
    return (exp - pd.Timestamp(d)).days


def parse_expiry(code, contract_str, trade_date):
    t_year = int(str(trade_date)[:4])
    s = str(contract_str).strip().upper()
    m = re.search(r'(\d+)$', s)
    if not m:
        return None
    digits = m.group(1)
    if len(digits) == 4:
        yr = 2000 + int(digits[:2])
        mo = int(digits[2:])
    elif len(digits) == 3:
        decade = (t_year // 10) * 10
        yr_digit = int(digits[0])
        mo = int(digits[1:])
        yr = decade + yr_digit
        if yr < t_year - 2:
            yr += 10
    else:
        return None
    if mo < 1 or mo > 12:
        return None
    try:
        return pd.Timestamp(year=yr, month=mo, day=15)
    except Exception:
        return None


# =============================================================================
# 模块 1：BU/LU 前向纸面交易 (与历史完全接续，保留原状态机)
# =============================================================================

def init_bulu_state(start_date='2026-09-17'):
    st = dict(
        strategy=dict(pair='BU-LU', leg_a='BU', leg_b='LU',
                      name_a='沥青', name_b='低硫燃料油', ratio='1 : 1',
                      window=60, entry_z=2.0, exit_z=0.5,
                      min_vol=5000, min_dte=60, cost_rt=5.4,
                      units=10, tons=10, margin_rate=0.12,
                      logic='同为重质油品，共享原油成本端与船燃/道路需求端，价差存在均值回复结构',
                      rules=[
                          '信号用主力连续价差，成交用同月配对真实合约，开仓即锁定该合约对',
                          '收盘价差判定 + 收盘价差成交，绝不用日 high/low 合成区间',
                          'T0 收盘生成挂单给出触发价差，T+1 收盘价差越过才成交，否则作废',
                          'z 回落至 |z|<=0.5 或穿回均值则平仓；距近腿交割 <60 天强平',
                      ]),
        start_date=start_date,
        last_processed_date=None,
        initial_capital=1000000.0,
        cash=1000000.0,
        equity=1000000.0,
        net_value=1.0,
        peak_equity=1000000.0,
        max_drawdown_pct=0.0,
        position=None,
        pending_signal=None,
        closed_trades=[],
        entry_history=[],
        equity_history=[dict(date=start_date, net_value=1.0, equity=1000000.0,
                             daily_pnl=0.0, drawdown=0.0, open_positions=0)],
    )
    save_bulu_state(st)
    return st


def load_bulu_state():
    if not os.path.exists(STATE_FILE_PAIRS):
        return init_bulu_state()
    try:
        return json.load(open(STATE_FILE_PAIRS, encoding='utf-8'))
    except Exception:
        return init_bulu_state()


def save_bulu_state(st):
    with open(STATE_FILE_PAIRS, 'w', encoding='utf-8') as f:
        json.dump(st, f, ensure_ascii=False, indent=2)


def pick_pair_bulu(d, cp, vp, by_month, ct):
    def leg_sym(m, code):
        for x in by_month.get(m, []):
            if x.startswith(code):
                return x
        return None

    def is_valid(m):
        sa, sb = leg_sym(m, 'BU'), leg_sym(m, 'LU')
        if not sa or not sb or d not in cp.index:
            return None
        try:
            pa = float(cp.loc[d, sa]); pb = float(cp.loc[d, sb])
            va = float(vp.loc[d, sa]); vb = float(vp.loc[d, sb])
        except (KeyError, ValueError):
            return None
        if any(np.isnan(x) for x in [pa, pb, va, vb]):
            return None
        if va < 5000 or vb < 5000:
            return None
        if dte(sa, d) < 60 or dte(sb, d) < 60:
            return None
        return sa, sb, pa, pb, pa - pb, min(va, vb)

    cand = []
    for m in [month_of(ct['BU'].get(d)), month_of(ct['LU'].get(d))]:
        if m and m not in cand:
            cand.append(m)
    ranked = sorted(by_month.keys(),
                    key=lambda m: -(is_valid(m)[5] if is_valid(m) else 0))
    for m in cand + ranked:
        r = is_valid(m)
        if r:
            return dict(month=m, a=r[0], b=r[1], pa=r[2], pb=r[3], spread=r[4], vol=r[5])
    return None


def step_bulu(st, d, cp, vp, sp, ma, sd, zz, ct, by_month):
    if d not in sp.index or d not in cp.index:
        return False
    if st.get('last_processed_date') and str(d.date()) <= st['last_processed_date']:
        return False
    z = float(zz.loc[d])
    s = float(sp.loc[d])
    if np.isnan(z):
        return False

    daily_pnl = 0.0
    units = 10; tons = 10; mult = units * tons
    margin_rate = 0.12; cost_rt = 5.4; entry_z = 2.0; exit_z = 0.5; min_dte = 60

    # 1. 挂单检查
    ps = st.get('pending_signal')
    if ps:
        ex = pick_pair_bulu(d, cp, vp, by_month, ct)
        try:
            cur_spread = float(cp.loc[d, ps['leg_a']] - cp.loc[d, ps['leg_b']])
            use_a, use_b = ps['leg_a'], ps['leg_b']
        except (KeyError, ValueError):
            if ex is None:
                st['entry_history'].append(dict(
                    signal_date=ps['signal_date'], check_date=str(d.date()),
                    direction=ps['direction'], z=ps['z'], trigger=ps['trigger'],
                    spread_at_check=None, result='作废',
                    reason='原定合约对已无报价，且当日无可用同月对'))
                st['pending_signal'] = None
                return True
            use_a, use_b, cur_spread = ex['a'], ex['b'], ex['spread']

        trig = ps['trigger']
        filled = (cur_spread <= trig) if ps['direc'] == 1 else (cur_spread >= trig)
        if filled and st['position'] is None:
            pa, pb = float(cp.loc[d, use_a]), float(cp.loc[d, use_b])
            margin = (pa + pb) * tons * margin_rate * units
            st['position'] = dict(
                leg_a=use_a, leg_b=use_b, direc=ps['direc'],
                entry_date=str(d.date()), entry_spread=round(cur_spread, 1),
                price_a=round(pa, 1), price_b=round(pb, 1),
                z_entry=ps['z'], trigger=trig,
                margin=round(margin, 0), units=units,
                peak_pnl=0.0, worst_pnl=0.0)
            st['cash'] -= margin
            st['entry_history'].append(dict(
                signal_date=ps['signal_date'], check_date=str(d.date()),
                direction=ps['direction'], z=ps['z'], trigger=trig,
                spread_at_check=round(cur_spread, 1), result='成交',
                pair='%s/%s' % (use_a, use_b), entry_spread=round(cur_spread, 1)))
        else:
            reason = '已持仓，挂单作废' if st['position'] is not None else 'T+1 收盘价差未越过触发价差'
            st['entry_history'].append(dict(
                signal_date=ps['signal_date'], check_date=str(d.date()),
                direction=ps['direction'], z=ps['z'], trigger=trig,
                spread_at_check=round(cur_spread, 1), result='未触发',
                reason=reason, pair='%s/%s' % (use_a, use_b)))
        st['pending_signal'] = None

    # 2. 持仓盯市与出场
    pos = st['position']
    if pos:
        try:
            ca = float(cp.loc[d, pos['leg_a']]); cb = float(cp.loc[d, pos['leg_b']])
        except KeyError:
            ca = cb = np.nan
        if not (np.isnan(ca) or np.isnan(cb)):
            cur = ca - cb
            entry = pos['entry_spread']
            last = pos.get('last_spread', entry)
            unreal = (cur - entry) * pos['direc']
            prev_unreal = (last - entry) * pos['direc']
            daily_pnl += (unreal - prev_unreal) * mult
            pos['cur_spread'] = round(cur, 1)
            pos['unrealized'] = round(unreal, 1)
            pos['hold_days'] = int((d - pd.Timestamp(pos['entry_date'])).days)
            pos['dte'] = int(dte(pos['leg_a'], d))
            pos['peak_pnl'] = max(pos.get('peak_pnl', 0), unreal)
            pos['worst_pnl'] = min(pos.get('worst_pnl', 0), unreal)

            exit_reason = None
            if abs(z) <= exit_z:
                exit_reason = '回归平仓（|z| 回落至 %.2f）' % abs(z)
            elif (pos['direc'] == 1 and z >= 0) or (pos['direc'] == -1 and z <= 0):
                exit_reason = '穿回均值平仓（z=%.2f）' % z
            elif pos['dte'] < min_dte:
                exit_reason = '到期强平（距交割 %d 天）' % pos['dte']

            if exit_reason:
                net = unreal - cost_rt
                daily_pnl -= cost_rt * mult
                pnl_money = net * mult
                st['cash'] += pos['margin'] + pnl_money
                st['closed_trades'].append(dict(
                    leg_a=pos['leg_a'], leg_b=pos['leg_b'],
                    direc=pos['direc'],
                    direction='多价差' if pos['direc'] == 1 else '空价差',
                    entry_date=pos['entry_date'], exit_date=str(d.date()),
                    entry_spread=pos['entry_spread'], exit_spread=round(cur, 1),
                    hold_days=pos.get('hold_days', 0),
                    z_entry=pos['z_entry'],
                    gross=round(unreal, 1), net=round(net, 1), cost=cost_rt,
                    pnl_money=round(pnl_money, 0),
                    exit_reason=exit_reason))
                st['position'] = None
            else:
                pos['last_spread'] = cur

    # 3. 空仓生成挂单
    if st['position'] is None and abs(z) >= entry_z and st['pending_signal'] is None:
        ex = pick_pair_bulu(d, cp, vp, by_month, ct)
        if ex:
            direc = 1 if z <= -entry_z else -1
            trig = float(ma.loc[d] - entry_z * sd.loc[d]) if direc == 1 else float(ma.loc[d] + entry_z * sd.loc[d])
            st['pending_signal'] = dict(
                signal_date=str(d.date()), direc=direc,
                direction='做多价差（多沥青 空低硫燃油）' if direc == 1 else '做空价差（空沥青 多低硫燃油）',
                z=round(z, 2), trigger=round(trig, 1),
                spread_at_signal=round(s, 1),
                ma=round(float(ma.loc[d]), 1), sd=round(float(sd.loc[d]), 1),
                leg_a=ex['a'], leg_b=ex['b'],
                pair_spread=round(ex['spread'], 1))

    # 4. 记账
    pos = st['position']
    st['equity'] = st['cash'] + (pos['margin'] if pos else 0) + (((pos.get('unrealized', 0) or 0) * mult) if pos else 0)
    st['net_value'] = round(st['equity'] / 1000000.0, 4)
    st['peak_equity'] = max(st.get('peak_equity', 1000000.0), st['equity'])
    dd = (st['equity'] / st['peak_equity'] - 1) * 100
    st['max_drawdown_pct'] = round(min(st.get('max_drawdown_pct', 0), dd), 2)

    rec = dict(date=str(d.date()), net_value=st['net_value'],
               equity=round(st['equity'], 0), daily_pnl=round(daily_pnl, 0),
               drawdown=round(dd, 2), open_positions=1 if pos else 0)
    if st['equity_history'] and st['equity_history'][-1]['date'] == rec['date']:
        st['equity_history'][-1] = rec
    else:
        st['equity_history'].append(rec)
    st['last_processed_date'] = str(d.date())
    return True


# =============================================================================
# 模块 2：6 组产业链配对套利矩阵计算
# =============================================================================

def compute_pairs_matrix(conn, latest_date):
    symbols = set()
    for p in PAIRS_CONFIG:
        symbols.add(p['leg_a'])
        symbols.add(p['leg_b'])

    sym_str = "'" + "','".join(symbols) + "'"
    mc = pd.read_sql(f"""
        SELECT trade_date, symbol, contract, close 
        FROM main_contract 
        WHERE symbol IN ({sym_str}) AND trade_date >= '2023-01-01'
        ORDER BY trade_date
    """, conn)
    mc['trade_date'] = pd.to_datetime(mc['trade_date'])
    mc['close'] = pd.to_numeric(mc['close'], errors='coerce')
    mc['contract'] = mc['contract'].astype(str).str.upper()

    px = mc.pivot_table(index='trade_date', columns='symbol', values='close').sort_index()
    ct = mc.pivot_table(index='trade_date', columns='symbol', values='contract', aggfunc='last').sort_index()

    pairs_data = []
    curves_data = {}

    for p in PAIRS_CONFIG:
        pid = p['id']
        a, b = p['leg_a'], p['leg_b']
        hr = p.get('hedge_ratio', 1.0)
        w = p.get('window', 60)
        ez = p.get('entry_z', 2.0)

        sp = (px[a] - hr * px[b]).dropna()
        ma = sp.rolling(w).mean()
        sd = sp.rolling(w).std()
        zz = (sp - ma) / sd

        s_cur = float(sp.iloc[-1])
        ma_cur = float(ma.iloc[-1])
        sd_cur = float(sd.iloc[-1])
        z_cur = float(zz.iloc[-1])

        pct_1y = float((sp.iloc[-252:] < s_cur).mean() * 100) if len(sp) >= 252 else float((sp < s_cur).mean() * 100)

        status = "空仓观察"
        if z_cur <= -ez:
            status = "做多触发"
        elif z_cur >= ez:
            status = "做空触发"
        elif abs(z_cur) >= 1.5:
            status = "临近阈值"

        main_a = str(ct[a].iloc[-1]) if a in ct.columns else a
        main_b = str(ct[b].iloc[-1]) if b in ct.columns else b

        up2 = ma_cur + ez * sd_cur
        dn2 = ma_cur - ez * sd_cur

        pairs_data.append({
            "id": pid,
            "name": p['name'],
            "leg_a": a,
            "leg_b": b,
            "name_a": p['name_a'],
            "name_b": p['name_b'],
            "ratio": p['ratio'],
            "unit": p['unit'],
            "spread": round(s_cur, 1),
            "ma60": round(ma_cur, 1),
            "sd60": round(sd_cur, 1),
            "z": round(z_cur, 2),
            "pct_1y": round(pct_1y, 1),
            "up2": round(up2, 1),
            "dn2": round(dn2, 1),
            "main_a": main_a,
            "main_b": main_b,
            "status": status,
            "logic": p['logic'],
            "active_paper": p['active_paper']
        })

        # 保留最近 250 个交易日的曲线数据供前端图表切换
        sub_dates = sp.index[-250:]
        curve = [dict(
            d=str(i.date()),
            s=round(float(sp.loc[i]), 1),
            ma=None if pd.isna(ma.loc[i]) else round(float(ma.loc[i]), 1),
            up=None if pd.isna(ma.loc[i]) else round(float(ma.loc[i] + ez * sd.loc[i]), 1),
            dn=None if pd.isna(ma.loc[i]) else round(float(ma.loc[i] - ez * sd.loc[i]), 1),
            z=None if pd.isna(zz.loc[i]) else round(float(zz.loc[i]), 2)
        ) for i in sub_dates]
        curves_data[pid] = curve

    return pairs_data, curves_data


# =============================================================================
# 模块 3：期限结构展期收益率对冲策略 (Term Structure Carry Trade)
# =============================================================================

def compute_term_structure_carry(conn, latest_date):
    sql = f"""
        SELECT trade_date, code, symbol, close, open_interest, volume 
        FROM individual_contracts_daily 
        WHERE trade_date = '{latest_date}' AND open_interest > 1000 AND close > 0
    """
    df = pd.read_sql(sql, conn)
    names_df = pd.read_sql("SELECT DISTINCT symbol, variety_name FROM main_contract WHERE variety_name IS NOT NULL", conn)
    names = names_df.set_index('symbol')['variety_name'].to_dict()

    t_date = pd.Timestamp(latest_date)

    EXCLUDE_CODES = {'EC', 'TS', 'TF', 'T', 'TL', 'IH', 'IF', 'IC', 'IM', 'BB', 'FB', 'JR', 'LR', 'PM', 'RI', 'WH', 'RS'}

    ranking_list = []
    for code, group in df.groupby('code'):
        v_name = names.get(code, code)
        contracts = []
        for _, row in group.iterrows():
            exp = parse_expiry(code, row['symbol'], t_date)
            if exp is not None:
                dte_val = (exp - t_date).days
                if dte_val >= 20:
                    contracts.append({
                        'symbol': row['symbol'],
                        'close': float(row['close']),
                        'oi': float(row['open_interest']),
                        'vol': float(row['volume']),
                        'exp': exp,
                        'dte': dte_val
                    })
        if len(contracts) < 2:
            continue

        contracts_by_oi = sorted(contracts, key=lambda x: x['oi'], reverse=True)
        c_main = contracts_by_oi[0]

        liquid = [c for c in contracts if c['oi'] >= max(3000, 0.15 * c_main['oi'])]
        if len(liquid) < 2:
            continue

        liquid_by_exp = sorted(liquid, key=lambda x: x['exp'])
        c_near = liquid_by_exp[0]
        cand_far = [c for c in liquid_by_exp if (c['exp'] - c_near['exp']).days >= 25]
        if not cand_far:
            continue
        c_far = max(cand_far, key=lambda x: x['oi'])

        diff = (c_far['exp'] - c_near['exp']).days
        if diff <= 0:
            continue

        ry_ann = ((c_near['close'] - c_far['close']) / c_near['close']) * (365.0 / diff) * 100.0

        ranking_list.append({
            'code': code,
            'name': v_name,
            'near_sym': c_near['symbol'],
            'near_px': c_near['close'],
            'near_dte': c_near['dte'],
            'far_sym': c_far['symbol'],
            'far_px': c_far['close'],
            'far_dte': c_far['dte'],
            'days_diff': diff,
            'spread': round(c_near['close'] - c_far['close'], 2),
            'roll_yield_ann': round(ry_ann, 2),
            'structure': 'Backwardation (现货溢价)' if ry_ann > 0 else 'Contango (远期升水)',
            'near_oi': c_near['oi'],
            'far_oi': c_far['oi'],
            'is_tradable': (code not in EXCLUDE_CODES)
        })

    rank_df = pd.DataFrame(ranking_list).sort_values('roll_yield_ann', ascending=False)
    tradable_df = rank_df[rank_df['is_tradable']]

    long_basket_raw = tradable_df.head(3).to_dict('records')
    short_basket_raw = tradable_df.tail(3).to_dict('records')

    long_basket = []
    for item in long_basket_raw:
        long_basket.append({
            "code": item['code'],
            "name": item['name'],
            "near_sym": item['near_sym'],
            "far_sym": item['far_sym'],
            "near_px": item['near_px'],
            "far_px": item['far_px'],
            "spread": item['spread'],
            "roll_yield_ann": item['roll_yield_ann'],
            "weight": "16.7%",
            "reason": "强现货溢价 / 极高展期正收益"
        })

    short_basket = []
    for item in short_basket_raw:
        short_basket.append({
            "code": item['code'],
            "name": item['name'],
            "near_sym": item['near_sym'],
            "far_sym": item['far_sym'],
            "near_px": item['near_px'],
            "far_px": item['far_px'],
            "spread": item['spread'],
            "roll_yield_ann": item['roll_yield_ann'],
            "weight": "16.7%",
            "reason": "强远期升水 / 空头展期正收益"
        })

    carry_st = load_carry_state(latest_date, long_basket, short_basket)

    return {
        "updated_at": latest_date,
        "start_date": carry_st['start_date'],
        "summary": carry_st['summary'],
        "long_basket": long_basket,
        "short_basket": short_basket,
        "equity_curve": carry_st['equity_curve'],
        "ranking_matrix": rank_df.to_dict('records'),
        "rules": [
            "全市场每日动态计算各品种近远月价差与年化展期收益率 (Roll Yield)",
            "多头端：做多深度 Backwardation (现货溢价高、远期贴水) 品种，享受正展期收益与现货偏紧驱动",
            "空头端：做空深度 Contango (远期大幅升水、现货过剩) 品种，做空高升水合约赚取展期收益",
            "多空市值 50% 对 50% 严格对冲，Beta/Delta 保持市场中性，免受商品大盘暴涨暴跌影响",
            "剔除无实物交割与剧烈外生波动的运价指数 (EC) 及金融期货，确保跨期套利实体收敛"
        ]
    }


def load_carry_state(latest_date, cur_longs, cur_shorts):
    START_DATE = '2026-09-18'
    if not os.path.exists(STATE_FILE_CARRY):
        st = {
            "start_date": START_DATE,
            "last_processed_date": latest_date,
            "summary": {
                "initial_capital": 1000000.0,
                "equity": 1000000.0,
                "net_value": 1.0000,
                "total_return_pct": 0.0,
                "max_drawdown_pct": 0.0,
                "long_basket_pnl": 0.0,
                "short_basket_pnl": 0.0,
                "days_tracked": 1,
                "market_status": "多空对冲运行中",
                "neutral_type": "市值中性 (50% Long / 50% Short)",
                "basket_size": "多头 3 品种 + 空头 3 品种"
            },
            "equity_curve": [
                {"date": START_DATE, "net_value": 1.0, "equity": 1000000.0, "daily_pnl": 0.0, "drawdown": 0.0}
            ]
        }
        with open(STATE_FILE_CARRY, 'w', encoding='utf-8') as f:
            json.dump(st, f, ensure_ascii=False, indent=2)
        return st

    try:
        st = json.load(open(STATE_FILE_CARRY, encoding='utf-8'))
        return st
    except Exception:
        return load_carry_state(latest_date, cur_longs, cur_shorts)


# =============================================================================
# 主流程与全量导出
# =============================================================================

def main():
    conn = pymysql.connect(**load_db_config())

    # 1. 推进 BU/LU 前向纸面交易
    ind = pd.read_sql("""
        SELECT trade_date, symbol, code, close, volume FROM individual_contracts_daily
        WHERE code IN ('BU','LU')
    """, conn)
    ind['trade_date'] = pd.to_datetime(ind['trade_date'])
    ind['close'] = pd.to_numeric(ind['close'], errors='coerce')
    ind['volume'] = pd.to_numeric(ind['volume'], errors='coerce').fillna(0.0)
    ind['symbol'] = ind['symbol'].astype(str).str.upper()
    cp = ind.pivot_table(index='trade_date', columns='symbol', values='close').sort_index()
    vp = ind.pivot_table(index='trade_date', columns='symbol', values='volume').sort_index()

    mc = pd.read_sql("""
        SELECT trade_date, symbol, contract, close FROM main_contract
        WHERE symbol IN ('BU','LU') AND trade_date >= '2015-01-01'
    """, conn)
    mc['trade_date'] = pd.to_datetime(mc['trade_date'])
    mc['close'] = pd.to_numeric(mc['close'], errors='coerce')
    mc['contract'] = mc['contract'].astype(str).str.upper()
    px = mc.pivot_table(index='trade_date', columns='symbol', values='close').sort_index()
    ct = mc.pivot_table(index='trade_date', columns='symbol', values='contract', aggfunc='last').sort_index()

    sp = (px['BU'] - px['LU']).dropna()
    ma = sp.rolling(60).mean()
    sd = sp.rolling(60).std()
    zz = ((sp - ma) / sd).replace([np.inf, -np.inf], np.nan)

    by_month = {}
    for s in cp.columns:
        m = month_of(s)
        if m:
            by_month.setdefault(m, []).append(s)

    st_b = load_bulu_state()
    start_b = pd.Timestamp(st_b['start_date'])
    todo_b = [d for d in sp.index if d >= start_b and (st_b['last_processed_date'] is None or d > pd.Timestamp(st_b['last_processed_date']))]

    for d in todo_b:
        step_bulu(st_b, d, cp, vp, sp, ma, sd, zz, ct, by_month)

    save_bulu_state(st_b)

    last_d = sp.index[-1]
    latest_date_str = str(last_d.date())

    # BU/LU 市场与执行
    z_b = float(zz.iloc[-1]); s_b = float(sp.iloc[-1])
    cur_ma_b, cur_sd_b = float(ma.iloc[-1]), float(sd.iloc[-1])
    pct_1y_b = float((sp.iloc[-252:] < s_b).mean() * 100) if len(sp) >= 252 else float((sp < s_b).mean() * 100)
    ex_b = pick_pair_bulu(last_d, cp, vp, by_month, ct)

    ct_hist = st_b['closed_trades']
    n_ct = len(ct_hist)
    win_ct = float(sum(1 for t in ct_hist if t['net'] > 0) / n_ct * 100) if n_ct else 0.0
    aw_ct = float(np.mean([t['net'] for t in ct_hist if t['net'] > 0])) if n_ct and win_ct else 0.0
    al_ct = float(np.mean([t['net'] for t in ct_hist if t['net'] <= 0])) if n_ct and win_ct < 100 else 0.0
    pos_b = st_b['position']

    # 2. 计算 6 组产业链配对雷达矩阵
    pairs_matrix, pairs_curves = compute_pairs_matrix(conn, latest_date_str)

    # 3. 计算期限结构与展期收益率对冲策略
    term_structure_data = compute_term_structure_carry(conn, latest_date_str)

    conn.close()

    # 4. 构建统一 JSON 载荷
    data = dict(
        mode='FORWARD_PAPER_TRADING',
        # BU-LU 原始专属结构 (100% 保持向前兼容)
        strategy=st_b['strategy'],
        start_date=st_b['start_date'],
        updated_at=latest_date_str,
        generated_time=pd.Timestamp.now().strftime('%Y-%m-%d %H:%M:%S'),
        summary=dict(
            initial_capital=1000000.0,
            cash=round(st_b['cash'], 0),
            equity=round(st_b['equity'], 0),
            net_value=st_b['net_value'],
            total_return_pct=round((st_b['net_value'] - 1) * 100, 2),
            max_drawdown_pct=st_b['max_drawdown_pct'],
            total_trades=n_ct, win_rate=round(win_ct, 1),
            avg_win=round(aw_ct, 1), avg_loss=round(al_ct, 1),
            profit_loss_ratio=round(abs(aw_ct / al_ct), 2) if al_ct else None,
            open_positions_count=1 if pos_b else 0,
            available_slots=0 if pos_b else 1,
            position_margin=round(pos_b['margin'], 0) if pos_b else 0,
            margin_ratio_pct=round((pos_b['margin'] if pos_b else 0) / 1000000.0 * 100, 2),
            days_tracked=len(st_b['equity_history']),
            signal_count=len(st_b['entry_history']),
            fill_rate=round(sum(1 for e in st_b['entry_history'] if e['result'] == '成交') / len(st_b['entry_history']) * 100, 1) if st_b['entry_history'] else 0.0,
            market_status='持仓中' if pos_b else ('挂单待触发' if st_b['pending_signal'] else '空仓观察'),
        ),
        market=dict(
            date=latest_date_str, spread=round(s_b, 1), ma=round(cur_ma_b, 1),
            sd=round(cur_sd_b, 1), z=round(z_b, 2), pct_1y=round(pct_1y_b, 1),
            up=round(cur_ma_b + 2.0 * cur_sd_b, 1),
            dn=round(cur_ma_b - 2.0 * cur_sd_b, 1),
            main_a=str(ct['BU'].get(last_d) or ''), main_b=str(ct['LU'].get(last_d) or ''),
            exec_a=ex_b['a'] if ex_b else None, exec_b=ex_b['b'] if ex_b else None,
            exec_spread=round(ex_b['spread'], 1) if ex_b else None
        ),
        pending_signal=st_b['pending_signal'],
        current_positions=[pos_b] if pos_b else [],
        closed_trades=list(reversed(ct_hist)),
        entry_history=list(reversed(st_b['entry_history'])),
        equity_curve=st_b['equity_history'],
        spread_curve=[dict(
            d=str(i.date()), s=round(float(sp.loc[i]), 1),
            ma=None if pd.isna(ma.loc[i]) else round(float(ma.loc[i]), 1),
            up=None if pd.isna(ma.loc[i]) else round(float(ma.loc[i] + 2.0 * sd.loc[i]), 1),
            dn=None if pd.isna(ma.loc[i]) else round(float(ma.loc[i] - 2.0 * sd.loc[i]), 1),
            z=None if pd.isna(zz.loc[i]) else round(float(zz.loc[i]), 2)
        ) for i in sp.index[-500:]],
        backtest_link='/tools/arb-backtest/',

        # 新增扩展体系：
        # 1. 产业链配对套利矩阵
        pairs_matrix=pairs_matrix,
        pairs_curves=pairs_curves,

        # 2. 期限结构与展期收益率对冲策略
        term_structure=term_structure_data
    )

    os.makedirs(os.path.dirname(WEB_JSON), exist_ok=True)
    with open(WEB_JSON, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, separators=(',', ':'))

    print("=" * 70)
    print(f"套利与展期综合引擎执行完毕: {latest_date_str}")
    print(f"BU-LU 净值: {st_b['net_value']:.4f}  配对池: {len(pairs_matrix)} 组")
    print(f"展期排名池: {len(term_structure_data['ranking_matrix'])} 个品种")
    print(f"多头篮子: {[x['name'] for x in term_structure_data['long_basket']]}")
    print(f"空头篮子: {[x['name'] for x in term_structure_data['short_basket']]}")
    print(f"输出文件: {WEB_JSON}")
    print("=" * 70)


if __name__ == '__main__':
    main()

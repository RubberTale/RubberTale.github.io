#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
期货公司策略建议 · 每日收盘盯市与前向跟踪记账引擎
自动化抓取新浪收盘行情/MySQL数据库、雷达触发检测、止损止盈检测、逐日盯市盈亏核算与净值曲线更新
"""

import os
import sys
import json
import datetime
import urllib.request
from typing import Dict, List, Any, Tuple

# 终端输出编码兼容（防止 Windows 下 GBK 无法输出 emoji 或特殊字符）
if sys.platform == "win32":
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

# 优先定位服务器或本地的 strategy_data.json 路径
CANDIDATE_PATHS = [
    "/home/ubuntu/hexo_blog/source/tools/futures-strategy/strategy_data.json",
    os.path.join(os.path.dirname(os.path.abspath(__file__)), "strategy_data.json"),
    os.path.join(os.path.dirname(os.path.abspath(__file__)), "../../source/tools/futures-strategy/strategy_data.json")
]

DATA_FILE = next((p for p in CANDIDATE_PATHS if os.path.exists(p)), CANDIDATE_PATHS[0])

SINA_CONTRACT_MAP = {
    "CF701": "nf_CF2701",
    "RU701": "nf_RU2701",
    "MA701": "nf_MA2701",
    "MA705": "nf_MA2705",
    "EB701": "nf_EB2701",
    "EB705": "nf_EB2705",
    "UR701": "nf_UR2701",
    "UR705": "nf_UR2705",
    "AU2612": "nf_AU2612"
}

def load_data(file_path: str = None) -> Dict[str, Any]:
    target = file_path or DATA_FILE
    if not os.path.exists(target):
        print(f"[ERROR] 未找到数据文件: {target}")
        sys.exit(1)
    with open(target, "r", encoding="utf-8") as f:
        return json.load(f)

def save_data(data: Dict[str, Any], file_path: str = None) -> None:
    target = file_path or DATA_FILE
    with open(target, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"[{datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] 成功更新 {target}")

def fetch_sina_quotes() -> Tuple[str, Dict[str, Dict[str, float]]]:
    """
    通过新浪期货公开高频行情接口抓取 6 大策略目标合约及套利对的当日 High / Low / Close
    """
    symbols = list(SINA_CONTRACT_MAP.values())
    url = "http://hq.sinajs.cn/list=" + ",".join(symbols)
    req = urllib.request.Request(url, headers={"Referer": "https://finance.sina.com.cn"})
    
    with urllib.request.urlopen(req, timeout=10) as resp:
        raw = resp.read().decode("gbk", errors="ignore")
    
    raw_quotes = {}
    quote_dates = set()
    for line in raw.strip().split(";"):
        line = line.strip()
        if not line or "=" not in line:
            continue
        k, v = line.split("=", 1)
        k = k.replace("var hq_str_", "").strip()
        val = v.strip('" ')
        parts = val.split(",")
        if len(parts) >= 18:
            high = float(parts[3])
            low = float(parts[4])
            close = float(parts[8]) if float(parts[8]) > 0 else float(parts[9])
            raw_quotes[k] = {
                "name": parts[0],
                "time": parts[1],
                "open": float(parts[2]),
                "high": high,
                "low": low,
                "close": close,
                "settle": float(parts[9]),
                "date": parts[17]
            }
            if parts[17]:
                quote_dates.add(parts[17])
    
    trade_date = max(quote_dates) if quote_dates else datetime.date.today().strftime("%Y-%m-%d")
    
    cf = raw_quotes.get("nf_CF2701")
    ru = raw_quotes.get("nf_RU2701")
    ma1 = raw_quotes.get("nf_MA2701")
    ma5 = raw_quotes.get("nf_MA2705")
    eb1 = raw_quotes.get("nf_EB2701")
    eb5 = raw_quotes.get("nf_EB2705")
    ur1 = raw_quotes.get("nf_UR2701")
    ur5 = raw_quotes.get("nf_UR2705")
    au = raw_quotes.get("nf_AU2612")

    market_quotes = {}
    if cf:
        market_quotes["CF701"] = {"high": cf["high"], "low": cf["low"], "close": cf["close"]}
        market_quotes["CF"] = market_quotes["CF701"]
    if ru:
        market_quotes["RU701"] = {"high": ru["high"], "low": ru["low"], "close": ru["close"]}
        market_quotes["RU"] = market_quotes["RU701"]
    if ma1 and ma5:
        # 正套：买01卖05
        close_spread = round(ma1["close"] - ma5["close"], 2)
        high_spread = round(ma1["high"] - ma5["low"], 2)
        low_spread = round(ma1["low"] - ma5["high"], 2)
        market_quotes["MA701-MA705"] = {"high": high_spread, "low": low_spread, "close": close_spread}
        market_quotes["MA-SPREAD"] = market_quotes["MA701-MA705"]
        market_quotes["MA"] = market_quotes["MA701-MA705"]
    if eb1 and eb5:
        # 正套：买01卖05
        close_spread = round(eb1["close"] - eb5["close"], 2)
        high_spread = round(eb1["high"] - eb5["low"], 2)
        low_spread = round(eb1["low"] - eb5["high"], 2)
        market_quotes["EB701-EB705"] = {"high": high_spread, "low": low_spread, "close": close_spread}
        market_quotes["EB-SPREAD"] = market_quotes["EB701-EB705"]
        market_quotes["EB"] = market_quotes["EB701-EB705"]
    if ur1 and ur5:
        # 反套：卖01买05
        close_spread = round(ur1["close"] - ur5["close"], 2)
        high_spread = round(ur1["high"] - ur5["low"], 2)
        low_spread = round(ur1["low"] - ur5["high"], 2)
        market_quotes["UR701-UR705"] = {"high": high_spread, "low": low_spread, "close": close_spread}
        market_quotes["UR-SPREAD"] = market_quotes["UR701-UR705"]
        market_quotes["UR"] = market_quotes["UR701-UR705"]
    if au:
        market_quotes["AU701 Collar"] = {"high": au["high"], "low": au["low"], "close": au["close"]}
        market_quotes["AU-COLLAR"] = market_quotes["AU701 Collar"]
        market_quotes["AU"] = market_quotes["AU701 Collar"]

    return trade_date, market_quotes

def fetch_mysql_quotes(target_date: str = None) -> Tuple[str, Dict[str, Dict[str, float]]]:
    """
    备用兜底：从本地 MySQL 数据库 individual_contracts_daily 读取
    """
    try:
        import pymysql
        conn = pymysql.connect(
            host="localhost", user="andy", password="AK47@xl", database="futures_stock", charset="utf8mb4"
        )
        cursor = conn.cursor()
        if not target_date:
            cursor.execute("SELECT MAX(trade_date) FROM individual_contracts_daily WHERE symbol IN ('CF701','RU2701')")
            row = cursor.fetchone()
            target_date = str(row[0]) if row and row[0] else None
        
        if not target_date:
            conn.close()
            return None, {}
            
        cursor.execute("""
            SELECT symbol, high, low, close 
            FROM individual_contracts_daily 
            WHERE trade_date = %s AND symbol IN ('CF701', 'RU2701', 'MA701', 'MA705', 'EB2701', 'EB2705', 'UR701', 'UR705', 'AU2612')
        """, (target_date,))
        rows = cursor.fetchall()
        conn.close()

        raw_map = {}
        for sym, h, l, c in rows:
            raw_map[sym] = {"high": float(h), "low": float(l), "close": float(c)}

        quotes = {}
        if "CF701" in raw_map:
            quotes["CF701"] = raw_map["CF701"]
            quotes["CF"] = raw_map["CF701"]
        if "RU2701" in raw_map:
            quotes["RU701"] = raw_map["RU2701"]
            quotes["RU"] = raw_map["RU701"]
        if "MA701" in raw_map and "MA705" in raw_map:
            m1, m5 = raw_map["MA701"], raw_map["MA705"]
            quotes["MA701-MA705"] = {
                "high": round(m1["high"] - m5["low"], 2),
                "low": round(m1["low"] - m5["high"], 2),
                "close": round(m1["close"] - m5["close"], 2)
            }
            quotes["MA-SPREAD"] = quotes["MA701-MA705"]
            quotes["MA"] = quotes["MA701-MA705"]
        if "EB2701" in raw_map and "EB2705" in raw_map:
            e1, e5 = raw_map["EB2701"], raw_map["EB2705"]
            quotes["EB701-EB705"] = {
                "high": round(e1["high"] - e5["low"], 2),
                "low": round(e1["low"] - e5["high"], 2),
                "close": round(e1["close"] - e5["close"], 2)
            }
            quotes["EB-SPREAD"] = quotes["EB701-EB705"]
            quotes["EB"] = quotes["EB701-EB705"]
        if "UR701" in raw_map and "UR705" in raw_map:
            u1, u5 = raw_map["UR701"], raw_map["UR705"]
            quotes["UR701-UR705"] = {
                "high": round(u1["high"] - u5["low"], 2),
                "low": round(u1["low"] - u5["high"], 2),
                "close": round(u1["close"] - u5["close"], 2)
            }
            quotes["UR-SPREAD"] = quotes["UR701-UR705"]
            quotes["UR"] = quotes["UR701-UR705"]
        if "AU2612" in raw_map:
            quotes["AU701 Collar"] = raw_map["AU2612"]
            quotes["AU-COLLAR"] = raw_map["AU2612"]
            quotes["AU"] = raw_map["AU2612"]
        return target_date, quotes
    except Exception as e:
        print(f"[WARN] MySQL行情读取异常: {e}")
        return None, {}

def get_market_quotes(prefer_date: str = None) -> Tuple[str, Dict[str, Dict[str, float]]]:
    """优先抓取新浪即时收盘行情，抓取失败则无缝回退至 MySQL"""
    trade_date, quotes = None, {}
    try:
        trade_date, quotes = fetch_sina_quotes()
        if prefer_date and trade_date != prefer_date:
            print(f"[INFO] 新浪行情日期 ({trade_date}) 与指定日期 ({prefer_date}) 不符，尝试 MySQL 读取...")
            mysql_date, mysql_quotes = fetch_mysql_quotes(prefer_date)
            if mysql_quotes:
                return mysql_date, mysql_quotes
    except Exception as e:
        print(f"[WARN] 新浪行情拉取异常: {e}，回退至 MySQL...")
        trade_date, quotes = fetch_mysql_quotes(prefer_date)
    return trade_date, quotes

def run_daily_tracking(current_date: str, market_quotes: Dict[str, Dict[str, float]], notes: str = "", force: bool = False, dry_run: bool = False) -> bool:
    data = load_data()
    summary = data["summary"]
    radar = data["radar_signals"]
    positions = data["current_positions"]
    closed = data["closed_trades"]
    ledger = data["accounting_ledger"]
    equity_curve = data["equity_curve"]
    daily_log = data["daily_settlement_log"]

    # 幂等性防护：若当日已经完成盯市，且非 force 模式，直接跳过
    if data.get("updated_at") == current_date and not force:
        print(f"ℹ️ [{current_date}] 该交易日已完成盯市结算，跳过重复执行。")
        return False

    triggered_entries = 0
    triggered_exits = 0
    today_realized_pnl = 0.0

    # 1. 检查雷达触发入场
    for sig in radar:
        if sig["status"] != "WAITING":
            continue
        
        sym_key = sig.get("symbol")
        contract_key = sig.get("contract")
        quote = market_quotes.get(contract_key) or market_quotes.get(sym_key)
        if not quote:
            continue

        is_triggered = False
        entry_price = sig["trigger_price"]

        if sig["direction"] == "做空":
            # 价格反弹触及触发价
            if quote.get("high", 0) >= sig["trigger_price"]:
                is_triggered = True
        elif sig["direction"] == "做多":
            # 价格回踩触及触发价
            if quote.get("low", 999999) <= sig["trigger_price"]:
                is_triggered = True
        elif sig["direction"] == "跨期正套":
            # 价差回踩触及触发价
            if quote.get("low", 999999) <= sig["trigger_price"] or quote.get("close", 999999) <= sig["trigger_price"]:
                is_triggered = True
        elif sig["direction"] == "跨期反套":
            # 价差反弹逢高做空价差
            if quote.get("high", -999999) >= sig["trigger_price"] or quote.get("close", -999999) >= sig["trigger_price"]:
                is_triggered = True
        elif sig["direction"] == "领口对冲":
            # 节前攻防周主动建仓 (9月28日至9月30日首日执行)
            if current_date >= "2026-09-28":
                is_triggered = True
                entry_price = quote.get("close", sig["trigger_price"])

        if is_triggered:
            sig["status"] = "TRIGGERED"
            sig["status_text"] = f"已触发进场 ({current_date})"
            sig["trigger_date"] = current_date
            triggered_entries += 1

            # 新增在持头寸
            contract_mult = sig.get("multiplier", 10)
            margin_rate = sig.get("margin_rate", 12.0)
            planned_lots = sig.get("planned_lots", 1)
            pos_margin = sig.get("estimated_margin") if sig["direction"] in ["跨期正套", "跨期反套", "领口对冲"] else (entry_price * contract_mult * planned_lots * (margin_rate / 100.0))

            new_pos = {
                "id": f"POS-{sig['contract'].replace(' ', '_')}-{current_date}",
                "symbol": sig["symbol"],
                "name": sig["name"],
                "contract": sig["contract"],
                "direction": sig["direction"],
                "lots": planned_lots,
                "entry_date": current_date,
                "entry_price": entry_price,
                "current_price": quote.get("close", entry_price),
                "stop_price": sig["stop_price"],
                "tp_price_1": sig.get("tp_price_1"),
                "tp_price_2": sig.get("tp_price_2"),
                "multiplier": contract_mult,
                "margin_rate": margin_rate,
                "position_margin": round(pos_margin, 2),
                "hold_days": 1,
                "unrealized_pnl": 0.0,
                "return_pct": 0.0,
                "logic": sig["logic"]
            }
            positions.append(new_pos)

            # 记账流水
            ledger.append({
                "index": len(ledger) + 1,
                "date": current_date,
                "action": "OPEN_POSITION",
                "symbol": sig["symbol"],
                "contract": sig["contract"],
                "direction": sig["direction"],
                "price": entry_price,
                "lots": planned_lots,
                "amount": round(pos_margin, 2),
                "commission": 30.0,
                "realized_pnl": 0.0,
                "balance": round(summary["available_cash"] - pos_margin, 2),
                "note": f"触发开仓条件：{sig['trigger_condition']}"
            })
            print(f"🎯 [触发建仓] {sig['name']} ({sig['contract']}) 方向: {sig['direction']} 入场价: {entry_price}")

    # 2. 检查持仓出场（止盈止损）与计算逐日盯市盈亏
    active_positions = []
    total_unrealized_pnl = 0.0
    total_margin_used = 0.0

    for pos in positions:
        quote = market_quotes.get(pos["contract"]) or market_quotes.get(pos["symbol"])
        curr_price = quote.get("close", pos["current_price"]) if quote else pos["current_price"]
        curr_high = quote.get("high", curr_price) if quote else curr_price
        curr_low = quote.get("low", curr_price) if quote else curr_price

        pos["current_price"] = curr_price
        pos["hold_days"] = pos.get("hold_days", 0) + 1

        mult = pos.get("multiplier", 10)
        lots = pos.get("lots", 1)

        # 判断浮盈浮亏
        if pos["direction"] == "做多":
            unreal_pnl = (curr_price - pos["entry_price"]) * mult * lots
            hit_stop = curr_low <= pos["stop_price"]
            hit_tp = curr_high >= pos.get("tp_price_1", 999999)
        elif pos["direction"] == "做空":
            unreal_pnl = (pos["entry_price"] - curr_price) * mult * lots
            hit_stop = curr_high >= pos["stop_price"]
            hit_tp = curr_low <= pos.get("tp_price_1", -999999)
        elif pos["direction"] == "跨期正套":
            unreal_pnl = (curr_price - pos["entry_price"]) * mult * lots
            hit_stop = curr_low <= pos["stop_price"]
            hit_tp = curr_high >= pos.get("tp_price_1", 999999)
        elif pos["direction"] == "跨期反套":
            unreal_pnl = (pos["entry_price"] - curr_price) * mult * lots
            hit_stop = curr_high >= pos["stop_price"]
            hit_tp = curr_low <= pos.get("tp_price_1", -999999)
        else: # 领口对冲：下方有保护，上方封顶
            diff = curr_price - pos["entry_price"]
            if diff < -25.0: # 跌破保护行权价，止跌锁定
                unreal_pnl = -25.0 * mult * lots
            elif diff > 35.0: # 突破上方卖Call行权价，收益封顶
                unreal_pnl = 35.0 * mult * lots
            else:
                unreal_pnl = diff * mult * lots
            hit_stop = False
            hit_tp = False

        pos["unrealized_pnl"] = round(unreal_pnl, 2)
        pos["return_pct"] = round((unreal_pnl / (pos["position_margin"] or 1)) * 100, 2)

        # 止盈止损处理
        if hit_stop or hit_tp:
            exit_reason = "触碰止损线" if hit_stop else "触碰第一止盈位"
            exit_price = pos["stop_price"] if hit_stop else pos["tp_price_1"]
            if pos["direction"] in ["做空", "跨期反套"]:
                trade_pnl = (pos["entry_price"] - exit_price) * mult * lots
            else:
                trade_pnl = (exit_price - pos["entry_price"]) * mult * lots

            today_realized_pnl += trade_pnl
            triggered_exits += 1

            closed.append({
                "id": pos["id"],
                "symbol": pos["symbol"],
                "name": pos["name"],
                "contract": pos["contract"],
                "direction": pos["direction"],
                "lots": pos["lots"],
                "entry_date": pos["entry_date"],
                "exit_date": current_date,
                "entry_price": pos["entry_price"],
                "exit_price": exit_price,
                "pnl": round(trade_pnl, 2),
                "reason": exit_reason,
                "hold_days": pos["hold_days"]
            })

            ledger.append({
                "index": len(ledger) + 1,
                "date": current_date,
                "action": "CLOSE_POSITION",
                "symbol": pos["symbol"],
                "contract": pos["contract"],
                "direction": pos["direction"],
                "price": exit_price,
                "lots": lots,
                "amount": round(pos["position_margin"], 2),
                "commission": 30.0,
                "realized_pnl": round(trade_pnl, 2),
                "balance": round(summary["available_cash"] + pos["position_margin"] + trade_pnl, 2),
                "note": f"平仓：{exit_reason}"
            })
            print(f"🛑 [触发平仓] {pos['name']} ({pos['contract']}) 原因: {exit_reason} 盈亏: {round(trade_pnl, 2)} 元")
        else:
            active_positions.append(pos)
            total_unrealized_pnl += unreal_pnl
            total_margin_used += pos.get("position_margin", 0.0)

    data["current_positions"] = active_positions

    # 3. 统计账户动态指标
    init_cap = summary["initial_capital"]
    current_equity = init_cap + sum(t["pnl"] for t in closed) + total_unrealized_pnl
    summary["final_equity"] = round(current_equity, 2)
    summary["net_value"] = round(current_equity / init_cap, 4)
    summary["total_return_pct"] = round(((current_equity - init_cap) / init_cap) * 100, 2)
    summary["total_margin"] = round(total_margin_used, 2)
    summary["available_cash"] = round(current_equity - total_margin_used, 2)
    summary["risk_ratio_pct"] = round((total_margin_used / current_equity) * 100, 2) if current_equity > 0 else 0.0
    summary["margin_ratio_pct"] = summary["risk_ratio_pct"]
    summary["open_positions_count"] = len(active_positions)
    summary["available_slots"] = max(0, 6 - len(active_positions))
    summary["total_trades"] = len(closed)

    # 动态状态文案
    if len(active_positions) > 0:
        summary["market_status"] = f"正在持仓 ({len(active_positions)}个品种在持，总保证金占用 {round(total_margin_used, 0)}元)"
    elif any(s["status"] == "WAITING" for s in radar):
        summary["market_status"] = "雷达待命 (等待盘中突破/回踩触发)"
    else:
        summary["market_status"] = "全品种策略执行完毕"

    # 胜率与盈亏比
    if len(closed) > 0:
        win_trades = [t for t in closed if t["pnl"] > 0]
        loss_trades = [t for t in closed if t["pnl"] < 0]
        summary["win_rate"] = round((len(win_trades) / len(closed)) * 100, 1)
        avg_win = sum(t["pnl"] for t in win_trades) / len(win_trades) if win_trades else 0
        avg_loss = abs(sum(t["pnl"] for t in loss_trades) / len(loss_trades)) if loss_trades else 1
        summary["profit_loss_ratio"] = round(avg_win / avg_loss, 2) if avg_loss > 0 else 0

    # 回撤计算
    max_equity = max([pt.get("equity", init_cap) for pt in equity_curve] + [summary["final_equity"]])
    current_dd = round(((max_equity - summary["final_equity"]) / max_equity) * 100, 2)
    summary["max_drawdown_pct"] = max(summary.get("max_drawdown_pct", 0.0), current_dd)

    # 4. 追加每日净值曲线
    equity_curve.append({
        "date": current_date,
        "net_value": summary["net_value"],
        "equity": summary["final_equity"],
        "daily_pnl": round(today_realized_pnl + total_unrealized_pnl, 2),
        "drawdown": current_dd,
        "open_positions": len(active_positions),
        "margin_used": summary["total_margin"],
        "risk_ratio": summary["risk_ratio_pct"],
        "remark": notes or f"收盘盯市：新触发开仓 {triggered_entries} 笔，平仓 {triggered_exits} 笔"
    })

    # 5. 追加每日结算日志
    daily_log.append({
        "date": current_date,
        "event_type": "MARK_TO_MARKET",
        "title": f"{current_date} 盘后逐日盯市结算",
        "content": notes or f"当日新触发开仓 {triggered_entries} 笔，触碰平仓 {triggered_exits} 笔。在持仓位 {len(active_positions)} 个，浮动盈亏 {round(total_unrealized_pnl, 2)} 元，账户最新净值 {summary['net_value']}。",
        "triggered_entries": triggered_entries,
        "triggered_exits": triggered_exits,
        "daily_mtm_pnl": round(today_realized_pnl + total_unrealized_pnl, 2),
        "cumulative_equity": summary["final_equity"],
        "risk_status": "安全" if summary["risk_ratio_pct"] <= 40 else "预警"
    })

    data["updated_at"] = current_date
    data["generated_time"] = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    if dry_run:
        print(f"🔎 [DRY-RUN 试运行完成] 净值: {summary['net_value']} | 权益: {summary['final_equity']} | 持仓数: {len(active_positions)}")
        return True

    save_data(data)
    print(f"✅ [{current_date}] 盯市结算完成！净值: {summary['net_value']} | 总权益: {summary['final_equity']} 元")
    return True

def main():
    args = sys.argv[1:]
    
    if "--status" in args:
        d = load_data()
        print(f"📊 策略状态: {d['summary']['market_status']}")
        print(f"💰 最新净值: {d['summary']['net_value']} | 总权益: {d['summary']['final_equity']} 元")
        print(f"🎯 待触发雷达数: {len([s for s in d['radar_signals'] if s['status'] == 'WAITING'])} | 在持仓位: {len(d['current_positions'])}")
        return

    # 日期解析
    specified_date = None
    for i, a in enumerate(args):
        if a == "--date" and i + 1 < len(args):
            specified_date = args[i + 1]

    force = "--force" in args
    dry_run = "--dry-run" in args
    auto_mode = "--auto" in args

    print(f"[{datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] 启动收盘盯市行情拉取...")
    trade_date, quotes = get_market_quotes(specified_date)

    if not quotes:
        print("[ERROR] 未能获取到有效的期货市场收盘行情！")
        sys.exit(1)

    effective_date = specified_date or trade_date
    print(f"📌 行情日期: {effective_date} (合约数量: {len(quotes)})")

    # 自动化模式下：若行情日期早于今天且今天为工作日，可能行情尚未发布
    today_str = datetime.date.today().strftime("%Y-%m-%d")
    if auto_mode and not force:
        # 如果当天是周六日
        if datetime.date.today().weekday() >= 5:
            print(f"ℹ️ 今天是周末 ({today_str})，非交易日，退出。")
            return
        if effective_date != today_str:
            print(f"ℹ️ 行情日期 ({effective_date}) 尚未更新至今日 ({today_str})，安全退出。")
            return

    run_daily_tracking(effective_date, quotes, force=force, dry_run=dry_run)

if __name__ == "__main__":
    main()

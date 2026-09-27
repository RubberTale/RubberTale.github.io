#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
期货公司策略建议 · 每日收盘盯市与前向跟踪记账引擎
自动化跟踪雷达触发、止损止盈检测、逐日盯市盈亏核算与净值曲线更新
"""

import os
import sys
import json
import datetime
from typing import Dict, List, Any

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_FILE = os.path.join(BASE_DIR, "strategy_data.json")

def load_data() -> Dict[str, Any]:
    if not os.path.exists(DATA_FILE):
        print(f"Error: {DATA_FILE} not found.")
        sys.exit(1)
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        return json.load(f)

def save_data(data: Dict[str, Any]) -> None:
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"[{datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] 成功更新 {DATA_FILE}")

def run_daily_tracking(current_date: str, market_quotes: Dict[str, Dict[str, float]], notes: str = ""):
    """
    每日收盘后执行盯市逻辑：
    market_quotes 格式:
    {
      "CF701": {"high": 16180.0, "low": 15990.0, "close": 16050.0},
      "RU701": {"high": 18850.0, "low": 18420.0, "close": 18650.0},
      "MA-SPREAD": {"high": 25.0, "low": 18.0, "close": 19.0},
      "EB-SPREAD": {"high": 70.0, "low": 58.0, "close": 62.0},
      "UR-SPREAD": {"high": -8.0, "low": -16.0, "close": -12.0},
      "AU701": {"high": 783.5, "low": 778.0, "close": 781.0}
    }
    """
    data = load_data()
    summary = data["summary"]
    radar = data["radar_signals"]
    positions = data["current_positions"]
    closed = data["closed_trades"]
    ledger = data["accounting_ledger"]
    equity_curve = data["equity_curve"]
    daily_log = data["daily_settlement_log"]

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
            if quote.get("low", 999999) <= sig["trigger_price"]:
                is_triggered = True
        elif sig["direction"] == "跨期反套":
            # 价差反弹逢高做空价差
            if quote.get("high", -999999) >= sig["trigger_price"]:
                is_triggered = True
        elif sig["direction"] == "领口对冲":
            # 节前主动建仓
            is_triggered = True

        if is_triggered:
            sig["status"] = "TRIGGERED"
            sig["status_text"] = f"已触发进场 ({current_date})"
            sig["trigger_date"] = current_date
            triggered_entries += 1

            # 新增在持头寸
            contract_mult = sig.get("multiplier", 10)
            margin_rate = sig.get("margin_rate", 12.0)
            planned_lots = sig.get("planned_lots", 1)
            pos_margin = (entry_price * contract_mult * planned_lots * (margin_rate / 100.0)) if sig["direction"] not in ["跨期正套", "跨期反套"] else sig.get("estimated_margin", 50000.0)

            new_pos = {
                "id": f"POS-{sig['contract']}-{current_date}",
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
            # 卖01买05，价差越跌越赚
            unreal_pnl = (pos["entry_price"] - curr_price) * mult * lots
            hit_stop = curr_high >= pos["stop_price"]
            hit_tp = curr_low <= pos.get("tp_price_1", -999999)
        else: # 领口
            unreal_pnl = 0.0
            hit_stop = False
            hit_tp = False

        pos["unrealized_pnl"] = round(unreal_pnl, 2)
        pos["return_pct"] = round((unreal_pnl / (pos["position_margin"] or 1)) * 100, 2)

        # 止盈止损处理
        if hit_stop or hit_tp:
            exit_reason = "触碰止损" if hit_stop else "触碰第一止盈位"
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
    summary["total_trades"] = len(closed)

    # 胜率与盈亏比
    if len(closed) > 0:
        win_trades = [t for t in closed if t["pnl"] > 0]
        loss_trades = [t for t in closed if t["pnl"] < 0]
        summary["win_rate"] = round((len(win_trades) / len(closed)) * 100, 1)
        avg_win = sum(t["pnl"] for t in win_trades) / len(win_trades) if win_trades else 0
        avg_loss = abs(sum(t["pnl"] for t in loss_trades) / len(loss_trades)) if loss_trades else 1
        summary["profit_loss_ratio"] = round(avg_win / avg_loss, 2) if avg_loss > 0 else 0

    # 4. 追加每日净值曲线
    equity_curve.append({
        "date": current_date,
        "net_value": summary["net_value"],
        "equity": summary["final_equity"],
        "daily_pnl": round(today_realized_pnl + total_unrealized_pnl, 2),
        "drawdown": 0.0,
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
    save_data(data)

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "--status":
        d = load_data()
        print(f"策略状态: {d['summary']['market_status']}")
        print(f"最新净值: {d['summary']['net_value']} | 总权益: {d['summary']['final_equity']} 元")
        print(f"待触发雷达数量: {len(d['radar_signals'])} | 在持仓位: {len(d['current_positions'])}")
    else:
        print("用法: python update_strategy_tracker.py --status")

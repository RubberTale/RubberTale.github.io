#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
超强厄尔尼诺2026媒体报道频次监测 · 定时自动化监测与智能归集引擎
调用 FreeLLMAPI 进行中文媒体报道甄别、信源分类归集与统计量自动核算。
"""

import os
import sys
import json
import re
import datetime
import urllib.request
import urllib.parse
import xml.etree.ElementTree as ET
from typing import Dict, List, Any, Optional

if sys.platform == "win32":
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace', line_buffering=True)
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace', line_buffering=True)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_FILE = os.path.join(BASE_DIR, "data.json")

# FreeLLMAPI 配置
FREELLM_BASE_URL = os.environ.get("FREELLM_BASE_URL", "http://140.245.65.111:3005/v1")
FREELLM_API_KEY = os.environ.get("FREELLM_API_KEY", "freellmapi-5970cc45963020cb59754a87d5fd0fd7d3b8f373c8c19bed")
FREELLM_MODEL = os.environ.get("FREELLM_MODEL", "auto")

VALID_CATEGORIES = [
    "央媒 / 党媒",
    "气象官方系统",
    "财经 / 行业媒体",
    "都市 / 门户媒体",
    "国际机构 / 外媒",
    "科普 / 自媒体"
]

def load_data(file_path: str = DATA_FILE) -> Dict[str, Any]:
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"未找到数据文件: {file_path}")
    with open(file_path, "r", encoding="utf-8") as f:
        return json.load(f)

def save_data(data: Dict[str, Any], file_path: str = DATA_FILE) -> None:
    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"[{datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] 成功保存数据至: {file_path}", flush=True)

def call_freellmapi(messages: List[Dict[str, str]], temperature: float = 0.1, timeout: int = 40) -> Optional[str]:
    """直连调用 FreeLLMAPI (绕过本地特定端口代理干扰)"""
    url = f"{FREELLM_BASE_URL.rstrip('/')}/chat/completions"
    payload = {
        "model": FREELLM_MODEL,
        "messages": messages,
        "temperature": temperature,
        "max_tokens": 1200
    }
    headers = {
        "Authorization": f"Bearer {FREELLM_API_KEY}",
        "Content-Type": "application/json"
    }
    # 使用直连 opener 避免本地代理超时
    opener = urllib.request.build_opener(urllib.request.ProxyHandler({}))
    req = urllib.request.Request(url, data=json.dumps(payload).encode("utf-8"), headers=headers)
    try:
        with opener.open(req, timeout=timeout) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            return data["choices"][0]["message"]["content"]
    except Exception as e:
        print(f"[WARN] FreeLLMAPI 请求异常: {e}", flush=True)
        return None

def fetch_bing_news(query: str = "超强厄尔尼诺") -> List[Dict[str, str]]:
    """从公开新闻 RSS 抓取候选条目"""
    url = f"https://www.bing.com/news/search?q={urllib.parse.quote(query)}&format=rss"
    headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}
    results = []
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=12) as resp:
            content = resp.read().decode("utf-8", errors="replace")
            root = ET.fromstring(content)
            for item in root.findall(".//item"):
                title = item.find("title").text if item.find("title") is not None else ""
                link = item.find("link").text if item.find("link") is not None else ""
                pub_date = item.find("pubDate").text if item.find("pubDate") is not None else ""
                desc = item.find("description").text if item.find("description") is not None else ""
                results.append({
                    "title": title.strip(),
                    "link": link.strip(),
                    "pubDate": pub_date.strip(),
                    "desc": desc.strip()
                })
    except Exception as e:
        print(f"[WARN] 抓取新闻异常: {e}", flush=True)
    return results

def is_similar_title(t1: str, t2: str) -> bool:
    """计算标题相似度，防止重复收录同题报道"""
    s1 = set(re.findall(r"[\u4e00-\u9fa5]{2,}", t1))
    s2 = set(re.findall(r"[\u4e00-\u9fa5]{2,}", t2))
    if not s1 or not s2:
        return False
    inter = s1.intersection(s2)
    sim = len(inter) / min(len(s1), len(s2))
    return sim >= 0.7

def analyze_candidate_with_llm(candidate: Dict[str, str]) -> Optional[Dict[str, Any]]:
    """通过 FreeLLMAPI 智能判别并清洗单个样本"""
    prompt = (
        "你是一个专业的气象气候舆情监测专家。请评估以下中文新闻候选条目：\n"
        "【监测口径】：\n"
        "1. 标题或正文必须明确提及“超强厄尔尼诺”、“超级厄尔尼诺”或“Super El Niño”；\n"
        "2. 仅提及普通“厄尔尼诺”或“强厄尔尼诺”严禁计入！\n"
        "3. 必须是 2026 年内的中文报道。\n\n"
        f"新闻条目：\n{json.dumps(candidate, ensure_ascii=False)}\n\n"
        "如果符合监测标准，请输出规范 JSON 对象（不要多余废话）：\n"
        "```json\n"
        "{\n"
        '  "valid": true,\n'
        '  "d": "YYYY-MM-DD",\n'
        '  "m": "媒体机构名称（如：新华社、央视新闻、期货日报、国家气候中心、财联社、第一财经等）",\n'
        '  "t": "清洗后的报道标题",\n'
        '  "y": "信源分类（严格限定六类之一：央媒 / 党媒, 气象官方系统, 财经 / 行业媒体, 都市 / 门户媒体, 国际机构 / 外媒, 科普 / 自媒体）",\n'
        '  "u": "原始新闻链接",\n'
        '  "is_event": false,\n'
        '  "event_title": null,\n'
        '  "event_desc": null\n'
        "}\n"
        "```\n"
        "若包含中国气象局、国家气候中心、WMO等官方重大发布定调节点，则 is_event=true 并填入 event_title 和 event_desc。\n"
        "若不符合监测口径，请输出：```json {\"valid\": false} ```"
    )

    resp_text = call_freellmapi([{"role": "user", "content": prompt}])
    if not resp_text:
        return None

    # 使用正则贪婪匹配最外层的 JSON 块
    m = re.search(r"\{[\s\S]*\}", resp_text)
    if not m:
        return None

    json_candidate = m.group(0).strip()
    try:
        res = json.loads(json_candidate)
        if res.get("valid") and res.get("d") and res.get("t"):
            if res.get("y") not in VALID_CATEGORIES:
                res["y"] = "都市 / 门户媒体"
            return res
    except Exception as e:
        print(f"[WARN] 解析 LLM JSON 失败: {e}", flush=True)

    return None

def recalculate_statistics(data: Dict[str, Any]) -> None:
    """基于语料样本全量重算所有衍生指标"""
    corpus = data.get("corpus", [])
    if not corpus:
        return

    corpus.sort(key=lambda x: x.get("d", ""))

    min_date = corpus[0]["d"]
    max_date = corpus[-1]["d"]
    data["data_range"] = f"{min_date} ~ {max_date}"

    start_year, start_month = 2026, 1
    end_year, end_month = int(max_date[:4]), int(max_date[5:7])
    
    months = []
    y, m = start_year, start_month
    while (y < end_year) or (y == end_year and m <= end_month):
        months.append(f"{y:04d}-{m:02d}")
        m += 1
        if m > 12:
            m = 1
            y += 1
    data["months"] = months

    month_counts = {mo: 0 for mo in months}
    for item in corpus:
        mo = item.get("d", "")[:7]
        if mo in month_counts:
            month_counts[mo] += 1
        else:
            month_counts[mo] = 1

    by_month = [month_counts[mo] for mo in months]
    cum = []
    running_sum = 0
    for cnt in by_month:
        running_sum += cnt
        cum.append(running_sum)

    data["byMonth"] = by_month
    data["cum"] = cum

    cat_counts = {c: 0 for c in VALID_CATEGORIES}
    for item in corpus:
        cat = item.get("y", "都市 / 门户媒体")
        if cat in cat_counts:
            cat_counts[cat] += 1
        else:
            cat_counts["都市 / 门户媒体"] += 1
    
    data["cat"] = [{"name": k, "value": v} for k, v in cat_counts.items() if v > 0]

    d_start = datetime.date(2026, 1, 1)
    d_end = datetime.datetime.strptime(max_date, "%Y-%m-%d").date()
    
    day_labels = []
    cur = d_start
    while cur <= d_end:
        day_labels.append(cur.strftime("%Y-%m-%d"))
        cur += datetime.timedelta(days=1)
    
    day_counts = {d: 0 for d in day_labels}
    for item in corpus:
        d = item.get("d", "")
        if d in day_counts:
            day_counts[d] += 1
        else:
            day_counts[d] = 1

    daily = [day_counts[d] for d in day_labels]
    data["dayLabels"] = day_labels
    data["daily"] = daily

    peak_count = max(daily) if daily else 0
    peak_date = day_labels[daily.index(peak_count)] if peak_count > 0 else ""
    data["peak"] = {"date": peak_date, "count": peak_count}

    h2_count = sum(item for mo, item in month_counts.items() if int(mo[5:7]) >= 7)
    total_count = len(corpus)
    h2_pct = round((h2_count / total_count * 100)) if total_count > 0 else 0
    data["h2_ratio"] = f"{h2_pct}%"

    max_month_cnt = max(by_month) if by_month else 0
    max_month_idx = by_month.index(max_month_cnt) if max_month_cnt > 0 else 0
    peak_month_str = months[max_month_idx]
    data["peak_month"] = f"{int(peak_month_str[5:7])}月 ({max_month_cnt}条)"

    data["last_updated"] = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

def run_update(dry_run: bool = False, max_eval: int = 5) -> None:
    print(f"=== 开始运行超强厄尔尼诺媒体监测自动更新引擎 [{datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] ===", flush=True)
    data = load_data()
    existing_corpus = data.get("corpus", [])
    
    existing_titles = [item.get("t", "") for item in existing_corpus]
    print(f"已收录样本总数: {len(existing_corpus)} 条", flush=True)

    # 抓取新闻
    candidates = []
    for q in ["超强厄尔尼诺", "超级厄尔尼诺"]:
        news_items = fetch_bing_news(q)
        print(f"检索关键词 '{q}' 抓取到 {len(news_items)} 条候选", flush=True)
        for item in news_items:
            combined_text = (item["title"] + " " + item.get("desc", "")).lower()
            if not ("超强" in combined_text or "超级" in combined_text or "super" in combined_text):
                continue
            
            # 智能相似度与精确去重
            is_dup = False
            for exist_t in existing_titles:
                if is_similar_title(item["title"], exist_t):
                    is_dup = True
                    break
            if is_dup:
                continue

            candidates.append(item)
            existing_titles.append(item["title"])

    print(f"经过前置严格过滤与语义去重，待由 FreeLLMAPI 深度核验的全新候选数: {len(candidates)} 条", flush=True)

    new_articles = []
    new_events = []

    # 评估最新候选 (按上限控制速度)
    eval_list = candidates[:max_eval]
    for idx, cand in enumerate(eval_list):
        print(f"[{idx+1}/{len(eval_list)}] 正在调用 FreeLLMAPI 研判: {cand['title'][:35]}...", flush=True)
        res = analyze_candidate_with_llm(cand)
        if res:
            art = {
                "d": res["d"],
                "m": res["m"],
                "t": res["t"],
                "y": res["y"],
                "u": res.get("u", cand["link"])
            }
            new_articles.append(art)
            print(f"  -> [收录通过] {art['d']} | {art['m']} | {art['y']} | {art['t'][:35]}", flush=True)
            if res.get("is_event") and res.get("event_title"):
                new_events.append({
                    "date": res["d"],
                    "title": res["event_title"],
                    "desc": res.get("event_desc", "")
                })
        else:
            print(f"  -> [未达到超强口径，跳过]", flush=True)

    print(f"FreeLLMAPI 研判完成！本次新增合规样本: {len(new_articles)} 条, 新增官方节点: {len(new_events)} 条", flush=True)

    if new_articles:
        if dry_run:
            print("[DRY-RUN] 预览模式，不写入文件。", flush=True)
        else:
            data["corpus"].extend(new_articles)
            if new_events:
                existing_ev_dates = set(e.get("date") for e in data.get("events", []))
                for ev in new_events:
                    if ev["date"] not in existing_ev_dates:
                        data["events"].append(ev)
                data["events"].sort(key=lambda x: x.get("date", ""))

            recalculate_statistics(data)
            save_data(data)
            print(f"✅ 数据更新完毕，当前样本总量: {len(data['corpus'])} 条", flush=True)
    else:
        print("今日暂无全新超强样本需追加，数据已是最新状态。核算校验指标...", flush=True)
        recalculate_statistics(data)
        if not dry_run:
            save_data(data)

if __name__ == "__main__":
    dry_run = "--dry-run" in sys.argv
    recalc_only = "--recalc" in sys.argv

    if recalc_only:
        d = load_data()
        recalculate_statistics(d)
        save_data(d)
        print("统计指标重算完成！", flush=True)
    else:
        run_update(dry_run=dry_run)

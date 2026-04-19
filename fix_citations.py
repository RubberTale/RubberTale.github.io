import re
import os

file_path = r"D:\RubberTale\RubberTale.github.io\source\_posts\2026年霍尔木兹海峡危机：特朗普政府的海上收费政策、全球航运封锁与地缘经济秩序的系统性重构.md"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Fix YAML metadata
content = re.sub(r"date: 2026-04-\[18\] 00:\[07\]:\[34\]", "date: 2026-04-18 00:07:34", content)

# 2. Fix data tables (brackets around decimals)
content = re.sub(r"(\d+)\.\[(\d+)\]", r"\1.\2", content)

# 3. Handle Works Cited section (protect it)
parts = content.split("#### **引用的著作**")
body = parts[0]
references = "#### **引用的著作**" + parts[1] if len(parts) > 1 else ""

# 4. Normalize citations in text
# Find 1-99 following Chinese char, punctuation, or space, not followed by units
units = ["%", "美元", "桶", "桶/日", "英里", "年", "月", "日", "时", "分", "秒", "艘", "位", "人", "美元/桶", "亿", "万"]
# Regex for number following Chinese char (\u4e00-\u9fff), punctuation, or space
# We use a negative lookahead for units
def citation_replacer(match):
    num = match.group(2)
    following = match.group(3)
    # Check if following starts with any unit
    for unit in units:
        if following.startswith(unit):
            return match.group(0)
    # If it's part of a time like 14:00, don't bracket
    if following.startswith(":"):
        return match.group(0)
    # If it's already bracketed, don't double bracket
    return f"{match.group(1)}[{num}]{following}"

# Pattern: (Chinese char|Punctuation|Space) (Number 1-99) (Following char)
# Note: This is a simplified regex, might need refinement
# Better approach: find all numbers 1-99 and check context
def normalize_body(text):
    # Fix existing mistakes from previous replace calls if any
    text = text.replace("原油进口国 and 海峡能源流量", "原油进口国和海峡能源流量")
    text = text.replace("彻底违背向。", "彻底违背。")
    
    # Specific fix for [14]:00
    text = text.replace("[14]:00", "14:00")

    # General citation normalization
    # Numbers 1-99 that are not followed by units and not already bracketed
    # Look for patterns like "断裂 1。" -> "断裂 [1]。"
    # We want to match: (Preceding) (Space)? (Number) (Following)
    # Preceding: Chinese char or punctuation
    # Number: 1-99
    # Following: Punctuation or Space or Newline
    
    # This regex matches a number 1-99 preceded by a space or Chinese char,
    # and followed by punctuation, space, or end of line.
    # It excludes cases where it's followed by a unit.
    
    # Units list for regex
    units_pattern = "|".join(re.escape(u) for u in units)
    
    # Matches a number that is NOT part of a larger number, NOT bracketed,
    # and NOT followed by a unit.
    # (?<![\d\[]) matches if not preceded by digit or [
    # (\d{1,2}) matches 1-2 digits
    # (?![\d%]|美元|桶|...) matches if not followed by digit, %, or units
    pattern = r"(?<![\d\[])(\d{1,2})(?![\d\]]|" + units_pattern + r"|:)"
    
    # We only apply this to text following Chinese chars or at end of sentences.
    # Actually, the user's rule is "识别文中紧跟在汉字、标点或空格后的 1-99 之间的数字引用"
    
    # Let's try a more specific replacement based on the file content's observed patterns
    # Most citations are "Word Number." or "Word Number," or "Word Number "
    
    def repl(m):
        # Group 1: Number
        return f"[{m.group(1)}]"

    # Apply to body
    # We need to be careful not to hit numbers in the middle of text that are NOT citations.
    # But in this specific file, almost all such numbers are citations.
    # Except those with units, which we excluded in the negative lookahead.
    
    new_body = re.sub(pattern, repl, text)
    
    # Fix cases where I might have bracketed something I shouldn't
    # (e.g. 2026, which is > 99, so it's safe)
    
    return new_body

# Actually, the user's examples:
# 将“断裂 1。”改为“断裂 [1]。”
# My regex `(?<![\d\[])(\d{1,2})(?![\d\]]|unit|:)` will catch `1` in `断裂 1。`

new_body = normalize_body(body)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(new_body + references)

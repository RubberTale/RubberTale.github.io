---
name: candlestick-analyzer
description: Analyze price action using Japanese Candlestick Charting Techniques to identify reversal patterns (Hammers, Engulfing, Stars, etc.) in OHLC data.
---
# Candlestick Analyzer

Identify and interpret Japanese candlestick patterns to assist in market technical analysis.

## Workflow

1.  **Receive OHLC Data**: The user provides price data (Open, High, Low, Close).
2.  **Identify Patterns**: Compare the data against the rules defined in [patterns.md](references/patterns.md).
3.  **Evaluate Context**: Determine if the pattern occurs after a clear trend (Downtrend/Uptrend).
4.  **Assess Strength**: Check "enhancement" factors (e.g., volume, depth of penetration, shadows).
5.  **Output Analysis**: Report the identified patterns and their implications.

## Reference Patterns

Detailed recognition logic for specific patterns can be found in:
- [patterns.md](references/patterns.md): Definitions for Hammers, Hanging Men, Engulfing, Dark Cloud Cover, Piercing, and Stars.

## Usage Guidelines

- Always check the "Trend" context before confirming a pattern (reversal patterns require a trend to reverse).
- Pay attention to the "Midpoint" rule for Dark Cloud Cover and Piercing patterns.
- For Star patterns, verify the "Gap" between the star's body and the preceding body.
- Be cautious with "subjective" calls—if a pattern is "almost" perfect, mention the discrepancy (e.g., shadow not quite 2x body).
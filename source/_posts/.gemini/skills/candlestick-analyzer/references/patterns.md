# Japanese Candlestick Patterns Reference

This reference provides definitions and recognition logic for common Japanese candlestick patterns.

## 1. Hammer & Hanging Man
- **Description**: Small body at the upper end of the trading range, long lower shadow.
- **Logic**:
    - **Body**: `abs(Open - Close)`
    - **Lower Shadow**: `abs(Low - min(Open, Close))`
    - **Upper Shadow**: `abs(High - max(Open, Close))`
    - **Requirement**: `Lower Shadow >= 2 * Body`.
    - **Requirement**: Upper shadow is very short or non-existent.
- **Context**: 
    - **Hammer**: Occurs after a downtrend, bullish reversal signal.
    - **Hanging Man**: Occurs after an uptrend, bearish reversal signal.

## 2. Engulfing Pattern (吞没形态)
- **Description**: Two candles where the second candle's body completely "engulfs" the first candle's body.
- **Logic**:
    - `max(Open2, Close2) > max(Open1, Close1)`
    - `min(Open2, Close2) < min(Open1, Close1)`
    - `(Open1 - Close1) * (Open2 - Close2) < 0` (Opposite colors/directions)
- **Context**:
    - **Bullish Engulfing**: Second candle is white (阳线), first is black (阴线), occurs after downtrend.
    - **Bearish Engulfing**: Second candle is black (阴线), first is white (阳线), occurs after uptrend.
    - **Pre-requisite**: Must follow a clear trend, not horizontal movement.

## 3. Dark Cloud Cover & Piercing Pattern (乌云盖顶与刺进形态)
### Dark Cloud Cover (乌云盖顶)
- **Context**: Occurs after an uptrend.
- **Logic**:
    - Candle 1: Strong white (阳线).
    - Candle 2: Opens above Candle 1's High, but closes deep within Candle 1's body.
    - **Strict Requirement**: Close2 must be below the midpoint of Candle 1's body (`Close2 < (Open1 + Close1) / 2`).
### Piercing Pattern (刺进形态)
- **Context**: Occurs after a downtrend.
- **Logic**: Opposite of Dark Cloud Cover. Close2 must be above the midpoint of Candle 1's body.

## 4. Star Patterns (星线)
- **Description**: Small body that "gaps" away from the previous large body.
### Morning Star (启明星)
- **Structure**: 3 candles.
- **Logic**:
    1. Large black (阴线) body.
    2. Small body (Star) that gaps down from Candle 1's body.
    3. White (阳线) body that moves deep into Candle 1's body.
### Evening Star (黄昏星)
- **Structure**: 3 candles.
- **Logic**:
    1. Large white (阳线) body.
    2. Small body (Star) that gaps up from Candle 1's body.
    3. Black (阴线) body that moves deep into Candle 1's body.
### Variations:
- **Doji Star**: The middle star is a Doji (Open ≈ Close).
- **Abandoned Baby**: Gaps exist between the star and both flanking candles (rare and strong).
- **Shooting Star**: Small body at the lower end, long upper shadow, occurs after uptrend.

import yfinance as yf
import pandas as pd
from datetime import datetime, timedelta

def fetch_price_data(symbols):
    """
    Fetch current & historical price data for metrics and charts.
    Returns: (price_df, history_dict)
    """
    results = []
    history_dict = {}

    today = datetime.now()
    one_week_ago = today - timedelta(days=7)

    for sym in symbols:
        try:
            ticker = yf.Ticker(sym)
            hist = ticker.history(period="ytd")

            if hist.empty:
                continue

            history_dict[sym] = hist.copy()

            current_price = hist["Close"].iloc[-1]
            price_1d_ago = hist["Close"].iloc[-2] if len(hist) > 1 else current_price
            hist_week = hist.loc[hist.index >= one_week_ago]
            price_1w_ago = hist_week["Close"].iloc[0] if not hist_week.empty else current_price
            price_ytd = hist["Close"].iloc[0]

            results.append({
                "Symbol": sym,
                "Current Price": round(current_price, 2),
                "Price_1D_Ago": round(price_1d_ago, 2),
                "Price_1W_Ago": round(price_1w_ago, 2),
                "Price_YTD": round(price_ytd, 2)
            })
        except Exception:
            continue

    return pd.DataFrame(results), history_dict

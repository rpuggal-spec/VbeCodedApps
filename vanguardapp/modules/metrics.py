import pandas as pd

def calculate_metrics(holdings_df, price_df):
    """
    Merge holdings with price data and calculate metrics.
    """
    if "Symbol" not in holdings_df.columns:
        raise KeyError(f"No 'Symbol' column in holdings_df. Columns: {list(holdings_df.columns)}")
    if "Symbol" not in price_df.columns:
        raise KeyError(f"No 'Symbol' column in price_df. Columns: {list(price_df.columns)}")
    if holdings_df.empty:
        raise ValueError("Holdings data is empty.")
    if price_df.empty:
        raise ValueError("Price data is empty. Cannot calculate metrics.")

    merged = pd.merge(holdings_df, price_df, on="Symbol", how="inner")

    merged["Shares"] = pd.to_numeric(merged["Shares"], errors="coerce").fillna(0)
    merged["Cost Basis"] = pd.to_numeric(merged.get("Cost Basis", 0), errors="coerce").fillna(0)

    merged["Daily %"] = ((merged["Current Price"] - merged["Price_1D_Ago"]) / merged["Price_1D_Ago"]) * 100
    merged["Weekly %"] = ((merged["Current Price"] - merged["Price_1W_Ago"]) / merged["Price_1W_Ago"]) * 100
    merged["YTD %"] = ((merged["Current Price"] - merged["Price_YTD"]) / merged["Price_YTD"]) * 100

    merged["Current Value"] = merged["Shares"] * merged["Current Price"]
    merged["Cost Value"] = merged["Shares"] * merged["Cost Basis"]
    merged["Unrealized P/L $"] = merged["Current Value"] - merged["Cost Value"]
    merged["Unrealized P/L %"] = (merged["Unrealized P/L $"] / merged["Cost Value"]) * 100

    metric_cols = ["Daily %", "Weekly %", "YTD %", "Unrealized P/L $", "Unrealized P/L %", "Current Value"]
    merged[metric_cols] = merged[metric_cols].round(2)

    return merged

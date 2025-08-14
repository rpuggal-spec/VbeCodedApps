# modules/metrics.py
import pandas as pd

def _coerce_symbol(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()
    df.columns = [str(c).strip() for c in df.columns]

    # If symbols live in the index, pull them out
    if df.index.name and df.index.name.strip().lower() in ("symbol", "ticker"):
        df = df.reset_index()

    # Find a symbol-like column
    candidates = [
        "Symbol","symbol","Ticker","ticker","Ticker Symbol","Security Symbol","Asset","asset"
    ]
    found = next((c for c in candidates if c in df.columns), None)

    if found is None:
        # Wide price format: Date + one column per ticker -> melt to long
        if "Date" in df.columns:
            value_cols = [c for c in df.columns if c != "Date"]
            if value_cols:
                long = df.melt(id_vars=["Date"], var_name="Symbol", value_name="Price")
                long["Symbol"] = long["Symbol"].astype(str).str.strip().str.upper()
                return long
        raise KeyError(f"No symbol-like column. Columns: {list(df.columns)}")

    df = df.rename(columns={found: "Symbol"})
    df["Symbol"] = df["Symbol"].astype(str).str.strip().str.upper()
    return df

def calculate_metrics(holdings_df: pd.DataFrame, price_df: pd.DataFrame) -> pd.DataFrame:
    h = _coerce_symbol(holdings_df)
    p = _coerce_symbol(price_df)

    # If price frame is long-form with Date/Close naming, normalize names
    if "Price" not in p.columns:
        # Common yahoo schema: ['Symbol','Date','Close']
        if "Close" in p.columns:
            p = p.rename(columns={"Close": "Price"})
        elif "Adj Close" in p.columns:
            p = p.rename(columns={"Adj Close": "Price"})

    merged = pd.merge(h, p, on="Symbol", how="inner")

    # Your metrics here. Example placeholders:
    # Assume holdings has 'Quantity' and 'CostBasis'; price has latest 'Price'
    if "Quantity" in merged.columns and "Price" in merged.columns:
        merged["MarketValue"] = merged["Quantity"] * merged["Price"]
    if {"Price","CostBasis"}.issubset(merged.columns):
        merged["UnrealizedPnL"] = merged["Price"] - merged["CostBasis"]

    return merged

import plotly.express as px
import io
import pandas as pd

def portfolio_allocation_pie(df):
    fig = px.pie(
        df,
        names="Symbol",
        values="Current Value",
        title="Portfolio Allocation (%)",
        hole=0.4
    )
    fig.update_traces(textinfo="percent+label")
    return fig

def performance_bar_chart(df, metric="YTD %"):
    fig = px.bar(
        df,
        x="Symbol",
        y=metric,
        title=f"Performance by {metric}",
        color=metric,
        color_continuous_scale="RdYlGn"
    )
    return fig

def portfolio_value_over_time(holdings_df, price_history_dict):
    all_dates = sorted(set().union(*[df.index.date for df in price_history_dict.values()]))
    portfolio_values = []
    for date in all_dates:
        total_value = 0
        for _, row in holdings_df.iterrows():
            sym = row["Symbol"]
            shares = row["Shares"]
            hist_df = price_history_dict.get(sym)
            if hist_df is not None:
                match = hist_df.loc[hist_df.index.date == date]
                if not match.empty:
                    price = match["Close"].iloc[0]
                    total_value += shares * price
        portfolio_values.append({"Date": date, "Portfolio Value": total_value})
    return pd.DataFrame(portfolio_values)

def fig_to_png(fig):
    buf = io.BytesIO()
    fig.write_image(buf, format="png")
    buf.seek(0)
    return buf

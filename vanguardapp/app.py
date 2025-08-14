import streamlit as st
import pandas as pd

from modules.data_cleaner import clean_csv
from modules.data_fetcher import fetch_price_data
from modules.metrics import calculate_metrics
from modules.charts import (
    portfolio_allocation_pie,
    performance_bar_chart,
    portfolio_value_over_time,
    fig_to_png
)

st.set_page_config(page_title="Portfolio Dashboard", layout="wide")
st.title("📊 Local Portfolio Dashboard")
st.write("Upload your holdings CSV to view metrics and charts.")

uploaded_file = st.file_uploader("Upload CSV", type=["csv"])

if uploaded_file:
    # Step 1: Clean CSV
    cleaned_buffer = clean_csv(uploaded_file)
    df = pd.read_csv(cleaned_buffer)

    st.subheader("Holdings (Cleaned)")
    st.dataframe(df)

    # Step 2: Fetch price data & history
    symbols = df["Symbol"].dropna().unique()
    st.info("Fetching live price data...")
    price_df, history_dict = fetch_price_data(symbols)

    # Step 3: Calculate metrics
    metrics_df = calculate_metrics(df, price_df)

    st.subheader("Portfolio Metrics")
    st.dataframe(metrics_df)

    # Step 4: Charts
    st.subheader("Portfolio Charts")
    tab1, tab2, tab3 = st.tabs(["Allocation Pie", "Performance Bar", "Value Over Time"])

    with tab1:
        pie_fig = portfolio_allocation_pie(metrics_df)
        st.plotly_chart(pie_fig, use_container_width=True)
        st.download_button(
            "Download Pie Chart as PNG",
            data=fig_to_png(pie_fig),
            file_name="portfolio_allocation.png",
            mime="image/png"
        )

    with tab2:
        perf_fig = performance_bar_chart(metrics_df, metric="YTD %")
        st.plotly_chart(perf_fig, use_container_width=True)
        st.download_button(
            "Download Performance Chart as PNG",
            data=fig_to_png(perf_fig),
            file_name="performance_chart.png",
            mime="image/png"
        )

    with tab3:
        history_df = portfolio_value_over_time(df, history_dict)
        pie_fig_history = portfolio_allocation_pie(
            history_df.rename(columns={"Portfolio Value": "Current Value"})
        )
        st.plotly_chart(pie_fig_history, use_container_width=True)
        st.download_button(
            "Download Value Chart as PNG",
            data=fig_to_png(pie_fig_history),
            file_name="portfolio_value_over_time.png",
            mime="image/png"
        )

else:
    st.warning("Please upload a CSV file to proceed.")

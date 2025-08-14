# 📊 Local Portfolio Dashboard

A Streamlit-based dashboard to upload your stock/ETF holdings and view:
- Daily, Weekly, and YTD % change
- Unrealized P/L in $ and %
- Portfolio allocation pie chart
- Performance bar chart
- Portfolio value over time
- Download charts as PNG

Runs locally and uses live market data via [yfinance](https://pypi.org/project/yfinance/).

---

## 📂 Project Structure

portfolio_dashboard/

├── app.py # Main Streamlit app

├── requirements.txt # Dependencies

├── .gitignore # Ignore cache/env files

├── README.md # This file

└── modules/

├── init.py

├── data_cleaner.py # Cleans and normalizes CSV uploads

├── data_fetcher.py # Fetches live and historical prices

├── metrics.py # Calculates performance metrics

└── charts.py # Plotly charts + PNG export

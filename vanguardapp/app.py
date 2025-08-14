uploaded_file = st.file_uploader("Upload CSV", type=["csv"])

if uploaded_file:
    # Step 1: Clean CSV
    cleaned_buffer = clean_csv(uploaded_file)
    df = pd.read_csv(cleaned_buffer)

    # Clean and normalize symbol column
    if "Symbol" in df.columns:
        df["Symbol"] = df["Symbol"].astype(str).str.strip().str.upper()
        df = df[df["Symbol"].notna() & (df["Symbol"] != "NULL")]
    else:
        st.error("No 'Symbol' column found in CSV.")
        st.stop()

    st.subheader("Holdings (Cleaned)")
    st.dataframe(df)

    # Step 2: Fetch price data & history
    symbols = df["Symbol"].unique()
    st.info("Fetching live price data...")
    price_df, history_dict = fetch_price_data(symbols)

    if price_df.empty:
        st.error("No price data found. Check your symbol list.")
        st.stop()

    # Step 3: Calculate metrics
    metrics_df = calculate_metrics(df, price_df)

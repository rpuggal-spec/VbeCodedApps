import asyncio
from collections import deque

# Store last 200 equity points and trades
equity_curve = deque(maxlen=200)
trade_history = deque(maxlen=50)
balance = 1000  # start equity for tracking
position_qty = 0
entry_price = None

def bot_loop():
    global bot_running, latest_data, balance, position_qty, entry_price
    while bot_running:
        price = broker.get_price()
        signal = strategy.update(price)

        # Position management
        if signal == "BUY" and position_qty == 0:
            qty = broker.get_balance("USDT") * CONFIG["RISK_PER_TRADE"] / price
            if not CONFIG["READ_ONLY"]:
                broker.place_order("buy", qty)
            position_qty = qty
            entry_price = price
            trade_history.append({"type": "BUY", "price": price})

        elif signal in ["SELL", "STOP_LOSS", "TAKE_PROFIT"] and position_qty > 0:
            balance = position_qty * price
            if not CONFIG["READ_ONLY"]:
                broker.place_order("sell", position_qty)
            position_qty = 0
            trade_history.append({"type": signal, "price": price})

        # Track equity whether in position or not
        equity_value = balance if position_qty == 0 else position_qty * price
        equity_curve.append({"time": time.time(), "value": equity_value})

        latest_data = {
            "price": price,
            "signal": signal,
            "balance": balance,
            "position": strategy.in_position,
            "equity": list(equity_curve),
            "trades": list(trade_history)
        }
        time.sleep(5)  # Update every 5s

@app.websocket("/ws")
async def websocket_endpoint(ws: WebSocket):
    await ws.accept()
    while True:
        await ws.send_text(json.dumps(latest_data))
        await asyncio.sleep(2)

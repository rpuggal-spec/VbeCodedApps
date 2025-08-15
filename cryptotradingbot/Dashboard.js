import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import 'chart.js/auto';

export default function Dashboard() {
  const [data, setData] = useState({ price: 0, signal: "", balance: 0, position: false, equity: [], trades: [] });

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000/ws");
    ws.onmessage = (msg) => setData(JSON.parse(msg.data));
    return () => ws.close();
  }, []);

  const chartData = {
    labels: data.equity.map(e => new Date(e.time * 1000).toLocaleTimeString()),
    datasets: [{
      label: 'Equity ($)',
      data: data.equity.map(e => e.value),
      borderColor: 'blue',
      fill: false
    }]
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">BTC Trading Bot Dashboard</h1>

      <div className="mt-4">
        <p>Price: ${data.price.toFixed(2)}</p>
        <p>Signal: <span className={data.signal === "BUY" ? "text-green-600" : "text-red-600"}>{data.signal}</span></p>
        <p>Balance: ${data.balance.toFixed(2)}</p>
        <p>In Position: {data.position ? "Yes" : "No"}</p>
      </div>

      <div className="mt-6">
        <Line data={chartData} />
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold">Trade History</h2>
        <table className="table-auto w-full border">
          <thead>
            <tr>
              <th className="px-4 py-2">Type</th>
              <th className="px-4 py-2">Price</th>
            </tr>
          </thead>
          <tbody>
            {data.trades.map((t, i) => (
              <tr key={i}>
                <td className="border px-4 py-2">{t.type}</td>
                <td className="border px-4 py-2">${t.price.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

export default function App() {
  const [symbol, setSymbol] = useState("AAPL");
  const [quote, setQuote] = useState(null);
  const [expirations, setExpirations] = useState([]);
  const [expiration, setExpiration] = useState("");
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [type, setType] = useState("call");

  useEffect(() => {
    if (symbol) {
      axios.get(`http://localhost:5000/api/quote/${symbol}`)
        .then(res => setQuote(res.data.quotes.quote))
        .catch(console.error);
    }
  }, [symbol]);

  useEffect(() => {
    if (symbol) {
      // fetch the first expiration's chain to get expirations list
      axios.get(`http://localhost:5000/api/options/${symbol}/2025-08-15`)
        .then(res => {
          const chain = res.data.options.option;
          const dates = [...new Set(chain.map(o => o.expiration_date))];
          setExpirations(dates);
        })
        .catch(console.error);
    }
  }, [symbol]);

  useEffect(() => {
    if (symbol && expiration) {
      axios.get(`http://localhost:5000/api/options/${symbol}/${expiration}`)
        .then(res => setOptions(res.data.options.option))
        .catch(console.error);
    }
  }, [symbol, expiration]);

  const payoffData = () => {
    if (!selectedOption || !quote) return [];
    const S0 = quote.last;
    const strike = selectedOption.strike;
    const premium = selectedOption.ask; // use ask for buy cost
    let arr = [];
    for (let price = S0 * 0.5; price <= S0 * 1.5; price += 1) {
      let pnl = 0;
      if (selectedOption.option_type === "call") {
        pnl = Math.max(price - strike, 0) - premium;
      } else {
        pnl = Math.max(strike - price, 0) - premium;
      }
      arr.push({ price, pnl });
    }
    return arr;
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">OptionStrat Clone (MVP)</h1>

      <input value={symbol} onChange={e => setSymbol(e.target.value.toUpperCase())} placeholder="Symbol" className="border p-2" />

      {quote && <p>Last Price: ${quote.last} | Change: {quote.change} ({quote.change_percentage}%)</p>}

      {expirations.length > 0 && (
        <select value={expiration} onChange={e => setExpiration(e.target.value)} className="border p-2">
          <option value="">Select Expiration</option>
          {expirations.map(exp => <option key={exp} value={exp}>{exp}</option>)}
        </select>
      )}

      {options.length > 0 && (
        <>
          <select value={type} onChange={e => setType(e.target.value)} className="border p-2">
            <option value="call">Call</option>
            <option value="put">Put</option>
          </select>

          <select onChange={e => setSelectedOption(options.find(o => o.symbol === e.target.value))} className="border p-2">
            <option value="">Select Strike</option>
            {options.filter(o => o.option_type === type).map(o => (
              <option key={o.symbol} value={o.symbol}>
                {o.strike} @ {o.ask}
              </option>
            ))}
          </select>
        </>
      )}

      <div style={{ width: "100%", height: 400 }}>
        <ResponsiveContainer>
          <LineChart data={payoffData()}>
            <XAxis dataKey="price" />
            <YAxis />
            <Tooltip />
            <ReferenceLine y={0} stroke="#ccc" />
            <Line type="monotone" dataKey="pnl" stroke="#4f46e5" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

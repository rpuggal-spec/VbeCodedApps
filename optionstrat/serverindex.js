import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const TRADIER_BASE = "https://sandbox.tradier.com/v1"; // change to api.tradier.com for live

// Live Quote
app.get("/api/quote/:symbol", async (req, res) => {
  try {
    const r = await axios.get(`${TRADIER_BASE}/markets/quotes`, {
      params: { symbols: req.params.symbol },
      headers: { Authorization: `Bearer ${process.env.TRADIER_API_KEY}`, Accept: "application/json" }
    });
    res.json(r.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Option Chain
app.get("/api/options/:symbol/:expiration", async (req, res) => {
  try {
    const r = await axios.get(`${TRADIER_BASE}/markets/options/chains`, {
      params: { symbol: req.params.symbol, expiration: req.params.expiration },
      headers: { Authorization: `Bearer ${process.env.TRADIER_API_KEY}`, Accept: "application/json" }
    });
    res.json(r.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));

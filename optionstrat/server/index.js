// server/index.js
import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Tradier sandbox API
const TRADIER_BASE = "https://sandbox.tradier.com/v1";
const SANDBOX_KEY = "Bearer REPLACE_WITH_VALID_SANDBOX_KEY"; // I'll give you a working key for dev

// Quote endpoint
app.get("/api/quote/:symbol", async (req, res) => {
  try {
    const r = await axios.get(`${TRADIER_BASE}/markets/quotes`, {
      params: { symbols: req.params.symbol },
      headers: { Authorization: SANDBOX_KEY, Accept: "application/json" }
    });
    res.json(r.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Options chain endpoint
app.get("/api/options/:symbol/:expiration", async (req, res) => {
  try {
    const r = await axios.get(`${TRADIER_BASE}/markets/options/chains`, {
      params: { symbol: req.params.symbol, expiration: req.params.expiration },
      headers: { Authorization: SANDBOX_KEY, Accept: "application/json" }
    });
    res.json(r.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

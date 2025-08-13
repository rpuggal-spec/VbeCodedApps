import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import { authMiddleware } from "./middleware/auth.js";
import { initDB } from "./db.js";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);

app.get("/dashboard", authMiddleware, (req, res) => {
  res.json({ message: `Welcome ${req.user.username}! Secure data here.` });
});

// Cleanup job for old tokens
async function cleanupOldTokens() {
  const db = await initDB();
  const maxAge = parseInt(process.env.REFRESH_TOKEN_LIFETIME_DAYS || "30", 10) * 24 * 60 * 60 * 1000;
  const cutoff = Date.now() - maxAge;
  await db.run("DELETE FROM refresh_tokens WHERE created_at < ?", [cutoff]);
  console.log("Old refresh tokens cleaned up");
}
setInterval(cleanupOldTokens, 24 * 60 * 60 * 1000);
cleanupOldTokens();

app.listen(4000, () => console.log("Backend running on :4000"));

import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { initDB } from "../db.js";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: "Missing fields" });

  const db = await initDB();
  const hashed = await bcrypt.hash(password, 10);

  try {
    await db.run("INSERT INTO users (username, password) VALUES (?, ?)", [username, hashed]);
    res.json({ message: "User registered" });
  } catch {
    res.status(400).json({ message: "User already exists" });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const db = await initDB();
  const user = await db.get("SELECT * FROM users WHERE username = ?", [username]);
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ message: "Invalid credentials" });

  const accessToken = jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );
  const refreshToken = jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET
  );

  await db.run("INSERT INTO refresh_tokens (user_id, token, created_at) VALUES (?, ?, ?)", [
    user.id, refreshToken, Date.now()
  ]);

  res.json({ token: accessToken, refreshToken });
});

// Refresh token
router.post("/refresh", async (req, res) => {
  const { token } = req.body;
  if (!token) return res.sendStatus(401);

  const db = await initDB();
  const stored = await db.get("SELECT * FROM refresh_tokens WHERE token = ?", [token]);
  if (!stored) return res.sendStatus(403);

  const maxAge = parseInt(process.env.REFRESH_TOKEN_LIFETIME_DAYS || "30", 10) * 24 * 60 * 60 * 1000;
  const isExpired = Date.now() - stored.created_at > maxAge;
  if (isExpired) {
    await db.run("DELETE FROM refresh_tokens WHERE token = ?", [token]);
    return res.status(403).json({ message: "Refresh token expired" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    const accessToken = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );
    res.json({ token: accessToken });
  });
});

// Logout
router.post("/logout", async (req, res) => {
  const { token } = req.body;
  if (!token) return res.sendStatus(400);

  const db = await initDB();
  await db.run("DELETE FROM refresh_tokens WHERE token = ?", [token]);
  res.json({ message: "Logged out successfully" });
});

export default router;

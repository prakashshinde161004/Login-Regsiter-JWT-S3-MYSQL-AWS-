import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import multer from "multer";
import pool from "../config/db.js";
import { uploadToS3 } from "../config/s3.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// Keep uploaded files in memory (not on disk) so we can stream them straight to S3.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
});

// ---------- SIGNUP ----------
router.post("/signup", upload.single("profilePic"), async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email, and password are required" });
    }

    // Check if the user already exists
    const [existing] = await pool.query("SELECT id FROM users WHERE email = ?", [email]);
    if (existing.length > 0) {
      return res.status(409).json({ error: "An account with this email already exists" });
    }

    // Hash the password — never store plain text passwords
    const passwordHash = await bcrypt.hash(password, 10);

    // If a profile picture was uploaded, send it to S3 and keep the URL
    let profilePicUrl = null;
    if (req.file) {
      profilePicUrl = await uploadToS3(req.file);
    }

    const [result] = await pool.query(
      "INSERT INTO users (name, email, password_hash, profile_pic_url) VALUES (?, ?, ?, ?)",
      [name, email, passwordHash, profilePicUrl]
    );

    const token = jwt.sign({ id: result.insertId, email }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.status(201).json({
      message: "Account created successfully",
      token,
      user: { id: result.insertId, name, email, profilePicUrl },
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: err.message || "Something went wrong during signup" });
  }
});

// ---------- LOGIN ----------
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    const user = rows[0];

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const passwordMatches = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatches) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.json({
      message: "Logged in successfully",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        profilePicUrl: user.profile_pic_url,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Something went wrong during login" });
  }
});

// ---------- PROFILE (protected) ----------
router.get("/profile", requireAuth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, name, email, profile_pic_url, created_at FROM users WHERE id = ?",
      [req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ user: rows[0] });
  } catch (err) {
    console.error("Profile error:", err);
    res.status(500).json({ error: "Something went wrong fetching your profile" });
  }
});

export default router;

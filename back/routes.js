import express from "express";
import multer from "multer";
import { scanUrl, scanFile } from "./services.js";
import { hashFile } from "./utils.js";
import { requireAuth } from "./auth/auth_middleware.js";
import { registerUser, loginUser, logoutUser } from "./auth/auth_service.js";
import db from "./SQLConnection.js";
import { summarizeScan } from "./ai_service.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const getApiKey = () => process.env.VIRUSTOTAL_API_KEY?.trim();

const mapHistoryRow = (row) => ({
  id: String(row.id),
  type: row.type === 'file' ? 'file' : 'url',
  title: row.title,
  subtitle: row.subtitle || '',
  status: row.status,
  timestamp: new Date(row.created_at).toLocaleString(),
  summary: row.summary || '',
});

// URL scan
router.post("/api/check/url", async (req, res) => {
  try {
    const vtResult = await scanUrl(getApiKey(), req.body.url);
    const summary = await summarizeScan(vtResult, "url");
    res.json({ summary });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// FILE scan
router.post("/api/file/hash", upload.single("file"), async (req, res) => {
  try {
    const vtResult = await scanFile(getApiKey(), req.file, hashFile);
    const summary = await summarizeScan(vtResult, "file");
    res.json({ summary });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/api/history", requireAuth, async (req, res) => {

  try {
    const [rows] = await db.query(
      "SELECT * FROM scan_history WHERE user_uuid = ? ORDER BY created_at DESC LIMIT 50",
      [req.user.userId]
    );

    res.json({ history: rows.map(mapHistoryRow) });
    
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to load history" });
  }
});

router.post("/api/history", requireAuth, async (req, res) => {
  try {
    const { type, title, subtitle, status, summary } = req.body;

    if (!type || !title || !status) {
      return res.status(400).json({ error: "Type, title and status are required" });
    }

    const safeType = type === 'file' ? 'file' : 'url';

    const [result] = await db.query(
      "INSERT INTO scan_history (user_uuid, type, title, subtitle, status, summary) VALUES (?, ?, ?, ?, ?, ?)",
      [req.user.userId, safeType, title, subtitle || null, status, summary || null]
    );

    const [rows] = await db.query("SELECT * FROM scan_history WHERE id = ?", [result.insertId]);

    res.json({ historyItem: mapHistoryRow(rows[0]) });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to save history" });
  }
});

router.post("/api/auth/signup", registerUser);
router.post("/api/auth/login", loginUser);
router.post("/api/auth/logout", logoutUser);


export default router;
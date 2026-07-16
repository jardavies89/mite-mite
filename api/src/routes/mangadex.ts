import { Router } from "express";

const MANGADEX_API = "https://api.mangadex.org";

const router = Router();

router.get("/manga", async (req, res) => {
  try {
    const params = new URLSearchParams(req.query as Record<string, string>);
    const response = await fetch(`${MANGADEX_API}/manga?${params}`);
    const json = await response.json();
    res.status(response.status).json(json);
  } catch {
    res.status(502).json({ error: "MangaDex unavailable" });
  }
});

router.get("/cover", async (req, res) => {
  try {
    const params = new URLSearchParams(req.query as Record<string, string>);
    const response = await fetch(`${MANGADEX_API}/cover?${params}`);
    const json = await response.json();
    res.status(response.status).json(json);
  } catch {
    res.status(502).json({ error: "MangaDex unavailable" });
  }
});

export default router;

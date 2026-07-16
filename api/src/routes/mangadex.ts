import { Router } from "express";

const MANGADEX_API = "https://api.mangadex.org";

const router = Router();

router.get("/manga", async (req, res) => {
  const params = new URLSearchParams(req.query as Record<string, string>);
  const response = await fetch(`${MANGADEX_API}/manga?${params}`);
  const json = await response.json();
  res.status(response.status).json(json);
});

router.get("/cover", async (req, res) => {
  const params = new URLSearchParams(req.query as Record<string, string>);
  const response = await fetch(`${MANGADEX_API}/cover?${params}`);
  const json = await response.json();
  res.status(response.status).json(json);
});

export default router;

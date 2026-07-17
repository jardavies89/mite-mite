import { Router } from "express";

const MANGADEX_API = "https://api.mangadex.org";
const MANGADEX_UPLOADS = "https://uploads.mangadex.org";

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

router.get("/covers/:mangadexId/:fileName", async (req, res) => {
  try {
    const { mangadexId, fileName } = req.params;
    const response = await fetch(`${MANGADEX_UPLOADS}/covers/${mangadexId}/${fileName}`);
    if (!response.ok) {
      res.status(response.status).end();
      return;
    }
    const contentType = response.headers.get("content-type");
    if (contentType) res.setHeader("Content-Type", contentType);
    res.setHeader("Cache-Control", "public, max-age=86400");
    response.body!.pipeTo(
      new WritableStream({
        write(chunk) {
          res.write(chunk);
        },
        close() {
          res.end();
        },
      }),
    );
  } catch {
    res.status(502).end();
  }
});

export default router;

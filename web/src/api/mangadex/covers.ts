const viteApiUrl = import.meta.env.VITE_API_URL;
const isProd = import.meta.env.PROD;

const MANGADEX_API = `${viteApiUrl}/proxy/mangadex`;

// In prod, cover images are proxied through our API to avoid MangaDex's hotlink protection,
// which serves a "read on MangaDex" placeholder when the Referer is an external domain.
// In dev, we hit uploads.mangadex.org directly — localhost doesn't trigger the protection.
const MANGADEX_UPLOADS = isProd
  ? `${viteApiUrl}/proxy/mangadex/covers`
  : "https://uploads.mangadex.org/covers";

type MangadexCover = {
  id: string;
  volume: string | null;
  locale: string | null;
  url: string;
  thumbUrl: string;
};

type CoverAttributes = {
  volume: string | null;
  fileName: string;
  locale: string | null;
};

type CoverResponse = {
  data: Array<{
    id: string;
    attributes: CoverAttributes;
    relationships: Array<{ id: string; type: string }>;
  }>;
};

async function getCovers(mangadexId: string): Promise<MangadexCover[]> {
  const params = new URLSearchParams({
    "manga[]": mangadexId,
    limit: "100",
    "order[volume]": "desc",
  });

  const response = await fetch(`${MANGADEX_API}/cover?${params}`);
  if (!response.ok) throw new Error(`MangaDex request failed: ${response.status}`);

  const json: CoverResponse = await response.json();

  return json.data.map((cover) => {
    const { fileName, volume, locale } = cover.attributes;
    const base = `${MANGADEX_UPLOADS}/${mangadexId}/${fileName}`;
    return {
      id: cover.id,
      volume,
      locale,
      url: base,
      thumbUrl: `${base}.512.jpg`,
    };
  });
}

export { getCovers };
export type { MangadexCover };

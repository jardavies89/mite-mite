const MANGADEX_API = "https://api.mangadex.org";

type MangadexSearchResult = {
  id: string;
  title: string;
};

type MangaAttributes = {
  title: Record<string, string>;
};

async function searchManga(title: string): Promise<MangadexSearchResult | null> {
  const params = new URLSearchParams({ title, limit: "1" });
  const response = await fetch(`${MANGADEX_API}/manga?${params}`);
  if (!response.ok) throw new Error(`MangaDex search failed: ${response.status}`);

  const json: { data: Array<{ id: string; attributes: MangaAttributes }> } = await response.json();
  if (!json.data.length) return null;

  const result = json.data[0];
  const title_en =
    result.attributes.title["en"] ?? Object.values(result.attributes.title)[0] ?? "Unknown";

  return { id: result.id, title: title_en };
}

export { searchManga };
export type { MangadexSearchResult };

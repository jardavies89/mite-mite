const MANGADEX_API = `${import.meta.env.VITE_API_URL}/proxy/mangadex`;

type MangadexSearchResult = {
  id: string;
  title: string;
};

type MangaAttributes = {
  title: Record<string, string>;
};

function extractTitle(attributes: MangaAttributes): string {
  return attributes.title["en"] ?? Object.values(attributes.title)[0] ?? "Unknown";
}

async function searchManga(title: string): Promise<MangadexSearchResult | null> {
  const params = new URLSearchParams({ title, limit: "1" });
  const response = await fetch(`${MANGADEX_API}/manga?${params}`);
  if (!response.ok) throw new Error(`MangaDex search failed: ${response.status}`);

  const json: { data: Array<{ id: string; attributes: MangaAttributes }> } = await response.json();
  if (!json.data.length) return null;

  const result = json.data[0];
  return { id: result.id, title: extractTitle(result.attributes) };
}

async function searchMangaCandidates(title: string, limit = 5): Promise<MangadexSearchResult[]> {
  const params = new URLSearchParams({ title, limit: String(limit) });
  const response = await fetch(`${MANGADEX_API}/manga?${params}`);
  if (!response.ok) throw new Error(`MangaDex search failed: ${response.status}`);

  const json: { data: Array<{ id: string; attributes: MangaAttributes }> } = await response.json();
  return json.data.map((item) => ({ id: item.id, title: extractTitle(item.attributes) }));
}

export { searchManga, searchMangaCandidates };
export type { MangadexSearchResult };

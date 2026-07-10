import searchMediaQuery from "./graphql/search_media_query.graphql?raw";

const ANILIST_URL = "https://graphql.anilist.co";

type SearchMediaResponse = { Page: { media: MangaSearchResult[] } };

async function searchMedia(
  search: string,
  type: "MANGA" | "ANIME" = "MANGA",
): Promise<MangaSearchResult[]> {
  const response = await fetch(ANILIST_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ query: searchMediaQuery, variables: { search, type } }),
  });

  if (!response.ok) throw new Error(`AniList request failed: ${response.status}`);

  const json: { errors?: Array<{ message: string }>; data: SearchMediaResponse } =
    await response.json();
  if (json.errors?.length) throw new Error(json.errors[0].message);

  return json.data.Page.media;
}

export { searchMedia };

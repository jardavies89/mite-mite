import getMediaQuery from "./graphql/get_media_query.graphql?raw";

const ANILIST_URL = "https://graphql.anilist.co";

type GetMediaResponse = { Media: AnilistMediaDetails };

async function getMedia(id: number): Promise<AnilistMediaDetails> {
  const response = await fetch(ANILIST_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ query: getMediaQuery, variables: { id } }),
  });

  if (!response.ok) throw new Error(`AniList request failed: ${response.status}`);

  const json: { errors?: Array<{ message: string }>; data: GetMediaResponse } =
    await response.json();
  if (json.errors?.length) throw new Error(json.errors[0].message);

  return json.data.Media;
}

export { getMedia };

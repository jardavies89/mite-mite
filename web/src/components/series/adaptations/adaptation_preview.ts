function yearFrom(isoDate: string): string {
  return isoDate.slice(0, 4);
}

function buildAdaptationPreview(entry: Entry): string {
  const { medium, metadata } = entry;
  const parts: string[] = [];

  if (medium === "SHOW") {
    const show = (metadata ?? {}) as ShowMetadata;
    const styleLabel = show.style === "ANIME" ? "Anime" : "Show";
    parts.push(styleLabel);

    if (show.seasons && show.seasons.length > 0) {
      const n = show.seasons.length;
      parts.push(`${n} ${n === 1 ? "season" : "seasons"}`);
    }

    if (show.studio) parts.push(show.studio);

    if (show.startDate) {
      const start = yearFrom(show.startDate);
      const end = show.endDate ? yearFrom(show.endDate) : "present";
      parts.push(`${start}–${end}`);
    }
  } else if (medium === "MOVIE") {
    const movie = (metadata ?? {}) as MovieMetadata;
    parts.push("Movie");
    if (movie.studio) parts.push(movie.studio);
    if (movie.releaseDate) parts.push(yearFrom(movie.releaseDate));
  } else if (medium === "MANGA") {
    const manga = (metadata ?? {}) as MangaMetadata;
    parts.push("Manga");
    if (manga.publishers && manga.publishers.length > 0) parts.push(manga.publishers[0]);
    if (manga.volumeCount != null) {
      parts.push(`${manga.volumeCount} ${manga.volumeCount === 1 ? "vol." : "vols."}`);
    }
  }

  return parts.join(" · ");
}

export { buildAdaptationPreview };

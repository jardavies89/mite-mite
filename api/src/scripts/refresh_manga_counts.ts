import { and, eq, isNotNull, like } from "drizzle-orm";
import { db } from "../db/index";
import { entries } from "../db/schema";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface AniListCounts {
  volumes: number | null;
  chapters: number | null;
}

export interface EntryMangaRow {
  id: number;
  referenceUrl: string;
  status: string | null;
  metadata: Record<string, unknown> | null;
}

export type RefreshResult =
  | { kind: "updated"; entryId: number; changes: { volumeCount?: number; chapterCount?: number } }
  | { kind: "skipped"; entryId: number; reason: string }
  | { kind: "no_change"; entryId: number }
  | { kind: "error"; entryId: number; error: string };

// ---------------------------------------------------------------------------
// AniList client
// ---------------------------------------------------------------------------

const GET_MEDIA_QUERY = `
  query GetMedia($id: Int!) {
    Media(id: $id, type: MANGA) {
      volumes
      chapters
    }
  }
`;

const ANILIST_URL = "https://graphql.anilist.co";

export async function fetchAniListCounts(anilistId: number): Promise<AniListCounts> {
  const response = await fetch(ANILIST_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ query: GET_MEDIA_QUERY, variables: { id: anilistId } }),
  });

  if (!response.ok) throw new Error(`AniList request failed: ${response.status}`);

  const json = (await response.json()) as {
    errors?: Array<{ message: string }>;
    data: { Media: { volumes: number | null; chapters: number | null } };
  };
  if (json.errors?.length) throw new Error(json.errors[0].message);

  return { volumes: json.data.Media.volumes, chapters: json.data.Media.chapters };
}

// ---------------------------------------------------------------------------
// URL parsing
// ---------------------------------------------------------------------------

export function extractAniListId(url: string): number | null {
  const match = /anilist\.co\/manga\/(\d+)/.exec(url);
  if (!match) return null;
  return parseInt(match[1], 10);
}

// ---------------------------------------------------------------------------
// DB queries
// ---------------------------------------------------------------------------

export async function fetchAniListMangaEntries(): Promise<EntryMangaRow[]> {
  return db
    .select({
      id: entries.id,
      referenceUrl: entries.referenceUrl!,
      status: entries.status,
      metadata: entries.metadata,
    })
    .from(entries)
    .where(
      and(
        eq(entries.medium, "MANGA"),
        isNotNull(entries.referenceUrl),
        like(entries.referenceUrl, "%anilist.co%"),
      ),
    ) as Promise<EntryMangaRow[]>;
}

export async function updateEntryCounts(
  id: number,
  metadata: Record<string, unknown>,
): Promise<void> {
  await db.update(entries).set({ metadata, updatedAt: new Date() }).where(eq(entries.id, id));
}

// ---------------------------------------------------------------------------
// Business logic
// ---------------------------------------------------------------------------

export function classifyCounts(
  stored: Record<string, unknown> | null,
  fetched: AniListCounts,
): { volumeCount?: number; chapterCount?: number } | null {
  const storedVolume = stored?.volumeCount as number | null | undefined;
  const storedChapter = stored?.chapterCount as number | null | undefined;

  const changes: { volumeCount?: number; chapterCount?: number } = {};

  if (fetched.volumes != null && fetched.volumes !== 0 && fetched.volumes !== storedVolume) {
    changes.volumeCount = fetched.volumes;
  }
  if (fetched.chapters != null && fetched.chapters !== 0 && fetched.chapters !== storedChapter) {
    changes.chapterCount = fetched.chapters;
  }

  return Object.keys(changes).length > 0 ? changes : null;
}

export function buildUpdatedMetadata(
  existing: Record<string, unknown> | null,
  changes: { volumeCount?: number; chapterCount?: number },
): Record<string, unknown> {
  return { ...(existing ?? {}), ...changes };
}

// ---------------------------------------------------------------------------
// Orchestrator
// ---------------------------------------------------------------------------

export async function runRefresh(): Promise<RefreshResult[]> {
  const entries = await fetchAniListMangaEntries();
  const results: RefreshResult[] = [];

  for (const entry of entries) {
    const anilistId = extractAniListId(entry.referenceUrl);
    if (anilistId === null) {
      results.push({ kind: "skipped", entryId: entry.id, reason: "no AniList ID in referenceUrl" });
      continue;
    }

    const countsPopulated =
      entry.metadata?.volumeCount != null && entry.metadata?.chapterCount != null;
    if (entry.status === "Completed" && countsPopulated) {
      results.push({
        kind: "skipped",
        entryId: entry.id,
        reason: "completed series with counts already populated",
      });
      continue;
    }

    try {
      const fetched = await fetchAniListCounts(anilistId);

      const allInvalid =
        (fetched.volumes == null || fetched.volumes === 0) &&
        (fetched.chapters == null || fetched.chapters === 0);
      if (allInvalid) {
        results.push({
          kind: "skipped",
          entryId: entry.id,
          reason: "AniList returned null/zero for all counts",
        });
        continue;
      }

      const changes = classifyCounts(entry.metadata, fetched);

      if (changes === null) {
        results.push({ kind: "no_change", entryId: entry.id });
        continue;
      }

      const newMetadata = buildUpdatedMetadata(entry.metadata, changes);
      await updateEntryCounts(entry.id, newMetadata);
      results.push({ kind: "updated", entryId: entry.id, changes });
    } catch (err) {
      results.push({
        kind: "error",
        entryId: entry.id,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  return results;
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

function printSummary(results: RefreshResult[]): void {
  const updated = results.filter((r) => r.kind === "updated");
  const noChange = results.filter((r) => r.kind === "no_change");
  const skipped = results.filter((r) => r.kind === "skipped");
  const errors = results.filter((r) => r.kind === "error");

  console.log(`[refresh] Starting manga count refresh`);
  console.log(`[refresh] Processed ${results.length} AniList-linked manga entries`);

  for (const r of updated) {
    const changeDesc = Object.entries(r.changes)
      .map(([k, v]) => `${k} → ${v}`)
      .join(", ");
    console.log(`[refresh] ✓ Updated entry id:${r.entryId}: ${changeDesc}`);
  }
  for (const r of skipped) {
    console.log(`[refresh] ✗ Skipped entry id:${r.entryId}: ${r.reason}`);
  }
  for (const r of errors) {
    console.log(`[refresh] ✗ Error entry id:${r.entryId}: ${r.error}`);
  }

  const problemSkips = skipped.filter(
    (s) =>
      s.reason !== "no AniList ID in referenceUrl" &&
      s.reason !== "completed series with counts already populated",
  );
  const hasFailures = errors.length > 0 || problemSkips.length > 0;
  console.log(
    `[refresh] Summary: ${updated.length} updated, ${noChange.length} no-change, ${skipped.length} skipped, ${errors.length} error(s)`,
  );
  console.log(`[refresh] Done — exit ${hasFailures ? 1 : 0}`);
}

async function main(): Promise<void> {
  const results = await runRefresh();
  printSummary(results);
  const hasErrors = results.some((r) => r.kind === "error");
  process.exit(hasErrors ? 1 : 0);
}

if (require.main === module) {
  main();
}

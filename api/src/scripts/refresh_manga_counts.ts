import { eq } from "drizzle-orm";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "../db/schema";
import { entries } from "../db/schema";

// ─── Types ──────────────────────────────────────────────────────────────────

type MangaEntry = {
  id: number;
  title: string;
  altTitles: string[];
  metadata: Record<string, unknown> | null;
  storedVolumeCount: number | null;
};

type MuSearchResult = {
  series_id: number;
  title: string;
};

type MuDetailRecord = {
  series_id: number;
  title: string;
  status: string | null;
};

export type ClassifyOutcome =
  | { status: "skipped"; reason: string }
  | { status: "update"; newCount: number };

type RefreshResult =
  | { status: "updated"; entryId: number; oldCount: number | null; newCount: number }
  | { status: "skipped"; entryId: number; reason: string }
  | { status: "failed"; entryId: number; error: string };

// ─── Pure functions (exported for testing) ───────────────────────────────────

export function parseVolumeCount(status: string | null | undefined): number | null {
  if (!status) return null;
  const match = status.match(/^(\d+)\s+volumes?/i);
  return match ? parseInt(match[1], 10) : null;
}

export function pickBestMatch(
  results: MuSearchResult[],
  title: string,
): MuSearchResult | null {
  if (results.length === 0) return null;
  const lower = title.toLowerCase();
  const exact = results.find((r) => r.title.toLowerCase() === lower);
  return exact ?? results[0];
}

export function buildUpdatedMetadata(
  existing: Record<string, unknown> | null | undefined,
  patch: { volumeCount: number; mangaUpdatesId: string },
): Record<string, unknown> {
  return { ...(existing ?? {}), ...patch };
}

export function classifyResult(
  entry: { metadata: Record<string, unknown> | null; storedVolumeCount: number | null },
  muVolumeCount: number | null,
): ClassifyOutcome {
  if (entry.metadata?.manualCounts === true) {
    return { status: "skipped", reason: "manualCounts flag set" };
  }
  if (!muVolumeCount) {
    return { status: "skipped", reason: "MangaUpdates returned null/zero volume count" };
  }
  if (entry.storedVolumeCount === muVolumeCount) {
    return { status: "skipped", reason: `volume count unchanged (${muVolumeCount})` };
  }
  return { status: "update", newCount: muVolumeCount };
}

// ─── MangaUpdates API client ─────────────────────────────────────────────────

const MU_BASE = "https://api.mangaupdates.com/v1";

export async function searchMangaUpdates(title: string): Promise<MuSearchResult | null> {
  const res = await fetch(`${MU_BASE}/series/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ search: title, per_page: 5 }),
  });
  if (!res.ok) throw new Error(`MU search failed: ${res.status}`);
  const json = (await res.json()) as { results?: Array<{ record: MuSearchResult }> };
  const results = (json.results ?? []).map((r) => r.record);
  return pickBestMatch(results, title);
}

export async function fetchMangaUpdatesDetail(seriesId: string): Promise<MuDetailRecord> {
  const res = await fetch(`${MU_BASE}/series/${seriesId}`);
  if (!res.ok) throw new Error(`MU detail fetch failed for id ${seriesId}: ${res.status}`);
  return res.json() as Promise<MuDetailRecord>;
}

// ─── DB operations ───────────────────────────────────────────────────────────

export async function fetchMangaEntries(db: ReturnType<typeof drizzle>): Promise<MangaEntry[]> {
  const rows = await db.select().from(entries).where(eq(entries.medium, "MANGA"));

  return rows.map((row) => {
    const meta = (row.metadata ?? {}) as Record<string, unknown>;
    return {
      id: row.id,
      title: row.title,
      altTitles: row.altTitles ?? [],
      metadata: meta,
      storedVolumeCount: typeof meta.volumeCount === "number" ? meta.volumeCount : null,
    };
  });
}

export async function updateEntryMetadata(
  db: ReturnType<typeof drizzle>,
  id: number,
  existing: Record<string, unknown> | null,
  patch: { volumeCount: number; mangaUpdatesId: string },
): Promise<void> {
  const merged = buildUpdatedMetadata(existing, patch);
  await db.update(entries).set({ metadata: merged }).where(eq(entries.id, id));
}

// ─── Orchestration ───────────────────────────────────────────────────────────

async function resolveVolumeCount(
  entry: MangaEntry,
): Promise<{ volumeCount: number | null; mangaUpdatesId: string | null }> {
  const cachedId =
    typeof entry.metadata?.mangaUpdatesId === "string" ? entry.metadata.mangaUpdatesId : null;

  if (cachedId) {
    const detail = await fetchMangaUpdatesDetail(cachedId);
    return { volumeCount: parseVolumeCount(detail.status), mangaUpdatesId: cachedId };
  }

  // Try primary title, then alt titles
  const titlesToTry = [entry.title, ...entry.altTitles];
  for (const title of titlesToTry) {
    const match = await searchMangaUpdates(title);
    if (match) {
      const seriesId = String(match.series_id);
      const detail = await fetchMangaUpdatesDetail(seriesId);
      return { volumeCount: parseVolumeCount(detail.status), mangaUpdatesId: seriesId };
    }
  }
  return { volumeCount: null, mangaUpdatesId: null };
}

async function processEntry(
  db: ReturnType<typeof drizzle>,
  entry: MangaEntry,
): Promise<RefreshResult> {
  // manualCounts check before any network call
  if (entry.metadata?.manualCounts === true) {
    return { status: "skipped", entryId: entry.id, reason: "manualCounts flag set" };
  }

  const { volumeCount, mangaUpdatesId } = await resolveVolumeCount(entry);

  if (!mangaUpdatesId) {
    return {
      status: "skipped",
      entryId: entry.id,
      reason: `no MangaUpdates match for "${entry.title}"`,
    };
  }

  const outcome = classifyResult(entry, volumeCount);
  if (outcome.status === "skipped") {
    return { status: "skipped", entryId: entry.id, reason: outcome.reason };
  }

  await updateEntryMetadata(db, entry.id, entry.metadata, {
    volumeCount: outcome.newCount,
    mangaUpdatesId,
  });

  return {
    status: "updated",
    entryId: entry.id,
    oldCount: entry.storedVolumeCount,
    newCount: outcome.newCount,
  };
}

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error("[refresh] ERROR: DATABASE_URL is not set");
    process.exit(1);
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });
  const db = drizzle(pool, { schema });

  let mangaEntries: MangaEntry[];
  try {
    mangaEntries = await fetchMangaEntries(db);
  } catch (err) {
    console.error("[refresh] ERROR: failed to fetch entries from DB:", err);
    await pool.end();
    process.exit(1);
  }

  const results: RefreshResult[] = [];

  for (const entry of mangaEntries) {
    try {
      const result = await processEntry(db, entry);
      results.push(result);

      if (result.status === "updated") {
        console.log(
          `[refresh] ✓ Updated entry id:${result.entryId} — volumes: ${result.oldCount ?? "null"} → ${result.newCount}`,
        );
      } else if (result.status === "skipped") {
        console.log(`[refresh] - Skipped entry id:${result.entryId}: ${result.reason}`);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      results.push({ status: "failed", entryId: entry.id, error: message });
      console.error(`[refresh] ✗ Failed entry id:${entry.id}: ${message}`);
    }
  }

  await pool.end();

  const updated = results.filter((r) => r.status === "updated").length;
  const skipped = results.filter((r) => r.status === "skipped").length;
  const failed = results.filter((r) => r.status === "failed").length;
  console.log(`[refresh] Complete — ${updated} updated, ${skipped} skipped, ${failed} failed`);

  if (failed > 0) process.exit(1);
}

if (require.main === module) {
  main();
}

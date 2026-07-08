/**
 * Replaces %{key} placeholders in a string with values from vars.
 *
 * Usage:
 *   translate(Strings.entry.addedCount, { count: "3" })
 *   // where Strings.entry.addedCount = "Added %{count} entries"
 *   // → "Added 3 entries"
 *
 * For strings with no placeholders, reference Strings directly without calling translate.
 */
export function translate(str: string, vars?: Record<string, string>): string {
  return str.replace(/%\{(\w+)\}/g, (_, k) => vars?.[k] ?? k);
}

export const Strings = {
  home: {
    title: "みてみて!",
    addEntry: "Add Entry",
    emptyState: "No entries yet. Add one to get started.",
  },
  entry: {
    new: "New Entry",
    save: "Save",
    cancel: "Cancel",
    searchPlaceholder: "Search for a title...",
    primaryTitle: "Primary title",
    alternateTitles: "Alternate titles",
    coverImageUrl: "Cover image URL",
    genres: "Genres",
    tags: "Tags",
    franchise: "Franchise",
    referenceLinks: "Reference links",
    noResults: "No results found.",
    continueManually: "Continue manually",
    searchError: "Search is temporarily unavailable.",
  },
  theme: {
    toggleLight: "Switch to light mode",
    toggleDark: "Switch to dark mode",
  },
} as const;

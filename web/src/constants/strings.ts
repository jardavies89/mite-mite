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
  admin: {
    title: "Admin",
    addNewEntry: "Add new entry",
    noPermission: "You don't have permission to view this page.",
  },
  home: {
    title: "みてみて!",
    addEntry: "Add Entry",
    emptyState: "No entries yet. Add one to get started.",
  },
  entry: {
    new: "New Entry",
    save: "Save",
    cancel: "Cancel",
    selectMedium: "Select a medium to get started",
    medium: "Medium",
    manga: "Manga",
    book: "Book",
    movieShow: "Movie / Show",
    searchPlaceholder: "Search for a title...",
    searchResults: "Results",
    primaryTitle: "Primary title",
    addAlternateTitle: "Add alternate title",
    alternateTitles: "Alternate titles",
    coverImageUrl: "Cover image URL",
    coverPreview: "Cover preview",
    genres: "Genres",
    tags: "Tags",
    franchise: "Franchise",
    franchiseSearchPlaceholder: "Search or create a franchise...",
    franchiseCreateNew: "Create new: %{name}",
    referenceLinks: "Reference links",
    refLinkRead: "Read",
    refLinkBuy: "Buy",
    refLinkWatch: "Watch",
    refLinkUrl: "URL",
    refLinkLabel: "Label (optional, e.g. \"Netflix\")",
    refLinkAdd: "Add link",
    alternateTitleLabel: "Alternate title %{n}",
    removeAlternateTitle: "Remove alternate title",
    removeReferenceLink: "Remove link",
    franchiseWillBeCreated: "A new franchise will be created with this name.",
    noCover: "No cover",
    noResults: "No results found.",
    continueManually: "Continue manually",
    searchError: "Search is temporarily unavailable.",
  },
  notFound: {
    title: "Page not found",
    body: "The page you're looking for doesn't exist.",
    goHome: "Go home",
  },
  theme: {
    toggleLight: "Switch to light mode",
    toggleDark: "Switch to dark mode",
  },
} as const;

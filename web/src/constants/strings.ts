/**
 * Replaces %{key} placeholders in a string with values from vars.
 *
 * Usage:
 *   translate(Strings.entry.alternateTitleLabel, { n: "2" })
 *   // where Strings.entry.alternateTitleLabel = "Alternate title %{n}"
 *   // → "Alternate title 2"
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
  },
  home: {
    title: "みてみて!",
    addEntry: "Add entry",
    emptyState: "No entries yet. Add one to get started.",
  },
  entry: {
    addAlternateTitle: "Add alternate title",
    addStaffMember: "Add staff member",
    alternateTitleLabel: "Alternate title %{n}",
    alternateTitles: "Alternate titles",
    anilistSource: "View on AniList",
    chooseCover: "Choose cover image",
    comments: "Comments",
    description: "Description",
    franchise: "Franchise",
    genres: "Genres",
    primaryTitle: "Primary title",
    removeAlternateTitle: "Remove alternate title",
    removeStaffMember: "Remove staff member",
    staff: "Staff",
    status: "Status",
    statusPlaceholder: "Select a status...",
    tags: "Tags",
  },
  coverPicker: {
    title: "Choose cover image",
    matchedTitle: "Showing covers for: %{title}",
    loading: "Loading covers...",
    showAllRegions: "Show all regions",
    noResults: "No covers found.",
    volumeLabel: "Vol. %{n}",
    noResultsJapanese: "No covers found for Japanese region — try showing all regions.",
    error: "Couldn't load covers from MangaDex.",
    noMatch: "No matching title found on MangaDex.",
  },
  newEntry: {
    noResults: "No results found.",
    searchError: "Search is temporarily unavailable.",
    searching: "Searching...",
    searchTitle: "Search by title",
    franchisePlaceholder: "Search for a franchise...",
    franchiseCreateNew: "Create new franchise",
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

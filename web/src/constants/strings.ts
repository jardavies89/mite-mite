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
    addNewEntry: "Add new entry",
    title: "Admin",
  },
  auth: {
    loginWithGitHub: "Log in with GitHub",
    notAuthorized: "You're not authorized to access this page.",
  },
  coverPicker: {
    error: "Couldn't load covers from MangaDex.",
    loading: "Loading covers...",
    matchedTitle: "Showing covers for: %{title}",
    noMatch: "No matching title found on MangaDex.",
    noResults: "No covers found.",
    noResultsJapanese: "No covers found for Japanese region — try showing all regions.",
    showAllRegions: "Show all regions",
    title: "Choose cover image",
    volumeLabel: "Vol. %{n}",
  },
  entry: {
    addAlternateTitle: "Add alternate title",
    addStaffMember: "Add staff member",
    alternateTitleLabel: "Alternate title %{n}",
    alternateTitles: "Alternate titles",
    anilistSource: "Sourced from AniList",
    chooseCover: "Choose cover image",
    comments: "Comments",
    description: "Description",
    franchise: "Franchise",
    genres: "Genres",
    primaryTitle: "Primary title",
    referenceUrl: "Reference URL",
    removeAlternateTitle: "Remove alternate title",
    removeStaffMember: "Remove staff member",
    staff: "Staff",
    status: "Status",
    statusPlaceholder: "Select a status...",
    tags: "Tags",
  },
  home: {
    addEntry: "Add entry",
    backButton: "Home",
    emptyState: "No series match your search criteria.",
    searchPlaceholder: "Search by title, author, or artist",
    title: "みてみて!",
  },
  newEntry: {
    createEntry: "Create entry",
    franchiseCreateNew: "Create new franchise",
    franchiseError: "Entries need a primary title and franchise.",
    franchisePlaceholder: "Search for a franchise...",
    noResults: "No results found.",
    resetForm: "Reset form",
  },
  notFound: {
    body: "The page you're looking for doesn't exist.",
    goHome: "Go home",
    title: "Page not found",
  },
  filters: {
    anyStatus: "Any status",
    genrePlaceholder: "Genres",
    noneSelected: "None selected",
    statusPlaceholder: "Status",
    tagPlaceholder: "Tags",
  },
  share: {
    closeButton: "Close",
    copyButton: "Copy link",
    copiedButton: "Copied!",
    modalTitle: "Share",
    shareButton: "Share",
  },
  search: {
    changeManga: "Select the correct manga",
    noSearchResults: 'No results found for "%{query}".',
    searchError: "Search is temporarily unavailable.",
    searching: "Searching...",
    searchInstead: "Search instead",
    searchLabel: "Search MangaDex",
    searchPlaceholder: "Enter a title...",
    searchSubmit: "Search",
    searchTitle: "Search by title",
    wrongTitle: "Wrong title?",
  },
  editEntry: {
    cancel: "Cancel",
    pageTitle: "Edit entry",
    saveChanges: "Save changes",
  },
  editFranchise: {
    cancel: "Cancel",
    editEntryButton: "Edit entry",
    editSeriesButton: "Edit series",
    emptyTitleError: "Series title cannot be empty.",
    pageTitle: "Edit series",
    saveChanges: "Save changes",
  },
  theme: {
    toggleDark: "Switch to dark mode",
    toggleLight: "Switch to light mode",
  },
  metadata: {
    startDate: "Start date",
    endDate: "End date",
    studio: "Studio",
    style: "Style",
    styleAnime: "Animation",
    styleLiveAction: "Live Action",
    addSeason: "Add season",
    removeSeason: "Remove",
    seasonLabel: "Season %{n}",
    episodeCount: "Episodes",
    runtimeMinutes: "Runtime (minutes)",
    releaseDate: "Release date",
    volumeCount: "Volumes",
    chapterCount: "Chapters",
    publishers: "Publishers",
    addPublisher: "Add publisher",
    removePublisher: "Remove publisher",
  },
} as const;

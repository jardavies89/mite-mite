const Medium = {
  Anime: "ANIME",
  Book: "BOOK",
  Manga: "MANGA",
} as const;
type Medium = (typeof Medium)[keyof typeof Medium];

const Genres = {
  Action: "Action",
  Adventure: "Adventure",
  BoysLove: "Boys' Love",
  Comedy: "Comedy",
  Crime: "Crime",
  DarkFantasy: "Dark Fantasy",
  Drama: "Drama",
  Fantasy: "Fantasy",
  GirlsLove: "Girls' Love",
  Historical: "Historical",
  Horror: "Horror",
  Isekai: "Isekai",
  MagicalGirls: "Magical Girls",
  MartialArts: "Martial Arts",
  Mecha: "Mecha",
  Medical: "Medical",
  Mystery: "Mystery",
  Philosophical: "Philosophical",
  Psychological: "Psychological",
  Romance: "Romance",
  SciFi: "Sci-Fi",
  SliceOfLife: "Slice of Life",
  Sports: "Sports",
  Superhero: "Superhero",
  Thriller: "Thriller",
  Tragedy: "Tragedy",
  Western: "Western",
  Wuxia: "Wuxia",
} as const;
type Genres = (typeof Genres)[keyof typeof Genres];

const SubGenreTags = {
  BattleRoyale: "Battle Royale",
  BodyHorror: "Body Horror",
  CosmicHorror: "Cosmic Horror",
  Cultivation: "Cultivation",
  Cyberpunk: "Cyberpunk",
  DeathGame: "Death Game",
  Detective: "Detective",
  Dystopian: "Dystopian",
  Espionage: "Espionage",
  FairyTale: "Fairy Tale",
  HighStakesCompetition: "High Stakes Competition",
  Iyashikei: "Iyashikei",
  Mythology: "Mythology",
  Noir: "Noir",
  Paranormal: "Paranormal",
  PostApocalyptic: "Post-Apocalyptic",
  ReverseIsekai: "Reverse Isekai",
  SpaceOpera: "Space Opera",
  Steampunk: "Steampunk",
  UrbanFantasy: "Urban Fantasy",
} as const;
type SubGenreTags = (typeof SubGenreTags)[keyof typeof SubGenreTags];

const NarrativeTags = {
  CombatSports: "Combat Sports",
  ComingOfAge: "Coming of Age",
  Conspiracy: "Conspiracy",
  CourtIntrigue: "Court Intrigue",
  FoundFamily: "Found Family",
  MartialArts: "Martial Arts",
  OrganizedCrime: "Organized Crime",
  PerformingArts: "Performing Arts",
  Racing: "Racing",
  Revenge: "Revenge",
  Satire: "Satire",
  SchoolLife: "School Life",
  Showbiz: "Showbiz",
  VirtualReality: "Virtual Reality",
  War: "War",
  Workplace: "Workplace",
} as const;
type NarrativeTags = (typeof NarrativeTags)[keyof typeof NarrativeTags];

const DemographicTags = {
  Josei: "Josei",
  Seinen: "Seinen",
  Shoujo: "Shoujo",
  Shounen: "Shounen",
} as const;
type DemographicTags = (typeof DemographicTags)[keyof typeof DemographicTags];

const ContentWarningTags = {
  ExtremeViolence: "Extreme Violence",
  Gore: "Gore",
  Nudity: "Nudity",
} as const;
type ContentWarningTags = (typeof ContentWarningTags)[keyof typeof ContentWarningTags];

type Tags = SubGenreTags | NarrativeTags | DemographicTags | ContentWarningTags;

const Status = {
  Finished: "FINISHED",
  Ongoing: "ONGOING",
  Paused: "PAUSED",
} as const;
type Status = (typeof Status)[keyof typeof Status];

export { ContentWarningTags, DemographicTags, Genres, Medium, NarrativeTags, Status, SubGenreTags };
export type { Tags };

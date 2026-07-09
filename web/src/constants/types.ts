const Medium = {
  Anime: "Anime",
  Book: "Book",
  Manga: "Manga",
} as const;
type Medium = (typeof Medium)[keyof typeof Medium];

const Genres = {
  Action: "Action",
  Adventure: "Adventure",
  Biography: "Biography",
  Comedy: "Comedy",
  Crime: "Crime",
  Documentary: "Documentary",
  Drama: "Drama",
  Family: "Family",
  Fantasy: "Fantasy",
  History: "History",
  Horror: "Horror",
  Mecha: "Mecha",
  Music: "Music",
  Mystery: "Mystery",
  Psychological: "Psychological",
  Romance: "Romance",
  SciFi: "Sci-Fi",
  SliceOfLife: "Slice of Life",
  Sports: "Sports",
  Supernatural: "Supernatural",
  Thriller: "Thriller",
  War: "War",
  Western: "Western",
} as const;
type Genres = (typeof Genres)[keyof typeof Genres];

export { Genres, Medium };

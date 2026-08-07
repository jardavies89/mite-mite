interface Franchise {
  id: string;
  primaryTitle: string;
  entries: Entry[];
}

interface Entry {
  id: string;
  alternateTitles: string[];
  comments: string;
  coverImageUrl: string;
  description: string;
  genres: string[];
  medium: string;
  metadata?: import("@/constants/metadata_types").EntryMetadata | null;
  primaryTitle: string;
  referenceUrl?: string;
  staff: string[];
  status: string;
  tags: string[];
}

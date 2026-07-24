interface Franchise {
  id: string;
  primaryTitle: string;
  primaryEntryId: string;
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
  primaryTitle: string;
  referenceUrl?: string;
  staff: string[];
  status: string;
  tags: string[];
}

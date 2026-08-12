import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { StatusSection } from "../status_section";
import { Strings } from "@/constants/strings";
import { Medium } from "@/constants/types";

const baseEntry = {
  id: "1",
  alternateTitles: [],
  comments: "",
  coverImageUrl: "",
  description: "",
  genres: [],
  medium: Medium.Manga,
  metadata: {} as MangaMetadata,
  primaryTitle: "Test Manga",
  staff: [],
  status: "Ongoing",
  tags: [],
} satisfies Entry;

describe("StatusSection — chapter count display (US2)", () => {
  it("renders chapter count when chapterCount is present", () => {
    render(<StatusSection entry={baseEntry} metadata={{ chapterCount: 42 }} />);
    expect(screen.getByText(Strings.metadata.chapterCount)).toBeInTheDocument();
    expect(screen.getByText("42")).toBeInTheDocument();
  });

  it("hides chapter count when chapterCount is absent", () => {
    render(<StatusSection entry={baseEntry} metadata={{}} />);
    expect(screen.queryByText(Strings.metadata.chapterCount)).not.toBeInTheDocument();
  });

  it("hides chapter count when chapterCount is undefined", () => {
    render(<StatusSection entry={baseEntry} metadata={{ volumeCount: 5 }} />);
    expect(screen.queryByText(Strings.metadata.chapterCount)).not.toBeInTheDocument();
  });
});

describe("StatusSection — volume tooltip (US3)", () => {
  it("shows info icon when volumeCount present and chapterCount absent", () => {
    render(<StatusSection entry={baseEntry} metadata={{ volumeCount: 12 }} />);
    const icon = screen.getByTitle(Strings.metadata.volumeCountTooltip);
    expect(icon).toBeInTheDocument();
  });

  it("hides info icon when both volumeCount and chapterCount are present", () => {
    render(<StatusSection entry={baseEntry} metadata={{ volumeCount: 12, chapterCount: 100 }} />);
    expect(screen.queryByTitle(Strings.metadata.volumeCountTooltip)).not.toBeInTheDocument();
  });

  it("hides info icon when volumeCount is absent", () => {
    render(<StatusSection entry={baseEntry} metadata={{}} />);
    expect(screen.queryByTitle(Strings.metadata.volumeCountTooltip)).not.toBeInTheDocument();
  });
});

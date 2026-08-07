import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { MetadataFields } from "../metadata_fields";
import { Medium } from "@/constants/types";
import { Strings } from "@/constants/strings";

const mockUpdateEntryDraft = vi.fn();
let mockMedium: Medium | null = null;
let mockMetadata: MangaMetadata | null = null;

vi.mock("@material-tailwind/react", () => ({
  Button: ({
    children,
    onClick,
    type,
    "aria-label": ariaLabel,
    className,
  }: React.ButtonHTMLAttributes<HTMLButtonElement> & { "aria-label"?: string }) => (
    <button type={type ?? "button"} onClick={onClick} aria-label={ariaLabel} className={className}>
      {children}
    </button>
  ),
}));

vi.mock("@/components/admin/context/new_entry_context", () => ({
  useNewEntryContext: () => ({
    newEntryDraft: { medium: mockMedium, metadata: mockMetadata },
    updateEntryDraft: mockUpdateEntryDraft,
  }),
}));

beforeEach(() => {
  vi.clearAllMocks();
  mockMedium = null;
  mockMetadata = null;
});

describe("MetadataFields", () => {
  describe("MANGA medium", () => {
    it("renders manga-specific fields", () => {
      mockMedium = Medium.Manga;
      render(<MetadataFields />);

      expect(screen.getByLabelText(Strings.metadata.volumeCount)).toBeInTheDocument();
      expect(screen.getByLabelText(Strings.metadata.chapterCount)).toBeInTheDocument();
      expect(screen.getByText(Strings.metadata.publishers)).toBeInTheDocument();
      expect(screen.getAllByText(Strings.metadata.startDate).length).toBeGreaterThan(0);
      expect(screen.getAllByText(Strings.metadata.endDate).length).toBeGreaterThan(0);
    });

    it("does not render show or movie fields", () => {
      mockMedium = Medium.Manga;
      render(<MetadataFields />);

      expect(screen.queryByLabelText(Strings.metadata.style)).not.toBeInTheDocument();
      expect(screen.queryByText(new RegExp(Strings.metadata.addSeason))).not.toBeInTheDocument();
      expect(screen.queryByLabelText(Strings.metadata.runtimeMinutes)).not.toBeInTheDocument();
      expect(screen.queryByLabelText(Strings.metadata.releaseDate)).not.toBeInTheDocument();
    });
  });

  describe("SHOW medium", () => {
    it("renders show-specific fields", () => {
      mockMedium = Medium.Show;
      render(<MetadataFields />);

      expect(screen.getByLabelText(Strings.metadata.style)).toBeInTheDocument();
      expect(screen.getByLabelText(Strings.metadata.studio)).toBeInTheDocument();
      expect(screen.getAllByText(Strings.metadata.startDate).length).toBeGreaterThan(0);
      expect(screen.getAllByText(Strings.metadata.endDate).length).toBeGreaterThan(0);
      expect(screen.getByText(new RegExp(Strings.metadata.addSeason))).toBeInTheDocument();
    });

    it("does not render manga or movie fields", () => {
      mockMedium = Medium.Show;
      render(<MetadataFields />);

      expect(screen.queryByLabelText(Strings.metadata.volumeCount)).not.toBeInTheDocument();
      expect(screen.queryByLabelText(Strings.metadata.chapterCount)).not.toBeInTheDocument();
      expect(screen.queryByLabelText(Strings.metadata.runtimeMinutes)).not.toBeInTheDocument();
      expect(screen.queryByLabelText(Strings.metadata.releaseDate)).not.toBeInTheDocument();
    });
  });

  describe("MOVIE medium", () => {
    it("renders movie-specific fields", () => {
      mockMedium = Medium.Movie;
      render(<MetadataFields />);

      expect(screen.getByLabelText(Strings.metadata.runtimeMinutes)).toBeInTheDocument();
      expect(screen.getByLabelText(Strings.metadata.studio)).toBeInTheDocument();
      expect(screen.getByLabelText(Strings.metadata.releaseDate)).toBeInTheDocument();
    });

    it("does not render manga or show fields", () => {
      mockMedium = Medium.Movie;
      render(<MetadataFields />);

      expect(screen.queryByLabelText(Strings.metadata.volumeCount)).not.toBeInTheDocument();
      expect(screen.queryByLabelText(Strings.metadata.chapterCount)).not.toBeInTheDocument();
      expect(screen.queryByLabelText(Strings.metadata.style)).not.toBeInTheDocument();
      expect(screen.queryByText(new RegExp(Strings.metadata.addSeason))).not.toBeInTheDocument();
    });
  });

  describe("BOOK medium", () => {
    it("renders nothing", () => {
      mockMedium = Medium.Book;
      const { container } = render(<MetadataFields />);
      expect(container).toBeEmptyDOMElement();
    });
  });

  describe("null medium", () => {
    it("renders nothing", () => {
      mockMedium = null;
      const { container } = render(<MetadataFields />);
      expect(container).toBeEmptyDOMElement();
    });
  });

  describe("field interactions", () => {
    it("calls updateEntryDraft with updated volumeCount when volumes field changes", async () => {
      mockMedium = Medium.Manga;
      mockMetadata = {};
      render(<MetadataFields />);

      const input = screen.getByLabelText(Strings.metadata.volumeCount);
      await userEvent.type(input, "5");

      expect(mockUpdateEntryDraft).toHaveBeenCalledWith(
        expect.objectContaining({ metadata: expect.objectContaining({ volumeCount: 5 }) }),
      );
    });
  });
});

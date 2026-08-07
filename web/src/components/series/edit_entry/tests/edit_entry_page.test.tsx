import { render, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { EditEntryLoader } from "../edit_entry_page";
import { Medium } from "@/constants/types";

const mockUpdateEntryDraft = vi.fn();

vi.mock("@/components/admin/context/new_entry_context", () => ({
  useNewEntryContext: () => ({
    newEntryDraft: { medium: null, metadata: null },
    updateEntryDraft: mockUpdateEntryDraft,
  }),
}));

vi.mock("@/api/mite_mite", () => ({
  useGetFranchiseDetails: () => ({
    franchise: {
      id: "1",
      primaryTitle: "Berserk",
      entries: [
        {
          id: "entry-1",
          primaryTitle: "Berserk",
          alternateTitles: [],
          coverImageUrl: "",
          description: "",
          comments: "",
          genres: [],
          tags: [],
          staff: [],
          status: "ONGOING",
          referenceUrl: "",
          medium: Medium.Manga,
          metadata: { volumeCount: 12, publishers: ["Shueisha"] },
        },
      ],
    },
    isLoading: false,
    error: null,
  }),
}));

vi.mock("../edit_entry_form", () => ({
  EditEntryForm: () => null,
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("EditEntryLoader", () => {
  it("pre-populates metadata when entry loads", async () => {
    render(<EditEntryLoader franchiseId="1" entryId="entry-1" />);

    await waitFor(() => {
      expect(mockUpdateEntryDraft).toHaveBeenCalledWith(
        expect.objectContaining({
          metadata: { volumeCount: 12, publishers: ["Shueisha"] },
        }),
      );
    });
  });
});

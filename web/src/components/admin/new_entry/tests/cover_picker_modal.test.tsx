import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { CoverPickerModal } from "../cover_picker_modal";

const mockGetCovers = vi.fn();
const mockSearchMangaCandidates = vi.fn();
const mockUpdateEntryDraft = vi.fn();

vi.mock("@/api/mangadex", () => ({
  searchMangaCandidates: (...args: unknown[]) => mockSearchMangaCandidates(...args),
  getCovers: (...args: unknown[]) => mockGetCovers(...args),
}));

vi.mock("@/components/admin/context/new_entry_context", () => ({
  useNewEntryContext: () => ({ updateEntryDraft: mockUpdateEntryDraft }),
}));

vi.mock("@/components/shared/cover_image", () => ({
  CoverImage: ({ title }: { title: string }) => <div data-testid="cover-image">{title}</div>,
}));

const CANDIDATES = [
  { id: "id-correct", title: "Berserk" },
  { id: "id-other", title: "Berserk: The Prototype" },
];

const COVERS = [
  { id: "cov-1", volume: "1", locale: "ja", url: "/cover.jpg", thumbUrl: "/cover.512.jpg" },
];

beforeEach(() => {
  vi.clearAllMocks();
  mockGetCovers.mockResolvedValue(COVERS);
});

describe("CoverPickerModal — load flow", () => {
  test("calls getCovers with candidates[0].id on successful auto-match", async () => {
    mockSearchMangaCandidates.mockResolvedValue(CANDIDATES);
    render(<CoverPickerModal title="Berserk" onClose={vi.fn()} />);
    await waitFor(() => expect(mockGetCovers).toHaveBeenCalledWith("id-correct"));
  });

  test("shows the auto-matched title in the header", async () => {
    mockSearchMangaCandidates.mockResolvedValue(CANDIDATES);
    render(<CoverPickerModal title="Berserk" onClose={vi.fn()} />);
    await waitFor(() =>
      expect(screen.getByText(/Showing covers for: Berserk/)).toBeInTheDocument(),
    );
  });

  test("shows manual search input when candidates array is empty", async () => {
    mockSearchMangaCandidates.mockResolvedValue([]);
    render(<CoverPickerModal title="xyzzy" onClose={vi.fn()} />);
    await waitFor(() =>
      expect(screen.getByPlaceholderText("Enter a title...")).toBeInTheDocument(),
    );
    expect(mockGetCovers).not.toHaveBeenCalled();
  });
});

describe("CoverPickerModal — candidate selection", () => {
  test("reloads covers with the selected candidate's id when a different candidate is picked", async () => {
    mockSearchMangaCandidates.mockResolvedValue(CANDIDATES);
    render(<CoverPickerModal title="Berserk" onClose={vi.fn()} />);

    await waitFor(() => screen.getByText("Wrong title?"));
    await userEvent.click(screen.getByText("Wrong title?"));

    await waitFor(() => screen.getByText("Berserk: The Prototype"));
    await userEvent.click(screen.getByText("Berserk: The Prototype"));

    await waitFor(() => expect(mockGetCovers).toHaveBeenLastCalledWith("id-other"));
  });
});

describe("CoverPickerModal — manual search", () => {
  test("calls searchMangaCandidates with the typed query on submit", async () => {
    mockSearchMangaCandidates.mockResolvedValue([]);
    render(<CoverPickerModal title="xyzzy" onClose={vi.fn()} />);

    await waitFor(() => screen.getByPlaceholderText("Enter a title..."));
    await userEvent.type(screen.getByPlaceholderText("Enter a title..."), "Berserk");
    await userEvent.click(screen.getByRole("button", { name: "Search" }));

    expect(mockSearchMangaCandidates).toHaveBeenCalledWith("Berserk", 5);
  });

  test("shows returned candidates after a manual search", async () => {
    mockSearchMangaCandidates
      .mockResolvedValueOnce([]) // initial load → no match
      .mockResolvedValueOnce(CANDIDATES); // manual search result
    render(<CoverPickerModal title="xyzzy" onClose={vi.fn()} />);

    await waitFor(() => screen.getByPlaceholderText("Enter a title..."));
    await userEvent.type(screen.getByPlaceholderText("Enter a title..."), "Berserk");
    await userEvent.click(screen.getByRole("button", { name: "Search" }));

    await waitFor(() => expect(screen.getByText("Berserk")).toBeInTheDocument());
  });
});

describe("CoverPickerModal — Search instead", () => {
  test("pre-populates search input with entry title when opened via 'Search instead'", async () => {
    mockSearchMangaCandidates.mockResolvedValue(CANDIDATES);
    render(<CoverPickerModal title="Berserk" onClose={vi.fn()} />);

    await waitFor(() => screen.getByText("Wrong title?"));
    await userEvent.click(screen.getByText("Wrong title?"));
    await waitFor(() => screen.getByText("Search instead"));
    await userEvent.click(screen.getByText("Search instead"));

    const input = screen.getByPlaceholderText("Enter a title...") as HTMLInputElement;
    expect(input.value).toBe("Berserk");
  });

  test("search input is empty when auto-triggered by no-match (not via 'Search instead')", async () => {
    mockSearchMangaCandidates.mockResolvedValue([]);
    render(<CoverPickerModal title="xyzzy" onClose={vi.fn()} />);

    await waitFor(() => screen.getByPlaceholderText("Enter a title..."));
    const input = screen.getByPlaceholderText("Enter a title...") as HTMLInputElement;
    expect(input.value).toBe("");
  });
});

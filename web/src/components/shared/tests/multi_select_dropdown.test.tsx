import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { MultiSelectDropdown } from "../multi_select_dropdown";

vi.mock("@material-tailwind/react", () => ({
  Button: ({
    children,
    onClick,
    className,
    "aria-label": ariaLabel,
  }: React.ButtonHTMLAttributes<HTMLButtonElement> & { "aria-label"?: string }) => (
    <button onClick={onClick} aria-label={ariaLabel} className={className}>
      {children}
    </button>
  ),
}));

const FLAT_OPTIONS = [
  { label: "Fantasy", value: "Fantasy" },
  { label: "Action", value: "Action" },
  { label: "Romance", value: "Romance" },
];

const GROUPED_OPTIONS = [
  {
    label: "Sub-genres",
    options: [
      { label: "Cyberpunk", value: "Cyberpunk" },
      { label: "Noir", value: "Noir" },
    ],
  },
  {
    label: "Demographic",
    options: [
      { label: "Seinen", value: "Seinen" },
      { label: "Shounen", value: "Shounen" },
    ],
  },
];

describe("MultiSelectDropdown — flat options", () => {
  test("shows placeholder when nothing is selected and dropdown is closed", () => {
    render(
      <MultiSelectDropdown
        label="Genres"
        options={FLAT_OPTIONS}
        selected={[]}
        onChange={vi.fn()}
        placeholder="Select genres"
      />,
    );
    expect(screen.getByText("Select genres")).toBeInTheDocument();
  });

  test("shows 'None selected' as default placeholder when prop is omitted", () => {
    render(
      <MultiSelectDropdown
        label="Genres"
        options={FLAT_OPTIONS}
        selected={[]}
        onChange={vi.fn()}
      />,
    );
    expect(screen.getByText("None selected")).toBeInTheDocument();
  });

  test("renders options as checkboxes when opened", async () => {
    const user = userEvent.setup();
    render(
      <MultiSelectDropdown
        label="Genres"
        options={FLAT_OPTIONS}
        selected={[]}
        onChange={vi.fn()}
      />,
    );
    await user.click(screen.getByRole("button"));
    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes).toHaveLength(3);
    expect(screen.getByLabelText("Fantasy")).toBeInTheDocument();
    expect(screen.getByLabelText("Action")).toBeInTheDocument();
    expect(screen.getByLabelText("Romance")).toBeInTheDocument();
  });

  test("calls onChange with the selected value when a checkbox is checked", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <MultiSelectDropdown
        label="Genres"
        options={FLAT_OPTIONS}
        selected={[]}
        onChange={onChange}
      />,
    );
    await user.click(screen.getByRole("button"));
    await user.click(screen.getByLabelText("Fantasy"));
    expect(onChange).toHaveBeenCalledWith(["Fantasy"]);
  });

  test("calls onChange with value removed when an already-selected checkbox is unchecked", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <MultiSelectDropdown
        label="Genres"
        options={FLAT_OPTIONS}
        selected={["Fantasy", "Action"]}
        onChange={onChange}
      />,
    );
    await user.click(screen.getByRole("button"));
    await user.click(screen.getByLabelText("Fantasy"));
    expect(onChange).toHaveBeenCalledWith(["Action"]);
  });

  test("calls onChange with the full updated array including pre-existing selections", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <MultiSelectDropdown
        label="Genres"
        options={FLAT_OPTIONS}
        selected={["Action"]}
        onChange={onChange}
      />,
    );
    await user.click(screen.getByRole("button"));
    await user.click(screen.getByLabelText("Romance"));
    expect(onChange).toHaveBeenCalledWith(["Action", "Romance"]);
  });

  test("reflects selected state on checkboxes from controlled prop", async () => {
    const user = userEvent.setup();
    render(
      <MultiSelectDropdown
        label="Genres"
        options={FLAT_OPTIONS}
        selected={["Fantasy"]}
        onChange={vi.fn()}
      />,
    );
    await user.click(screen.getByRole("button"));
    expect(screen.getByLabelText("Fantasy")).toBeChecked();
    expect(screen.getByLabelText("Action")).not.toBeChecked();
  });
});

describe("MultiSelectDropdown — grouped options", () => {
  test("renders group headers when groups prop is used", async () => {
    const user = userEvent.setup();
    render(
      <MultiSelectDropdown
        label="Tags"
        groups={GROUPED_OPTIONS}
        selected={[]}
        onChange={vi.fn()}
      />,
    );
    await user.click(screen.getByRole("button"));
    expect(screen.getByText("Sub-genres")).toBeInTheDocument();
    expect(screen.getByText("Demographic")).toBeInTheDocument();
  });

  test("renders all options from all groups as checkboxes", async () => {
    const user = userEvent.setup();
    render(
      <MultiSelectDropdown
        label="Tags"
        groups={GROUPED_OPTIONS}
        selected={[]}
        onChange={vi.fn()}
      />,
    );
    await user.click(screen.getByRole("button"));
    expect(screen.getAllByRole("checkbox")).toHaveLength(4);
    expect(screen.getByLabelText("Cyberpunk")).toBeInTheDocument();
    expect(screen.getByLabelText("Noir")).toBeInTheDocument();
    expect(screen.getByLabelText("Seinen")).toBeInTheDocument();
    expect(screen.getByLabelText("Shounen")).toBeInTheDocument();
  });

  test("calls onChange when a grouped option is toggled", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <MultiSelectDropdown
        label="Tags"
        groups={GROUPED_OPTIONS}
        selected={[]}
        onChange={onChange}
      />,
    );
    await user.click(screen.getByRole("button"));
    await user.click(screen.getByLabelText("Cyberpunk"));
    expect(onChange).toHaveBeenCalledWith(["Cyberpunk"]);
  });
});

describe("MultiSelectDropdown — open/close behaviour", () => {
  test("dropdown is closed by default", () => {
    render(
      <MultiSelectDropdown
        label="Genres"
        options={FLAT_OPTIONS}
        selected={[]}
        onChange={vi.fn()}
      />,
    );
    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
  });

  test("clicking the trigger opens the dropdown", async () => {
    const user = userEvent.setup();
    render(
      <MultiSelectDropdown
        label="Genres"
        options={FLAT_OPTIONS}
        selected={[]}
        onChange={vi.fn()}
      />,
    );
    await user.click(screen.getByRole("button"));
    expect(screen.getAllByRole("checkbox").length).toBeGreaterThan(0);
  });

  test("clicking outside closes the dropdown", async () => {
    const user = userEvent.setup();
    render(
      <div>
        <MultiSelectDropdown
          label="Genres"
          options={FLAT_OPTIONS}
          selected={[]}
          onChange={vi.fn()}
        />
        <div data-testid="outside">outside</div>
      </div>,
    );
    await user.click(screen.getByRole("button"));
    expect(screen.getAllByRole("checkbox").length).toBeGreaterThan(0);
    await user.click(screen.getByTestId("outside"));
    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
  });
});

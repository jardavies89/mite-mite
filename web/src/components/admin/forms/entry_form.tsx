import { useState } from "react";
import { Input, Typography } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import classNames from "classnames";

import { Strings, translate } from "@/constants/strings";
import { MediaSearch, type SearchResult } from "@/components/admin";

import { FranchisePicker, TagPicker, type FranchiseOption, type Medium } from "@/components/admin";

const GENRES = [
  "Action",
  "Adventure",
  "Animation",
  "Biography",
  "Comedy",
  "Crime",
  "Documentary",
  "Drama",
  "Ecchi",
  "Fantasy",
  "Family",
  "History",
  "Horror",
  "Mahou Shoujo",
  "Mecha",
  "Music",
  "Mystery",
  "Psychological",
  "Romance",
  "Sci-Fi",
  "Slice of Life",
  "Sports",
  "Supernatural",
  "Thriller",
  "War",
  "Western",
];

type ReferenceLink = {
  category: "read" | "buy" | "watch";
  url: string;
  label: string;
};

type EntryFormState = {
  medium: Medium | null;
  manualMode: boolean;
  primaryTitle: string;
  alternateTitles: string[];
  coverImageUrl: string;
  genres: string[];
  tagIds: string[];
  franchise: FranchiseOption | null;
  referenceLinks: ReferenceLink[];
};

const INITIAL_STATE: EntryFormState = {
  medium: null,
  manualMode: false,
  primaryTitle: "",
  alternateTitles: [],
  coverImageUrl: "",
  genres: [],
  tagIds: [],
  franchise: null,
  referenceLinks: [],
};

const MEDIUMS: { value: Medium; label: string }[] = [
  { value: "manga", label: Strings.entry.manga },
  { value: "book", label: Strings.entry.book },
  { value: "movie_show", label: Strings.entry.movieShow },
];

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <Typography
      variant="small"
      className="font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide text-xs mb-2"
    >
      {children}
    </Typography>
  );
}

function EntryForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState<EntryFormState>(INITIAL_STATE);

  function patch(update: Partial<EntryFormState>) {
    setForm((prev) => ({ ...prev, ...update }));
  }

  function handleSearchSelect(result: SearchResult) {
    patch({
      primaryTitle: result.title,
      coverImageUrl: result.thumbnailUrl ?? "",
      manualMode: false,
    });
  }

  function handleContinueManually() {
    patch({ manualMode: true });
  }

  function handleMediumChange(medium: Medium) {
    patch({ medium, manualMode: false, primaryTitle: "", coverImageUrl: "" });
  }

  function addAlternateTitle() {
    patch({ alternateTitles: [...form.alternateTitles, ""] });
  }

  function updateAlternateTitle(index: number, value: string) {
    const next = [...form.alternateTitles];
    next[index] = value;
    patch({ alternateTitles: next });
  }

  function removeAlternateTitle(index: number) {
    patch({ alternateTitles: form.alternateTitles.filter((_, i) => i !== index) });
  }

  function toggleGenre(genre: string) {
    if (form.genres.includes(genre)) {
      patch({ genres: form.genres.filter((g) => g !== genre) });
    } else {
      patch({ genres: [...form.genres, genre] });
    }
  }

  function addReferenceLink(category: ReferenceLink["category"]) {
    patch({ referenceLinks: [...form.referenceLinks, { category, url: "", label: "" }] });
  }

  function updateReferenceLink(index: number, field: keyof ReferenceLink, value: string) {
    const next = [...form.referenceLinks];
    next[index] = { ...next[index], [field]: value };
    patch({ referenceLinks: next });
  }

  function removeReferenceLink(index: number) {
    patch({ referenceLinks: form.referenceLinks.filter((_, i) => i !== index) });
  }

  const showForm = form.medium !== null && (form.manualMode || form.primaryTitle !== "");
  const showSearch = form.medium !== null && !form.manualMode;

  return (
    <div className="flex flex-col gap-6">
      {/* Medium selector */}
      <div>
        <SectionHeading>{Strings.entry.medium}</SectionHeading>
        <div className="flex gap-2 flex-wrap">
          {MEDIUMS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => handleMediumChange(value)}
              className={classNames(
                "px-4 py-2 rounded-full text-sm font-medium border transition-colors",
                form.medium === value
                  ? "bg-blue-600 border-blue-600 text-white"
                  : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-blue-400",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Prompt before medium is selected */}
      {!form.medium && (
        <p className="text-gray-400 dark:text-gray-500 text-sm">{Strings.entry.selectMedium}</p>
      )}

      {/* Search */}
      {showSearch && (
        <div>
          <SectionHeading>{Strings.entry.searchResults}</SectionHeading>
          <MediaSearch
            medium={form.medium!}
            onSelect={handleSearchSelect}
            onContinueManually={handleContinueManually}
          />
        </div>
      )}

      {/* Manual mode toggle (shown after search, before manual entry) */}
      {form.medium && !form.manualMode && form.primaryTitle === "" && (
        <div className="text-right">
          <button
            type="button"
            onClick={handleContinueManually}
            className="text-sm text-blue-600 dark:text-blue-400 underline hover:no-underline"
          >
            {Strings.entry.continueManually}
          </button>
        </div>
      )}

      {/* Form fields — shown after selecting a result or entering manual mode */}
      {showForm && (
        <>
          {/* Cover + primary title */}
          <div className="flex gap-4 items-start">
            <div className="flex-shrink-0 w-24 h-32 rounded-md overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              {form.coverImageUrl ? (
                <img
                  src={form.coverImageUrl}
                  alt={Strings.entry.coverPreview}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-400 dark:text-gray-600 text-xs text-center px-1">
                  {Strings.entry.coverPreview}
                </span>
              )}
            </div>

            <div className="flex-1 flex flex-col gap-3">
              <Input
                label={Strings.entry.primaryTitle}
                value={form.primaryTitle}
                onChange={(e) => patch({ primaryTitle: e.target.value })}
              />

              {form.manualMode && (
                <Input
                  label={Strings.entry.coverImageUrl}
                  value={form.coverImageUrl}
                  onChange={(e) => patch({ coverImageUrl: e.target.value })}
                  placeholder="https://..."
                />
              )}
            </div>
          </div>

          {/* Alternate titles */}
          <div>
            <SectionHeading>{Strings.entry.alternateTitles}</SectionHeading>
            <div className="flex flex-col gap-2">
              {form.alternateTitles.map((title, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <div className="flex-1">
                    <Input
                      label={translate(Strings.entry.alternateTitleLabel, { n: String(i + 1) })}
                      value={title}
                      onChange={(e) => updateAlternateTitle(i, e.target.value)}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeAlternateTitle(i)}
                    className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 text-lg leading-none flex-shrink-0 mt-1"
                    aria-label={Strings.entry.removeAlternateTitle}
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addAlternateTitle}
                className="self-start text-sm text-blue-600 dark:text-blue-400 underline hover:no-underline"
              >
                + {Strings.entry.addAlternateTitle}
              </button>
            </div>
          </div>

          {/* Genres */}
          <div>
            <SectionHeading>{Strings.entry.genres}</SectionHeading>
            <div className="flex flex-wrap gap-2">
              {GENRES.map((genre) => {
                const selected = form.genres.includes(genre);
                return (
                  <button
                    key={genre}
                    type="button"
                    onClick={() => toggleGenre(genre)}
                    className={classNames(
                      "px-3 py-1 rounded-full text-sm font-medium border transition-colors",
                      selected
                        ? "bg-blue-600 border-blue-600 text-white"
                        : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-blue-400",
                    )}
                  >
                    {genre}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tags */}
          <div>
            <SectionHeading>{Strings.entry.tags}</SectionHeading>
            <TagPicker selectedIds={form.tagIds} onChange={(ids) => patch({ tagIds: ids })} />
          </div>

          {/* Franchise */}
          <div>
            <SectionHeading>{Strings.entry.franchise}</SectionHeading>
            <FranchisePicker value={form.franchise} onChange={(f) => patch({ franchise: f })} />
          </div>

          {/* Reference links */}
          <div>
            <SectionHeading>{Strings.entry.referenceLinks}</SectionHeading>
            <div className="flex flex-col gap-4">
              {(["read", "buy", "watch"] as const).map((category) => {
                const links = form.referenceLinks.filter((l) => l.category === category);
                const categoryLabel =
                  category === "read"
                    ? Strings.entry.refLinkRead
                    : category === "buy"
                      ? Strings.entry.refLinkBuy
                      : Strings.entry.refLinkWatch;

                return (
                  <div key={category}>
                    <Typography
                      variant="small"
                      className="font-medium text-gray-600 dark:text-gray-400 mb-2"
                    >
                      {categoryLabel}
                    </Typography>

                    {links.map((link) => {
                      const globalIndex = form.referenceLinks.indexOf(link);
                      return (
                        <div key={globalIndex} className="flex gap-2 items-start mb-2">
                          <div className="flex-1 flex gap-2">
                            <div className="flex-1">
                              <Input
                                label={Strings.entry.refLinkUrl}
                                value={link.url}
                                onChange={(e) =>
                                  updateReferenceLink(globalIndex, "url", e.target.value)
                                }
                                placeholder="https://..."
                              />
                            </div>
                            <div className="w-36">
                              <Input
                                label={Strings.entry.refLinkLabel}
                                value={link.label}
                                onChange={(e) =>
                                  updateReferenceLink(globalIndex, "label", e.target.value)
                                }
                              />
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeReferenceLink(globalIndex)}
                            className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 text-lg leading-none flex-shrink-0 mt-3"
                            aria-label={Strings.entry.removeReferenceLink}
                          >
                            ×
                          </button>
                        </div>
                      );
                    })}

                    <button
                      type="button"
                      onClick={() => addReferenceLink(category)}
                      className="text-sm text-blue-600 dark:text-blue-400 underline hover:no-underline"
                    >
                      + {Strings.entry.refLinkAdd}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-2 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => navigate("/admin")}
              className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              {Strings.entry.cancel}
            </button>
            <button
              type="button"
              onClick={() => {}}
              className="px-4 py-2 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              {Strings.entry.save}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export { EntryForm };

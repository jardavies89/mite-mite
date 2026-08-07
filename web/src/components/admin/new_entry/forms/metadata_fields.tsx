import { Button } from "@material-tailwind/react";

import { useNewEntryContext } from "@/components/admin/context/new_entry_context";

import { Strings, translate } from "@/constants/strings";
import { Medium } from "@/constants/types";
import { SelectInput } from "@/components/shared/form_fields/select_input";
import { TextInput } from "@/components/shared/form_fields/text_input";

const STYLE_OPTIONS = [
  { label: Strings.metadata.styleAnime, value: "ANIME" as const },
  { label: Strings.metadata.styleLiveAction, value: "LIVE_ACTION" as const },
];

function toNumber(value: string): number | undefined {
  const n = parseInt(value, 10);
  return isNaN(n) ? undefined : n;
}

function MangaFields({ metadata }: { metadata: MangaMetadata }) {
  const { updateEntryDraft } = useNewEntryContext();

  function update(patch: Partial<MangaMetadata>) {
    updateEntryDraft({ metadata: { ...metadata, ...patch } });
  }

  function addPublisher() {
    update({ publishers: [...(metadata.publishers ?? []), ""] });
  }

  function updatePublisher(index: number, value: string) {
    const next = [...(metadata.publishers ?? [])];
    next[index] = value;
    update({ publishers: next });
  }

  function removePublisher(index: number) {
    update({ publishers: (metadata.publishers ?? []).filter((_, i) => i !== index) });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4">
        <div className="flex-1">
          <TextInput
            id="metadata-volume-count"
            label={Strings.metadata.volumeCount}
            currentValue={metadata.volumeCount?.toString() ?? ""}
            onChange={(e) => update({ volumeCount: toNumber(e.target.value) })}
          />
        </div>
        <div className="flex-1">
          <TextInput
            id="metadata-chapter-count"
            label={Strings.metadata.chapterCount}
            currentValue={metadata.chapterCount?.toString() ?? ""}
            onChange={(e) => update({ chapterCount: toNumber(e.target.value) })}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label>{Strings.metadata.publishers}</label>
        {(metadata.publishers ?? []).map((pub, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              type="text"
              className="w-full rounded-md border px-3 py-2"
              value={pub}
              onChange={(e) => updatePublisher(i, e.target.value)}
            />
            <Button
              variant="text"
              onClick={() => removePublisher(i)}
              className="normal-case text-subtle hover:text-red-500 flex-shrink-0"
              aria-label={Strings.metadata.removePublisher}
            >
              −
            </Button>
          </div>
        ))}
        <Button
          variant="text"
          color="blue"
          onClick={addPublisher}
          className="normal-case self-start text-sm underline hover:no-underline p-0"
        >
          + {Strings.metadata.addPublisher}
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <TextInput
            id="metadata-start-date"
            label={Strings.metadata.startDate}
            currentValue={metadata.startDate ?? ""}
            onChange={(e) => update({ startDate: e.target.value || undefined })}
          />
        </div>
        <div className="flex-1">
          <TextInput
            id="metadata-end-date"
            label={Strings.metadata.endDate}
            currentValue={metadata.endDate ?? ""}
            onChange={(e) => update({ endDate: e.target.value || undefined })}
          />
        </div>
      </div>
    </div>
  );
}

function ShowFields({ metadata }: { metadata: ShowMetadata }) {
  const { updateEntryDraft } = useNewEntryContext();

  function update(patch: Partial<ShowMetadata>) {
    updateEntryDraft({ metadata: { ...metadata, ...patch } });
  }

  function addSeason() {
    update({ seasons: [...(metadata.seasons ?? []), {}] });
  }

  function removeSeason(index: number) {
    update({ seasons: (metadata.seasons ?? []).filter((_, i) => i !== index) });
  }

  function updateSeason(index: number, patch: Partial<Season>) {
    const next = [...(metadata.seasons ?? [])];
    next[index] = { ...next[index], ...patch };
    update({ seasons: next });
  }

  return (
    <div className="flex flex-col gap-4">
      <SelectInput
        id="metadata-style"
        label={Strings.metadata.style}
        currentValue={metadata.style ?? null}
        options={STYLE_OPTIONS}
        onChange={(e) => update({ style: (e.target.value as ShowMetadata["style"]) || undefined })}
      />
      <TextInput
        id="metadata-studio"
        label={Strings.metadata.studio}
        currentValue={metadata.studio ?? ""}
        onChange={(e) => update({ studio: e.target.value || undefined })}
      />
      <div className="flex gap-4">
        <div className="flex-1">
          <TextInput
            id="metadata-start-date"
            label={Strings.metadata.startDate}
            currentValue={metadata.startDate ?? ""}
            onChange={(e) => update({ startDate: e.target.value || undefined })}
          />
        </div>
        <div className="flex-1">
          <TextInput
            id="metadata-end-date"
            label={Strings.metadata.endDate}
            currentValue={metadata.endDate ?? ""}
            onChange={(e) => update({ endDate: e.target.value || undefined })}
          />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {(metadata.seasons ?? []).map((season, i) => (
          <div key={i} className="flex flex-col gap-2 border rounded-md p-3">
            <div className="flex items-center justify-between">
              <span className="font-medium text-sm">
                {translate(Strings.metadata.seasonLabel, { n: String(i + 1) })}
              </span>
              <Button
                variant="text"
                onClick={() => removeSeason(i)}
                className="normal-case text-subtle hover:text-red-500 text-sm p-1"
              >
                {Strings.metadata.removeSeason}
              </Button>
            </div>
            <TextInput
              id={`season-${i}-episode-count`}
              label={Strings.metadata.episodeCount}
              currentValue={season.episodeCount?.toString() ?? ""}
              onChange={(e) => updateSeason(i, { episodeCount: toNumber(e.target.value) })}
            />
            <TextInput
              id={`season-${i}-start-date`}
              label={Strings.metadata.startDate}
              currentValue={season.startDate ?? ""}
              onChange={(e) => updateSeason(i, { startDate: e.target.value || undefined })}
            />
            <TextInput
              id={`season-${i}-end-date`}
              label={Strings.metadata.endDate}
              currentValue={season.endDate ?? ""}
              onChange={(e) => updateSeason(i, { endDate: e.target.value || undefined })}
            />
          </div>
        ))}

        <Button
          variant="text"
          color="blue"
          onClick={addSeason}
          className="normal-case self-start text-sm underline hover:no-underline p-0"
        >
          + {Strings.metadata.addSeason}
        </Button>
      </div>
    </div>
  );
}

function MovieFields({ metadata }: { metadata: MovieMetadata }) {
  const { updateEntryDraft } = useNewEntryContext();

  function update(patch: Partial<MovieMetadata>) {
    updateEntryDraft({ metadata: { ...metadata, ...patch } });
  }

  return (
    <div className="flex flex-col gap-4">
      <TextInput
        id="metadata-runtime"
        label={Strings.metadata.runtimeMinutes}
        currentValue={metadata.runtime?.toString() ?? ""}
        onChange={(e) => update({ runtime: toNumber(e.target.value) })}
      />
      <TextInput
        id="metadata-studio"
        label={Strings.metadata.studio}
        currentValue={metadata.studio ?? ""}
        onChange={(e) => update({ studio: e.target.value || undefined })}
      />
      <TextInput
        id="metadata-release-date"
        label={Strings.metadata.releaseDate}
        currentValue={metadata.releaseDate ?? ""}
        onChange={(e) => update({ releaseDate: e.target.value || undefined })}
      />
    </div>
  );
}

function MetadataFields() {
  const { newEntryDraft } = useNewEntryContext();
  const { medium, metadata } = newEntryDraft;

  if (medium === Medium.Manga) {
    return <MangaFields metadata={(metadata as MangaMetadata) ?? {}} />;
  }
  if (medium === Medium.Show) {
    return <ShowFields metadata={(metadata as ShowMetadata) ?? {}} />;
  }
  if (medium === Medium.Movie) {
    return <MovieFields metadata={(metadata as MovieMetadata) ?? {}} />;
  }

  return null;
}

export { MetadataFields };

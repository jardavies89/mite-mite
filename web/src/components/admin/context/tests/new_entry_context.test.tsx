import { render, act } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { NewEntryProvider, useNewEntryContext } from "../new_entry_context";
import type { NewEntryContextValue } from "../new_entry_context";
import { Medium } from "@/constants/types";
import type { MangaMetadata } from "@/constants/metadata_types";

function Probe({ onRender }: { onRender: (ctx: NewEntryContextValue) => void }) {
  const ctx = useNewEntryContext();
  onRender(ctx);
  return null;
}

describe("NewEntryContext", () => {
  describe("updateEntryDraft", () => {
    it("clears metadata when medium changes", () => {
      let latestCtx!: NewEntryContextValue;

      render(
        <NewEntryProvider>
          <Probe
            onRender={(ctx) => {
              latestCtx = ctx;
            }}
          />
        </NewEntryProvider>,
      );

      const mangaMetadata: MangaMetadata = { volumeCount: 12, publishers: ["Jump"] };

      act(() => {
        latestCtx.updateEntryDraft({ medium: Medium.Manga });
      });
      act(() => {
        latestCtx.updateEntryDraft({ metadata: mangaMetadata });
      });

      expect(latestCtx.newEntryDraft.metadata).toEqual(mangaMetadata);

      act(() => {
        latestCtx.updateEntryDraft({ medium: Medium.Show });
      });

      expect(latestCtx.newEntryDraft.metadata).toBeNull();
    });

    it("preserves metadata when the same medium is set again", () => {
      let latestCtx!: NewEntryContextValue;

      render(
        <NewEntryProvider>
          <Probe
            onRender={(ctx) => {
              latestCtx = ctx;
            }}
          />
        </NewEntryProvider>,
      );

      const mangaMetadata: MangaMetadata = { volumeCount: 12 };

      act(() => {
        latestCtx.updateEntryDraft({ medium: Medium.Manga });
      });
      act(() => {
        latestCtx.updateEntryDraft({ metadata: mangaMetadata });
      });
      act(() => {
        latestCtx.updateEntryDraft({ medium: Medium.Manga });
      });

      expect(latestCtx.newEntryDraft.metadata).toEqual(mangaMetadata);
    });
  });
});

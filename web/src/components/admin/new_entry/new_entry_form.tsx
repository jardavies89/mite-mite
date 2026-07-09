import { useNewEntryContext } from "@/components/admin";
import { MangaSearch } from "@/components/admin/new_entry/search/manga_search";

function NewEntryForm() {
  const { updateEntryDraft } = useNewEntryContext();

  function onMangaSelected(result: MangaSearchResult) {
    console.log(result);

    // updateEntryDraft({
    //   primaryTitle: result.title.romaji ?? result.title.english ?? "",
    // });
  }

  return (
    <>
      <MangaSearch onSelect={onMangaSelected} />
    </>
  );
}

export { NewEntryForm };

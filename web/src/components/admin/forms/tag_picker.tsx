import { Tooltip, Typography } from "@material-tailwind/react";
import classNames from "classnames";

export type Tag = {
  id: string;
  name: string;
  description?: string;
};

const SAMPLE_TAGS: Tag[] = [
  { id: "1", name: "Isekai", description: "Protagonist transported or reincarnated into another world" },
  { id: "2", name: "Time Travel", description: "Characters travel through time" },
  { id: "3", name: "Magic", description: "Contains magical elements or abilities" },
  { id: "4", name: "School", description: "Set primarily in a school environment" },
  { id: "5", name: "Demons", description: "Features demonic characters as a major element" },
  { id: "6", name: "Military", description: "Features military organizations and warfare" },
  { id: "7", name: "Psychological", description: "Explores complex psychological themes" },
  { id: "8", name: "Romance", description: "Focuses on romantic relationships" },
  { id: "9", name: "Superpower", description: "Characters possess supernatural abilities" },
  { id: "10", name: "Comedy", description: "Primarily comedic in tone" },
  { id: "11", name: "Based on a Manga", description: "Adapted from a manga source" },
  { id: "12", name: "Survival", description: "Characters must survive extreme circumstances" },
  { id: "13", name: "Revenge", description: "Central theme of seeking vengeance" },
  { id: "14", name: "Harem", description: "Protagonist surrounded by multiple romantic interests" },
  { id: "15", name: "Cooking", description: "Food preparation is a central theme" },
  { id: "16", name: "Sports", description: "Centered around athletic competition" },
  { id: "17", name: "Music", description: "Music or musicians are a central focus" },
  { id: "18", name: "Historical", description: "Set in a historical period" },
];

type TagPickerProps = {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  tags?: Tag[];
};

function TagPicker({ selectedIds, onChange, tags = SAMPLE_TAGS }: TagPickerProps) {
  function toggle(id: string) {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((s) => s !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => {
        const selected = selectedIds.includes(tag.id);
        const chip = (
          <button
            key={tag.id}
            type="button"
            onClick={() => toggle(tag.id)}
            className={classNames(
              "px-3 py-1 rounded-full text-sm font-medium border transition-colors cursor-pointer",
              selected
                ? "bg-blue-600 border-blue-600 text-white"
                : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-blue-400 dark:hover:border-blue-500",
            )}
          >
            {tag.name}
          </button>
        );

        if (tag.description) {
          return (
            <Tooltip key={tag.id} content={tag.description} placement="top">
              {chip}
            </Tooltip>
          );
        }

        return chip;
      })}

      {tags.length === 0 && (
        <Typography variant="small" className="text-gray-400 dark:text-gray-500 italic">
          No tags available.
        </Typography>
      )}
    </div>
  );
}

export { TagPicker, SAMPLE_TAGS };

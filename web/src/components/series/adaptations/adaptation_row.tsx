import { Link } from "react-router-dom";

import { buildAdaptationPreview } from "./adaptation_preview";

interface PropTypes {
  franchiseId: string;
  entry: Entry;
}

function AdaptationRow({ franchiseId, entry }: PropTypes) {
  const preview = buildAdaptationPreview(entry);

  return (
    <Link
      to={`/series/${franchiseId}/entries/${entry.id}`}
      className="flex flex-col py-2 hover:opacity-70 transition-opacity"
    >
      <span className="font-medium">{entry.primaryTitle}</span>
      <span className="text-sm text-muted">{preview}</span>
    </Link>
  );
}

export { AdaptationRow };

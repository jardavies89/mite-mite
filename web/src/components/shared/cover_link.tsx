import { Link } from "react-router-dom";

import { CoverImage } from "@/components/shared/cover_image";

interface PropTypes {
  href: string;
  coverUrl: string | null;
  title: string;
}

function CoverLink({ href, coverUrl, title }: PropTypes) {
  return (
    <Link to={href} className="flex flex-col gap-2 group">
      <CoverImage coverUrl={coverUrl} title={title} />
      <span className="text-sm text-center truncate">{title}</span>
    </Link>
  );
}

export { CoverLink };

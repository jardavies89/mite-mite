interface PropTypes {
  coverUrl: string | null;
  title: string;
}

function CoverImage({ coverUrl, title }: PropTypes) {
  return (
    <img
      src={coverUrl ?? ""}
      alt={title}
      className="w-full rounded border border-default group-hover:border-gray-500 dark:group-hover:border-gray-300 transition-colors object-cover"
    />
  );
}

export { CoverImage };

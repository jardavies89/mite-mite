interface PropTypes {
  label: string;
}

function Chip({ label }: PropTypes) {
  return (
    <span className="border border-default rounded-md px-2 py-1 text-xs font-bold uppercase">
      {label}
    </span>
  );
}

export { Chip };

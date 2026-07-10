import type { ChangeEventHandler } from "react";

interface PropTypes {
  currentValue: string;
  label: string;
  id: string;
  onChange: ChangeEventHandler<HTMLTextAreaElement>;
  placeholder?: string;
  rows?: number;
}

function TextareaInput({
  currentValue,
  label,
  id,
  onChange,
  placeholder = "",
  rows = 4,
}: PropTypes) {
  return (
    <>
      <label htmlFor={id}>{label}</label>

      <textarea
        className="w-full rounded-md border px-3 py-2 resize-none"
        id={id}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        value={currentValue}
      />
    </>
  );
}

export { TextareaInput };

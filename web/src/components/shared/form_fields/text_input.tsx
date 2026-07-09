import type { ChangeEventHandler } from "react";

interface PropTypes {
  currentValue: string;
  label: string;
  id: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  placeholder: string;
}

function TextInput({ currentValue, label, id, onChange, placeholder }: PropTypes) {
  return (
    <>
      <label className="mb-2" htmlFor={id}>
        {label}
      </label>

      <input
        className="w-full rounded-md border px-3 py-2"
        id={id}
        onChange={onChange}
        placeholder={placeholder}
        type="text"
        value={currentValue}
      />
    </>
  );
}

export { TextInput };

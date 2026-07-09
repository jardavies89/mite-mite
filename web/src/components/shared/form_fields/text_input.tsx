import type { ChangeEventHandler } from "react";
import { Input } from "@material-tailwind/react";

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
      <label className="mb-2 text-gray-900 dark:text-white" htmlFor={id}>
        {label}
      </label>

      <Input
        className="text-gray-900 dark:text-white"
        id={id}
        onChange={onChange}
        placeholder={placeholder}
        title={label}
        type="text"
        value={currentValue}
      />
    </>
  );
}

export { TextInput };

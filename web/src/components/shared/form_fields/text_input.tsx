import type { ChangeEventHandler } from "react";
import classNames from "classnames";

interface PropTypes {
  currentValue: string;
  label: string;
  id: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  placeholder: string;
}

function TextInput({ currentValue, label, id, onChange, placeholder }: PropTypes) {
  const inputClassNames = classNames(
    "w-full rounded-md border border-gray-300 dark:border-gray-600",
    "bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-white",
    "placeholder-gray-400 dark:placeholder-gray-500",
    "focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white",
  );

  return (
    <>
      <label className="mb-2 text-gray-900 dark:text-white" htmlFor={id}>
        {label}
      </label>

      <input
        className={inputClassNames}
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

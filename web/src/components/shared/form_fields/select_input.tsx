import type { ChangeEventHandler } from "react";

interface SelectOption<T extends string> {
  label: string;
  value: T;
}

interface PropTypes<T extends string> {
  currentValue: T | null;
  id: string;
  label: string;
  onChange: ChangeEventHandler<HTMLSelectElement>;
  options: SelectOption<T>[];
  placeholder?: string;
}

function SelectInput<T extends string>({
  currentValue,
  id,
  label,
  onChange,
  options,
  placeholder = "Select...",
}: PropTypes<T>) {
  return (
    <>
      <label htmlFor={id}>{label}</label>

      <select
        id={id}
        value={currentValue ?? ""}
        onChange={onChange}
        className="w-full rounded-md border px-3 py-2 bg-white dark:bg-gray-800"
      >
        <option value="">{placeholder}</option>
        {options.map(({ value, label: optionLabel }) => (
          <option key={value} value={value}>{optionLabel}</option>
        ))}
      </select>
    </>
  );
}

export { SelectInput };
export type { SelectOption };

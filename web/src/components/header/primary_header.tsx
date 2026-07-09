import classNames from "classnames";

import { ThemeToggle } from "@/components/header";

function PrimaryHeader() {
  const headerClasses = classNames(
    "flex items-center justify-between",
    "h-12 px-6 py-4",
    "border-b border-default",
    "sticky top-0 z-10 bg-white dark:bg-gray-900",
  );

  return (
    <header className={headerClasses}>
      <ThemeToggle />
    </header>
  );
}

export { PrimaryHeader };

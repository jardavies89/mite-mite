import classNames from "classnames";

import { ThemeToggle } from "@/components/header";

function PrimaryHeader() {
  const headerClasses = classNames(
    "flex items-center justify-between",
    "h-12 px-6 py-4",
    "border-b border-default",
  );

  return (
    <header className={headerClasses}>
      <ThemeToggle />
    </header>
  );
}

export { PrimaryHeader };

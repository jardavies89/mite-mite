import classNames from "classnames";
import { Button } from "@material-tailwind/react";

import { ThemeToggle } from "@/components/header";
import { Strings } from "@/constants/strings";

function PrimaryHeader() {
  const headerClasses = classNames(
    "flex items-center justify-between",
    "h-12 px-6 py-4",
    "border-b border-default",
    "sticky top-0 z-10 bg-white dark:bg-gray-900",
  );

  return (
    <header className={headerClasses}>
      <div>
        <a href="/">
          <Button variant="text" color="white">
            {Strings.home.backButton}
          </Button>
        </a>
      </div>

      <div>
        <ThemeToggle />
      </div>
    </header>
  );
}

export { PrimaryHeader };

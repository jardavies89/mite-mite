import classNames from "classnames";
import { Button, Typography } from "@material-tailwind/react";

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
      <div className="flex items-center gap-3">
        <a href="/">
          <Button variant="text" className="normal-case text-gray-900 dark:text-white">
            {Strings.home.backButton}
          </Button>
        </a>

        <Typography variant="small" className="font-medium opacity-60">
          {Strings.home.title}
        </Typography>
      </div>

      <div>
        <ThemeToggle />
      </div>
    </header>
  );
}

export { PrimaryHeader };

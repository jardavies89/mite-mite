import { Typography } from "@material-tailwind/react";
import classNames from "classnames";

import PrimaryHeader from "@/components/header";
import { Strings } from "@/constants/strings";
import useMediaQuery from "../shared/use_media_query";

function HomePage() {
  const isMobileLayout = useMediaQuery("(max-width: 40em)");

  const wrapperClassNames = classNames("flex flex-col", "mx-auto py-8 height--mite-mite", {
    "px-4": isMobileLayout,
    "px-8 max-width--50": !isMobileLayout,
  });

  return (
    <>
      <PrimaryHeader />

      <main className="flex flex-col items-center h-full">
        <div className={wrapperClassNames}>
          <Typography variant="h2" className="text-gray-900 dark:text-white mb-2">
            {Strings.home.title}
          </Typography>

          <p className="mt-8 text-gray-500 dark:text-gray-500 text-sm">{Strings.home.emptyState}</p>
        </div>
      </main>
    </>
  );
}

export { HomePage };

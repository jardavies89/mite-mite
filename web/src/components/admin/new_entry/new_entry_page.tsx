import { Typography } from "@material-tailwind/react";
import classNames from "classnames";

import PrimaryHeader from "@/components/header";
import { EntryForm } from "@/components/admin";

import { Strings } from "@/constants/strings";
import useMediaQuery from "@/components/shared/hooks/use_media_query";

const isAdmin = Boolean(import.meta.env.VITE_ADMIN_SECRET);

function EntryFormPage() {
  const isMobileLayout = useMediaQuery("(max-width: 40em)");

  const wrapperClassNames = classNames("flex flex-col mx-auto py-8 height--mite-mite", {
    "px-4": isMobileLayout,
    "px-8 max-width--50": !isMobileLayout,
  });

  if (!isAdmin) {
    return (
      <>
        <PrimaryHeader />
        <main className="flex flex-col items-center pt-24 px-4">
          <p className="text-gray-500 dark:text-gray-400">
            {Strings.admin.noPermission}
          </p>
        </main>
      </>
    );
  }

  return (
    <>
      <PrimaryHeader />
      <main className="flex flex-col items-center h-full">
        <div className={wrapperClassNames}>
          <Typography variant="h4" className="text-gray-900 dark:text-white mb-6">
            {Strings.entry.new}
          </Typography>
          <EntryForm />
        </div>
      </main>
    </>
  );
}

export default EntryFormPage;

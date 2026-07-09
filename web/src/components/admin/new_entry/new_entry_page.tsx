import { Typography } from "@material-tailwind/react";
import classNames from "classnames";

import PrimaryHeader from "@/components/header";
import { NewEntryForm } from "@/components/admin/new_entry/new_entry_form";

import { NewEntryProvider } from "@/components/admin/context/new_entry_context";
import { Strings } from "@/constants/strings";
import useMediaQuery from "@/components/shared/hooks/use_media_query";

function EntryFormPage() {
  const { isMobileBreakpoint } = useMediaQuery();

  const wrapperClassNames = classNames("flex flex-col mx-auto py-8 w-full height--mite-mite", {
    "px-4": isMobileBreakpoint,
    "px-8 max-width--50": !isMobileBreakpoint,
  });

  return (
    <>
      <PrimaryHeader />
      <main className="flex flex-col items-center h-full">
        <div className={wrapperClassNames}>
          <Typography variant="h4" className="text-gray-900 dark:text-white mb-6">
            {Strings.admin.addNewEntry}
          </Typography>
          <NewEntryProvider>
            <NewEntryForm />
          </NewEntryProvider>
        </div>
      </main>
    </>
  );
}

export default EntryFormPage;

import { Typography } from "@material-tailwind/react";
import classNames from "classnames";
import { Link } from "react-router-dom";

import PrimaryHeader from "@/components/header";
import { Strings } from "@/constants/strings";
import useMediaQuery from "@/components/shared/hooks/use_media_query";

function AdminPage() {
  const isMobileLayout = useMediaQuery("(max-width: 40em)");

  const wrapperClassNames = classNames("flex flex-col mx-auto py-8 height--mite-mite", {
    "px-4": isMobileLayout,
    "px-8 max-width--50": !isMobileLayout,
  });

  return (
    <>
      <PrimaryHeader />
      <main className="flex flex-col items-center h-full">
        <div className={wrapperClassNames}>
          <Typography variant="h4" className="text-gray-900 dark:text-white mb-6">
            {Strings.admin.title}
          </Typography>
          <div className="flex flex-col gap-3">
            <Link
              to="/admin/new_entry"
              className="self-start px-4 py-2 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              {Strings.admin.addNewEntry}
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}

export default AdminPage;

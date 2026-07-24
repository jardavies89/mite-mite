import { Button, Typography } from "@material-tailwind/react";
import classNames from "classnames";
import { Link, useSearchParams } from "react-router-dom";

import { PageLayout } from "@/components/shared/page_layout";
import { useAdminSession } from "@/api/mite_mite";
import { Strings } from "@/constants/strings";
import useMediaQuery from "@/components/shared/hooks/use_media_query";

function AdminPage() {
  const { isMobileBreakpoint } = useMediaQuery();
  const { isAdmin } = useAdminSession();
  const [searchParams] = useSearchParams();
  const authError = searchParams.get("error");

  const wrapperClassNames = classNames("flex flex-col mx-auto w-full py-8 height--mite-mite", {
    "px-4": isMobileBreakpoint,
    "px-8 max-width--50": !isMobileBreakpoint,
  });

  return (
    <PageLayout>
      <div className={wrapperClassNames}>
        <Typography variant="h4" className="mb-6">
          {Strings.admin.title}
        </Typography>

        {authError && (
          <Typography color="red" className="mb-4">
            {Strings.auth.notAuthorized}
          </Typography>
        )}

        {isAdmin ? (
          <div className="flex flex-col gap-3">
            <Link
              to="/admin/new_entry"
              className="self-start px-4 py-2 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              {Strings.admin.addNewEntry}
            </Link>
          </div>
        ) : (
          <a href={`${import.meta.env.VITE_API_URL}/auth/github`}>
            <Button
              variant="filled"
              className="normal-case bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-300"
            >
              {Strings.auth.loginWithGitHub}
            </Button>
          </a>
        )}
      </div>
    </PageLayout>
  );
}

export default AdminPage;

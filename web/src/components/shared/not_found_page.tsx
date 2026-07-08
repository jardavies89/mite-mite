import { Typography, Button } from "@material-tailwind/react";
import { Link } from "react-router-dom";

import PrimaryHeader from "@/components/header";
import { Strings } from "@/constants/strings";

function NotFound() {
  return (
    <>
      <PrimaryHeader />
      <main className="flex flex-col items-center justify-center pt-24 px-4">
        <Typography variant="h3" className="text-gray-900 dark:text-white mb-4">
          {Strings.notFound.title}
        </Typography>
        <p className="text-gray-500 dark:text-gray-400 mb-8">{Strings.notFound.body}</p>
        <Link to="/">
          <Button variant="outlined">{Strings.notFound.goHome}</Button>
        </Link>
      </main>
    </>
  );
}

export default NotFound;

import { Typography, Button } from "@material-tailwind/react";
import { Link } from "react-router-dom";

import PrimaryHeader from "@/components/header";
import { Strings } from "@/constants/strings";

function NotFound() {
  return (
    <>
      <PrimaryHeader />
      <main className="flex flex-col items-center justify-center pt-24 px-4">
        <Typography variant="h3" className="mb-4">
          {Strings.notFound.title}
        </Typography>
        <p className="text-muted mb-8">{Strings.notFound.body}</p>
        <Link to="/">
          <Button variant="outlined" className="normal-case">
            {Strings.notFound.goHome}
          </Button>
        </Link>
      </main>
    </>
  );
}

export default NotFound;

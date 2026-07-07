import { Typography } from "@material-tailwind/react";
import { Strings } from "@/constants/strings";

export default function HomePage() {
  return (
    <div className="container mx-auto px-6 py-12">
      <Typography variant="h2" className="text-gray-900 dark:text-white mb-2">
        {Strings.home.title}
      </Typography>

      <p className="mt-8 text-gray-500 dark:text-gray-500 text-sm">{Strings.home.emptyState}</p>
    </div>
  );
}

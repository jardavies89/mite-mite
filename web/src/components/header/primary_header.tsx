import { ThemeToggle } from "@/components/header";

function PrimaryHeader() {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
      <ThemeToggle />
    </header>
  );
}

export { PrimaryHeader };

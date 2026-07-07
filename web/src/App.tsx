import { ThemeProvider } from "@material-tailwind/react";
import { useEffect, useState } from "react";

import { applyTheme, getStoredTheme, type Theme } from "@/styles/theme";

import HomePage from "@/components/home/home_page";
import ThemeToggle from "@/components/settings/theme_toggle";

function App() {
  const [theme, setTheme] = useState<Theme>(getStoredTheme);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((t) => (t === "light" ? "dark" : "light"));
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
        <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
        </header>
        <main>
          <HomePage />
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;

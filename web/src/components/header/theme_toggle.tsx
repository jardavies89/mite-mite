import { useEffect, useState } from "react";

import { IconButton, Tooltip } from "@material-tailwind/react";
import { CiDark, CiLight } from "react-icons/ci";

import { applyTheme, getStoredTheme, type Theme } from "@/styles/utils/theme";
import { Strings } from "@/constants/strings";

function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(getStoredTheme);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((currentTheme) => (currentTheme === "light" ? "dark" : "light"));
  }

  return (
    <Tooltip content="Toggle theme">
      <IconButton
        variant="text"
        onClick={toggleTheme}
        aria-label={theme === "dark" ? Strings.theme.toggleDark : Strings.theme.toggleLight}
      >
        {theme === "light" ? (
          <CiDark className="h-5 w-5 text-gray-700" />
        ) : (
          <CiLight className="h-5 w-5 text-white" />
        )}
      </IconButton>
    </Tooltip>
  );
}

export { ThemeToggle };

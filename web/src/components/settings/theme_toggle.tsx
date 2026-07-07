import { IconButton } from "@material-tailwind/react";
import { HiMoon, HiSun } from "react-icons/hi2";
import type { Theme } from "@/styles/theme";
import { Strings } from "@/constants/strings";

interface ThemeToggleProps {
  theme: Theme;
  onToggle: () => void;
}

export default function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  return (
    <IconButton
      variant="text"
      onClick={onToggle}
      aria-label={theme === "dark" ? Strings.theme.toggleDark : Strings.theme.toggleLight}
    >
      {theme === "light" ? (
        <HiMoon className="h-5 w-5 text-gray-700" />
      ) : (
        <HiSun className="h-5 w-5 text-yellow-400" />
      )}
    </IconButton>
  );
}

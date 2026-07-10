import { useEffect, useState } from "react";

const MOBILE_BREAKPOINT = "(max-width: 40em)";

function getMatches(query: string): boolean {
  if (typeof window !== "undefined") {
    return window.matchMedia(query).matches;
  }
  return false;
}

function useMediaQuery(): { isMobileBreakpoint: boolean } {
  const [isMobileBreakpoint, setIsMobileBreakpoint] = useState(() => getMatches(MOBILE_BREAKPOINT));

  useEffect(() => {
    const matchMedia = window.matchMedia(MOBILE_BREAKPOINT);

    function handleChange() {
      setIsMobileBreakpoint(getMatches(MOBILE_BREAKPOINT));
    }

    handleChange();
    matchMedia.addEventListener("change", handleChange);
    return () => matchMedia.removeEventListener("change", handleChange);
  }, []);

  return { isMobileBreakpoint };
}

export default useMediaQuery;

import { useEffect, useState } from "react";

type queryFnType = (query: string) => boolean;

const getMatches: queryFnType = (query) => {
  // Prevents SSR issues
  if (typeof window !== "undefined") {
    return window.matchMedia(query).matches;
  }
  return false;
};

const useMediaQuery: queryFnType = (query) => {
  const [matches, setMatches] = useState<boolean>(() => getMatches(query));

  useEffect(() => {
    const matchMedia = window.matchMedia(query);

    function handleChange() {
      setMatches(getMatches(query));
    }

    // Triggered at the first client-side load and if query changes
    handleChange();

    matchMedia.addEventListener("change", handleChange);

    return () => {
      matchMedia.removeEventListener("change", handleChange);
    };
  }, [query]);

  return matches;
};

export default useMediaQuery;

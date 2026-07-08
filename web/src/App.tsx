import { ThemeProvider } from "@material-tailwind/react";

import HomePage from "@/components/home_page";

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
        <HomePage />
      </div>
    </ThemeProvider>
  );
}

export default App;

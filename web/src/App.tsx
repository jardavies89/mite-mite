import { ThemeProvider } from "@material-tailwind/react";
import { Routes, Route } from "react-router-dom";

import HomePage from "@/components/home_page";
import AdminPage from "@/components/admin";
import NewEntryPage from "@/components/admin/new_entry";
import NotFound from "@/components/shared/not_found_page";

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/new_entry" element={<NewEntryPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;

import { ThemeProvider } from "@material-tailwind/react";
import { Routes, Route } from "react-router-dom";

import HomePage from "@/components/home_page";
import AdminPage from "@/components/admin";
import NewEntryPage from "@/components/admin/new_entry";
import NotFound from "@/components/shared/not_found_page";
import RequireAdmin from "@/components/shared/require_admin";

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route element={<RequireAdmin />}>
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/admin/new_entry" element={<NewEntryPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;

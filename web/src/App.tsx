import { ThemeProvider } from "@material-tailwind/react";
import { Routes, Route } from "react-router-dom";

import HomePage from "@/components/home_page";
import AdminPage from "@/components/admin";
import NewEntryPage from "@/components/admin/new_entry";
import ShowEntryPage from "@/components/admin/new_show";
import MovieEntryPage from "@/components/admin/new_movie";
import NotFound from "@/components/shared/not_found_page";
import RequireAdmin from "@/components/shared/require_admin";
import SeriesDetailsPage from "./components/series";
import { EditEntryPage } from "@/components/series/edit_entry";
import { EditFranchisePage } from "@/components/series/edit_franchise";
import { EntryDetailsPage } from "@/components/series/entry_details";

function App() {
  return (
    <ThemeProvider>
      <div className="h-screen flex flex-col transition-colors duration-200">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/series/:franchiseId" element={<SeriesDetailsPage />} />
          <Route path="/series/:franchiseId/entries/:entryId" element={<EntryDetailsPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route element={<RequireAdmin />}>
            <Route path="/admin/new_entry" element={<NewEntryPage />} />
            <Route path="/admin/new_show" element={<ShowEntryPage />} />
            <Route path="/admin/new_movie" element={<MovieEntryPage />} />
            <Route path="/series/:franchiseId/edit" element={<EditFranchisePage />} />
            <Route path="/series/:franchiseId/edit/:entryId" element={<EditEntryPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;

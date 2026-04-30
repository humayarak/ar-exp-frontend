import { BrowserRouter, Routes, Route } from "react-router-dom";
import ToolsPage from "./ToolsPage";
import FaultsPage from "./FaultsPage";
import ARPage from "./ARPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ToolsPage />} />
        <Route path="/faults" element={<FaultsPage />} />
        <Route path="/ar" element={<ARPage />} />
      </Routes>
    </BrowserRouter>
  );
}
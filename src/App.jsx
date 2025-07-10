import React from "react";
import { Routes, Route } from "react-router-dom";
import CanvasPage from "@/components/pages/CanvasPage";

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<CanvasPage />} />
      </Routes>
    </div>
  );
}

export default App;
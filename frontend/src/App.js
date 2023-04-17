import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import SearchPage from "./pages/search-page";
import AddPage from "./pages/add-page";
import EditPage from "./pages/edit-page";
import ViewPage from "./pages/view-page";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<SearchPage />} />
          <Route path="/add-recipe" element={<AddPage />} />
          <Route path="/edit-recipe" element={<EditPage />} />
          <Route path="/view-recipe" element={<ViewPage />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App;
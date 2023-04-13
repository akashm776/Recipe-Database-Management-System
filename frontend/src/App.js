import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import SearchPage from "./pages/search-page";
import AddPage from "./pages/add-page";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<SearchPage />} />
          <Route path="/add-recipe" element={<AddPage />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App;
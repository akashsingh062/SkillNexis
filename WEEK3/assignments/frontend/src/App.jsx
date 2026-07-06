import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import UploadPage from './pages/UploadPage';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/upload" element={<UploadPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import AuthPage from './pages/AuthPage';
import TasksPage from './pages/TasksPage';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<TasksPage />} />
          <Route path="/auth" element={<AuthPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import CitizenDashboard from './pages/CitizenDashboard';
import PoliceDashboard from './pages/PoliceDashboard';
import AdminDashboard from './pages/AdminDashboard';
import FileFIR from './pages/FileFIR';

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/citizen" element={<CitizenDashboard />} />
        <Route path="/police" element={<PoliceDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/file-fir" element={<FileFIR />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

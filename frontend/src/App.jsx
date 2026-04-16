import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import SelectionPage from './pages/SelectionPage';
import DashboardPage from './pages/DashboardPage';
import MemoriesPage from './pages/MemoriesPage';
import GiftsPage from './pages/GiftsPage';
import PlansPage from './pages/PlansPage';
import ConfigPage from './pages/ConfigPage';

// Component to protect routes that require a selected profile
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SelectionPage />} />
          <Route 
            path="/home" 
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/recuerdos" 
            element={
              <ProtectedRoute>
                <MemoriesPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/regalos" 
            element={
              <ProtectedRoute>
                <GiftsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/planes" 
            element={
              <ProtectedRoute>
                <PlansPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/config" 
            element={
              <ProtectedRoute>
                <ConfigPage />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

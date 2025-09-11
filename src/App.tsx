import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { TrainingProvider } from './contexts/TrainingContext';
import { FacilitiesProvider } from './contexts/FacilitiesContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Scanner from './pages/Scanner';
import Training from './pages/Training';
import Rewards from './pages/Rewards';
import Community from './pages/Community';
import GreenChampions from './pages/GreenChampions';
import Facilities from './pages/Facilities';
import Penalties from './pages/Penalties';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import './i18n';
import './App.css';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/login" />;
}

function AppRoutes() {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <Routes>
        <Route 
          path="/login" 
          element={user ? <Navigate to="/" /> : <Login />} 
        />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/scanner" element={<Scanner />} />
                  <Route path="/training" element={<Training />} />
                  <Route path="/rewards" element={<Rewards />} />
                  <Route path="/community" element={<Community />} />
                  <Route path="/green-champions" element={<GreenChampions />} />
                  <Route path="/facilities" element={<Facilities />} />
                  <Route path="/penalties" element={<Penalties />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/admin" element={<Admin />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
      <Toaster position="top-center" />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <TrainingProvider>
          <FacilitiesProvider>
            <DataProvider>
              <AppRoutes />
            </DataProvider>
          </FacilitiesProvider>
        </TrainingProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
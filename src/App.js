import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import './index.css';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Transfer from './pages/Transfer';
import History from './pages/History';
import Withdraw from './pages/Withdraw';
import NotificationsPage from './pages/NotificationsPage';
import AdminApp from './pages/AdminApp';
import Layout from './components/Layout';
import AdminMonitoring from './pages/AdminMonitoring';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import Contact from './pages/Contact';

const Loader = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--bg)', flexDirection: 'column', gap: 20 }}>
    <div style={{ width: 40, height: 40, border: '2px solid var(--border)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    <div style={{ width: 160, height: 8, borderRadius: 4 }} className="skeleton" />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <Loader />;
  return user ? children : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }) => {
  const { user, loading, isAdmin } = useAuth();
  if (loading) return <Loader />;
  if (!user) return <Navigate to="/login" replace />;
  return isAdmin ? children : <Navigate to="/dashboard" replace />;
};

function AppRoutes() {
  const { user, loading } = useAuth();
  
  if (loading) return <Loader />;
  
  return (
    <Routes>
      {/* Public routes - anyone can access */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={!user ? <Login /> : <Navigate to={user?.role === 'admin' ? '/admin' : '/dashboard'} replace />} />
      <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" replace />} />

      {/* <Route path="/" element={<Landing />} /> */}
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/contact" element={<Contact />} />
      
      {/* Protected routes - wrap everything with Layout */}
      <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/transfer" element={<Transfer />} />
        <Route path="/history" element={<History />} />
        <Route path="/withdraw" element={<Withdraw />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        
      </Route>

      <Route path="/monitoring" element={<div className="theme-dark"><AdminMonitoring /></div>} />
      
      {/* Admin route - only admin users */}
      <Route 
        path="/admin" 
        element={
          <AdminRoute>
            <div className="theme-dark"><AdminApp /></div>
          </AdminRoute>
        } 
      />
      
      {/* Catch all - redirect based on auth status */}
      <Route path="*" element={
        <Navigate to={user ? (user?.role === 'admin' ? '/admin' : '/dashboard') : '/'} replace />
      } />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
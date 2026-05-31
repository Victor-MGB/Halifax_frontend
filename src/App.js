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

const Loader = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--void)', flexDirection: 'column', gap: 16 }}>
    <div style={{ width: 40, height: 40, border: '2px solid var(--border)', borderTopColor: 'var(--gold)', borderRadius: '50%' }} className="spin" />
    <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)', letterSpacing: 3 }}>LOADING</p>
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
      
      {/* Protected routes - wrap everything with Layout */}
      <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/transfer" element={<Transfer />} />
        <Route path="/history" element={<History />} />
        <Route path="/withdraw" element={<Withdraw />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        
      </Route>

      <Route path="/monitoring" element={<AdminMonitoring />} />
      
      {/* Admin route - only admin users */}
      <Route 
        path="/admin" 
        element={
          <AdminRoute>
            <AdminApp />
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
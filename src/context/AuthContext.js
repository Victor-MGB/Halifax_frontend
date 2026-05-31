import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { api } from '../utils/api'; 

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

// Set API base URL for direct axios calls
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('nb_token'));
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (token) axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    else delete axios.defaults.headers.common['Authorization'];
  }, [token]);

  useEffect(() => {
    const load = async () => {
      if (!token) { setLoading(false); return; }
      try {
        // FIXED: Use full URL or api.me()
        const { data } = await axios.get(`${API_URL}/api/auth/me`);
        setUser(data.user);
      } catch { 
        setToken(null); 
        localStorage.removeItem('nb_token');
      } finally { 
        setLoading(false); 
      }
    };
    load();
  }, [token]);

  const fetchNotifications = useCallback(async () => {
    if (!token) return;
    try {
      // FIXED: Use api.getNotifications() instead
      const { data } = await api.getNotifications();
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  }, [token]);

  useEffect(() => {
    if (!user) return;
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000);
    return () => clearInterval(interval);
  }, [user, fetchNotifications]);

  const login = async (email, password) => {
    // FIXED: Use api.login() instead
    const { data } = await api.login({ email, password });
    localStorage.setItem('nb_token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const register = async (fields) => {
    // FIXED: Use api.register() instead
    const { data } = await api.register(fields);
    localStorage.setItem('nb_token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('nb_token');
    setToken(null); 
    setUser(null);
    setNotifications([]); 
    setUnreadCount(0);
  };

  const markAllRead = async () => {
    // FIXED: Use api.markAllRead() instead
    await api.markAllRead();
    setUnreadCount(0);
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <AuthContext.Provider value={{
      user, token, loading, login, register, logout,
      isAdmin: user?.role === 'admin',
      notifications, unreadCount, fetchNotifications, markAllRead,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
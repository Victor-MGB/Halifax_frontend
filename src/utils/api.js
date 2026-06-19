import axios from 'axios';

// Create a single axios instance with proper configuration
const API_URL = process.env.REACT_APP_API_URL;
if (process.env.REACT_APP_API_URL){
  axios.defaults.baseURL = process.env.REACT_APP_API_URL
}

console.log("API Base URL:", process.env.REACT_APP_API_URL);

const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,           // Important if using cookies
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,                  // Optional: prevent hanging requests
});

// Request Interceptor - Automatically attach token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('nb_token'); // CHANGED: 'token' -> 'nb_token'
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor - Handle common errors (optional but very useful)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('nb_token'); // CHANGED: 'token' -> 'nb_token'
      // Optional: redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API Methods
export const api = {
  // Auth
  login: (data) => apiClient.post('/api/auth/login', data),
  register: (data) => apiClient.post('/api/auth/register', data),
  me: () => apiClient.get('/api/auth/me'),

  // Accounts
  getAccounts: () => apiClient.get('/api/accounts'),

  // Transactions
  getTransactions: (params) => apiClient.get('/api/transactions', { params }),
  transfer: (data) => apiClient.post('/api/transactions/transfer', data),

  // Withdrawals
  initiateWithdrawal: (data) => apiClient.post('/api/withdrawals/initiate', data),
  getMyWithdrawals: () => apiClient.get('/api/withdrawals/my'),

  // Notifications
  getNotifications: () => apiClient.get('/api/notifications'),
  markAllRead: () => apiClient.put('/api/notifications/read-all'),
  markRead: (id) => apiClient.put(`/api/notifications/${id}/read`),

  // delete user
  deleteUser: (userId) => apiClient.delete(`/api/admin/users/${userId}`),

  // Admin
  getAnalytics: () => apiClient.get('/api/admin/analytics'),
  getAdminUsers: (params) => apiClient.get('/api/admin/users', { params }),
  fundUser: (data) => apiClient.post('/api/admin/fund', data),
  toggleUserActive: (id) => apiClient.put(`/api/admin/users/${id}/toggle-active`),
  toggleFreezeAcct: (id) => apiClient.put(`/api/admin/accounts/${id}/toggle-freeze`),
  getAdminWithdrawals: () => apiClient.get('/api/admin/withdrawals'),
  approveStage: (requestId, stageIndex, data) =>
    apiClient.put(`/api/admin/withdrawals/${requestId}/stage/${stageIndex}/approve`, data),
  rejectStage: (requestId, stageIndex, data) =>
    apiClient.put(`/api/admin/withdrawals/${requestId}/stage/${stageIndex}/reject`, data),
  getAdminTxns: (params) => apiClient.get('/api/admin/transactions', { params }),

  // ============== CONTACT ENDPOINTS ==============
  
  /**
   * Submit a contact form (public - no auth required)
   * @param {Object} data - Contact form data
   * @param {string} data.fullName - Full name of the user
   * @param {string} data.email - User's email
   * @param {string} data.priority - 'urgent', 'high', 'medium', or 'low'
   * @param {string} data.subject - Subject of the message
   * @param {string} data.message - Message content (min 10 chars)
   * @returns {Promise} Response with contact data
   */
  submitContact: (data) => apiClient.post('/api/contact', data),

  /**
   * Get all contact submissions (admin only)
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number (default: 1)
   * @param {number} params.limit - Items per page (default: 20)
   * @param {string} params.status - Filter by status: 'open', 'in_review', 'resolved', 'closed'
   * @param {string} params.priority - Filter by priority: 'urgent', 'high', 'medium', 'low'
   * @returns {Promise} Response with contacts list and summaries
   */
  getContacts: (params) => apiClient.get('/api/contact', { params }),

  /**
   * Get a single contact by ID (admin only)
   * @param {string} id - Contact ID
   * @returns {Promise} Response with contact details
   */
  getContactById: (id) => apiClient.get(`/api/contact/${id}`),

  /**
   * Update contact status (admin only)
   * @param {string} id - Contact ID
   * @param {Object} data - Update data
   * @param {string} data.status - New status: 'open', 'in_review', 'resolved', 'closed'
   * @param {string} data.adminNote - Optional admin note
   * @returns {Promise} Response with updated contact
   */
  updateContactStatus: (id, data) => apiClient.put(`/api/contact/${id}/status`, data),

  /**
   * Delete a contact (admin only)
   * @param {string} id - Contact ID
   * @returns {Promise} Response with success message
   */
  deleteContact: (id) => apiClient.delete(`/api/contact/${id}`),
};

// Helper constants and formatters
export const CURRENCIES = ['USD', 'EUR', 'GBP', 'CHF', 'JPY', 'CAD', 'AUD', 'SGD', 'AED', 'HKD'];

export const CURRENCY_SYMBOLS = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  CHF: 'Fr',
  JPY: '¥',
  CAD: 'C$',
  AUD: 'A$',
  SGD: 'S$',
  AED: 'د.إ',
  HKD: 'HK$',
};

export const fmt = (n, currency = 'USD') => {
  const sym = CURRENCY_SYMBOLS[currency] || '$';
  return `${sym}${(n || 0).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

export const fmtDate = (d) =>
  new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

export const fmtTime = (d) =>
  new Date(d).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
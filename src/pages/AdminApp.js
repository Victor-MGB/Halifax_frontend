import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { api, fmt, fmtDate, fmtTime, CURRENCIES } from '../utils/api';
import AdminMonitoring from './AdminMonitoring';  

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const PIE_COLORS = ['#C9A84C', '#3ECFCF', '#4ADE80', '#A78BFA', '#F87171', '#FBBF24', '#80DEEA'];

const TABS = [
  { id: 'overview', label: 'Overview', icon: '📊' },
  { id: 'contacts', label: 'Contacts', icon: '✉️', badge: true },
  { id: 'withdrawals', label: 'Withdrawals', icon: '🔄', badge: true },
  { id: 'fund', label: 'Fund Users', icon: '💰' },
  { id: 'users', label: 'Users', icon: '👥' },
  { id: 'transactions', label: 'Transactions', icon: '📜' },
  { id: 'monitoring', label: 'Monitoring', icon: '📡'}
];

const StageStatusBadge = ({ status }) => {
  const styles = {
    pending: { bg: 'rgba(251,191,36,0.1)', color: 'var(--amber)', label: 'Pending' },
    approved: { bg: 'rgba(74,222,128,0.1)', color: 'var(--green)', label: 'Approved' },
    rejected: { bg: 'rgba(248,113,113,0.1)', color: 'var(--red)', label: 'Rejected' },
  };
  const s = styles[status] || styles.pending;
  return <span style={{ padding: '2px 8px', borderRadius: 12, background: s.bg, color: s.color, fontSize: 10, fontWeight: 500 }}>{s.label}</span>;
};

// Contact Status Badge
const ContactStatusBadge = ({ status }) => {
  const styles = {
    open: { bg: 'rgba(251,191,36,0.1)', color: 'var(--amber)', label: 'Open' },
    in_review: { bg: 'rgba(59,130,246,0.1)', color: '#60A5FA', label: 'In Review' },
    resolved: { bg: 'rgba(74,222,128,0.1)', color: 'var(--green)', label: 'Resolved' },
    closed: { bg: 'rgba(107,114,128,0.1)', color: 'var(--muted)', label: 'Closed' },
  };
  const s = styles[status] || styles.open;
  return <span style={{ padding: '2px 8px', borderRadius: 12, background: s.bg, color: s.color, fontSize: 10, fontWeight: 500 }}>{s.label}</span>;
};

// Contact Priority Badge
const ContactPriorityBadge = ({ priority }) => {
  const styles = {
    low: { bg: 'rgba(107,114,128,0.1)', color: 'var(--muted)', label: 'Low' },
    medium: { bg: 'rgba(59,130,246,0.1)', color: '#60A5FA', label: 'Medium' },
    high: { bg: 'rgba(251,191,36,0.1)', color: 'var(--amber)', label: 'High' },
    urgent: { bg: 'rgba(248,113,113,0.1)', color: 'var(--red)', label: 'Urgent' },
  };
  const s = styles[priority] || styles.medium;
  return <span style={{ padding: '2px 8px', borderRadius: 12, background: s.bg, color: s.color, fontSize: 10, fontWeight: 500 }}>{s.label}</span>;
};

export default function AdminApp() {
  const { user, logout, fetchNotifications } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) setMobileMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close mobile menu when tab changes
  useEffect(() => {
    if (isMobile) setMobileMenuOpen(false);
  }, [tab, isMobile]);

  // Data states
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [txns, setTxns] = useState([]);
  const [txPage, setTxPage] = useState(1);
  const [txPages, setTxPages] = useState(1);

  // Contact states
  const [contacts, setContacts] = useState([]);
  const [contactFilters, setContactFilters] = useState({ status: '', priority: '' });
  const [contactPage, setContactPage] = useState(1);
  const [contactPages, setContactPages] = useState(1);
  const [contactTotal, setContactTotal] = useState(0);
  const [contactSummary, setContactSummary] = useState([]);
  const [contactPrioritySummary, setContactPrioritySummary] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [showContactDetail, setShowContactDetail] = useState(false);
  const [statusUpdateData, setStatusUpdateData] = useState({ status: '', adminNote: '' });
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [contactLoading, setContactLoading] = useState(false);

  // Fund form
  const [fundForm, setFundForm] = useState({ userId: '', accountId: '', amount: '', currency: 'USD', description: '' });
  const [fundAccounts, setFundAccounts] = useState([]);
  const [fundStatus, setFundStatus] = useState(null);
  const [fundLoading, setFundLoading] = useState(false);

  // Stage action
  const [activeStageAction, setActiveStageAction] = useState(null);
  const [stageNote, setStageNote] = useState('');
  const [stageLoading, setStageLoading] = useState(false);

  // Search
  const [userSearch, setUserSearch] = useState('');

  const pendingCount = withdrawals.filter(w => w.stages?.some(s => s.status === 'pending')).length;
  const openContactsCount = contacts.filter(c => c.status === 'open').length;

  const loadAnalytics = () => api.getAnalytics().then(r => setAnalytics(r.data)).catch(() => { });
  const loadWithdrawals = () => api.getAdminWithdrawals().then(r => setWithdrawals(r.data.requests || [])).catch(() => { });
  const loadUsers = useCallback(() => api.getAdminUsers({ search: userSearch }).then(r => setUsers(r.data.users || [])).catch(() => { }), [userSearch]);
  const loadTxns = useCallback(() => api.getAdminTxns({ page: txPage }).then(r => { setTxns(r.data.transactions || []); setTxPages(r.data.pages || 1); }).catch(() => { }), [txPage]);

  // Load contacts
  const loadContacts = useCallback(async () => {
    setContactLoading(true);
    try {
      const params = {
        page: contactPage,
        limit: 10,
        ...(contactFilters.status && { status: contactFilters.status }),
        ...(contactFilters.priority && { priority: contactFilters.priority }),
      };
      const res = await api.getContacts(params);
      setContacts(res.data.contacts || []);
      setContactTotal(res.data.total || 0);
      setContactPages(res.data.pages || 1);
      setContactSummary(res.data.summary || []);
      setContactPrioritySummary(res.data.prioritySummary || []);
    } catch (err) {
      console.error('Error loading contacts:', err);
    } finally {
      setContactLoading(false);
    }
  }, [contactPage, contactFilters]);

  useEffect(() => { loadAnalytics(); loadWithdrawals(); }, []);
  useEffect(() => { if (tab === 'users') loadUsers(); }, [tab, loadUsers]);
  useEffect(() => { if (tab === 'transactions') loadTxns(); }, [tab, loadTxns]);
  useEffect(() => { if (tab === 'withdrawals') loadWithdrawals(); }, [tab]);
  useEffect(() => { if (tab === 'contacts') loadContacts(); }, [tab, loadContacts]);

  useEffect(() => {
    const iv = setInterval(loadWithdrawals, 20000);
    return () => clearInterval(iv);
  }, []);

  const handleFundUserSelect = async (userId) => {
    setFundForm(f => ({ ...f, userId, accountId: '' }));
    const u = users.find(u => u._id === userId);
    if (u) setFundAccounts(u.accounts || []);
    else {
      const allUsers = await api.getAdminUsers({});
      const found = allUsers.data.users.find(u => u._id === userId);
      setFundAccounts(found?.accounts || []);
    }
  };

  const submitFund = async () => {
    setFundStatus(null); setFundLoading(true);
    try {
      const res = await api.fundUser(fundForm);
      setFundStatus({ ok: true, msg: res.data.message });
      setFundForm(f => ({ ...f, amount: '', description: '' }));
      loadAnalytics(); loadUsers();
    } catch (err) {
      setFundStatus({ ok: false, msg: err.response?.data?.message || 'Failed to fund' });
    } finally { setFundLoading(false); }
  };

  const handleStageAction = async () => {
    if (!activeStageAction) return;
    setStageLoading(true);
    try {
      const { requestId, stageIdx, action } = activeStageAction;
      if (action === 'approve') await api.approveStage(requestId, stageIdx, { adminNote: stageNote });
      else await api.rejectStage(requestId, stageIdx, { adminNote: stageNote });
      loadWithdrawals(); fetchNotifications();
      setActiveStageAction(null); setStageNote('');
    } catch (err) {
      alert(err.response?.data?.message || 'Error');
    } finally { setStageLoading(false); }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await api.deleteUser(userId);
      await loadUsers();
      setShowDeleteConfirm(null);
      setFundStatus({ ok: true, msg: 'User deleted successfully' });
      setTimeout(() => setFundStatus(null), 3000);
    } catch (err) {
      setFundStatus({ ok: false, msg: err.response?.data?.message || 'Failed to delete user' });
      setTimeout(() => setFundStatus(null), 3000);
    }
  };

  // Contact handlers
  const handleUpdateStatus = async () => {
    if (!selectedContact || !statusUpdateData.status) return;
    try {
      await api.updateContactStatus(selectedContact._id, statusUpdateData);
      await loadContacts();
      setShowStatusModal(false);
      setStatusUpdateData({ status: '', adminNote: '' });
      setSelectedContact(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleDeleteContact = async (contactId) => {
    if (!window.confirm('Are you sure you want to delete this contact message?')) return;
    try {
      await api.deleteContact(contactId);
      await loadContacts();
      if (selectedContact?._id === contactId) {
        setSelectedContact(null);
        setShowContactDetail(false);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete contact');
    }
  };

  const monthlyData = analytics?.monthlyVolume?.map(m => ({
    name: MONTHS[(m._id.m || m._id.month || 1) - 1],
    volume: Math.round(m.volume), count: m.count,
  })) || [];

  const byType = analytics?.byCategory || [];
  const S = analytics?.stats || {};

  return (
    <div style={{ minHeight: '100vh', background: 'var(--void)' }}>
      {/* Mobile Header */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 200,
        background: 'var(--deep)', borderBottom: '1px solid var(--border)',
        padding: '12px 20px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, #C9A84C, #E8C97A)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, color: '#050709', fontSize: 16,
          }}>N</div>
          <div>
            <p style={{ fontSize: 14, fontWeight: 500 }}>Halifax Offshore Admin</p>
            <p style={{ fontSize: 9, color: 'var(--gold)', letterSpacing: 1 }}>CONTROL CENTER</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {openContactsCount > 0 && (
            <div style={{
              background: 'rgba(251,191,36,0.1)',
              padding: '4px 10px', borderRadius: 20,
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--amber)' }} />
              <span style={{ fontSize: 11, color: 'var(--amber)' }}>{openContactsCount}</span>
            </div>
          )}
          {pendingCount > 0 && (
            <div style={{
              background: 'rgba(251,191,36,0.1)',
              padding: '4px 10px', borderRadius: 20,
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--amber)' }} />
              <span style={{ fontSize: 11, color: 'var(--amber)' }}>{pendingCount}</span>
            </div>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: 'none', border: 'none', fontSize: 24, cursor: 'pointer',
              color: 'var(--text)', padding: 8, display: isMobile ? 'block' : 'none',
            }}
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', minHeight: 'calc(100vh - 68px)' }}>

        {/* Sidebar */}
        <div style={{
          position: isMobile ? 'fixed' : 'sticky',
          top: isMobile ? 0 : '68px',
          left: 0,
          width: isMobile ? '280px' : '240px',
          height: isMobile ? '100vh' : 'calc(100vh - 68px)',
          background: 'var(--deep)',
          borderRight: '1px solid var(--border)',
          transform: isMobile ? `translateX(${mobileMenuOpen ? '0' : '-100%'})` : 'none',
          transition: 'transform 0.3s ease',
          zIndex: 199,
          overflowY: 'auto',
        }}>
          <div style={{ padding: '20px 16px' }}>
            {isMobile && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 12,
                marginBottom: 24, paddingBottom: 16,
                borderBottom: '1px solid var(--border)'
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: 'linear-gradient(135deg, #C9A84C, #E8C97A)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, color: '#050709', fontSize: 14,
                }}>N</div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 500 }}>Halifax Offshore Admin</p>
                  <p style={{ fontSize: 8, color: 'var(--gold)' }}>CONTROL CENTER</p>
                </div>
              </div>
            )}

            {TABS.map(t => {
              const isActive = tab === t.id;
              const badgeCount = t.id === 'contacts' ? openContactsCount : t.id === 'withdrawals' ? pendingCount : 0;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    borderRadius: 12,
                    marginBottom: 6,
                    cursor: 'pointer',
                    background: isActive ? 'rgba(201,168,76,0.12)' : 'transparent',
                    color: isActive ? 'var(--gold2)' : 'var(--muted)',
                    border: `1px solid ${isActive ? 'rgba(201,168,76,0.25)' : 'transparent'}`,
                    fontSize: 13,
                    fontFamily: 'var(--font-sans)',
                    transition: 'all 0.2s',
                    textAlign: 'left',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 18 }}>{t.icon}</span>
                    <span>{t.label}</span>
                  </div>
                  {t.badge && badgeCount > 0 && (
                    <span style={{
                      background: 'var(--amber)',
                      color: '#050709',
                      borderRadius: 12,
                      padding: '2px 8px',
                      fontSize: 11,
                      fontWeight: 700,
                    }}>{badgeCount}</span>
                  )}
                </button>
              );
            })}

            <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--border)' }}>
              <button
                onClick={() => navigate('/')}
                style={{
                  width: '100%',
                  padding: '10px 16px',
                  borderRadius: 10,
                  background: 'rgba(201,168,76,0.05)',
                  border: '1px solid rgba(201,168,76,0.2)',
                  color: 'var(--gold)',
                  fontSize: 12,
                  cursor: 'pointer',
                }}
              >
                ← Back to Home
              </button>
            </div>

            {isMobile && (
              <div style={{
                marginTop: 32,
                padding: 16,
                background: 'rgba(255,255,255,0.02)',
                borderRadius: 12,
                border: '1px solid var(--border)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: '50%',
                    background: 'var(--surface)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 16, fontWeight: 600, color: 'var(--gold)',
                  }}>{user?.firstName?.[0]}{user?.lastName?.[0]}</div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 500 }}>{user?.firstName} {user?.lastName}</p>
                    <p style={{ fontSize: 10, color: 'var(--muted)' }}>Administrator</p>
                  </div>
                </div>
                <button
                  onClick={() => { logout(); navigate('/login'); }}
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: 8,
                    background: 'rgba(248,113,113,0.1)',
                    border: '1px solid rgba(248,113,113,0.2)',
                    color: 'var(--red)',
                    fontSize: 11,
                    cursor: 'pointer',
                  }}
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Overlay for mobile */}
        {isMobile && mobileMenuOpen && (
          <div
            onClick={() => setMobileMenuOpen(false)}
            style={{
              position: 'fixed', inset: 0, zIndex: 198,
              background: 'rgba(0,0,0,0.5)',
            }}
          />
        )}

        {/* Main Content */}
        <main style={{
          flex: 1,
          padding: isMobile ? '20px' : '32px 36px',
          maxWidth: 1400,
          margin: '0 auto',
          width: '100%',
        }}>
          {/* Desktop Header */}
          {!isMobile && (
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 32,
            }}>
              <div>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--gold)', letterSpacing: 3, marginBottom: 4 }}>
                  {tab.toUpperCase()} PANEL
                </p>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 32, fontWeight: 400 }}>
                  {TABS.find(t => t.id === tab)?.label}
                </h2>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                {openContactsCount > 0 && (
                  <div style={{
                    background: 'rgba(251,191,36,0.1)',
                    padding: '6px 12px',
                    borderRadius: 20,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--amber)' }} />
                    <span style={{ fontSize: 12, color: 'var(--amber)' }}>{openContactsCount} Open Contacts</span>
                  </div>
                )}
                {pendingCount > 0 && (
                  <div style={{
                    background: 'rgba(251,191,36,0.1)',
                    padding: '6px 12px',
                    borderRadius: 20,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--amber)' }} />
                    <span style={{ fontSize: 12, color: 'var(--amber)' }}>{pendingCount} Pending</span>
                  </div>
                )}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '6px 12px',
                  background: 'var(--surface)',
                  borderRadius: 10,
                }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: 'var(--raised)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, fontWeight: 600, color: 'var(--gold)',
                  }}>{user?.firstName?.[0]}{user?.lastName?.[0]}</div>
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 500 }}>{user?.firstName} {user?.lastName}</p>
                    <p style={{ fontSize: 9, color: 'var(--muted)' }}>ADMIN</p>
                  </div>
                </div>
                <button
                  style={{
                    padding: '6px 14px',
                    borderRadius: 8,
                    background: 'rgba(248,113,113,0.1)',
                    border: '1px solid rgba(248,113,113,0.2)',
                    color: 'var(--red)',
                    fontSize: 11,
                    cursor: 'pointer',
                  }}
                  onClick={() => { logout(); navigate('/login'); }}
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}

          {/* Mobile Tab Title */}
          {isMobile && (
            <div style={{ marginBottom: 24 }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--gold)', letterSpacing: 2, marginBottom: 4 }}>
                {tab.toUpperCase()} PANEL
              </p>
              <h2 style={{ fontSize: 24, fontWeight: 400 }}>
                {TABS.find(t => t.id === tab)?.label}
              </h2>
            </div>
          )}

          {/* ── OVERVIEW ── */}
          {tab === 'overview' && analytics && (
            <div className="animate-in">
              <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : window.innerWidth < 1024 ? 'repeat(2,1fr)' : 'repeat(4,1fr)',
                gap: 16,
                marginBottom: 24,
              }}>
                <div className="card" style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <p style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: 1 }}>TOTAL CLIENTS</p>
                    <span style={{ fontSize: 20, opacity: 0.4 }}>👥</span>
                  </div>
                  <p style={{ fontSize: 36, fontWeight: 500, color: 'var(--gold)' }}>{S.totalUsers || 0}</p>
                </div>
                <div className="card" style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <p style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: 1 }}>ACTIVE CLIENTS</p>
                    <span style={{ fontSize: 20, opacity: 0.4 }}>✅</span>
                  </div>
                  <p style={{ fontSize: 36, fontWeight: 500, color: 'var(--green)' }}>{S.activeUsers || 0}</p>
                </div>
                <div className="card" style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <p style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: 1 }}>PENDING WITHDRAWALS</p>
                    <span style={{ fontSize: 20, opacity: 0.4 }}>🔄</span>
                  </div>
                  <p style={{ fontSize: 36, fontWeight: 500, color: 'var(--amber)' }}>{S.pendingWithdrawals || 0}</p>
                </div>
                <div className="card" style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <p style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: 1 }}>TOTAL VOLUME</p>
                    <span style={{ fontSize: 20, opacity: 0.4 }}>💰</span>
                  </div>
                  <p style={{ fontSize: 28, fontWeight: 500 }}>{fmt(S.totalBalance)}</p>
                </div>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr',
                gap: 20,
              }}>
                <div className="card" style={{ padding: '20px' }}>
                  <p style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: 2, marginBottom: 20 }}>MONTHLY VOLUME</p>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={monthlyData}>
                      <XAxis dataKey="name" tick={{ fill: 'var(--muted)', fontSize: 10 }} axisLine={false} tickLine={false} />
                      <YAxis hide />
                      <Tooltip contentStyle={{ background: 'var(--raised)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 11 }} />
                      <Bar dataKey="volume" fill="var(--gold)" radius={[4, 4, 0, 0]} opacity={0.8} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="card" style={{ padding: '20px' }}>
                  <p style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: 2, marginBottom: 16 }}>TRANSACTIONS BY TYPE</p>
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie data={byType} dataKey="count" nameKey="_id" cx="50%" cy="50%" innerRadius={40} outerRadius={70}>
                        {byType.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginTop: 8 }}>
                    {byType.slice(0, 4).map((c, i) => (
                      <div key={c._id} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ width: 8, height: 8, borderRadius: 2, background: PIE_COLORS[i % PIE_COLORS.length] }} />
                        <span style={{ fontSize: 10, color: 'var(--muted)' }}>{c._id} ({c.count})</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── CONTACTS ── */}
          {tab === 'contacts' && (
            <div>
              {/* Filters */}
              <div style={{
                display: 'flex',
                gap: 12,
                marginBottom: 20,
                flexWrap: 'wrap',
                alignItems: 'center',
              }}>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', flex: 1 }}>
                  <select
                    value={contactFilters.status}
                    onChange={e => {
                      setContactFilters(f => ({ ...f, status: e.target.value }));
                      setContactPage(1);
                    }}
                    style={{
                      padding: '8px 14px',
                      borderRadius: 8,
                      background: 'var(--surface)',
                      border: '1px solid var(--border)',
                      color: 'var(--text)',
                      fontSize: 12,
                      minWidth: 120,
                    }}
                  >
                    <option value="">All Statuses</option>
                    <option value="open">Open</option>
                    <option value="in_review">In Review</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                  <select
                    value={contactFilters.priority}
                    onChange={e => {
                      setContactFilters(f => ({ ...f, priority: e.target.value }));
                      setContactPage(1);
                    }}
                    style={{
                      padding: '8px 14px',
                      borderRadius: 8,
                      background: 'var(--surface)',
                      border: '1px solid var(--border)',
                      color: 'var(--text)',
                      fontSize: 12,
                      minWidth: 120,
                    }}
                  >
                    <option value="">All Priorities</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <button
                  onClick={loadContacts}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 8,
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    cursor: 'pointer',
                    fontSize: 12,
                    color: 'var(--text)',
                  }}
                >
                  🔄 Refresh
                </button>
              </div>

              {/* Summary Stats */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)',
                gap: 10,
                marginBottom: 20,
              }}>
                {contactSummary.map(s => (
                  <div key={s._id} className="card" style={{ padding: '12px', textAlign: 'center' }}>
                    <p style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase' }}>{s._id}</p>
                    <p style={{ fontSize: 20, fontWeight: 500, color: 'var(--gold)' }}>{s.count}</p>
                  </div>
                ))}
                {contactSummary.length === 0 && (
                  <div className="card" style={{ padding: '12px', textAlign: 'center', gridColumn: '1 / -1' }}>
                    <p style={{ fontSize: 12, color: 'var(--muted)' }}>No contacts found</p>
                  </div>
                )}
              </div>

              {/* Contact List */}
              {contactLoading ? (
                <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
                  <p style={{ color: 'var(--muted)' }}>Loading contacts...</p>
                </div>
              ) : contacts.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
                  <p style={{ fontSize: 48, marginBottom: 12 }}>✉️</p>
                  <p style={{ fontSize: 16, color: 'var(--muted)' }}>No contact submissions</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {contacts.map(contact => (
                    <div key={contact._id} className="card" style={{ padding: '16px 20px', cursor: 'pointer' }} onClick={() => { setSelectedContact(contact); setShowContactDetail(true); }}>
                      <div style={{
                        display: 'flex',
                        flexDirection: isMobile ? 'column' : 'row',
                        justifyContent: 'space-between',
                        alignItems: isMobile ? 'flex-start' : 'center',
                        gap: 8,
                      }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                            <p style={{ fontWeight: 500, fontSize: 14 }}>{contact.fullName}</p>
                            <ContactPriorityBadge priority={contact.priority} />
                            <ContactStatusBadge status={contact.status} />
                          </div>
                          <p style={{ fontSize: 12, color: 'var(--muted)' }}>{contact.email}</p>
                          <p style={{ fontSize: 13, marginTop: 4 }}>{contact.subject}</p>
                          <p style={{ fontSize: 11, color: 'var(--muted2)', marginTop: 2 }}>
                            {fmtDate(contact.createdAt)} · {fmtTime(contact.createdAt)}
                          </p>
                        </div>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                          <span style={{ fontSize: 20 }}>→</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {contactPages > 1 && (
                <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 24 }}>
                  <button
                    className="btn-outline"
                    onClick={() => setContactPage(p => Math.max(1, p - 1))}
                    disabled={contactPage === 1}
                    style={{
                      padding: '8px 16px',
                      borderRadius: 8,
                      background: 'var(--surface)',
                      border: '1px solid var(--border)',
                      cursor: contactPage === 1 ? 'default' : 'pointer',
                      opacity: contactPage === 1 ? 0.5 : 1,
                      color: 'var(--text)',
                    }}
                  >
                    ← Prev
                  </button>
                  <span style={{ padding: '8px 14px', fontSize: 11, color: 'var(--muted)' }}>
                    {contactPage} / {contactPages}
                  </span>
                  <button
                    className="btn-outline"
                    onClick={() => setContactPage(p => Math.min(contactPages, p + 1))}
                    disabled={contactPage === contactPages}
                    style={{
                      padding: '8px 16px',
                      borderRadius: 8,
                      background: 'var(--surface)',
                      border: '1px solid var(--border)',
                      cursor: contactPage === contactPages ? 'default' : 'pointer',
                      opacity: contactPage === contactPages ? 0.5 : 1,
                      color: 'var(--text)',
                    }}
                  >
                    Next →
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ── WITHDRAWALS ── */}
          {tab === 'withdrawals' && (
            <div>
              {withdrawals.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
                  <p style={{ fontSize: 48, marginBottom: 12 }}>🔄</p>
                  <p style={{ fontSize: 16, color: 'var(--muted)' }}>No withdrawal requests</p>
                </div>
              ) : withdrawals.map(req => {
                const hasPending = req.stages?.some(s => s.status === 'pending');
                return (
                  <div key={req._id} className="card" style={{ marginBottom: 20, border: hasPending ? '1px solid rgba(251,191,36,0.25)' : '1px solid var(--border)', overflow: 'hidden' }}>
                    <div style={{ padding: '20px', borderBottom: '1px solid var(--border)' }}>
                      <div style={{
                        display: 'flex',
                        flexDirection: isMobile ? 'column' : 'row',
                        justifyContent: 'space-between',
                        gap: 12,
                      }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
                            <p style={{ fontWeight: 600, fontSize: 16 }}>{req.user?.firstName} {req.user?.lastName}</p>
                            <StageStatusBadge status={req.status} />
                          </div>
                          <p style={{ fontSize: 12, color: 'var(--muted)' }}>{req.user?.email}</p>
                        </div>
                        <div style={{ textAlign: isMobile ? 'left' : 'right' }}>
                          <p style={{ fontSize: 24, fontWeight: 500, color: 'var(--gold)' }}>{fmt(req.amount, req.currency)}</p>
                          <p style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>Stage {req.currentStage} of 22</p>
                        </div>
                      </div>
                      <div style={{ background: 'var(--border)', borderRadius: 4, height: 4, marginTop: 16, overflow: 'hidden' }}>
                        <div style={{
                          height: '100%',
                          background: 'linear-gradient(90deg, var(--gold), var(--gold2))',
                          width: `${(req.currentStage / 22) * 100}%`,
                          transition: 'width 0.4s',
                        }} />
                      </div>
                    </div>

                    <div style={{ padding: '16px 20px' }}>
                      {req.stages?.map((stage, idx) => (
                        <div key={idx} style={{
                          marginBottom: 8,
                          padding: '12px',
                          borderRadius: 10,
                          background: stage.status === 'pending' ? 'rgba(251,191,36,0.03)' : 'transparent',
                          borderLeft: `3px solid ${stage.status === 'pending' ? 'var(--amber)' : stage.status === 'approved' ? 'var(--green)' : stage.status === 'rejected' ? 'var(--red)' : 'var(--border)'}`,
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
                            <div style={{ flex: 1 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--gold)' }}>S{stage.stageNumber}</span>
                                <p style={{ fontSize: 13, fontWeight: 500 }}>{stage.stageName}</p>
                                <StageStatusBadge status={stage.status} />
                              </div>
                              {stage.stageDesc && <p style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>{stage.stageDesc}</p>}
                              {stage.adminNote && <p style={{ fontSize: 11, color: 'var(--teal)', marginTop: 4 }}>📝 {stage.adminNote}</p>}
                            </div>
                            {stage.status === 'pending' && (
                              <div style={{ display: 'flex', gap: 8 }}>
                                <button
                                  style={{ padding: '6px 12px', borderRadius: 8, background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)', color: 'var(--green)', fontSize: 11, cursor: 'pointer' }}
                                  onClick={() => { setActiveStageAction({ requestId: req._id, stageIdx: idx, action: 'approve' }); setStageNote(''); }}
                                >
                                  ✓ Approve
                                </button>
                                <button
                                  style={{ padding: '6px 12px', borderRadius: 8, background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.2)', color: 'var(--red)', fontSize: 11, cursor: 'pointer' }}
                                  onClick={() => { setActiveStageAction({ requestId: req._id, stageIdx: idx, action: 'reject' }); setStageNote(''); }}
                                >
                                  ✗ Reject
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── FUND USERS ── */}
          {tab === 'fund' && (
            <div style={{ maxWidth: 700, margin: '0 auto' }}>
              <div className="card" style={{ padding: isMobile ? '20px' : '28px' }}>
                <h3 style={{ fontSize: 20, marginBottom: 20 }}>Credit Client Account</h3>

                <div style={{ marginBottom: 16 }}>
                  <label className="label">Select Client</label>
                  <select value={fundForm.userId} onChange={e => handleFundUserSelect(e.target.value)} style={{ width: '100%', padding: 12, borderRadius: 10 }}>
                    <option value="">— Choose a client —</option>
                    {users.map(u => <option key={u._id} value={u._id}>{u.firstName} {u.lastName} ({u.email})</option>)}
                  </select>
                </div>

                {fundForm.userId && (
                  <div style={{ marginBottom: 16 }}>
                    <label className="label">Select Account</label>
                    <select value={fundForm.accountId} onChange={e => setFundForm(f => ({ ...f, accountId: e.target.value }))} style={{ width: '100%', padding: 12, borderRadius: 10 }}>
                      <option value="">— Choose account —</option>
                      {fundAccounts.map(a => <option key={a._id} value={a._id}>{a.accountType} — {fmt(a.balance, a.currency)}</option>)}
                    </select>
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr', gap: 12, marginBottom: 16 }}>
                  <div>
                    <label className="label">Amount</label>
                    <input type="number" min="0.01" step="0.01" value={fundForm.amount} onChange={e => setFundForm(f => ({ ...f, amount: e.target.value }))} placeholder="0.00" style={{ width: '100%', padding: 12, borderRadius: 10 }} />
                  </div>
                  <div>
                    <label className="label">Currency</label>
                    <select value={fundForm.currency} onChange={e => setFundForm(f => ({ ...f, currency: e.target.value }))} style={{ width: '100%', padding: 12, borderRadius: 10 }}>
                      {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: 24 }}>
                  <label className="label">Reference (optional)</label>
                  <input value={fundForm.description} onChange={e => setFundForm(f => ({ ...f, description: e.target.value }))} placeholder="e.g., Bonus, Refund, Test deposit" style={{ width: '100%', padding: 12, borderRadius: 10 }} />
                </div>

                {fundStatus && (
                  <div style={{
                    padding: 12, borderRadius: 10, marginBottom: 16,
                    background: fundStatus.ok ? 'rgba(74,222,128,0.08)' : 'rgba(248,113,113,0.08)',
                    color: fundStatus.ok ? 'var(--green)' : 'var(--red)',
                    fontSize: 12,
                  }}>
                    {fundStatus.ok ? '✓' : '⚠'} {fundStatus.msg}
                  </div>
                )}

                <button
                  style={{ width: '100%', padding: 14, borderRadius: 12, background: 'linear-gradient(135deg, #C9A84C, #B8942C)', color: '#050709', fontWeight: 600, border: 'none', cursor: 'pointer' }}
                  onClick={submitFund}
                  disabled={fundLoading || !fundForm.userId || !fundForm.accountId || !fundForm.amount}
                >
                  {fundLoading ? 'Processing...' : `Credit ${fundForm.currency} ${fundForm.amount || '0'}`}
                </button>
              </div>
            </div>
          )}

          {/* ── USERS ── */}
          {tab === 'users' && (
            <div>
              <div style={{ marginBottom: 20, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                <input
                  value={userSearch}
                  onChange={e => setUserSearch(e.target.value)}
                  placeholder="Search by name or email..."
                  style={{ flex: 1, minWidth: 200, padding: 12, borderRadius: 10 }}
                />
                <button
                  onClick={() => loadUsers()}
                  style={{ padding: '12px 20px', borderRadius: 10, background: 'var(--surface)', border: '1px solid var(--border)', cursor: 'pointer' }}
                >
                  🔄 Refresh
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {users.map(u => (
                  <div key={u._id} className="card" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{
                          width: 44, height: 44, borderRadius: '50%',
                          background: 'var(--raised)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 16, fontWeight: 600, color: 'var(--gold)',
                        }}>{u.firstName?.[0]}{u.lastName?.[0]}</div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                            <p style={{ fontWeight: 600, fontSize: 15 }}>{u.firstName} {u.lastName}</p>
                            <span style={{ padding: '2px 8px', borderRadius: 12, background: u.isActive ? 'rgba(74,222,128,0.1)' : 'rgba(248,113,113,0.1)', color: u.isActive ? 'var(--green)' : 'var(--red)', fontSize: 9 }}>
                              {u.isActive ? 'Active' : 'Suspended'}
                            </span>
                          </div>
                          <p style={{ fontSize: 12, color: 'var(--muted)' }}>{u.email}</p>
                          <p style={{ fontSize: 10, color: 'var(--muted2)', marginTop: 2 }}>Joined: {fmtDate(u.createdAt)}</p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button
                          style={{ padding: '6px 14px', borderRadius: 8, background: u.isActive ? 'rgba(248,113,113,0.1)' : 'rgba(74,222,128,0.1)', border: 'none', color: u.isActive ? 'var(--red)' : 'var(--green)', fontSize: 11, cursor: 'pointer' }}
                          onClick={async () => { await api.toggleUserActive(u._id); loadUsers(); }}
                        >
                          {u.isActive ? 'Suspend' : 'Activate'}
                        </button>
                        <button
                          style={{ padding: '6px 14px', borderRadius: 8, background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.2)', color: 'var(--red)', fontSize: 11, cursor: 'pointer' }}
                          onClick={() => setShowDeleteConfirm({ userId: u._id, userName: `${u.firstName} ${u.lastName}` })}
                        >
                          🗑 Delete
                        </button>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                      {u.accounts?.map(acc => (
                        <div key={acc._id} style={{
                          flex: '1 1 200px',
                          padding: '12px',
                          borderRadius: 10,
                          background: 'rgba(255,255,255,0.02)',
                          border: `1px solid ${acc.isFrozen ? 'rgba(248,113,113,0.2)' : 'var(--border)'}`,
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                            <p style={{ fontSize: 11, fontWeight: 500 }}>{acc.accountType}</p>
                            <button
                              style={{ padding: '2px 8px', borderRadius: 6, background: 'none', border: '1px solid var(--border)', fontSize: 9, cursor: 'pointer' }}
                              onClick={async () => { await api.toggleFreezeAcct(acc._id); loadUsers(); }}
                            >
                              {acc.isFrozen ? 'Unfreeze' : 'Freeze'}
                            </button>
                          </div>
                          <p style={{ fontSize: 16, fontWeight: 500, color: 'var(--gold)' }}>{fmt(acc.balance, acc.currency)}</p>
                          <p style={{ fontSize: 9, color: 'var(--muted)', marginTop: 4 }}>****{acc.accountNumber?.slice(-4)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Delete Confirmation Modal */}
              {showDeleteConfirm && (
                <div style={{
                  position: 'fixed', inset: 0, zIndex: 1000,
                  background: 'rgba(5,7,9,0.85)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
                }}>
                  <div className="card" style={{ maxWidth: 440, width: '100%', padding: '32px' }}>
                    <div style={{ textAlign: 'center', marginBottom: 24 }}>
                      <div style={{ fontSize: 48, marginBottom: 12 }}>⚠️</div>
                      <h3 style={{ fontSize: 22, marginBottom: 8 }}>Delete User</h3>
                      <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 16 }}>
                        Are you sure you want to delete <strong>{showDeleteConfirm.userName}</strong>?
                      </p>
                      <p style={{ fontSize: 11, color: 'var(--red)', background: 'rgba(248,113,113,0.1)', padding: 8, borderRadius: 8 }}>
                        ⚠️ This will permanently delete ALL user data including:<br />
                        accounts, transactions, withdrawal requests, and notifications.
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <button
                        className="btn-outline"
                        style={{ flex: 1 }}
                        onClick={() => setShowDeleteConfirm(null)}
                      >
                        Cancel
                      </button>
                      <button
                        style={{
                          flex: 1, padding: 12, borderRadius: 10, border: 'none', cursor: 'pointer',
                          background: 'rgba(248,113,113,0.1)',
                          color: 'var(--red)',
                        }}
                        onClick={() => handleDeleteUser(showDeleteConfirm.userId)}
                      >
                        Confirm Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── TRANSACTIONS ── */}
          {tab === 'transactions' && (
            <div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {txns.map(tx => (
                  <div key={tx._id} className="card" style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 6 }}>
                          <p style={{ fontWeight: 500, fontSize: 13 }}>{tx.description || tx.type}</p>
                          <span style={{ padding: '2px 6px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', fontSize: 9 }}>{tx.type?.toUpperCase()}</span>
                        </div>
                        <p style={{ fontSize: 11, color: 'var(--muted)' }}>
                          {tx.user?.firstName} {tx.user?.lastName} · {fmtDate(tx.createdAt)}
                        </p>
                      </div>
                      <p style={{ fontSize: 16, fontWeight: 600, color: ['deposit', 'admin_fund'].includes(tx.type) ? 'var(--green)' : 'var(--text)' }}>
                        {['deposit', 'admin_fund'].includes(tx.type) ? '+' : '-'}{fmt(tx.amount, tx.currency)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              {txPages > 1 && (
                <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 24 }}>
                  <button className="btn-outline" onClick={() => setTxPage(p => Math.max(1, p - 1))} disabled={txPage === 1}>← Prev</button>
                  <span style={{ padding: '8px 14px', fontSize: 11, color: 'var(--muted)' }}>{txPage} / {txPages}</span>
                  <button className="btn-outline" onClick={() => setTxPage(p => Math.min(txPages, p + 1))} disabled={txPage === txPages}>Next →</button>
                </div>
              )}
            </div>
          )}

          {tab === 'monitoring' && (
            <div className="animate-in">
              <AdminMonitoring />
            </div>
          )}
        </main>
      </div>

      {/* Contact Detail Modal */}
      {showContactDetail && selectedContact && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(5,7,9,0.85)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 20,
        }}>
          <div className="card" style={{
            maxWidth: 600,
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            padding: '32px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
              <h3 style={{ fontSize: 22 }}>Contact Details</h3>
              <button
                onClick={() => { setShowContactDetail(false); setSelectedContact(null); }}
                style={{
                  background: 'none', border: 'none', fontSize: 24, cursor: 'pointer',
                  color: 'var(--muted)',
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
                <ContactPriorityBadge priority={selectedContact.priority} />
                <ContactStatusBadge status={selectedContact.status} />
              </div>
              <p style={{ fontSize: 20, fontWeight: 500, marginBottom: 4 }}>{selectedContact.fullName}</p>
              <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 12 }}>{selectedContact.email}</p>
              <p style={{ fontSize: 13, color: 'var(--muted2)' }}>
                {fmtDate(selectedContact.createdAt)} · {fmtTime(selectedContact.createdAt)}
              </p>
            </div>

            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 500, marginBottom: 4 }}>SUBJECT</p>
              <p style={{ fontSize: 16 }}>{selectedContact.subject}</p>
            </div>

            <div style={{ marginBottom: 24 }}>
              <p style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 500, marginBottom: 4 }}>MESSAGE</p>
              <div style={{
                padding: '16px',
                background: 'rgba(255,255,255,0.02)',
                borderRadius: 10,
                border: '1px solid var(--border)',
                whiteSpace: 'pre-wrap',
                fontSize: 14,
                lineHeight: 1.6,
                maxHeight: 200,
                overflow: 'auto',
              }}>
                {selectedContact.message}
              </div>
            </div>

            {selectedContact.adminNote && (
              <div style={{ marginBottom: 24 }}>
                <p style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 500, marginBottom: 4 }}>ADMIN NOTE</p>
                <div style={{
                  padding: '12px',
                  background: 'rgba(201,168,76,0.05)',
                  borderRadius: 8,
                  borderLeft: '3px solid var(--gold)',
                  fontSize: 13,
                }}>
                  {selectedContact.adminNote}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button
                onClick={() => {
                  setStatusUpdateData({ status: selectedContact.status, adminNote: selectedContact.adminNote || '' });
                  setShowStatusModal(true);
                }}
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  borderRadius: 8,
                  background: 'rgba(59,130,246,0.1)',
                  border: '1px solid rgba(59,130,246,0.2)',
                  color: '#60A5FA',
                  cursor: 'pointer',
                  fontSize: 13,
                }}
              >
                ✏️ Update Status
              </button>
              <button
                onClick={() => handleDeleteContact(selectedContact._id)}
                style={{
                  padding: '10px 16px',
                  borderRadius: 8,
                  background: 'rgba(248,113,113,0.1)',
                  border: '1px solid rgba(248,113,113,0.2)',
                  color: 'var(--red)',
                  cursor: 'pointer',
                  fontSize: 13,
                }}
              >
                🗑 Delete
              </button>
              <button
                onClick={() => { setShowContactDetail(false); setSelectedContact(null); }}
                style={{
                  padding: '10px 16px',
                  borderRadius: 8,
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  color: 'var(--text)',
                  cursor: 'pointer',
                  fontSize: 13,
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Status Update Modal */}
      {showStatusModal && selectedContact && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1001,
          background: 'rgba(5,7,9,0.85)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 20,
        }}>
          <div className="card" style={{ maxWidth: 440, width: '100%', padding: '32px' }}>
            <h3 style={{ fontSize: 20, marginBottom: 20 }}>Update Status</h3>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 500, display: 'block', marginBottom: 4 }}>Status</label>
              <select
                value={statusUpdateData.status}
                onChange={e => setStatusUpdateData(d => ({ ...d, status: e.target.value }))}
                style={{ width: '100%', padding: 12, borderRadius: 10 }}
              >
                <option value="open">Open</option>
                <option value="in_review">In Review</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 500, display: 'block', marginBottom: 4 }}>Admin Note</label>
              <input
                value={statusUpdateData.adminNote}
                onChange={e => setStatusUpdateData(d => ({ ...d, adminNote: e.target.value }))}
                placeholder="Add a note about this contact..."
                style={{ width: '100%', padding: 12, borderRadius: 10 }}
              />
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                className="btn-outline"
                style={{ flex: 1 }}
                onClick={() => { setShowStatusModal(false); setStatusUpdateData({ status: '', adminNote: '' }); }}
              >
                Cancel
              </button>
              <button
                style={{
                  flex: 1, padding: 12, borderRadius: 10, border: 'none', cursor: 'pointer',
                  background: 'rgba(59,130,246,0.1)',
                  color: '#60A5FA',
                }}
                onClick={handleUpdateStatus}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stage Action Modal */}
      {activeStageAction && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(5,7,9,0.85)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
        }}>
          <div className="card" style={{ maxWidth: 440, width: '100%', padding: '32px' }}>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>{activeStageAction.action === 'approve' ? '✅' : '❌'}</div>
              <h3 style={{ fontSize: 22, marginBottom: 8 }}>
                {activeStageAction.action === 'approve' ? 'Approve Stage' : 'Reject Stage'}
              </h3>
              <p style={{ fontSize: 13, color: 'var(--muted)' }}>
                {activeStageAction.action === 'approve'
                  ? 'This will allow the client to proceed.'
                  : 'This will reject the withdrawal request.'}
              </p>
            </div>
            <div style={{ marginBottom: 20 }}>
              <label className="label">Admin Note</label>
              <input
                value={stageNote}
                onChange={e => setStageNote(e.target.value)}
                placeholder="Add a note..."
                style={{ width: '100%', padding: 12, borderRadius: 10 }}
              />
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn-outline" style={{ flex: 1 }} onClick={() => setActiveStageAction(null)}>Cancel</button>
              <button
                style={{
                  flex: 1, padding: 12, borderRadius: 10, border: 'none', cursor: 'pointer',
                  background: activeStageAction.action === 'approve' ? 'rgba(74,222,128,0.1)' : 'rgba(248,113,113,0.1)',
                  color: activeStageAction.action === 'approve' ? 'var(--green)' : 'var(--red)',
                }}
                onClick={handleStageAction} disabled={stageLoading}
              >
                {stageLoading ? 'Processing...' : (activeStageAction.action === 'approve' ? 'Confirm Approve' : 'Confirm Reject')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
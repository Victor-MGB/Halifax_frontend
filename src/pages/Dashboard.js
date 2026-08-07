import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api, fmt, fmtDate } from '../utils/api';
import { useCountUp, Skeleton, StatusBadge } from '../components/ui';

const ACC_GRADIENT = {
  checking:   'linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%)',
  savings:    'linear-gradient(135deg, #0F766E 0%, #10B981 100%)',
  investment: 'linear-gradient(135deg, #6D28D9 0%, #8B5CF6 100%)',
  default:    'linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)',
};

const ACC_TINT = {
  checking:   '#DBEAFE',
  savings:    '#D1FAE5',
  investment: '#EDE9FE',
  default:    '#DBEAFE',
};

const QUICK_ACTIONS = [
  { label: 'Transfer',  sub: 'Move funds',        path: '/transfer', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M7 4v13m0 0-3-3m3 3 3-3M17 20V7m0 0-3 3m3-3 3 3" /></svg> },
  { label: 'Withdraw',  sub: 'Request payout',    path: '/withdraw', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v11m0 0 3.5-3.5M12 14 8.5 10.5M5 21h14" /></svg> },
  { label: 'History',   sub: 'View activity',     path: '/history',  icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 7v5l3 2m5.5-1.5a8.5 8.5 0 1 1-2.5-6M3 4v5h5" /></svg> },
  { label: 'Alerts',    sub: 'Notifications',     path: '/notifications', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M15 17h5l-1.4-1.6A5 5 0 0 1 17 12V9a5 5 0 0 0-10 0v3c0 1.2-.4 2.3-1.6 3.4L4 17h5m6 0a3 3 0 0 1-6 0" /></svg> },
];

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function Dashboard() {
  const { user, unreadCount } = useAuth();
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getAccounts(), api.getTransactions({ limit: 8 })])
      .then(([a, t]) => {
        setAccounts(a.data.accounts || []);
        setTransactions(t.data.transactions || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const total = useMemo(() => accounts.reduce((s, a) => s + (a.balance || 0), 0), [accounts]);
  const primaryCurrency = accounts[0]?.currency || 'USD';
  const animatedTotal = useCountUp(total);

  const { changeLabel, changePositive } = useMemo(() => {
    let inAmount = 0, outAmount = 0;
    transactions.forEach(tx => {
      const amt = Number(tx.amount) || 0;
      if (['deposit', 'admin_fund'].includes(tx.type)) inAmount += amt;
      else outAmount += amt;
    });
    if (inAmount <= 0) return { changeLabel: 'No activity yet', changePositive: true };
    const pct = ((inAmount - outAmount) / inAmount) * 100;
    return { changeLabel: `${pct >= 0 ? '+' : ''}${pct.toFixed(1)}% this month`, changePositive: pct >= 0 };
  }, [transactions]);

  const allocation = useMemo(() => {
    const colors = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444'];
    const items = accounts.map((a, i) => ({
      type: a.accountType,
      balance: a.balance || 0,
      currency: a.currency,
      color: colors[i % colors.length],
    }));
    const denom = Math.max(total, 1);
    return items;
  }, [accounts, total]);

  const DashboardSkeleton = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      <div><Skeleton width={240} height={28} /></div>
      <Skeleton height={190} radius={20} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 14 }}>
        {[0, 1, 2, 3].map(i => <Skeleton key={i} height={96} radius={16} />)}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 20 }}>
        <Skeleton height={300} radius={18} />
        <Skeleton height={300} radius={18} />
      </div>
    </div>
  );

  if (loading) return <div className="animate-in"><DashboardSkeleton /></div>;

  const firstName = user?.firstName || 'there';

  return (
    <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>
      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <p className="app-page-title">Client dashboard</p>
          <h1 className="app-page-h1" style={{ fontSize: 30 }}>
            {greeting()}, <span style={{ background: 'linear-gradient(120deg, #1E40AF, #2563EB)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>{firstName}</span>
          </h1>
          <p style={{ fontSize: 13.5, color: 'var(--muted)', marginTop: 5 }}>
            Here's what's happening with your money today.
          </p>
        </div>
        {unreadCount > 0 ? (
          <button
            onClick={() => navigate('/notifications')}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '9px 16px', borderRadius: 999, cursor: 'pointer',
              background: 'var(--red-light)', border: '1px solid #FECACA',
              color: 'var(--red-dark)', fontSize: 12.5, fontWeight: 600, fontFamily: 'var(--font-sans)',
            }}
          >
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--red)' }} />
            {unreadCount} unread alert{unreadCount > 1 ? 's' : ''}
          </button>
        ) : (
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            padding: '8px 14px', borderRadius: 999,
            background: 'var(--green-light)', border: '1px solid #A7F3D0',
            color: 'var(--green-dark)', fontSize: 12, fontWeight: 600,
          }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
            All caught up
          </span>
        )}
      </div>

      {/* ── Total balance hero ── */}
      <div style={{
        background: 'linear-gradient(135deg, #1E3A8A 0%, #1E40AF 55%, #2563EB 100%)',
        borderRadius: 24, padding: '34px 38px',
        color: '#fff', position: 'relative', overflow: 'hidden',
        boxShadow: '0 24px 48px -16px rgba(30, 64, 175, 0.5)',
      }}>
        <div style={{ position: 'absolute', top: -70, right: -50, width: 260, height: 260, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
        <div style={{ position: 'absolute', bottom: -90, left: 200, width: 220, height: 220, borderRadius: '50%', background: 'rgba(16,185,129,0.12)' }} />
        <div style={{ position: 'absolute', inset: 0, opacity: 0.5, backgroundImage: 'radial-gradient(rgba(255,255,255,0.16) 1px, transparent 1px)', backgroundSize: '22px 22px' }} />

        <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <p style={{ fontSize: 12, fontWeight: 500, opacity: 0.75, letterSpacing: 1.2, textTransform: 'uppercase' }}>Total balance</p>
            <p className="tabular" style={{ fontSize: 46, fontWeight: 700, letterSpacing: -1.5, lineHeight: 1.1, marginTop: 8 }}>
              {fmt(animatedTotal, primaryCurrency)}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 16, flexWrap: 'wrap' }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: changePositive ? 'rgba(16,185,129,0.25)' : 'rgba(248,113,113,0.3)',
                color: changePositive ? '#A7F3D0' : '#FECACA',
                padding: '4px 12px', borderRadius: 999, fontSize: 12, fontWeight: 600,
                border: `1px solid ${changePositive ? 'rgba(16,185,129,0.4)' : 'rgba(248,113,113,0.4)'}`,
              }}>
                {changePositive ? '↗' : '↘'} {changeLabel}
              </span>
              <span style={{ fontSize: 12.5, opacity: 0.8 }}>
                {accounts.length} account{accounts.length === 1 ? '' : 's'} · {primaryCurrency}
              </span>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(255,255,255,0.14)', border: '1px solid rgba(255,255,255,0.25)',
              borderRadius: 999, padding: '6px 14px', fontSize: 11.5, fontWeight: 600, letterSpacing: 0.3,
            }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ADE80' }} />
              Account verified
            </div>
            <p className="mono" style={{ fontSize: 11, opacity: 0.6, marginTop: 12 }}>HALIFAX •••• 4532</p>
          </div>
        </div>
      </div>

      {/* ── Quick actions ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 14 }}>
        {QUICK_ACTIONS.map(a => (
          <button
            key={a.path}
            onClick={() => navigate(a.path)}
            className="card card-hover"
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 12,
              textAlign: 'left', cursor: 'pointer', padding: '18px', borderRadius: 16,
            }}
          >
            <span className="icon-tile" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>{a.icon}</span>
            <span>
              <span style={{ display: 'block', fontSize: 13.5, fontWeight: 600 }}>{a.label}</span>
              <span style={{ display: 'block', fontSize: 11.5, color: 'var(--muted)', marginTop: 1 }}>{a.sub}</span>
            </span>
          </button>
        ))}
      </div>

      {/* ── Allocation + two columns ── */}
      {accounts.length > 0 && (
        <div className="card" style={{ padding: '20px 24px', borderRadius: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap', gap: 8 }}>
            <h2 style={{ fontSize: 15, fontWeight: 600 }}>Account allocation</h2>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              {allocation.map(a => (
                <span key={a.type} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11.5, color: 'var(--muted)' }}>
                  <span style={{ width: 9, height: 9, borderRadius: 3, background: a.color }} />
                  {a.type.charAt(0).toUpperCase() + a.type.slice(1)}
                </span>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', height: 12, borderRadius: 999, overflow: 'hidden', background: 'var(--surface2)' }}>
            {allocation.map(a => (
              <div key={a.type} style={{ width: `${(a.balance / Math.max(total, 1)) * 100}%`, background: a.color }} />
            ))}
          </div>
        </div>
      )}

      <div className="dash-cols">
        {/* ── Accounts ── */}
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h2 style={{ fontSize: 17, fontWeight: 600 }}>Your accounts</h2>
            <button
              className="btn-ghost"
              style={{ fontSize: 12, padding: '6px 10px', color: 'var(--primary)' }}
              onClick={() => navigate('/history')}
            >
              View all →
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: 14 }}>
            {accounts.map(acc => (
              <div
                key={acc._id}
                style={{
                  background: ACC_GRADIENT[acc.accountType] || ACC_GRADIENT.default,
                  borderRadius: 18, padding: '22px',
                  color: '#fff', position: 'relative', overflow: 'hidden',
                  boxShadow: '0 14px 28px -10px rgba(17,24,39,0.3)',
                  transition: 'transform 0.2s',
                  cursor: 'pointer',
                }}
                onClick={() => navigate('/history')}
              >
                <div style={{ position: 'absolute', top: -34, right: -34, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
                <div style={{ position: 'absolute', bottom: -40, left: -20, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative' }}>
                  <div>
                    <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, opacity: 0.85 }}>
                      {acc.accountType} account
                    </p>
                    <p className="mono" style={{ fontSize: 12, opacity: 0.75, marginTop: 2 }}>
                      •••• {String(acc.accountNumber || '').slice(-4)}
                    </p>
                  </div>
                  {acc.isFrozen && (
                    <span style={{ background: 'rgba(248,113,113,0.95)', color: '#fff', borderRadius: 999, padding: '3px 10px', fontSize: 10, fontWeight: 700, letterSpacing: 0.5 }}>
                      FROZEN
                    </span>
                  )}
                </div>
                <p className="tabular" style={{ fontSize: 25, fontWeight: 700, letterSpacing: -0.5, marginTop: 20, position: 'relative' }}>
                  {fmt(acc.balance, acc.currency)}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, position: 'relative', marginTop: 14 }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ADE80', boxShadow: '0 0 0 3px rgba(74,222,128,0.25)' }} />
                  <span style={{ fontSize: 10.5, opacity: 0.8, letterSpacing: 0.5 }}>ACTIVE</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Recent activity ── */}
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h2 style={{ fontSize: 17, fontWeight: 600 }}>Recent activity</h2>
            <button
              className="btn-ghost"
              style={{ fontSize: 12, padding: '6px 10px', color: 'var(--primary)' }}
              onClick={() => navigate('/history')}
            >
              See all →
            </button>
          </div>
          <div className="card" style={{ padding: 0, overflow: 'hidden', borderRadius: 16 }}>
            {transactions.length === 0 ? (
              <div style={{ padding: 44, textAlign: 'center' }}>
                <div className="icon-tile" style={{ background: 'var(--primary-light)', color: 'var(--primary)', margin: '0 auto 14px' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 7v5l3 2m5.5-1.5a8.5 8.5 0 1 1-2.5-6M3 4v5h5" /></svg>
                </div>
                <p style={{ color: 'var(--muted)', fontSize: 13.5 }}>No transactions yet.</p>
                <p style={{ color: 'var(--muted)', fontSize: 12, marginTop: 4 }}>Your activity will appear here.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {transactions.map((tx, i) => {
                  const isCredit = ['deposit', 'admin_fund'].includes(tx.type);
                  return (
                    <div
                      key={tx._id}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 14,
                        padding: '15px 18px',
                        borderBottom: i < transactions.length - 1 ? '1px solid var(--border)' : 'none',
                        background: tx.isRead ? 'transparent' : 'var(--primary-faint)',
                        transition: 'background 0.15s',
                      }}
                    >
                      <div style={{ width: 40, height: 40, borderRadius: 12, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: isCredit ? 'var(--green-light)' : 'var(--primary-light)', color: isCredit ? 'var(--green-dark)' : 'var(--primary)' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                          {isCredit ? <path d="M12 19V5m0 0-5 5m5-5 5 5" /> : <path d="M12 5v14m0 0 5-5m-5 5-5-5" />}
                        </svg>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 13.5, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {tx.description || tx.type}
                        </p>
                        <p style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 2 }}>
                          {fmtDate(tx.createdAt)} · {(tx.type || 'transaction').replace(/_/g, ' ')}
                        </p>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <p className="tabular" style={{ fontSize: 14, fontWeight: 700, color: isCredit ? 'var(--green-dark)' : 'var(--text)' }}>
                          {isCredit ? '+' : '−'}{fmt(tx.amount, tx.currency)}
                        </p>
                        <div style={{ marginTop: 5, display: 'flex', justifyContent: 'flex-end' }}>
                          <StatusBadge status={tx.status || 'completed'} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api, fmt, fmtDate } from '../utils/api';

const ACC_COLORS = { checking:'var(--gold)', savings:'var(--teal)', investment:'var(--purple)' };
const TX_COLORS  = { Transfer:'var(--teal)', Income:'var(--green)', admin_fund:'var(--gold)', deposit:'var(--green)' };

export default function Dashboard() {
  const { user, unreadCount } = useAuth();
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getAccounts(), api.getTransactions({ limit:6 })])
      .then(([a, t]) => { setAccounts(a.data.accounts); setTransactions(t.data.transactions); })
      .finally(() => setLoading(false));
  }, []);

  const total = accounts.reduce((s,a) => s + a.balance, 0);
  const primaryCurrency = accounts[0]?.currency || 'USD';

  if (loading) return <div style={{ color:'var(--muted)', fontFamily:'var(--font-mono)', letterSpacing:2, fontSize:11 }}>LOADING…</div>;

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:28 }} className="animate-in">
      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
        <div>
          <p style={{ fontFamily:'var(--font-mono)', fontSize:10, color:'var(--gold)', letterSpacing:3, marginBottom:4 }}>WELCOME BACK</p>
          <h1 style={{ fontFamily:'var(--font-serif)', fontSize:36, fontWeight:400, lineHeight:1 }}>{user?.firstName} {user?.lastName}</h1>
        </div>
        {unreadCount > 0 && (
          <button onClick={() => navigate('/notifications')} style={{
            background:'rgba(201,168,76,0.08)', border:'1px solid rgba(201,168,76,0.2)',
            borderRadius:10, padding:'10px 16px', cursor:'pointer',
            display:'flex', alignItems:'center', gap:8, color:'var(--gold)', fontSize:12,
          }}>
            <span>◎</span> {unreadCount} unread
          </button>
        )}
      </div>

      {/* Total balance hero */}
      <div style={{
        background:'linear-gradient(135deg, var(--surface) 0%, var(--raised) 100%)',
        border:'1px solid var(--border)',
        borderRadius:20, padding:'32px 36px',
        position:'relative', overflow:'hidden',
      }}>
        <div style={{ position:'absolute', top:-80, right:-80, width:280, height:280, borderRadius:'50%', background:'radial-gradient(circle, rgba(201,168,76,0.06), transparent 70%)' }} />
        <div style={{ position:'absolute', bottom:-40, left:120, width:180, height:180, borderRadius:'50%', background:'radial-gradient(circle, rgba(62,207,207,0.04), transparent 70%)' }} />
        <p className="label">Total Portfolio Value</p>
        <p style={{ fontFamily:'var(--font-serif)', fontSize:52, fontWeight:400, letterSpacing:-1, color:'var(--text)', marginBottom:6 }}>
          {fmt(total, primaryCurrency)}
        </p>
        <div style={{ display:'flex', gap:24, marginTop:8 }}>
          <span style={{ fontSize:12, color:'var(--muted)' }}>{accounts.length} accounts</span>
          <span style={{ fontSize:12, color:'var(--green)' }}>● Active</span>
        </div>
      </div>

      {/* Accounts */}
      <div>
        <p className="label" style={{ marginBottom:12 }}>Your Accounts</p>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(200px, 1fr))', gap:12 }}>
          {accounts.map(acc => (
            <div key={acc._id} style={{
              background:'var(--surface)', border:`1px solid ${acc.isFrozen ? 'rgba(248,113,113,0.3)' : 'var(--border)'}`,
              borderRadius:14, padding:'18px 20px', position:'relative', overflow:'hidden',
            }}>
              <div style={{
                position:'absolute', top:-20, right:-20, width:80, height:80, borderRadius:'50%',
                background:`radial-gradient(circle, ${(ACC_COLORS[acc.accountType]||'var(--gold)')}15, transparent 70%)`,
              }} />
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
                <p style={{ fontSize:11, color:'var(--muted)', textTransform:'capitalize', letterSpacing:1 }}>{acc.accountType}</p>
                {acc.isFrozen && <span className="badge" style={{ background:'rgba(248,113,113,0.12)', color:'var(--red)', fontSize:9 }}>FROZEN</span>}
              </div>
              <p style={{ fontFamily:'var(--font-serif)', fontSize:22, fontWeight:500, color: ACC_COLORS[acc.accountType] || 'var(--gold)' }}>
                {fmt(acc.balance, acc.currency)}
              </p>
              <p style={{ fontFamily:'var(--font-mono)', fontSize:10, color:'var(--muted)', marginTop:6 }}>
                ••••{acc.accountNumber?.slice(-4)} · {acc.currency}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick actions */}
      <div style={{ display:'flex', gap:10 }}>
        {[
          { label:'Transfer', path:'/transfer', icon:'⇄' },
          { label:'Withdraw', path:'/withdraw', icon:'↑' },
          { label:'History',  path:'/history',  icon:'☰' },
        ].map(a => (
          <button key={a.path} onClick={() => navigate(a.path)} style={{
            flex:1, background:'var(--surface)', border:'1px solid var(--border)',
            borderRadius:12, padding:'14px', cursor:'pointer', color:'var(--text)',
            display:'flex', flexDirection:'column', alignItems:'center', gap:6,
            transition:'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor='var(--gold)'; e.currentTarget.style.color='var(--gold)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.color='var(--text)'; }}
          >
            <span style={{ fontSize:18 }}>{a.icon}</span>
            <span style={{ fontSize:11, letterSpacing:1 }}>{a.label}</span>
          </button>
        ))}
      </div>

      {/* Recent transactions */}
      <div>
        <p className="label" style={{ marginBottom:12 }}>Recent Activity</p>
        {transactions.length === 0 ? (
          <p style={{ color:'var(--muted)', fontSize:13 }}>No transactions yet.</p>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
            {transactions.map(tx => (
              <div key={tx._id} style={{
                background:'var(--surface)', border:'1px solid var(--border)',
                borderRadius:12, padding:'14px 18px',
                display:'flex', justifyContent:'space-between', alignItems:'center',
              }}>
                <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <div style={{ width:3, height:36, borderRadius:2, background: TX_COLORS[tx.type] || TX_COLORS[tx.category] || 'var(--muted)', flexShrink:0 }} />
                  <div>
                    <p style={{ fontSize:13, fontWeight:500 }}>{tx.description}</p>
                    <p style={{ fontSize:10, color:'var(--muted)', fontFamily:'var(--font-mono)', marginTop:2 }}>{fmtDate(tx.createdAt)} · {tx.type}</p>
                  </div>
                </div>
                <p style={{ fontSize:14, fontWeight:600, color: ['deposit','admin_fund'].includes(tx.type) ? 'var(--green)' : 'var(--text)' }}>
                  {['deposit','admin_fund'].includes(tx.type) ? '+' : ''}{fmt(tx.amount, tx.currency)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

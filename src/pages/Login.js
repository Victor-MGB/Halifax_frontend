import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PERKS = [
  { icon: '🛡', title: 'Bank-grade security', desc: '256-bit encryption and multi-factor protection' },
  { icon: '🌍', title: 'Multi-currency accounts', desc: 'Hold funds in USD, EUR, GBP, CHF and more' },
  { icon: '⚡', title: 'Instant transfers', desc: 'Move money between accounts in real time' },
  { icon: '🔔', title: 'Real-time alerts', desc: 'Instant notifications on every activity' },
];

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const submit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const u = await login(form.email, form.password);
      navigate(u.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--bg)' }}>
      {/* Left brand panel */}
      <div style={{
        display: isMobile ? 'none' : 'flex',
        flex: '0 0 46%',
        flexDirection: 'column',
        background: 'linear-gradient(160deg, #1E3A8A 0%, #1E40AF 50%, #2563EB 100%)',
        color: '#fff',
        padding: '56px 64px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -100, right: -80, width: 360, height: 360, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
        <div style={{ position: 'absolute', bottom: -120, left: -60, width: 320, height: 320, borderRadius: '50%', background: 'rgba(16,185,129,0.15)' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, position: 'relative', zIndex: 1 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: '#fff', color: 'var(--primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: 20,
          }}>HO</div>
          <div>
            <p style={{ fontWeight: 700, fontSize: 18, lineHeight: 1.2 }}>Halifax Offshore</p>
            <p style={{ fontSize: 10, letterSpacing: 1.5, opacity: 0.8 }}>DIGITAL PRIVATE BANK</p>
          </div>
        </div>

        <div style={{ marginTop: 'auto', marginBottom: 'auto', position: 'relative', zIndex: 1 }}>
          <h1 style={{ fontSize: 42, fontWeight: 700, letterSpacing: -1, lineHeight: 1.15, marginBottom: 18 }}>
            Banking,<br />elevated.
          </h1>
          <p style={{ fontSize: 15, opacity: 0.85, maxWidth: 360, lineHeight: 1.7 }}>
            Modern digital private banking with institutional-grade compliance, multi-currency accounts and real-time transparency.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, position: 'relative', zIndex: 1 }}>
          {PERKS.map(p => (
            <div key={p.title} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 14, padding: '14px 16px' }}>
              <div style={{ fontSize: 18, marginBottom: 6 }}>{p.icon}</div>
              <p style={{ fontSize: 12.5, fontWeight: 600 }}>{p.title}</p>
              <p style={{ fontSize: 11, opacity: 0.75, marginTop: 3 }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right form panel */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: isMobile ? '32px 20px' : '56px' }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          <div style={{ marginBottom: 36 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 28 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 11,
                background: 'var(--primary)', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: 17,
              }}>HO</div>
              <div>
                <p style={{ fontWeight: 700, fontSize: 15, lineHeight: 1.2 }}>Halifax Offshore</p>
                <p style={{ fontSize: 9, color: 'var(--muted)', letterSpacing: 1.2 }}>DIGITAL PRIVATE BANK</p>
              </div>
            </div>
            <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: -0.5, marginBottom: 6 }}>Welcome back</h1>
            <p style={{ fontSize: 13.5, color: 'var(--muted)' }}>Sign in to your account to continue.</p>
          </div>

          <form onSubmit={submit}>
            <div style={{ marginBottom: 16 }}>
              <label className="label">Email address</label>
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@email.com" required />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label className="label">Password</label>
              <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="••••••••" required />
            </div>

            {error && <div className="status-box status-error" style={{ marginBottom: 16 }}><span>⚠</span>{error}</div>}

            <button type="submit" className="btn-primary btn-block" style={{ padding: '14px' }} disabled={loading}>
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--muted)', marginTop: 24 }}>
            New client?{' '}
            <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>Create an account</Link>
          </p>

          <div style={{ marginTop: 28, padding: '14px 16px', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 14, fontSize: 11.5, color: 'var(--muted)', textAlign: 'center' }}>
            Secured with 256-bit encryption &nbsp;·&nbsp; Need help? <Link to="/contact" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>Contact support</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

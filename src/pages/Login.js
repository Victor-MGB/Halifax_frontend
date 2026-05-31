import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async e => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const u = await login(form.email, form.password);
      navigate(u.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally { setLoading(false); }
  };

  return (
    <div style={{
      minHeight:'100vh', display:'flex', background:'var(--void)',
      backgroundImage:'radial-gradient(ellipse at 20% 50%, rgba(201,168,76,0.04) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(62,207,207,0.03) 0%, transparent 50%)',
      position: 'relative',
    }}>
      {/* Back to Home button - absolute positioned */}
      <Link 
        to="/" 
        style={{
          position: 'absolute',
          top: 24,
          left: 24,
          zIndex: 10,
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid var(--border)',
          borderRadius: 10,
          padding: '8px 16px',
          fontSize: 12,
          color: 'var(--muted)',
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          transition: 'all 0.2s',
          backdropFilter: 'blur(10px)',
        }}
        onMouseEnter={e => {
          e.target.style.background = 'rgba(201,168,76,0.1)';
          e.target.style.color = 'var(--gold)';
          e.target.style.borderColor = 'rgba(201,168,76,0.3)';
        }}
        onMouseLeave={e => {
          e.target.style.background = 'rgba(255,255,255,0.05)';
          e.target.style.color = 'var(--muted)';
          e.target.style.borderColor = 'var(--border)';
        }}
      >
        ← Back to Home
      </Link>

      {/* Left panel */}
      <div style={{
        flex:'0 0 420px', display:'flex', flexDirection:'column',
        justifyContent:'center', padding:'60px 56px',
        background:'var(--deep)', borderRight:'1px solid var(--border)',
      }}>
        <div style={{ marginBottom:48 }}>
          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:32 }}>
            <div style={{
              width:44, height:44, borderRadius:12,
              background:'linear-gradient(135deg, #C9A84C, #E8C97A)',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontFamily:'var(--font-serif)', fontWeight:700, color:'#050709', fontSize:22,
            }}>HO</div>
            <div>
              <p style={{ fontFamily:'var(--font-serif)', fontWeight:600, fontSize:20, letterSpacing:3 }}>Halifx Offshore</p>
              <p style={{ fontFamily:'var(--font-mono)', fontSize:9, color:'var(--gold)', letterSpacing:2 }}>PRIVATE BANK</p>
            </div>
          </div>
          <h1 style={{ fontFamily:'var(--font-serif)', fontWeight:300, fontSize:36, lineHeight:1.2, marginBottom:8 }}>
            Welcome<br />Back
          </h1>
          <p style={{ color:'var(--muted)', fontSize:13 }}>Sign in to your private account</p>
        </div>

        <form onSubmit={submit}>
          <div style={{ marginBottom:16 }}>
            <label className="label">Email Address</label>
            <input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="your@email.com" required />
          </div>
          <div style={{ marginBottom:24 }}>
            <label className="label">Password</label>
            <input type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="••••••••" required />
          </div>

          {error && (
            <div style={{ background:'rgba(248,113,113,0.08)', border:'1px solid rgba(248,113,113,0.2)', borderRadius:10, padding:'10px 14px', marginBottom:16, color:'var(--red)', fontSize:12 }}>
              {error}
            </div>
          )}

          <button type="submit" className="btn-gold" style={{ width:'100%', padding:'14px' }} disabled={loading}>
            {loading ? 'Signing In…' : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign:'center', fontSize:12, color:'var(--muted)', marginTop:20 }}>
          New client? <Link to="/register" style={{ color:'var(--gold)', textDecoration:'none' }}>Open an account</Link>
        </p>

        <div style={{ marginTop:32, padding:'14px 16px', background:'var(--surface)', border:'1px solid var(--border)', borderRadius:10, fontSize:11 }}>
          <p style={{ color:'var(--gold)', fontFamily:'var(--font-mono)', letterSpacing:1, marginBottom:6, fontSize:10 }}>DEMO ACCESS</p>
          <div style={{ marginTop: 32, padding: '14px 16px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, fontSize: 11 }}>
  <p style={{ color: 'var(--gold)', fontFamily: 'var(--font-mono)', letterSpacing: 1, marginBottom: 6, fontSize: 10 }}>🔐 DEMO ACCESS</p>
  <p style={{ color: 'var(--muted)', fontSize: 10, marginBottom: 4 }}>
    <span style={{ color: 'var(--gold)', marginRight: 6 }}>→</span> 
    Sign in with your credentials or use demo access
  </p>
  <p style={{ color: 'var(--muted)', fontSize: 9, marginTop: 8, fontStyle: 'italic' }}>
    For assistance, contact Halifax Offshore Private Bank Support
  </p>
</div>
        </div>
      </div>

      {/* Right decorative panel */}
      <div style={{
        flex:1, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:32,
        padding:60,
      }}>
        <div style={{ textAlign:'center', maxWidth:360 }}>
          <p style={{ fontFamily:'var(--font-serif)', fontSize:48, fontWeight:300, lineHeight:1.1, color:'var(--text)', marginBottom:16 }}>
            Banking<br />Elevated
          </p>
          <p style={{ color:'var(--muted)', fontSize:14, lineHeight:1.8 }}>
            Private banking solutions with institutional-grade security and compliance.
          </p>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, width:'100%', maxWidth:340 }}>
          {['256-bit encryption','Multi-layer KYC','22-stage compliance','Real-time monitoring'].map(t => (
            <div key={t} style={{
              padding:'14px 16px', background:'var(--surface)', border:'1px solid var(--border)',
              borderRadius:12, fontSize:11, color:'var(--muted)',
            }}>
              <span style={{ color:'var(--gold)', marginRight:8 }}>✦</span>{t}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
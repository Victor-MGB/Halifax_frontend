import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', phone: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const set = e => setForm({ ...form, [e.target.name]: e.target.value });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const submit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    
    try {
      await register(form);
      setSuccess('Account created successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      background: 'var(--void)', 
      padding: isMobile ? 16 : 20,
      position: 'relative',
    }}>
      
      {/* Mobile Header with Hamburger */}
      {isMobile && (
        <>
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 200,
            background: 'var(--deep)',
            borderBottom: '1px solid var(--border)',
            padding: '12px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: 'linear-gradient(135deg, #C9A84C, #E8C97A)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, color: '#050709', fontSize: 14,
              }}>HO</div>
              <div>
                <p style={{ fontSize: 12, fontWeight: 600 }}>Halifx Offshore</p>
                <p style={{ fontSize: 8, color: 'var(--gold)' }}>PRIVATE BANK</p>
              </div>
            </div>
            
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: 24,
                cursor: 'pointer',
                color: 'var(--text)',
                padding: 8,
              }}
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>

          {/* Mobile Menu Dropdown */}
          <div style={{
            position: 'fixed',
            top: 60,
            left: 0,
            right: 0,
            background: 'var(--deep)',
            borderBottom: '1px solid var(--border)',
            padding: '16px',
            transform: mobileMenuOpen ? 'translateY(0)' : 'translateY(-120%)',
            transition: 'transform 0.3s ease',
            zIndex: 199,
            boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
          }}>
            <Link 
              to="/" 
              style={{
                display: 'block',
                padding: '12px 16px',
                color: 'var(--text)',
                textDecoration: 'none',
                fontSize: 14,
                borderRadius: 8,
                transition: 'background 0.2s',
              }}
              onClick={() => setMobileMenuOpen(false)}
            >
              ← Back to Home
            </Link>
            <div style={{
              height: 1,
              background: 'var(--border)',
              margin: '8px 0',
            }} />
            <Link 
              to="/login" 
              style={{
                display: 'block',
                padding: '12px 16px',
                color: 'var(--text)',
                textDecoration: 'none',
                fontSize: 14,
                borderRadius: 8,
                transition: 'background 0.2s',
              }}
              onClick={() => setMobileMenuOpen(false)}
            >
              Sign In
            </Link>
          </div>

          {/* Overlay */}
          {mobileMenuOpen && (
            <div
              onClick={() => setMobileMenuOpen(false)}
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 198,
                background: 'rgba(0,0,0,0.5)',
              }}
            />
          )}
        </>
      )}

      <div style={{
        background: 'var(--deep)', 
        border: '1px solid var(--border)',
        borderRadius: 20, 
        padding: isMobile ? '80px 20px 40px' : '48px 44px', 
        width: '100%', 
        maxWidth: 460,
        position: 'relative',
        marginTop: isMobile ? 40 : 0,
      }}>
        {/* Back to Home button - Desktop */}
        {!isMobile && (
          <Link 
            to="/" 
            style={{
              position: 'absolute',
              top: 20,
              left: 20,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              padding: '6px 12px',
              fontSize: 11,
              color: 'var(--muted)',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              e.target.style.background = 'rgba(201,168,76,0.1)';
              e.target.style.color = 'var(--gold)';
            }}
            onMouseLeave={e => {
              e.target.style.background = 'rgba(255,255,255,0.05)';
              e.target.style.color = 'var(--muted)';
            }}
          >
            ← Back to Home
          </Link>
        )}

        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 13, margin: '0 auto 16px',
            background: 'linear-gradient(135deg, #C9A84C, #E8C97A)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-serif)', fontWeight: 700, color: '#050709', fontSize: 24,
          }}>HO</div>
          <h1 style={{ 
            fontFamily: 'var(--font-serif)', 
            fontWeight: 200, 
            fontSize: isMobile ? 22 : 26, 
            marginBottom: 4 
          }}>Register</h1>
          <p style={{ color: 'var(--muted)', fontSize: 12 }}>Join Halifx Offshore Private Bank</p>
        </div>

        <form onSubmit={submit}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', 
            gap: 12, 
            marginBottom: 14 
          }}>
            <div>
              <label className="label">First Name</label>
              <input 
                name="firstName" 
                value={form.firstName} 
                onChange={set} 
                placeholder="Alice" 
                required 
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label className="label">Last Name</label>
              <input 
                name="lastName" 
                value={form.lastName} 
                onChange={set} 
                placeholder="Johnson" 
                required 
                style={{ width: '100%' }}
              />
            </div>
          </div>
          
          <div style={{ marginBottom: 14 }}>
            <label className="label">Email</label>
            <input 
              name="email" 
              type="email" 
              value={form.email} 
              onChange={set} 
              placeholder="you@email.com" 
              required 
              style={{ width: '100%' }}
            />
          </div>
          
          <div style={{ marginBottom: 14 }}>
            <label className="label">Phone (optional)</label>
            <input 
              name="phone" 
              value={form.phone} 
              onChange={set} 
              placeholder="+1 555 000 0000" 
              style={{ width: '100%' }}
            />
          </div>
          
          <div style={{ marginBottom: 24 }}>
            <label className="label">Password</label>
            <input 
              name="password" 
              type="password" 
              value={form.password} 
              onChange={set} 
              placeholder="Min 6 characters" 
              required 
              minLength={6}
              style={{ width: '100%' }}
            />
          </div>

          {error && (
            <div style={{
              background: 'rgba(248,113,113,0.08)',
              border: '1px solid rgba(248,113,113,0.2)',
              borderRadius: 10,
              padding: '10px 14px',
              marginBottom: 16,
              color: 'var(--red)',
              fontSize: 12
            }}>
              {error}
            </div>
          )}

          {success && (
            <div style={{
              background: 'rgba(74,222,128,0.08)',
              border: '1px solid rgba(74,222,128,0.2)',
              borderRadius: 10,
              padding: '10px 14px',
              marginBottom: 16,
              color: 'var(--green)',
              fontSize: 12
            }}>
              ✅ {success}
            </div>
          )}

          <button 
            type="submit" 
            className="btn-gold" 
            style={{ width: '100%', padding: '14px' }} 
            disabled={loading}
          >
            {loading ? 'Creating Account…' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--muted)', marginTop: 20 }}>
          Already a member? <Link to="/login" style={{ color: 'var(--gold)', textDecoration: 'none' }}>Sign in</Link>
        </p>

        {/* Mobile Demo Access Info */}
        {isMobile && (
          <div style={{ 
            marginTop: 24, 
            padding: '12px', 
            background: 'var(--surface)', 
            border: '1px solid var(--border)', 
            borderRadius: 10, 
            fontSize: 10,
            textAlign: 'center'
          }}>
            <p style={{ color: 'var(--gold)', fontSize: 9, marginBottom: 6 }}>🔐 HALIFX OFFSHORE</p>
            <p style={{ color: 'var(--muted)', fontSize: 9 }}>
              Secure private banking with 22-stage compliance
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
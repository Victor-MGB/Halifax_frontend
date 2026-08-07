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
  const set = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await register(form);
      setSuccess('Account created successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
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
      background: 'var(--bg)',
      padding: '32px 20px',
    }}>
      <div style={{
        background: '#fff',
        border: '1px solid var(--border)',
        borderRadius: 20,
        padding: '36px 40px',
        width: '100%',
        maxWidth: 480,
        boxShadow: 'var(--shadow-lg)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 26 }}>
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

        <h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: -0.5, marginBottom: 6 }}>Create your account</h1>
        <p style={{ fontSize: 13.5, color: 'var(--muted)', marginBottom: 28 }}>
          Join Halifax Offshore and open multi-currency accounts in minutes.
        </p>

        <form onSubmit={submit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
            <div>
              <label className="label">First name</label>
              <input name="firstName" value={form.firstName} onChange={set} placeholder="Alice" required />
            </div>
            <div>
              <label className="label">Last name</label>
              <input name="lastName" value={form.lastName} onChange={set} placeholder="Johnson" required />
            </div>
          </div>

          <div style={{ marginBottom: 14 }}>
            <label className="label">Email</label>
            <input name="email" type="email" value={form.email} onChange={set} placeholder="you@email.com" required />
          </div>

          <div style={{ marginBottom: 14 }}>
            <label className="label">Phone (optional)</label>
            <input name="phone" value={form.phone} onChange={set} placeholder="+1 555 000 0000" />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label className="label">Password</label>
            <input name="password" type="password" value={form.password} onChange={set} placeholder="Min 6 characters" required minLength={6} />
          </div>

          {error && <div className="status-box status-error" style={{ marginBottom: 16 }}><span>⚠</span>{error}</div>}
          {success && <div className="status-box status-success" style={{ marginBottom: 16 }}><span>✓</span>{success}</div>}

          <button type="submit" className="btn-primary btn-block" style={{ padding: '14px' }} disabled={loading}>
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--muted)', marginTop: 22 }}>
          Already a member?{' '}
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
        </p>

        <p style={{ fontSize: 10.5, color: 'var(--faint)', textAlign: 'center', marginTop: 20, lineHeight: 1.7 }}>
          By creating an account you agree to our <Link to="/terms-of-service" style={{ color: 'var(--muted)' }}>Terms of Service</Link> and{' '}
          <Link to="/privacy-policy" style={{ color: 'var(--muted)' }}>Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );
}

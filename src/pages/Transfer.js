import { useState, useEffect } from 'react';
import { api, fmt } from '../utils/api';
import { Checkmark, PageHeader } from '../components/ui';

export default function Transfer() {
  const [accounts, setAccounts] = useState([]);
  const [form, setForm] = useState({ fromAccountId: '', toAccountId: '', amount: '', description: '' });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.getAccounts().then(r => {
      const accs = r.data.accounts || [];
      setAccounts(accs);
      if (accs.length >= 2)
        setForm(f => ({ ...f, fromAccountId: accs[0]._id, toAccountId: accs[1]._id }));
      else if (accs.length === 1)
        setForm(f => ({ ...f, fromAccountId: accs[0]._id }));
    }).catch(() => {});
  }, []);

  const fromAcc = accounts.find(a => a._id === form.fromAccountId);
  const insufficient = fromAcc && form.amount && Number(form.amount) > fromAcc.balance;

  const submit = async e => {
    e.preventDefault();
    setStatus(null);
    setLoading(true);
    try {
      await api.transfer({ ...form, amount: Number(form.amount) });
      const r = await api.getAccounts();
      setAccounts(r.data.accounts || []);
      setStatus({ ok: true, msg: `Successfully transferred ${fmt(form.amount, fromAcc?.currency)}` });
      setForm(f => ({ ...f, amount: '', description: '' }));
    } catch (err) {
      setStatus({ ok: false, msg: err.response?.data?.message || 'Transfer failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in" style={{ maxWidth: 640 }}>
      <PageHeader
        eyebrow="Move funds"
        title="Transfer money"
        subtitle="Move funds between your accounts in real time."
      />

      {/* Balance chips */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12, marginBottom: 24 }}>
        {accounts.map(acc => (
          <div key={acc._id} className="card card-hover" style={{ padding: '16px 18px' }}>
            <p style={{ fontSize: 10.5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8, color: 'var(--muted)', marginBottom: 4 }}>
              {acc.accountType}
            </p>
            <p className="tabular" style={{ fontSize: 17, fontWeight: 700 }}>{fmt(acc.balance, acc.currency)}</p>
            <p className="mono" style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>••••{String(acc.accountNumber || '').slice(-4)}</p>
          </div>
        ))}
      </div>

      {status?.ok && (
        <div className="card" style={{ textAlign: 'center', padding: 32, marginBottom: 24, borderColor: '#A7F3D0' }}>
          <Checkmark />
          <p style={{ fontSize: 16, fontWeight: 600, marginTop: 16 }}>Transfer successful</p>
          <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>{status.msg}</p>
        </div>
      )}

      <div className="card">
        <form onSubmit={submit}>
          <div style={{ marginBottom: 16 }}>
            <label className="label">From account</label>
            <select value={form.fromAccountId} onChange={e => setForm({ ...form, fromAccountId: e.target.value })} required>
              {accounts.map(a => (
                <option key={a._id} value={a._id} disabled={a.isFrozen}>
                  {a.accountType} — {fmt(a.balance, a.currency)}{a.isFrozen ? ' (FROZEN)' : ''}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '4px 0' }}>
            <span style={{
              width: 34, height: 34, borderRadius: '50%',
              background: 'var(--primary-light)', color: 'var(--primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15,
            }}>↓</span>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label className="label">To account</label>
            <select value={form.toAccountId} onChange={e => setForm({ ...form, toAccountId: e.target.value })} required>
              {accounts.map(a => (
                <option key={a._id} value={a._id} disabled={a.isFrozen || a._id === form.fromAccountId}>
                  {a.accountType} — {fmt(a.balance, a.currency)}{a.isFrozen ? ' (FROZEN)' : ''}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label className="label">Amount</label>
            <input
              type="number" min="0.01" step="0.01"
              value={form.amount}
              onChange={e => setForm({ ...form, amount: e.target.value })}
              placeholder="0.00"
              style={{ fontSize: 18, fontWeight: 600, padding: '14px 16px' }}
              required
            />
            {insufficient && (
              <p style={{ color: 'var(--red)', fontSize: 12, marginTop: 6 }}>Insufficient balance in the selected account.</p>
            )}
          </div>

          <div style={{ marginBottom: 24 }}>
            <label className="label">Narration (optional)</label>
            <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="e.g. Monthly savings" />
          </div>

          {status && !status.ok && (
            <div className="status-box status-error" style={{ marginBottom: 16 }}>
              <span>⚠</span> {status.msg}
            </div>
          )}

          <button type="submit" className="btn-primary btn-block" style={{ padding: '15px' }} disabled={loading || insufficient}>
            {loading ? 'Processing…' : 'Confirm transfer'}
          </button>
        </form>
      </div>
    </div>
  );
}

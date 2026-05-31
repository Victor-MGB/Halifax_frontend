import { useState, useEffect } from 'react';
import { api, fmt } from '../utils/api';

export default function Transfer() {
  const [accounts, setAccounts] = useState([]);
  const [form, setForm] = useState({ fromAccountId:'', toAccountId:'', amount:'', description:'' });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.getAccounts().then(r => {
      setAccounts(r.data.accounts);
      if (r.data.accounts.length >= 2)
        setForm(f => ({ ...f, fromAccountId: r.data.accounts[0]._id, toAccountId: r.data.accounts[1]._id }));
    });
  }, []);

  const fromAcc = accounts.find(a => a._id === form.fromAccountId);

  const submit = async e => {
    e.preventDefault(); setStatus(null); setLoading(true);
    try {
      await api.transfer({ ...form, amount: Number(form.amount) });
      const r = await api.getAccounts(); setAccounts(r.data.accounts);
      setStatus({ ok:true, msg:`Successfully transferred ${fmt(form.amount, fromAcc?.currency)}` });
      setForm(f => ({ ...f, amount:'', description:'' }));
    } catch (err) {
      setStatus({ ok:false, msg: err.response?.data?.message || 'Transfer failed' });
    } finally { setLoading(false); }
  };

  return (
    <div className="animate-in" style={{ maxWidth:560 }}>
      <p style={{ fontFamily:'var(--font-mono)', fontSize:10, color:'var(--gold)', letterSpacing:3, marginBottom:4 }}>MOVE FUNDS</p>
      <h1 style={{ fontFamily:'var(--font-serif)', fontSize:36, fontWeight:400, marginBottom:28 }}>Transfer Money</h1>

      {/* Balance chips */}
      <div style={{ display:'flex', gap:10, marginBottom:24 }}>
        {accounts.map(acc => (
          <div key={acc._id} style={{ flex:1, background:'var(--surface)', border:'1px solid var(--border)', borderRadius:12, padding:'14px 16px' }}>
            <p style={{ fontSize:10, color:'var(--muted)', textTransform:'capitalize', letterSpacing:1, marginBottom:4 }}>{acc.accountType}</p>
            <p style={{ fontSize:17, fontWeight:600, color:'var(--gold)' }}>{fmt(acc.balance, acc.currency)}</p>
          </div>
        ))}
      </div>

      <div className="card">
        <form onSubmit={submit}>
          <div style={{ marginBottom:14 }}>
            <label className="label">From</label>
            <select value={form.fromAccountId} onChange={e => setForm({...form, fromAccountId:e.target.value})} required>
              {accounts.map(a => <option key={a._id} value={a._id} disabled={a.isFrozen}>{a.accountType} — {fmt(a.balance, a.currency)}{a.isFrozen?' (FROZEN)':''}</option>)}
            </select>
          </div>

          <div style={{ textAlign:'center', color:'var(--gold)', fontSize:22, margin:'8px 0' }}>⇅</div>

          <div style={{ marginBottom:14 }}>
            <label className="label">To</label>
            <select value={form.toAccountId} onChange={e => setForm({...form, toAccountId:e.target.value})} required>
              {accounts.map(a => <option key={a._id} value={a._id} disabled={a.isFrozen}>{a.accountType} — {fmt(a.balance, a.currency)}{a.isFrozen?' (FROZEN)':''}</option>)}
            </select>
          </div>

          <div style={{ marginBottom:14 }}>
            <label className="label">Amount</label>
            <input type="number" min="0.01" step="0.01" value={form.amount} onChange={e => setForm({...form, amount:e.target.value})} placeholder="0.00" required />
            {fromAcc && form.amount && Number(form.amount) > fromAcc.balance && (
              <p style={{ color:'var(--red)', fontSize:11, marginTop:6 }}>Insufficient balance</p>
            )}
          </div>

          <div style={{ marginBottom:24 }}>
            <label className="label">Note (optional)</label>
            <input value={form.description} onChange={e => setForm({...form, description:e.target.value})} placeholder="e.g. Monthly savings" />
          </div>

          {status && (
            <div style={{
              padding:'12px 16px', borderRadius:10, marginBottom:16, fontSize:12,
              background: status.ok ? 'rgba(74,222,128,0.08)' : 'rgba(248,113,113,0.08)',
              border: `1px solid ${status.ok ? 'rgba(74,222,128,0.25)' : 'rgba(248,113,113,0.25)'}`,
              color: status.ok ? 'var(--green)' : 'var(--red)',
            }}>
              {status.ok ? '✓' : '⚠'} {status.msg}
            </div>
          )}

          <button type="submit" className="btn-gold" style={{ width:'100%', padding:'14px' }} disabled={loading}>
            {loading ? 'Processing…' : 'Confirm Transfer'}
          </button>
        </form>
      </div>
    </div>
  );
}

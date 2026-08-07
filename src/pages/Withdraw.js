import { useState, useEffect } from 'react';
import { api, fmt, CURRENCIES } from '../utils/api';
import { PageHeader, Skeleton } from '../components/ui';

const STAGE_STATUS_STYLES = {
  pending:  { badge: 'badge-warning', dot: '#F59E0B', label: 'Pending approval' },
  approved: { badge: 'badge-success', dot: '#10B981', label: 'Approved' },
  rejected: { badge: 'badge-danger',  dot: '#EF4444', label: 'Rejected' },
};

export default function Withdraw() {
  const [accounts, setAccounts] = useState([]);
  const [form, setForm] = useState({ accountId: '', amount: '', currency: 'USD', destination: '' });
  const [withdrawalReq, setWithdrawalReq] = useState(null);
  const [showStageModal, setShowStageModal] = useState(false);
  const [triggeredStage, setTriggeredStage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState('');
  const [completedMsg, setCompletedMsg] = useState('');
  const [showForm, setShowForm] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [accRes, wdRes] = await Promise.all([api.getAccounts(), api.getMyWithdrawals()]);
      const accountsData = accRes.data?.accounts || accRes.data || [];
      setAccounts(accountsData);
      if (accountsData.length) {
        const firstAccount = accountsData[0];
        setForm(f => ({
          ...f,
          accountId: firstAccount._id || firstAccount.id,
          currency: firstAccount.currency || 'USD',
        }));
      }
      const withdrawals = wdRes.data?.requests || wdRes.data || [];
      const active = withdrawals.find(r => r.status === 'in_progress');
      if (active) {
        setWithdrawalReq(active);
        setShowForm(false);
      }
    } catch (err) {
      setError('Failed to load accounts or withdrawal data');
    } finally {
      setPageLoading(false);
    }
  };

  const getSelectedAccount = () => accounts.find(a => (a._id || a.id) === form.accountId);

  const handleWithdraw = async () => {
    setError('');
    setLoading(true);
    setCompletedMsg('');
    const selectedAcct = getSelectedAccount();
    const amountNum = Number(form.amount);

    if (!selectedAcct) { setError('Please select an account'); setLoading(false); return; }
    if (!form.amount || isNaN(amountNum) || amountNum <= 0) { setError('Please enter a valid amount'); setLoading(false); return; }
    if (amountNum > (selectedAcct.balance || 0)) {
      setError(`Insufficient funds. Available: ${fmt(selectedAcct.balance, selectedAcct.currency)}`);
      setLoading(false);
      return;
    }

    try {
      const requestData = {
        accountId: selectedAcct._id || selectedAcct.id,
        amount: amountNum,
      };
      if (form.currency) requestData.currency = form.currency;
      if (form.destination) requestData.destination = form.destination;

      const res = await api.initiateWithdrawal(requestData);

      if (res.data?.completed) {
        setCompletedMsg(res.data.message || 'Withdrawal completed successfully!');
        setWithdrawalReq(null);
        setShowForm(true);
      } else if (res.data?.request) {
        setWithdrawalReq(res.data.request);
        setTriggeredStage(res.data.stageTriggered);
        setShowStageModal(true);
        setShowForm(false);
      } else {
        setError('Unexpected response from server');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error initiating withdrawal');
    } finally {
      setLoading(false);
    }
  };

  const handleProceed = async () => {
    setLoading(true);
    setError('');
    try {
      const requestData = {
        accountId: withdrawalReq.account,
        amount: withdrawalReq.amount,
      };
      if (withdrawalReq.currency) requestData.currency = withdrawalReq.currency;
      if (withdrawalReq.destination) requestData.destination = withdrawalReq.destination;

      const res = await api.initiateWithdrawal(requestData);

      if (res.data?.completed) {
        setCompletedMsg(res.data.message || 'Withdrawal completed successfully!');
        setWithdrawalReq(null);
        setShowForm(true);
      } else if (res.data?.request) {
        setWithdrawalReq(res.data.request);
        setTriggeredStage(res.data.stageTriggered);
        setShowStageModal(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error proceeding to next stage');
    } finally {
      setLoading(false);
    }
  };

  const refreshStatus = async () => {
    try {
      const res = await api.getMyWithdrawals();
      const withdrawals = res.data?.requests || res.data || [];
      const active = withdrawals.find(r => r.status === 'in_progress');
      setWithdrawalReq(active || null);
      if (!active) setShowForm(true);
    } catch (err) {
      console.error('Refresh failed:', err);
    }
  };

  const lastStage = withdrawalReq?.stages?.[withdrawalReq.stages.length - 1];
  const isPending = lastStage?.status === 'pending';
  const isApproved = lastStage?.status === 'approved';
  const completedCount = withdrawalReq?.stages?.filter(s => s.status === 'approved').length || 0;
  const progress = (completedCount / 22) * 100;

  if (pageLoading) {
    return (
      <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div><Skeleton width={240} height={30} /></div>
        <Skeleton height={360} radius={16} />
      </div>
    );
  }

  return (
    <div className="animate-in" style={{ maxWidth: 900 }}>
      <PageHeader
        eyebrow="Secure processing"
        title="Withdrawal request"
        subtitle="Funds are subject to our compliance verification process."
      />

      {completedMsg && (
        <div className="card" style={{ borderColor: '#A7F3D0', background: '#ECFDF5', marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <p style={{ color: 'var(--green-dark)', fontWeight: 600, marginBottom: 2 }}>✓ Withdrawal approved</p>
            <p style={{ color: 'var(--muted)', fontSize: 13 }}>{completedMsg}</p>
          </div>
          <button className="btn-outline" onClick={() => { setCompletedMsg(''); setWithdrawalReq(null); setShowForm(true); }}>
            New withdrawal
          </button>
        </div>
      )}

      {error && (
        <div className="status-box status-error" style={{ marginBottom: 24 }}>
          <span>⚠</span> {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: showForm && !withdrawalReq ? 'minmax(0,1fr) minmax(0,1fr)' : '1fr', gap: 24 }}>
        {/* Withdrawal form */}
        {showForm && !withdrawalReq && (
          <div className="card">
            <p style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>Withdrawal details</p>

            <div style={{ marginBottom: 16 }}>
              <label className="label">From account</label>
              <select
                value={form.accountId}
                onChange={e => {
                  const acc = accounts.find(a => (a._id || a.id) === e.target.value);
                  setForm({ ...form, accountId: e.target.value, currency: acc?.currency || 'USD' });
                }}
              >
                <option value="">Select an account</option>
                {accounts.map(acc => {
                  const id = acc._id || acc.id;
                  return (
                    <option key={id} value={id}>
                      {acc.accountType || 'Account'} — {fmt(acc.balance, acc.currency)} {acc.isFrozen ? '(FROZEN)' : ''}
                    </option>
                  );
                })}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12, marginBottom: 16 }}>
              <div>
                <label className="label">Amount</label>
                <input type="number" min="0.01" step="0.01" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} placeholder="0.00" />
              </div>
              <div>
                <label className="label">Currency</label>
                <select value={form.currency} onChange={e => setForm({ ...form, currency: e.target.value })}>
                  {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <label className="label">Destination (optional)</label>
              <input value={form.destination} onChange={e => setForm({ ...form, destination: e.target.value })} placeholder="e.g. IBAN, account number" />
            </div>

            <button className="btn-primary btn-block" style={{ padding: '14px' }} onClick={handleWithdraw} disabled={loading || !form.amount || !form.accountId}>
              {loading ? 'Processing…' : 'Initiate withdrawal'}
            </button>
          </div>
        )}

        {/* Progress tracker */}
        {withdrawalReq && withdrawalReq.stages && (
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, flexWrap: 'wrap', gap: 8 }}>
              <p style={{ fontSize: 16, fontWeight: 600 }}>Verification progress</p>
              <span className="mono" style={{ fontSize: 12, color: 'var(--muted)' }}>{completedCount} / 22 stages</span>
            </div>

            <div style={{ background: 'var(--surface2)', borderRadius: 999, height: 8, marginBottom: 24, overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                background: 'linear-gradient(90deg, var(--primary), var(--green))',
                width: `${Math.min(progress, 100)}%`,
                borderRadius: 999,
                transition: 'width 0.5s ease',
              }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 460, overflowY: 'auto', marginBottom: 24 }}>
              {withdrawalReq.stages.map((stage, idx) => {
                const st = STAGE_STATUS_STYLES[stage.status] || STAGE_STATUS_STYLES.pending;
                return (
                  <div key={idx} style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    background: stage.status === 'pending' ? 'var(--amber-light)' : stage.status === 'approved' ? 'var(--green-light)' : stage.status === 'rejected' ? 'var(--red-light)' : 'var(--surface2)',
                    border: '1px solid var(--border)',
                    borderRadius: 12, padding: '12px 16px',
                  }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: st.dot, flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: 600 }}>Stage {stage.stageNumber}: {stage.stageName}</p>
                      {stage.adminNote && <p style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>Note: {stage.adminNote}</p>}
                    </div>
                    <span className={`badge ${st.badge}`}>{st.label}</span>
                  </div>
                );
              })}
            </div>

            {isApproved && withdrawalReq.status !== 'completed' && (
              <button className="btn-primary btn-block" style={{ padding: '14px' }} onClick={handleProceed} disabled={loading}>
                {loading ? 'Processing…' : `Proceed to stage ${completedCount + 1}`}
              </button>
            )}

            {isPending && (
              <div style={{ textAlign: 'center', background: 'var(--amber-light)', borderRadius: 12, padding: 16 }}>
                <p style={{ color: 'var(--amber-dark)', marginBottom: 12, fontSize: 13.5 }}>
                  ⏳ Stage {lastStage?.stageNumber} is pending admin approval
                </p>
                <button className="btn-outline" onClick={refreshStatus}>Refresh status</button>
              </div>
            )}

            {lastStage?.status === 'rejected' && (
              <div style={{ textAlign: 'center', background: 'var(--red-light)', borderRadius: 12, padding: 16 }}>
                <p style={{ color: 'var(--red-dark)', marginBottom: 12, fontSize: 13.5 }}>
                  ✕ Withdrawal rejected at stage {lastStage.stageNumber}
                </p>
                <button className="btn-outline" onClick={() => { setWithdrawalReq(null); setShowForm(true); }}>
                  Start new withdrawal
                </button>
              </div>
            )}

            {withdrawalReq.status === 'completed' && (
              <div style={{ textAlign: 'center', background: 'var(--green-light)', borderRadius: 12, padding: 16 }}>
                <p style={{ color: 'var(--green-dark)', fontSize: 14 }}>✓ All stages complete! Withdrawal approved!</p>
              </div>
            )}
          </div>
        )}

        {!withdrawalReq && !showForm && (
          <div className="card" style={{ textAlign: 'center', padding: 48 }}>
            <p style={{ color: 'var(--muted)' }}>No active withdrawal. Start a new one above.</p>
          </div>
        )}
      </div>

      {/* Stage modal */}
      {showStageModal && triggeredStage && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(17, 24, 39, 0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 20,
        }}>
          <div style={{
            background: '#fff',
            borderRadius: 20,
            padding: '32px 36px',
            maxWidth: 480,
            width: '100%',
            textAlign: 'center',
            boxShadow: 'var(--shadow-xl)',
            animation: 'slideUp 0.3s cubic-bezier(0.22, 1, 0.36, 1) both',
          }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: 72, height: 72, borderRadius: '50%',
              background: 'var(--primary-light)', color: 'var(--primary)',
              fontSize: 30, fontWeight: 700, marginBottom: 18,
            }}>
              {triggeredStage.number}
            </div>
            <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1.5, color: 'var(--primary)', textTransform: 'uppercase', marginBottom: 8 }}>
              Stage {triggeredStage.number} of 22
            </p>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 10 }}>{triggeredStage.name}</h2>
            <p style={{ color: 'var(--muted)', marginBottom: 26, fontSize: 13.5 }}>{triggeredStage.description}</p>
            <button className="btn-primary btn-block" onClick={() => setShowStageModal(false)}>
              Understood
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

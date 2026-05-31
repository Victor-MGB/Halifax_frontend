import { useState, useEffect } from 'react';
import { api, fmt, CURRENCIES } from '../utils/api';

const STAGE_STATUS_STYLES = {
  pending:  { bg:'rgba(251,191,36,0.08)', border:'rgba(251,191,36,0.25)', color:'var(--amber)',  dot:'var(--amber)',  label:'Pending Approval' },
  approved: { bg:'rgba(74,222,128,0.08)', border:'rgba(74,222,128,0.25)', color:'var(--green)',  dot:'var(--green)',  label:'Approved' },
  rejected: { bg:'rgba(248,113,113,0.08)',border:'rgba(248,113,113,0.25)',color:'var(--red)',    dot:'var(--red)',    label:'Rejected' },
};

export default function Withdraw() {
  const [accounts, setAccounts] = useState([]);
  const [form, setForm] = useState({ accountId:'', amount:'', currency:'USD', destination:'' });
  const [withdrawalReq, setWithdrawalReq] = useState(null);
  const [showStageModal, setShowStageModal] = useState(false);
  const [triggeredStage, setTriggeredStage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState('');
  const [completedMsg, setCompletedMsg] = useState('');
  const [showForm, setShowForm] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
        const accountId = firstAccount._id || firstAccount.id;
        setForm(f => ({ 
          ...f, 
          accountId: accountId,
          currency: firstAccount.currency || 'USD' 
        }));
      }
      
      const withdrawals = wdRes.data?.requests || wdRes.data || [];
      const active = withdrawals.find(r => r.status === 'in_progress');
      if (active) {
        setWithdrawalReq(active);
        setShowForm(false);
      }
    } catch (err) {
      console.error('Failed to load data:', err);
      setError('Failed to load accounts or withdrawal data');
    } finally {
      setPageLoading(false);
    }
  };

  const getSelectedAccount = () => {
    return accounts.find(a => (a._id || a.id) === form.accountId);
  };

  const handleWithdraw = async () => {
    setError('');
    setLoading(true);
    setCompletedMsg('');
    
    const selectedAcct = getSelectedAccount();
    const amountNum = Number(form.amount);
    
    if (!selectedAcct) {
      setError('Please select an account');
      setLoading(false);
      return;
    }
    
    if (!form.amount || isNaN(amountNum) || amountNum <= 0) {
      setError('Please enter a valid amount');
      setLoading(false);
      return;
    }
    
    if (amountNum > (selectedAcct.balance || 0)) {
      setError(`Insufficient funds. Available: ${fmt(selectedAcct.balance, selectedAcct.currency)}`);
      setLoading(false);
      return;
    }
    
    try {
      const requestData = {
        accountId: selectedAcct._id || selectedAcct.id,
        amount: amountNum
      };
      
      if (form.currency) requestData.currency = form.currency;
      if (form.destination) requestData.destination = form.destination;
      
      console.log('Sending to backend:', requestData);
      
      const res = await api.initiateWithdrawal(requestData);
      
      console.log('Backend response:', res.data);
      
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
      console.error('Withdrawal error:', err.response?.data);
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
        amount: withdrawalReq.amount
      };
      
      if (withdrawalReq.currency) requestData.currency = withdrawalReq.currency;
      if (withdrawalReq.destination) requestData.destination = withdrawalReq.destination;
      
      console.log('Proceeding with:', requestData);
      
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
      console.error('Proceed error:', err.response?.data);
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

  if (pageLoading) return (
    <div style={{ textAlign: 'center', padding: isMobile ? 40 : 50 }}>
      <div style={{ 
        width: 40, height: 40, border: '2px solid var(--border)', 
        borderTopColor: 'var(--gold)', borderRadius: '50%', 
        margin: '0 auto 16px', animation: 'spin 1s linear infinite' 
      }} />
      <p>LOADING...</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div className="animate-in" style={{ padding: isMobile ? '16px' : '0' }}>
      <p style={{ 
        fontFamily:'var(--font-mono)', 
        fontSize: isMobile ? 8 : 10, 
        color:'var(--gold)', 
        letterSpacing: isMobile ? 2 : 3, 
        marginBottom: 4 
      }}>SECURE PROCESSING</p>
      <h1 style={{ 
        fontFamily:'var(--font-serif)', 
        fontSize: isMobile ? 24 : 36, 
        fontWeight: 400, 
        marginBottom: isMobile ? 4 : 8 
      }}>Withdrawal Request</h1>
      <p style={{ 
        color:'var(--muted)', 
        fontSize: isMobile ? 11 : 13, 
        marginBottom: isMobile ? 20 : 32 
      }}>Funds are subject to our compliance verification process.</p>

      {completedMsg && (
        <div style={{
          background:'rgba(74,222,128,0.08)',
          border:'1px solid rgba(74,222,128,0.25)',
          borderRadius: 14,
          padding: isMobile ? '16px 20px' : '20px 24px',
          marginBottom: 24,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? 12 : 0,
        }}>
          <div>
            <p style={{ color:'var(--green)', fontWeight: 600, marginBottom: 4 }}>🎉 Withdrawal Approved!</p>
            <p style={{ color:'var(--muted)', fontSize: isMobile ? 11 : 13 }}>{completedMsg}</p>
          </div>
          <button className="btn-outline" onClick={() => {
            setCompletedMsg('');
            setWithdrawalReq(null);
            setShowForm(true);
          }} style={{ width: isMobile ? '100%' : 'auto' }}>
            New Withdrawal
          </button>
        </div>
      )}

      {error && (
        <div style={{
          background:'rgba(248,113,113,0.08)',
          border:'1px solid rgba(248,113,113,0.25)',
          borderRadius: 14,
          padding: isMobile ? '12px 16px' : '16px 20px',
          marginBottom: 24,
          color:'var(--red)',
          fontSize: isMobile ? 11 : 13,
        }}>
          ❌ {error}
        </div>
      )}

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: showForm && !withdrawalReq && !isMobile ? '1fr 1fr' : '1fr', 
        gap: isMobile ? 16 : 24 
      }}>
        
        {/* Withdrawal Form - Shows only when no active withdrawal */}
        {showForm && !withdrawalReq && (
          <div className="card" style={{ padding: isMobile ? '20px' : '24px' }}>
            <p style={{ 
              fontFamily:'var(--font-serif)', 
              fontSize: isMobile ? 16 : 18, 
              marginBottom: isMobile ? 16 : 20 
            }}>Withdrawal Details</p>

            <div style={{ marginBottom: 14 }}>
              <label className="label">From Account</label>
              <select 
                value={form.accountId} 
                onChange={e => {
                  const acc = accounts.find(a => (a._id || a.id) === e.target.value);
                  setForm({ 
                    ...form, 
                    accountId: e.target.value, 
                    currency: acc?.currency || 'USD' 
                  });
                }}
                style={{ fontSize: isMobile ? 13 : 14 }}
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

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr', 
              gap: 10, 
              marginBottom: 14 
            }}>
              <div>
                <label className="label">Amount</label>
                <input
                  type="number" 
                  min="0.01" 
                  step="0.01"
                  value={form.amount} 
                  onChange={e => setForm({...form, amount: e.target.value})}
                  placeholder="0.00"
                  style={{ fontSize: isMobile ? 13 : 14 }}
                />
              </div>
              <div>
                <label className="label">Currency</label>
                <select 
                  value={form.currency} 
                  onChange={e => setForm({...form, currency: e.target.value})}
                  style={{ fontSize: isMobile ? 13 : 14 }}
                >
                  {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label className="label">Destination (optional)</label>
              <input 
                value={form.destination} 
                onChange={e => setForm({...form, destination: e.target.value})} 
                placeholder="e.g., IBAN, account number"
                style={{ fontSize: isMobile ? 13 : 14 }}
              />
            </div>

            <button
              className="btn-gold"
              style={{ width:'100%', padding: isMobile ? '12px' : '14px' }}
              onClick={handleWithdraw}
              disabled={loading || !form.amount || !form.accountId}
            >
              {loading ? 'Processing…' : 'Initiate Withdrawal'}
            </button>
          </div>
        )}

        {/* Progress Tracker - Shows when withdrawal exists */}
        {withdrawalReq && withdrawalReq.stages && (
          <div className="card" style={{ 
            gridColumn: '1 / -1', 
            padding: isMobile ? '20px' : '24px' 
          }}>
            <div style={{ 
              display:'flex', 
              justifyContent:'space-between', 
              alignItems:'center', 
              marginBottom: 16,
              flexWrap: 'wrap',
              gap: 8
            }}>
              <p style={{ 
                fontFamily:'var(--font-serif)', 
                fontSize: isMobile ? 16 : 18 
              }}>Verification Progress</p>
              <span style={{ 
                fontFamily:'var(--font-mono)', 
                fontSize: 11, 
                color:'var(--gold)' 
              }}>{completedCount}/22</span>
            </div>

            {/* Progress Bar */}
            <div style={{ 
              background:'var(--border)', 
              borderRadius: 4, 
              height: isMobile ? 4 : 6, 
              marginBottom: 24, 
              overflow:'hidden' 
            }}>
              <div style={{
                height:'100%',
                background:'linear-gradient(90deg, var(--gold), var(--gold2))',
                width:`${progress}%`,
                transition:'width 0.5s ease',
              }} />
            </div>

            {/* Stages List */}
            <div style={{ 
              display:'flex', 
              flexDirection:'column', 
              gap: isMobile ? 6 : 8, 
              maxHeight: isMobile ? 400 : 500, 
              overflowY:'auto', 
              marginBottom: 24 
            }}>
              {withdrawalReq.stages.map((stage, idx) => {
                const style = STAGE_STATUS_STYLES[stage.status] || STAGE_STATUS_STYLES.pending;
                return (
                  <div key={idx} style={{
                    background: style.bg,
                    border: `1px solid ${style.border}`,
                    borderRadius: 10,
                    padding: isMobile ? '10px 12px' : '12px 16px',
                  }}>
                    <div style={{ 
                      display:'flex', 
                      justifyContent:'space-between', 
                      alignItems:'center',
                      flexDirection: isMobile ? 'column' : 'row',
                      gap: isMobile ? 8 : 0
                    }}>
                      <div style={{ display:'flex', alignItems:'center', gap: 10 }}>
                        <div style={{ width: 8, height: 8, borderRadius:'50%', background:style.dot }} />
                        <span style={{ 
                          fontWeight: 500, 
                          fontSize: isMobile ? 12 : 14 
                        }}>Stage {stage.stageNumber}: {stage.stageName}</span>
                      </div>
                      <span style={{ 
                        fontSize: isMobile ? 10 : 12, 
                        color: style.color 
                      }}>{style.label}</span>
                    </div>
                    {stage.adminNote && (
                      <p style={{ 
                        fontSize: isMobile ? 10 : 11, 
                        color:'var(--muted)', 
                        marginTop: isMobile ? 6 : 8, 
                        marginLeft: isMobile ? 0 : 18 
                      }}>Note: {stage.adminNote}</p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Proceed Button */}
            {isApproved && withdrawalReq.status !== 'completed' && (
              <button
                className="btn-gold"
                style={{ width:'100%', padding: isMobile ? '12px' : '14px' }}
                onClick={handleProceed}
                disabled={loading}
              >
                {loading ? 'Processing…' : `Proceed to Stage ${completedCount + 1}`}
              </button>
            )}

            {/* Pending Approval Message */}
            {isPending && (
              <div style={{ 
                textAlign:'center', 
                padding: isMobile ? '12px' : '16px', 
                background:'rgba(251,191,36,0.08)', 
                borderRadius: 10 
              }}>
                <p style={{ color:'var(--amber)', marginBottom: 12, fontSize: isMobile ? 12 : 14 }}>
                  ⏳ Stage {lastStage?.stageNumber} is pending admin approval
                </p>
                <button 
                  className="btn-outline" 
                  onClick={refreshStatus}
                  style={{ width: isMobile ? '100%' : 'auto' }}
                >
                  Refresh Status
                </button>
              </div>
            )}

            {/* Rejected Message */}
            {lastStage?.status === 'rejected' && (
              <div style={{ 
                textAlign:'center', 
                padding: isMobile ? '12px' : '16px', 
                background:'rgba(248,113,113,0.08)', 
                borderRadius: 10 
              }}>
                <p style={{ color:'var(--red)', marginBottom: 12, fontSize: isMobile ? 12 : 14 }}>
                  ❌ Withdrawal rejected at Stage {lastStage.stageNumber}
                </p>
                <button 
                  className="btn-outline" 
                  onClick={() => {
                    setWithdrawalReq(null);
                    setShowForm(true);
                  }}
                  style={{ width: isMobile ? '100%' : 'auto' }}
                >
                  Start New Withdrawal
                </button>
              </div>
            )}

            {/* Completed Message */}
            {withdrawalReq.status === 'completed' && (
              <div style={{ 
                textAlign:'center', 
                padding: isMobile ? '12px' : '16px', 
                background:'rgba(74,222,128,0.08)', 
                borderRadius: 10 
              }}>
                <p style={{ color:'var(--green)', fontSize: isMobile ? 12 : 14 }}>
                  🎉 All stages complete! Withdrawal approved!
                </p>
              </div>
            )}
          </div>
        )}

        {/* Empty State - No withdrawal */}
        {!withdrawalReq && !showForm && (
          <div className="card" style={{ textAlign:'center', padding: isMobile ? 32 : 48 }}>
            <p>No active withdrawal. Start a new one above.</p>
          </div>
        )}
      </div>

      {/* Stage Modal */}
      {showStageModal && triggeredStage && (
        <div style={{
          position:'fixed', inset:0, zIndex:1000,
          background:'rgba(5,7,9,0.85)', backdropFilter:'blur(8px)',
          display:'flex', alignItems:'center', justifyContent:'center',
          padding: 20,
        }}>
          <div style={{
            background:'var(--deep)', 
            border:'1px solid var(--border2)',
            borderRadius: 20, 
            padding: isMobile ? '24px' : '40px', 
            maxWidth: isMobile ? '90%' : 500, 
            width:'100%',
            textAlign:'center',
          }}>
            <div style={{
              display:'inline-flex', 
              alignItems:'center', 
              justifyContent:'center',
              width: isMobile ? 60 : 80, 
              height: isMobile ? 60 : 80, 
              borderRadius:'50%',
              background:'linear-gradient(135deg, rgba(201,168,76,0.15), rgba(201,168,76,0.05))',
              border:'1px solid rgba(201,168,76,0.3)',
              fontSize: isMobile ? 28 : 36, 
              fontWeight:500, 
              color:'var(--gold)',
              marginBottom: 20,
            }}>
              {triggeredStage.number}
            </div>
            <p style={{ 
              fontFamily:'var(--font-mono)', 
              fontSize: isMobile ? 8 : 10, 
              color:'var(--gold)', 
              letterSpacing: isMobile ? 2 : 3, 
              marginBottom: 8 
            }}>STAGE {triggeredStage.number} OF 22</p>
            <h2 style={{ 
              fontSize: isMobile ? 20 : 24, 
              marginBottom: isMobile ? 8 : 12 
            }}>{triggeredStage.name}</h2>
            <p style={{ 
              color:'var(--muted)', 
              marginBottom: 24, 
              fontSize: isMobile ? 12 : 14 
            }}>{triggeredStage.description}</p>
            <button 
              className="btn-gold" 
              style={{ width:'100%' }} 
              onClick={() => setShowStageModal(false)}
            >
              Understood
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
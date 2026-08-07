import { useState, useEffect } from 'react';
import { api, fmt, fmtDate } from '../utils/api';
import { Skeleton, StatusBadge, Avatar, PageHeader } from '../components/ui';

export default function History() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [error, setError] = useState('');

  useEffect(() => {
    loadTransactions();
  }, [page]);

  const loadTransactions = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.getTransactions({ page, limit: 20 });
      let data = [];
      let totalPages = 1;
      const r = response.data;
      if (Array.isArray(r)) data = r;
      else if (r?.transactions && Array.isArray(r.transactions)) { data = r.transactions; totalPages = r.pages || r.totalPages || 1; }
      else if (r?.data && Array.isArray(r.data)) { data = r.data; totalPages = r.pages || 1; }
      else if (r?.docs && Array.isArray(r.docs)) { data = r.docs; totalPages = r.totalPages || 1; }
      if (r?.pages) totalPages = r.pages;
      if (r?.totalPages) totalPages = r.totalPages;
      setTransactions(data);
      setPages(totalPages);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div><Skeleton width={220} height={30} /></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[0, 1, 2, 3, 4, 5].map(i => <Skeleton key={i} height={62} radius={12} />)}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in">
      <PageHeader eyebrow="Full record" title="Transaction history" subtitle={`${transactions.length} transaction${transactions.length === 1 ? '' : 's'} on this page`} />

      {error && (
        <div className="status-box status-error" style={{ marginBottom: 20 }}>
          <span>⚠</span> {error}
          <button className="btn-outline" onClick={loadTransactions} style={{ marginLeft: 'auto', padding: '6px 14px', fontSize: 12 }}>Retry</button>
        </div>
      )}

      {transactions.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: 60 }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--surface2)', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>📭</div>
          <p style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>No transactions yet</p>
          <p style={{ fontSize: 13, color: 'var(--muted)' }}>Your transactions will appear here once you make transfers or receive funds.</p>
        </div>
      ) : (
        <>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {transactions.map((tx, i) => {
                const isCredit = ['deposit', 'admin_fund'].includes(tx.type);
                return (
                  <div
                    key={tx._id}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 14,
                      padding: '15px 20px',
                      borderBottom: i < transactions.length - 1 ? '1px solid var(--border)' : 'none',
                    }}
                  >
                    <Avatar name={tx.description || tx.type || 'HO'} size={40} color={isCredit ? 'var(--green)' : 'var(--primary)'} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 13.5, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {tx.description || tx.type || 'Transaction'}
                      </p>
                      <p style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 2 }}>
                        {fmtDate(tx.createdAt)} · {(tx.type || tx.transactionType || 'transaction').replace(/_/g, ' ')}
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
          </div>

          {pages > 1 && (
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', alignItems: 'center', marginTop: 24 }}>
              <button className="btn-outline" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
                ← Previous
              </button>
              <span className="mono" style={{ fontSize: 12, color: 'var(--muted)' }}>
                Page {page} of {pages}
              </span>
              <button className="btn-outline" onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages}>
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

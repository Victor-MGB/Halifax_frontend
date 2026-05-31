import { useState, useEffect } from 'react';
import { api, fmt, fmtDate } from '../utils/api';

const TYPE_COLOR = { transfer:'var(--teal)', deposit:'var(--green)', admin_fund:'var(--gold)', withdrawal:'var(--amber)', payment:'var(--muted)' };

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
      console.log('Fetching transactions for page:', page);
      const response = await api.getTransactions({ page, limit: 20 });
      console.log('Raw API response:', response);
      console.log('Response data:', response.data);
      
      // Handle different response structures
      let transactionsData = [];
      let totalPages = 1;
      
      if (response.data) {
        // Check for different possible response structures
        if (Array.isArray(response.data)) {
          transactionsData = response.data;
        } else if (response.data.transactions && Array.isArray(response.data.transactions)) {
          transactionsData = response.data.transactions;
          totalPages = response.data.pages || response.data.totalPages || 1;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          transactionsData = response.data.data;
          totalPages = response.data.pages || 1;
        } else if (response.data.docs && Array.isArray(response.data.docs)) {
          transactionsData = response.data.docs;
          totalPages = response.data.totalPages || 1;
        }
        
        // Also get pages from response if available
        if (response.data.pages) totalPages = response.data.pages;
        if (response.data.totalPages) totalPages = response.data.totalPages;
      }
      
      console.log('Processed transactions:', transactionsData);
      console.log('Total pages:', totalPages);
      
      setTransactions(transactionsData);
      setPages(totalPages);
    } catch (err) {
      console.error('Error loading transactions:', err);
      console.error('Error response:', err.response);
      setError(err.response?.data?.message || err.message || 'Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-in">
        <p style={{ fontFamily:'var(--font-mono)', fontSize:10, color:'var(--gold)', letterSpacing:3, marginBottom:4 }}>FULL RECORD</p>
        <h1 style={{ fontFamily:'var(--font-serif)', fontSize:36, fontWeight:400, marginBottom:28 }}>Transaction History</h1>
        <p style={{ color:'var(--muted)', fontFamily:'var(--font-mono)', fontSize:11, letterSpacing:2 }}>LOADING…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="animate-in">
        <p style={{ fontFamily:'var(--font-mono)', fontSize:10, color:'var(--gold)', letterSpacing:3, marginBottom:4 }}>FULL RECORD</p>
        <h1 style={{ fontFamily:'var(--font-serif)', fontSize:36, fontWeight:400, marginBottom:28 }}>Transaction History</h1>
        <div style={{ 
          background:'rgba(248,113,113,0.08)', 
          border:'1px solid rgba(248,113,113,0.25)', 
          borderRadius:12, 
          padding:20, 
          color:'var(--red)',
          textAlign:'center'
        }}>
          ❌ Error: {error}
          <button 
            onClick={loadTransactions} 
            style={{ marginLeft: 10, padding: '5px 10px' }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in">
      <p style={{ fontFamily:'var(--font-mono)', fontSize:10, color:'var(--gold)', letterSpacing:3, marginBottom:4 }}>FULL RECORD</p>
      <h1 style={{ fontFamily:'var(--font-serif)', fontSize:36, fontWeight:400, marginBottom:28 }}>Transaction History</h1>

      {transactions.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: 40, 
          background: 'var(--surface)', 
          borderRadius: 12,
          border: '1px solid var(--border)'
        }}>
          <p style={{ color:'var(--muted)', marginBottom: 8 }}>📭 No transactions found</p>
          <p style={{ color:'var(--muted2)', fontSize: 12 }}>Your transactions will appear here once you make transfers or receive funds.</p>
        </div>
      ) : (
        <>
          <div style={{ display:'flex', flexDirection:'column', gap:6, marginBottom:24 }}>
            {transactions.map(tx => (
              <div key={tx._id} style={{
                background:'var(--surface)', border:'1px solid var(--border)',
                borderRadius:12, padding:'14px 18px',
                display:'flex', justifyContent:'space-between', alignItems:'center',
              }}>
                <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                  <div style={{ width:3, height:40, borderRadius:2, background: TYPE_COLOR[tx.type] || 'var(--muted)', flexShrink:0 }} />
                  <div>
                    <p style={{ fontSize:13, fontWeight:500 }}>{tx.description || tx.type || 'Transaction'}</p>
                    <p style={{ fontSize:10, color:'var(--muted)', fontFamily:'var(--font-mono)', marginTop:3 }}>
                      {fmtDate(tx.createdAt)} · {(tx.type || tx.transactionType || 'unknown').toUpperCase()}
                    </p>
                  </div>
                </div>
                <div style={{ textAlign:'right' }}>
                  <p style={{ fontSize:14, fontWeight:600, color: ['deposit','admin_fund'].includes(tx.type) ? 'var(--green)' : 'var(--text)' }}>
                    {['deposit','admin_fund'].includes(tx.type) ? '+' : '-'}{fmt(tx.amount, tx.currency)}
                  </p>
                  <span className="badge" style={{ background:'var(--raised)', color:'var(--muted)', fontSize:9, marginTop:4 }}>
                    {tx.status || 'completed'}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          {pages > 1 && (
            <div style={{ display:'flex', gap:8, justifyContent:'center' }}>
              <button 
                className="btn-outline" 
                onClick={() => setPage(p => Math.max(1, p-1))} 
                disabled={page === 1}
              >
                ← Prev
              </button>
              <span style={{ padding:'8px 14px', fontSize:11, color:'var(--muted)', fontFamily:'var(--font-mono)' }}>
                Page {page} of {pages}
              </span>
              <button 
                className="btn-outline" 
                onClick={() => setPage(p => Math.min(pages, p+1))} 
                disabled={page === pages}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
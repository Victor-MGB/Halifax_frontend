import { useState, useEffect } from 'react';

export default function AdminMonitoring() {
  const [healthData, setHealthData] = useState(null);
  const [detailedHealth, setDetailedHealth] = useState(null);
  const [services, setServices] = useState(null);
  const [stats, setStats] = useState(null);
  const [database, setDatabase] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const API_URL = process.env.REACT_APP_API_URL || 'https://halifax-backend.onrender.com';

  const fetchAllHealthData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching all health data...');
      
      // Fetch all endpoints in parallel
      const [healthRes, detailedRes, servicesRes, statsRes, dbRes] = await Promise.all([
        fetch(`${API_URL}/api/health`),
        fetch(`${API_URL}/api/health/detailed`),
        fetch(`${API_URL}/api/health/services`),
        fetch(`${API_URL}/api/health/stats`),
        fetch(`${API_URL}/api/health/database`)
      ]);
      
      const healthJson = await healthRes.json();
      const detailedJson = await detailedRes.json();
      const servicesJson = await servicesRes.json();
      const statsJson = await statsRes.json();
      const dbJson = await dbRes.json();
      
      setHealthData(healthJson);
      setDetailedHealth(detailedJson);
      setServices(servicesJson);
      setStats(statsJson);
      setDatabase(dbJson);
      setLastUpdated(new Date());
      
      console.log('All data fetched successfully');
    } catch (err) {
      console.error('Error fetching health data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllHealthData();
    const interval = setInterval(fetchAllHealthData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', background: 'var(--void)', minHeight: '100vh', color: 'var(--text)' }}>
        <div style={{ 
          width: 40, height: 40, border: '2px solid #333', 
          borderTopColor: 'var(--primary)', borderRadius: '50%', 
          margin: '0 auto 16px', animation: 'spin 1s linear infinite' 
        }} />
        <p>Loading system metrics...</p>
        <p style={{ fontSize: 12, color: '#666' }}>Fetching from {API_URL}</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', background: 'var(--void)', minHeight: '100vh', color: 'var(--text)' }}>
        <div className="icon-tile" style={{ width: 56, height: 56, borderRadius: 16, background: 'var(--red-light)', color: 'var(--red)', margin: '0 auto 16px' }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 9v4m0 4h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" /></svg>
        </div>
        <h3 style={{ color: 'var(--red)' }}>Failed to load monitoring data</h3>
        <p style={{ color: '#888' }}>{error}</p>
        <button 
          onClick={fetchAllHealthData}
          style={{ marginTop: 16, padding: '8px 16px', background: 'var(--primary)', border: 'none', borderRadius: 8, cursor: 'pointer', color: '#fff' }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', background: 'var(--void)', minHeight: '100vh', color: 'var(--text)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '400', marginBottom: '4px', fontFamily: 'var(--font-serif)' }}>
            System Health Dashboard
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '12px' }}>Real-time monitoring & analytics</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: 'var(--muted)' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--green)', animation: 'pulse 2s infinite' }} />
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
          <button 
            onClick={fetchAllHealthData}
            style={{ padding: '6px 12px', borderRadius: '8px', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--primary)', fontSize: '11px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 600 }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-2.6-6.4M21 3v6h-6" /></svg>
            Refresh
          </button>
        </div>
      </div>

      {/* Status Cards Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
        gap: '16px', 
        marginBottom: '32px' 
      }}>
        {/* API Status */}
        <div style={{ 
          padding: '20px', 
          background: 'var(--surface)', 
          borderRadius: '12px', 
          border: `1px solid ${healthData?.status === 'OK' ? 'var(--green)' : 'var(--red)'}`,
          borderLeft: `4px solid ${healthData?.status === 'OK' ? 'var(--green)' : 'var(--red)'}`
        }}>
          <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '8px' }}>API Status</div>
          <div style={{ fontSize: '32px', fontWeight: '600', color: healthData?.status === 'OK' ? 'var(--green)' : 'var(--red)' }}>
            {healthData?.status || 'Unknown'}
          </div>
        </div>

        {/* System Health */}
        <div style={{ 
          padding: '20px', 
          background: 'var(--surface)', 
          borderRadius: '12px', 
          border: `1px solid ${detailedHealth?.status === 'healthy' ? 'var(--green)' : 'var(--red)'}`,
          borderLeft: `4px solid ${detailedHealth?.status === 'healthy' ? 'var(--green)' : 'var(--red)'}`
        }}>
          <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '8px' }}>System Health</div>
          <div style={{ fontSize: '32px', fontWeight: '600', color: detailedHealth?.status === 'healthy' ? 'var(--green)' : 'var(--red)' }}>
            {detailedHealth?.status || 'Unknown'}
          </div>
        </div>

        {/* Services Status */}
        <div style={{ 
          padding: '20px', 
          background: 'var(--surface)', 
          borderRadius: '12px', 
          border: `1px solid ${services?.status === 'operational' ? 'var(--green)' : 'var(--amber)'}`,
          borderLeft: `4px solid ${services?.status === 'operational' ? 'var(--green)' : 'var(--amber)'}`
        }}>
          <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '8px' }}>Services</div>
          <div style={{ fontSize: '32px', fontWeight: '600', color: services?.status === 'operational' ? 'var(--green)' : 'var(--amber)' }}>
            {services?.status || 'Unknown'}
          </div>
        </div>

        {/* Database Status */}
        <div style={{ 
          padding: '20px', 
          background: 'var(--surface)', 
          borderRadius: '12px', 
          border: `1px solid ${database?.status === 'connected' ? 'var(--green)' : 'var(--red)'}`,
          borderLeft: `4px solid ${database?.status === 'connected' ? 'var(--green)' : 'var(--red)'}`
        }}>
          <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '8px' }}>Database</div>
          <div style={{ fontSize: '32px', fontWeight: '600', color: database?.status === 'connected' ? 'var(--green)' : 'var(--red)' }}>
            {database?.status || 'Unknown'}
          </div>
        </div>
      </div>

      {/* Server Metrics Section */}
      {detailedHealth && detailedHealth.server && (
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '18px', marginBottom: '16px', color: 'var(--primary)', borderLeft: '3px solid var(--primary)', paddingLeft: '12px' }}>
            Server Metrics
          </h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '16px' 
          }}>
            <div style={{ padding: '16px', background: 'var(--surface)', borderRadius: '10px', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '8px' }}>Uptime</div>
              <div style={{ fontSize: '20px', fontWeight: '600', color: 'var(--primary)' }}>
                {detailedHealth.server?.uptime?.formatted || 'N/A'}
              </div>
            </div>
            <div style={{ padding: '16px', background: 'var(--surface)', borderRadius: '10px', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '8px' }}>Heap Memory</div>
              <div style={{ fontSize: '20px', fontWeight: '600', color: 'var(--primary)' }}>
                {detailedHealth.server?.memory?.heap_used_mb || 0} MB
              </div>
              <div style={{ fontSize: '10px', color: 'var(--muted)' }}>/ {detailedHealth.server?.memory?.heap_total_mb || 0} MB</div>
            </div>
            <div style={{ padding: '16px', background: 'var(--surface)', borderRadius: '10px', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '8px' }}>RSS Memory</div>
              <div style={{ fontSize: '20px', fontWeight: '600', color: 'var(--primary)' }}>
                {detailedHealth.server?.memory?.rss_mb || 0} MB
              </div>
            </div>
            <div style={{ padding: '16px', background: 'var(--surface)', borderRadius: '10px', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '8px' }}>Database Latency</div>
              <div style={{ fontSize: '20px', fontWeight: '600', color: 'var(--primary)' }}>
                {detailedHealth.database?.latency_ms || 0} ms
              </div>
            </div>
            <div style={{ padding: '16px', background: 'var(--surface)', borderRadius: '10px', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '8px' }}>Node Version</div>
              <div style={{ fontSize: '16px', fontWeight: '500' }}>{detailedHealth.server?.node_version || 'N/A'}</div>
            </div>
            <div style={{ padding: '16px', background: 'var(--surface)', borderRadius: '10px', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '8px' }}>Environment</div>
              <div style={{ fontSize: '16px', fontWeight: '500' }}>{detailedHealth.environment || 'N/A'}</div>
            </div>
          </div>
        </div>
      )}

      {/* Services Health Section */}
      {services && services.services && (
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '18px', marginBottom: '16px', color: 'var(--primary)', borderLeft: '3px solid var(--primary)', paddingLeft: '12px' }}>
            Service Health
          </h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '16px' 
          }}>
            {Object.entries(services.services).map(([name, data]) => (
              <div key={name} style={{ 
                padding: '16px', 
                background: 'var(--surface)', 
                borderRadius: '10px', 
                border: '1px solid var(--border)',
                borderLeft: `3px solid ${data.status === 'operational' ? 'var(--green)' : data.status === 'degraded' ? 'var(--amber)' : 'var(--red)'}`
              }}>
                <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '8px' }}>
                  {name.toUpperCase()}
                </div>
                <div style={{ 
                  fontSize: '18px', 
                  fontWeight: '600', 
                  color: data.status === 'operational' ? 'var(--green)' : data.status === 'degraded' ? 'var(--amber)' : 'var(--red)'
                }}>
                  {data.status}
                </div>
                {data.latency_ms && <div style={{ fontSize: '10px', color: 'var(--muted)', marginTop: '4px' }}>Latency: {data.latency_ms}ms</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Platform Statistics Section */}
      {stats && stats.statistics && (
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '18px', marginBottom: '16px', color: 'var(--primary)', borderLeft: '3px solid var(--primary)', paddingLeft: '12px' }}>
            Platform Statistics
          </h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', 
            gap: '16px' 
          }}>
            <div style={{ padding: '16px', background: 'var(--surface)', borderRadius: '10px', border: '1px solid var(--border)', textAlign: 'center' }}>
              <div className='icon-tile' style={{ background: 'var(--primary-light)', color: 'var(--primary)', margin: '0 auto 10px' }}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-8 0v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm9 10v-2a4 4 0 0 0-3-3.87M3 19v-2a4 4 0 0 1 3-3.87" /></svg></div>
              <div style={{ fontSize: '24px', fontWeight: '600', color: 'var(--primary)' }}>{stats.statistics?.total_users || 0}</div>
              <div style={{ fontSize: '10px', color: 'var(--muted)' }}>Total Users</div>
            </div>
            <div style={{ padding: '16px', background: 'var(--surface)', borderRadius: '10px', border: '1px solid var(--border)', textAlign: 'center' }}>
              <div className='icon-tile' style={{ background: 'var(--green-light)', color: 'var(--green-dark)', margin: '0 auto 10px' }}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" /></svg></div>
              <div style={{ fontSize: '24px', fontWeight: '600', color: 'var(--primary)' }}>{stats.statistics?.total_accounts || 0}</div>
              <div style={{ fontSize: '10px', color: 'var(--muted)' }}>Total Accounts</div>
            </div>
            <div style={{ padding: '16px', background: 'var(--surface)', borderRadius: '10px', border: '1px solid var(--border)', textAlign: 'center' }}>
              <div className='icon-tile' style={{ background: 'var(--purple-light)', color: 'var(--purple)', margin: '0 auto 10px' }}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18M8 17V9m5 8V5m5 12v-6" /></svg></div>
              <div style={{ fontSize: '24px', fontWeight: '600', color: 'var(--primary)' }}>{stats.statistics?.total_transactions || 0}</div>
              <div style={{ fontSize: '10px', color: 'var(--muted)' }}>Transactions</div>
            </div>
            <div style={{ padding: '16px', background: 'var(--surface)', borderRadius: '10px', border: '1px solid var(--border)', textAlign: 'center' }}>
              <div className='icon-tile' style={{ background: 'var(--amber-light)', color: 'var(--amber-dark)', margin: '0 auto 10px' }}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-2.6-6.4M21 3v6h-6" /></svg></div>
              <div style={{ fontSize: '24px', fontWeight: '600', color: 'var(--primary)' }}>{stats.statistics?.active_withdrawals || 0}</div>
              <div style={{ fontSize: '10px', color: 'var(--muted)' }}>Active Withdrawals</div>
            </div>
            <div style={{ padding: '16px', background: 'var(--surface)', borderRadius: '10px', border: '1px solid var(--border)', textAlign: 'center' }}>
              <div className='icon-tile' style={{ background: 'var(--red-light)', color: 'var(--red)', margin: '0 auto 10px' }}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M15 17h5l-1.4-1.6A5 5 0 0 1 17 12V9a5 5 0 0 0-10 0v3c0 1.2-.4 2.3-1.6 3.4L4 17h5m6 0a3 3 0 0 1-6 0" /></svg></div>
              <div style={{ fontSize: '24px', fontWeight: '600', color: 'var(--primary)' }}>{stats.statistics?.total_notifications || 0}</div>
              <div style={{ fontSize: '10px', color: 'var(--muted)' }}>Notifications</div>
            </div>
            <div style={{ padding: '16px', background: 'var(--surface)', borderRadius: '10px', border: '1px solid var(--border)', textAlign: 'center' }}>
              <div className='icon-tile' style={{ background: 'var(--primary-light)', color: 'var(--primary)', margin: '0 auto 10px' }}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z" /></svg></div>
              <div style={{ fontSize: '24px', fontWeight: '600', color: 'var(--primary)' }}>{stats.rates?.transaction_rate_per_second || 0}/s</div>
              <div style={{ fontSize: '10px', color: 'var(--muted)' }}>Tx Rate</div>
            </div>
          </div>
        </div>
      )}

      {/* Database Collections Section */}
      {database && database.collections && Object.keys(database.collections).length > 0 && (
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '18px', marginBottom: '16px', color: 'var(--primary)', borderLeft: '3px solid var(--primary)', paddingLeft: '12px' }}>
            Database Collections
          </h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', 
            gap: '12px' 
          }}>
            {Object.entries(database.collections).map(([name, count]) => (
              <div key={name} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '12px 16px', 
                background: 'var(--surface)', 
                borderRadius: '8px', 
                border: '1px solid var(--border)'
              }}>
                <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--muted)' }}>{name}</span>
                <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--primary)' }}>{count.toLocaleString()} docs</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Debug Info - Collapsible */}
      <details style={{ marginTop: '32px' }}>
        <summary style={{ cursor: 'pointer', color: 'var(--muted)', fontSize: '12px', padding: '8px' }}>
          Debug Information (click to expand)
        </summary>
        <div style={{ 
          marginTop: '16px', 
          padding: '16px', 
          background: 'var(--surface)', 
          borderRadius: '8px', 
          border: '1px solid var(--border)',
          fontSize: '11px',
          overflow: 'auto'
        }}>
          <p><strong>API URL:</strong> {API_URL}</p>
          <p><strong>Health Data:</strong> {healthData ? '✓' : '✗'}</p>
          <p><strong>Detailed Health:</strong> {detailedHealth ? '✓' : '✗'}</p>
          <p><strong>Services:</strong> {services ? '✓' : '✗'}</p>
          <p><strong>Stats:</strong> {stats ? '✓' : '✗'}</p>
          <p><strong>Database:</strong> {database ? '✓' : '✗'}</p>
          <p><strong>Last Updated:</strong> {lastUpdated.toISOString()}</p>
        </div>
      </details>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
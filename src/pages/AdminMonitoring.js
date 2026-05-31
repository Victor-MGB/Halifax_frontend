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
      <div style={{ padding: '40px', textAlign: 'center', background: '#050709', minHeight: '100vh', color: 'white' }}>
        <div style={{ 
          width: 40, height: 40, border: '2px solid #333', 
          borderTopColor: '#C9A84C', borderRadius: '50%', 
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
      <div style={{ padding: '40px', textAlign: 'center', background: '#050709', minHeight: '100vh', color: 'white' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
        <h3 style={{ color: '#F87171' }}>Failed to load monitoring data</h3>
        <p style={{ color: '#888' }}>{error}</p>
        <button 
          onClick={fetchAllHealthData}
          style={{ marginTop: 16, padding: '8px 16px', background: '#C9A84C', border: 'none', borderRadius: 8, cursor: 'pointer', color: '#050709' }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', background: '#050709', minHeight: '100vh', color: '#E8EDF2' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '400', marginBottom: '4px', fontFamily: 'var(--font-serif)' }}>
            System Health Dashboard
          </h1>
          <p style={{ color: '#6B809E', fontSize: '12px' }}>Real-time monitoring & analytics</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: '#6B809E' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4ADE80', animation: 'pulse 2s infinite' }} />
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
          <button 
            onClick={fetchAllHealthData}
            style={{ padding: '6px 12px', borderRadius: '8px', background: '#0A0F12', border: '1px solid #1A1F24', color: '#C9A84C', fontSize: '11px', cursor: 'pointer' }}
          >
            🔄 Refresh
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
          background: '#0A0F12', 
          borderRadius: '12px', 
          border: `1px solid ${healthData?.status === 'OK' ? '#4ADE80' : '#F87171'}`,
          borderLeft: `4px solid ${healthData?.status === 'OK' ? '#4ADE80' : '#F87171'}`
        }}>
          <div style={{ fontSize: '12px', color: '#6B809E', marginBottom: '8px' }}>🌐 API Status</div>
          <div style={{ fontSize: '32px', fontWeight: '600', color: healthData?.status === 'OK' ? '#4ADE80' : '#F87171' }}>
            {healthData?.status || 'Unknown'}
          </div>
        </div>

        {/* System Health */}
        <div style={{ 
          padding: '20px', 
          background: '#0A0F12', 
          borderRadius: '12px', 
          border: `1px solid ${detailedHealth?.status === 'healthy' ? '#4ADE80' : '#F87171'}`,
          borderLeft: `4px solid ${detailedHealth?.status === 'healthy' ? '#4ADE80' : '#F87171'}`
        }}>
          <div style={{ fontSize: '12px', color: '#6B809E', marginBottom: '8px' }}>💚 System Health</div>
          <div style={{ fontSize: '32px', fontWeight: '600', color: detailedHealth?.status === 'healthy' ? '#4ADE80' : '#F87171' }}>
            {detailedHealth?.status || 'Unknown'}
          </div>
        </div>

        {/* Services Status */}
        <div style={{ 
          padding: '20px', 
          background: '#0A0F12', 
          borderRadius: '12px', 
          border: `1px solid ${services?.status === 'operational' ? '#4ADE80' : '#FBBF24'}`,
          borderLeft: `4px solid ${services?.status === 'operational' ? '#4ADE80' : '#FBBF24'}`
        }}>
          <div style={{ fontSize: '12px', color: '#6B809E', marginBottom: '8px' }}>🔧 Services</div>
          <div style={{ fontSize: '32px', fontWeight: '600', color: services?.status === 'operational' ? '#4ADE80' : '#FBBF24' }}>
            {services?.status || 'Unknown'}
          </div>
        </div>

        {/* Database Status */}
        <div style={{ 
          padding: '20px', 
          background: '#0A0F12', 
          borderRadius: '12px', 
          border: `1px solid ${database?.status === 'connected' ? '#4ADE80' : '#F87171'}`,
          borderLeft: `4px solid ${database?.status === 'connected' ? '#4ADE80' : '#F87171'}`
        }}>
          <div style={{ fontSize: '12px', color: '#6B809E', marginBottom: '8px' }}>🗄️ Database</div>
          <div style={{ fontSize: '32px', fontWeight: '600', color: database?.status === 'connected' ? '#4ADE80' : '#F87171' }}>
            {database?.status || 'Unknown'}
          </div>
        </div>
      </div>

      {/* Server Metrics Section */}
      {detailedHealth && detailedHealth.server && (
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '18px', marginBottom: '16px', color: '#C9A84C', borderLeft: '3px solid #C9A84C', paddingLeft: '12px' }}>
            🖥️ Server Metrics
          </h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '16px' 
          }}>
            <div style={{ padding: '16px', background: '#0A0F12', borderRadius: '10px', border: '1px solid #1A1F24' }}>
              <div style={{ fontSize: '11px', color: '#6B809E', marginBottom: '8px' }}>⏱️ Uptime</div>
              <div style={{ fontSize: '20px', fontWeight: '600', color: '#C9A84C' }}>
                {detailedHealth.server?.uptime?.formatted || 'N/A'}
              </div>
            </div>
            <div style={{ padding: '16px', background: '#0A0F12', borderRadius: '10px', border: '1px solid #1A1F24' }}>
              <div style={{ fontSize: '11px', color: '#6B809E', marginBottom: '8px' }}>💾 Heap Memory</div>
              <div style={{ fontSize: '20px', fontWeight: '600', color: '#C9A84C' }}>
                {detailedHealth.server?.memory?.heap_used_mb || 0} MB
              </div>
              <div style={{ fontSize: '10px', color: '#6B809E' }}>/ {detailedHealth.server?.memory?.heap_total_mb || 0} MB</div>
            </div>
            <div style={{ padding: '16px', background: '#0A0F12', borderRadius: '10px', border: '1px solid #1A1F24' }}>
              <div style={{ fontSize: '11px', color: '#6B809E', marginBottom: '8px' }}>📊 RSS Memory</div>
              <div style={{ fontSize: '20px', fontWeight: '600', color: '#C9A84C' }}>
                {detailedHealth.server?.memory?.rss_mb || 0} MB
              </div>
            </div>
            <div style={{ padding: '16px', background: '#0A0F12', borderRadius: '10px', border: '1px solid #1A1F24' }}>
              <div style={{ fontSize: '11px', color: '#6B809E', marginBottom: '8px' }}>⚡ Database Latency</div>
              <div style={{ fontSize: '20px', fontWeight: '600', color: '#C9A84C' }}>
                {detailedHealth.database?.latency_ms || 0} ms
              </div>
            </div>
            <div style={{ padding: '16px', background: '#0A0F12', borderRadius: '10px', border: '1px solid #1A1F24' }}>
              <div style={{ fontSize: '11px', color: '#6B809E', marginBottom: '8px' }}>🟢 Node Version</div>
              <div style={{ fontSize: '16px', fontWeight: '500' }}>{detailedHealth.server?.node_version || 'N/A'}</div>
            </div>
            <div style={{ padding: '16px', background: '#0A0F12', borderRadius: '10px', border: '1px solid #1A1F24' }}>
              <div style={{ fontSize: '11px', color: '#6B809E', marginBottom: '8px' }}>🌍 Environment</div>
              <div style={{ fontSize: '16px', fontWeight: '500' }}>{detailedHealth.environment || 'N/A'}</div>
            </div>
          </div>
        </div>
      )}

      {/* Services Health Section */}
      {services && services.services && (
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '18px', marginBottom: '16px', color: '#C9A84C', borderLeft: '3px solid #C9A84C', paddingLeft: '12px' }}>
            🔐 Service Health
          </h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '16px' 
          }}>
            {Object.entries(services.services).map(([name, data]) => (
              <div key={name} style={{ 
                padding: '16px', 
                background: '#0A0F12', 
                borderRadius: '10px', 
                border: '1px solid #1A1F24',
                borderLeft: `3px solid ${data.status === 'operational' ? '#4ADE80' : data.status === 'degraded' ? '#FBBF24' : '#F87171'}`
              }}>
                <div style={{ fontSize: '12px', color: '#6B809E', marginBottom: '8px' }}>
                  {name === 'database' && '🗄️'}
                  {name === 'jwt' && '🔐'}
                  {name === 'bcrypt' && '🔒'} {name.toUpperCase()}
                </div>
                <div style={{ 
                  fontSize: '18px', 
                  fontWeight: '600', 
                  color: data.status === 'operational' ? '#4ADE80' : data.status === 'degraded' ? '#FBBF24' : '#F87171'
                }}>
                  {data.status}
                </div>
                {data.latency_ms && <div style={{ fontSize: '10px', color: '#6B809E', marginTop: '4px' }}>Latency: {data.latency_ms}ms</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Platform Statistics Section */}
      {stats && stats.statistics && (
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '18px', marginBottom: '16px', color: '#C9A84C', borderLeft: '3px solid #C9A84C', paddingLeft: '12px' }}>
            📊 Platform Statistics
          </h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', 
            gap: '16px' 
          }}>
            <div style={{ padding: '16px', background: '#0A0F12', borderRadius: '10px', border: '1px solid #1A1F24', textAlign: 'center' }}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>👥</div>
              <div style={{ fontSize: '24px', fontWeight: '600', color: '#C9A84C' }}>{stats.statistics?.total_users || 0}</div>
              <div style={{ fontSize: '10px', color: '#6B809E' }}>Total Users</div>
            </div>
            <div style={{ padding: '16px', background: '#0A0F12', borderRadius: '10px', border: '1px solid #1A1F24', textAlign: 'center' }}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>💳</div>
              <div style={{ fontSize: '24px', fontWeight: '600', color: '#C9A84C' }}>{stats.statistics?.total_accounts || 0}</div>
              <div style={{ fontSize: '10px', color: '#6B809E' }}>Total Accounts</div>
            </div>
            <div style={{ padding: '16px', background: '#0A0F12', borderRadius: '10px', border: '1px solid #1A1F24', textAlign: 'center' }}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>📊</div>
              <div style={{ fontSize: '24px', fontWeight: '600', color: '#C9A84C' }}>{stats.statistics?.total_transactions || 0}</div>
              <div style={{ fontSize: '10px', color: '#6B809E' }}>Transactions</div>
            </div>
            <div style={{ padding: '16px', background: '#0A0F12', borderRadius: '10px', border: '1px solid #1A1F24', textAlign: 'center' }}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>🔄</div>
              <div style={{ fontSize: '24px', fontWeight: '600', color: '#C9A84C' }}>{stats.statistics?.active_withdrawals || 0}</div>
              <div style={{ fontSize: '10px', color: '#6B809E' }}>Active Withdrawals</div>
            </div>
            <div style={{ padding: '16px', background: '#0A0F12', borderRadius: '10px', border: '1px solid #1A1F24', textAlign: 'center' }}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>🔔</div>
              <div style={{ fontSize: '24px', fontWeight: '600', color: '#C9A84C' }}>{stats.statistics?.total_notifications || 0}</div>
              <div style={{ fontSize: '10px', color: '#6B809E' }}>Notifications</div>
            </div>
            <div style={{ padding: '16px', background: '#0A0F12', borderRadius: '10px', border: '1px solid #1A1F24', textAlign: 'center' }}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>⚡</div>
              <div style={{ fontSize: '24px', fontWeight: '600', color: '#C9A84C' }}>{stats.rates?.transaction_rate_per_second || 0}/s</div>
              <div style={{ fontSize: '10px', color: '#6B809E' }}>Tx Rate</div>
            </div>
          </div>
        </div>
      )}

      {/* Database Collections Section */}
      {database && database.collections && Object.keys(database.collections).length > 0 && (
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '18px', marginBottom: '16px', color: '#C9A84C', borderLeft: '3px solid #C9A84C', paddingLeft: '12px' }}>
            🗃️ Database Collections
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
                background: '#0A0F12', 
                borderRadius: '8px', 
                border: '1px solid #1A1F24'
              }}>
                <span style={{ fontSize: '12px', fontFamily: 'monospace', color: '#6B809E' }}>{name}</span>
                <span style={{ fontSize: '12px', fontWeight: '500', color: '#C9A84C' }}>{count.toLocaleString()} docs</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Debug Info - Collapsible */}
      <details style={{ marginTop: '32px' }}>
        <summary style={{ cursor: 'pointer', color: '#6B809E', fontSize: '12px', padding: '8px' }}>
          🔧 Debug Information (click to expand)
        </summary>
        <div style={{ 
          marginTop: '16px', 
          padding: '16px', 
          background: '#0A0F12', 
          borderRadius: '8px', 
          border: '1px solid #1A1F24',
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
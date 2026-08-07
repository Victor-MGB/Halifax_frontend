import { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const I = ({ d, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const NAV = [
  { path: '/dashboard',     label: 'Home',          icon: <I d="M3 10.5 12 3l9 7.5M5 9.5V21h14V9.5M9.5 21v-6h5v6" /> },
  { path: '/transfer',      label: 'Transfer',      icon: <I d="M7 4v13m0 0-3-3m3 3 3-3M17 20V7m0 0-3 3m3-3 3 3" /> },
  { path: '/withdraw',      label: 'Withdraw',      icon: <I d="M12 3v11m0 0 3.5-3.5M12 14 8.5 10.5M5 21h14" /> },
  { path: '/history',       label: 'History',       icon: <I d="M12 7v5l3 2m5.5-1.5a8.5 8.5 0 1 1-2.5-6M3 4v5h5" /> },
  { path: '/notifications', label: 'Alerts',        icon: <I d="M15 17h5l-1.4-1.6A5 5 0 0 1 17 12V9a5 5 0 0 0-10 0v3c0 1.2-.4 2.3-1.6 3.4L4 17h5m6 0a3 3 0 0 1-6 0" /> },
];

export default function Layout() {
  const { user, logout, isAdmin, unreadCount } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 900);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 900);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const signOut = () => { logout(); navigate('/login'); };
  const fullName = `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'Client';
  const initials = fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  const NAVY = 'linear-gradient(180deg, #16285F 0%, #1E3A8A 55%, #1E40AF 100%)';

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* ── Mobile top bar ── */}
      {isMobile && (
        <header style={{
          position: 'sticky', top: 0, zIndex: 200,
          background: NAVY, color: '#fff',
          padding: '10px 16px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          boxShadow: '0 4px 16px rgba(30,58,138,0.35)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 9,
              background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: 13,
            }}>HO</div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.2 }}>Halifax Offshore</p>
              <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.6)', letterSpacing: 1 }}>DIGITAL PRIVATE BANK</p>
            </div>
          </div>
          <button
            onClick={signOut}
            style={{
              background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.25)',
              color: '#fff', fontSize: 12, fontWeight: 600,
              padding: '7px 13px', borderRadius: 9, cursor: 'pointer', fontFamily: 'var(--font-sans)',
            }}
          >
            Sign out
          </button>
        </header>
      )}

      <div style={{ display: 'flex', minHeight: '100vh' }}>
        {/* ── Desktop sidebar ── */}
        {!isMobile && (
          <aside style={{
            position: 'fixed', top: 0, bottom: 0, left: 0, width: 252,
            background: NAVY, color: '#fff',
            display: 'flex', flexDirection: 'column', zIndex: 200,
            boxShadow: '8px 0 32px rgba(30,58,138,0.12)',
          }}>
            <div style={{ padding: '26px 22px 22px', borderBottom: '1px solid rgba(255,255,255,0.12)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 42, height: 42, borderRadius: 12, flexShrink: 0,
                  background: 'rgba(255,255,255,0.16)', border: '1px solid rgba(255,255,255,0.28)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: 16,
                }}>HO</div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: 15, lineHeight: 1.2 }}>Halifax Offshore</p>
                  <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.55)', letterSpacing: 1.2 }}>DIGITAL PRIVATE BANK</p>
                </div>
              </div>
            </div>

            <p style={{
              fontSize: 10, fontWeight: 600, letterSpacing: 1.8, textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.45)', padding: '20px 22px 8px',
            }}>Client menu</p>

            <nav style={{ flex: 1, padding: '0 14px', display: 'flex', flexDirection: 'column', gap: 4 }}>
              {NAV.map(item => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  style={({ isActive }) => ({
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '11px 14px', borderRadius: 12,
                    textDecoration: 'none', fontSize: 13.5, fontWeight: 500,
                    color: isActive ? '#fff' : 'rgba(255,255,255,0.62)',
                    background: isActive ? 'rgba(255,255,255,0.16)' : 'transparent',
                    border: isActive ? '1px solid rgba(255,255,255,0.22)' : '1px solid transparent',
                    transition: 'all 0.15s',
                  })}
                >
                  <span style={{ display: 'inline-flex', opacity: isActive ? 1 : 0.85 }}>{item.icon}</span>
                  <span>{item.label}</span>
                  {item.path === '/notifications' && unreadCount > 0 && (
                    <span style={{
                      marginLeft: 'auto', background: '#F59E0B', color: '#fff',
                      borderRadius: 999, padding: '1px 8px', fontSize: 11, fontWeight: 700,
                    }}>{unreadCount}</span>
                  )}
                </NavLink>
              ))}

              {isAdmin && (
                <>
                  <p style={{
                    fontSize: 10, fontWeight: 600, letterSpacing: 1.8, textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.45)', padding: '18px 8px 8px',
                  }}>Operations</p>
                  <NavLink
                    to="/admin"
                    style={({ isActive }) => ({
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '11px 14px', borderRadius: 12,
                      textDecoration: 'none', fontSize: 13.5, fontWeight: 500,
                      color: isActive ? '#fff' : 'rgba(255,255,255,0.62)',
                      background: isActive ? 'rgba(255,255,255,0.16)' : 'transparent',
                      border: isActive ? '1px solid rgba(255,255,255,0.22)' : '1px solid transparent',
                    })}
                  >
                    <I d="M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5l-8-3Zm-3 10 2 2 4-4" />
                    <span>Admin Console</span>
                  </NavLink>
                </>
              )}
            </nav>

            <div style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.12)' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14,
                background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 12, padding: '10px',
              }}>
                <div style={{
                  width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
                  background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 600, fontSize: 13,
                }}>{initials}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{fullName}</p>
                  <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)' }}>Private Client</p>
                </div>
              </div>
              <button
                onClick={signOut}
                style={{
                  width: '100%', padding: '9px', borderRadius: 10,
                  background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
                  color: '#fff', fontSize: 12.5, fontWeight: 600, cursor: 'pointer',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                Sign out
              </button>
            </div>
          </aside>
        )}

        {/* ── Main content ── */}
        <main style={{
          flex: 1,
          marginLeft: isMobile ? 0 : 252,
          padding: isMobile ? '16px 16px 96px' : '36px 48px 48px',
          maxWidth: isMobile ? '100%' : 1240,
          width: '100%',
        }}>
          <Outlet />
        </main>
      </div>

      {/* ── Mobile bottom navigation ── */}
      {isMobile && (
        <nav style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 200,
          background: 'rgba(255,255,255,0.96)', backdropFilter: 'blur(12px)',
          borderTop: '1px solid var(--border)',
          display: 'flex', justifyContent: 'space-around', alignItems: 'center',
          padding: '6px 8px calc(8px + env(safe-area-inset-bottom))',
          boxShadow: '0 -4px 20px rgba(17,24,39,0.06)',
        }}>
          {NAV.map(item => {
            const active = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
                  padding: '7px 10px', borderRadius: 10, textDecoration: 'none', minWidth: 56,
                  color: active ? 'var(--primary)' : 'var(--muted)',
                }}
              >
                <span style={{ position: 'relative', display: 'inline-flex' }}>
                  {item.icon}
                  {item.path === '/notifications' && unreadCount > 0 && (
                    <span style={{
                      position: 'absolute', top: -4, right: -7,
                      background: 'var(--red)', color: '#fff',
                      borderRadius: 999, padding: '0 5px', fontSize: 9, fontWeight: 600,
                    }}>{unreadCount}</span>
                  )}
                </span>
                <span style={{ fontSize: 10, fontWeight: active ? 600 : 500 }}>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      )}
    </div>
  );
}

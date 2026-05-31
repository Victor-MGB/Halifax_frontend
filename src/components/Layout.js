import { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV = [
  { path: '/dashboard',     label: 'Dashboard',      icon: '📊' },
  { path: '/transfer',      label: 'Transfer',       icon: '🔄' },
  { path: '/withdraw',      label: 'Withdraw',       icon: '💰' },
  { path: '/history',       label: 'History',        icon: '📜' },
  { path: '/notifications', label: 'Notifications',  icon: '🔔' },
];

export default function Layout() {
  const { user, logout, isAdmin, unreadCount } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close mobile menu when navigating
  useEffect(() => {
    if (isMobile) {
      setMobileMenuOpen(false);
    }
  }, [location?.pathname, isMobile]);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--void)' }}>
      {/* Mobile Header */}
      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 200,
        background: 'var(--deep)',
        borderBottom: '1px solid var(--border)',
        padding: '12px 20px',
        display: isMobile ? 'flex' : 'none',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, #C9A84C, #E8C97A)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, color: '#050709', fontSize: 16,
          }}>HO</div>
          <div>
            <p style={{ fontSize: 14, fontWeight: 600 }}>Halifax Offshore</p>
            <p style={{ fontSize: 9, color: 'var(--gold)', letterSpacing: 1 }}>PRIVATE BANK</p>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {unreadCount > 0 && (
            <div style={{
              background: 'rgba(201,168,76,0.1)',
              padding: '4px 10px',
              borderRadius: 20,
              fontSize: 11,
              color: 'var(--gold)',
            }}>
              🔔 {unreadCount}
            </div>
          )}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: 'none',
              border: 'none',
              fontSize: 24,
              cursor: 'pointer',
              color: 'var(--text)',
              padding: 8,
            }}
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', minHeight: '100vh' }}>
        {/* Sidebar */}
        <aside style={{
          position: isMobile ? 'fixed' : 'sticky',
          top: 0,
          left: 0,
          width: 260,
          height: '100vh',
          background: 'var(--deep)',
          borderRight: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          transform: isMobile ? `translateX(${mobileMenuOpen ? '0' : '-100%'})` : 'none',
          transition: 'transform 0.3s ease',
          zIndex: 199,
          overflowY: 'auto',
        }}>
          {/* Logo */}
          <div style={{ padding: '28px 24px 24px', borderBottom: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 42, height: 42, borderRadius: 12,
                background: 'linear-gradient(135deg, #C9A84C, #E8C97A)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, color: '#050709', fontSize: 20,
              }}>HO</div>
              <div>
                <p style={{ fontWeight: 600, fontSize: 18, letterSpacing: 2, color: 'var(--text)' }}>Halifax Offshore</p>
                <p style={{ fontSize: 9, color: 'var(--gold)', letterSpacing: 2 }}>PRIVATE BANK</p>
              </div>
            </div>
          </div>

          {/* User Info - Mobile Only */}
          {isMobile && (
            <div style={{ padding: '20px', borderBottom: '1px solid var(--border)', background: 'rgba(201,168,76,0.03)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--faint), var(--border2))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 18, fontWeight: 600, color: 'var(--gold)',
                  border: '1px solid var(--border2)',
                }}>{user?.firstName?.[0]}{user?.lastName?.[0]}</div>
                <div>
                  <p style={{ fontSize: 15, fontWeight: 600 }}>{user?.firstName} {user?.lastName}</p>
                  <p style={{ fontSize: 11, color: 'var(--gold)' }}>Premium Client</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav style={{ flex: 1, padding: '20px 16px' }}>
            {NAV.map(item => (
              <NavLink 
                key={item.path} 
                to={item.path} 
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  borderRadius: 12,
                  marginBottom: 6,
                  background: isActive ? 'rgba(201,168,76,0.12)' : 'transparent',
                  color: isActive ? 'var(--gold2)' : 'var(--muted)',
                  border: `1px solid ${isActive ? 'rgba(201,168,76,0.25)' : 'transparent'}`,
                  fontSize: 13,
                  fontWeight: isActive ? 500 : 400,
                  transition: 'all 0.2s',
                  textDecoration: 'none',
                  cursor: 'pointer',
                })}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 18 }}>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {item.label === 'Notifications' && unreadCount > 0 && (
                  <span style={{
                    background: 'linear-gradient(135deg, #C9A84C, #B8942C)',
                    color: '#050709',
                    borderRadius: 12,
                    padding: '2px 8px',
                    fontSize: 10,
                    fontWeight: 700,
                  }}>{unreadCount}</span>
                )}
              </NavLink>
            ))}

            {/* Admin Panel */}
            {isAdmin && (
              <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--border)' }}>
                <NavLink 
                  to="/admin" 
                  style={({ isActive }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '12px 16px',
                    borderRadius: 12,
                    background: isActive ? 'rgba(167,139,250,0.12)' : 'transparent',
                    color: isActive ? 'var(--purple)' : 'var(--muted)',
                    border: `1px solid ${isActive ? 'rgba(167,139,250,0.25)' : 'transparent'}`,
                    fontSize: 13,
                    transition: 'all 0.2s',
                    textDecoration: 'none',
                  })}
                >
                  <span style={{ fontSize: 18 }}>⚙️</span>
                  <span>Admin Panel</span>
                </NavLink>
              </div>
            )}
          </nav>

          {/* User Section - Desktop Only */}
          {!isMobile && (
            <div style={{ padding: '20px', borderTop: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--faint), var(--border2))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 16, fontWeight: 600, color: 'var(--gold)',
                  border: '1px solid var(--border2)',
                }}>{user?.firstName?.[0]}{user?.lastName?.[0]}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p style={{ fontSize: 10, color: 'var(--gold)', fontFamily: 'var(--font-mono)', marginTop: 2 }}>
                    Premium Client
                  </p>
                </div>
              </div>
              <button 
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: 10,
                  background: 'rgba(248,113,113,0.1)',
                  border: '1px solid rgba(248,113,113,0.2)',
                  color: 'var(--red)',
                  fontSize: 11,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onClick={() => { logout(); navigate('/login'); }}
              >
                Sign Out
              </button>
            </div>
          )}

          {/* Sign Out Button - Mobile Only */}
          {isMobile && (
            <div style={{ padding: '20px', borderTop: '1px solid var(--border)', marginTop: 'auto' }}>
              <button 
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: 10,
                  background: 'rgba(248,113,113,0.1)',
                  border: '1px solid rgba(248,113,113,0.2)',
                  color: 'var(--red)',
                  fontSize: 13,
                  cursor: 'pointer',
                }}
                onClick={() => { logout(); navigate('/login'); }}
              >
                Sign Out
              </button>
            </div>
          )}
        </aside>

        {/* Overlay for mobile */}
        {isMobile && mobileMenuOpen && (
          <div
            onClick={() => setMobileMenuOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 198,
              background: 'rgba(0,0,0,0.5)',
            }}
          />
        )}

        {/* Main Content */}
        <main style={{
          flex: 1,
          marginLeft: isMobile ? 0 : 260,
          padding: isMobile ? '20px' : '36px 40px',
          minHeight: '100vh',
          maxWidth: isMobile ? '100%' : 1200,
          width: '100%',
          transition: 'margin-left 0.3s ease',
        }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
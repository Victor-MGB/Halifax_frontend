import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { fmtDate, fmtTime } from '../utils/api';

const TYPE_STYLES = {
  success: { bg:'rgba(74,222,128,0.06)',   border:'rgba(74,222,128,0.15)',  icon:'✓', color:'var(--green)' },
  error:   { bg:'rgba(248,113,113,0.06)',  border:'rgba(248,113,113,0.15)', icon:'✕', color:'var(--red)' },
  warning: { bg:'rgba(251,191,36,0.06)',   border:'rgba(251,191,36,0.15)',  icon:'!', color:'var(--amber)' },
  funding: { bg:'rgba(201,168,76,0.06)',   border:'rgba(201,168,76,0.15)',  icon:'$', color:'var(--gold)' },
  stage:   { bg:'rgba(62,207,207,0.06)',   border:'rgba(62,207,207,0.15)',  icon:'⊙', color:'var(--teal)' },
  info:    { bg:'rgba(167,139,250,0.06)',  border:'rgba(167,139,250,0.15)', icon:'i', color:'var(--purple)' },
};

export default function NotificationsPage() {
  const { notifications, markAllRead, unreadCount, fetchNotifications } = useAuth();

  useEffect(() => {
    fetchNotifications();
    if (unreadCount > 0) setTimeout(markAllRead, 2000);
  }, []);

  return (
    <div className="animate-in">
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:28 }}>
        <div>
          <p style={{ fontFamily:'var(--font-mono)', fontSize:10, color:'var(--gold)', letterSpacing:3, marginBottom:4 }}>INBOX</p>
          <h1 style={{ fontFamily:'var(--font-serif)', fontSize:36, fontWeight:400 }}>Notifications</h1>
        </div>
        {unreadCount > 0 && (
          <button className="btn-outline" onClick={markAllRead} style={{ fontSize:10 }}>Mark All Read</button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div style={{ textAlign:'center', padding:'60px 0' }}>
          <div style={{ fontSize:48, opacity:0.15, marginBottom:16 }}>◎</div>
          <p style={{ color:'var(--muted)', fontFamily:'var(--font-serif)', fontSize:18 }}>All caught up</p>
          <p style={{ color:'var(--muted)', fontSize:12, marginTop:4 }}>No notifications yet.</p>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {notifications.map(n => {
            const st = TYPE_STYLES[n.type] || TYPE_STYLES.info;
            return (
              <div key={n._id} style={{
                background: n.read ? 'var(--surface)' : st.bg,
                border: `1px solid ${n.read ? 'var(--border)' : st.border}`,
                borderRadius:14, padding:'16px 20px',
                display:'flex', gap:14, alignItems:'flex-start',
                transition:'all 0.2s',
              }}>
                <div style={{
                  width:32, height:32, borderRadius:'50%', flexShrink:0,
                  background: n.read ? 'var(--raised)' : `${st.bg}`,
                  border: `1px solid ${n.read ? 'var(--border)' : st.border}`,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:13, color: n.read ? 'var(--muted)' : st.color,
                  fontWeight:700,
                }}>{st.icon}</div>
                <div style={{ flex:1 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                    <p style={{ fontSize:13, fontWeight: n.read ? 400 : 600, marginBottom:4 }}>{n.title}</p>
                    <div style={{ display:'flex', alignItems:'center', gap:8, flexShrink:0, marginLeft:12 }}>
                      {!n.read && <div style={{ width:6, height:6, borderRadius:'50%', background:'var(--gold)' }} />}
                      <p style={{ fontSize:10, color:'var(--muted)', fontFamily:'var(--font-mono)', whiteSpace:'nowrap' }}>{fmtDate(n.createdAt)}</p>
                    </div>
                  </div>
                  <p style={{ fontSize:12, color:'var(--muted)', lineHeight:1.6 }}>{n.message}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

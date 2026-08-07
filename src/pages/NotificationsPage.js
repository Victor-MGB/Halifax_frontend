import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { fmtDate, fmtTime } from '../utils/api';
import { PageHeader } from '../components/ui';

const TYPE_STYLES = {
  success: { bg: 'var(--green-light)',  icon: '✓', color: 'var(--green-dark)' },
  error:   { bg: 'var(--red-light)',    icon: '✕', color: 'var(--red-dark)' },
  warning: { bg: 'var(--amber-light)',  icon: '!', color: 'var(--amber-dark)' },
  funding: { bg: 'var(--primary-light)',icon: '$', color: 'var(--primary)' },
  stage:   { bg: 'var(--teal-light)',   icon: '⊙', color: 'var(--teal)' },
  info:    { bg: 'var(--purple-light)', icon: 'i', color: 'var(--purple)' },
};

export default function NotificationsPage() {
  const { notifications, markAllRead, unreadCount, fetchNotifications } = useAuth();

  useEffect(() => {
    fetchNotifications();
    if (unreadCount > 0) setTimeout(markAllRead, 2000);
  }, []);

  return (
    <div className="animate-in" style={{ maxWidth: 760 }}>
      <PageHeader
        eyebrow="Inbox"
        title="Notifications"
        subtitle="Updates about your account and activity."
        action={
          unreadCount > 0 ? (
            <button className="btn-outline" onClick={markAllRead}>Mark all read</button>
          ) : null
        }
      />

      {notifications.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: 60 }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            background: 'var(--primary-light)', color: 'var(--primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 26, margin: '0 auto 16px',
          }}>✓</div>
          <p style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>All caught up</p>
          <p style={{ fontSize: 13, color: 'var(--muted)' }}>No notifications yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {notifications.map(n => {
            const st = TYPE_STYLES[n.type] || TYPE_STYLES.info;
            return (
              <div
                key={n._id}
                className="card card-hover"
                style={{
                  padding: '16px 20px',
                  display: 'flex', gap: 14, alignItems: 'flex-start',
                  background: n.read ? '#fff' : 'var(--primary-faint)',
                  borderColor: n.read ? 'var(--border)' : 'var(--primary)',
                }}
              >
                <div style={{
                  width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
                  background: st.bg, color: st.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 700,
                }}>{st.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                    <p style={{ fontSize: 13.5, fontWeight: n.read ? 500 : 700 }}>{n.title}</p>
                    <p style={{ fontSize: 11, color: 'var(--muted)', whiteSpace: 'nowrap', flexShrink: 0 }}>
                      {fmtDate(n.createdAt)} · {fmtTime(n.createdAt)}
                    </p>
                  </div>
                  <p style={{ fontSize: 12.5, color: 'var(--muted)', lineHeight: 1.6, marginTop: 3 }}>{n.message}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

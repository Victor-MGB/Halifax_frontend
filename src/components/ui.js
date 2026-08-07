import { useEffect, useRef, useState } from 'react';

export function useCountUp(target, duration = 900) {
  const [value, setValue] = useState(0);
  const frame = useRef();

  useEffect(() => {
    const start = performance.now();
    const from = 0;
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(from + (target - from) * eased);
      if (p < 1) frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame.current);
  }, [target, duration]);

  return value;
}

export function Skeleton({ width = '100%', height = 16, style = {}, radius = 8 }) {
  return (
    <div
      className="skeleton"
      style={{ width, height, borderRadius: radius, ...style }}
      aria-hidden="true"
    />
  );
}

const STATUS_MAP = {
  completed: 'badge-success',
  approved: 'badge-success',
  success: 'badge-success',
  active: 'badge-info',
  pending: 'badge-warning',
  in_progress: 'badge-warning',
  in_review: 'badge-info',
  rejected: 'badge-danger',
  failed: 'badge-danger',
  frozen: 'badge-danger',
  open: 'badge-info',
};

export function StatusBadge({ status, label, className = '' }) {
  const cls = STATUS_MAP[status] || 'badge-muted';
  return (
    <span className={`badge ${cls} ${className}`}>
      {label || (status && status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' '))}
    </span>
  );
}

export function Avatar({ name = '', size = 40, color }) {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join('');
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: color || 'var(--primary)',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 600,
        fontSize: size * 0.36,
        flexShrink: 0,
      }}
    >
      {initials || '?'}
    </div>
  );
}

export function Checkmark() {
  return (
    <div className="checkmark-wrap">
      <svg viewBox="0 0 52 52">
        <circle className="checkmark-circle" cx="26" cy="26" r="25" />
        <path className="checkmark-path" d="M14 27l8 8 16-16" />
      </svg>
    </div>
  );
}

export function PageHeader({ eyebrow, title, subtitle, action }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 16, marginBottom: 28, flexWrap: 'wrap' }}>
      <div>
        {eyebrow && (
          <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1, color: 'var(--primary)', textTransform: 'uppercase', marginBottom: 6 }}>
            {eyebrow}
          </p>
        )}
        <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: -0.5, lineHeight: 1.2 }}>{title}</h1>
        {subtitle && <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 6 }}>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Landing.css';

const STAGES_PREVIEW = [
  { n: 1,  name: 'Identity Verification',         done: true },
  { n: 2,  name: 'Account Ownership Confirmation', done: true },
  { n: 3,  name: 'KYC Documentation Review',      done: true },
  { n: 4,  name: 'AML Compliance Screening',      active: true },
  { n: 5,  name: 'Source of Funds Verification',  done: false },
  { n: 6,  name: 'Transaction Risk Assessment',   done: false },
  { n: 7,  name: 'Fraud Detection Scan',          done: false },
];

const FEATURES = [
  { icon: '⊕', title: 'Multi-Currency Accounts',  desc: 'Hold and manage funds in USD, EUR, GBP, CHF, JPY and five more currencies from one dashboard.' },
  { icon: '⇄', title: 'Instant Internal Transfers', desc: 'Move funds between your accounts in real time with a full, transparent transaction history.' },
  { icon: '◈', title: '22-Stage Compliance',      desc: 'Every withdrawal passes through 22 institutional-grade verification stages with admin oversight.' },
  { icon: '◎', title: 'Real-Time Notifications',  desc: 'Get instantly notified on every account activity — funding, stage approvals and account changes.' },
  { icon: '❄', title: 'Account Protection',       desc: 'Admin-level freeze protection instantly blocks any account from unauthorized transactions.' },
  { icon: '▦', title: 'Admin Control Center',     desc: 'Full analytics, client management, multi-currency funding tools and compliance oversight.' },
];

const STEPS = [
  { n: '01', title: 'Open your account', desc: 'Register in minutes. Checking and savings accounts are created instantly.' },
  { n: '02', title: 'Admin funds you',   desc: 'Your account is credited in any of 10 currencies. You get notified instantly.' },
  { n: '03', title: 'Withdraw securely', desc: 'Progress through 22 compliance stages, each approved by the admin team.' },
];

const TESTIMONIALS = [
  { name: 'James Whitfield', role: 'Private Client, London',  text: 'The 22-stage withdrawal verification gave our board complete confidence. An unprecedented level of institutional compliance.' },
  { name: 'Sofia Reinholt',  role: 'CFO, Reinholt Capital',   text: 'Moving between currencies has never been this seamless. The admin funding tool is exactly what our treasury team needed.' },
  { name: 'Marcus Adesanya', role: 'Investment Director',     text: 'The real-time notification system and compliance dashboard are best-in-class. Truly private banking, digitised.' },
];

const STATS = [
  { value: '$2.4B+', label: 'Assets under management' },
  { value: '99.98%', label: 'Uptime guarantee' },
  { value: '22',     label: 'Compliance stages' },
  { value: '10+',    label: 'Supported currencies' },
];

const CURRENCIES = ['USD', 'EUR', 'GBP', 'CHF', 'JPY', 'CAD', 'AUD', 'SGD', 'AED', 'HKD'];

function useInView(ref) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.15 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return visible;
}

function AnimSection({ children, className = '', style = {} }) {
  const ref = useRef();
  const visible = useInView(ref);
  return (
    <div ref={ref} className={`anim-section ${visible ? 'anim-visible' : ''} ${className}`} style={style}>
      {children}
    </div>
  );
}

function CountUp({ target, duration = 2000, start }) {
  const [display, setDisplay] = useState('');
  useEffect(() => {
    if (!start) return;
    const str = String(target);
    const prefix = str.match(/^[^0-9]*/)?.[0] || '';
    const suffix = str.match(/[^0-9.]+$/)?.[0] || '';
    const numeric = parseFloat(str.replace(/[^0-9.]/g, ''));
    const isFloat = str.includes('.');
    let startTime = null;
    const step = ts => {
      if (!startTime) startTime = ts;
      const p = Math.min((ts - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      const cur = ease * numeric;
      setDisplay(prefix + (isFloat ? cur.toFixed(2) : Math.floor(cur).toLocaleString()) + suffix);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return <span>{display || (String(target).match(/^[^0-9]*/)?.[0] || '') + '0'}</span>;
}

export default function Landing() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const statsRef = useRef();
  const statsVisible = useInView(statsRef);

  const featuresRef = useRef(null);
  const complianceRef = useRef(null);
  const securityRef = useRef(null);
  const aboutRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) setMobileMenuOpen(false);
    };
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', onScroll);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const scrollToSection = ref => {
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setMobileMenuOpen(false);
    }
  };

  return (
    <div className="land-root">

      {/* ── NAVBAR ── */}
      <nav className={`land-nav ${scrolled ? 'land-nav-scrolled' : ''}`}>
        <div className="land-nav-inner">
          <div className="land-logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="land-logo-mark">HO</div>
            <div>
              <p className="land-logo-name">Halifax Offshore</p>
              <p className="land-logo-sub">DIGITAL PRIVATE BANK</p>
            </div>
          </div>

          <div className="land-nav-links">
            <button className="land-nav-link" onClick={() => scrollToSection(featuresRef)}>Features</button>
            <button className="land-nav-link" onClick={() => scrollToSection(complianceRef)}>Compliance</button>
            <button className="land-nav-link" onClick={() => scrollToSection(securityRef)}>Security</button>
            <button className="land-nav-link" onClick={() => scrollToSection(aboutRef)}>About</button>
          </div>

          <div className="land-nav-actions">
            <button className="land-btn-ghost" onClick={() => navigate('/login')}>Sign In</button>
            <button className="land-btn-primary" onClick={() => navigate('/register')}>Register</button>
            <button className="land-hamburger" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Menu">
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        <div className={`land-mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
          <button className="land-mobile-nav-link" onClick={() => scrollToSection(featuresRef)}>Features</button>
          <button className="land-mobile-nav-link" onClick={() => scrollToSection(complianceRef)}>Compliance</button>
          <button className="land-mobile-nav-link" onClick={() => scrollToSection(securityRef)}>Security</button>
          <button className="land-mobile-nav-link" onClick={() => scrollToSection(aboutRef)}>About</button>
          <div className="land-mobile-divider" />
          <button className="land-mobile-btn-ghost" onClick={() => navigate('/login')}>Sign In</button>
          <button className="land-mobile-btn-primary" onClick={() => navigate('/register')}>Register</button>
        </div>
      </nav>

      {mobileMenuOpen && isMobile && <div className="land-mobile-overlay" onClick={() => setMobileMenuOpen(false)} />}

      {/* ── HERO ── */}
      <section className="land-hero">
        <div className="land-hero-content">
          <div className="land-hero-badge fade-up-1">
            <span className="land-badge-dot pulse" />
            <span>Institutional grade · Fully compliant</span>
          </div>

          <h1 className="land-hero-h1 fade-up-2">
            Banking,<br />
            <span className="land-accent">elevated.</span>
          </h1>

          <p className="land-hero-sub fade-up-3">
            A modern digital banking platform with multi-currency accounts,
            22-stage withdrawal compliance and institutional-grade security —
            designed for everyday use.
          </p>

          <div className="land-hero-btns fade-up-3">
            <button className="land-btn-primary land-btn-lg" onClick={() => navigate('/register')}>
              Open an account
            </button>
            <button className="land-btn-ghost land-btn-lg" onClick={() => navigate('/login')}>
              Sign in →
            </button>
          </div>

          <div className="land-hero-trust fade-up-4">
            {['256-bit encryption', '22-stage KYC/AML', '10 currencies', 'Real-time compliance'].map(f => (
              <div key={f} className="land-trust-item">
                <span className="land-trust-star">✓</span>{f}
              </div>
            ))}
          </div>
        </div>

        <div className="land-hero-visual fade-up-3">
          <div className="land-bank-card float-card">
            <div className="land-bank-card-top">
              <div>
                <p className="land-bank-card-name">Halifax Offshore</p>
                <p className="land-bank-card-tag">DIGITAL PRIVATE BANK</p>
              </div>
              <div className="land-chip" />
            </div>
            <p className="land-bank-card-number">•••• •••• •••• 4532</p>
            <div className="land-bank-card-bottom">
              <div className="land-card-holder">
                <p style={{ fontSize: 9, opacity: 0.7, letterSpacing: 1 }}>CARD HOLDER</p>
                <p className="land-card-holder-name">VICTOR MGB</p>
              </div>
              <span className="land-visa">VISA</span>
            </div>
          </div>

          <div className="land-float-badge float-card" style={{ animationDelay: '1s' }}>
            <div className="land-float-badge-icon">↗</div>
            <div>
              <p className="land-float-badge-label">Total balance</p>
              <p className="land-float-badge-value">$51,233.50 <span style={{ color: 'var(--green-dark)', fontSize: 12 }}>+4.8%</span></p>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <div ref={statsRef} className="land-stats">
        {STATS.map((s, i) => (
          <div key={s.label} className="land-stat-item" style={{ animationDelay: `${i * 0.1}s` }}>
            <p className="land-stat-value"><CountUp target={s.value} start={statsVisible} /></p>
            <p className="land-stat-label">{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── FEATURES ── */}
      <section ref={featuresRef} className="land-section">
        <AnimSection>
          <div className="land-section-header">
            <p className="land-eyebrow">Platform features</p>
            <h2 className="land-h2">Everything your private<br />banking needs</h2>
          </div>
        </AnimSection>
        <div className="land-features-grid">
          {FEATURES.map((f, i) => (
            <AnimSection key={f.title} style={{ animationDelay: `${i * 0.08}s` }}>
              <div className="land-feature-card">
                <div className="land-feature-icon">{f.icon}</div>
                <h3 className="land-feature-title">{f.title}</h3>
                <p className="land-feature-desc">{f.desc}</p>
              </div>
            </AnimSection>
          ))}
        </div>
      </section>

      {/* ── COMPLIANCE ── */}
      <section ref={complianceRef} className="land-compliance-section">
        <div className="land-compliance-inner">
          <AnimSection className="land-compliance-text">
            <p className="land-eyebrow">Withdrawal compliance</p>
            <h2 className="land-h2">22-stage<br />verification process</h2>
            <p className="land-body-text" style={{ marginTop: 18 }}>
              Every withdrawal passes through 22 institutional-grade compliance stages —
              each requiring explicit admin authorization. A level of oversight previously
              only available to major financial institutions.
            </p>
            <div className="land-check-list">
              {['Identity & KYC verification', 'AML & sanctions screening', 'Multi-jurisdiction clearance', 'Board-level authorization', 'Final release sign-off'].map(s => (
                <div key={s} className="land-check-item">
                  <span className="land-check-star">✓</span>
                  <span>{s}</span>
                </div>
              ))}
            </div>
            <button className="land-btn-primary" style={{ marginTop: 28 }} onClick={() => navigate('/register')}>
              Start verification
            </button>
          </AnimSection>

          <AnimSection className="land-stage-list">
            {STAGES_PREVIEW.map(s => (
              <div key={s.n} className={`land-stage-row ${s.done ? 'stage-done' : ''} ${s.active ? 'stage-active' : ''}`}>
                <div className="land-stage-num">{s.done ? '✓' : s.n}</div>
                <p className="land-stage-name">{s.name}</p>
                <span className="land-stage-badge-pill">{s.done ? 'Approved' : s.active ? 'Pending' : '—'}</span>
              </div>
            ))}
            <div className="land-stage-more">
              <div className="land-stage-num" style={{ opacity: 0.4 }}>+15</div>
              <p className="land-stage-name" style={{ color: 'var(--muted)' }}>15 more verification stages…</p>
            </div>
            <div className="land-stage-progress">
              <div className="land-stage-progress-bar" style={{ width: '18%' }} />
            </div>
            <p className="land-stage-badge-pill" style={{ margin: '8px 0 0', fontSize: 10.5, letterSpacing: 1 }}>STAGE 3 OF 22 COMPLETE</p>
          </AnimSection>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="land-section">
        <AnimSection>
          <div className="land-section-header">
            <p className="land-eyebrow">How it works</p>
            <h2 className="land-h2">Simple for clients.<br />Powerful for admins.</h2>
          </div>
        </AnimSection>
        <div className="land-steps-grid">
          {STEPS.map((s, i) => (
            <AnimSection key={s.n} style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="land-step-card">
                <div className="land-step-num">{s.n}</div>
                <h3 className="land-step-title">{s.title}</h3>
                <p className="land-step-desc">{s.desc}</p>
              </div>
            </AnimSection>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section ref={aboutRef} className="land-testimonials-section">
        <AnimSection>
          <div className="land-section-header">
            <p className="land-eyebrow">Client testimonials</p>
            <h2 className="land-h2">Trusted by private clients<br />worldwide</h2>
          </div>
        </AnimSection>
        <div className="land-testimonials-grid">
          {TESTIMONIALS.map((t, i) => (
            <AnimSection key={t.name} style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="land-testimonial-card">
                <div className="land-stars">{'★'.repeat(5)}</div>
                <p className="land-testimonial-text">"{t.text}"</p>
                <div className="land-testimonial-author">
                  <div className="land-author-avatar">{t.name.split(' ').map(n => n[0]).join('')}</div>
                  <div>
                    <p className="land-author-name">{t.name}</p>
                    <p className="land-author-role">{t.role}</p>
                  </div>
                </div>
              </div>
            </AnimSection>
          ))}
        </div>
      </section>

      {/* ── SECURITY ── */}
      <section ref={securityRef} className="land-section">
        <div className="land-security-inner">
          <AnimSection className="land-security-text">
            <p className="land-eyebrow">Enterprise security</p>
            <h2 className="land-h2">Security at<br />every layer</h2>
            <p className="land-body-text" style={{ marginTop: 18 }}>
              Built on institutional-grade infrastructure — every component
              designed to protect your clients' assets, data and identity.
            </p>
            <div className="land-security-grid">
              {['JWT authentication', 'bcrypt password hashing', 'MongoDB transactions', 'Role-based access', 'Account freeze lock', 'Full audit log'].map(s => (
                <div key={s} className="land-security-item">
                  <span className="land-check-green">✓</span>
                  <span>{s}</span>
                </div>
              ))}
            </div>
          </AnimSection>

          <AnimSection className="land-security-visual">
            <div className="land-sec-card float-card">
              <div className="land-sec-card-header">
                <div>
                  <p className="land-sec-card-label">ACTIVE SESSION</p>
                  <p className="land-sec-card-name">Alice Johnson</p>
                  <p className="land-sec-card-sub">Private Client · Verified ✓</p>
                </div>
                <div className="land-avatar">AJ</div>
              </div>
              <div className="land-sec-accounts">
                {[
                  { type: 'Checking', bal: '$12,483.50', num: '4821' },
                  { type: 'Savings',  bal: '$38,750.00', num: '9034' },
                ].map(a => (
                  <div key={a.type} className="land-sec-acc-row">
                    <div>
                      <p className="land-sec-acc-type">{a.type}</p>
                      <p className="land-sec-acc-meta">••••{a.num} · USD</p>
                    </div>
                    <p className="land-sec-acc-bal">{a.bal}</p>
                  </div>
                ))}
              </div>
              <div className="land-encrypted-badge">
                <span className="land-badge-dot pulse" />
                <span>256-BIT ENCRYPTED · SECURE</span>
              </div>
            </div>
          </AnimSection>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="land-cta-section">
        <AnimSection className="land-cta-content">
          <p className="land-eyebrow">Get started today</p>
          <h2 className="land-cta-h2">Ready to bank with confidence?</h2>
          <p className="land-cta-sub">
            Join Halifax Offshore and experience institutional-grade banking with
            multi-currency accounts and a world-class client experience.
          </p>
          <div className="land-cta-btns">
            <button className="land-btn-white" onClick={() => navigate('/register')}>Open an account</button>
            <button className="land-btn-ghost-light" onClick={() => navigate('/login')}>Sign in</button>
          </div>
          <p className="land-cta-footnote">NO SETUP FEES · FULLY DIGITAL · INSTANT ONBOARDING</p>
        </AnimSection>
      </section>

      {/* ── FOOTER ── */}
      <footer className="land-footer">
        <div className="land-footer-inner">
          <div className="land-footer-grid">
            <div className="land-footer-brand">
              <div className="land-logo" style={{ marginBottom: 14 }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                <div className="land-logo-mark" style={{ width: 34, height: 34, fontSize: 15 }}>HO</div>
                <p className="land-logo-name" style={{ fontSize: 15 }}>Halifax Offshore</p>
              </div>
              <p className="land-footer-desc">
                Private banking solutions with institutional-grade compliance, security and a seamless digital experience.
              </p>
            </div>
            {[
              { title: 'Platform',   items: ['Dashboard', 'Transfer', 'Withdraw', 'History', 'Notifications'] },
              { title: 'Compliance', items: ['22-Stage KYC', 'AML Screening', 'Sanctions Check', 'Audit Log', 'Risk Assessment'] },
              { title: 'Company',    items: ['About', 'Security', 'Privacy Policy', 'Terms of Service', 'Contact'] },
            ].map(col => (
              <div key={col.title}>
                <p className="land-footer-col-title">{col.title}</p>
                {col.items.map(item => (
                  <button
                    key={item}
                    className="land-footer-link"
                    onClick={() => {
                      if (item === 'About') scrollToSection(aboutRef);
                      else if (item === 'Security') scrollToSection(securityRef);
                      else if (item === 'Privacy Policy') navigate('/privacy-policy');
                      else if (item === 'Terms of Service') navigate('/terms-of-service');
                      else if (item === 'Contact') navigate('/contact');
                      else if (item === 'Dashboard' || item === 'Transfer' || item === 'Withdraw' || item === 'History' || item === 'Notifications') navigate('/login');
                      else navigate('/');
                    }}
                  >
                    {item}
                  </button>
                ))}
              </div>
            ))}
          </div>

          <div className="land-footer-bottom">
            <p className="land-footer-copy">© 2026 Halifax Offshore · All rights reserved</p>
            <div className="land-footer-currencies">
              {CURRENCIES.slice(0, 6).map(c => <span key={c} className="land-currency-pill">{c}</span>)}
              <span className="land-currency-pill">+4</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Landing.css';

const STAGES_PREVIEW = [
  { n:1,  name:'Identity Verification',        done:true  },
  { n:2,  name:'Account Ownership Confirmation',done:true  },
  { n:3,  name:'KYC Documentation Review',      done:true  },
  { n:4,  name:'AML Compliance Screening',      active:true},
  { n:5,  name:'Source of Funds Verification',  done:false },
  { n:6,  name:'Transaction Risk Assessment',   done:false },
  { n:7,  name:'Fraud Detection Scan',          done:false },
];

const FEATURES = [
  { icon:'⊕', title:'Multi-Currency Accounts',  desc:'Hold and manage funds in USD, EUR, GBP, CHF, JPY and 5 more currencies from one dashboard.' },
  { icon:'⇄', title:'Instant Internal Transfers',desc:'Move funds between your accounts in real time with full transaction history.' },
  { icon:'◈', title:'22-Stage Compliance',       desc:'Every withdrawal passes through 22 institutional-grade verification stages with admin oversight.' },
  { icon:'◎', title:'Real-Time Notifications',   desc:'Get instantly notified on every account activity — funding, stage approvals, and account changes.' },
  { icon:'❄', title:'Account Protection',        desc:'Admin-level freeze protection instantly blocks any account from unauthorized transactions.' },
  { icon:'▦', title:'Admin Control Center',      desc:'Full analytics, client management, multi-currency funding tools, and compliance oversight.' },
];

const STEPS = [
  { n:'01', title:'Open Your Account',    desc:'Register in minutes. Checking and savings accounts created instantly.' },
  { n:'02', title:'Admin Funds You',      desc:'Admin credits your account in any of 10 currencies. You get notified instantly.' },
  { n:'03', title:'Withdraw Securely',    desc:'Progress through 22 compliance stages, each approved by the admin team.' },
];

const TESTIMONIALS = [
  { name:'James Whitfield', role:'Private Client, London',  text:'The 22-stage withdrawal verification gave our board complete confidence. An unprecedented level of institutional compliance.' },
  { name:'Sofia Reinholt',  role:'CFO, Reinholt Capital',   text:'Moving between currencies has never been this seamless. The admin funding tool is exactly what our treasury team needed.' },
  { name:'Marcus Adesanya', role:'Investment Director',     text:'The real-time notification system and compliance dashboard are best-in-class. Truly private banking, digitised.' },
];

const STATS = [
  { value:'$2.4B+',  label:'Assets Under Management' },
  { value:'99.98%',  label:'Uptime Guarantee'        },
  { value:'22',      label:'Compliance Stages'       },
  { value:'10+',     label:'Supported Currencies'    },
];

const CURRENCIES = ['USD','EUR','GBP','CHF','JPY','CAD','AUD','SGD','AED','HKD'];

// Carousel images (replace with your actual image URLs)
const CAROUSEL_IMAGES = [
  {
    id: 1,
    url: 'https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?w=1200&h=600&fit=crop',
    title: 'Global Banking Solutions',
    subtitle: 'Access your funds anywhere in the world'
  },
  {
    id: 2,
    url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=600&fit=crop',
    title: 'Real-Time Analytics',
    subtitle: 'Monitor your portfolio with precision'
  },
  {
    id: 3,
    url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=600&fit=crop',
    title: 'Secure Transactions',
    subtitle: 'Bank with complete peace of mind'
  },
  {
    id: 4,
    url: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&h=600&fit=crop',
    title: '24/7 Client Support',
    subtitle: 'Dedicated relationship managers'
  }
];

// Partners/Brands section
const PARTNERS = [
  { name: 'VISA', logo: '💳' },
  { name: 'Mastercard', logo: '💎' },
  { name: 'Swift', logo: '🌐' },
  { name: 'Bloomberg', logo: '📊' },
  { name: 'Reuters', logo: '📰' },
  { name: 'Dow Jones', logo: '📈' },
];

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

// Image Carousel Component
function ImageCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % CAROUSEL_IMAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToPrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + CAROUSEL_IMAGES.length) % CAROUSEL_IMAGES.length);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % CAROUSEL_IMAGES.length);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  return (
    <div className="carousel-container">
      <div className="carousel-slide">
        <img 
          src={CAROUSEL_IMAGES[currentIndex].url} 
          alt={CAROUSEL_IMAGES[currentIndex].title}
          className="carousel-image"
        />
        <div className="carousel-overlay">
          <div className="carousel-content">
            <h3 className="carousel-title">{CAROUSEL_IMAGES[currentIndex].title}</h3>
            <p className="carousel-subtitle">{CAROUSEL_IMAGES[currentIndex].subtitle}</p>
          </div>
        </div>
      </div>
      
      <button className="carousel-btn carousel-btn-prev" onClick={goToPrevious}>
        ‹
      </button>
      <button className="carousel-btn carousel-btn-next" onClick={goToNext}>
        ›
      </button>
      
      <div className="carousel-dots">
        {CAROUSEL_IMAGES.map((_, idx) => (
          <button
            key={idx}
            className={`carousel-dot ${idx === currentIndex ? 'active' : ''}`}
            onClick={() => {
              setIsAutoPlaying(false);
              setCurrentIndex(idx);
              setTimeout(() => setIsAutoPlaying(true), 10000);
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function Landing() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const statsRef = useRef();
  const statsVisible = useInView(statsRef);
  
  const featuresRef = useRef(null);
  const complianceRef = useRef(null);
  const securityRef = useRef(null);
  const aboutRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToSection = (ref) => {
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="land-root">

      {/* ── NAVBAR ── */}
      <nav className={`land-nav ${scrolled ? 'land-nav-scrolled' : ''}`}>
        <div className="land-nav-inner">
          <div className="land-logo" style={{ cursor: 'pointer' }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="land-logo-mark">HO</div>
            <div>
              <p className="land-logo-name">Halifx Offshore</p>
              <p className="land-logo-sub">PRIVATE BANK</p>
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
            <button className="land-btn-gold" onClick={() => navigate('/register')}>Open Account</button>
          </div>
        </div>
      </nav>

      {/* ── CURRENCY TICKER ── */}
      <div className="land-ticker">
        <div className="land-ticker-track">
          {[...CURRENCIES, ...CURRENCIES, ...CURRENCIES].map((c, i) => (
            <span key={i} className="land-ticker-item">
              <span className="land-ticker-dot" />
              {c}
            </span>
          ))}
        </div>
      </div>

      {/* ── HERO ── */}
      <section className="land-hero">
        <div className="land-hero-bg">
          <div className="land-hero-glow land-hero-glow-1" />
          <div className="land-hero-glow land-hero-glow-2" />
          <div className="land-hero-glow land-hero-glow-3" />
          <svg className="land-hero-grid" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#C8A84A" strokeWidth="0.4" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="land-hero-content">
          <div className="land-hero-badge">
            <span className="land-badge-dot pulse" />
            <span>INSTITUTIONAL GRADE · FULLY COMPLIANT</span>
          </div>

          <h1 className="land-hero-h1 fade-up-1">
            Private Banking<br />
            <span className="shimmer-gold">Reimagined</span>
          </h1>

          <p className="land-hero-sub fade-up-2">
            A complete digital banking platform with 22-stage withdrawal compliance,
            multi-currency accounts, and institutional-grade security — built for the modern private client.
          </p>

          <div className="land-hero-btns fade-up-3">
            <button className="land-btn-gold land-btn-lg" onClick={() => navigate('/register')}>
              Open Private Account
            </button>
            <button className="land-btn-ghost land-btn-lg" onClick={() => navigate('/login')}>
              Sign In →
            </button>
          </div>

          <div className="land-hero-trust fade-up-4">
            {['256-bit SSL Encryption', '22-Stage KYC/AML', '10 Currencies', 'Real-Time Compliance'].map(f => (
              <div key={f} className="land-trust-item">
                <span className="land-trust-star">✦</span>{f}
              </div>
            ))}
          </div>
        </div>

        <div className="land-hero-card float-card">
          <div className="land-card-header">
            <div>
              <p className="land-card-label">TOTAL PORTFOLIO</p>
              <p className="land-card-balance">$51,233.50</p>
            </div>
            <div className="land-card-status">
              <span className="land-badge-dot pulse" style={{ background: '#4ADE80' }} />
              <span style={{ fontSize: 10, color: '#4ADE80' }}>ACTIVE</span>
            </div>
          </div>
          <div className="land-card-accounts">
            {[
              { type: 'Checking', bal: '$12,483.50', color: '#C8A84A' },
              { type: 'Savings',  bal: '$38,750.00', color: '#3ECFCF' },
            ].map(a => (
              <div key={a.type} className="land-mini-acc">
                <p style={{ fontSize: 11, color: '#4A6080', textTransform: 'capitalize' }}>{a.type}</p>
                <p style={{ fontSize: 15, fontWeight: 600, color: a.color }}>{a.bal}</p>
              </div>
            ))}
          </div>
          <div className="land-card-secure">
            <span className="land-badge-dot pulse" style={{ background: '#4ADE80' }} />
            <span>256-BIT ENCRYPTED · SECURE SESSION</span>
          </div>
          <div className="land-stage-badge float-badge">
            <p style={{ fontSize: 9, color: '#C8A84A', fontFamily: 'var(--font-mono)', letterSpacing: 1 }}>STAGE 4/22</p>
            <p style={{ fontSize: 11, marginTop: 2 }}>AML Screening ✓</p>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <div ref={statsRef} className="land-stats">
        {STATS.map((s, i) => (
          <div key={s.label} className="land-stat-item" style={{ animationDelay: `${i * 0.1}s` }}>
            <p className="land-stat-value">
              <CountUp target={s.value} start={statsVisible} />
            </p>
            <p className="land-stat-label">{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── IMAGE CAROUSEL SECTION ── */}
      <section className="land-carousel-section">
        <AnimSection>
          <div className="land-section-header">
            <p className="land-eyebrow">VISUAL TOUR</p>
            <h2 className="land-h2">Experience the<br />Future of Banking</h2>
          </div>
        </AnimSection>
        <ImageCarousel />
      </section>

      {/* ── FEATURES ── */}
      <section ref={featuresRef} className="land-section">
        <AnimSection>
          <div className="land-section-header">
            <p className="land-eyebrow">PLATFORM FEATURES</p>
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

      {/* ── 22-STAGE SECTION (COMPLIANCE) ── */}
      <section ref={complianceRef} className="land-compliance-section">
        <div className="land-compliance-inner">
          <AnimSection className="land-compliance-text">
            <p className="land-eyebrow">WITHDRAWAL COMPLIANCE</p>
            <h2 className="land-h2" style={{ fontSize: 44 }}>22-Stage<br />Verification Process</h2>
            <p className="land-body-text">
              Every withdrawal passes through 22 institutional-grade compliance stages —
              each requiring explicit admin authorization. A level of oversight previously
              only available to major financial institutions.
            </p>
            <div className="land-check-list">
              {['Identity & KYC Verification', 'AML & Sanctions Screening', 'Multi-Jurisdiction Clearance', 'Board-Level Authorization', 'Final Release Sign-Off'].map(s => (
                <div key={s} className="land-check-item">
                  <span className="land-check-star">✦</span>
                  <span>{s}</span>
                </div>
              ))}
            </div>
            <button className="land-btn-gold" style={{ marginTop: 28 }} onClick={() => navigate('/register')}>
              Start Verification
            </button>
          </AnimSection>

          <AnimSection className="land-stage-list">
            {STAGES_PREVIEW.map((s, i) => (
              <div key={s.n} className={`land-stage-row ${s.done ? 'stage-done' : ''} ${s.active ? 'stage-active' : ''}`}>
                <div className="land-stage-num">
                  {s.done ? '✓' : s.n}
                </div>
                <p className="land-stage-name">{s.name}</p>
                <span className="land-stage-badge-pill">
                  {s.done ? 'Approved' : s.active ? 'Pending' : '—'}
                </span>
              </div>
            ))}
            <div className="land-stage-more">
              <div className="land-stage-num" style={{ opacity: 0.3 }}>+15</div>
              <p className="land-stage-name" style={{ opacity: 0.3 }}>15 more verification stages…</p>
            </div>
            <div className="land-stage-progress">
              <div className="land-stage-progress-bar" style={{ width: '18%' }} />
            </div>
            <p style={{ fontSize: 11, color: '#4A6080', fontFamily: 'var(--font-mono)', marginTop: 6, letterSpacing: 1 }}>STAGE 3 OF 22 COMPLETE</p>
          </AnimSection>
        </div>
      </section>

      {/* ── PARTNERS SECTION ── */}
      <section className="land-partners-section">
        <AnimSection>
          <p className="land-eyebrow">TRUSTED BY INDUSTRY LEADERS</p>
          <div className="land-partners-grid">
            {PARTNERS.map((partner, idx) => (
              <div key={idx} className="land-partner-item">
                <span className="land-partner-icon">{partner.logo}</span>
                <span className="land-partner-name">{partner.name}</span>
              </div>
            ))}
          </div>
        </AnimSection>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="land-section">
        <AnimSection>
          <div className="land-section-header">
            <p className="land-eyebrow">HOW IT WORKS</p>
            <h2 className="land-h2">Simple for clients.<br />Powerful for admins.</h2>
          </div>
        </AnimSection>
        <div className="land-steps-grid">
          {STEPS.map((s, i) => (
            <AnimSection key={s.n} style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="land-step-card">
                <div className="land-step-num">{s.n}</div>
                {i < STEPS.length - 1 && <div className="land-step-connector" />}
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
            <p className="land-eyebrow" style={{ color: '#C8A84A' }}>CLIENT TESTIMONIALS</p>
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
                  <div className="land-author-avatar">
                    {t.name.split(' ').map(n => n[0]).join('')}
                  </div>
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
            <p className="land-eyebrow">ENTERPRISE SECURITY</p>
            <h2 className="land-h2" style={{ fontSize: 44 }}>Security at<br />every layer</h2>
            <p className="land-body-text">
              Built on institutional-grade infrastructure — every component
              designed to protect your clients' assets, data, and identity.
            </p>
            <div className="land-security-grid">
              {['JWT Authentication', 'bcrypt Password Hashing', 'MongoDB Transactions', 'Role-Based Access', 'Account Freeze Lock', 'Full Audit Log'].map(s => (
                <div key={s} className="land-security-item">
                  <span className="land-check-green">✓</span>
                  <span>{s}</span>
                </div>
              ))}
            </div>
          </AnimSection>

          <AnimSection className="land-security-visual">
            <div className="land-sec-card float-card">
              <div style={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: '50%', background: 'radial-gradient(circle,rgba(200,168,74,0.08),transparent 70%)', pointerEvents: 'none' }} />
              <div className="land-sec-card-header">
                <div>
                  <p className="land-card-label">ACTIVE SESSION</p>
                  <p style={{ fontFamily: 'var(--font-serif)', fontSize: 22, color: '#C8D8E8' }}>Alice Johnson</p>
                  <p style={{ fontSize: 11, color: '#4A6080', marginTop: 2 }}>Private Client · Verified ✓</p>
                </div>
                <div className="land-avatar">AJ</div>
              </div>
              <div className="land-sec-accounts">
                {[
                  { type: 'Checking', bal: '$12,483.50', cur: 'USD', color: '#C8A84A', num: '4821' },
                  { type: 'Savings',  bal: '$38,750.00', cur: 'USD', color: '#3ECFCF', num: '9034' },
                ].map(a => (
                  <div key={a.type} className="land-sec-acc-row">
                    <div>
                      <p style={{ fontSize: 11, textTransform: 'capitalize', fontWeight: 500 }}>{a.type}</p>
                      <p style={{ fontSize: 9, color: '#4A6080', fontFamily: 'var(--font-mono)', marginTop: 2 }}>••••{a.num} · {a.cur}</p>
                    </div>
                    <p style={{ fontSize: 15, fontWeight: 600, color: a.color }}>{a.bal}</p>
                  </div>
                ))}
              </div>
              <div className="land-encrypted-badge">
                <span className="land-badge-dot pulse" style={{ background: '#4ADE80' }} />
                <span>256-BIT ENCRYPTED · SECURE</span>
              </div>
            </div>
          </AnimSection>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="land-cta-section">
        <div className="land-cta-glow" />
        <AnimSection className="land-cta-content">
          <p className="land-eyebrow">GET STARTED TODAY</p>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 60, fontWeight: 300, lineHeight: 1.1, marginBottom: 20 }}>
            Ready to bank<br />with confidence?
          </h2>
          <p className="land-body-text" style={{ maxWidth: 520, margin: '0 auto 40px' }}>
            Join Halifx Offshore Private Bank and experience institutional-grade banking with
            complete compliance oversight, multi-currency accounts, and a world-class client experience.
          </p>
          <div className="land-cta-btns">
            <button className="land-btn-gold land-btn-lg" onClick={() => navigate('/register')}>
              Open Your Account
            </button>
            <button className="land-btn-ghost land-btn-lg" onClick={() => navigate('/login')}>
              Sign In
            </button>
          </div>
          <p className="land-cta-footnote">NO SETUP FEES · FULLY DIGITAL · INSTANT ONBOARDING</p>
        </AnimSection>
      </section>

      {/* ── FOOTER ── */}
      <footer className="land-footer">
        <div className="land-footer-inner">
          <div className="land-footer-grid">
            <div className="land-footer-brand">
              <div className="land-logo" style={{ marginBottom: 14, cursor: 'pointer' }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                <div className="land-logo-mark" style={{ width: 32, height: 32, fontSize: 16 }}>HO</div>
                <p style={{ fontFamily: 'var(--font-serif)', fontSize: 16, letterSpacing: 3 }}>Halifx Offshore BANK</p>
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
                  <p 
                    key={item} 
                    className="land-footer-link"
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      if (item === 'About') scrollToSection(aboutRef);
                      else if (item === 'Security') scrollToSection(securityRef);
                      else if (item === 'Dashboard' || item === 'Transfer' || item === 'Withdraw') navigate('/login');
                      else navigate('/');
                    }}
                  >
                    {item}
                  </p>
                ))}
              </div>
            ))}
          </div>

          <div className="land-footer-bottom">
            <p style={{ fontSize: 11, color: '#4A6080', fontFamily: 'var(--font-mono)' }}>
              © 2025 Halifx Offshore PRIVATE BANK · ALL RIGHTS RESERVED
            </p>
            <div className="land-footer-currencies">
              {CURRENCIES.slice(0, 6).map(c => (
                <span key={c} className="land-currency-pill">{c}</span>
              ))}
              <span className="land-currency-pill">+4</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
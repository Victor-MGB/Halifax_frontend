import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/api'; 
import './Contact.css';

const Icon = ({ d, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

export default function Contact() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    priority: 'medium',
    subject: 'General Question',
    message: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.message.length < 10) {
      setError('Message must be at least 10 characters long');
      return;
    }

    setLoading(true);
    setError(null);
    setSubmitted(false);

    try {
      const contactData = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        priority: formData.priority,
        subject: formData.subject,
        message: formData.message.trim()
      };

      const response = await api.submitContact(contactData);
      
      setSubmitted(true);
      setSuccessMessage(response.data.message || 'Your message has been received. We will get back to you shortly.');
      
      setFormData({
        fullName: '',
        email: '',
        priority: 'medium',
        subject: 'General Question',
        message: ''
      });

      setTimeout(() => {
        setSubmitted(false);
        setSuccessMessage('');
      }, 8000);

    } catch (err) {
      console.error('Contact submission error:', err);
      
      if (err.response) {
        const errorMsg = err.response.data?.message || 
                         err.response.data?.error || 
                         'Failed to send message. Please try again.';
        setError(errorMsg);
      } else if (err.request) {
        setError('Network error. Please check your connection and try again.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const METHODS = [
    { icon: <Icon d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2 4.2 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.5 2.1L8 9.7a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.4c.9.3 1.8.5 2.7.6a2 2 0 0 1 1.7 2Z" />, title: 'Phone Support', lines: [<a key="p" href="tel:+17163488181">+17163488181</a>, 'Available 24/7 for emergencies'], tint: 'primary' },
    { icon: <Icon d="M4 5h16v14H4zM4 7l8 6 8-6" />, title: 'Email', lines: [<a key="e" href="mailto:halifaxoffshore8@gmail.com">halifaxoffshore8@gmail.com</a>, 'Response within 2 business hours'], tint: 'green' },
    { icon: <Icon d="M21 15a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />, title: 'Secure Messaging', lines: ['Available through your online dashboard', 'Encrypted and confidential'], tint: 'purple' },
    { icon: <Icon d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0Zm-5 0a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" />, title: 'Office Address', lines: ['123 Financial District, Suite 400', 'New York, NY 10005', 'By appointment only'], tint: 'amber' },
  ];

  return (
    <div className="contact-page">
      <div className="contact-container">
        <button className="contact-back-btn" onClick={() => navigate('/')}>
          ← Back to Home
        </button>

        <div className="contact-header">
          <p className="contact-eyebrow">Client support</p>
          <h1>Contact us</h1>
          <p className="contact-subtitle">
            Our team is available around the clock to assist with your banking needs
          </p>
        </div>

        <div className="contact-grid">
          <div className="contact-info">
            {METHODS.map(m => (
              <div key={m.title} className="contact-method">
                <div className={`contact-icon tint-${m.tint}`}>{m.icon}</div>
                <div>
                  <h3>{m.title}</h3>
                  {m.lines.map((l, i) => (
                    <p key={i} className={i === m.lines.length - 1 ? 'contact-method-detail' : ''}>{l}</p>
                  ))}
                </div>
              </div>
            ))}

            <div className="contact-hours">
              <h3><Icon d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Zm0-14v6l4 2" size={16} /> Business Hours</h3>
              <ul>
                <li><span>Monday - Friday:</span> 8:00 AM - 8:00 PM EST</li>
                <li><span>Saturday:</span> 9:00 AM - 5:00 PM EST</li>
                <li><span>Sunday:</span> Closed</li>
              </ul>
              <p className="contact-hours-note">
                * 24/7 emergency support available for fraud reporting and account security
              </p>
            </div>
          </div>

          <div className="contact-form-wrapper">
            <h2>Send a message</h2>
            
            {error && (
              <div className="contact-error">
                <Icon d="M18 6 6 18M6 6l12 12" size={17} />
                {error}
              </div>
            )}

            {submitted && (
              <div className="contact-success">
                <Icon d="M20 6 9 17l-5-5" size={17} />
                {successMessage}
              </div>
            )}

            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="fullName">Full Name *</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  placeholder="John Doe"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="john@example.com"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="priority">Priority Level *</label>
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  required
                  disabled={loading}
                >
                  <option value="low">Low - General Inquiry</option>
                  <option value="medium">Medium - Standard Support</option>
                  <option value="high">High - Urgent Issue</option>
                  <option value="urgent">Urgent - Emergency</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject *</label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  disabled={loading}
                >
                  <option value="Account Inquiry">Account Inquiry</option>
                  <option value="Withdrawal Issue">Withdrawal Issue</option>
                  <option value="Transaction Dispute">Transaction Dispute</option>
                  <option value="Account Frozen">Account Frozen</option>
                  <option value="KYC / Verification">KYC / Verification</option>
                  <option value="Technical Support">Technical Support</option>
                  <option value="Fraud Report">Fraud Report</option>
                  <option value="General Question">General Question</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="Please describe your inquiry in detail (minimum 10 characters)..."
                  disabled={loading}
                  minLength="10"
                />
                <small className={`char-count ${formData.message.length >= 10 ? 'valid' : formData.message.length > 0 ? 'invalid' : ''}`}>
                  {formData.message.length}/10 characters minimum
                  {formData.message.length > 0 && formData.message.length < 10 && 
                    ` (${10 - formData.message.length} more needed)`
                  }
                </small>
              </div>

              <div className="form-note">
                <Icon d="M12 9v4m0 4h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" size={16} />
                <span>
                  For urgent matters, especially fraud or security concerns,
                  please call our emergency hotline immediately.
                </span>
              </div>

              <button 
                type="submit" 
                className="contact-submit-btn"
                disabled={loading || formData.message.length < 10}
              >
                {loading ? (
                  <>
                    <span className="spinner" /> Sending...
                  </>
                ) : (
                  <>
                    <Icon d="M4 5h16v14H4zM4 7l8 6 8-6" size={16} />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        <div className="contact-emergency">
          <div className="emergency-banner">
            <div className="emergency-icon">
              <Icon d="M12 9v4m0 4h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" size={26} />
            </div>
            <div>
              <h3>Emergency Support</h3>
              <p>
                Report lost/stolen cards or suspected fraud immediately:
                <br />
                <strong>+17163488181</strong> (24/7)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

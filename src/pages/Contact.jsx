import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/api'; 
import './Contact.css';

export default function Contact() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    priority: 'medium',
    subject: 'General Question', // Changed to match schema enum
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
    // Clear errors when user starts typing
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (formData.message.length < 10) {
      setError('Message must be at least 10 characters long');
      return;
    }

    setLoading(true);
    setError(null);
    setSubmitted(false);

    try {
      // Prepare data matching your database schema exactly
      const contactData = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        priority: formData.priority,
        subject: formData.subject, // Now using enum value from dropdown
        message: formData.message.trim()
      };

      // Submit to backend
      const response = await api.submitContact(contactData);
      
      // Success
      setSubmitted(true);
      setSuccessMessage(response.data.message || 'Your message has been received. We will get back to you shortly.');
      
      // Reset form
      setFormData({
        fullName: '',
        email: '',
        priority: 'medium',
        subject: 'General Question',
        message: ''
      });

      // Auto-hide success message after 8 seconds
      setTimeout(() => {
        setSubmitted(false);
        setSuccessMessage('');
      }, 8000);

    } catch (err) {
      // Handle errors
      console.error('Contact submission error:', err);
      
      if (err.response) {
        // Server responded with error
        const errorMsg = err.response.data?.message || 
                         err.response.data?.error || 
                         'Failed to send message. Please try again.';
        setError(errorMsg);
      } else if (err.request) {
        // Request made but no response
        setError('Network error. Please check your connection and try again.');
      } else {
        // Something else went wrong
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      <div className="contact-container">
        <button className="contact-back-btn" onClick={() => navigate('/')}>
          ← Back to Home
        </button>

        <div className="contact-header">
          <h1>Contact Us</h1>
          <p className="contact-subtitle">
            Our team is available 24/7 to assist with your banking needs
          </p>
        </div>

        <div className="contact-grid">
          <div className="contact-info">
            <h2>Get in Touch</h2>
            
            <div className="contact-method">
              <div className="contact-icon">📞</div>
              <div>
                <h3>Phone Support</h3>
                <p>+17163488181</p>
                <p className="contact-method-detail">Available 24/7 for emergencies</p>
              </div>
            </div>

            <div className="contact-method">
              <div className="contact-icon">✉️</div>
              <div>
                <h3>Email</h3>
                <p><a href="mailto:support@halifx.com">halifaxoffshore8@gmail.com</a></p>
                <p className="contact-method-detail">Response within 2 business hours</p>
              </div>
            </div>

            <div className="contact-method">
              <div className="contact-icon">💬</div>
              <div>
                <h3>Secure Messaging</h3>
                <p>Available through your online dashboard</p>
                <p className="contact-method-detail">Encrypted and confidential</p>
              </div>
            </div>

            <div className="contact-method">
              <div className="contact-icon">📍</div>
              <div>
                <h3>Office Address</h3>
                <p>123 Financial District, Suite 400</p>
                <p>New York, NY 10005</p>
                <p className="contact-method-detail">By appointment only</p>
              </div>
            </div>

            <div className="contact-hours">
              <h3>Business Hours</h3>
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
            <h2>Send a Message</h2>
            
            {/* Display error message */}
            {error && (
              <div className="contact-error">
                <span className="error-icon">❌</span>
                {error}
              </div>
            )}

            {/* Display success message */}
            {submitted && (
              <div className="contact-success">
                <span className="success-icon">✅</span>
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

              {/* Priority Selection - Matches schema enum */}
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
                  <option value="urgent">🚨 Urgent - Emergency</option>
                </select>
              </div>

              {/* Subject Selection - Now using dropdown with schema enum values */}
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
                <small className={`char-count ${formData.message.length >= 10 ? 'valid' : 'invalid'}`}>
                  {formData.message.length}/10 characters minimum
                  {formData.message.length > 0 && formData.message.length < 10 && 
                    ` (${10 - formData.message.length} more needed)`
                  }
                  {formData.message.length >= 10 && ' ✅'}
                </small>
              </div>

              <div className="form-note">
                <p>
                  ⚠️ For urgent matters, especially fraud or security concerns, 
                  please call our emergency hotline immediately.
                </p>
              </div>

              <button 
                type="submit" 
                className="contact-submit-btn"
                disabled={loading || formData.message.length < 10}
              >
                {loading ? (
                  <>
                    <span className="spinner">⏳</span> Sending...
                  </>
                ) : (
                  'Send Message'
                )}
              </button>
            </form>
          </div>
        </div>

        <div className="contact-emergency">
          <div className="emergency-banner">
            <span className="emergency-icon">⚠️</span>
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
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LegalPages.css';

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="legal-page">
      <div className="legal-container">
        <button className="legal-back-btn" onClick={() => navigate('/')}>
          ← Back to Home
        </button>
        
        <div className="legal-header">
          <h1>Privacy Policy</h1>
          <p className="legal-effective">Last Updated: January 2026</p>
        </div>

        <div className="legal-content">
          <section>
            <h2>1. Introduction</h2>
            <p>
              Halifx Offshore Private Bank ("we," "our," "us") is committed to protecting 
              your privacy and personal information. This Privacy Policy explains how we 
              collect, use, disclose, and safeguard your information when you use our 
              digital banking platform, website, and related services.
            </p>
            <p>
              By using our services, you consent to the collection and use of your 
              information as described in this policy.
            </p>
          </section>

          <section>
            <h2>2. Information We Collect</h2>
            
            <h3>2.1 Personal Information You Provide</h3>
            <ul>
              <li>Full name, date of birth, and contact information (email, phone number, address)</li>
              <li>Government-issued identification (passport, driver's license, national ID)</li>
              <li>Social Security Number / Tax Identification Number</li>
              <li>Employment and income information</li>
              <li>Bank account details and financial information</li>
              <li>Transaction history and investment preferences</li>
            </ul>

            <h3>2.2 Information Collected Automatically</h3>
            <ul>
              <li>IP address, device type, browser information, and operating system</li>
              <li>Usage data (pages visited, time spent, features accessed)</li>
              <li>Location data (for fraud prevention and security)</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>

            <h3>2.3 Information from Third Parties</h3>
            <ul>
              <li>Credit reporting agencies for identity verification</li>
              <li>Financial institutions for transaction processing</li>
              <li>Compliance databases for AML/KYC screening</li>
            </ul>
          </section>

          <section>
            <h2>3. How We Use Your Information</h2>
            <ul>
              <li><strong>Service Delivery:</strong> To process transactions, manage accounts, and provide customer support</li>
              <li><strong>Compliance:</strong> To meet KYC/AML regulatory requirements and prevent fraud</li>
              <li><strong>Communication:</strong> To send account updates, notifications, and marketing materials (with consent)</li>
              <li><strong>Platform Improvement:</strong> To enhance user experience and develop new features</li>
              <li><strong>Security:</strong> To monitor for suspicious activity and protect your account</li>
            </ul>
          </section>

          <section>
            <h2>4. Information Sharing</h2>
            <p>
              We do not sell your personal information. We may share your information with:
            </p>
            <ul>
              <li><strong>Service Providers:</strong> Third-party vendors who assist with operations (payment processors, compliance screening, cloud hosting)</li>
              <li><strong>Regulatory Authorities:</strong> When required by law or to comply with legal obligations</li>
              <li><strong>Business Partners:</strong> With your explicit consent for specific services</li>
              <li><strong>Corporate Transactions:</strong> In the event of a merger, acquisition, or asset sale</li>
            </ul>
          </section>

          <section>
            <h2>5. Data Security</h2>
            <p>
              We implement robust security measures to protect your information:
            </p>
            <ul>
              <li>256-bit SSL/TLS encryption for all data in transit</li>
              <li>Advanced encryption for stored data</li>
              <li>Regular security audits and penetration testing</li>
              <li>Multi-factor authentication for account access</li>
              <li>24/7 monitoring for unauthorized access</li>
              <li>Strict access controls and employee training</li>
            </ul>
          </section>

          <section>
            <h2>6. Your Rights</h2>
            <p>Depending on your jurisdiction, you may have the right to:</p>
            <ul>
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Rectification:</strong> Correct inaccurate or incomplete information</li>
              <li><strong>Deletion:</strong> Request deletion of your data (subject to legal requirements)</li>
              <li><strong>Restriction:</strong> Limit how we use your data</li>
              <li><strong>Portability:</strong> Transfer your data to another service</li>
              <li><strong>Object:</strong> Object to certain processing activities</li>
            </ul>
            <p>To exercise these rights, contact us at <a href="mailto:privacy@halifx.com">privacy@halifx.com</a></p>
          </section>

          <section>
            <h2>7. Data Retention</h2>
            <p>
              We retain your personal information for as long as necessary to provide our services, 
              comply with legal obligations (often 5-7 years for financial records), resolve disputes, 
              and enforce our agreements.
            </p>
          </section>

          <section>
            <h2>8. International Data Transfers</h2>
            <p>
              Your information may be transferred to and processed in countries outside your 
              jurisdiction. We ensure appropriate safeguards are in place, including Standard 
              Contractual Clauses approved by regulatory authorities.
            </p>
          </section>

          <section>
            <h2>9. Cookies and Tracking</h2>
            <p>
              We use cookies to enhance your experience, analyze usage, and deliver personalized 
              content. You can manage cookie preferences through your browser settings.
            </p>
          </section>

          <section>
            <h2>10. Children's Privacy</h2>
            <p>
              Our services are not intended for individuals under 18. We do not knowingly collect 
              information from minors.
            </p>
          </section>

          <section>
            <h2>11. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy periodically. Significant changes will be notified 
              via email or platform notification. Continued use of our services constitutes 
              acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2>12. Contact Information</h2>
            <p>
              For privacy-related questions or concerns:
            </p>
            <ul>
              <li><strong>Email:</strong> halifaxoffshore8@gmail.com</li>
              <li><strong>Phone:</strong> +17163488181</li>
              <li><strong>Address:</strong> Halifx Offshore Bank, 123 Financial District, Suite 400, New York, NY 10005</li>
            </ul>
          </section>

          <div className="legal-footer">
            <p className="legal-footer-text">
              Last reviewed: January 2026 | Version 2.4
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
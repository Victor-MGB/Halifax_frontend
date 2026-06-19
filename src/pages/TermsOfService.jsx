import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LegalPages.css';

export default function TermsOfService() {
  const navigate = useNavigate();

  return (
    <div className="legal-page">
      <div className="legal-container">
        <button className="legal-back-btn" onClick={() => navigate('/')}>
          ← Back to Home
        </button>
        
        <div className="legal-header">
          <h1>Terms of Service</h1>
          <p className="legal-effective">Last Updated: January 2026</p>
        </div>

        <div className="legal-content">
          <section>
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing or using Halifx Offshore Private Bank's digital banking platform, 
              website, mobile applications, and related services (collectively, the "Services"), 
              you agree to be bound by these Terms of Service ("Terms"). If you do not agree, 
              please do not use our Services.
            </p>
            <p>
              These Terms constitute a legally binding agreement between you and Halifx Offshore 
              Private Bank ("we," "our," "us").
            </p>
          </section>

          <section>
            <h2>2. Definitions</h2>
            <ul>
              <li><strong>"Account"</strong> - Your registered user account with Halifx Offshore</li>
              <li><strong>"Business Day"</strong> - Monday through Friday, excluding public holidays</li>
              <li><strong>"Services"</strong> - All banking products and features provided through our platform</li>
              <li><strong>"Transaction"</strong> - Any deposit, withdrawal, transfer, or payment made through your account</li>
              <li><strong>"You"</strong> - The user or account holder</li>
            </ul>
          </section>

          <section>
            <h2>3. Account Registration and Eligibility</h2>
            <h3>3.1 Eligibility</h3>
            <ul>
              <li>You must be at least 18 years old</li>
              <li>You must have legal capacity to enter into a binding agreement</li>
              <li>You must provide accurate and complete information during registration</li>
              <li>You must be legally permitted to hold a bank account in your jurisdiction</li>
            </ul>

            <h3>3.2 Account Security</h3>
            <ul>
              <li>You are responsible for maintaining the confidentiality of your login credentials</li>
              <li>You must notify us immediately of any unauthorized account access</li>
              <li>We are not liable for losses resulting from compromised credentials</li>
            </ul>
          </section>

          <section>
            <h2>4. Services Provided</h2>
            <p>Our Services include but are not limited to:</p>
            <ul>
              <li>Multi-currency accounts (USD, EUR, GBP, CHF, JPY, CAD, AUD, SGD, AED, HKD)</li>
              <li>Instant internal transfers between accounts</li>
              <li>Secure withdrawal processing with 22-stage compliance verification</li>
              <li>Real-time transaction notifications</li>
              <li>Account management and reporting</li>
              <li>Compliance and KYC verification</li>
            </ul>
          </section>

          <section>
            <h2>5. Compliance and Verification</h2>
            <h3>5.1 KYC/AML Requirements</h3>
            <p>
              As a regulated financial institution, we are required to perform Know Your Customer (KYC) 
              and Anti-Money Laundering (AML) checks. You agree to:
            </p>
            <ul>
              <li>Provide all requested documentation for identity verification</li>
              <li>Cooperate with ongoing compliance screening</li>
              <li>Report any changes to your personal or financial information</li>
              <li>Understand that failure to comply may result in account restrictions</li>
            </ul>

            <h3>5.2 22-Stage Verification Process</h3>
            <p>
              All withdrawals are subject to our 22-stage verification process, including:
            </p>
            <ul>
              <li>Identity verification and document validation</li>
              <li>AML and sanctions screening</li>
              <li>Source of funds verification</li>
              <li>Transaction risk assessment</li>
              <li>Administrative authorization at each stage</li>
            </ul>
          </section>

          <section>
            <h2>6. User Responsibilities</h2>
            <h3>6.1 Accurate Information</h3>
            <p>You are responsible for ensuring all information provided is accurate and up-to-date.</p>

            <h3>6.2 Prohibited Activities</h3>
            <p>You may not use our Services for:</p>
            <ul>
              <li>Illegal or fraudulent activities</li>
              <li>Money laundering or terrorist financing</li>
              <li>Unauthorized financial services</li>
              <li>Any activity that violates applicable laws</li>
            </ul>

            <h3>6.3 Notifications</h3>
            <p>
              You must maintain current contact information to receive important notifications 
              about your account and compliance matters.
            </p>
          </section>

          <section>
            <h2>7. Fees and Charges</h2>
            <ul>
              <li>All fees and charges are disclosed during the account setup process</li>
              <li>We reserve the right to modify fees with prior notice</li>
              <li>Transaction fees, currency conversion fees, and service fees may apply</li>
              <li>All fees will be clearly displayed before you confirm any transaction</li>
            </ul>
          </section>

          <section>
            <h2>8. Withdrawals and Transfers</h2>
            <h3>8.1 Processing Time</h3>
            <p>
              Withdrawals are processed after completion of all compliance stages. Processing 
              times may vary based on the complexity of verification required.
            </p>

            <h3>8.2 Restrictions</h3>
            <ul>
              <li>Daily withdrawal limits may apply</li>
              <li>Additional verification may be required for large transactions</li>
              <li>We reserve the right to hold transactions for compliance review</li>
            </ul>
          </section>

          <section>
            <h2>9. Account Freezing and Termination</h2>
            <h3>9.1 Account Freezing</h3>
            <p>We may freeze your account if we suspect:</p>
            <ul>
              <li>Unauthorized access or fraudulent activity</li>
              <li>Violation of these Terms</li>
              <li>Legal or regulatory requirements</li>
              <li>Security concerns</li>
            </ul>

            <h3>9.2 Termination</h3>
            <p>We may terminate or suspend your account at our discretion, including for:</p>
            <ul>
              <li>Material breach of these Terms</li>
              <li>Failure to meet compliance requirements</li>
              <li>Illegal or prohibited activities</li>
              <li>At your request</li>
            </ul>
          </section>

          <section>
            <h2>10. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, Halifx Offshore is not liable for:
            </p>
            <ul>
              <li>Indirect, incidental, or consequential damages</li>
              <li>Loss of profits, data, or business opportunities</li>
              <li>Damages resulting from service interruptions or delays</li>
              <li>Unauthorized access to your account (unless caused by our negligence)</li>
            </ul>
          </section>

          <section>
            <h2>11. Dispute Resolution</h2>
            <h3>11.1 Governing Law</h3>
            <p>
              These Terms are governed by the laws of [Your Jurisdiction], without regard to 
              conflict of law principles.
            </p>

            <h3>11.2 Arbitration</h3>
            <p>
              Any dispute arising from these Terms shall be resolved through binding arbitration 
              in accordance with the rules of [Arbitration Association]. Each party shall bear 
              its own costs.
            </p>
          </section>

          <section>
            <h2>12. Modifications to Terms</h2>
            <p>
              We may modify these Terms at any time. Material changes will be communicated via:
            </p>
            <ul>
              <li>Email notification to your registered address</li>
              <li>Platform notification upon login</li>
              <li>Updates posted on our website</li>
            </ul>
            <p>
              Continued use of our Services after changes constitutes acceptance of the 
              modified Terms.
            </p>
          </section>

          <section>
            <h2>13. Contact Information</h2>
            <ul>
              <li><strong>Email:</strong> halifaxoffshore8@gmail.com</li>
              <li><strong>Phone:</strong> +17163488181</li>
              <li><strong>Address:</strong> Halifx Offshore Bank, 123 Financial District, Suite 400, New York, NY 10005</li>
            </ul>
          </section>

          <div className="legal-footer">
            <p className="legal-footer-text">
              Last reviewed: January 2026 | Version 3.1
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
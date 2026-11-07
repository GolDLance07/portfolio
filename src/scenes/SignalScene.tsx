import React, { useState } from 'react';
import { CONTACT_CONFIG } from '../data/contact';
import {
  Radio,
  Send,
  CheckCircle2,
  Copy,
  Check,
  AlertCircle,
  Loader2,
  Mail,
} from 'lucide-react';
import {
  transmitSignal,
  RECIPIENT_EMAIL,
} from '../services/emailService';
import '../styles/signal.css';

interface SignalSceneProps {
  hideSky?: boolean;
}

const GithubIcon = ({ size = 16 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = ({ size = 16 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

type SubmissionStatus = 'idle' | 'submitting' | 'success' | 'error';

export const SignalScene: React.FC<SignalSceneProps> = ({ hideSky = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [honeypot, setHoneypot] = useState('');
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [status, setStatus] = useState<SubmissionStatus>('idle');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [lastSubmittedAt, setLastSubmittedAt] = useState<number>(0);
  const [copiedEmail, setCopiedEmail] = useState<boolean>(false);

  // Form Field Validation
  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      errors.name = 'Please provide your name or call-sign.';
    }

    if (!formData.email.trim()) {
      errors.email = 'Please provide a return transmission address (email).';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'Please enter a valid email format (e.g. user@domain.com).';
    }

    if (!formData.subject.trim()) {
      errors.subject = 'Please provide a transmission subject.';
    }

    if (!formData.message.trim()) {
      errors.message = 'Transmission payload cannot be empty.';
    } else if (formData.message.trim().length < 10) {
      errors.message = 'Transmission payload must contain at least 10 characters.';
    }

    return errors;
  };

  const handleInputChange = (
    field: 'name' | 'email' | 'subject' | 'message',
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear field-specific error as user types
    if (formErrors[field]) {
      setFormErrors((prev) => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
    // If an error alert was visible, clear it once user starts revising
    if (status === 'error') {
      setStatus('idle');
      setStatusMessage('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Anti-spam honeypot detection
    if (honeypot.trim()) {
      // Quietly intercept automated bot without triggering real transmission
      setStatus('success');
      setStatusMessage('Signal received. Your message is on its way.');
      return;
    }

    // 2. Client-side rate-limiting cooldown (20 seconds)
    const now = Date.now();
    if (lastSubmittedAt && now - lastSubmittedAt < 20000) {
      const remaining = Math.ceil((20000 - (now - lastSubmittedAt)) / 1000);
      setStatus('error');
      setStatusMessage(
        `Transmission cooldown active. Please wait ${remaining}s before sending another signal.`
      );
      return;
    }

    // 3. Validation check
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setStatus('submitting');
    setStatusMessage('');

    // 4. Dispatch transmission via EmailJS
    const result = await transmitSignal({
      name: formData.name.trim(),
      email: formData.email.trim(),
      subject: formData.subject.trim(),
      message: formData.message.trim(),
      timestamp: new Date().toLocaleString(),
    });

    if (result.success) {
      setStatus('success');
      setStatusMessage(result.message);
      setLastSubmittedAt(Date.now());
      // Clear form inputs upon verified successful delivery
      setFormData({ name: '', email: '', subject: '', message: '' });
    } else {
      setStatus('error');
      setStatusMessage(result.message);
      // Notice: form input data is intentionally preserved so visitor can retry
    }
  };

  const handleCopyEmail = (email: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(email);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2200);
    }
  };

  // Prefilled mailto URL for direct mail client fallback
  const mailtoUrl = `mailto:${RECIPIENT_EMAIL}?subject=${encodeURIComponent(
    formData.subject.trim() || 'Signal Transmission from The Observatory'
  )}&body=${encodeURIComponent(
    formData.message.trim()
      ? `${formData.message.trim()}\n\n— Transmitted by ${formData.name.trim() || 'Visitor'} (${formData.email.trim() || 'No email provided'})`
      : ''
  )}`;

  return (
    <section
      id="contact-section"
      className={`signal-scene ${hideSky ? 'is-in-celestial-stage' : ''}`}
      aria-label="Scene 06: The Signal (Contact)"
    >
      <div className="signal-container">
        {/* Header */}
        <header className="signal-header">
          <div className="signal-eyebrow">
            <Radio size={14} aria-hidden="true" />
            <span>STATION 06 &bull; THE SIGNAL</span>
          </div>
          <h2 className="signal-title">{CONTACT_CONFIG.heading}</h2>
          <p className="signal-subtitle">{CONTACT_CONFIG.leadParagraph}</p>
        </header>

        {/* Main Stage */}
        <div className="signal-main-stage">
          {/* Left: Telemetry Antenna Card */}
          <div className="signal-station-card">
            {/* Visual Antenna Beacon */}
            <div className="signal-antenna-frame" aria-hidden="true">
              <svg viewBox="0 0 160 140" style={{ width: '100%', height: '100%' }}>
                {/* Harmonic broadcast rings */}
                <circle cx="80" cy="40" r="16" className="signal-pulse-ring" />
                <circle
                  cx="80"
                  cy="40"
                  r="28"
                  className="signal-pulse-ring"
                  style={{ animationDelay: '1s' }}
                />
                <circle
                  cx="80"
                  cy="40"
                  r="42"
                  className="signal-pulse-ring"
                  style={{ animationDelay: '2s' }}
                />

                {/* Antenna Mast */}
                <circle cx="80" cy="40" r="4.5" fill="var(--color-pink)" />
                <line x1="80" y1="40" x2="80" y2="120" stroke="var(--color-moonlight)" strokeWidth="2" />
                <line x1="68" y1="65" x2="92" y2="65" stroke="var(--color-violet)" strokeWidth="1.5" />
                <line x1="60" y1="90" x2="100" y2="90" stroke="var(--color-violet)" strokeWidth="1.5" />
                {/* Base */}
                <line x1="50" y1="120" x2="110" y2="120" stroke="var(--color-muted)" strokeWidth="3" />
              </svg>
            </div>

            <div className="station-status-pill">
              <span className="status-dot-pulse" aria-hidden="true" />
              <span>BEACON STATUS: LISTENING</span>
            </div>

            <div className="station-meta-coords">
              <div>{CONTACT_CONFIG.stationTag}</div>
              <div>{CONTACT_CONFIG.coordinates}</div>
              <div>FREQUENCY: {CONTACT_CONFIG.frequency}</div>
            </div>

            {/* Direct Communication Channels */}
            <div className="signal-channels-list" role="list" aria-label="Available contact channels">
              {CONTACT_CONFIG.methods.map((method) => {
                const isEmail = method.id === 'email';
                return (
                  <div key={method.id} className="signal-channel-item" role="listitem">
                    <div className="channel-info">
                      <span className="channel-label">{method.label}</span>
                      <a
                        href={method.href}
                        target={method.isExternal ? '_blank' : undefined}
                        rel={method.isExternal ? 'noopener noreferrer' : undefined}
                        className="channel-value"
                      >
                        {method.displayValue}
                      </a>
                    </div>

                    {isEmail ? (
                      <button
                        type="button"
                        onClick={() => handleCopyEmail(method.displayValue)}
                        className="channel-icon"
                        aria-label={`Copy email address ${method.displayValue}`}
                        title="Copy email to clipboard"
                        style={{ padding: '0.4rem', borderRadius: '4px' }}
                      >
                        {copiedEmail ? <Check size={16} color="var(--color-pink)" /> : <Copy size={16} />}
                      </button>
                    ) : method.id === 'github' ? (
                      <a
                        href={method.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="channel-icon"
                        aria-label="Open GitHub profile"
                      >
                        <GithubIcon size={16} />
                      </a>
                    ) : (
                      <a
                        href={method.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="channel-icon"
                        aria-label="Open LinkedIn profile"
                      >
                        <LinkedinIcon size={16} />
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Functional Transmission Console */}
          <div className="transmission-form-card">
            <div className="form-header-meta">
              <span>OUTBOUND TRANSMISSION CONSOLE</span>
              <span>
                BUFFER:{' '}
                {status === 'submitting'
                  ? 'TRANSMITTING...'
                  : status === 'success'
                  ? 'DISPATCHED'
                  : status === 'error'
                  ? 'LINK ERROR'
                  : 'IDLE'}
              </span>
            </div>

            {status === 'success' ? (
              <div className="form-status-box" role="status" aria-live="polite">
                <CheckCircle2 size={44} color="var(--color-pink)" className="status-success-icon" aria-hidden="true" />
                <h3 className="form-status-title">Signal Transmitted</h3>
                <p className="form-status-desc">
                  {statusMessage || 'Signal received. Your message is on its way.'}
                </p>
                <div className="status-receipt-meta">
                  <span>DISPATCHED TO: {RECIPIENT_EMAIL}</span>
                  <span>STATUS: 200 OK &bull; CONFIRMED</span>
                </div>
                <button
                  type="button"
                  className="form-reset-btn"
                  onClick={() => {
                    setStatus('idle');
                    setStatusMessage('');
                  }}
                >
                  Transmit Another Signal
                </button>
              </div>
            ) : (
              <form className="transmission-form" onSubmit={handleSubmit} noValidate>
                {/* Honeypot field (hidden from users, traps automated bots) */}
                <div className="hp-field" style={{ display: 'none' }} aria-hidden="true">
                  <label htmlFor="signal-website">Leave this field blank</label>
                  <input
                    id="signal-website"
                    type="text"
                    name="website"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                {/* Error Banner if transmission failed */}
                {status === 'error' && statusMessage && (
                  <div className="transmission-alert transmission-alert-error" role="alert">
                    <AlertCircle size={18} className="alert-icon" aria-hidden="true" />
                    <div className="alert-content">
                      <span className="alert-title">Transmission Interrupted</span>
                      <span className="alert-text">{statusMessage}</span>
                    </div>
                  </div>
                )}

                {/* Name */}
                <div className="form-group">
                  <label htmlFor="signal-name" className="form-label">
                    Name / Call-Sign <span className="field-required" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="signal-name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`form-input ${formErrors.name ? 'is-invalid' : ''}`}
                    placeholder="e.g. Dr. Arthur Vance"
                    aria-describedby={formErrors.name ? 'signal-name-error' : undefined}
                    disabled={status === 'submitting'}
                  />
                  {formErrors.name && (
                    <span id="signal-name-error" className="form-error-msg">
                      {formErrors.name}
                    </span>
                  )}
                </div>

                {/* Email */}
                <div className="form-group">
                  <label htmlFor="signal-email" className="form-label">
                    Return Transmission Address (Email) <span className="field-required" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="signal-email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`form-input ${formErrors.email ? 'is-invalid' : ''}`}
                    placeholder="e.g. arthur@observatory.dev"
                    aria-describedby={formErrors.email ? 'signal-email-error' : undefined}
                    disabled={status === 'submitting'}
                  />
                  {formErrors.email && (
                    <span id="signal-email-error" className="form-error-msg">
                      {formErrors.email}
                    </span>
                  )}
                </div>

                {/* Subject */}
                <div className="form-group">
                  <label htmlFor="signal-subject" className="form-label">
                    Subject / Transmission Topic <span className="field-required" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="signal-subject"
                    name="subject"
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => handleInputChange('subject', e.target.value)}
                    className={`form-input ${formErrors.subject ? 'is-invalid' : ''}`}
                    placeholder="e.g. Project Inquiry &bull; System Collaboration"
                    aria-describedby={formErrors.subject ? 'signal-subject-error' : undefined}
                    disabled={status === 'submitting'}
                  />
                  {formErrors.subject && (
                    <span id="signal-subject-error" className="form-error-msg">
                      {formErrors.subject}
                    </span>
                  )}
                </div>

                {/* Message */}
                <div className="form-group">
                  <label htmlFor="signal-message" className="form-label">
                    Transmission Payload (Message) <span className="field-required" aria-hidden="true">*</span>
                  </label>
                  <textarea
                    id="signal-message"
                    name="message"
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    className={`form-textarea ${formErrors.message ? 'is-invalid' : ''}`}
                    placeholder="Transmit your project requirements, questions, or ideas across the cosmos..."
                    aria-describedby={formErrors.message ? 'signal-message-error' : undefined}
                    disabled={status === 'submitting'}
                  />
                  {formErrors.message && (
                    <span id="signal-message-error" className="form-error-msg">
                      {formErrors.message}
                    </span>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className={`form-submit-btn ${status === 'submitting' ? 'is-submitting' : ''}`}
                  disabled={status === 'submitting'}
                >
                  {status === 'submitting' ? (
                    <>
                      <Loader2 size={16} className="btn-spinner" aria-hidden="true" />
                      <span>Transmitting...</span>
                    </>
                  ) : (
                    <>
                      <Send size={15} aria-hidden="true" />
                      <span>Transmit Signal</span>
                    </>
                  )}
                </button>

                {/* Secondary Mailto Fallback */}
                <div className="transmission-fallback-row">
                  <span className="fallback-divider-text">OR TRANSMIT DIRECTLY</span>
                  <a
                    href={mailtoUrl}
                    className="fallback-mailto-link"
                    title="Open your default email client prefilled with your message"
                  >
                    <Mail size={14} aria-hidden="true" />
                    <span>Prefer email? Open your mail client</span>
                  </a>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

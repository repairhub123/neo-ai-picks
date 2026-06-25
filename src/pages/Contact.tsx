import React, { useState } from 'react';
import { Mail, Send, CheckCircle, AlertTriangle, MessageSquare, User, AtSign, ChevronDown, Loader2 } from 'lucide-react';
import SEO from '../components/SEO';

interface ContactProps {
  navigateTo: (tab: string, arg?: string) => void;
}

// ─────────────────────────────────────────────────────────────
// Formspree endpoint — replace YOUR_FORM_ID with your form ID
// from https://formspree.io  (free tier: 50 msgs/month)
// If not yet configured, the service layer degrades gracefully.
// ─────────────────────────────────────────────────────────────
const FORMSPREE_ENDPOINT =
  import.meta.env.VITE_FORMSPREE_ENDPOINT || 'https://formspree.io/f/YOUR_FORM_ID';

const isDemoMode = FORMSPREE_ENDPOINT.includes('YOUR_FORM_ID');

type FormState = 'idle' | 'submitting' | 'success' | 'error';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FieldError {
  name?: string;
  email?: string;
  message?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateForm(data: FormData): FieldError {
  const errors: FieldError = {};
  if (!data.name.trim() || data.name.trim().length < 2) {
    errors.name = 'Please enter your full name (min. 2 characters).';
  }
  if (!data.email.trim()) {
    errors.email = 'Email address is required.';
  } else if (!EMAIL_REGEX.test(data.email.trim())) {
    errors.email = 'Please enter a valid email address.';
  }
  if (!data.message.trim() || data.message.trim().length < 20) {
    errors.message = 'Message must be at least 20 characters long.';
  }
  return errors;
}

async function submitToFormspree(data: FormData): Promise<void> {
  if (isDemoMode) {
    // Simulate network delay in demo mode
    await new Promise((res) => setTimeout(res, 1200));
    return;
  }
  const response = await fetch(FORMSPREE_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      name: data.name.trim(),
      email: data.email.trim(),
      subject: data.subject,
      message: data.message.trim(),
      _subject: `[Neo AI Picks] ${data.subject} — ${data.name.trim()}`,
    }),
  });
  if (!response.ok) {
    throw new Error(`Formspree responded with status ${response.status}`);
  }
}

// ─── Sub-components ───────────────────────────────────────────

function InputField({
  id, label, icon, error, children,
}: {
  id: string;
  label: string;
  icon: React.ReactNode;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-slate-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
        {icon}
        {label}
      </label>
      {children}
      {error && (
        <p className="text-rose-400 text-xs font-semibold flex items-center gap-1">
          <AlertTriangle className="w-3 h-3 flex-shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

const inputClass = (hasError: boolean) =>
  `w-full bg-slate-900/80 border ${hasError ? 'border-rose-500/60 focus:border-rose-500 focus:ring-rose-500/40' : 'border-white/8 focus:border-violet-500 focus:ring-violet-500/30'} rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:ring-2 transition-all font-semibold placeholder:text-slate-600 appearance-none`;

// ─── Main Component ───────────────────────────────────────────

export const Contact: React.FC<ContactProps> = ({ navigateTo }) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: '',
  });
  const [fieldErrors, setFieldErrors] = useState<FieldError>({});
  const [formState, setFormState] = useState<FormState>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact Us - Neo AI Picks",
    "description": "Get in touch with the Neo AI Picks team for editorial submissions, advertising, suggestions, or support.",
    "url": "https://neo-ai-picks.vercel.app/contact",
    "mainEntity": {
      "@type": "Organization",
      "name": "Neo AI Picks",
      "email": "contact@neoaipicks.com"
    }
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear field-level error on edit
    if (fieldErrors[field as keyof FieldError]) {
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateForm(formData);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFormState('submitting');
    setErrorMessage('');
    try {
      await submitToFormspree(formData);
      setFormState('success');
      setFormData({ name: '', email: '', subject: 'General Inquiry', message: '' });
      setFieldErrors({});
    } catch (err) {
      setFormState('error');
      setErrorMessage(
        err instanceof Error ? err.message : 'Something went wrong. Please try again or email us directly.'
      );
    }
  };

  const reset = () => {
    setFormState('idle');
    setErrorMessage('');
  };

  return (
    <div className="w-full flex-grow bg-[#0b0f19] pb-20 pt-12 px-6">
      <SEO
        title="Contact Us | Neo AI Picks"
        description="Get in touch with the Neo AI Picks team. Submit your tool, suggest improvements, report issues, or ask questions about our AI directory."
        path="/contact"
        jsonLd={contactSchema}
      />

      <div className="max-w-3xl mx-auto space-y-8">
        {/* PAGE HEADER */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-xs font-bold text-violet-400 select-none uppercase tracking-wider">
            <Mail className="w-3.5 h-3.5" />
            Get In Touch
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
            Contact <span className="text-violet-400">Neo AI Picks</span>
          </h1>
          <p className="text-slate-400 text-sm md:text-base max-w-lg mx-auto font-medium leading-relaxed">
            Have an AI tool to list, feedback on comparisons, or editorial inquiries? Drop us a line below.
          </p>
        </div>

        {/* DEMO BADGE */}
        {isDemoMode && (
          <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-amber-500/8 border border-amber-500/20 text-amber-400 text-xs font-semibold">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>
              Demo mode active — form submissions are simulated. Set{' '}
              <code className="bg-slate-900 px-1 py-0.5 rounded text-amber-300">VITE_FORMSPREE_ENDPOINT</code>{' '}
              in your environment to enable real delivery.
            </span>
          </div>
        )}

        {/* SUCCESS STATE */}
        {formState === 'success' ? (
          <div className="p-8 rounded-3xl saas-glass border border-emerald-500/20 bg-emerald-500/5 text-center space-y-4 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-white">Message Sent Successfully!</h2>
              <p className="text-slate-350 text-sm max-w-md mx-auto font-semibold leading-relaxed">
                {isDemoMode
                  ? 'This was a demo submission. Set your Formspree endpoint to enable real email delivery.'
                  : "Thank you for reaching out! Our editorial and support team will review your message and reply within 24–48 hours."}
              </p>
            </div>
            <button
              onClick={reset}
              className="mt-4 bg-white hover:bg-slate-100 text-slate-950 font-bold text-sm px-6 py-2.5 rounded-xl transition-all cursor-pointer shadow-lg active:scale-95"
            >
              Send Another Message
            </button>
          </div>
        ) : (
          /* CONTACT FORM */
          <form
            onSubmit={handleSubmit}
            noValidate
            className="p-6 md:p-8 rounded-3xl saas-glass border border-white/5 space-y-6 shadow-2xl relative"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-violet-600/5 rounded-full blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <InputField id="contact-name" label="Your Name" icon={<User className="w-3 h-3 text-slate-500" />} error={fieldErrors.name}>
                <input
                  id="contact-name"
                  type="text"
                  autoComplete="name"
                  required
                  placeholder="Jane Smith"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  disabled={formState === 'submitting'}
                  className={inputClass(!!fieldErrors.name)}
                />
              </InputField>

              {/* Email */}
              <InputField id="contact-email" label="Email Address" icon={<AtSign className="w-3 h-3 text-slate-500" />} error={fieldErrors.email}>
                <input
                  id="contact-email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="jane@company.com"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  disabled={formState === 'submitting'}
                  className={inputClass(!!fieldErrors.email)}
                />
              </InputField>
            </div>

            {/* Subject */}
            <InputField id="contact-subject" label="Subject" icon={<ChevronDown className="w-3 h-3 text-slate-500" />}>
              <div className="relative">
                <select
                  id="contact-subject"
                  value={formData.subject}
                  onChange={(e) => handleChange('subject', e.target.value)}
                  disabled={formState === 'submitting'}
                  className={`${inputClass(false)} pr-10 cursor-pointer`}
                >
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Tool Submission Help">Tool Submission Help</option>
                  <option value="Advertising & Partnerships">Advertising &amp; Partnerships</option>
                  <option value="Bug Report or Correction">Bug Report or Correction</option>
                  <option value="Featured Listing Inquiry">Featured Listing Inquiry</option>
                  <option value="Press & Media">Press &amp; Media</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
              </div>
            </InputField>

            {/* Message */}
            <InputField id="contact-message" label="Message" icon={<MessageSquare className="w-3 h-3 text-slate-500" />} error={fieldErrors.message}>
              <textarea
                id="contact-message"
                required
                rows={5}
                placeholder="Describe your inquiry in detail (min. 20 characters)…"
                value={formData.message}
                onChange={(e) => handleChange('message', e.target.value)}
                disabled={formState === 'submitting'}
                className={`${inputClass(!!fieldErrors.message)} resize-none`}
              />
              {!fieldErrors.message && (
                <p className={`text-xs font-semibold text-right pr-0.5 ${formData.message.length < 20 && formData.message.length > 0 ? 'text-amber-400' : 'text-slate-600'}`}>
                  {formData.message.length}/20 min
                </p>
              )}
            </InputField>

            {/* Network error banner */}
            {formState === 'error' && (
              <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-rose-500/8 border border-rose-500/20 text-rose-400 text-xs font-semibold">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>
                  {errorMessage || 'Submission failed. Please try again or email us directly at '}
                  {!errorMessage && (
                    <a href="mailto:contact@neoaipicks.com" className="underline underline-offset-2 hover:text-white transition-colors">
                      contact@neoaipicks.com
                    </a>
                  )}
                </span>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={formState === 'submitting'}
              className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-sm py-3.5 rounded-xl transition-all cursor-pointer shadow-lg shadow-violet-600/25 flex items-center justify-center gap-2 active:scale-[0.99]"
            >
              {formState === 'submitting' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending…
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Send Message
                </>
              )}
            </button>

            <p className="text-center text-slate-600 text-xs font-semibold">
              By submitting, you agree to our{' '}
              <button type="button" onClick={() => navigateTo('privacy')} className="text-slate-500 hover:text-violet-400 underline underline-offset-2 transition-colors cursor-pointer">
                Privacy Policy
              </button>
              .
            </p>
          </form>
        )}

        {/* Alternative contact row */}
        <div className="p-5 rounded-2xl saas-glass border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-0.5 text-center sm:text-left">
            <p className="text-xs font-bold text-white">Prefer direct email?</p>
            <p className="text-xs text-slate-500 font-semibold">Our editorial team typically replies within 24–48 hours.</p>
          </div>
          <a
            href="mailto:contact@neoaipicks.com"
            className="text-violet-400 hover:text-white font-bold text-xs bg-slate-900/60 border border-white/5 hover:border-violet-500/25 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap"
          >
            contact@neoaipicks.com
          </a>
        </div>
      </div>
    </div>
  );
};

export default Contact;

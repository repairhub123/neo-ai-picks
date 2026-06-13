import React, { useState } from 'react';
import { Mail, Sparkles, Send, CheckCircle } from 'lucide-react';
import SEO from '../components/SEO';

interface ContactProps {
  navigateTo: (tab: string, arg?: string) => void;
}

export const Contact: React.FC<ContactProps> = ({ navigateTo }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: 'General Inquiry', message: '' });
    }
  };

  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Contact Us - Neo AI Picks",
    "description": "Get in touch with the Neo AI Picks team for editorial submissions, advertising, suggestions, or support."
  };

  return (
    <div className="w-full flex-grow bg-[#0b0f19] pb-20 pt-12 px-6">
      <SEO
        title="Contact Us | Neo AI Picks"
        description="Get in touch with the Neo AI Picks team. Submit your tool, suggest improvements, or ask questions."
        path="/contact"
        jsonLd={contactSchema}
      />

      <div className="max-w-3xl mx-auto space-y-8">
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

        {submitted ? (
          <div className="p-8 rounded-3xl saas-glass border border-emerald-500/20 bg-emerald-500/5 text-center space-y-4 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-white">Message Sent Successfully!</h3>
            <p className="text-slate-350 text-sm max-w-md mx-auto font-semibold leading-relaxed">
              Thank you for contacting us. Our editorial and support team will review your message and get back to you within 24–48 hours.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-4 bg-white hover:bg-slate-100 text-slate-950 font-bold text-sm px-6 py-2.5 rounded-xl transition-all cursor-pointer shadow-lg active:scale-95"
            >
              Send Another Message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 md:p-8 rounded-3xl saas-glass border border-white/5 space-y-6 shadow-2xl relative">
            <div className="absolute top-0 right-0 w-48 h-48 bg-violet-600/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="space-y-2">
                <label htmlFor="contact-name" className="text-slate-300 text-xs font-bold uppercase tracking-wider">
                  Your Name
                </label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-900 border border-white/5 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all font-semibold placeholder:text-slate-700"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="contact-email" className="text-slate-300 text-xs font-bold uppercase tracking-wider">
                  Email Address
                </label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-900 border border-white/5 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all font-semibold placeholder:text-slate-700"
                />
              </div>
            </div>

            {/* Subject */}
            <div className="space-y-2">
              <label htmlFor="contact-subject" className="text-slate-300 text-xs font-bold uppercase tracking-wider">
                Subject
              </label>
              <select
                id="contact-subject"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full bg-slate-900 border border-white/5 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all font-semibold"
              >
                <option value="General Inquiry">General Inquiry</option>
                <option value="Tool Submission Help">Tool Submission Help</option>
                <option value="Advertising & Partnerships">Advertising & Partnerships</option>
                <option value="Bug Report or Correction">Bug Report or Correction</option>
              </select>
            </div>

            {/* Message */}
            <div className="space-y-2">
              <label htmlFor="contact-message" className="text-slate-300 text-xs font-bold uppercase tracking-wider">
                Message
              </label>
              <textarea
                id="contact-message"
                required
                rows={5}
                placeholder="Describe your inquiry in detail..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-slate-900 border border-white/5 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all font-semibold placeholder:text-slate-700 resize-none"
              />
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              className="w-full bg-violet-600 hover:bg-violet-500 text-white font-bold text-sm py-3.5 rounded-xl transition-all cursor-pointer shadow-lg shadow-violet-600/25 flex items-center justify-center gap-2 active:scale-[0.99]"
            >
              <Send className="w-4 h-4" />
              Send Message
            </button>
          </form>
        )}

        {/* Alternative contact email card */}
        <div className="p-6 rounded-2xl saas-glass border border-white/5 text-center text-xs font-semibold text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>Prefer direct email? Reach our team at:</p>
          <a
            href="mailto:contact@neoaipicks.com"
            className="text-violet-400 hover:text-white font-bold bg-slate-900/60 border border-white/5 hover:border-violet-500/25 px-4 py-2 rounded-xl transition-all"
          >
            contact@neoaipicks.com
          </a>
        </div>
      </div>
    </div>
  );
};

export default Contact;

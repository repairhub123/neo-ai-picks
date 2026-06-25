import React, { useState, useEffect } from 'react';
import { X, Sparkles, Send, CheckCircle } from 'lucide-react';
import { submitFeatureRequest } from '../utils/firebase';

interface FeatureRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefilledToolName?: string;
  prefilledToolUrl?: string;
}

export const FeatureRequestModal: React.FC<FeatureRequestModalProps> = ({
  isOpen,
  onClose,
  prefilledToolName = '',
  prefilledToolUrl = ''
}) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    companyName: '',
    toolName: '',
    toolUrl: '',
    message: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Sync prefilled data when modal opens
  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        fullName: '',
        email: '',
        companyName: '',
        toolName: prefilledToolName,
        toolUrl: prefilledToolUrl,
        message: ''
      });
      setErrors({});
      setIsSubmitted(false);
    }
  }, [isOpen, prefilledToolName, prefilledToolUrl]);

  if (!isOpen) return null;

  const validate = () => {
    const tempErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) tempErrors.fullName = 'Full Name is required.';
    
    if (!formData.email.trim()) {
      tempErrors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.toolName.trim()) tempErrors.toolName = 'Tool Name is required.';
    
    if (!formData.toolUrl.trim()) {
      tempErrors.toolUrl = 'Tool Website URL is required.';
    } else {
      try {
        new URL(formData.toolUrl);
      } catch {
        tempErrors.toolUrl = 'Please enter a valid URL (including https://).';
      }
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await submitFeatureRequest(formData);
      setIsSubmitted(true);
    } catch (err) {
      console.error('Error submitting feature request:', err);
      setErrors({ global: 'Something went wrong. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-[#0d1222] p-6 shadow-2xl transition-all md:p-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Glow Effects */}
        <div className="absolute -right-20 -top-20 -z-10 h-40 w-40 rounded-full bg-violet-600/20 blur-[60px]" />
        <div className="absolute -left-20 -bottom-20 -z-10 h-40 w-40 rounded-full bg-pink-600/10 blur-[60px]" />

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1.5 text-slate-400 hover:bg-white/5 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {!isSubmitted ? (
          <div className="space-y-6">
            {/* Header */}
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-violet-500/10 px-3 py-1 text-xs font-semibold text-violet-400 border border-violet-500/20">
                <Sparkles className="h-3.5 w-3.5" />
                Featured Spot Request
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Feature Your AI Tool</h2>
              <p className="text-sm text-slate-400">
                Promote your tool to the top of our explorer pages, comparisons, search listings, and categories to boost your visibility and clicks.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {errors.global && (
                <div className="rounded-lg bg-red-500/10 border border-red-500/25 p-3 text-xs text-red-400">
                  {errors.global}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Your Full Name *</label>
                  <input 
                    type="text" 
                    value={formData.fullName}
                    onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full rounded-lg border border-white/5 bg-white/5 px-3 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-violet-500/50 focus:bg-white/10 transition-all"
                    placeholder="John Doe"
                  />
                  {errors.fullName && <p className="text-[10px] text-red-400 font-medium">{errors.fullName}</p>}
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Email Address *</label>
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-lg border border-white/5 bg-white/5 px-3 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-violet-500/50 focus:bg-white/10 transition-all"
                    placeholder="john@example.com"
                  />
                  {errors.email && <p className="text-[10px] text-red-400 font-medium">{errors.email}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Company Name</label>
                  <input 
                    type="text" 
                    value={formData.companyName}
                    onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                    className="w-full rounded-lg border border-white/5 bg-white/5 px-3 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-violet-500/50 focus:bg-white/10 transition-all"
                    placeholder="AI Tech Inc."
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">AI Tool Name *</label>
                  <input 
                    type="text" 
                    value={formData.toolName}
                    onChange={e => setFormData({ ...formData, toolName: e.target.value })}
                    className="w-full rounded-lg border border-white/5 bg-white/5 px-3 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-violet-500/50 focus:bg-white/10 transition-all"
                    placeholder="MySuperAI"
                  />
                  {errors.toolName && <p className="text-[10px] text-red-400 font-medium">{errors.toolName}</p>}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Tool Website URL *</label>
                <input 
                  type="text" 
                  value={formData.toolUrl}
                  onChange={e => setFormData({ ...formData, toolUrl: e.target.value })}
                  className="w-full rounded-lg border border-white/5 bg-white/5 px-3 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-violet-500/50 focus:bg-white/10 transition-all"
                  placeholder="https://mysuperai.com"
                />
                {errors.toolUrl && <p className="text-[10px] text-red-400 font-medium">{errors.toolUrl}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Message / Comments</label>
                <textarea 
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  rows={3}
                  className="w-full rounded-lg border border-white/5 bg-white/5 px-3 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-violet-500/50 focus:bg-white/10 transition-all resize-none"
                  placeholder="Tell us about your product or specific requirements..."
                />
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="mt-2 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-pink-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg hover:from-violet-500 hover:to-pink-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                {isSubmitting ? (
                  <>Submitting...</>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Submit Sponsor Request
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          /* Success Screen */
          <div className="flex flex-col items-center justify-center py-8 text-center space-y-5 animate-in fade-in duration-300">
            <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
              <CheckCircle className="h-8 w-8" />
              <span className="absolute -inset-1 rounded-full border border-emerald-500/10 animate-ping duration-1000" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white">Sponsorship Request Received!</h3>
              <p className="text-sm text-slate-400 max-w-sm">
                Thank you for applying to feature **{formData.toolName}**. Our team will review your application and email you at **{formData.email}** within 24 hours with payment and setup instructions.
              </p>
            </div>

            <button 
              onClick={onClose}
              className="px-6 py-2 rounded-xl bg-white/5 text-sm font-semibold text-white border border-white/10 hover:bg-white/10 transition-colors"
            >
              Close Window
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

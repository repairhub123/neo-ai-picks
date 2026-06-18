import React, { useState } from 'react';
import { Send, Sparkles, CheckCircle2, ShieldCheck, X } from 'lucide-react';
import SEO from '../components/SEO';

interface SubmitToolProps {
  onAddTool: (tool: any) => void;
  navigateTo: (tab: string, arg?: string) => void;
}

export const SubmitTool: React.FC<SubmitToolProps> = ({ onAddTool, navigateTo }) => {
  const [formData, setFormData] = useState({
    name: '',
    websiteUrl: '',
    tagline: '',
    description: '',
    category: 'Writing',
    pricing: 'Free',
    pricingDetails: '',
    feature1: '',
    feature2: '',
    feature3: '',
    tagsString: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccess, setShowSuccess] = useState(false);

  const categories = [
    'Writing',
    'Coding',
    'Image Generation',
    'Video Generation',
    'Productivity',
    'Marketing',
    'Automation'
  ];

  const pricingModels = ['Free', 'Freemium', 'Paid'];

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Tool name is required.';
    
    if (!formData.websiteUrl.trim()) {
      newErrors.websiteUrl = 'Website URL is required.';
    } else {
      try {
        new URL(formData.websiteUrl);
      } catch (e) {
        newErrors.websiteUrl = 'Please enter a valid URL (including https://).';
      }
    }

    if (!formData.tagline.trim()) {
      newErrors.tagline = 'Tagline is required.';
    } else if (formData.tagline.length > 100) {
      newErrors.tagline = 'Tagline must be less than 100 characters.';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Detailed description is required.';
    }

    if (!formData.feature1.trim()) {
      newErrors.feature1 = 'At least one key feature is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      const features = [formData.feature1];
      if (formData.feature2.trim()) features.push(formData.feature2);
      if (formData.feature3.trim()) features.push(formData.feature3);

      const tags = formData.tagsString
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag !== '');

      const newTool = {
        name: formData.name,
        tagline: formData.tagline,
        description: formData.description,
        category: formData.category,
        pricing: formData.pricing,
        pricingDetails: formData.pricingDetails || `${formData.pricing} tier plan.`,
        websiteUrl: formData.websiteUrl,
        features,
        tags: tags.length > 0 ? tags : ['AI', 'Tool'],
        upvotes: 1
      };

      onAddTool(newTool);
      setShowSuccess(true);
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      websiteUrl: '',
      tagline: '',
      description: '',
      category: 'Writing',
      pricing: 'Free',
      pricingDetails: '',
      feature1: '',
      feature2: '',
      feature3: '',
      tagsString: ''
    });
    setErrors({});
    setShowSuccess(false);
  };

  return (
    <div className="w-full flex-grow bg-[#0b0f19] pb-20 pt-8 px-6 relative">
      <SEO
        title="Submit a New AI Tool | Neo AI Picks"
        description="Submit your artificial intelligence product, directory entry, or SaaS project to Neo AI Picks."
        path="/submit"
      />
      
      {/* ORBS */}
      <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-violet-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* HEADER */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full saas-glass border border-white/5 text-xs font-bold text-violet-400 select-none uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Grow Audience
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Submit a New AI Tool
          </h1>
          <p className="text-sm md:text-base text-slate-400 max-w-lg mx-auto leading-relaxed">
            Register your artificial intelligence project. Submissions populate our explorer feed instantly in local state.
          </p>
        </div>

        {/* FORM */}
        <form 
          onSubmit={handleSubmit}
          className="p-6 md:p-8 rounded-2xl saas-glass border border-white/5 space-y-6 shadow-2xl relative"
        >
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/5 pb-2">
              1. General Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="toolName" className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tool Name *</label>
                <input
                  id="toolName"
                  type="text"
                  placeholder="e.g. Chatify AI"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full bg-slate-900 border ${errors.name ? 'border-rose-500' : 'border-white/5'} focus:border-violet-500 rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:ring-1 focus:ring-violet-500 transition-all`}
                />
                {errors.name && <span className="text-xs text-rose-500 font-semibold">{errors.name}</span>}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="websiteUrl" className="text-xs font-bold text-slate-400 uppercase tracking-wider">Website URL *</label>
                <input
                  id="websiteUrl"
                  type="text"
                  placeholder="https://chatify.ai"
                  value={formData.websiteUrl}
                  onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                  className={`w-full bg-slate-900 border ${errors.websiteUrl ? 'border-rose-500' : 'border-white/5'} focus:border-violet-500 rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:ring-1 focus:ring-violet-500 transition-all`}
                />
                {errors.websiteUrl && <span className="text-xs text-rose-500 font-semibold">{errors.websiteUrl}</span>}
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label htmlFor="toolTagline" className="text-xs font-bold text-slate-400 uppercase tracking-wider">Short Tagline *</label>
                <span className={`text-[10px] font-bold ${formData.tagline.length > 100 ? 'text-rose-500' : 'text-slate-600'}`}>
                  {formData.tagline.length}/100 chars
                </span>
              </div>
              <input
                id="toolTagline"
                type="text"
                placeholder="A single line summary of what your tool does"
                maxLength={120}
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className={`w-full bg-slate-900 border ${errors.tagline ? 'border-rose-500' : 'border-white/5'} focus:border-violet-500 rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:ring-1 focus:ring-violet-500 transition-all`}
              />
              {errors.tagline && <span className="text-xs text-rose-500 font-semibold">{errors.tagline}</span>}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="toolDesc" className="text-xs font-bold text-slate-400 uppercase tracking-wider">Detailed Description *</label>
              <textarea
                id="toolDesc"
                placeholder="Write a comprehensive overview outlining what your application offers..."
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className={`w-full bg-slate-900 border ${errors.description ? 'border-rose-500' : 'border-white/5'} focus:border-violet-500 rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:ring-1 focus:ring-violet-500 transition-all resize-y`}
              />
              {errors.description && <span className="text-xs text-rose-500 font-semibold">{errors.description}</span>}
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/5 pb-2">
              2. Classification & Pricing
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="toolCategory" className="text-xs font-bold text-slate-400 uppercase tracking-wider">Category *</label>
                <select
                  id="toolCategory"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-slate-900 border border-white/5 focus:border-violet-500 rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:ring-1 focus:ring-violet-500 transition-all cursor-pointer"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="toolPricing" className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pricing model *</label>
                <select
                  id="toolPricing"
                  value={formData.pricing}
                  onChange={(e) => setFormData({ ...formData, pricing: e.target.value })}
                  className="w-full bg-slate-900 border border-white/5 focus:border-violet-500 rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:ring-1 focus:ring-violet-500 transition-all cursor-pointer"
                >
                  {pricingModels.map((pr) => (
                    <option key={pr} value={pr}>
                      {pr}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="toolPricingDetails" className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pricing details / Plans</label>
              <input
                id="toolPricingDetails"
                type="text"
                placeholder="e.g. Free plan offers 10 runs/mo. Premium plans start at $15/month."
                value={formData.pricingDetails}
                onChange={(e) => setFormData({ ...formData, pricingDetails: e.target.value })}
                className="w-full bg-slate-900 border border-white/5 focus:border-violet-500 rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:ring-1 focus:ring-violet-500 transition-all"
              />
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/5 pb-2">
              3. Features
            </h3>

            <div className="space-y-2">
              <label htmlFor="feature1" className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Key Features (Include at least one) *</label>
              <input
                id="feature1"
                type="text"
                placeholder="Key Feature 1 (Required)"
                value={formData.feature1}
                onChange={(e) => setFormData({ ...formData, feature1: e.target.value })}
                className={`w-full bg-slate-900 border ${errors.feature1 ? 'border-rose-500' : 'border-white/5'} focus:border-violet-500 rounded-xl py-2.5 px-4 text-white text-sm focus:outline-none focus:ring-1 focus:ring-violet-500 transition-all`}
              />
              {errors.feature1 && <span className="text-xs text-rose-500 font-semibold">{errors.feature1}</span>}
              <input
                type="text"
                placeholder="Key Feature 2 (Optional)"
                value={formData.feature2}
                onChange={(e) => setFormData({ ...formData, feature2: e.target.value })}
                className="w-full bg-slate-900 border border-white/5 focus:border-violet-500 rounded-xl py-2.5 px-4 text-white text-sm focus:outline-none focus:ring-1 focus:ring-violet-500 transition-all"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[11px] text-slate-500 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              Listing reviews take approximately 24 hours to go live.
            </p>
            <button
              type="submit"
              className="bg-violet-600 hover:bg-violet-500 text-white font-bold text-sm px-6 py-3.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 active:scale-95 shadow-lg shadow-violet-600/35 w-full sm:w-auto justify-center"
            >
              Submit AI Tool
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>

      </div>

      {/* SUCCESS POPUP */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="max-w-md w-full saas-glass border-white/5 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl relative text-center">
            
            <button 
              onClick={handleReset}
              className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/5 transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mx-auto w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl md:text-2xl font-black text-white">Submitted Successfully!</h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                Thank you! **{formData.name}** has been queued for verification. Submissions immediately populate the explore list in your local memory.
              </p>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={() => {
                  handleReset();
                  navigateTo('home');
                }}
                className="w-full bg-white hover:bg-slate-100 text-slate-950 font-bold text-sm py-3 rounded-xl transition-all cursor-pointer"
              >
                Go Back to Directory
              </button>
              <button
                onClick={handleReset}
                className="w-full bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs py-2 rounded-xl transition-all cursor-pointer"
              >
                Submit Another Tool
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
export default SubmitTool;

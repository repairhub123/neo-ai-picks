import React, { useState } from 'react';
import { Sparkles, Mail, Heart, X } from 'lucide-react';

interface FooterProps {
  navigateTo: (tab: string, arg?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ navigateTo }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [activeModal, setActiveModal] = useState<'about' | 'contact' | null>(null);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="w-full border-t border-white/5 bg-[#0b0f19] mt-auto pt-16 pb-8 px-6 text-slate-400 relative">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
        {/* BRAND */}
        <div className="space-y-4">
          <div onClick={() => navigateTo('home')} className="flex items-center gap-2 cursor-pointer group w-fit">
            <div className="p-2 rounded-xl bg-violet-600/10 border border-violet-500/20">
              <Sparkles className="w-5 h-5 text-violet-400" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-white">
              Neo<span className="text-violet-400">AI</span>Picks
            </span>
          </div>
          <p className="text-sm leading-relaxed max-w-xs text-slate-400 font-medium">
            A curated directory profiling the best verified artificial intelligence tools, comparison metrics, and tutorials.
          </p>
        </div>

        {/* DIRECTORY LINKS */}
        <div>
          <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Directory</h3>
          <ul className="space-y-2.5 text-sm font-semibold">
            <li>
              <button onClick={() => navigateTo('blog')} className="hover:text-white transition-colors cursor-pointer text-left">
                Blog
              </button>
            </li>
            <li>
              <button onClick={() => navigateTo('compare')} className="hover:text-white transition-colors cursor-pointer text-left">
                Comparisons
              </button>
            </li>
            <li>
              <button onClick={() => navigateTo('submit')} className="hover:text-white transition-colors cursor-pointer text-left">
                Submit Tool
              </button>
            </li>
          </ul>
        </div>

        {/* COMPANY LINKS */}
        <div>
          <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Company</h3>
          <ul className="space-y-2.5 text-sm font-semibold">
            <li>
              <button onClick={() => setActiveModal('about')} className="hover:text-white transition-colors cursor-pointer text-left">
                About
              </button>
            </li>
            <li>
              <button onClick={() => navigateTo('contact')} className="hover:text-white transition-colors cursor-pointer text-left">
                Contact
              </button>
            </li>
            <li>
              <button onClick={() => navigateTo('privacy')} className="hover:text-white transition-colors cursor-pointer text-left">
                Privacy Policy
              </button>
            </li>
            <li>
              <button onClick={() => navigateTo('terms')} className="hover:text-white transition-colors cursor-pointer text-left">
                Terms of Service
              </button>
            </li>
          </ul>
        </div>

        {/* NEWSLETTER */}
        <div className="space-y-4">
          <h3 className="font-semibold text-white text-sm uppercase tracking-wider">Newsletter</h3>
          <p className="text-sm leading-relaxed text-slate-400 font-medium">
            Get weekly reports profiling new tool launches and comparison logs.
          </p>
          <form onSubmit={handleSubscribe} className="flex flex-col gap-2 sm:flex-row md:flex-col lg:flex-row">
            <div className="relative flex-grow">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="email"
                required
                placeholder="news@neoaipicks.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900 border border-white/5 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all placeholder:text-slate-600 font-semibold"
              />
            </div>
            <button type="submit" className="bg-violet-600 hover:bg-violet-500 text-white font-bold text-sm px-4 py-2 rounded-xl transition-all cursor-pointer">
              Join
            </button>
          </form>
          {subscribed && <p className="text-xs text-emerald-400 font-bold">🎉 Subscribed successfully!</p>}
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-semibold">
        <p>© {new Date().getFullYear()} Neo AI Picks. All rights reserved.</p>
        <p className="flex items-center gap-1">
          Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for AI builders.
        </p>
      </div>

      {/* ABOUT MODAL */}
      {activeModal === 'about' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="max-w-md w-full saas-glass border border-white/5 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl relative text-left">
            <button 
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="space-y-3">
              <div className="w-12 h-12 bg-violet-500/10 border border-violet-500/20 text-violet-400 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-white">About Neo AI Picks</h3>
              <p className="text-slate-300 text-sm leading-relaxed font-medium">
                Neo AI Picks is a professional, developer-vetted directory profiling the best generative artificial intelligence tools. We outline honest benchmarks, side-by-side comparison matrices, and practical tutorials to help you select the best tools for your workflows in 2026.
              </p>
            </div>
            <button
              onClick={() => setActiveModal(null)}
              className="w-full bg-white hover:bg-slate-100 text-slate-950 font-bold text-sm py-3 rounded-xl transition-all cursor-pointer shadow-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* CONTACT MODAL */}
      {activeModal === 'contact' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="max-w-md w-full saas-glass border border-white/5 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl relative text-left">
            <button 
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="space-y-3">
              <div className="w-12 h-12 bg-violet-500/10 border border-violet-500/20 text-violet-400 rounded-xl flex items-center justify-center">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-white">Contact Us</h3>
              <p className="text-slate-300 text-sm leading-relaxed font-medium">
                Have suggestions, corrections, or want to list your AI tool on our vetted directory? Get in touch with our support and editorial team:
              </p>
              <div className="bg-slate-900 border border-white/5 p-4 rounded-xl space-y-1 text-sm font-semibold">
                <div className="text-slate-400">Editorial & Submissions:</div>
                <div className="text-white font-bold select-all">contact@neoaipicks.com</div>
              </div>
            </div>
            <button
              onClick={() => setActiveModal(null)}
              className="w-full bg-white hover:bg-slate-100 text-slate-950 font-bold text-sm py-3 rounded-xl transition-all cursor-pointer shadow-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;

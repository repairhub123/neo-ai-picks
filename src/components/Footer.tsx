import React, { useState } from 'react';
import { Sparkles, Mail, Heart } from 'lucide-react';

interface FooterProps {
  navigateTo: (tab: string, arg?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ navigateTo }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="w-full border-t border-white/5 bg-[#0b0f19] mt-auto pt-16 pb-8 px-6 text-slate-400">
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
          <p className="text-sm leading-relaxed max-w-xs text-slate-400">
            A curated directory profiling the best verified artificial intelligence tools, comparison metrics, and tutorials.
          </p>
          <div className="flex gap-4">
            <a href="#" aria-label="Twitter" className="p-2 rounded-lg bg-slate-900 border border-white/5 hover:border-violet-500 hover:text-white transition-all flex items-center justify-center">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a href="#" aria-label="Github" className="p-2 rounded-lg bg-slate-900 border border-white/5 hover:border-violet-500 hover:text-white transition-all flex items-center justify-center">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
            </a>
          </div>
        </div>

        {/* EXPLORE */}
        <div>
          <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Directory</h3>
          <ul className="space-y-2.5 text-sm">
            <li><button onClick={() => navigateTo('home')} className="hover:text-white transition-colors">Browse Tools</button></li>
            <li><button onClick={() => navigateTo('compare')} className="hover:text-white transition-colors">Compare Platforms</button></li>
            <li><button onClick={() => navigateTo('blog')} className="hover:text-white transition-colors">AI Research Blog</button></li>
          </ul>
        </div>

        {/* TOP CATEGORIES */}
        <div>
          <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Top Tiers</h3>
          <ul className="space-y-2.5 text-sm">
            <li><button onClick={() => navigateTo('home')} className="hover:text-white transition-colors">Coding Agents</button></li>
            <li><button onClick={() => navigateTo('home')} className="hover:text-white transition-colors">Automation Engines</button></li>
            <li><button onClick={() => navigateTo('home')} className="hover:text-white transition-colors">Image Synthesizers</button></li>
          </ul>
        </div>

        {/* NEWSLETTER */}
        <div className="space-y-4">
          <h3 className="font-semibold text-white text-sm uppercase tracking-wider">Newsletter</h3>
          <p className="text-sm leading-relaxed text-slate-400">
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
                className="w-full bg-slate-900 border border-white/5 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all placeholder:text-slate-600"
              />
            </div>
            <button type="submit" className="bg-violet-600 hover:bg-violet-500 text-white font-bold text-sm px-4 py-2 rounded-xl transition-all cursor-pointer">
              Join
            </button>
          </form>
          {subscribed && <p className="text-xs text-emerald-400">🎉 Subscribed successfully!</p>}
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <p>© {new Date().getFullYear()} Neo AI Picks. All rights reserved.</p>
        <p className="flex items-center gap-1">
          Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for AI builders.
        </p>
      </div>
    </footer>
  );
};
export default Footer;

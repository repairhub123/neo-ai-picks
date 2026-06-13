import React from 'react';
import { AlertCircle, ArrowLeft, Sparkles } from 'lucide-react';
import SEO from '../components/SEO';

interface NotFoundProps {
  navigateTo: (tab: string, arg?: string) => void;
}

export const NotFound: React.FC<NotFoundProps> = ({ navigateTo }) => {
  return (
    <div className="w-full flex-grow bg-[#0b0f19] flex items-center justify-center py-20 px-6 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-650/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-650/10 rounded-full blur-3xl pointer-events-none" />

      <SEO
        title="450 - Page Not Found | Neo AI Picks"
        description="The requested page could not be found on Neo AI Picks. Explore our directory of 50+ vetted AI tools."
        path="/404"
      />

      <div className="max-w-md w-full saas-glass border border-white/5 rounded-3xl p-8 text-center space-y-6 shadow-2xl relative">
        <div className="w-16 h-16 bg-violet-500/10 border border-violet-500/20 text-violet-400 rounded-2xl flex items-center justify-center mx-auto animate-pulse">
          <AlertCircle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-black text-white tracking-tight">404</h1>
          <h2 className="text-xl font-bold text-white">Page Not Found</h2>
          <p className="text-slate-400 text-sm font-semibold leading-relaxed">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
        </div>

        <div className="flex flex-col gap-3 pt-2">
          <button
            onClick={() => navigateTo('home')}
            className="w-full bg-violet-600 hover:bg-violet-500 text-white font-bold text-sm py-3 rounded-xl transition-all cursor-pointer shadow-lg shadow-violet-600/25 flex items-center justify-center gap-2 active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            Explore Vetted Tools
          </button>
          <button
            onClick={() => window.history.back()}
            className="w-full bg-slate-900 hover:bg-slate-800 border border-white/5 hover:border-violet-500/25 text-slate-350 font-bold text-sm py-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

import React from 'react';
import { ShieldCheck, Sparkles, Heart, Award, CheckCircle2, ArrowRight } from 'lucide-react';
import SEO from '../components/SEO';

interface AboutProps {
  navigateTo: (tab: string, arg?: string) => void;
}

export const About: React.FC<AboutProps> = ({ navigateTo }) => {
  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://neo-ai-picks.vercel.app';
  
  const aboutSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "About Us - Neo AI Picks",
    "description": "Understand our editorial standards, AI benchmarking processes, and team values.",
    "url": `${siteUrl}/about`
  };

  const values = [
    {
      icon: ShieldCheck,
      title: "Vetted Listings Only",
      desc: "Every AI tool in our directory undergoes rigorous review. We verify features, pricing models, and test limits to filter out low-value software."
    },
    {
      icon: Award,
      title: "Objective Benchmarking",
      desc: "Our side-by-side comparison tables are built on direct product testing, comparing response speeds, outputs quality, and API access tiers."
    },
    {
      icon: Sparkles,
      title: "Builder-First Curation",
      desc: "Created for software builders, copywriters, marketers, and startup founders. We focus on real utility rather than marketing hype."
    }
  ];

  return (
    <div className="w-full flex-grow bg-[#0b0f19] pb-20 pt-12 px-6 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-violet-600/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-pink-600/5 rounded-full blur-[100px] pointer-events-none" />

      <SEO
        title="About Our Mission & Editorial Standards | Neo AI Picks"
        description="Learn about Neo AI Picks. Discover our criteria for rating AI tools, our side-by-side benchmarking methodology, and our commitment to objective software evaluations."
        path="/about"
        jsonLd={aboutSchema}
      />

      <div className="max-w-4xl mx-auto space-y-12 relative z-10">
        {/* HEADER SECTION */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-xs font-bold text-violet-400 select-none uppercase tracking-wider">
            <Heart className="w-3.5 h-3.5" />
            Our Mission
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
            About <span className="text-violet-400">Neo AI Picks</span>
          </h1>
          <p className="text-slate-400 text-sm md:text-base max-w-xl mx-auto font-semibold leading-relaxed">
            Eliminating the noise in the artificial intelligence landscape. We audit, compare, and rank AI products so you can deploy the best tools for your stack.
          </p>
        </div>

        {/* DETAILS SECTION */}
        <div className="p-6 md:p-8 rounded-3xl saas-glass border border-white/5 space-y-6">
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">Who We Are</h2>
          <p className="text-slate-350 text-sm md:text-base leading-relaxed font-semibold">
            Neo AI Picks is an independent technology catalog profiling state-of-the-art generative artificial intelligence models and products. Since our founding in 2026, we have cataloged writing platforms, coding assistants, media generators, automation nodes, and workflow optimizers.
          </p>
          <p className="text-slate-350 text-sm md:text-base leading-relaxed font-semibold">
            Unlike directories that accept automatic listings for a fee, Neo AI Picks relies on an editorial review board. We test each submission, compile independent pros and cons, and compare competitor alternatives to offer high-fidelity search listings.
          </p>
        </div>

        {/* CORE VALUES */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {values.map((val, idx) => {
            const Icon = val.icon;
            return (
              <div key={idx} className="p-5 rounded-2xl bg-slate-900/40 border border-white/5 space-y-3 hover:border-violet-500/20 transition-all duration-300">
                <div className="w-10 h-10 rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-base">{val.title}</h3>
                <p className="text-slate-400 text-xs leading-relaxed font-semibold">{val.desc}</p>
              </div>
            );
          })}
        </div>

        {/* EDITORIAL STANDARDS CARD */}
        <div className="p-6 md:p-8 rounded-3xl border border-violet-500/20 bg-gradient-to-r from-violet-950/20 to-pink-950/10 space-y-6">
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-violet-400" />
            Our Editorial Review Criteria
          </h2>
          <p className="text-slate-300 text-sm md:text-base font-semibold leading-relaxed">
            Every software product reviewed on Neo AI Picks is benchmarked against 4 key variables:
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold text-slate-300">
            <div className="flex items-center gap-2 bg-slate-950/40 border border-white/5 p-3.5 rounded-xl">
              <span className="text-violet-400 text-base">1.</span>
              <span>Feature Integrity (No Vaporware)</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-950/40 border border-white/5 p-3.5 rounded-xl">
              <span className="text-violet-400 text-base">2.</span>
              <span>Pricing Transparency & API Costs</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-950/40 border border-white/5 p-3.5 rounded-xl">
              <span className="text-violet-400 text-base">3.</span>
              <span>Security & Local-Offline Alternatives</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-950/40 border border-white/5 p-3.5 rounded-xl">
              <span className="text-violet-400 text-base">4.</span>
              <span>Active Community Updates & Support</span>
            </div>
          </div>
        </div>

        {/* CALL TO ACTION */}
        <div className="text-center pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => navigateTo('home')}
            className="w-full sm:w-auto bg-violet-600 hover:bg-violet-500 text-white font-bold text-sm px-6 py-3 rounded-xl transition-all cursor-pointer shadow-lg shadow-violet-600/25 flex items-center justify-center gap-2 active:scale-95"
          >
            Explore Directory
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigateTo('submit')}
            className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 border border-white/5 hover:border-violet-500/20 text-slate-300 font-bold text-sm px-6 py-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
          >
            Submit a New Tool
          </button>
        </div>
      </div>
    </div>
  );
};

export default About;

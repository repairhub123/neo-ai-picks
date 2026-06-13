import React from 'react';
import { comparisonPairs } from '../data/comparisons';
import { ArrowRight, Sparkles, Activity } from 'lucide-react';
import SEO from '../components/SEO';

interface CompareFeedProps {
  navigateTo: (tab: string, arg?: string) => void;
}

export const CompareFeed: React.FC<CompareFeedProps> = ({ navigateTo }) => {
  // Structured Data: WebPage / Directory Schema
  const directorySchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Compare AI Tools - Neo AI Picks",
    "description": "Side-by-side comparison matrices of the top generative writing, coding, and image AI tools.",
    "url": "https://neoaipicks.com/compare"
  };

  return (
    <div className="w-full flex-grow bg-[#0b0f19] pb-20 pt-8 px-6 relative">
      <SEO
        title="Compare AI Tools Side-by-Side | Neo AI Picks"
        description="Explore 50 popular side-by-side AI comparisons. Compare features, pricing, pros & cons, and ratings between ChatGPT, Claude, Cursor, Midjourney, HeyGen, and others."
        path="/compare"
        jsonLd={directorySchema}
      />

      {/* BACKGROUND ORB */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-violet-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-12">
        {/* HEADER */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full saas-glass border border-white/5 text-xs font-bold text-violet-400 select-none uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Product Benchmarks
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
            AI Tool Comparison Directory
          </h1>
          <p className="text-sm md:text-base text-slate-400 max-w-lg mx-auto leading-relaxed">
            Eliminate the guesswork. Contrast specifications, pricing tiers, pros & cons, and verified features side-by-side.
          </p>
        </div>

        {/* FEED GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          {comparisonPairs.map((pair) => (
            <div
              key={pair.id}
              onClick={() => navigateTo(`compare/${pair.id}`)}
              className="group p-6 rounded-2xl saas-glass saas-card-hover cursor-pointer flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-violet-400 bg-violet-500/10 border border-violet-500/25 px-2.5 py-1 rounded-lg">
                    {pair.category}
                  </span>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1">
                    <Activity className="w-3 h-3" />
                    Comparison Matrix
                  </span>
                </div>
                <h3 className="font-extrabold text-white text-lg group-hover:text-violet-400 transition-colors leading-tight">
                  {pair.title}
                </h3>
                <p className="text-slate-400 text-xs leading-relaxed font-semibold">
                  {pair.excerpt}
                </p>
              </div>

              <div className="flex items-center justify-end text-xs text-violet-400 font-bold group-hover:translate-x-1 transition-transform pt-2 border-t border-white/5">
                Open Matrix
                <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default CompareFeed;

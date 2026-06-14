import React, { useState, useEffect, useRef } from 'react';
import { comparisonPairs } from '../data/comparisons';
import { ArrowRight, Sparkles, Activity, ArrowLeftRight } from 'lucide-react';
import SEO from '../components/SEO';
import type { AITool } from '../components/ToolCard';

interface CompareFeedProps {
  tools: AITool[];
  navigateTo: (tab: string, arg?: string) => void;
}

export const CompareFeed: React.FC<CompareFeedProps> = ({ tools = [], navigateTo }) => {
  const [selectedToolA, setSelectedToolA] = useState<AITool | null>(null);
  const [selectedToolB, setSelectedToolB] = useState<AITool | null>(null);
  const [searchQueryA, setSearchQueryA] = useState('');
  const [searchQueryB, setSearchQueryB] = useState('');
  const [showDropdownA, setShowDropdownA] = useState(false);
  const [showDropdownB, setShowDropdownB] = useState(false);

  const dropdownRefA = useRef<HTMLDivElement>(null);
  const dropdownRefB = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRefA.current && !dropdownRefA.current.contains(event.target as Node)) {
        setShowDropdownA(false);
      }
      if (dropdownRefB.current && !dropdownRefB.current.contains(event.target as Node)) {
        setShowDropdownB(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const filteredToolsA = tools.filter((t) => {
    const query = searchQueryA.toLowerCase().trim();
    const isSelectedInB = selectedToolB && t.id === selectedToolB.id;
    return !isSelectedInB && (query === '' || t.name.toLowerCase().includes(query) || t.category.toLowerCase().includes(query));
  });

  const filteredToolsB = tools.filter((t) => {
    const query = searchQueryB.toLowerCase().trim();
    const isSelectedInA = selectedToolA && t.id === selectedToolA.id;
    return !isSelectedInA && (query === '' || t.name.toLowerCase().includes(query) || t.category.toLowerCase().includes(query));
  });

  const handleSwap = () => {
    const tempTool = selectedToolA;
    setSelectedToolA(selectedToolB);
    setSearchQueryA(selectedToolB ? selectedToolB.name : '');
    setSelectedToolB(tempTool);
    setSearchQueryB(tempTool ? tempTool.name : '');
  };

  const handleCompare = () => {
    if (!selectedToolA || !selectedToolB) return;
    const idA = selectedToolA.id;
    const idB = selectedToolB.id;

    // Check if predefined comparison exists: either idA-vs-idB or idB-vs-idA
    const existingPair = comparisonPairs.find(
      (p) => (p.toolAId === idA && p.toolBId === idB) || (p.toolAId === idB && p.toolBId === idA)
    );

    if (existingPair) {
      navigateTo(`compare/${existingPair.id}`);
    } else {
      navigateTo(`compare/${idA}-vs-${idB}`);
    }
  };

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

        {/* COMPARE BUILDER */}
        <div className="bg-slate-900/60 border border-white/10 hover:border-violet-500/20 rounded-2xl p-6 space-y-5 max-w-4xl mx-auto z-40 relative shadow-2xl shadow-violet-500/5 transition-all">
          {/* Subtle background glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 to-pink-600/5 rounded-2xl blur-md -z-10 pointer-events-none" />

          <h2 className="text-xl font-extrabold text-white text-center tracking-tight">
            Compare Tools Dynamically
          </h2>

          <div className="flex flex-col md:flex-row items-center gap-4 justify-between">
            {/* Tool A Searchable Dropdown */}
            <div ref={dropdownRefA} className="relative w-full md:w-5/12 group">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-purple-500/10 rounded-xl blur-sm opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
              <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Select Tool A</label>
              <input
                type="text"
                placeholder="Search first tool..."
                value={searchQueryA}
                onFocus={() => setShowDropdownA(true)}
                onChange={(e) => {
                  setSearchQueryA(e.target.value);
                  setSelectedToolA(null);
                  setShowDropdownA(true);
                }}
                className="w-full bg-slate-900/90 hover:bg-slate-900 border border-white/10 focus:border-violet-500 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-violet-500 text-sm shadow-xl transition-all"
              />
              {showDropdownA && (
                <div className="absolute top-full left-0 right-0 mt-1.5 z-50 saas-glass bg-[#0b0f19]/90 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl max-h-60 overflow-y-auto scroll-smooth custom-scrollbar divide-y divide-white/5">
                  {filteredToolsA.length > 0 ? (
                    filteredToolsA.map((tool) => (
                      <div
                        key={tool.id}
                        onClick={() => {
                          setSelectedToolA(tool);
                          setSearchQueryA(tool.name);
                          setShowDropdownA(false);
                        }}
                        className="px-4 py-2.5 hover:bg-white/5 cursor-pointer text-slate-350 hover:text-white text-sm flex justify-between font-semibold"
                      >
                        <span>{tool.name}</span>
                        <span className="text-[10px] text-slate-500">{tool.category}</span>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-slate-500 text-xs text-center font-bold">No tools found</div>
                  )}
                </div>
              )}
            </div>

            {/* VS / Swap Indicator */}
            <div className="flex flex-col items-center justify-center gap-1.5 flex-shrink-0 my-2 md:my-0">
              <span className="text-[11px] font-black tracking-widest text-transparent bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text select-none uppercase">
                VS
              </span>
              <button
                onClick={handleSwap}
                type="button"
                className="p-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-white/10 hover:border-violet-500/30 transition-all cursor-pointer shadow-lg active:scale-95 flex-shrink-0"
                title="Swap tools"
              >
                <ArrowLeftRight className="w-4 h-4 text-violet-450" />
              </button>
            </div>

            {/* Tool B Searchable Dropdown */}
            <div ref={dropdownRefB} className="relative w-full md:w-5/12 group">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-purple-500/10 rounded-xl blur-sm opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
              <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Select Tool B</label>
              <input
                type="text"
                placeholder="Search second tool..."
                value={searchQueryB}
                onFocus={() => setShowDropdownB(true)}
                onChange={(e) => {
                  setSearchQueryB(e.target.value);
                  setSelectedToolB(null);
                  setShowDropdownB(true);
                }}
                className="w-full bg-slate-900/90 hover:bg-slate-900 border border-white/10 focus:border-violet-500 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-violet-500 text-sm shadow-xl transition-all"
              />
              {showDropdownB && (
                <div className="absolute top-full left-0 right-0 mt-1.5 z-50 saas-glass bg-[#0b0f19]/90 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl max-h-60 overflow-y-auto scroll-smooth custom-scrollbar divide-y divide-white/5">
                  {filteredToolsB.length > 0 ? (
                    filteredToolsB.map((tool) => (
                      <div
                        key={tool.id}
                        onClick={() => {
                          setSelectedToolB(tool);
                          setSearchQueryB(tool.name);
                          setShowDropdownB(false);
                        }}
                        className="px-4 py-2.5 hover:bg-white/5 cursor-pointer text-slate-350 hover:text-white text-sm flex justify-between font-semibold"
                      >
                        <span>{tool.name}</span>
                        <span className="text-[10px] text-slate-500">{tool.category}</span>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-slate-500 text-xs text-center font-bold">No tools found</div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Compare Button */}
          <div className="flex justify-center pt-2">
            <button
              onClick={handleCompare}
              disabled={!selectedToolA || !selectedToolB}
              className={`px-8 py-3.5 rounded-xl font-black text-sm transition-all cursor-pointer ${
                selectedToolA && selectedToolB
                  ? 'bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 hover:from-violet-500 hover:via-purple-500 hover:to-pink-500 text-white shadow-lg shadow-violet-500/25 active:scale-95'
                  : 'bg-slate-800/80 text-slate-500 border border-white/5 cursor-not-allowed'
              }`}
            >
              Compare Now
            </button>
          </div>

          {/* Popular Comparison Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4 border-t border-white/5 text-xs">
            <span className="text-slate-500 font-bold mr-1 uppercase tracking-wider text-[10px]">Popular:</span>
            {[
              { id: 'chatgpt-vs-claude', label: 'ChatGPT vs Claude' },
              { id: 'perplexity-vs-chatgpt', label: 'Perplexity vs ChatGPT' },
              { id: 'cursor-vs-windsurf', label: 'Cursor vs Windsurf' },
              { id: 'midjourney-vs-flux', label: 'Midjourney vs Flux' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => navigateTo(`compare/${item.id}`)}
                className="px-3.5 py-1.5 rounded-full bg-slate-950/60 border border-white/5 hover:border-violet-500/30 text-slate-400 hover:text-white hover:bg-slate-950 transition-all cursor-pointer text-[11px] font-bold"
              >
                {item.label}
              </button>
            ))}
          </div>
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

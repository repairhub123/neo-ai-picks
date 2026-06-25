import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Activity, Search, X, Star, ArrowRight, ShieldCheck, Zap, Layers } from 'lucide-react';
import { ToolCard } from '../components/ToolCard';
import type { AITool } from '../components/ToolCard';
import { ToolIcon } from '../components/ToolIcon';
import SEO from '../components/SEO';

interface HomeProps {
  tools: AITool[];
  upvotesState: Record<string, number>;
  upvotedTools: Set<string>;
  onUpvote: (toolId: string) => void;
  navigateTo: (tab: string, arg?: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  onOpenFeatureModal: () => void;
}

type SortOption = 'popular' | 'newest' | 'alphabetical';

export const Home: React.FC<HomeProps> = ({
  tools,
  upvotesState,
  upvotedTools,
  onUpvote,
  navigateTo,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  onOpenFeatureModal
}) => {
  const [sortBy, setSortBy] = useState<SortOption>('popular');
  const [showDropdown, setShowDropdown] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const directoryRef = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Click outside search container closes the dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  // Helper to escape regex chars
  const escapeRegExp = (str: string) => {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };

  // Helper function to highlight matching search term
  const highlightMatch = (text: string, highlight: string) => {
    if (!highlight.trim()) return <span>{text}</span>;
    const escapedHighlight = escapeRegExp(highlight.trim());
    const parts = text.split(new RegExp(`(${escapedHighlight})`, 'gi'));
    return (
      <>
        {parts.map((part, idx) =>
          part.toLowerCase() === highlight.trim().toLowerCase() ? (
            <span key={idx} className="text-violet-400 font-extrabold">
              {part}
            </span>
          ) : (
            part
          )
        )}
      </>
    );
  };

  const categories = [
    'All Tools',
    'Writing',
    'Coding',
    'Image Generation',
    'Video Generation',
    'Productivity',
    'Marketing',
    'Automation'
  ];

  // Map requested Category names to database equivalents
  const topCategories = [
    { label: 'Writing AI', value: 'Writing' },
    { label: 'Coding AI', value: 'Coding' },
    { label: 'Image Generation', value: 'Image Generation' },
    { label: 'Video Generation', value: 'Video Generation' },
    { label: 'Productivity', value: 'Productivity' },
    { label: 'Marketing', value: 'Marketing' },
    { label: 'Automation', value: 'Automation' }
  ];

  // Filtering
  const filteredTools = tools.filter((tool) => {
    const query = searchQuery.toLowerCase().trim();
    
    // Ignore category filter if there is an active search query to ensure global search
    const categoryMatch =
      query !== '' || selectedCategory === 'All Tools' || tool.category === selectedCategory;

    // Stricter matching for short queries to avoid matching every tool via descriptions/features
    const searchMatch =
      query === '' ||
      tool.name.toLowerCase().includes(query) ||
      (tool.tags && tool.tags.some((tag) => tag.toLowerCase().includes(query))) ||
      (query.length > 2 && (
        tool.category.toLowerCase().includes(query) ||
        tool.tagline.toLowerCase().includes(query) ||
        tool.description.toLowerCase().includes(query) ||
        tool.features.some((feat) => feat.toLowerCase().includes(query))
      ));

    return categoryMatch && searchMatch;
  });

  // Sorting
  const sortedTools = [...filteredTools].sort((a, b) => {
    const query = searchQuery.toLowerCase().trim();
    if (query !== '') {
      const aStarts = a.name.toLowerCase().startsWith(query);
      const bStarts = b.name.toLowerCase().startsWith(query);
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
    }

    const ratingA = a.rating || 4.5;
    const ratingB = b.rating || 4.5;

    if (sortBy === 'popular') {
      return ratingB - ratingA;
    } else if (sortBy === 'newest') {
      return b.id.localeCompare(a.id);
    } else {
      return a.name.localeCompare(b.name);
    }
  });

  // Autocomplete matches
  const dropdownMatches = searchQuery.trim() !== '' ? sortedTools.slice(0, 8) : [];

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (dropdownMatches.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIndex((prev) => (prev < dropdownMatches.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIndex((prev) => (prev > 0 ? prev - 1 : dropdownMatches.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (focusedIndex >= 0 && focusedIndex < dropdownMatches.length) {
        const selectedTool = dropdownMatches[focusedIndex];
        navigateTo(`tool/${selectedTool.id}`);
        setShowDropdown(false);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setShowDropdown(false);
      e.currentTarget.blur();
    }
  };

  // Featured Tools
  const featuredTools = tools.filter((t) => t.isFeatured).slice(0, 4);

  // Popular Tools (Editor's Picks)
  const popularTools = tools.filter((t) => t.isEditorsPick).slice(0, 4);

  // Popular Comparisons List
  const popularComparisons = [
    { id: 'chatgpt-vs-claude', label: 'ChatGPT vs Claude', category: 'Writing' },
    { id: 'claude-vs-gemini', label: 'Claude vs Gemini', category: 'Writing' },
    { id: 'cursor-vs-windsurf', label: 'Cursor vs Windsurf', category: 'Coding' },
    { id: 'midjourney-vs-flux', label: 'Midjourney vs Flux', category: 'Image Generation' },
    { id: 'perplexity-vs-chatgpt', label: 'Perplexity vs ChatGPT', category: 'Productivity' }
  ];

  const scrollToDirectory = () => {
    directoryRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://neo-ai-picks.vercel.app';

  // Structured Data Schema
  const websiteSchema = {
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    "url": `${siteUrl}/`,
    "name": "Neo AI Picks",
    "description": "Discover, compare and review the best AI tools for writing, coding, design, video creation, automation and productivity.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${siteUrl}/?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };

  const organizationSchema = {
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    "name": "Neo AI Picks",
    "url": `${siteUrl}/`,
    "logo": `${siteUrl}/favicon.svg`,
    "sameAs": []
  };
  const graphSchemas: Record<string, unknown>[] = [websiteSchema, organizationSchema];

  if (selectedCategory !== 'All Tools') {
    const categoryName = selectedCategory;
    const categorySlug = categoryName.toLowerCase().replace(/\s+/g, '-');
    graphSchemas.push({
      "@type": "CollectionPage",
      "@id": `${siteUrl}/#collection-${categorySlug}`,
      "name": `${categoryName} AI Tools | Neo AI Picks`,
      "description": `Compare and discover the best vetted AI software and tools for ${categoryName}.`,
      "url": `${siteUrl}/?category=${categorySlug}`,
      "mainEntity": {
        "@type": "ItemList",
        "itemListElement": sortedTools.slice(0, 10).map((t, idx) => ({
          "@type": "ListItem",
          "position": idx + 1,
          "url": `${siteUrl}/tool/${t.id}`
        }))
      }
    });
  }

  const combinedSchema = {
    "@context": "https://schema.org",
    "@graph": graphSchemas
  };

  return (
    <div className="w-full flex-grow flex flex-col bg-[#0b0f19]">
      <SEO
        title={selectedCategory === 'All Tools' ? "Neo AI Picks - Find, Compare & Explore AI Tools" : `${selectedCategory} AI Tools: Best Reviewed in 2026 | Neo AI Picks`}
        description={selectedCategory === 'All Tools' ? "Discover, compare and review the best AI tools for writing, coding, design, video creation, automation and productivity." : `Explore the top rated and reviewed AI tools for ${selectedCategory}. Check out features, pricing tiers, pros, and cons.`}
        path={selectedCategory === 'All Tools' ? "/" : `/?category=${selectedCategory.toLowerCase().replace(/\s+/g, '-')}`}
        jsonLd={combinedSchema}
      />

      {/* HERO SECTION */}
      <div className="relative w-full py-16 md:py-24 px-6 text-center overflow-hidden">
        {/* LIGHT ORBS */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] md:w-[600px] h-[350px] md:h-[600px] rounded-full bg-violet-600/10 blur-[100px] md:blur-[180px] -z-10 pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[250px] h-[250px] rounded-full bg-pink-500/5 blur-[80px] -z-10 pointer-events-none" />

        <div className="max-w-4xl mx-auto space-y-6 md:space-y-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full saas-glass border border-white/5 text-[11px] font-bold text-violet-300 tracking-wide uppercase select-none">
            <Sparkles className="w-3.5 h-3.5" />
            Vetted AI Software Directory
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.12] text-white">
            Discover the Best <br />
            <span className="gradient-text-purple">AI Tools in Minutes</span>
          </h1>

          <p className="text-base md:text-xl text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
            Compare, explore, and find the perfect AI tool for writing, coding, image generation, video creation, productivity, and automation.
          </p>

          {/* SEARCH BAR */}
          <div ref={searchContainerRef} className="max-w-2xl mx-auto relative z-50 group mt-6">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-purple-500 rounded-2xl blur-md opacity-25 group-focus-within:opacity-40 transition-all duration-300 pointer-events-none" />
            <div className="relative flex items-center">
              <Search className="absolute left-4.5 w-5 h-5 text-slate-500 group-focus-within:text-violet-400 transition-colors pointer-events-none" />
              <input
                type="text"
                placeholder="Search tools by name, category, features..."
                value={searchQuery}
                onFocus={() => setShowDropdown(true)}
                onKeyDown={handleKeyDown}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSelectedCategory('All Tools');
                  setShowDropdown(true);
                  setFocusedIndex(-1);
                }}
                className="w-full bg-slate-900/90 hover:bg-slate-900 border border-white/10 group-focus-within:border-violet-500 rounded-2xl py-4.5 pl-13 pr-12 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-violet-500 text-base shadow-2xl transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setFocusedIndex(-1);
                  }}
                  className="absolute right-4.5 p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Autocomplete Dropdown */}
            {showDropdown && searchQuery.trim() !== '' && (
              <div className="absolute top-full left-0 right-0 mt-2.5 z-50 saas-glass border border-white/10 bg-[#0b0f19]/80 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden flex flex-col p-2 max-h-[380px] overflow-y-auto scroll-smooth custom-scrollbar animate-fade-in animate-slide-down">
                {dropdownMatches.length > 0 ? (
                  dropdownMatches.map((tool, idx) => {
                    const isHighlighted = idx === focusedIndex;
                    return (
                      <div
                        key={tool.id}
                        onClick={() => {
                          navigateTo(`tool/${tool.id}`);
                          setShowDropdown(false);
                        }}
                        onMouseEnter={() => setFocusedIndex(idx)}
                        className={`flex items-center justify-between gap-3.5 p-3 rounded-xl cursor-pointer border-l-2 transition-all duration-200 ${
                          isHighlighted
                            ? 'bg-violet-500/15 border-violet-500 text-white'
                            : 'bg-transparent border-transparent hover:bg-white/5 text-slate-300 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <ToolIcon toolId={tool.id} toolName={tool.name} category={tool.category} size="sm" />
                          <div className="flex flex-col text-left">
                            <span className="font-extrabold text-sm">
                              {highlightMatch(tool.name, searchQuery)}
                            </span>
                            <span className="text-[10px] text-slate-500 font-semibold">
                              {tool.category}
                            </span>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded-lg border border-violet-500/20">
                          View Tool
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-4 text-center text-slate-500 text-xs font-semibold">
                    No matching tools found
                  </div>
                )}
              </div>
            )}
          </div>

          {/* CALL TO ACTION BUTTONS */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={scrollToDirectory}
              className="bg-white hover:bg-slate-100 text-slate-950 font-bold text-sm px-6 py-3.5 rounded-xl transition-all cursor-pointer shadow-lg active:scale-95 flex items-center gap-2"
            >
              Explore Tools
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigateTo('compare')}
              className="bg-slate-900 hover:bg-slate-800 border border-white/10 hover:border-violet-500/30 text-white font-bold text-sm px-6 py-3.5 rounded-xl transition-all cursor-pointer active:scale-95 flex items-center gap-2"
            >
              Compare AI Tools
              <Activity className="w-4 h-4 text-violet-400" />
            </button>
            <button
              onClick={onOpenFeatureModal}
              className="bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 text-white font-bold text-sm px-6 py-3.5 rounded-xl transition-all cursor-pointer shadow-lg active:scale-95 flex items-center gap-2"
            >
              Feature Your Tool
              <Sparkles className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* WHY NEO AI PICKS SECTION */}
      <div className="max-w-7xl mx-auto w-full px-6 mb-20 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white">Why Neo AI Picks?</h2>
          <p className="text-sm text-slate-400 max-w-md mx-auto">Our catalog is vetted by developers and founders to ensure high usability standards.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: 'Compare Tools Side-by-Side', desc: 'Inspect parameters, pricing, and pros/cons dynamically.', icon: Activity },
            { title: 'Discover New AI Products', desc: 'Find recently published and vetted tools daily.', icon: Sparkles },
            { title: 'Read Expert Reviews', desc: 'Evaluate verified features and actual use cases.', icon: ShieldCheck },
            { title: 'Explore AI Alternatives', desc: 'Locate equivalent tools matching your constraints.', icon: Layers }
          ].map((card, i) => {
            const Icon = card.icon;
            return (
              <div key={i} className="h-full p-6 rounded-2xl saas-glass border border-white/5 space-y-3 saas-card-hover flex flex-col">
                <div className="w-10 h-10 rounded-xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-white text-sm md:text-base">{card.title}</h3>
                <p className="text-slate-400 text-xs md:text-sm font-medium leading-relaxed">{card.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* POPULAR COMPARISONS SECTION */}
      <div className="max-w-7xl mx-auto w-full px-6 mb-20 space-y-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <ScaleIcon className="w-5 h-5 text-violet-400" />
          Popular Comparisons
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {popularComparisons.map((pair) => (
            <div
              key={pair.id}
              onClick={() => navigateTo(`compare/${pair.id}`)}
              className="p-5 rounded-2xl saas-glass border border-white/5 saas-card-hover cursor-pointer space-y-3 flex flex-col justify-between"
            >
              <span className="text-[9px] font-extrabold text-violet-400 bg-violet-500/10 border border-violet-500/25 px-2.5 py-0.5 rounded-lg w-fit">
                {pair.category}
              </span>
              <h3 className="font-extrabold text-white text-sm leading-snug">{pair.label}</h3>
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1">
                View Specs
                <ArrowRight className="w-3 h-3 text-violet-400" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* TOP CATEGORIES SECTION */}
      <div className="max-w-7xl mx-auto w-full px-6 mb-20 space-y-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-violet-400" />
          Top Categories
        </h2>
        <div className="flex flex-wrap gap-3">
          {topCategories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => {
                setSelectedCategory(cat.value);
                scrollToDirectory();
              }}
              className="px-5 py-3 rounded-xl saas-glass border border-white/5 hover:border-violet-500/30 hover:bg-violet-950/15 text-slate-300 hover:text-white font-bold text-sm transition-all cursor-pointer flex items-center gap-2"
            >
              <Zap className="w-4 h-4 text-violet-400" />
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* FEATURED TOOLS GRID */}
      <div className="max-w-7xl mx-auto w-full px-6 mb-16 space-y-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
          Featured Tools
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredTools.map((tool) => {
            return (
              <div 
                key={tool.id} 
                onClick={() => navigateTo(`tool/${tool.id}`)}
                className="p-5 rounded-2xl saas-glass saas-card-hover cursor-pointer space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <ToolIcon toolId={tool.id} toolName={tool.name} category={tool.category} size="md" />
                    <span className="text-[9px] font-black text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
                      ★ Featured
                    </span>
                  </div>
                  <h3 className="font-extrabold text-white text-base">{tool.name}</h3>
                  <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed font-semibold">{tool.tagline}</p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[10px] text-slate-500">
                  <span>{tool.category}</span>
                  <span className="font-bold text-amber-400 flex items-center gap-0.5">
                    ★ {tool.rating || 4.7}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CORE LISTING CONTENT */}
      <div ref={directoryRef} className="max-w-7xl mx-auto w-full px-6 pb-20 grid grid-cols-1 lg:grid-cols-12 gap-8 scroll-mt-20">
        
        {/* MAIN FEED */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* CATEGORIES BAR */}
          <div className="flex flex-col gap-4 border-b border-white/5 pb-4">
            <h2 className="text-lg font-bold text-white">Browse Directory</h2>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
              {categories.map((category) => {
                const isActive = selectedCategory === category;
                return (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      isActive
                        ? 'bg-violet-600 border-violet-500 text-white shadow-lg shadow-violet-600/20'
                        : 'bg-slate-900/40 hover:bg-slate-900 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </div>

          {/* CONTROLS */}
          <div className="flex items-center justify-between bg-slate-900/30 p-3 rounded-xl border border-white/5 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-bold uppercase tracking-wider">Sort:</span>
              <button
                onClick={() => setSortBy('popular')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                  sortBy === 'popular' ? 'bg-violet-600/10 text-violet-400 border border-violet-500/20' : 'text-slate-400 hover:text-white'
                }`}
              >
                ▲ Popular
              </button>
              <button
                onClick={() => setSortBy('newest')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                  sortBy === 'newest' ? 'bg-violet-600/10 text-violet-400 border border-violet-500/20' : 'text-slate-400 hover:text-white'
                }`}
              >
                📅 Newest
              </button>
            </div>
            <span className="text-slate-500 font-semibold">Showing {sortedTools.length} results</span>
          </div>

          {/* LIST */}
          {sortedTools.length > 0 ? (
            <div className="space-y-4">
              {sortedTools.map((tool) => (
                <ToolCard
                  key={tool.id}
                  tool={tool}
                  upvotes={upvotesState[tool.id] || tool.upvotes}
                  hasUpvoted={upvotedTools.has(tool.id)}
                  onUpvote={() => onUpvote(tool.id)}
                  onClick={() => navigateTo(`tool/${tool.id}`)}
                />
              ))}
            </div>
          ) : (
            <div className="p-16 text-center rounded-2xl saas-glass space-y-4">
              <h3 className="text-lg font-bold text-white">No tools found</h3>
              <p className="text-slate-400 text-sm max-w-xs mx-auto">Try adjusting your search query or choosing a different category filter.</p>
              <button 
                onClick={() => { setSearchQuery(''); setSelectedCategory('All Tools'); }}
                className="bg-violet-600 hover:bg-violet-500 text-white px-4.5 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          )}

        </div>

        {/* SIDEBAR */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* POPULAR AI TOOLS (REPLACED LATEST LAUNCHES) */}
          <div className="p-6 rounded-2xl saas-glass space-y-4">
            <h3 className="font-bold text-white text-sm uppercase tracking-wider border-b border-white/5 pb-2">
              Popular AI Tools
            </h3>
            <div className="space-y-3.5">
              {popularTools.map((tool) => (
                <div 
                  key={tool.id}
                  onClick={() => navigateTo(`tool/${tool.id}`)}
                  className="flex items-center justify-between hover:bg-white/5 p-2 rounded-xl cursor-pointer transition-all group"
                >
                  <div className="space-y-0.5">
                    <h4 className="font-bold text-xs text-white group-hover:text-violet-400 transition-colors">{tool.name}</h4>
                    <p className="text-[10px] text-slate-500">{tool.category}</p>
                  </div>
                  <span className="text-[10px] font-bold text-amber-400 bg-amber-500/5 border border-amber-500/10 px-2.5 py-0.5 rounded-lg flex items-center gap-0.5">
                    ★ {tool.rating || 4.7}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* COMPASS LINK CTA CARD */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-violet-900/30 to-purple-900/10 border border-violet-500/20 relative overflow-hidden flex flex-col justify-between h-[180px]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/20 rounded-full blur-2xl pointer-events-none" />
            <div>
              <span className="text-[9px] font-extrabold uppercase tracking-widest text-violet-400 bg-violet-500/10 border border-violet-500/20 px-2.5 py-1 rounded-full w-fit">
                AI Knowledge
              </span>
              <h4 className="font-extrabold text-white text-base mt-3 leading-tight max-w-[200px]">
                Read benchmarks & tutorials in our blog
              </h4>
            </div>
            <button
              onClick={() => navigateTo('blog')}
              className="bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs py-2 px-4 rounded-xl w-fit transition-all cursor-pointer active:scale-95 shadow-lg shadow-violet-600/30"
            >
              Go to Blog
            </button>
          </div>

        </div>

      </div>

      {/* NEWSLETTER SIGNUP SECTION */}
      <div className="max-w-7xl mx-auto w-full px-6 mb-20">
        <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-br from-violet-950/20 to-purple-950/5 border border-violet-500/15 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-pink-500/5 rounded-full blur-2xl pointer-events-none" />
          
          <div className="space-y-3 max-w-lg text-center md:text-left">
            <span className="text-[9px] font-extrabold uppercase tracking-widest text-violet-400 bg-violet-500/10 border border-violet-500/20 px-2.5 py-1 rounded-full w-fit">
              Newsletter
            </span>
            <h3 className="text-2xl md:text-3xl font-black text-white leading-tight">
              Get Vetted AI Tool Reviews Direct to Your Inbox
            </h3>
            <p className="text-slate-400 text-xs md:text-sm font-medium leading-relaxed">
              Join our community of developers, writers, and founders. We send one weekly roundup of the best new AI tools. No spam.
            </p>
          </div>

          <form 
            onSubmit={(e) => { e.preventDefault(); alert('Subscribed successfully!'); }}
            className="flex flex-col sm:flex-row gap-2 w-full max-w-md"
          >
            <input
              type="email"
              placeholder="Enter your email address"
              required
              className="bg-slate-900 border border-white/10 focus:border-violet-500 rounded-xl py-3.5 px-4 text-white text-sm focus:outline-none focus:ring-1 focus:ring-violet-500 flex-grow"
            />
            <button
              type="submit"
              className="bg-white hover:bg-slate-100 text-slate-950 font-bold text-sm px-6 py-3.5 rounded-xl transition-all cursor-pointer active:scale-95 shadow-lg whitespace-nowrap"
            >
              Subscribe Now
            </button>
          </form>
        </div>
      </div>

    </div>
  );
};

// Mini inline scale icon to prevent compilation dependencies
const ScaleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="m16 16 3-8 3 8c-.5.5-1.5.5-3 .5s-2.5 0-3-.5z" />
    <path d="m2 16 3-8 3 8c-.5.5-1.5.5-3 .5s-2.5 0-3-.5z" />
    <path d="M7 21h10" />
    <path d="M12 3v18" />
    <path d="M3 7h18" />
  </svg>
);

export default Home;

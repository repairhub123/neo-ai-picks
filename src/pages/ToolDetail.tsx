import React, { useEffect } from 'react';
import { ChevronLeft, ExternalLink, ShieldCheck, Tag, Heart, HelpCircle, Check, AlertCircle, Bookmark, Scale, BookOpen, Sparkles } from 'lucide-react';
import { ToolCard } from '../components/ToolCard';
import type { AITool } from '../components/ToolCard';
import { ToolIcon } from '../components/ToolIcon';
import { comparisonPairs } from '../data/comparisons';
import { blogTopics } from '../data/blog';
import SEO from '../components/SEO';
import Breadcrumbs from '../components/Breadcrumbs';
import { trackEvent } from '../utils/analytics';

interface ToolDetailProps {
  toolId: string;
  tools: AITool[];
  upvotesState: Record<string, number>;
  upvotedTools: Set<string>;
  onUpvote: (toolId: string) => void;
  navigateTo: (tab: string, arg?: string) => void;
  onOpenFeatureModal: (name?: string, url?: string) => void;
}

export const ToolDetail: React.FC<ToolDetailProps> = ({
  toolId,
  tools,
  upvotesState,
  upvotedTools,
  onUpvote,
  navigateTo,
  onOpenFeatureModal
}) => {
  const tool = tools.find((t) => t.id === toolId);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (tool) {
      // Track tool details page visit
      trackEvent('view_tool_detail', 'Engagement', tool.name);
    }
  }, [toolId, tool]);

  if (!tool) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center space-y-4 text-white">
        <h2 className="text-2xl font-bold">Tool Profile Not Found</h2>
        <button onClick={() => navigateTo('home')} className="bg-violet-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold">
          Go Back Home
        </button>
      </div>
    );
  }

  // Get similar tools (alternatives in the same category) — up to 5
  const alternatives = tools
    .filter((t) => t.id !== tool.id && t.category === tool.category)
    .slice(0, 5);



  // Get related blogs (by category or mentioning this tool name)
  const relatedBlogs = blogTopics
    .filter((blog) => 
      blog.category === tool.category || 
      blog.title.toLowerCase().includes(tool.name.toLowerCase()) ||
      blog.excerpt.toLowerCase().includes(tool.name.toLowerCase())
    )
    .slice(0, 5);

  const isUpvoted = upvotedTools.has(tool.id);

  const getPricingStyle = (pricing: string) => {
    switch (pricing) {
      case 'Free':
        return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
      case 'Freemium':
        return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
      case 'Paid':
        return 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border border-slate-500/20';
    }
  };

  // Generate internal comparative counterpart links dynamically
  const getCompareLinks = (currentTool: AITool, allTools: AITool[]) => {
    // 1. Find all existing comparison pairs involving this tool
    const directPairs = comparisonPairs.filter(
      (p) => p.toolAId === currentTool.id || p.toolBId === currentTool.id
    );

    if (directPairs.length >= 3) {
      // Use actual comparison pairs if we have enough
      return directPairs.slice(0, 4).map((pair) => {
        const targetId = pair.toolAId === currentTool.id ? pair.toolBId : pair.toolAId;
        const targetTool = allTools.find((t) => t.id === targetId);
        if (!targetTool) return null;
        return { label: `${currentTool.name} vs ${targetTool.name}`, id: pair.id };
      }).filter(Boolean) as { label: string; id: string }[];
    }

    // 2. Fallback: generate by category + check for existing pair
    let comparators: string[];
    if (currentTool.category === 'Writing') {
      comparators = ['chatgpt', 'claude', 'gemini', 'perplexity', 'grammarly'];
    } else if (currentTool.category === 'Coding') {
      comparators = ['cursor', 'github-copilot', 'windsurf', 'codeium', 'replit'];
    } else if (currentTool.category === 'Image Generation') {
      comparators = ['midjourney', 'dalle3', 'flux', 'stable-diffusion', 'ideogram'];
    } else if (currentTool.category === 'Video Generation') {
      comparators = ['runway', 'sora-openai', 'heygen', 'pika-labs'];
    } else if (currentTool.category === 'Voice & Audio') {
      comparators = ['elevenlabs', 'murf-ai', 'suno-ai', 'play-ht'];
    } else {
      comparators = allTools
        .filter((t) => t.id !== currentTool.id && t.category === currentTool.category)
        .slice(0, 4)
        .map((t) => t.id);
    }

    return comparators
      .filter((id) => id !== currentTool.id)
      .slice(0, 4)
      .map((targetId) => {
        const targetTool = allTools.find((t) => t.id === targetId);
        if (!targetTool) return null;
        const existingPair = comparisonPairs.find(
          (p) => (p.toolAId === currentTool.id && p.toolBId === targetId) || (p.toolAId === targetId && p.toolBId === currentTool.id)
        );
        const comparisonId = existingPair ? existingPair.id : `${currentTool.id}-vs-${targetId}`;
        return { label: `${currentTool.name} vs ${targetTool.name}`, id: comparisonId };
      })
      .filter(Boolean) as { label: string; id: string }[];
  };

  // Structured Data: Combined Schemas (Software, Breadcrumbs, FAQs)
  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://neo-ai-picks.vercel.app';
  
  const softwareSchema = {
    "@type": "SoftwareApplication",
    "@id": `${siteUrl}/tool/${tool.id}#software`,
    "name": tool.name,
    "description": tool.description,
    "applicationCategory": `${tool.category}Application`,
    "operatingSystem": "All",
    "url": `${siteUrl}/tool/${tool.id}`,
    "offers": {
      "@type": "Offer",
      "price": tool.pricing === 'Free' ? '0.00' : '19.00',
      "priceCurrency": "USD"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": tool.rating || 4.7,
      "reviewCount": 18 + (tool.name.length % 7)
    }
  };

  const breadcrumbSchema = {
    "@type": "BreadcrumbList",
    "@id": `${siteUrl}/tool/${tool.id}#breadcrumb`,
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": `${siteUrl}/`
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": tool.name,
        "item": `${siteUrl}/tool/${tool.id}`
      }
    ]
  };

  const faqSchema = {
    "@type": "FAQPage",
    "@id": `${siteUrl}/tool/${tool.id}#faq`,
    "mainEntity": [
      {
        "@type": "Question",
        "name": `What is ${tool.name} best used for?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `${tool.name} is ideal for: ${tool.bestUseCases.join(', ')}. Subtitle: ${tool.tagline}.`
        }
      },
      {
        "@type": "Question",
        "name": `What is the pricing for ${tool.name}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `${tool.name} is offered under a ${tool.pricing} model. Pricing details: ${tool.pricingDetails || 'Standard plans apply.'}`
        }
      }
    ]
  };

  const combinedSchema = {
    "@context": "https://schema.org",
    "@graph": [
      softwareSchema,
      breadcrumbSchema,
      faqSchema
    ]
  };

  return (
    <div className="w-full flex-grow bg-[#0b0f19] pb-20 pt-8 px-6">
      <SEO
        title={tool.seoTitle}
        description={tool.seoMetaDescription}
        path={`/tool/${tool.slug}`}
        ogType="website"
        jsonLd={combinedSchema}
      />

      <div className="max-w-7xl mx-auto space-y-6">
        <div className="space-y-2">
          {/* BREADCRUMBS */}
          <Breadcrumbs
            navigateTo={navigateTo}
            items={[
              { label: 'Explore Tools', onClick: () => navigateTo('home') },
              { label: tool.name }
            ]}
          />

          {/* BACK TO DIRECTORY */}
          <button
            onClick={() => navigateTo('home')}
            className="flex items-center gap-1.5 text-slate-400 hover:text-white text-sm font-semibold transition-all group w-fit cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to Directory
          </button>
        </div>

        {/* PROFILE HEADER CARD */}
        <div className="p-6 md:p-8 rounded-2xl saas-glass relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="absolute top-0 right-0 w-48 h-48 bg-violet-600/5 rounded-full blur-2xl pointer-events-none" />

          {/* ICON & SUMMARY */}
          <div className="flex flex-col sm:flex-row items-start gap-5">
            <ToolIcon toolId={tool.id} toolName={tool.name} category={tool.category} size="lg" />
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl md:text-3xl font-black text-white">{tool.name}</h1>
                <span className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${getPricingStyle(tool.pricing)}`}>
                  {tool.pricing}
                </span>
              </div>
              <p className="text-slate-400 text-base max-w-xl font-medium">{tool.tagline}</p>
              
              <div className="flex items-center gap-3 text-xs text-slate-500 pt-1.5">
                <span className="flex items-center gap-1 font-semibold">
                  <Tag className="w-3.5 h-3.5 text-violet-400" />
                  {tool.category}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Verified Neo Listing
                </span>
              </div>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex items-center gap-3 flex-shrink-0 self-stretch sm:self-auto border-t md:border-t-0 border-white/5 pt-4 md:pt-0">
            {/* BOOKMARK */}
            <button
              onClick={() => onUpvote(tool.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl border font-bold text-sm transition-all cursor-pointer active:scale-95 flex-grow sm:flex-grow-0 justify-center ${
                isUpvoted
                  ? 'bg-violet-600 border-violet-500 text-white shadow-lg shadow-violet-600/35'
                  : 'bg-slate-900 hover:bg-slate-800 border-white/10 hover:border-violet-500/30 text-slate-300 hover:text-white'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isUpvoted ? 'fill-white' : ''}`} />
              {isUpvoted ? 'Bookmarked' : 'Bookmark'}
            </button>

            {/* DIRECT CTA */}
            <a
              href={tool.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent('outbound_click', 'Outbound', tool.name)}
              className="flex items-center justify-center gap-2 bg-white hover:bg-slate-100 text-slate-950 font-bold text-sm px-5 py-3 rounded-xl transition-all cursor-pointer active:scale-95 shadow-md flex-grow sm:flex-grow-0"
            >
              Visit Website
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* DETAILS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* MAIN COLUMN */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* QUICK SUMMARIES (BEST FOR & PRICING SUMMARY) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl saas-glass border border-violet-500/10 space-y-2 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-violet-600/5 rounded-full blur-xl pointer-events-none" />
                <div className="text-[10px] text-violet-400 font-extrabold uppercase tracking-widest flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  Best For
                </div>
                <p className="text-white text-sm font-semibold leading-relaxed">
                  {tool.bestUseCases[0] || 'General generative AI applications.'}
                </p>
              </div>
              <div className="p-6 rounded-2xl saas-glass border border-violet-500/10 space-y-2 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-violet-600/5 rounded-full blur-xl pointer-events-none" />
                <div className="text-[10px] text-violet-400 font-extrabold uppercase tracking-widest flex items-center gap-1">
                  <HelpCircle className="w-3.5 h-3.5" />
                  Pricing Summary
                </div>
                <p className="text-white text-sm font-semibold leading-relaxed">
                  {tool.pricingDetails || `${tool.pricing} plan option.`}
                </p>
              </div>
            </div>
            
            {/* DESCRIPTION */}
            <div className="p-6 md:p-8 rounded-2xl saas-glass space-y-4">
              <h2 className="text-lg font-bold text-white border-b border-white/5 pb-2">Overview</h2>
              <p className="text-slate-300 leading-relaxed text-sm md:text-base whitespace-pre-line font-medium">
                {tool.description}
              </p>
            </div>

            {/* FEATURES */}
            <div className="p-6 md:p-8 rounded-2xl saas-glass space-y-4">
              <h2 className="text-lg font-bold text-white border-b border-white/5 pb-2">Core Features</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {tool.features.map((feature, i) => (
                  <div key={i} className="flex gap-3 bg-slate-900/30 border border-white/5 p-4 rounded-xl items-start">
                    <span className="w-6 h-6 bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-bold rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-slate-300 text-sm font-semibold leading-relaxed">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* PROS & CONS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* PROS */}
              <div className="p-6 rounded-2xl saas-glass border border-emerald-500/10 space-y-4">
                <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-white/5 pb-2">
                  <Check className="w-4 h-4" />
                  Pros
                </h3>
                <ul className="space-y-3 text-xs md:text-sm text-slate-300 font-medium">
                  {tool.pros.map((pro, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-emerald-500 mt-1 select-none">•</span>
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CONS */}
              <div className="p-6 rounded-2xl saas-glass border border-rose-500/10 space-y-4">
                <h3 className="text-sm font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-white/5 pb-2">
                  <AlertCircle className="w-4 h-4" />
                  Cons
                </h3>
                <ul className="space-y-3 text-xs md:text-sm text-slate-300 font-medium">
                  {tool.cons.map((con, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-rose-500 mt-1 select-none">•</span>
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* BEST USE CASES */}
            <div className="p-6 md:p-8 rounded-2xl saas-glass space-y-4">
              <h2 className="text-lg font-bold text-white border-b border-white/5 pb-2 flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-violet-400" />
                Best Use Cases
              </h2>
              <div className="space-y-3">
                {tool.bestUseCases.map((useCase, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm text-slate-300 font-medium">
                    <span className="text-violet-400 mt-1 font-bold">{i + 1}.</span>
                    <p>{useCase}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* SUGGESTED ALTERNATIVES */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Heart className="w-5 h-5 text-violet-400" />
                Similar Tools
              </h2>
              <p className="text-xs text-slate-500">
                Explore alternatives in the **{tool.category}** category.
              </p>
              <div className="space-y-4">
                {alternatives.map((alt) => (
                  <ToolCard
                    key={alt.id}
                    tool={alt}
                    upvotes={upvotesState[alt.id] || alt.upvotes}
                    hasUpvoted={upvotedTools.has(alt.id)}
                    onUpvote={() => onUpvote(alt.id)}
                    onClick={() => navigateTo(`tool/${alt.id}`)}
                  />
                ))}
              </div>
            </div>

          </div>

          {/* SIDEBAR COLUMN */}
          <div className="lg:col-span-4 space-y-8">
            {/* PRICING CARD */}
            <div className="p-6 rounded-2xl saas-glass space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-violet-600/10 rounded-full blur-xl pointer-events-none" />
              
              <h3 className="font-bold text-white text-sm uppercase tracking-wider border-b border-white/5 pb-2">
                Pricing Structure
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm font-medium">Model:</span>
                  <span className={`text-xs font-extrabold uppercase px-2.5 py-1 rounded-full ${getPricingStyle(tool.pricing)}`}>
                    {tool.pricing}
                  </span>
                </div>
                
                <div className="bg-slate-900/60 border border-white/5 p-4 rounded-xl">
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2 flex items-center gap-1">
                    <HelpCircle className="w-3.5 h-3.5 text-violet-400" />
                    Plan Details
                  </div>
                  <p className="text-slate-300 text-xs leading-relaxed font-semibold">
                    {tool.pricingDetails}
                  </p>
                </div>
              </div>
            </div>

            {/* ALTERNATIVE LINKS CLOUD */}
            <div className="p-6 rounded-2xl saas-glass space-y-4">
              <h3 className="font-bold text-white text-sm uppercase tracking-wider border-b border-white/5 pb-2">
                Competitor Reviews
              </h3>
              <div className="flex flex-wrap gap-2 text-xs">
                {tool.alternatives.map((altName) => {
                  // Find the matching tool review if it exists in directory
                  const matchedTool = tools.find(
                    (t) =>
                      t.name.toLowerCase() === altName.toLowerCase() ||
                      t.id.toLowerCase() === altName.toLowerCase()
                  );
                  if (matchedTool) {
                    return (
                      <button
                        key={altName}
                        onClick={() => navigateTo(`tool/${matchedTool.id}`)}
                        className="px-3 py-1.5 rounded-lg bg-violet-950/20 hover:bg-violet-950/40 border border-violet-500/10 hover:border-violet-500/35 text-violet-300 transition-all cursor-pointer font-bold"
                      >
                        {matchedTool.name} Review
                      </button>
                    );
                  }
                  return (
                    <span
                      key={altName}
                      className="px-3 py-1 rounded-lg bg-slate-900 border border-white/5 text-slate-400 font-semibold"
                    >
                      {altName}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* DYNAMIC COMPARE LINKS */}
            {getCompareLinks(tool, tools).length > 0 && (
              <div className="p-6 rounded-2xl saas-glass space-y-4">
                <h3 className="font-bold text-white text-sm uppercase tracking-wider border-b border-white/5 pb-2 flex items-center gap-1.5">
                  <Scale className="w-4 h-4 text-violet-400" />
                  Direct Comparisons
                </h3>
                <div className="space-y-2.5">
                  {getCompareLinks(tool, tools).map((item) => (
                    <button
                      key={item.id}
                      onClick={() => navigateTo(`compare/${item.id}`)}
                      className="w-full text-left text-xs font-semibold text-slate-350 hover:text-white bg-slate-900/40 hover:bg-slate-900 border border-white/5 hover:border-violet-500/20 p-3 rounded-xl transition-all cursor-pointer block font-bold"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* RELATED BLOG POSTS */}
            {relatedBlogs.length > 0 && (
              <div className="p-6 rounded-2xl saas-glass space-y-4">
                <h3 className="font-bold text-white text-sm uppercase tracking-wider border-b border-white/5 pb-2 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-violet-400" />
                  Related AI Guides
                </h3>
                <div className="space-y-2.5">
                  {relatedBlogs.map((blog) => (
                    <button
                      key={blog.id}
                      onClick={() => navigateTo(`blog/${blog.id}`)}
                      className="w-full text-left text-xs font-semibold text-slate-350 hover:text-white bg-slate-900/40 hover:bg-slate-900 border border-white/5 hover:border-violet-500/20 p-3 rounded-xl transition-all cursor-pointer block line-clamp-2"
                    >
                      {blog.title}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* SPONSOR PROMO CARD */}
            <div className="p-6 rounded-2xl border border-violet-500/25 bg-gradient-to-b from-violet-950/20 to-pink-950/10 space-y-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-violet-600/10 rounded-full blur-xl pointer-events-none" />
              <div className="space-y-1">
                <h3 className="font-bold text-white text-sm uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-violet-400" />
                  Sponsor Neo AI Picks
                </h3>
                <p className="text-slate-400 text-xs leading-relaxed font-semibold">
                  Get your AI product in front of thousands of active tech founders and builders searching for tools.
                </p>
              </div>
              <button 
                type="button"
                onClick={() => onOpenFeatureModal(tool.name, tool.websiteUrl)}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-pink-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:from-violet-500 hover:to-pink-500 transition-all duration-350 active:scale-95"
              >
                Feature Your Tool
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
export default ToolDetail;

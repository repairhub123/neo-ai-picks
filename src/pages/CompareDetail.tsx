import React, { useEffect } from 'react';
import { ChevronLeft, ShieldCheck, ArrowUpRight, Scale, BookOpen } from 'lucide-react';
import { comparisonPairs } from '../data/comparisons';
import { detailedComparisons } from '../data/detailedComparisons';
import { getPremiumComparison } from '../data/comparisons/registry';
import { blogTopics } from '../data/blog';
import type { AITool } from '../components/ToolCard';
import SEO from '../components/SEO';
import Breadcrumbs from '../components/Breadcrumbs';

interface CompareDetailProps {
  comparisonId: string;
  tools: AITool[];
  navigateTo: (tab: string, arg?: string) => void;
}

export const CompareDetail: React.FC<CompareDetailProps> = ({
  comparisonId,
  tools,
  navigateTo
}) => {
  let pair = comparisonPairs.find((p) => p.id === comparisonId);
  let isDynamic = false;
  let dynamicToolA: AITool | undefined = undefined;
  let dynamicToolB: AITool | undefined = undefined;

  if (!pair && comparisonId && comparisonId.includes('-vs-')) {
    const parts = comparisonId.split('-vs-');
    const toolAId = parts[0];
    const toolBId = parts[1];
    dynamicToolA = tools.find((t) => t.id === toolAId);
    dynamicToolB = tools.find((t) => t.id === toolBId);

    if (dynamicToolA && dynamicToolB) {
      isDynamic = true;
      pair = {
        id: comparisonId,
        toolAId: dynamicToolA.id,
        toolBId: dynamicToolB.id,
        title: `${dynamicToolA.name} vs ${dynamicToolB.name}`,
        excerpt: `Compare features, pricing, and pros & cons between ${dynamicToolA.name} and ${dynamicToolB.name}.`,
        category: dynamicToolA.category === dynamicToolB.category ? dynamicToolA.category : 'AI Software'
      };
    }
  }

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [comparisonId]);

  if (!pair) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center space-y-4 text-white">
        <h2 className="text-2xl font-bold">Comparison Matrix Not Found</h2>
        <button onClick={() => navigateTo('compare')} className="bg-violet-600 px-5 py-2.5 rounded-xl text-sm font-bold">
          Go to Comparisons
        </button>
      </div>
    );
  }

  const toolA = isDynamic ? dynamicToolA! : tools.find((t) => t.id === pair.toolAId);
  const toolB = isDynamic ? dynamicToolB! : tools.find((t) => t.id === pair.toolBId);

  if (!toolA || !toolB) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center space-y-4 text-white">
        <h2 className="text-2xl font-bold">One or both tools are not preloaded</h2>
        <p className="text-slate-400">Cannot load comparisons. Ensure both tools exist in the directory.</p>
        <button onClick={() => navigateTo('compare')} className="bg-violet-600 px-5 py-2.5 rounded-xl text-sm font-bold">
          Go Back
        </button>
      </div>
    );
  }

  // Find premium comparison if it exists
  const premiumPair = getPremiumComparison(pair.id);
  // Fall back to detailedPair if no premium data is configured
  const detailedPair = premiumPair || detailedComparisons.find((dp) => dp.id === pair.id);

  // Find other comparisons in the same category or involving toolA/toolB
  const relatedComparisons = comparisonPairs
    .filter((cp) => cp.id !== pair.id && (cp.toolAId === toolA.id || cp.toolBId === toolA.id || cp.toolAId === toolB.id || cp.toolBId === toolB.id))
    .slice(0, 3);

  // Find blog posts that mention toolA or toolB or match category
  const relatedBlogs = blogTopics
    .filter((blog) => 
      blog.title.toLowerCase().includes(toolA.name.toLowerCase()) ||
      blog.excerpt.toLowerCase().includes(toolA.name.toLowerCase()) ||
      blog.title.toLowerCase().includes(toolB.name.toLowerCase()) ||
      blog.excerpt.toLowerCase().includes(toolB.name.toLowerCase()) ||
      blog.category === pair.category
    )
    .slice(0, 3);

  // Dynamic Verdict calculation
  const ratingA = toolA.rating || 4.7;
  const ratingB = toolB.rating || 4.6;
  const winner = ratingA > ratingB ? toolA : ratingB > ratingA ? toolB : null;

  // JSON-LD Product Schema for Comparison
  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://neo-ai-picks.vercel.app';
  const comparisonSchema = {
    "@type": "Product",
    "name": `${toolA.name} vs ${toolB.name} Comparison`,
    "description": detailedPair ? detailedPair.seoDescription : pair.excerpt,
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "USD",
      "lowPrice": toolA.pricing === 'Free' ? '0.00' : '10.00',
      "highPrice": toolB.pricing === 'Paid' ? '39.00' : '29.00',
      "offerCount": "2"
    }
  };

  const breadcrumbSchema = {
    "@type": "BreadcrumbList",
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
        "name": "Comparisons",
        "item": `${siteUrl}/compare`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": `${toolA.name} vs ${toolB.name}`,
        "item": `${siteUrl}/compare/${pair.id}`
      }
    ]
  };

  const faqSchema = {
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `Which is better, ${toolA.name} or ${toolB.name}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `${winner ? `${winner.name} generally rates higher on our directory (${ratingA > ratingB ? ratingA : ratingB}/5 stars) compared to ${ratingA > ratingB ? toolB.name : toolA.name} (${ratingA > ratingB ? ratingB : ratingA}/5 stars).` : `Both tools are closely matched at ${ratingA}/5 stars.`} ${detailedPair?.finalVerdict || `Choose ${toolA.name} for its ${toolA.tagline.toLowerCase()} or ${toolB.name} if you require its ${toolB.tagline.toLowerCase()}`}`
        }
      },
      {
        "@type": "Question",
        "name": `What is the difference in pricing between ${toolA.name} and ${toolB.name}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `${toolA.name} is offered as a ${toolA.pricing} tool (${toolA.pricingDetails}), while ${toolB.name} is offered as a ${toolB.pricing} tool (${toolB.pricingDetails}).`
        }
      }
    ]
  };

  const combinedSchema = {
    "@context": "https://schema.org",
    "@graph": [
      comparisonSchema,
      breadcrumbSchema,
      faqSchema
    ]
  };

  return (
    <div className="w-full flex-grow bg-[#0b0f19] pb-20 pt-8 px-6">
      <SEO
        title={isDynamic ? `${toolA.name} vs ${toolB.name} - AI Tool Comparison` : (detailedPair ? detailedPair.seoTitle : `${toolA.name} vs ${toolB.name}: Which AI Tool is Best in 2026?`)}
        description={detailedPair ? detailedPair.seoDescription : `Read our side-by-side comparison of ${toolA.name} and ${toolB.name}. Contrast features, pricing structures, pros, cons, ratings, and find out our verdict.`}
        path={`/compare/${pair.id}`}
        jsonLd={combinedSchema}
      />

      <div className="max-w-7xl mx-auto space-y-6">
        <div className="space-y-2">
          {/* BREADCRUMBS */}
          <Breadcrumbs
            navigateTo={navigateTo}
            items={[
              { label: 'Comparisons', onClick: () => navigateTo('compare') },
              { label: `${toolA.name} vs ${toolB.name}` }
            ]}
          />

          {/* BACK TO DIRECTORY */}
          <button
            onClick={() => navigateTo('compare')}
            className="flex items-center gap-1.5 text-slate-400 hover:text-white text-sm font-semibold transition-all group w-fit cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to Comparisons
          </button>
        </div>

        {/* PROFILE HEADER CARD */}
        <div className="p-8 rounded-2xl saas-glass relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div className="absolute top-0 right-0 w-48 h-48 bg-violet-600/5 rounded-full blur-2xl pointer-events-none" />

          {/* HEAD TITLE */}
          <div className="space-y-3 flex-grow">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-xs font-bold text-violet-400 select-none uppercase tracking-wider">
              <Scale className="w-3.5 h-3.5" />
              Side-by-Side Comparison
            </div>
            <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
              {toolA.name} <span className="text-violet-400">vs</span> {toolB.name}
            </h1>
            <p className="text-slate-400 text-sm md:text-base max-w-2xl font-medium leading-relaxed">
              {detailedPair ? detailedPair.introduction : pair.excerpt}
            </p>
          </div>

          {/* SHORT COMPARATIVE RATING WIDGET */}
          <div className="flex items-center gap-4 bg-slate-900/40 p-4 rounded-2xl border border-white/5 flex-shrink-0 self-stretch sm:self-auto justify-center">
            <div>
              <div className="text-[10px] text-slate-500 font-bold uppercase">Neo score</div>
              <div className="text-lg font-black text-white">{toolA.name}: <span className="text-violet-400">{ratingA}</span></div>
            </div>
            <div className="h-8 w-[1px] bg-white/10" />
            <div>
              <div className="text-[10px] text-slate-500 font-bold uppercase">Neo score</div>
              <div className="text-lg font-black text-white">{toolB.name}: <span className="text-violet-400">{ratingB}</span></div>
            </div>
          </div>
        </div>

        {/* COMPARISON MATRIX TABLE */}
        <div className="overflow-x-auto custom-scrollbar rounded-2xl border border-white/5 saas-glass">
          <table className="w-full text-left border-collapse text-xs md:text-sm min-w-[550px]">
            <thead>
              <tr className="border-b border-white/5 bg-slate-950/45">
                <th className="p-4 md:p-5 text-slate-400 font-bold uppercase tracking-wider w-1/3 min-w-[150px]">Specifications</th>
                <th className="p-4 md:p-5 text-white font-extrabold w-1/3 min-w-[200px] text-center md:text-left">{toolA.name}</th>
                <th className="p-4 md:p-5 text-white font-extrabold w-1/3 min-w-[200px] text-center md:text-left">{toolB.name}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300 font-medium">
              {detailedPair ? (
                // Detailed Custom Feature Spec List
                detailedPair.featuresTable.map((f, i) => (
                  <tr key={i}>
                    <td className="p-4 md:p-5 font-bold text-slate-400 bg-slate-950/20">{f.featureName}</td>
                    <td className="p-4 md:p-5">{f.toolAValue}</td>
                    <td className="p-4 md:p-5">{f.toolBValue}</td>
                  </tr>
                ))
              ) : (
                // Fallback spec table
                <>
                  <tr>
                    <td className="p-4 md:p-5 font-bold text-slate-400 bg-slate-950/20">Category</td>
                    <td className="p-4 md:p-5">{toolA.category}</td>
                    <td className="p-4 md:p-5">{toolB.category}</td>
                  </tr>
                  <tr>
                    <td className="p-4 md:p-5 font-bold text-slate-400 bg-slate-950/20">Tagline</td>
                    <td className="p-4 md:p-5 text-slate-400 italic">{toolA.tagline}</td>
                    <td className="p-4 md:p-5 text-slate-400 italic">{toolB.tagline}</td>
                  </tr>
                  <tr>
                    <td className="p-4 md:p-5 font-bold text-slate-400 bg-slate-950/20">Pricing model</td>
                    <td className="p-4 md:p-5">
                      <span className="bg-violet-600/10 text-violet-400 border border-violet-500/20 px-2.5 py-0.5 rounded-full font-bold text-xs uppercase">
                        {toolA.pricing}
                      </span>
                    </td>
                    <td className="p-4 md:p-5">
                      <span className="bg-violet-600/10 text-violet-400 border border-violet-500/20 px-2.5 py-0.5 rounded-full font-bold text-xs uppercase">
                        {toolB.pricing}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 md:p-5 font-bold text-slate-400 bg-slate-950/20">Pricing plans</td>
                    <td className="p-4 md:p-5 text-xs leading-relaxed">{toolA.pricingDetails}</td>
                    <td className="p-4 md:p-5 text-xs leading-relaxed">{toolB.pricingDetails}</td>
                  </tr>
                  <tr>
                    <td className="p-4 md:p-5 font-bold text-slate-400 bg-slate-950/20">Top 3 features</td>
                    <td className="p-4 md:p-5">
                      <ul className="list-disc list-inside space-y-1 text-xs">
                        {toolA.features.slice(0,3).map((f) => <li key={f}>{f}</li>)}
                      </ul>
                    </td>
                    <td className="p-4 md:p-5">
                      <ul className="list-disc list-inside space-y-1 text-xs">
                        {toolB.features.slice(0,3).map((f) => <li key={f}>{f}</li>)}
                      </ul>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 md:p-5 font-bold text-slate-400 bg-slate-950/20">Best Use Case</td>
                    <td className="p-4 md:p-5">
                      <ul className="list-disc list-inside space-y-1 text-xs">
                        {(toolA.bestUseCases || []).map((b) => <li key={b}>{b}</li>)}
                      </ul>
                    </td>
                    <td className="p-4 md:p-5">
                      <ul className="list-disc list-inside space-y-1 text-xs">
                        {(toolB.bestUseCases || []).map((b) => <li key={b}>{b}</li>)}
                      </ul>
                    </td>
                  </tr>
                </>
              )}

              {/* Pros */}
              <tr>
                <td className="p-4 md:p-5 font-bold text-slate-400 bg-slate-950/20">Pros</td>
                <td className="p-4 md:p-5">
                  <ul className="space-y-1 text-xs text-emerald-400">
                    {(detailedPair ? detailedPair.prosA : toolA.pros).map((p) => (
                      <li key={p} className="flex items-start gap-1">✔ {p}</li>
                    ))}
                  </ul>
                </td>
                <td className="p-4 md:p-5">
                  <ul className="space-y-1 text-xs text-emerald-400">
                    {(detailedPair ? detailedPair.prosB : toolB.pros).map((p) => (
                      <li key={p} className="flex items-start gap-1">✔ {p}</li>
                    ))}
                  </ul>
                </td>
              </tr>
              {/* Cons */}
              <tr>
                <td className="p-4 md:p-5 font-bold text-slate-400 bg-slate-950/20">Cons</td>
                <td className="p-4 md:p-5">
                  <ul className="space-y-1 text-xs text-rose-400">
                    {(detailedPair ? detailedPair.consA : toolA.cons).map((c) => (
                      <li key={c} className="flex items-start gap-1">✘ {c}</li>
                    ))}
                  </ul>
                </td>
                <td className="p-4 md:p-5">
                  <ul className="space-y-1 text-xs text-rose-400">
                    {(detailedPair ? detailedPair.consB : toolB.cons).map((c) => (
                      <li key={c} className="flex items-start gap-1">✘ {c}</li>
                    ))}
                  </ul>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* PRICING COMPARISON EXTRA DETAIL */}
        {detailedPair && (
          <div className="p-6 md:p-8 rounded-2xl saas-glass border border-white/5 space-y-4">
            <h3 className="font-bold text-white text-base uppercase tracking-wider border-b border-white/5 pb-2">
              Pricing Comparison
            </h3>
            <div className="text-slate-300 text-sm md:text-base leading-relaxed font-medium whitespace-pre-line space-y-3">
              {detailedPair.pricingComparison.split('\n\n').map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </div>
        )}

        {/* TARGET DEMOGRAPHICS (BEGINNERS VS PROFESSIONALS VS BUSINESSES) */}
        {premiumPair ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Best for Beginners */}
            <div className="p-6 rounded-2xl saas-glass border border-white/5 space-y-3 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />
              <div className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-lg w-fit">
                Best for Beginners
              </div>
              <h4 className="font-extrabold text-white text-base mt-2">
                Winner: <span className="text-violet-300">{premiumPair.bestForBeginners.winner}</span>
              </h4>
              <p className="text-slate-400 text-xs md:text-sm font-medium leading-relaxed">
                {premiumPair.bestForBeginners.reason}
              </p>
            </div>
            {/* Best for Professionals */}
            <div className="p-6 rounded-2xl saas-glass border border-white/5 space-y-3 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-violet-500/5 rounded-full blur-xl pointer-events-none" />
              <div className="text-[10px] text-violet-400 font-extrabold uppercase tracking-wider bg-violet-500/10 border border-violet-500/20 px-2.5 py-0.5 rounded-lg w-fit">
                Best for Professionals
              </div>
              <h4 className="font-extrabold text-white text-base mt-2">
                Winner: <span className="text-violet-300">{premiumPair.bestForProfessionals.winner}</span>
              </h4>
              <p className="text-slate-400 text-xs md:text-sm font-medium leading-relaxed">
                {premiumPair.bestForProfessionals.reason}
              </p>
            </div>
            {/* Best for Businesses */}
            <div className="p-6 rounded-2xl saas-glass border border-white/5 space-y-3 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-xl pointer-events-none" />
              <div className="text-[10px] text-blue-400 font-extrabold uppercase tracking-wider bg-blue-500/10 border border-blue-500/20 px-2.5 py-0.5 rounded-lg w-fit">
                Best for Businesses
              </div>
              <h4 className="font-extrabold text-white text-base mt-2">
                Winner: <span className="text-violet-300">{premiumPair.bestForBusinesses.winner}</span>
              </h4>
              <p className="text-slate-400 text-xs md:text-sm font-medium leading-relaxed">
                {premiumPair.bestForBusinesses.reason}
              </p>
            </div>
          </div>
        ) : (
          detailedPair && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Best for Beginners */}
              <div className="p-6 rounded-2xl saas-glass border border-white/5 space-y-3 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />
                <div className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-lg w-fit">
                  Best for Beginners
                </div>
                <h4 className="font-extrabold text-white text-base mt-2">
                  Winner: <span className="text-violet-300">{detailedPair.bestForBeginners.winner}</span>
                </h4>
                <p className="text-slate-400 text-xs md:text-sm font-medium leading-relaxed">
                  {detailedPair.bestForBeginners.reason}
                </p>
              </div>
              {/* Best for Professionals */}
              <div className="p-6 rounded-2xl saas-glass border border-white/5 space-y-3 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-violet-500/5 rounded-full blur-xl pointer-events-none" />
                <div className="text-[10px] text-violet-400 font-extrabold uppercase tracking-wider bg-violet-500/10 border border-violet-500/20 px-2.5 py-0.5 rounded-lg w-fit">
                  Best for Professionals
                </div>
                <h4 className="font-extrabold text-white text-base mt-2">
                  Winner: <span className="text-violet-300">{detailedPair.bestForProfessionals.winner}</span>
                </h4>
                <p className="text-slate-400 text-xs md:text-sm font-medium leading-relaxed">
                  {detailedPair.bestForProfessionals.reason}
                </p>
              </div>
            </div>
          )
        )}

        {/* PERFORMANCE ANALYSIS SECTION */}
        {premiumPair && (
          <div className="p-6 md:p-8 rounded-2xl saas-glass border border-white/5 space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/10 rounded-full blur-2xl pointer-events-none" />
            <h3 className="font-bold text-white text-base uppercase tracking-wider border-b border-white/5 pb-2">
              Performance Analysis & Benchmarks
            </h3>
            <div className="text-slate-300 text-sm md:text-base leading-relaxed font-medium whitespace-pre-line space-y-4">
              {premiumPair.performanceAnalysis.split('\n\n').map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </div>
        )}

        {/* COMPARATIVE VERDICT CARD */}
        <div className="p-6 md:p-8 rounded-2xl saas-glass space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/10 rounded-full blur-2xl pointer-events-none" />
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-violet-400" />
            Editorial Verdict
          </h2>
          <div className="text-slate-300 leading-relaxed text-sm md:text-base font-medium whitespace-pre-line space-y-4">
            {detailedPair ? (
              detailedPair.finalVerdict.split('\n\n').map((p, i) => <p key={i}>{p}</p>)
            ) : (
              <p>
                While both **{toolA.name}** and **{toolB.name}** represent cutting edge solutions in **{toolA.category}**, they cater to different workflows.
                <br /><br />
                - **Choose {toolA.name}** if you require {toolA.pros[0]} and {toolA.pros[1]}. It offers a strong set of features: {toolA.features.slice(0,2).join(' and ')}.
                <br />
                - **Choose {toolB.name}** if your priority is {toolB.pros[0]} or you need to adapt to {toolB.pros[1]}.
                <br /><br />
                For most users, {winner ? `**${winner.name}** represents the more versatile, high-scoring option based on our benchmark scores.` : `the choice comes down to pricing model preference: ${toolA.name} operates as a ${toolA.pricing} tool, whereas ${toolB.name} offers a ${toolB.pricing} configuration.`}
              </p>
            )}
          </div>
          
          <div className="flex gap-4 pt-4 border-t border-white/5">
            <button 
              onClick={() => navigateTo(`tool/${toolA.id}`)}
              className="bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs py-3 px-6 rounded-xl flex items-center gap-1 active:scale-95 transition-all cursor-pointer shadow-lg shadow-violet-600/25"
            >
              Explore {toolA.name}
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={() => navigateTo(`tool/${toolB.id}`)}
              className="bg-slate-900 hover:bg-slate-800 border border-white/5 hover:border-violet-500/30 text-white font-bold text-xs py-3 px-6 rounded-xl flex items-center gap-1 active:scale-95 transition-all cursor-pointer"
            >
              Explore {toolB.name}
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* FAQ SECTION */}
        {premiumPair && (
          <div className="p-6 md:p-8 rounded-2xl saas-glass border border-white/5 space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-violet-500/5 rounded-full blur-xl pointer-events-none" />
            <h3 className="font-bold text-white text-base uppercase tracking-wider border-b border-white/5 pb-2">
              Frequently Asked Questions
            </h3>
            <div className="space-y-4">
              {premiumPair.faqs.map((faq, i) => (
                <details key={i} className="group border border-white/5 rounded-xl bg-slate-900/40 p-4 transition-all">
                  <summary className="font-bold text-white text-sm md:text-base cursor-pointer list-none flex items-center justify-between focus:outline-none">
                    <span>{faq.question}</span>
                    <span className="text-violet-400 transition-transform duration-300 group-open:rotate-45 font-light text-xl">+</span>
                  </summary>
                  <p className="text-slate-400 text-xs md:text-sm font-medium leading-relaxed mt-3 pt-3 border-t border-white/5">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        )}
        {/* RELATED LINKS FOR HUB-AND-SPOKE SEO */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          {/* RELATED COMPARISONS */}
          {relatedComparisons.length > 0 && (
            <div className="p-6 md:p-8 rounded-2xl saas-glass border border-white/5 space-y-4">
              <h3 className="font-bold text-white text-base uppercase tracking-wider border-b border-white/5 pb-2 flex items-center gap-2">
                <Scale className="w-5 h-5 text-violet-400" />
                Related Comparisons
              </h3>
              <div className="space-y-3">
                {relatedComparisons.map((cp) => (
                  <button
                    key={cp.id}
                    onClick={() => navigateTo(`compare/${cp.id}`)}
                    className="w-full text-left text-sm font-bold text-slate-300 hover:text-white bg-slate-900/40 hover:bg-slate-900 border border-white/5 hover:border-violet-500/20 p-4 rounded-xl transition-all cursor-pointer block"
                  >
                    {cp.title}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* RELATED BLOG POSTS */}
          {relatedBlogs.length > 0 && (
            <div className="p-6 md:p-8 rounded-2xl saas-glass border border-white/5 space-y-4">
              <h3 className="font-bold text-white text-base uppercase tracking-wider border-b border-white/5 pb-2 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-violet-400" />
                Related AI Guides
              </h3>
              <div className="space-y-3">
                {relatedBlogs.map((blog) => (
                  <button
                    key={blog.id}
                    onClick={() => navigateTo(`blog/${blog.id}`)}
                    className="w-full text-left text-sm font-bold text-slate-300 hover:text-white bg-slate-900/40 hover:bg-slate-900 border border-white/5 hover:border-violet-500/20 p-4 rounded-xl transition-all cursor-pointer block line-clamp-1"
                  >
                    {blog.title}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
export default CompareDetail;

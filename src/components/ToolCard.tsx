import React from 'react';
import { ArrowUpRight, Star } from 'lucide-react';
import { ToolIcon } from './ToolIcon';

export interface AITool {
  id: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  pricing: 'Free' | 'Freemium' | 'Paid';
  pricingDetails: string;
  websiteUrl: string;
  features: string[];
  pros: string[];
  cons: string[];
  bestUseCases: string[];
  alternatives: string[];
  seoTitle: string;
  seoMetaDescription: string;
  slug: string;
  upvotes: number;
  iconBg?: string; // Optional backdrop color class
  isFeatured?: boolean;
  isEditorsPick?: boolean;
  rating?: number;
  tags?: string[];
}

interface ToolCardProps {
  tool: AITool;
  upvotes: number;
  hasUpvoted: boolean;
  onUpvote: (e: React.MouseEvent) => void;
  onClick: () => void;
}

export const ToolCard: React.FC<ToolCardProps> = ({
  tool,
  onClick
}) => {
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

  const handleCardClick = () => {
    if (tool.isFeatured) {
      import('../utils/firebase').then(({ logAnalyticsEvent }) => {
        logAnalyticsEvent('featured_click', window.location.pathname, tool.id);
      });
    }
    onClick();
  };

  return (
    <div 
      onClick={handleCardClick}
      className={`group flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 rounded-2xl border cursor-pointer gap-4 transition-all ${
        tool.isFeatured 
          ? 'bg-gradient-to-r from-violet-950/20 via-[#0d1222]/80 to-pink-950/10 border-violet-500/30 hover:border-violet-500/50 hover:shadow-[0_0_15px_rgba(139,92,246,0.15)] shadow-md' 
          : 'saas-glass border-white/5 saas-card-hover'
      }`}
    >
      <div className="flex items-start gap-4 flex-grow">
        {/* LOGO */}
        <ToolIcon toolId={tool.id} toolName={tool.name} category={tool.category} size="md" />

        {/* INFO */}
        <div className="space-y-1.5 flex-grow">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-bold text-white text-base md:text-lg group-hover:text-violet-400 transition-colors flex items-center gap-1.5">
              {tool.name}
              <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-violet-400" />
            </h3>
            
            {tool.isFeatured && (
              <span className="flex items-center gap-0.5 text-[9px] font-black text-white bg-gradient-to-r from-violet-600 to-pink-600 border border-violet-500/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                ★ Featured
              </span>
            )}

            {tool.isEditorsPick && (
              <span className="flex items-center gap-0.5 text-[9px] font-black text-violet-400 bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
                ✦ Editor's Pick
              </span>
            )}

            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${getPricingStyle(tool.pricing)}`}>
              {tool.pricing}
            </span>
          </div>

          <p className="text-slate-400 text-sm leading-relaxed line-clamp-2 pr-4 font-medium">
            {tool.tagline}
          </p>

          {/* TAGS */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            <span className="text-[10px] font-semibold text-violet-400 bg-violet-500/5 px-2 py-0.5 rounded border border-violet-500/10">
              {tool.category}
            </span>
            {tool.features.slice(0, 2).map((feat) => (
              <span key={feat} className="text-[10px] font-semibold text-slate-500 bg-slate-900 px-2 py-0.5 rounded border border-white/5">
                {feat}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* RATING */}
      <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto border-t sm:border-t-0 border-white/5 pt-3 sm:pt-0 gap-1 flex-shrink-0 self-stretch sm:self-center">
        <span className="sm:hidden text-xs text-slate-500 font-medium">Rating</span>
        <div className="flex items-center gap-1">
          <Star className="w-3.5 h-3.5 fill-current text-amber-400" />
          <span className="font-extrabold text-sm text-slate-200">{tool.rating || 4.7}</span>
        </div>
      </div>
    </div>
  );
};
export default ToolCard;

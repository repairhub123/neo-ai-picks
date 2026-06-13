import React from 'react';
import { 
  PenTool, 
  Code2, 
  Image as ImageIcon, 
  Film, 
  Briefcase, 
  Megaphone, 
  Cpu,
  Sparkles
} from 'lucide-react';

interface ToolIconProps {
  toolId: string;
  toolName: string;
  category: string;
  size?: 'sm' | 'md' | 'lg'; // sm = 40x40, md = 48x48 (default), lg = 80x80 (for details page)
}

export const ToolIcon: React.FC<ToolIconProps> = ({
  toolId,
  toolName,
  category,
  size = 'md'
}) => {
  const normId = toolId.toLowerCase();

  // Curated category colors for premium theme borders & gradients
  const categoryStyles: Record<string, { bg: string; border: string; text: string }> = {
    'Writing': {
      bg: 'bg-emerald-500/10 hover:bg-emerald-500/15',
      border: 'border-emerald-500/25 hover:border-emerald-500/40',
      text: 'text-emerald-400'
    },
    'Coding': {
      bg: 'bg-indigo-500/10 hover:bg-indigo-500/15',
      border: 'border-indigo-500/25 hover:border-indigo-500/40',
      text: 'text-indigo-400'
    },
    'Image Generation': {
      bg: 'bg-purple-500/10 hover:bg-purple-500/15',
      border: 'border-purple-500/25 hover:border-purple-500/40',
      text: 'text-purple-400'
    },
    'Video Generation': {
      bg: 'bg-rose-500/10 hover:bg-rose-500/15',
      border: 'border-rose-500/25 hover:border-rose-500/40',
      text: 'text-rose-400'
    },
    'Productivity': {
      bg: 'bg-blue-500/10 hover:bg-blue-500/15',
      border: 'border-blue-500/25 hover:border-blue-500/40',
      text: 'text-blue-400'
    },
    'Marketing': {
      bg: 'bg-amber-500/10 hover:bg-amber-500/15',
      border: 'border-amber-500/25 hover:border-amber-500/40',
      text: 'text-amber-400'
    },
    'Automation': {
      bg: 'bg-teal-500/10 hover:bg-teal-500/15',
      border: 'border-teal-500/25 hover:border-teal-500/40',
      text: 'text-teal-400'
    }
  };

  const style = categoryStyles[category] || {
    bg: 'bg-violet-500/10 hover:bg-violet-500/15',
    border: 'border-violet-500/25 hover:border-violet-500/40',
    text: 'text-violet-400'
  };

  // Dimensions classes
  const sizeClasses = {
    sm: 'w-10 h-10 rounded-xl text-xs',
    md: 'w-12 h-12 rounded-xl text-sm', // 48x48
    lg: 'w-20 h-20 rounded-2xl text-xl' // 80x80
  };

  const svgSizes = {
    sm: 'w-5.5 h-5.5',
    md: 'w-6 h-6',
    lg: 'w-10 h-10'
  };

  const svgClass = `${svgSizes[size]} transition-transform duration-300 group-hover:scale-105`;

  // Render official premium SVGs for priority tools
  const renderOfficialLogo = () => {
    switch (normId) {
      case 'chatgpt':
        return (
          <svg className={`${svgClass} text-emerald-400`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12a4.5 4.5 0 1 1-9 0M12 7.5a4.5 4.5 0 0 1 4.5 4.5M12 16.5a4.5 4.5 0 0 1-4.5-4.5M19.5 12c0-2.485-3.358-4.5-7.5-4.5S4.5 9.515 4.5 12s3.358 4.5 7.5 4.5 7.5-2.015 7.5-4.5Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18M3 12h18" />
          </svg>
        );
      case 'claude':
        return (
          <svg className={`${svgClass} text-amber-500`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c-1.2 2-3 4-6 5.5C4 9.5 3 11 3 13.5c0 4.14 4.03 7.5 9 7.5s9-3.36 9-7.5c0-2.5-1-4-3-5C15 7 13.2 5 12 3Z" />
            <circle cx="12" cy="13.5" r="3" />
          </svg>
        );
      case 'gemini':
        return (
          <svg className={`${svgClass} text-blue-400`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v6m0 6v6m-9-9h6m6 0h6m-3-6-3 3 3 3m-12 0 3-3-3-3" />
            <circle cx="12" cy="12" r="2.5" fill="currentColor" className="opacity-40" />
          </svg>
        );
      case 'cursor':
        return (
          <svg className={`${svgClass} text-slate-200`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l4.5-12 4.5 12M9 13.5h9" />
            <polygon points="12,4 18,10 6,10" className="fill-current opacity-20" />
          </svg>
        );
      case 'windsurf':
        return (
          <svg className={`${svgClass} text-sky-400`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 20c4-4 8-4 14 0M8 4c2 4 4 8 0 12M12 4c3 3 6 6 0 12" />
            <path d="M5 20c3-10 11-10 14 0" strokeDasharray="2 2" />
          </svg>
        );
      case 'perplexity':
        return (
          <svg className={`${svgClass} text-teal-400`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="9" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v8M8 12h8M9.5 9.5l5 5m-5 0l5-5" />
          </svg>
        );
      case 'midjourney':
        return (
          <svg className={`${svgClass} text-indigo-400`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 17.5c3-2 6-2 9 0s6 2 9 0M5 14.5c3.5-1.5 6.5-1.5 10 0s3.5 1.5 4 0M12 3v11M9 7l3-4 3 4" />
            <path d="M9 10h6L12 3Z" fill="currentColor" className="opacity-20" />
          </svg>
        );
      case 'flux':
        return (
          <svg className={`${svgClass} text-purple-400`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="8" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4c2.5 0 4.5 2 4.5 4.5S14.5 13 12 13M12 20c-2.5 0-4.5-2-4.5-4.5S9.5 11 12 11M4 12c0-2.5 2-4.5 4.5-4.5S13 9.5 13 12M20 12c0 2.5-2 4.5-4.5 4.5S11 14.5 11 12" />
          </svg>
        );
      case 'murf':
        return (
          <svg className={`${svgClass} text-pink-400`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 0 1-7 7m0 0a7 7 0 0 1-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 0 1-3-3V5a3 3 0 1 1 6 0v5a3 3 0 0 1-3 3Z" />
            <path d="M9 7h6M9 9h6" />
          </svg>
        );
      case 'runway':
        return (
          <svg className={`${svgClass} text-rose-400`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="m15 10 4.553-2.276A1 1 0 0 1 21 8.618v6.764a1 1 0 0 1-1.447.894L15 14M5 18h8a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2Z" />
            <circle cx="9" cy="12" r="2.5" fill="currentColor" className="opacity-20" />
          </svg>
        );
      case 'elevenlabs':
        return (
          <svg className={`${svgClass} text-teal-400`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 9h3.5l3 4.5 3-7 3 5 3-2.5h5.5" />
            <circle cx="16" cy="11" r="2" fill="currentColor" className="opacity-30" />
          </svg>
        );
      case 'github-copilot':
        return (
          <svg className={`${svgClass} text-violet-400`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0 1 12 6.8c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.14 20.16 22 16.42 22 12c0-5.523-4.477-10-10-10Z" />
          </svg>
        );
      default:
        return null;
    }
  };

  // Fallback category Lucide icons
  const renderCategoryIcon = () => {
    const iconProps = { className: svgClass };
    switch (category) {
      case 'Writing':
        return <PenTool {...iconProps} />;
      case 'Coding':
        return <Code2 {...iconProps} />;
      case 'Image Generation':
        return <ImageIcon {...iconProps} />;
      case 'Video Generation':
        return <Film {...iconProps} />;
      case 'Productivity':
        return <Briefcase {...iconProps} />;
      case 'Marketing':
        return <Megaphone {...iconProps} />;
      case 'Automation':
        return <Cpu {...iconProps} />;
      default:
        return <Sparkles {...iconProps} />;
    }
  };

  const officialLogo = renderOfficialLogo();

  return (
    <div 
      title={`${toolName} Logo`}
      aria-label={`${toolName} Logo`}
      className={`flex items-center justify-center flex-shrink-0 border transition-all duration-300 shadow-lg ${sizeClasses[size]} ${style.bg} ${style.border} ${style.text}`}
    >
      {officialLogo || renderCategoryIcon()}
    </div>
  );
};

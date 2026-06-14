import React from 'react';
import type { BlogTopic } from '../data/blog';
import type { AITool } from './ToolCard';
import { ToolIcon } from './ToolIcon';
import { PenTool, Code, Image, Video, Zap, TrendingUp, Cpu, BookOpen, Clock, Calendar } from 'lucide-react';

interface BlogCoverProps {
  post: BlogTopic;
  tools: AITool[];
  calculatedReadTime: string;
}

export const BlogCover: React.FC<BlogCoverProps> = ({ post, tools, calculatedReadTime }) => {
  // Find tools mentioned in title, excerpt, or dynamic content
  const mentionedTools = tools.filter((tool) => {
    return post.title.toLowerCase().includes(tool.name.toLowerCase()) ||
           post.excerpt.toLowerCase().includes(tool.name.toLowerCase());
  }).slice(0, 3);

  // Get category icon if no tools are mentioned
  const getCategoryIcon = (category: string) => {
    const iconClass = "w-6 h-6 text-violet-400";
    switch (category) {
      case 'Writing':
        return <PenTool className={iconClass} />;
      case 'Coding':
        return <Code className={iconClass} />;
      case 'Image Generation':
        return <Image className={iconClass} />;
      case 'Video Generation':
        return <Video className={iconClass} />;
      case 'Productivity':
        return <Zap className={iconClass} />;
      case 'Marketing':
        return <TrendingUp className={iconClass} />;
      case 'Automation':
        return <Cpu className={iconClass} />;
      default:
        return <BookOpen className={iconClass} />;
    }
  };

  return (
    <div className="w-full min-h-[120px] md:h-[160px] max-h-[140px] md:max-h-[180px] rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-[#0e1626] border border-white/5 relative overflow-hidden p-5 md:px-7 md:py-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      {/* Subtle background glow */}
      <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-violet-600/10 blur-3xl pointer-events-none" />
      <div className="absolute -left-10 -bottom-10 w-28 h-28 rounded-full bg-blue-600/5 blur-2xl pointer-events-none" />

      {/* Left side: Meta, Title, Authors */}
      <div className="flex flex-col gap-2 max-w-full md:max-w-[80%] text-left">
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-extrabold uppercase tracking-widest text-violet-400 bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 rounded-md">
            {post.category}
          </span>
        </div>

        <h1 className="text-lg md:text-xl lg:text-2xl font-extrabold text-white leading-tight tracking-tight">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center gap-2.5 text-[10px] sm:text-xs text-slate-400 font-semibold pt-1">
          <div className="flex items-center gap-1 text-slate-350">
            <div className="w-5 h-5 rounded-full bg-violet-500/20 border border-violet-500/40 flex items-center justify-center text-[9px] text-violet-400 font-extrabold uppercase">
              {post.author[0]}
            </div>
            <span>{post.author}</span>
          </div>
          <span className="text-slate-700 font-light">•</span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            {post.date}
          </span>
          <span className="text-slate-700 font-light">•</span>
          <span className="flex items-center gap-1 text-slate-350">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            {calculatedReadTime}
          </span>
        </div>
      </div>

      {/* Right side: Graphic icons */}
      <div className="flex-shrink-0 self-center md:self-auto flex items-center justify-center">
        {mentionedTools.length > 0 ? (
          <div className="flex items-center -space-x-2.5">
            {mentionedTools.map((tool) => (
              <div 
                key={tool.id} 
                className="w-10 h-10 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center shadow-xl hover:translate-y-[-2px] transition-transform duration-200"
                title={tool.name}
              >
                <ToolIcon toolId={tool.id} toolName={tool.name} category={tool.category} size="sm" />
              </div>
            ))}
          </div>
        ) : (
          <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shadow-lg">
            {getCategoryIcon(post.category)}
          </div>
        )}
      </div>
    </div>
  );
};

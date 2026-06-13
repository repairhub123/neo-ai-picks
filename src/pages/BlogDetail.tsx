import React, { useEffect } from 'react';
import { ChevronLeft, Sparkles, BookOpen, Scale, Tag } from 'lucide-react';
import { blogTopics, getDynamicContent } from '../data/blog';
import { comparisonPairs } from '../data/comparisons';
import type { AITool } from '../components/ToolCard';
import SEO from '../components/SEO';

interface BlogDetailProps {
  topicId: string;
  tools: AITool[];
  navigateTo: (tab: string, arg?: string) => void;
}

export const BlogDetail: React.FC<BlogDetailProps> = ({ topicId, tools, navigateTo }) => {
  const post = blogTopics.find((t) => t.id === topicId);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [topicId]);

  if (!post) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center space-y-4 text-white">
        <h2 className="text-2xl font-bold">Article Profile Not Found</h2>
        <button onClick={() => navigateTo('blog')} className="bg-violet-600 px-5 py-2.5 rounded-xl text-sm font-bold">
          Go Back to Blog
        </button>
      </div>
    );
  }

  const content = getDynamicContent(post);

  // Find featured tools in this article
  const featuredTools = tools.filter((tool) => {
    const titleMatch = post.title.toLowerCase().includes(tool.name.toLowerCase());
    const excerptMatch = post.excerpt.toLowerCase().includes(tool.name.toLowerCase());
    const contentMatch = content.toLowerCase().includes(tool.name.toLowerCase());
    return titleMatch || excerptMatch || contentMatch;
  }).slice(0, 3);

  // Find related comparisons
  const featuredToolIds = featuredTools.map((t) => t.id);
  const relatedComparisons = comparisonPairs.filter((cp) => {
    const hasFeaturedTool = featuredToolIds.includes(cp.toolAId) || featuredToolIds.includes(cp.toolBId);
    const categoryMatch = cp.category === post.category;
    return hasFeaturedTool || categoryMatch;
  }).slice(0, 3);

  // Find related blogs
  const relatedBlogs = blogTopics
    .filter((topic) => topic.id !== post.id && topic.category === post.category)
    .slice(0, 3);

  // Structured Data: BlogPosting Schema
  const blogPostingSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt,
    "author": {
      "@type": "Person",
      "name": post.author
    },
    "datePublished": "2026-06-12", // mock date ISO
    "publisher": {
      "@type": "Organization",
      "name": "Neo AI Picks",
      "logo": {
        "@type": "ImageObject",
        "url": "https://neoaipicks.com/favicon.svg"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://neoaipicks.com/blog/${post.id}`
    }
  };

  return (
    <div className="w-full flex-grow bg-[#0b0f19] pb-20 pt-8 px-6">
      <SEO
        title={`${post.title} | Neo AI Picks Blog`}
        description={post.excerpt}
        path={`/blog/${post.id}`}
        ogType="article"
        jsonLd={blogPostingSchema}
      />

      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* BACK TO FEED */}
        <button
          onClick={() => navigateTo('blog')}
          className="flex items-center gap-1.5 text-slate-400 hover:text-white text-sm font-semibold transition-all group w-fit cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Blog Feed
        </button>

        {/* THUMBNAIL BANNER */}
        <div className={`w-full aspect-[21/9] rounded-2xl bg-gradient-to-br ${post.imageBg} flex items-center justify-center p-8 text-center border border-white/5 relative overflow-hidden`}>
          <div className="absolute inset-0 bg-black/10" />
          <BookOpen className="w-24 h-24 text-white/5 absolute -bottom-6 -right-6 rotate-12" />
          <span className="relative font-black text-xl md:text-3xl text-white tracking-tight leading-tight select-none max-w-2xl">
            {post.title}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Article Content */}
          <div className="lg:col-span-8 space-y-6">
            {/* POST META DETAILS */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-violet-400 bg-violet-500/10 border border-violet-500/25 px-2.5 py-1 rounded-full">
                  {post.category}
                </span>
                <span className="text-xs text-slate-500 font-semibold">• {post.readTime}</span>
              </div>

              <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
                {post.title}
              </h1>

              <div className="flex items-center gap-4 text-xs text-slate-400 pb-4 border-b border-white/5">
                <div className="flex items-center gap-1.5 font-bold">
                  <div className="w-5 h-5 rounded-full bg-violet-500/20 border border-violet-500/40 flex items-center justify-center text-[10px] text-violet-400">
                    {post.author[0]}
                  </div>
                  {post.author}
                </div>
                <span>•</span>
                <span>Published on {post.date}</span>
              </div>
            </div>

            {/* ARTICLE BODY */}
            <div className="prose prose-invert prose-indigo max-w-none text-slate-300 space-y-6 leading-relaxed text-sm md:text-base font-medium">
              {content.split('\n\n').map((block, index) => {
                const trimmed = block.trim();
                
                // Heading 3
                if (trimmed.startsWith('### ')) {
                  return (
                    <h3 key={index} className="text-lg md:text-xl font-bold text-white pt-4 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-violet-400" />
                      {trimmed.substring(4)}
                    </h3>
                  );
                }

                // Bullet Point lists
                if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                  const lines = trimmed.split('\n');
                  return (
                    <ul key={index} className="list-disc list-inside space-y-2 text-slate-300 ml-2">
                      {lines.map((line, i) => {
                        const clean = line.replace(/^[-*]\s+/, '');
                        
                        if (clean.startsWith('**') && clean.includes('**:')) {
                          const splitIdx = clean.indexOf('**:');
                          const boldPart = clean.substring(2, splitIdx);
                          const restPart = clean.substring(splitIdx + 3);
                          return (
                            <li key={i} className="list-none flex items-start gap-2">
                              <span className="text-violet-400 mt-1.5 select-none">•</span>
                              <div>
                                <strong className="text-white font-bold">{boldPart}: </strong>
                                {restPart}
                              </div>
                            </li>
                          );
                        }
                        
                        return <li key={i}>{clean}</li>;
                      })}
                    </ul>
                  );
                }

                // Numbered lists
                if (/^\d+\.\s+/.test(trimmed)) {
                  const lines = trimmed.split('\n');
                  return (
                    <ol key={index} className="space-y-4 my-4">
                      {lines.map((line, i) => {
                        const clean = line.replace(/^\d+\.\s+/, '');
                        const boldSplit = clean.split('**:');
                        if (boldSplit.length > 1 && boldSplit[0].startsWith('**')) {
                          const title = boldSplit[0].replace(/^\*\*/, '');
                          return (
                            <li key={i} className="flex gap-3 bg-slate-900/30 border border-white/5 p-4 rounded-xl items-start">
                              <span className="w-6 h-6 bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-bold rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                                {i + 1}
                              </span>
                              <div>
                                <strong className="text-white block mb-1 font-bold text-sm">{title}</strong>
                                <span className="text-slate-300 text-sm leading-relaxed">{boldSplit[1].trim()}</span>
                              </div>
                            </li>
                          );
                        }
                        return (
                          <li key={i} className="list-decimal list-inside">
                            {clean}
                          </li>
                        );
                      })}
                    </ol>
                  );
                }

                // Paragraph
                return (
                  <p key={index} className="whitespace-pre-wrap leading-relaxed">
                    {trimmed.split('**').map((chunk, cIdx) => {
                      if (cIdx % 2 === 1) {
                        return <strong key={cIdx} className="text-white font-bold">{chunk}</strong>;
                      }
                      if (chunk.includes('`')) {
                        return chunk.split('`').map((codePart, cpIdx) => {
                          if (cpIdx % 2 === 1) {
                            return <code key={cpIdx} className="bg-slate-950 text-violet-300 border border-white/5 px-1.5 py-0.5 rounded text-xs">{codePart}</code>;
                          }
                          return codePart;
                        });
                      }
                      return chunk;
                    })}
                  </p>
                );
              })}
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="lg:col-span-4 space-y-8">
            {/* FEATURED TOOLS */}
            {featuredTools.length > 0 && (
              <div className="p-6 rounded-2xl saas-glass space-y-4">
                <h3 className="font-bold text-white text-sm uppercase tracking-wider border-b border-white/5 pb-2 flex items-center gap-1.5">
                  <Tag className="w-4 h-4 text-violet-400" />
                  Featured Tools
                </h3>
                <div className="space-y-3">
                  {featuredTools.map((tool) => (
                    <button
                      key={tool.id}
                      onClick={() => navigateTo(`tool/${tool.id}`)}
                      className="w-full flex items-center gap-3 bg-slate-900/40 hover:bg-slate-900 border border-white/5 hover:border-violet-500/20 p-3 rounded-xl transition-all cursor-pointer text-left block"
                    >
                      <div className="w-8 h-8 rounded-lg bg-violet-600/10 border border-violet-500/20 flex items-center justify-center flex-shrink-0 text-violet-400 font-extrabold text-[10px]">
                        {tool.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-white text-xs font-bold">{tool.name}</div>
                        <div className="text-slate-400 text-[10px] line-clamp-1">{tool.tagline}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* RELATED COMPARISONS */}
            {relatedComparisons.length > 0 && (
              <div className="p-6 rounded-2xl saas-glass space-y-4">
                <h3 className="font-bold text-white text-sm uppercase tracking-wider border-b border-white/5 pb-2 flex items-center gap-1.5">
                  <Scale className="w-4 h-4 text-violet-400" />
                  Popular Comparisons
                </h3>
                <div className="space-y-2.5">
                  {relatedComparisons.map((cp) => (
                    <button
                      key={cp.id}
                      onClick={() => navigateTo(`compare/${cp.id}`)}
                      className="w-full text-left text-xs font-semibold text-slate-350 hover:text-white bg-slate-900/40 hover:bg-slate-900 border border-white/5 hover:border-violet-500/20 p-3 rounded-xl transition-all cursor-pointer block text-ellipsis overflow-hidden whitespace-nowrap"
                    >
                      {cp.title}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* RELATED ARTICLES */}
            {relatedBlogs.length > 0 && (
              <div className="p-6 rounded-2xl saas-glass space-y-4">
                <h3 className="font-bold text-white text-sm uppercase tracking-wider border-b border-white/5 pb-2 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-violet-400" />
                  Related Guides
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
          </div>
        </div>

      </div>
    </div>
  );
};
export default BlogDetail;

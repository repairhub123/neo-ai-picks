import React, { useEffect, useState } from 'react';
import { ChevronLeft, BookOpen, Scale, Tag, Link as LinkIcon } from 'lucide-react';
import { blogTopics, getDynamicContent } from '../data/blog';
import { comparisonPairs } from '../data/comparisons';
import type { AITool } from '../components/ToolCard';
import SEO from '../components/SEO';
import Breadcrumbs from '../components/Breadcrumbs';

interface BlogDetailProps {
  topicId: string;
  tools: AITool[];
  navigateTo: (tab: string, arg?: string) => void;
}

// Inline Markdown Parser to dynamically support links [text](path) in SPA router
const parseInlineMarkdown = (text: string, navigateTo: (tab: string, arg?: string) => void) => {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = linkRegex.exec(text)) !== null) {
    const matchIndex = match.index;
    if (matchIndex > lastIndex) {
      parts.push(text.substring(lastIndex, matchIndex));
    }

    const linkText = match[1];
    const linkUrl = match[2];

    if (linkUrl.startsWith('/tool/')) {
      const toolId = linkUrl.substring(6);
      parts.push(
        <button
          key={matchIndex}
          onClick={() => navigateTo('tool', toolId)}
          className="text-violet-400 hover:text-violet-300 hover:underline font-bold bg-transparent border-none p-0 inline cursor-pointer text-left align-baseline"
        >
          {linkText}
        </button>
      );
    } else if (linkUrl.startsWith('/compare/')) {
      const compareId = linkUrl.substring(9);
      parts.push(
        <button
          key={matchIndex}
          onClick={() => navigateTo(`compare/${compareId}`)}
          className="text-violet-400 hover:text-violet-300 hover:underline font-bold bg-transparent border-none p-0 inline cursor-pointer text-left align-baseline"
        >
          {linkText}
        </button>
      );
    } else if (linkUrl.startsWith('http://') || linkUrl.startsWith('https://')) {
      parts.push(
        <a
          key={matchIndex}
          href={linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-violet-400 hover:text-violet-300 hover:underline font-bold align-baseline"
        >
          {linkText}
        </a>
      );
    } else {
      parts.push(linkText);
    }

    lastIndex = linkRegex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts.map((part, pIdx) => {
    if (typeof part !== 'string') return part;

    return (
      <span key={pIdx}>
        {part.split('**').map((chunk, cIdx) => {
          if (cIdx % 2 === 1) {
            return <strong key={cIdx} className="text-white font-bold">{chunk}</strong>;
          }
          if (chunk.includes('`')) {
            return chunk.split('`').map((codePart, cpIdx) => {
              if (cpIdx % 2 === 1) {
                return (
                  <code key={cpIdx} className="bg-slate-950 text-violet-300 border border-white/5 px-1.5 py-0.5 rounded text-xs font-semibold">
                    {codePart}
                  </code>
                );
              }
              return codePart;
            });
          }
          return chunk;
        })}
      </span>
    );
  });
};

export const BlogDetail: React.FC<BlogDetailProps> = ({ topicId, tools, navigateTo }) => {
  const post = blogTopics.find((t) => t.id === topicId);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [topicId]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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

  // Automatically calculate reading time based on word count
  const wordCount = content.split(/\s+/).length;
  const calculatedReadTime = Math.max(1, Math.ceil(wordCount / 200)) + ' min read';

  // Dynamically extract headings for Table of Contents
  const headings = content
    .split('\n\n')
    .filter((block) => block.trim().startsWith('### ') || block.trim().startsWith('## '))
    .map((block) => {
      const isH3 = block.trim().startsWith('### ');
      const rawText = isH3 ? block.trim().substring(4) : block.trim().substring(3);
      const text = rawText.trim();
      const anchor = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      return { text, anchor, isH3 };
    });

  // Previous / Next Navigation Finder
  const currentIndex = blogTopics.findIndex((t) => t.id === post.id);
  const prevPost = currentIndex > 0 ? blogTopics[currentIndex - 1] : null;
  const nextPost = currentIndex < blogTopics.length - 1 ? blogTopics[currentIndex + 1] : null;

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

  // Find related blogs for bottom grid
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
    <div className="w-full flex-grow bg-[#0b0f19] pb-20 pt-6 px-6">
      <SEO
        title={`${post.title} | Neo AI Picks Blog`}
        description={post.excerpt}
        path={`/blog/${post.id}`}
        ogType="article"
        jsonLd={blogPostingSchema}
      />

      <div className="max-w-[1200px] mx-auto space-y-6">
        
        {/* NAV BAR BACK & BREADCRUMBS */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-white/5 pb-4">
          <Breadcrumbs
            navigateTo={navigateTo}
            items={[
              { label: 'Blog', onClick: () => navigateTo('blog') },
              { label: post.title }
            ]}
          />
          <button
            onClick={() => navigateTo('blog')}
            className="flex items-center gap-1.5 text-slate-400 hover:text-white text-xs font-bold transition-all group w-fit cursor-pointer bg-transparent border-none p-0"
          >
            <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            Back to Blog Feed
          </button>
        </div>

        {/* 2-COLUMN MAIN LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-2">
          
          {/* Main Article Content */}
          <div className="lg:col-span-8 max-w-[800px] w-full mx-auto space-y-6">
            
            {/* POST HEADER */}
            <div className="space-y-4">
              <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider text-violet-400 bg-violet-500/10 border border-violet-500/20 px-2.5 py-1 rounded-full">
                {post.category}
              </span>

              <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight tracking-tight">
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center justify-between gap-4 py-2 border-y border-white/5 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-violet-500/20 border border-violet-500/40 flex items-center justify-center text-[10px] text-violet-450 font-bold uppercase">
                    {post.author[0]}
                  </div>
                  <span className="font-bold text-slate-200">{post.author}</span>
                  <span className="text-slate-650">•</span>
                  <span>Published {post.date}</span>
                  <span className="text-slate-650">•</span>
                  <span className="font-semibold text-slate-300">{calculatedReadTime}</span>
                </div>

                {/* SHARE BUTTONS */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title)}`, '_blank')}
                    className="p-2 rounded-xl bg-slate-900/60 border border-white/5 hover:border-violet-500/30 text-slate-400 hover:text-white transition-all cursor-pointer flex items-center justify-center w-8.5 h-8.5"
                    title="Share on Twitter"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank')}
                    className="p-2 rounded-xl bg-slate-900/60 border border-white/5 hover:border-violet-500/30 text-slate-400 hover:text-white transition-all cursor-pointer flex items-center justify-center w-8.5 h-8.5"
                    title="Share on LinkedIn"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0z"/>
                    </svg>
                  </button>
                  <button
                    onClick={handleCopyLink}
                    className="p-2 rounded-xl bg-slate-900/60 border border-white/5 hover:border-violet-500/30 text-slate-400 hover:text-white transition-all cursor-pointer flex items-center gap-1.5 text-[10px] font-bold"
                    title="Copy Article Link"
                  >
                    <LinkIcon className="w-3.5 h-3.5" />
                    {copied && <span className="text-violet-400 font-extrabold">Copied!</span>}
                  </button>
                </div>
              </div>
            </div>

            {/* THUMBNAIL BANNER (Reduced height, no duplicate text overlay) */}
            <div className={`w-full h-[200px] sm:h-[260px] max-h-[300px] rounded-2xl bg-gradient-to-br ${post.imageBg} border border-white/5 relative overflow-hidden`}>
              <div className="absolute inset-0 bg-black/15" />
              <BookOpen className="w-16 h-16 text-white/5 absolute -bottom-4 -right-4 rotate-12" />
            </div>

            {/* ARTICLE BODY */}
            <div className="text-slate-300 space-y-6 leading-[1.8] text-[18px] font-medium">
              {content.split('\n\n').map((block, index) => {
                const trimmed = block.trim();
                
                // Heading 2 (parsed from ### since it matches the primary sections of articles in blog.ts)
                if (trimmed.startsWith('### ')) {
                  const text = trimmed.substring(4);
                  const anchor = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                  return (
                    <h2 
                      key={index} 
                      id={anchor} 
                      className="text-[36px] font-extrabold text-white pt-8 pb-3 border-t border-white/5 mt-10 leading-tight tracking-tight scroll-mt-24"
                    >
                      {text}
                    </h2>
                  );
                }

                // Heading 3
                if (trimmed.startsWith('#### ')) {
                  const text = trimmed.substring(5);
                  const anchor = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                  return (
                    <h3 
                      key={index} 
                      id={anchor} 
                      className="text-[28px] font-extrabold text-white pt-6 pb-2 leading-tight tracking-tight scroll-mt-24"
                    >
                      {text}
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
                            <li key={i} className="list-none flex items-start gap-2 text-[18px]">
                              <span className="text-violet-400 mt-1.5 select-none">•</span>
                              <div>
                                <strong className="text-white font-bold">{boldPart}: </strong>
                                {parseInlineMarkdown(restPart.trim(), navigateTo)}
                              </div>
                            </li>
                          );
                        }
                        
                        return (
                          <li key={i} className="list-none flex items-start gap-2 text-[18px]">
                            <span className="text-violet-400 mt-1.5 select-none">•</span>
                            <div>{parseInlineMarkdown(clean, navigateTo)}</div>
                          </li>
                        );
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
                                <span className="text-slate-300 text-sm leading-relaxed">
                                  {parseInlineMarkdown(boldSplit[1].trim(), navigateTo)}
                                </span>
                              </div>
                            </li>
                          );
                        }
                        return (
                          <li key={i} className="list-decimal list-inside text-sm">
                            {parseInlineMarkdown(clean, navigateTo)}
                          </li>
                        );
                      })}
                    </ol>
                  );
                }

                // Paragraph
                return (
                  <p key={index} className="whitespace-pre-wrap leading-[1.8] text-[18px]">
                    {parseInlineMarkdown(trimmed, navigateTo)}
                  </p>
                );
              })}
            </div>

            {/* PREVIOUS / NEXT ARTICLE NAVIGATION */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center border-t border-white/5 pt-8 mt-12 text-sm">
              {prevPost ? (
                <button 
                  onClick={() => navigateTo(`blog/${prevPost.id}`)} 
                  className="text-slate-400 hover:text-white flex items-center gap-2 font-bold max-w-full sm:max-w-[45%] text-left bg-transparent border-none p-0 cursor-pointer"
                >
                  <span className="text-violet-400">←</span>
                  <span className="line-clamp-1">Previous: {prevPost.title}</span>
                </button>
              ) : <div className="hidden sm:block" />}
              {nextPost ? (
                <button 
                  onClick={() => navigateTo(`blog/${nextPost.id}`)} 
                  className="text-slate-400 hover:text-white flex items-center gap-2 font-bold max-w-full sm:max-w-[45%] text-right ml-auto bg-transparent border-none p-0 cursor-pointer"
                >
                  <span className="line-clamp-1">Next: {nextPost.title}</span>
                  <span className="text-violet-400">→</span>
                </button>
              ) : <div className="hidden sm:block" />}
            </div>

          </div>

          {/* Sticky Sidebar Column */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-8 self-start">
            
            {/* STICKY TABLE OF CONTENTS */}
            {headings.length > 0 && (
              <div className="p-6 rounded-2xl border border-white/5 bg-slate-900/30 backdrop-blur-md space-y-3">
                <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 border-b border-white/5 pb-2">
                  Table of Contents
                </h4>
                <ul className="space-y-2.5 text-xs font-bold">
                  {headings.map((h, i) => (
                    <li key={i}>
                      <a
                        href={`#${h.anchor}`}
                        className="text-slate-400 hover:text-violet-450 transition-colors block leading-snug"
                        onClick={(e) => {
                          e.preventDefault();
                          const target = document.getElementById(h.anchor);
                          if (target) {
                            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            window.history.pushState(null, '', `#${h.anchor}`);
                          }
                        }}
                      >
                        {h.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* FEATURED TOOLS */}
            {featuredTools.length > 0 && (
              <div className="p-6 rounded-2xl border border-white/5 bg-slate-900/30 backdrop-blur-md space-y-4">
                <h3 className="font-bold text-white text-[10px] uppercase tracking-widest border-b border-white/5 pb-2 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-violet-450" />
                  Featured Tools
                </h3>
                <div className="space-y-3">
                  {featuredTools.map((tool) => (
                    <button
                      key={tool.id}
                      onClick={() => navigateTo(`tool/${tool.id}`)}
                      className="w-full flex items-center gap-3 bg-slate-950/40 hover:bg-slate-950 border border-white/5 hover:border-violet-500/20 p-3 rounded-xl transition-all cursor-pointer text-left block"
                    >
                      <div className="w-8 h-8 rounded-lg bg-violet-600/10 border border-violet-500/20 flex items-center justify-center flex-shrink-0 text-violet-450 font-extrabold text-[10px]">
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
              <div className="p-6 rounded-2xl border border-white/5 bg-slate-900/30 backdrop-blur-md space-y-4">
                <h3 className="font-bold text-white text-[10px] uppercase tracking-widest border-b border-white/5 pb-2 flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5 text-violet-450" />
                  Popular Comparisons
                </h3>
                <div className="space-y-2.5">
                  {relatedComparisons.map((cp) => (
                    <button
                      key={cp.id}
                      onClick={() => navigateTo(`compare/${cp.id}`)}
                      className="w-full text-left text-[10px] font-bold text-slate-300 hover:text-white bg-slate-950/40 hover:bg-slate-950 border border-white/5 hover:border-violet-500/20 p-3 rounded-xl transition-all cursor-pointer block text-ellipsis overflow-hidden whitespace-nowrap"
                    >
                      {cp.title}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>

        {/* RELATED ARTICLES BOTTOM GRID */}
        {relatedBlogs.length > 0 && (
          <div className="border-t border-white/5 pt-12 mt-12 space-y-6">
            <h3 className="text-2xl font-extrabold text-white">Related Articles</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedBlogs.map((blog) => (
                <div
                  key={blog.id}
                  onClick={() => navigateTo(`blog/${blog.id}`)}
                  className="group flex flex-col justify-between p-5 rounded-2xl saas-glass border border-white/5 hover:border-violet-500/20 cursor-pointer transition-all duration-300"
                >
                  <div className="space-y-4">
                    <div className={`aspect-[16/9] rounded-xl bg-gradient-to-br ${blog.imageBg} flex items-center justify-center p-6 text-center border border-white/5 relative overflow-hidden`}>
                      <div className="absolute inset-0 bg-black/20" />
                      <span className="relative font-black text-sm text-white tracking-tight leading-tight select-none">
                        {blog.title}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] font-extrabold uppercase tracking-widest text-violet-450 bg-violet-500/10 border border-violet-500/25 px-2.5 py-1 rounded-full w-fit block">
                        {blog.category}
                      </span>
                      <h4 className="font-extrabold text-white text-sm leading-snug group-hover:text-violet-400 transition-colors line-clamp-2">
                        {blog.title}
                      </h4>
                      <p className="text-slate-400 text-xs line-clamp-2 font-medium">
                        {blog.excerpt}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default BlogDetail;

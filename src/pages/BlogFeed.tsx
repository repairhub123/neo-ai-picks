import React, { useState } from 'react';
import { BookOpen, Calendar, Clock, User, ChevronRight, Search, X } from 'lucide-react';
import { blogTopics } from '../data/blog';
import SEO from '../components/SEO';

interface BlogFeedProps {
  navigateTo: (tab: string, arg?: string) => void;
}

export const BlogFeed: React.FC<BlogFeedProps> = ({ navigateTo }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = [
    'All',
    'Writing',
    'Coding',
    'Image Generation',
    'Video Generation',
    'Productivity',
    'Marketing',
    'Automation'
  ];

  // Filtering
  const filteredTopics = blogTopics.filter((topic) => {
    const categoryMatch =
      selectedCategory === 'All' || topic.category === selectedCategory;

    const query = searchQuery.toLowerCase().trim();
    const searchMatch =
      query === '' ||
      topic.title.toLowerCase().includes(query) ||
      topic.excerpt.toLowerCase().includes(query);

    return categoryMatch && searchMatch;
  });

  const featuredPost = filteredTopics[0];
  const gridPosts = filteredTopics.slice(1);

  // Structured Data: Blog Schema
  const blogListSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Neo AI Picks Blog",
    "description": "Daily reviews, prompts, guides, and tutorials exploring generative AI applications.",
    "url": "https://neoaipicks.com/blog"
  };

  return (
    <div className="w-full flex-grow bg-[#0b0f19] pb-20 pt-8 px-6 relative">
      <SEO
        title="AI Industry Blog, Benchmarks & Prompt Tutorials | Neo AI Picks"
        description="Browse 100 SEO-focused blog topics detailing coding assistants benchmarks, Midjourney photorealism prompt templates, productivity workflows, and voice dubbing tutorials."
        path="/blog"
        jsonLd={blogListSchema}
      />

      {/* BACKGROUND ORB */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[350px] h-[350px] bg-violet-600/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* HEADER */}
        <div className="text-center space-y-3">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
            AI Technology & Strategy Blog
          </h1>
          <p className="text-sm md:text-base text-slate-400 max-w-lg mx-auto leading-relaxed">
            Read professional guides, benchmarks, and tutorials for generative applications.
          </p>

          {/* SEARCH BAR */}
          <div className="max-w-md mx-auto relative group pt-4">
            <div className="relative flex items-center">
              <Search className="absolute left-3.5 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search 100 topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-white/5 focus:border-violet-500 rounded-xl py-2.5 pl-10 pr-10 text-white text-xs placeholder-slate-600 focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 p-1 rounded-full text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* CATEGORIES BAR */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar border-b border-white/5">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  isActive
                    ? 'bg-violet-600 border-violet-500 text-white'
                    : 'bg-slate-900/40 hover:bg-slate-900 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* EMPTY STATE */}
        {filteredTopics.length === 0 && (
          <div className="p-16 text-center rounded-2xl saas-glass">
            <p className="text-slate-400 font-medium">No articles found matching your criteria.</p>
          </div>
        )}

        {/* FEATURED POST */}
        {featuredPost && (
          <div
            onClick={() => navigateTo(`blog/${featuredPost.id}`)}
            className="group grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 rounded-2xl saas-glass saas-card-hover cursor-pointer overflow-hidden transition-all duration-300"
          >
            {/* THUMBNAIL */}
            <div className={`lg:col-span-5 aspect-[16/10] lg:aspect-auto rounded-xl bg-gradient-to-br ${featuredPost.imageBg} flex items-center justify-center p-8 text-center border border-white/5 relative overflow-hidden group-hover:scale-[1.01] transition-transform`}>
              <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px]" />
              <BookOpen className="w-16 h-16 text-white/20 absolute -bottom-4 -right-4 rotate-12" />
              <span className="relative font-black text-xl md:text-2xl text-white tracking-tight leading-tight select-none">
                {featuredPost.title}
              </span>
            </div>

            {/* CONTENT */}
            <div className="lg:col-span-7 flex flex-col justify-between py-2 space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-violet-400 bg-violet-500/10 border border-violet-500/25 px-2.5 py-1 rounded-full">
                    {featuredPost.category}
                  </span>
                  <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Featured Article</span>
                </div>
                <h2 className="text-xl md:text-2xl font-black text-white group-hover:text-violet-400 transition-colors leading-tight">
                  {featuredPost.title}
                </h2>
                <p className="text-slate-400 text-xs md:text-sm leading-relaxed font-medium">
                  {featuredPost.excerpt}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-between border-t border-white/5 pt-4 gap-4 text-xs text-slate-500">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5 font-bold">
                    <User className="w-3.5 h-3.5 text-violet-400" />
                    {featuredPost.author}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {featuredPost.date}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {featuredPost.readTime}
                  </span>
                </div>
                <span className="text-violet-400 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Read Article
                  <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </div>
        )}

        {/* GRID OF OTHER POSTS */}
        {gridPosts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gridPosts.map((post) => (
              <div
                key={post.id}
                onClick={() => navigateTo(`blog/${post.id}`)}
                className="group flex flex-col justify-between p-5 rounded-2xl saas-glass saas-card-hover cursor-pointer transition-all duration-300"
              >
                <div className="space-y-4">
                  {/* THUMBNAIL */}
                  <div className={`aspect-[16/9] rounded-xl bg-gradient-to-br ${post.imageBg} flex items-center justify-center p-6 text-center border border-white/5 relative overflow-hidden group-hover:scale-[1.01] transition-transform`}>
                    <div className="absolute inset-0 bg-black/10" />
                    <span className="relative font-black text-sm md:text-base text-white tracking-tight leading-tight select-none">
                      {post.title}
                    </span>
                  </div>

                  {/* INFO */}
                  <div className="space-y-2">
                    <span className="text-[9px] font-extrabold uppercase tracking-widest text-violet-400 bg-violet-500/10 border border-violet-500/25 px-2.5 py-1 rounded-full w-fit block">
                      {post.category}
                    </span>
                    <h3 className="font-extrabold text-white text-base leading-snug group-hover:text-violet-400 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-slate-400 text-xs leading-relaxed line-clamp-2 font-medium">
                      {post.excerpt}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-6 text-xs text-slate-500">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 font-bold">
                      <User className="w-3 h-3 text-violet-400" />
                      {post.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readTime}
                    </span>
                  </div>
                  <span className="text-violet-400 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Read
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
export default BlogFeed;

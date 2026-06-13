import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import ToolDetail from './pages/ToolDetail';
import CompareFeed from './pages/CompareFeed';
import CompareDetail from './pages/CompareDetail';
import SubmitTool from './pages/SubmitTool';
import BlogFeed from './pages/BlogFeed';
import BlogDetail from './pages/BlogDetail';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import NotFound from './pages/NotFound';
import toolsData from './data/tools.json';
import type { AITool } from './components/ToolCard';

interface RouteState {
  path: string;
  param?: string;
}

function App() {
  const [currentRoute, setCurrentRoute] = useState<RouteState>({ path: 'home' });
  const [tools, setTools] = useState<AITool[]>([]);
  const [upvotesState, setUpvotesState] = useState<Record<string, number>>({});
  const [upvotedTools, setUpvotedTools] = useState<Set<string>>(new Set());

  // Search & category states shared across pages
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Tools');

  // Initialize tools and upvotes
  useEffect(() => {
    // Cast toolsData to AITool[]
    const typedTools = (toolsData as any[]).map((t, idx) => ({
      ...t,
      isFeatured: idx < 4 || t.id === 'cursor' || t.id === 'flux' || t.id === 'gemini',
      isEditorsPick: t.id === 'chatgpt' || t.id === 'claude' || t.id === 'cursor' || t.id === 'perplexity' || t.id === 'midjourney' || t.id === 'elevenlabs',
      rating: t.rating || parseFloat((4.5 + (idx % 5) * 0.1).toFixed(1)),
      releaseDate: `2026-05-${Math.max(1, 30 - idx)}`,
      upvotes: t.upvotes || Math.max(10, 280 - idx * 8)
    })) as AITool[];

    setTools(typedTools);

    const initialVotes: Record<string, number> = {};
    typedTools.forEach((t) => {
      initialVotes[t.id] = t.upvotes;
    });
    setUpvotesState(initialVotes);
  }, []);

  // Browser History API Listener
  useEffect(() => {
    const handlePopState = () => {
      const pathname = window.location.pathname;
      if (pathname === '/compare') {
        setCurrentRoute({ path: 'compare' });
      } else if (pathname.startsWith('/compare/')) {
        const id = pathname.substring(9);
        setCurrentRoute({ path: 'compare-detail', param: id });
      } else if (pathname === '/blog') {
        setCurrentRoute({ path: 'blog' });
      } else if (pathname.startsWith('/blog/')) {
        const id = pathname.substring(6);
        setCurrentRoute({ path: 'blog-detail', param: id });
      } else if (pathname === '/submit') {
        setCurrentRoute({ path: 'submit' });
      } else if (pathname === '/contact') {
        setCurrentRoute({ path: 'contact' });
      } else if (pathname === '/privacy') {
        setCurrentRoute({ path: 'privacy' });
      } else if (pathname === '/terms') {
        setCurrentRoute({ path: 'terms' });
      } else if (pathname.startsWith('/tool/')) {
        const id = pathname.substring(6);
        setCurrentRoute({ path: 'tool', param: id });
      } else if (pathname === '/' || pathname === '') {
        setCurrentRoute({ path: 'home' });
      } else {
        setCurrentRoute({ path: '404' });
      }
    };

    window.addEventListener('popstate', handlePopState);
    
    // Run once on load to sync initial page view
    handlePopState();

    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // History Navigation Trigger
  const navigateTo = (path: string, param?: string) => {
    let url = '/';
    let routePath = 'home';
    let routeParam = param;

    if (path === 'compare') {
      url = '/compare';
      routePath = 'compare';
    } else if (path.startsWith('compare/')) {
      const cmpId = param || path.split('/')[1];
      url = `/compare/${cmpId}`;
      routePath = 'compare-detail';
      routeParam = cmpId;
    } else if (path === 'blog') {
      url = '/blog';
      routePath = 'blog';
    } else if (path.startsWith('blog/')) {
      const bSlug = param || path.split('/')[1];
      url = `/blog/${bSlug}`;
      routePath = 'blog-detail';
      routeParam = bSlug;
    } else if (path === 'submit') {
      url = '/submit';
      routePath = 'submit';
    } else if (path === 'contact') {
      url = '/contact';
      routePath = 'contact';
    } else if (path === 'privacy') {
      url = '/privacy';
      routePath = 'privacy';
    } else if (path === 'terms') {
      url = '/terms';
      routePath = 'terms';
    } else if (path === '404') {
      url = '/404';
      routePath = '404';
    } else if (path === 'tool' || path.startsWith('tool')) {
      const tId = param || path.split('/')[1];
      url = `/tool/${tId}`;
      routePath = 'tool';
      routeParam = tId;
    }

    window.history.pushState({}, '', url);
    setCurrentRoute({ path: routePath, param: routeParam });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Upvote logic
  const handleUpvote = (toolId: string) => {
    setUpvotedTools((prev) => {
      const next = new Set(prev);
      const isUpvoted = next.has(toolId);

      setUpvotesState((prevVotes) => {
        const current = prevVotes[toolId] ?? 0;
        return {
          ...prevVotes,
          [toolId]: isUpvoted ? Math.max(0, current - 1) : current + 1
        };
      });

      if (isUpvoted) {
        next.delete(toolId);
      } else {
        next.add(toolId);
      }
      return next;
    });
  };

  // Add Tool logic
  const handleAddTool = (newTool: Omit<AITool, 'id' | 'iconBg'>) => {
    const newId = newTool.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const bgs = ['bg-emerald-600', 'bg-slate-800', 'bg-purple-600', 'bg-rose-600', 'bg-blue-600', 'bg-amber-600', 'bg-teal-600'];
    const randomBg = bgs[Math.floor(Math.random() * bgs.length)];

    const fullTool: AITool = {
      ...newTool,
      id: newId,
      iconBg: randomBg,
      upvotes: 1,
      pros: ['Intuitive front-end configuration options.', 'Fast API routing loops.', 'Active community presets.'],
      cons: ['Free plan limits are reached quickly.', 'No local offline model executions.', 'High costs under scale.'],
      bestUseCases: ['Speeding up daily workspace tasks.', 'Creating localized content prototypes.'],
      alternatives: ['ChatGPT', 'Claude'],
      seoTitle: `${newTool.name} - Features, Pricing & Reviews | Neo AI Picks`,
      seoMetaDescription: `Explore details for ${newTool.name} in Neo AI Picks. Compare features, pricing structures, and read client reviews.`,
      slug: newId
    };

    setTools((prev) => [fullTool, ...prev]);
    setUpvotesState((prev) => ({
      ...prev,
      [newId]: 1
    }));
  };

  const renderPage = () => {
    switch (currentRoute.path) {
      case 'home':
        return (
          <Home
            tools={tools}
            upvotesState={upvotesState}
            upvotedTools={upvotedTools}
            onUpvote={handleUpvote}
            navigateTo={navigateTo}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        );
      case 'tool':
        return (
          <ToolDetail
            toolId={currentRoute.param || ''}
            tools={tools}
            upvotesState={upvotesState}
            upvotedTools={upvotedTools}
            onUpvote={handleUpvote}
            navigateTo={navigateTo}
          />
        );
      case 'compare':
        return <CompareFeed navigateTo={navigateTo} />;
      case 'compare-detail':
        return (
          <CompareDetail
            comparisonId={currentRoute.param || ''}
            tools={tools}
            navigateTo={navigateTo}
          />
        );
      case 'submit':
        return <SubmitTool onAddTool={handleAddTool} navigateTo={navigateTo} />;
      case 'blog':
        return <BlogFeed navigateTo={navigateTo} />;
      case 'blog-detail':
        return <BlogDetail topicId={currentRoute.param || ''} tools={tools} navigateTo={navigateTo} />;
      case 'contact':
        return <Contact navigateTo={navigateTo} />;
      case 'privacy':
        return <Privacy navigateTo={navigateTo} />;
      case 'terms':
        return <Terms navigateTo={navigateTo} />;
      case '404':
      default:
        return <NotFound navigateTo={navigateTo} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0f19] text-slate-100">
      <Navbar 
        currentTab={
          currentRoute.path === 'tool' ? 'home' : 
          currentRoute.path === 'compare-detail' ? 'compare' : 
          currentRoute.path === 'blog-detail' ? 'blog' : 
          currentRoute.path
        } 
        navigateTo={navigateTo} 
      />

      <main className="flex-grow flex flex-col">
        {renderPage()}
      </main>

      <Footer navigateTo={navigateTo} />
    </div>
  );
}

export default App;

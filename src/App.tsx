import { useState, useEffect, lazy, Suspense } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { FeatureRequestModal } from './components/FeatureRequestModal';
import toolsData from './data/tools.json';
import type { AITool } from './components/ToolCard';
import { initGA, trackEvent } from './utils/analytics';

// ─── Eagerly loaded: lightweight shell pages ──────────────────────────────────
import Home from './pages/Home';
import NotFound from './pages/NotFound';

// ─── Lazily loaded: heavy feature pages ──────────────────────────────────────
const ToolDetail     = lazy(() => import('./pages/ToolDetail'));
const CompareFeed    = lazy(() => import('./pages/CompareFeed'));
const CompareDetail  = lazy(() => import('./pages/CompareDetail'));
const SubmitTool     = lazy(() => import('./pages/SubmitTool'));
const BlogFeed       = lazy(() => import('./pages/BlogFeed'));
const BlogDetail     = lazy(() => import('./pages/BlogDetail'));
const Contact        = lazy(() => import('./pages/Contact'));
const Privacy        = lazy(() => import('./pages/Privacy'));
const Terms          = lazy(() => import('./pages/Terms'));
const About          = lazy(() => import('./pages/About'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard').then(m => ({ default: m.AdminDashboard })));

interface RouteState {
  path: string;
  param?: string;
}

function App() {
  const [currentRoute, setCurrentRoute] = useState<RouteState>({ path: 'home' });
  const [tools, setTools] = useState<AITool[]>([]);
  const [upvotesState, setUpvotesState] = useState<Record<string, number>>({});
  const [upvotedTools, setUpvotedTools] = useState<Set<string>>(() => {
    const storedBookmarks = localStorage.getItem('neo_bookmarks');
    if (storedBookmarks) {
      try {
        const parsedBookmarks = JSON.parse(storedBookmarks) as string[];
        return new Set(parsedBookmarks);
      } catch (e) {
        console.error('Failed to parse cached bookmarks:', e);
      }
    }
    return new Set();
  });
  
  // Featured Request Modal states
  const [isFeatureModalOpen, setIsFeatureModalOpen] = useState(false);
  const [prefillToolName, setPrefillToolName] = useState('');
  const [prefillToolUrl, setPrefillToolUrl] = useState('');

  // Search & category states shared across pages
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Tools');

  const refreshToolsList = async () => {
    // 2. Cast and load base tools
    const baseTools = (toolsData as unknown as Partial<AITool>[]).map((t, idx) => ({
      ...t,
      isFeatured: idx < 4 || t.id === 'cursor' || t.id === 'flux' || t.id === 'gemini',
      isEditorsPick: t.id === 'chatgpt' || t.id === 'claude' || t.id === 'cursor' || t.id === 'perplexity' || t.id === 'midjourney' || t.id === 'elevenlabs',
      rating: t.rating || parseFloat((4.5 + (idx % 5) * 0.1).toFixed(1)),
      releaseDate: `2026-05-${Math.max(1, 30 - idx)}`,
      upvotes: t.upvotes || Math.max(10, 280 - idx * 8)
    })) as AITool[];

    // 3. Load user-submitted tools from localStorage
    let submittedTools: AITool[] = [];
    const storedSubmissions = localStorage.getItem('neo_submitted_tools');
    if (storedSubmissions) {
      try {
        submittedTools = JSON.parse(storedSubmissions);
      } catch (e) {
        console.error('Failed to parse submitted tools:', e);
      }
    }

    const allTools = [...submittedTools, ...baseTools];

    // 4. Fetch database status overrides
    try {
      const { getFeaturedToolsStatus } = await import('./utils/firebase');
      const dbStatus = await getFeaturedToolsStatus();
      
      const mergedTools = allTools.map(t => {
        const override = dbStatus[t.id];
        if (override) {
          // Check expiry date
          if (override.expiryDate && new Date(override.expiryDate).getTime() < Date.now()) {
            return { ...t, isFeatured: false }; // Expired!
          }
          return { ...t, isFeatured: override.isFeatured };
        }
        return t;
      });

      // Sort: featured tools first
      const sorted = [...mergedTools].sort((a, b) => {
        const featA = a.isFeatured ? 1 : 0;
        const featB = b.isFeatured ? 1 : 0;
        return featB - featA; // featured first
      });
      setTools(sorted);

      return sorted;
    } catch (err) {
      console.error('Failed to load db overrides:', err);
      // Fallback sorting
      const sorted = [...allTools].sort((a, b) => {
        const featA = a.isFeatured ? 1 : 0;
        const featB = b.isFeatured ? 1 : 0;
        return featB - featA;
      });
      setTools(sorted);
      return sorted;
    }
  };

  // Initialize tools, upvotes, bookmarks, and analytics
  useEffect(() => {
    // 1. Initialize GA4
    initGA();

    // 2. Load bookmarks from localStorage (moved to useState initializer)

    // 3. Load all tools and initialize upvotes
    const initializeData = async () => {
      const loadedTools = await refreshToolsList();
      
      const initialVotes: Record<string, number> = {};
      loadedTools.forEach((t) => {
        initialVotes[t.id] = t.upvotes;
      });

      const storedUpvotes = localStorage.getItem('neo_upvotes');
      if (storedUpvotes) {
        try {
          const parsedUpvotes = JSON.parse(storedUpvotes);
          Object.keys(parsedUpvotes).forEach((key) => {
            initialVotes[key] = parsedUpvotes[key];
          });
        } catch (e) {
          console.error('Failed to parse cached upvotes:', e);
        }
      }
      setUpvotesState(initialVotes);
    };

    initializeData();
  }, []);

  // Save upvotes to localStorage on change
  useEffect(() => {
    if (Object.keys(upvotesState).length > 0) {
      localStorage.setItem('neo_upvotes', JSON.stringify(upvotesState));
    }
  }, [upvotesState]);

  // Save bookmarks to localStorage on change
  useEffect(() => {
    localStorage.setItem('neo_bookmarks', JSON.stringify(Array.from(upvotedTools)));
  }, [upvotedTools]);


  // Analytics Page View Tracker
  useEffect(() => {
    import('./utils/firebase').then(({ logAnalyticsEvent }) => {
      logAnalyticsEvent('page_view', window.location.pathname, currentRoute.param || '');
    });
  }, [currentRoute]);

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
      } else if (pathname === '/about') {
        setCurrentRoute({ path: 'about' });
      } else if (pathname === '/admin') {
        setCurrentRoute({ path: 'admin' });
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
    } else if (path === 'about') {
      url = '/about';
      routePath = 'about';
    } else if (path === 'admin') {
      url = '/admin';
      routePath = 'admin';
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

  const handleOpenFeatureModal = (toolName = '', toolUrl = '') => {
    setPrefillToolName(toolName);
    setPrefillToolUrl(toolUrl);
    setIsFeatureModalOpen(true);
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

    setTools((prev) => {
      const updated = [fullTool, ...prev];
      // Filter out base tools to only save user submitted ones
      const userSubmitted = updated.filter(t => !toolsData.some((orig: { id: string }) => orig.id === t.id));
      localStorage.setItem('neo_submitted_tools', JSON.stringify(userSubmitted));
      return updated;
    });

    setUpvotesState((prev) => ({
      ...prev,
      [newId]: 1
    }));

    // Track submission in Google Analytics
    trackEvent('submit_tool', 'Engagement', fullTool.name);
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
            onOpenFeatureModal={() => handleOpenFeatureModal()}
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
            onOpenFeatureModal={(name?: string, url?: string) => handleOpenFeatureModal(name, url)}
          />
        );
      case 'compare':
        return <CompareFeed tools={tools} navigateTo={navigateTo} />;
      case 'compare-detail':
        return (
          <CompareDetail
            comparisonId={currentRoute.param || ''}
            tools={tools}
            navigateTo={navigateTo}
          />
        );
      case 'submit':
        return (
          <SubmitTool 
            onAddTool={handleAddTool} 
            navigateTo={navigateTo} 
            onOpenFeatureModal={() => handleOpenFeatureModal()}
          />
        );
      case 'admin':
        return (
          <AdminDashboard 
            tools={tools} 
            onRefreshTools={refreshToolsList} 
            navigateTo={navigateTo} 
          />
        );
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
      case 'about':
        return <About navigateTo={navigateTo} />;
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
        <Suspense
          fallback={
            <div className="w-full flex-grow flex items-center justify-center bg-[#0b0f19] py-32">
              <div className="flex flex-col items-center gap-4">
                <div className="w-8 h-8 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
                <p className="text-slate-600 text-xs font-semibold tracking-wider">Loading…</p>
              </div>
            </div>
          }
        >
          {renderPage()}
        </Suspense>
      </main>

      <Footer navigateTo={navigateTo} />

      <FeatureRequestModal
        isOpen={isFeatureModalOpen}
        onClose={() => setIsFeatureModalOpen(false)}
        prefilledToolName={prefillToolName}
        prefilledToolUrl={prefillToolUrl}
      />
    </div>
  );
}

export default App;

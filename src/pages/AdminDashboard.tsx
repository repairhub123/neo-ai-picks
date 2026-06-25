import React, { useState, useEffect } from 'react';
import { 
  Key, 
  ShieldAlert, 
  Check, 
  X, 
  Calendar, 
  BarChart3, 
  MousePointerClick, 
  Eye, 
  Sparkles,
  RefreshCw,
  Trash2
} from 'lucide-react';
import SEO from '../components/SEO';
import { 
  getFeatureRequests, 
  updateFeatureRequestStatus, 
  getFeaturedToolsStatus, 
  updateToolFeaturedStatus,
  getAnalyticsSummary
} from '../utils/firebase';
import type { 
  FeatureRequest,
  ToolFeaturedStatus,
  AnalyticsSummary
} from '../utils/firebase';
import type { AITool } from '../components/ToolCard';

interface AdminDashboardProps {
  tools: AITool[];
  onRefreshTools: () => void;
  navigateTo: (path: string, param?: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  tools, 
  onRefreshTools
}) => {
  // Pure current timestamp for rendering
  const [now] = useState(() => Date.now());

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');

  // Data States
  const [requests, setRequests] = useState<FeatureRequest[]>([]);
  const [featuredStatus, setFeaturedStatus] = useState<Record<string, ToolFeaturedStatus>>({});
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [activeTab, setActiveTab] = useState<'requests' | 'tools' | 'analytics' | 'payments'>('requests');
  const [isLoading, setIsLoading] = useState(false);

  // Manage Tool Expiry dates
  const [expiryDates, setExpiryDates] = useState<Record<string, string>>({});

  // 2. Load DB Data
  const loadAdminData = async () => {
    setIsLoading(true);
    try {
      const [reqList, statusMap, summary] = await Promise.all([
        getFeatureRequests(),
        getFeaturedToolsStatus(),
        getAnalyticsSummary(tools)
      ]);
      
      setRequests(reqList);
      setFeaturedStatus(statusMap);
      setAnalytics(summary);
      
      // Initialize expiry dates inputs
      const initialExpiries: Record<string, string> = {};
      tools.forEach(t => {
        const status = statusMap[t.id];
        if (status && status.expiryDate) {
          initialExpiries[t.id] = status.expiryDate.split('T')[0];
        }
      });
      setExpiryDates(initialExpiries);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // 1. Check existing Auth
  useEffect(() => {
    const isAuthed = sessionStorage.getItem('neo_admin_authed') === 'true';
    if (isAuthed) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsAuthenticated(true);
      loadAdminData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPasscode = import.meta.env.VITE_ADMIN_PASSCODE || 'admin123';
    
    if (passcode === correctPasscode) {
      sessionStorage.setItem('neo_admin_authed', 'true');
      setIsAuthenticated(true);
      setAuthError('');
      loadAdminData();
    } else {
      setAuthError('Incorrect passcode. Please try again.');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('neo_admin_authed');
    setIsAuthenticated(false);
    setPasscode('');
  };

  // 3. Action Handlers
  const handleApproveRequest = async (requestId: string, toolId: string) => {
    const defaultExpiry = new Date();
    defaultExpiry.setDate(defaultExpiry.getDate() + 30); // 30 days default
    const expiryStr = defaultExpiry.toISOString();

    try {
      await updateFeatureRequestStatus(requestId, 'approved', expiryStr);
      // Map to correct ID if user submitted tool or it matches an existing tool
      const targetToolId = toolId.toLowerCase().replace(/\s+/g, '-');
      await updateToolFeaturedStatus(targetToolId, true, expiryStr);
      
      onRefreshTools();
      loadAdminData();
    } catch (err) {
      console.error('Approval failed:', err);
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    if (!confirm('Are you sure you want to reject this request?')) return;
    try {
      await updateFeatureRequestStatus(requestId, 'rejected');
      loadAdminData();
    } catch (err) {
      console.error('Rejection failed:', err);
    }
  };

  const handleToggleToolFeatured = async (toolId: string, currentVal: boolean) => {
    const isNewFeatured = !currentVal;
    let expiryStr: string | null = null;

    if (isNewFeatured) {
      const defaultExpiry = new Date();
      defaultExpiry.setDate(defaultExpiry.getDate() + 30); // 30 days default
      expiryStr = defaultExpiry.toISOString();
    }

    try {
      await updateToolFeaturedStatus(toolId, isNewFeatured, expiryStr);
      onRefreshTools();
      loadAdminData();
    } catch (err) {
      console.error('Toggle featured failed:', err);
    }
  };

  const handleUpdateExpiry = async (toolId: string) => {
    const dateVal = expiryDates[toolId];
    if (!dateVal) return;

    try {
      const expiryStr = new Date(dateVal).toISOString();
      await updateToolFeaturedStatus(toolId, true, expiryStr);
      onRefreshTools();
      loadAdminData();
      alert('Featured expiry date updated successfully!');
    } catch (err) {
      console.error('Update expiry failed:', err);
    }
  };

  const handleClearExpiry = async (toolId: string) => {
    try {
      await updateToolFeaturedStatus(toolId, true, null); // featured forever
      onRefreshTools();
      loadAdminData();
    } catch (err) {
      console.error('Clear expiry failed:', err);
    }
  };

  interface MockCheckout {
    sessionId: string;
    toolId: string;
    email: string;
    planType: 'featured_monthly' | 'featured_lifetime';
    verified: boolean;
    timestamp: string;
  }

  // Mock checkout session list loader
  const getMockCheckouts = (): MockCheckout[] => {
    return JSON.parse(localStorage.getItem('neo_mock_pending_payments') || '[]');
  };

  const handleClearMockCheckouts = () => {
    if (confirm('Clear all simulated checkouts history?')) {
      localStorage.removeItem('neo_mock_pending_payments');
      loadAdminData();
    }
  };

  // 4. Auth Screen Render
  if (!isAuthenticated) {
    return (
      <div className="w-full flex-grow bg-[#0b0f19] flex items-center justify-center py-20 px-6">
        <SEO title="Admin Login | Neo AI Picks" description="Secure passcode portal to access dashboard." path="/admin" />
        
        <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#0d1222] p-8 shadow-2xl">
          <div className="absolute -right-20 -top-20 -z-10 h-40 w-40 rounded-full bg-violet-600/10 blur-[60px]" />
          
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20">
              <ShieldAlert className="h-6 w-6" />
            </div>
            
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-white">Admin Dashboard</h2>
              <p className="text-xs text-slate-400">Enter your administration passcode to proceed</p>
            </div>

            <form onSubmit={handleLogin} className="w-full space-y-4 pt-4">
              {authError && (
                <p className="text-xs text-red-400 bg-red-500/5 border border-red-500/10 rounded-lg p-2.5">
                  {authError}
                </p>
              )}
              
              <div className="space-y-1 text-left">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Passcode</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                    <Key className="h-4 w-4" />
                  </span>
                  <input 
                    type="password"
                    value={passcode}
                    onChange={e => setPasscode(e.target.value)}
                    className="w-full rounded-lg border border-white/5 bg-white/5 py-2 pl-9 pr-3 text-sm text-white placeholder-slate-600 outline-none focus:border-violet-500/50 focus:bg-white/10 transition-all"
                    placeholder="••••••••"
                    autoFocus
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full rounded-lg bg-gradient-to-r from-violet-600 to-pink-600 py-2 text-sm font-bold text-white hover:from-violet-500 hover:to-pink-500 transition-all"
              >
                Access Dashboard
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // 5. Admin Panel Dashboard Render
  return (
    <div className="w-full flex-grow bg-[#0b0f19] pb-20 pt-8 px-6">
      <SEO title="Admin Panel | Neo AI Picks" description="Manage sponsored placements and view traffic analytics." path="/admin" />
      
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-5">
          <div className="space-y-1">
            <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-violet-400" />
              Sponsorship Admin Panel
            </h1>
            <p className="text-xs text-slate-400">Manage tool features, review submissions, and track traffic analytics.</p>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={loadAdminData}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-semibold text-white hover:bg-white/10 transition-colors"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh Data
            </button>
            <button 
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-xs font-semibold text-red-400 hover:bg-red-500/20 transition-colors"
            >
              Lock Panel
            </button>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex gap-2 border-b border-white/5 pb-3 overflow-x-auto">
          {[
            { id: 'requests', label: 'Feature Requests' },
            { id: 'tools', label: 'Manage Tools' },
            { id: 'analytics', label: 'Analytics Summary' },
            { id: 'payments', label: 'Payments Checkouts (Simulation)' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'requests' | 'tools' | 'analytics' | 'payments')}
              className={`whitespace-nowrap px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === tab.id 
                  ? 'bg-violet-600 text-white shadow-md' 
                  : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* LOADING STATE */}
        {isLoading && (
          <div className="flex items-center justify-center py-20 text-slate-400 text-sm gap-2">
            <RefreshCw className="h-4 w-4 animate-spin text-violet-400" />
            Synchronizing database...
          </div>
        )}

        {/* TAB CONTENT: REQUESTS */}
        {!isLoading && activeTab === 'requests' && (
          <div className="bg-[#0d1222] border border-white/5 rounded-xl overflow-hidden shadow-xl">
            <div className="p-4 bg-white/5 border-b border-white/5">
              <h3 className="text-sm font-bold text-white">Pending Requests ({requests.filter(r => r.status === 'pending').length})</h3>
            </div>
            
            {requests.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-sm">
                No sponsorship requests found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-xs">
                  <thead className="bg-white/5 text-slate-400 font-bold border-b border-white/5">
                    <tr>
                      <th className="p-3">Submitter / Company</th>
                      <th className="p-3">Tool Name / URL</th>
                      <th className="p-3">Message</th>
                      <th className="p-3">Submitted</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-300">
                    {requests.map(req => (
                      <tr key={req.id} className="hover:bg-white/5">
                        <td className="p-3">
                          <div className="font-bold text-white">{req.fullName}</div>
                          <div className="text-[10px] text-slate-500">{req.email}</div>
                          <div className="text-[10px] text-violet-400">{req.companyName}</div>
                        </td>
                        <td className="p-3">
                          <div className="font-bold text-white">{req.toolName}</div>
                          <a href={req.toolUrl} target="_blank" rel="noreferrer" className="text-[10px] text-blue-400 underline truncate max-w-[150px] block">
                            {req.toolUrl}
                          </a>
                        </td>
                        <td className="p-3 max-w-[200px] truncate" title={req.message}>
                          {req.message || <span className="text-slate-600">None</span>}
                        </td>
                        <td className="p-3 text-slate-400">{new Date(req.submittedAt).toLocaleDateString()}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            req.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                            req.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                            'bg-red-500/10 text-red-400 border border-red-500/20'
                          }`}>
                            {req.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-3 text-right space-x-1 whitespace-nowrap">
                          {req.status === 'pending' && (
                            <>
                              <button 
                                onClick={() => handleApproveRequest(req.id, req.toolName)}
                                className="inline-flex items-center gap-0.5 px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors"
                              >
                                <Check className="h-3 w-3" /> Approve (30d)
                              </button>
                              <button 
                                onClick={() => handleRejectRequest(req.id)}
                                className="inline-flex items-center gap-0.5 px-2 py-1 rounded bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors"
                              >
                                <X className="h-3 w-3" /> Reject
                              </button>
                            </>
                          )}
                          {req.status !== 'pending' && (
                            <span className="text-[10px] text-slate-500 italic">
                              Processed ({new Date(req.approvedAt || req.submittedAt).toLocaleDateString()})
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB CONTENT: TOOLS */}
        {!isLoading && activeTab === 'tools' && (
          <div className="bg-[#0d1222] border border-white/5 rounded-xl overflow-hidden shadow-xl">
            <div className="p-4 bg-white/5 border-b border-white/5">
              <h3 className="text-sm font-bold text-white">Registry Management ({tools.length} Tools)</h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs">
                <thead className="bg-white/5 text-slate-400 font-bold border-b border-white/5">
                  <tr>
                    <th className="p-3">Tool Details</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Featured Status</th>
                    <th className="p-3">Expiration Date</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300">
                  {tools.map(tool => {
                    const status = featuredStatus[tool.id];
                    const isFeatured = status ? status.isFeatured : (tool.isFeatured ?? false);
                    const expiry = status ? status.expiryDate : null;

                    return (
                      <tr key={tool.id} className="hover:bg-white/5">
                        <td className="p-3">
                          <div className="font-bold text-white flex items-center gap-1">
                            {tool.name}
                            {isFeatured && <Sparkles className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />}
                          </div>
                          <div className="text-[10px] text-slate-500">ID: {tool.id}</div>
                        </td>
                        <td className="p-3 text-slate-400">{tool.category}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isFeatured 
                              ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30' 
                              : 'bg-slate-500/10 text-slate-500 border border-slate-500/10'
                          }`}>
                            {isFeatured ? 'FEATURED' : 'STANDARD'}
                          </span>
                        </td>
                        <td className="p-3">
                          {isFeatured ? (
                            expiry ? (
                              <div className="flex flex-col">
                                <span className="text-white font-medium">{new Date(expiry).toLocaleDateString()}</span>
                                <span className="text-[9px] text-slate-500">({Math.ceil((new Date(expiry).getTime() - now) / (1000 * 60 * 60 * 24))} days left)</span>
                              </div>
                            ) : (
                              <span className="text-slate-400 italic">No expiry (Lifetime)</span>
                            )
                          ) : (
                            <span className="text-slate-600">-</span>
                          )}
                        </td>
                        <td className="p-3 text-right space-y-2 whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            {isFeatured && (
                              <div className="flex items-center gap-1">
                                <input 
                                  type="date"
                                  value={expiryDates[tool.id] || ''}
                                  onChange={e => setExpiryDates({ ...expiryDates, [tool.id]: e.target.value })}
                                  className="rounded border border-white/10 bg-white/5 p-1 text-[10px] text-white outline-none focus:border-violet-500"
                                />
                                <button 
                                  onClick={() => handleUpdateExpiry(tool.id)}
                                  className="p-1.5 rounded bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300"
                                  title="Save expiry date"
                                >
                                  <Calendar className="h-3 w-3" />
                                </button>
                                {expiry && (
                                  <button 
                                    onClick={() => handleClearExpiry(tool.id)}
                                    className="px-1.5 py-1 rounded bg-white/5 border border-white/10 hover:bg-white/10 text-[9px] font-semibold text-slate-400"
                                    title="Make lifetime"
                                  >
                                    Set Lifetime
                                  </button>
                                )}
                              </div>
                            )}
                            <button 
                              onClick={() => handleToggleToolFeatured(tool.id, isFeatured)}
                              className={`px-3 py-1 rounded text-[10px] font-bold border transition-colors ${
                                isFeatured 
                                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/25 hover:bg-amber-500/20' 
                                  : 'bg-violet-500/10 text-violet-400 border-violet-500/25 hover:bg-violet-500/20'
                              }`}
                            >
                              {isFeatured ? 'Demote' : 'Promote'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB CONTENT: ANALYTICS */}
        {!isLoading && activeTab === 'analytics' && (
          <div className="space-y-6">
            
            {/* Overview Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[#0d1222] border border-white/5 rounded-xl p-5 shadow-lg relative overflow-hidden">
                <div className="absolute right-3 top-3 text-slate-700"><Eye className="h-10 w-10" /></div>
                <div className="text-slate-400 text-xs font-bold uppercase tracking-wider">Total Views</div>
                <div className="text-3xl font-extrabold text-white pt-2">{analytics?.totalViews || 0}</div>
                <p className="text-[10px] text-slate-500 pt-1">Logged dynamic page loads</p>
              </div>

              <div className="bg-[#0d1222] border border-white/5 rounded-xl p-5 shadow-lg relative overflow-hidden">
                <div className="absolute right-3 top-3 text-slate-700"><MousePointerClick className="h-10 w-10" /></div>
                <div className="text-slate-400 text-xs font-bold uppercase tracking-wider">Total Clicks</div>
                <div className="text-3xl font-extrabold text-white pt-2">{analytics?.totalClicks || 0}</div>
                <p className="text-[10px] text-slate-500 pt-1">Outbound redirects tracked</p>
              </div>

              <div className="bg-[#0d1222] border border-white/5 rounded-xl p-5 shadow-lg relative overflow-hidden col-span-2">
                <div className="absolute right-3 top-3 text-slate-700"><BarChart3 className="h-10 w-10" /></div>
                <div className="text-slate-400 text-xs font-bold uppercase tracking-wider">Submit Conversion Rate</div>
                <div className="text-3xl font-extrabold text-violet-400 pt-2">
                  {analytics && analytics.totalViews > 0 
                    ? `${((analytics.totalClicks / analytics.totalViews) * 100).toFixed(1)}%` 
                    : '0%'}
                </div>
                <p className="text-[10px] text-slate-500 pt-1">Visitor outbound click ratio</p>
              </div>
            </div>

            {/* Ranking Grids */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Top Tools */}
              <div className="bg-[#0d1222] border border-white/5 rounded-xl p-4 shadow-lg space-y-4">
                <div className="border-b border-white/5 pb-2">
                  <h3 className="text-sm font-bold text-white">Top 5 Tools (Page Views)</h3>
                </div>
                {(!analytics || analytics.topTools.length === 0) ? (
                  <p className="text-xs text-slate-500 py-4 text-center">No traffic logged yet.</p>
                ) : (
                  <ul className="space-y-3">
                    {analytics.topTools.map((item, idx) => {
                      const tool = tools.find(t => t.id === item.toolId);
                      return (
                        <li key={item.toolId} className="flex items-center justify-between text-xs border-b border-white/5 pb-2 last:border-0 last:pb-0">
                          <span className="text-slate-300 font-medium flex items-center gap-1.5">
                            <span className="text-[10px] font-bold text-slate-500 w-4">#{idx+1}</span>
                            {tool ? tool.name : item.toolId}
                          </span>
                          <span className="bg-white/5 text-violet-400 px-2 py-0.5 rounded font-bold">{item.count} views</span>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              {/* Top Categories */}
              <div className="bg-[#0d1222] border border-white/5 rounded-xl p-4 shadow-lg space-y-4">
                <div className="border-b border-white/5 pb-2">
                  <h3 className="text-sm font-bold text-white">Top Categories (Clicks)</h3>
                </div>
                {(!analytics || analytics.topCategories.length === 0) ? (
                  <p className="text-xs text-slate-500 py-4 text-center">No category clicks logged yet.</p>
                ) : (
                  <ul className="space-y-3">
                    {analytics.topCategories.map((item, idx) => (
                      <li key={item.category} className="flex items-center justify-between text-xs border-b border-white/5 pb-2 last:border-0 last:pb-0">
                        <span className="text-slate-300 font-medium flex items-center gap-1.5">
                          <span className="text-[10px] font-bold text-slate-500 w-4">#{idx+1}</span>
                          {item.category}
                        </span>
                        <span className="bg-white/5 text-pink-400 px-2 py-0.5 rounded font-bold">{item.count} clicks</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Most Clicked Featured Tools */}
              <div className="bg-[#0d1222] border border-white/5 rounded-xl p-4 shadow-lg space-y-4">
                <div className="border-b border-white/5 pb-2">
                  <h3 className="text-sm font-bold text-white">Top Featured Tool Clicks</h3>
                </div>
                {(!analytics || analytics.featuredClicks.length === 0) ? (
                  <p className="text-xs text-slate-500 py-4 text-center">No featured clicks logged yet.</p>
                ) : (
                  <ul className="space-y-3">
                    {analytics.featuredClicks.map((item, idx) => {
                      const tool = tools.find(t => t.id === item.toolId);
                      return (
                        <li key={item.toolId} className="flex items-center justify-between text-xs border-b border-white/5 pb-2 last:border-0 last:pb-0">
                          <span className="text-slate-300 font-medium flex items-center gap-1.5">
                            <span className="text-[10px] font-bold text-slate-500 w-4">#{idx+1}</span>
                            {tool ? tool.name : item.toolId}
                          </span>
                          <span className="bg-violet-500/10 text-violet-300 px-2 py-0.5 rounded border border-violet-500/20 font-bold">{item.count} hits</span>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

            </div>
          </div>
        )}

        {/* TAB CONTENT: PAYMENTS */}
        {!isLoading && activeTab === 'payments' && (
          <div className="bg-[#0d1222] border border-white/5 rounded-xl overflow-hidden shadow-xl space-y-4 p-5">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-white">Simulated Stripe / Lemon Squeezy Payout Checks</h3>
                <p className="text-[10px] text-slate-500">History of checkouts generated using the PaymentProvider Abstraction Layer.</p>
              </div>
              {getMockCheckouts().length > 0 && (
                <button 
                  onClick={handleClearMockCheckouts}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 text-xs font-semibold"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Clear History
                </button>
              )}
            </div>

            {getMockCheckouts().length === 0 ? (
              <p className="text-xs text-slate-500 py-10 text-center">No simulated checkouts have been logged yet.</p>
            ) : (
              <div className="overflow-x-auto pt-2">
                <table className="w-full border-collapse text-left text-xs">
                  <thead className="bg-white/5 text-slate-400 font-bold border-b border-white/5">
                    <tr>
                      <th className="p-3">Session ID</th>
                      <th className="p-3">Tool ID</th>
                      <th className="p-3">Sponsor Plan</th>
                      <th className="p-3">Email Address</th>
                      <th className="p-3">Date Created</th>
                      <th className="p-3">Payment Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-300">
                    {getMockCheckouts().map((chk) => (
                      <tr key={chk.sessionId} className="hover:bg-white/5">
                        <td className="p-3 font-mono text-[10px] text-slate-400">{chk.sessionId}</td>
                        <td className="p-3 font-bold text-white">{chk.toolId}</td>
                        <td className="p-3">
                          <span className="text-violet-400">
                            {chk.planType === 'featured_monthly' ? 'Monthly Spot ($49/mo)' : 'Lifetime Spot ($299)'}
                          </span>
                        </td>
                        <td className="p-3 text-slate-400">{chk.email}</td>
                        <td className="p-3 text-slate-400">{new Date(chk.timestamp).toLocaleString()}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            chk.verified 
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}>
                            {chk.verified ? 'VERIFIED (PAID)' : 'PENDING'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

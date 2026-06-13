import React, { useState } from 'react';
import { Sparkles, Activity, PlusCircle, BookOpen, Menu, X, Home } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  navigateTo: (tab: string, arg?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, navigateTo }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Explore Tools', icon: Home },
    { id: 'compare', label: 'Compare', icon: Activity },
    { id: 'blog', label: 'Blog', icon: BookOpen },
    { id: 'submit', label: 'Submit Tool', icon: PlusCircle },
  ];

  return (
    <nav className="sticky top-0 z-50 saas-glass border-b border-white/5 w-full px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* LOGO */}
        <div 
          onClick={() => navigateTo('home')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="p-2 rounded-xl bg-violet-600/10 border border-violet-500/20 group-hover:border-violet-400 group-hover:bg-violet-600/25 transition-all duration-300">
            <Sparkles className="w-5 h-5 text-violet-400 group-hover:rotate-12 transition-transform" />
          </div>
          <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-200 to-violet-400 bg-clip-text text-transparent">
            Neo<span className="text-violet-400">AI</span>Picks
          </span>
        </div>

        {/* DESKTOP NAV */}
        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id || (item.id === 'home' && currentTab.startsWith('tool/')) || (item.id === 'compare' && currentTab.startsWith('compare/')) || (item.id === 'blog' && currentTab.startsWith('blog/'));
            return (
              <button
                key={item.id}
                onClick={() => {
                  navigateTo(item.id);
                  setIsOpen(false);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-violet-600/15 text-violet-300 border border-violet-500/30 shadow-[0_0_15px_rgba(167,139,250,0.15)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
        </div>

        {/* MOBILE MENU TOGGLE */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* MOBILE DROPDOWN */}
      {isOpen && (
        <div className="md:hidden absolute top-[73px] left-0 w-full saas-glass border-b border-white/5 p-4 space-y-2 flex flex-col transition-all duration-300">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id || (item.id === 'home' && currentTab.startsWith('tool/')) || (item.id === 'compare' && currentTab.startsWith('compare/')) || (item.id === 'blog' && currentTab.startsWith('blog/'));
            return (
              <button
                key={item.id}
                onClick={() => {
                  navigateTo(item.id);
                  setIsOpen(false);
                }}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-left font-medium text-sm transition-all ${
                  isActive
                    ? 'bg-violet-600/15 text-violet-300 border border-violet-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </nav>
  );
};
export default Navbar;

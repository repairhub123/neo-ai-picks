import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  navigateTo: (tab: string, arg?: string) => void;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, navigateTo }) => {
  return (
    <nav className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 overflow-x-auto whitespace-nowrap py-2 select-none custom-scrollbar">
      <div 
        onClick={() => navigateTo('home')} 
        className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer group"
      >
        <Home className="w-3.5 h-3.5 group-hover:scale-105 transition-transform" />
        <span>Home</span>
      </div>
      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          <ChevronRight className="w-3 h-3 text-slate-600 flex-shrink-0" />
          {idx === items.length - 1 ? (
            <span className="text-violet-400 font-bold max-w-[200px] sm:max-w-xs truncate">{item.label}</span>
          ) : (
            <span 
              onClick={item.onClick} 
              className="hover:text-white transition-colors cursor-pointer truncate max-w-[150px]"
            >
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumbs;

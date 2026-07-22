import React from 'react';
import { MoreHorizontal } from 'lucide-react';
import { NavItem } from '../types';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  navItems: NavItem[];
  onMenuClick: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
  navItems,
  onMenuClick,
}) => {
  const mainItemIds = ['calendar', 'journal', 'performance', 'goals', 'achievements', 'rules', 'quotes'];
  const mainItems = navItems.filter((item) => mainItemIds.includes(item.id));
  const moreItemIds = navItems.filter((item) => !mainItemIds.includes(item.id)).map((item) => item.id);
  const isMoreTabActive = moreItemIds.includes(activeTab);

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 z-40 px-2 py-1 shadow-xl">
      <div className="flex justify-between items-center overflow-x-auto scrollbar-hide py-1">
        {mainItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-lg flex-1 min-w-[64px] transition-all duration-200 ${
              activeTab === item.id
                ? 'text-white bg-blue-600 font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {item.icon}
            <span className="text-[10px] mt-1 font-medium truncate max-w-[60px]">{item.text}</span>
          </button>
        ))}
        <button
          onClick={onMenuClick}
          className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-lg flex-1 min-w-[64px] transition-all duration-200 ${
            isMoreTabActive
              ? 'text-white bg-blue-600 font-semibold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <MoreHorizontal className="w-5 h-5" />
          <span className="text-[10px] mt-1 font-medium">More</span>
        </button>
      </div>
    </nav>
  );
};

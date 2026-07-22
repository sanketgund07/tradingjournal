import React from 'react';
import { Upload, Download } from 'lucide-react';
import { NavItem } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  navItems: NavItem[];
  onImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onExport: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  navItems,
  onImport,
  onExport,
}) => {
  return (
    <nav className="w-64 h-full p-4 flex-shrink-0 hidden md:flex">
      <div className="bg-slate-900 text-slate-300 rounded-2xl border border-slate-800 shadow-xl h-full flex flex-col p-4 w-full">
        <div className="p-2 mb-6 flex items-center justify-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white text-sm shadow">
            D
          </div>
          <span className="text-white font-semibold tracking-tight text-lg font-serif">Divine Journal</span>
        </div>
        <ul className="space-y-1.5 flex-1 overflow-y-auto scrollbar-hide">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center p-2.5 rounded-xl transition-all duration-200 ${
                  activeTab === item.id
                    ? 'bg-blue-600 text-white font-medium shadow-sm'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {item.icon}
                <span className="ml-3 font-medium text-sm">{item.text}</span>
              </button>
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-4 border-t border-slate-800 space-y-1">
          <div>
            <input
              type="file"
              id="import-file-sidebar"
              accept=".json"
              className="hidden"
              onChange={onImport}
            />
            <label
              htmlFor="import-file-sidebar"
              className="w-full flex items-center p-2.5 rounded-xl transition-all duration-200 text-slate-400 hover:bg-slate-800 hover:text-white cursor-pointer text-sm font-medium"
            >
              <Upload className="w-4 h-4 mr-3 text-blue-400" />
              <span>Import Data</span>
            </label>
          </div>
          <button
            onClick={onExport}
            className="w-full flex items-center p-2.5 rounded-xl transition-all duration-200 text-slate-400 hover:bg-slate-800 hover:text-white text-sm font-medium"
          >
            <Download className="w-4 h-4 mr-3 text-blue-400" />
            <span>Export Data</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

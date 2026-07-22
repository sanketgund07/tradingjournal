import React, { useState } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { NAV_ITEMS, LOCAL_STORAGE_KEYS } from './constants';
import { DailyLogs, Trade, Achievement, Goal, Rule, FollowedRules, Currency, Quote } from './types';
import { Sidebar } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';
import { Modal } from './components/Modal';

import { CalendarTab } from './components/tabs/CalendarTab';
import { JournalTab } from './components/tabs/JournalTab';
import { PerformanceTab } from './components/tabs/PerformanceTab';
import { GoalsTab } from './components/tabs/GoalsTab';
import { AchievementsTab } from './components/tabs/AchievementsTab';
import { RulesTab } from './components/tabs/RulesTab';
import { QuotesTab } from './components/tabs/QuotesTab';
import { DetailsTab } from './components/tabs/DetailsTab';

import { Upload, Download } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('calendar');
  const [currency, setCurrency] = useLocalStorage<Currency>('currency', '₹');
  const [isMenuOpen, setMenuOpen] = useState(false);

  const [dailyLogs, setDailyLogs] = useLocalStorage<DailyLogs>('dailyLogs', {});
  const [trades, setTrades] = useLocalStorage<Trade[]>('trades', []);
  const [achievements, setAchievements] = useLocalStorage<Achievement[]>('achievements', []);
  const [goals, setGoals] = useLocalStorage<Goal[]>('goals', []);
  const [rules, setRules] = useLocalStorage<Rule[]>('rules', []);
  const [followedRules, setFollowedRules] = useLocalStorage<FollowedRules>('followedRules', {});
  const [quotes, setQuotes] = useLocalStorage<Quote[]>('quotes', []);

  const mainItemIds = ['calendar', 'journal', 'performance', 'goals', 'achievements', 'rules', 'quotes'];
  const moreNavItems = NAV_ITEMS.filter((item) => !mainItemIds.includes(item.id));

  const handleExport = () => {
    const backupData: Record<string, unknown> = {};
    LOCAL_STORAGE_KEYS.forEach((key) => {
      const data = localStorage.getItem(key);
      if (data) {
        try {
          backupData[key] = JSON.parse(data);
        } catch (e) {
          console.error(`Could not parse localStorage item: ${key}`, e);
        }
      }
    });

    const jsonString = JSON.stringify(backupData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const date = new Date().toISOString().split('T')[0];
    a.href = url;
    a.download = `trading-journal-backup-${date}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        if (typeof text !== 'string') throw new Error('File is not readable');
        const data = JSON.parse(text);

        if (
          window.confirm(
            'Are you sure you want to import this backup? This will replace your current app data.'
          )
        ) {
          LOCAL_STORAGE_KEYS.forEach((key) => {
            if (data[key] !== undefined) {
              localStorage.setItem(key, JSON.stringify(data[key]));
            }
          });
          alert('Data imported successfully!');
          window.location.reload();
        }
      } catch (error) {
        console.error('Import failed:', error);
        alert('Error: Failed to import data. Please select a valid JSON backup file.');
      } finally {
        event.target.value = '';
      }
    };
    reader.readAsText(file);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'calendar':
        return (
          <CalendarTab
            dailyLogs={dailyLogs}
            setDailyLogs={setDailyLogs}
            currency={currency}
            setCurrency={setCurrency}
          />
        );
      case 'journal':
        return <JournalTab trades={trades} setTrades={setTrades} currency={currency} />;
      case 'performance':
        return (
          <PerformanceTab dailyLogs={dailyLogs} trades={trades} currency={currency} />
        );
      case 'goals':
        return <GoalsTab goals={goals} setGoals={setGoals} currency={currency} />;
      case 'achievements':
        return (
          <AchievementsTab achievements={achievements} setAchievements={setAchievements} />
        );
      case 'rules':
        return (
          <RulesTab
            rules={rules}
            setRules={setRules}
            followedRules={followedRules}
            setFollowedRules={setFollowedRules}
          />
        );
      case 'quotes':
        return <QuotesTab quotes={quotes} setQuotes={setQuotes} />;
      case 'details':
        return <DetailsTab />;
      default:
        return (
          <CalendarTab
            dailyLogs={dailyLogs}
            setDailyLogs={setDailyLogs}
            currency={currency}
            setCurrency={setCurrency}
          />
        );
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100 text-slate-900 selection:bg-blue-600 selection:text-white font-sans">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        navItems={NAV_ITEMS}
        onImport={handleImport}
        onExport={handleExport}
      />

      <main className="flex-1 p-3 sm:p-6 overflow-y-auto pb-24 md:pb-6">
        <div className="w-full h-full bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6 overflow-y-auto min-h-[80vh]">
          {renderContent()}
        </div>
      </main>

      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        navItems={NAV_ITEMS}
        onMenuClick={() => setMenuOpen(true)}
      />

      <Modal isOpen={isMenuOpen} onClose={() => setMenuOpen(false)} title="Menu & Actions">
        <div className="space-y-3 pt-2">
          {moreNavItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setMenuOpen(false);
              }}
              className={`w-full flex items-center p-3 rounded-xl transition-all ${
                activeTab === item.id
                  ? 'bg-blue-600 text-white font-semibold shadow-sm'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {item.icon}
              <span className="ml-3 font-medium text-sm">{item.text}</span>
            </button>
          ))}

          <div className="border-t border-slate-200 my-3 pt-3 space-y-2">
            <div>
              <input
                type="file"
                id="import-file-mobile"
                accept=".json"
                className="hidden"
                onChange={handleImport}
              />
              <label
                htmlFor="import-file-mobile"
                className="w-full flex items-center p-3 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 cursor-pointer font-medium text-sm transition"
              >
                <Upload className="w-5 h-5 mr-3 text-blue-600" />
                <span>Import Data</span>
              </label>
            </div>
            <button
              onClick={handleExport}
              className="w-full flex items-center p-3 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 font-medium text-sm transition"
            >
              <Download className="w-5 h-5 mr-3 text-blue-600" />
              <span>Export Data</span>
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

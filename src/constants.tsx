import React from 'react';
import {
  Calendar as CalendarIcon,
  BookOpen as JournalIcon,
  Trophy as AchievementIcon,
  Target as GoalIcon,
  TrendingUp as PerformanceIcon,
  CheckSquare as RulesIcon,
  Info as DetailsIcon,
  Quote as QuoteIcon,
} from 'lucide-react';
import { NavItem } from './types';

export const NAV_ITEMS: NavItem[] = [
  { id: 'calendar', text: 'Calendar', icon: <CalendarIcon className="w-5 h-5" /> },
  { id: 'rules', text: 'Rules', icon: <RulesIcon className="w-5 h-5" /> },
  { id: 'journal', text: 'Journal', icon: <JournalIcon className="w-5 h-5" /> },
  { id: 'performance', text: 'Performance', icon: <PerformanceIcon className="w-5 h-5" /> },
  { id: 'goals', text: 'Goals', icon: <GoalIcon className="w-5 h-5" /> },
  { id: 'achievements', text: 'Achievements', icon: <AchievementIcon className="w-5 h-5" /> },
  { id: 'quotes', text: 'Quotes', icon: <QuoteIcon className="w-5 h-5" /> },
  { id: 'details', text: 'Details', icon: <DetailsIcon className="w-5 h-5" /> },
];

export const EMOJI_OPTIONS = ['🔥', '❤️', '🏆', '⭐', '🚀', '🎯', '💰', '👑'];

export const LOCAL_STORAGE_KEYS = [
  'dailyLogs',
  'trades',
  'achievements',
  'goals',
  'rules',
  'followedRules',
  'currency',
  'quotes',
];

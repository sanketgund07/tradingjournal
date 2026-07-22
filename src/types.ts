import { ReactNode } from 'react';

export type Currency = '₹' | '$';

export type LogType = 'profit' | 'loss';

export interface DailyLog {
  type: LogType;
  amount: number;
}

export interface DailyLogs {
  [dateKey: string]: DailyLog;
}

export interface Trade {
  id: string;
  date: string;
  tradeOfDay: '1st' | '2nd' | '3rd' | '4th' | '5th+' | string;
  pair: string;
  buySell: 'Buy' | 'Sell';
  type: LogType;
  amount: number;
  strategy?: string;
  riskAmount?: number;
  slSet: 'Yes' | 'No';
  confidenceLevel: number;
  psychology?: string;
  observation?: string;
  mistakes?: string;
  tradeCloseType: 'Manual' | 'SL' | 'TP' | 'Trailed SL' | string;
  screenshot?: string;
}

export interface Achievement {
  id: string;
  text: string;
  emoji: string;
}

export interface Goal {
  id: string;
  name: string;
  target: number;
  current: number;
}

export interface Rule {
  id: string;
  text: string;
}

export interface Quote {
  id: string;
  text: string;
  author?: string;
  category?: string;
}

export interface FollowedRules {
  [dateKey: string]: string[];
}

export interface NavItem {
  id: string;
  text: string;
  icon: ReactNode;
}


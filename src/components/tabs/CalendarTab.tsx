import React, { useState } from 'react';
import { DailyLogs, Currency } from '../../types';
import { Modal } from '../Modal';
import { ChevronLeft, ChevronRight, Trash2, Calendar as CalendarIcon, List } from 'lucide-react';

interface CalendarTabProps {
  dailyLogs: DailyLogs;
  setDailyLogs: (logs: DailyLogs | ((prev: DailyLogs) => DailyLogs)) => void;
  currency: Currency;
  setCurrency: (c: Currency) => void;
}

export const CalendarTab: React.FC<CalendarTabProps> = ({
  dailyLogs,
  setDailyLogs,
  currency,
  setCurrency,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [logType, setLogType] = useState<'profit' | 'loss'>('profit');
  const [amount, setAmount] = useState('');

  const formatAmount = (num: number) => {
    const absNum = Math.abs(num);
    if (absNum % 1 === 0) {
      return absNum.toLocaleString('en-US');
    }
    return absNum.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const startDay = startOfMonth.getDay();
  const daysInMonth = endOfMonth.getDate();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: startDay }, (_, i) => i);

  // Calculate monthly stats
  const monthlySummary = days.reduce(
    (acc, day) => {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dateKey = date.toISOString().split('T')[0];
      const log = dailyLogs[dateKey];
      if (log) {
        if (log.type === 'profit') acc.profit += log.amount;
        if (log.type === 'loss') acc.loss += log.amount;
      }
      return acc;
    },
    { profit: 0, loss: 0 }
  );
  const monthlyNet = monthlySummary.profit - monthlySummary.loss;

  const prevMonth = () =>
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () =>
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const handleDayClick = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(date);
    const dateKey = date.toISOString().split('T')[0];
    const existingLog = dailyLogs[dateKey];
    if (existingLog) {
      setLogType(existingLog.type);
      setAmount(String(existingLog.amount));
    } else {
      setLogType('profit');
      setAmount('');
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (selectedDate && amount !== '') {
      const parsedAmount = parseFloat(amount);
      if (!isNaN(parsedAmount) && parsedAmount >= 0) {
        const dateKey = selectedDate.toISOString().split('T')[0];
        setDailyLogs((prev) => ({
          ...prev,
          [dateKey]: { type: logType, amount: parsedAmount },
        }));
        setIsModalOpen(false);
      }
    }
  };

  const handleDelete = () => {
    if (selectedDate) {
      const dateKey = selectedDate.toISOString().split('T')[0];
      setDailyLogs((prev) => {
        const updated = { ...prev };
        delete updated[dateKey];
        return updated;
      });
      setIsModalOpen(false);
    }
  };

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3 relative z-10">
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight">Calendar</h1>
        
        <div className="flex flex-wrap items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg flex items-center gap-1 text-xs font-semibold transition-all ${
                viewMode === 'grid'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-200/60'
              }`}
              title="Grid View"
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Grid</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg flex items-center gap-1 text-xs font-semibold transition-all ${
                viewMode === 'list'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-200/60'
              }`}
              title="List View"
            >
              <List className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">List</span>
            </button>
          </div>

          {/* Currency Switcher */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <span className="text-[11px] text-slate-500 font-medium px-1.5">Currency:</span>
            <button
              onClick={() => setCurrency('₹')}
              className={`px-2.5 py-1 text-xs rounded-lg transition-all ${
                currency === '₹'
                  ? 'bg-blue-600 text-white font-semibold shadow-sm'
                  : 'text-slate-600 hover:bg-slate-200/60'
              }`}
            >
              INR (₹)
            </button>
            <button
              onClick={() => setCurrency('$')}
              className={`px-2.5 py-1 text-xs rounded-lg transition-all ${
                currency === '$'
                  ? 'bg-blue-600 text-white font-semibold shadow-sm'
                  : 'text-slate-600 hover:bg-slate-200/60'
              }`}
            >
              USD ($)
            </button>
          </div>
        </div>
      </div>

      <div className="text-center mb-6 relative z-10">
        <p className="text-slate-600 font-serif italic text-base sm:text-lg">
          "कर्म कर फल की चिंता मत कर"
        </p>
      </div>

      <div className="flex justify-between items-center mb-4 bg-slate-50 p-3 rounded-xl border border-slate-200">
        <button
          onClick={prevMonth}
          className="p-2 bg-white rounded-lg border border-slate-200 hover:bg-slate-100 transition text-slate-700 shadow-sm"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="text-base sm:text-xl font-serif font-bold text-slate-900 text-center">
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h2>
        <button
          onClick={nextMonth}
          className="p-2 bg-white rounded-lg border border-slate-200 hover:bg-slate-100 transition text-slate-700 shadow-sm"
          aria-label="Next month"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Monthly Summary Cards */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 text-center">
        <div className="bg-emerald-50/80 border border-emerald-200 p-2 sm:p-3 rounded-xl">
          <div className="text-[10px] sm:text-xs font-semibold text-emerald-800 uppercase tracking-wider">
            Total Profit
          </div>
          <div className="text-xs sm:text-base md:text-lg font-bold font-serif text-emerald-700 mt-0.5">
            +{currency}{formatAmount(monthlySummary.profit)}
          </div>
        </div>
        <div className="bg-rose-50/80 border border-rose-200 p-2 sm:p-3 rounded-xl">
          <div className="text-[10px] sm:text-xs font-semibold text-rose-800 uppercase tracking-wider">
            Total Loss
          </div>
          <div className="text-xs sm:text-base md:text-lg font-bold font-serif text-rose-700 mt-0.5">
            -{currency}{formatAmount(monthlySummary.loss)}
          </div>
        </div>
        <div
          className={`border p-2 sm:p-3 rounded-xl ${
            monthlyNet >= 0
              ? 'bg-blue-50/80 border-blue-200'
              : 'bg-rose-50/80 border-rose-200'
          }`}
        >
          <div className="text-[10px] sm:text-xs font-semibold text-slate-600 uppercase tracking-wider">
            Net Monthly P/L
          </div>
          <div
            className={`text-xs sm:text-base md:text-lg font-bold font-serif mt-0.5 ${
              monthlyNet >= 0 ? 'text-emerald-700' : 'text-rose-700'
            }`}
          >
            {monthlyNet >= 0 ? '+' : '-'}{currency}{formatAmount(monthlyNet)}
          </div>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="overflow-x-auto pb-2">
          <div className="min-w-[320px] sm:min-w-full grid grid-cols-7 gap-1 sm:gap-2">
            {daysOfWeek.map((day) => (
              <div
                key={day}
                className="text-center font-semibold text-slate-500 text-xs sm:text-sm py-1 uppercase tracking-wider"
              >
                {day}
              </div>
            ))}

            {blanks.map((i) => (
              <div key={`blank-${i}`} className="min-h-[60px] sm:min-h-[84px] opacity-0 pointer-events-none" />
            ))}

            {days.map((day) => {
              const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
              const dateKey = date.toISOString().split('T')[0];
              const log = dailyLogs[dateKey];
              const isToday =
                new Date().toDateString() === date.toDateString();

              return (
                <div
                  key={day}
                  onClick={() => handleDayClick(day)}
                  className={`relative p-1 sm:p-1.5 min-h-[60px] sm:min-h-[84px] rounded-xl cursor-pointer transition-all duration-200 flex flex-col justify-between border ${
                    isToday
                      ? 'bg-blue-50/80 border-blue-500 shadow-sm'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  } hover:shadow-md`}
                >
                  <div className="flex justify-between items-center w-full">
                    <span className={`font-bold text-[10px] sm:text-xs ${isToday ? 'text-blue-600' : 'text-slate-700'}`}>
                      {day}
                    </span>
                    {isToday && (
                      <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-blue-600 animate-pulse flex-shrink-0" />
                    )}
                  </div>
                  {log && (
                    <div
                      className={`mt-auto w-full p-0.5 sm:p-1 rounded-md text-center sm:text-right font-bold text-[8px] min-[360px]:text-[9.5px] sm:text-xs leading-none border flex flex-wrap justify-center sm:justify-end gap-x-0.5 gap-y-0 ${
                        log.type === 'profit'
                          ? 'text-emerald-700 bg-emerald-50/90 border-emerald-200'
                          : 'text-rose-700 bg-rose-50/90 border-rose-200'
                      }`}
                      title={`${log.type === 'profit' ? '+' : '-'}${currency}${formatAmount(log.amount)}`}
                    >
                      <span className="inline-block">{log.type === 'profit' ? '+' : '-'}{currency}</span>
                      <span className="inline-block break-all">{formatAmount(log.amount)}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* List View for clear full-value breakdown */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
            <span className="font-bold text-sm text-slate-800">Date</span>
            <span className="font-bold text-sm text-slate-800">PnL Entry</span>
          </div>
          <div className="divide-y divide-slate-100">
            {days.map((day) => {
              const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
              const dateKey = date.toISOString().split('T')[0];
              const log = dailyLogs[dateKey];
              const isToday = new Date().toDateString() === date.toDateString();

              return (
                <div
                  key={day}
                  onClick={() => handleDayClick(day)}
                  className={`p-3.5 flex justify-between items-center cursor-pointer hover:bg-slate-50 transition ${
                    isToday ? 'bg-blue-50/40' : ''
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-bold text-sm ${
                        isToday ? 'text-blue-600 font-extrabold' : 'text-slate-800'
                      }`}
                    >
                      {date.toLocaleDateString('default', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                    {isToday && (
                      <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">
                        Today
                      </span>
                    )}
                  </div>

                  <div>
                    {log ? (
                      <span
                        className={`inline-block px-3 py-1 rounded-lg font-bold text-xs sm:text-sm border ${
                          log.type === 'profit'
                            ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                            : 'text-rose-700 bg-rose-50 border-rose-200'
                        }`}
                      >
                        {log.type === 'profit' ? '+' : '-'}
                        {currency}
                        {formatAmount(log.amount)}
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400 font-medium hover:text-blue-600 transition">
                        + Add PnL
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Log PnL for ${selectedDate?.toLocaleDateString()}`}
      >
        <div className="space-y-4 pt-2">
          <div className="flex gap-2">
            <button
              onClick={() => setLogType('profit')}
              className={`flex-1 p-3 rounded-xl font-semibold transition-all ${
                logType === 'profit'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Profit
            </button>
            <button
              onClick={() => setLogType('loss')}
              className={`flex-1 p-3 rounded-xl font-semibold transition-all ${
                logType === 'loss'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Loss
            </button>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">Amount ({currency})</label>
            <input
              type="number"
              min="0"
              step="any"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 500"
              className="w-full p-3 bg-white rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
            {selectedDate && dailyLogs[selectedDate.toISOString().split('T')[0]] && (
              <button
                onClick={handleDelete}
                className="px-4 py-2.5 bg-rose-50 text-rose-600 border border-rose-200 rounded-xl hover:bg-rose-100 transition font-semibold flex items-center gap-1 text-sm"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            )}
            <button
              onClick={handleSave}
              className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition shadow-sm text-sm"
            >
              Save Log
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};


import React, { useState, useMemo, useRef } from 'react';
import { DailyLogs, DailyLog, Trade, Currency } from '../../types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PerformanceTabProps {
  dailyLogs: DailyLogs;
  trades: Trade[];
  currency: Currency;
}

interface StatCardProps {
  title: string;
  value: string;
  color?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, color = 'text-slate-900' }) => (
  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center shadow-sm">
    <h3 className="text-slate-500 text-xs sm:text-sm font-medium mb-1">{title}</h3>
    <p className={`text-lg sm:text-2xl font-bold font-serif ${color}`}>{value}</p>
  </div>
);

interface CustomBarChartProps {
  data: Array<{ name: string; profit: number; loss: number }>;
  currency: Currency;
}

const CustomBarChart: React.FC<CustomBarChartProps> = ({ data, currency }) => {
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    data: { name: string; profit: number; loss: number };
  } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const PADDING = { top: 20, right: 20, bottom: 40, left: 50 };
  const width = containerRef.current?.clientWidth || 500;
  const height = 300;

  const chartWidth = Math.max(100, width - PADDING.left - PADDING.right);
  const chartHeight = Math.max(100, height - PADDING.top - PADDING.bottom);

  const maxAmount = Math.max(1, ...data.map((d) => d.profit), ...data.map((d) => d.loss));
  const xScale = chartWidth / (data.length || 1);
  const barWidth = Math.max(2, (xScale * 0.6) / 2);

  const yTicks = 5;
  const yAxisLabels = Array.from({ length: yTicks + 1 }, (_, i) => {
    const value = maxAmount * (i / yTicks);
    return {
      value: value,
      y: chartHeight - (value / maxAmount) * chartHeight,
    };
  });

  const handleMouseMove = (
    e: React.MouseEvent<SVGGElement, MouseEvent>,
    item: { name: string; profit: number; loss: number }
  ) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setTooltip({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      data: item,
    });
  };

  return (
    <div className="relative w-full h-[300px]" ref={containerRef}>
      <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`}>
        <g transform={`translate(${PADDING.left}, ${PADDING.top})`}>
          {yAxisLabels.map((tick, idx) => (
            <g key={idx}>
              <line
                x1={0}
                y1={tick.y}
                x2={chartWidth}
                y2={tick.y}
                stroke="rgba(0,0,0,0.08)"
                strokeDasharray="3 3"
              />
              <text
                x={-10}
                y={tick.y + 4}
                fill="#64748b"
                textAnchor="end"
                fontSize={10}
              >
                {tick.value.toFixed(0)}
              </text>
            </g>
          ))}

          {data.map((d, i) => (
            <text
              key={i}
              x={i * xScale + xScale / 2}
              y={chartHeight + 20}
              fill="#64748b"
              textAnchor="middle"
              fontSize={10}
            >
              {d.name}
            </text>
          ))}

          {data.map((d, i) => {
            const profitHeight = (d.profit / maxAmount) * chartHeight;
            const lossHeight = (d.loss / maxAmount) * chartHeight;
            const xPos = i * xScale + xScale / 2;

            return (
              <g
                key={d.name + i}
                onMouseMove={(e) => handleMouseMove(e, d)}
                onMouseLeave={() => setTooltip(null)}
                className="cursor-pointer"
              >
                {d.profit > 0 && (
                  <rect
                    x={xPos - barWidth}
                    y={chartHeight - profitHeight}
                    width={barWidth}
                    height={profitHeight}
                    fill="#10b981"
                    rx={2}
                    className="opacity-90 hover:opacity-100 transition-opacity"
                  />
                )}
                {d.loss > 0 && (
                  <rect
                    x={xPos}
                    y={chartHeight - lossHeight}
                    width={barWidth}
                    height={lossHeight}
                    fill="#f43f5e"
                    rx={2}
                    className="opacity-90 hover:opacity-100 transition-opacity"
                  />
                )}
              </g>
            );
          })}
        </g>
      </svg>

      {tooltip && (
        <div
          className="absolute p-2.5 rounded-xl shadow-xl text-xs pointer-events-none z-20 border border-slate-700 bg-slate-900 text-white"
          style={{
            top: Math.max(10, tooltip.y - 70),
            left: Math.min(width - 150, tooltip.x + 10),
          }}
        >
          <div className="font-bold text-blue-400 mb-1">Period: {tooltip.data.name}</div>
          {tooltip.data.profit > 0 && (
            <div className="text-emerald-400 font-semibold">
              Profit: {currency}
              {tooltip.data.profit.toFixed(2)}
            </div>
          )}
          {tooltip.data.loss > 0 && (
            <div className="text-rose-400 font-semibold">
              Loss: {currency}
              {tooltip.data.loss.toFixed(2)}
            </div>
          )}
          {tooltip.data.profit === 0 && tooltip.data.loss === 0 && (
            <div className="text-slate-400">No activity</div>
          )}
        </div>
      )}
    </div>
  );
};

export const PerformanceTab: React.FC<PerformanceTabProps> = ({ dailyLogs, currency }) => {
  const [timeframe, setTimeframe] = useState<'week' | 'month'>('month');
  const [displayDate, setDisplayDate] = useState(new Date());

  const prevPeriod = () => {
    setDisplayDate((current) => {
      const newDate = new Date(current);
      if (timeframe === 'month') {
        newDate.setDate(1);
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setDate(newDate.getDate() - 7);
      }
      return newDate;
    });
  };

  const nextPeriod = () => {
    setDisplayDate((current) => {
      const newDate = new Date(current);
      if (timeframe === 'month') {
        newDate.setDate(1);
        newDate.setMonth(newDate.getMonth() + 1);
      } else {
        newDate.setDate(newDate.getDate() + 7);
      }
      return newDate;
    });
  };

  const periodLogs = useMemo(() => {
    const logs: DailyLogs = {};
    const now = displayDate;

    if (timeframe === 'month') {
      const year = now.getFullYear();
      const month = now.getMonth();
      for (const dateKey in dailyLogs) {
        const logDate = new Date(dateKey);
        if (logDate.getFullYear() === year && logDate.getMonth() === month) {
          logs[dateKey] = dailyLogs[dateKey];
        }
      }
    } else {
      // week
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      startOfWeek.setHours(0, 0, 0, 0);
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 999);

      for (const dateKey in dailyLogs) {
        const logDate = new Date(dateKey);
        if (logDate >= startOfWeek && logDate <= endOfWeek) {
          logs[dateKey] = dailyLogs[dateKey];
        }
      }
    }
    return logs;
  }, [dailyLogs, timeframe, displayDate]);

  const performanceStats = useMemo(() => {
    const dailyLogValues: DailyLog[] = Object.values(periodLogs);
    const profitableDaysLogs = dailyLogValues.filter((log) => log.type === 'profit');
    const losingDaysLogs = dailyLogValues.filter((log) => log.type === 'loss');

    const totalProfit = profitableDaysLogs.reduce((sum, log) => sum + log.amount, 0);
    const totalLoss = losingDaysLogs.reduce((sum, log) => sum + log.amount, 0);

    const maxProfit =
      profitableDaysLogs.length > 0 ? Math.max(...profitableDaysLogs.map((l) => l.amount)) : 0;
    const maxLoss = losingDaysLogs.length > 0 ? Math.max(...losingDaysLogs.map((l) => l.amount)) : 0;

    const avgProfit =
      profitableDaysLogs.length > 0 ? totalProfit / profitableDaysLogs.length : 0;
    const avgLoss = losingDaysLogs.length > 0 ? totalLoss / losingDaysLogs.length : 0;

    const riskToReward = avgLoss > 0 ? avgProfit / avgLoss : 0;

    const profitableDays = profitableDaysLogs.length;
    const losingDays = losingDaysLogs.length;
    const totalTradingDays = profitableDays + losingDays;
    const dailyWinRate = totalTradingDays > 0 ? (profitableDays / totalTradingDays) * 100 : 0;

    return {
      totalProfit,
      totalLoss,
      netProfit: totalProfit - totalLoss,
      maxProfit,
      maxLoss,
      avgProfit,
      avgLoss,
      riskToReward,
      dailyWinRate,
      profitableDays,
      losingDays,
      totalTradingDays,
    };
  }, [periodLogs]);

  const processedData = useMemo(() => {
    const data: Array<{ name: string; profit: number; loss: number }> = [];
    const now = displayDate;

    if (timeframe === 'month') {
      const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
      for (let i = 1; i <= daysInMonth; i++) {
        const date = new Date(now.getFullYear(), now.getMonth(), i);
        const dateKey = date.toISOString().split('T')[0];
        const log = dailyLogs[dateKey];
        data.push({
          name: `${i}`,
          profit: log && log.type === 'profit' ? log.amount : 0,
          loss: log && log.type === 'loss' ? log.amount : 0,
        });
      }
    } else {
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      for (let i = 0; i < 7; i++) {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        const dateKey = date.toISOString().split('T')[0];
        const log = dailyLogs[dateKey];
        data.push({
          name: date.toLocaleString('en-US', { weekday: 'short' }),
          profit: log && log.type === 'profit' ? log.amount : 0,
          loss: log && log.type === 'loss' ? log.amount : 0,
        });
      }
    }
    return data;
  }, [dailyLogs, timeframe, displayDate]);

  const periodLabel = useMemo(() => {
    if (timeframe === 'month') {
      return displayDate.toLocaleString('default', { month: 'long', year: 'numeric' });
    }
    const startOfWeek = new Date(displayDate);
    startOfWeek.setDate(displayDate.getDate() - startOfWeek.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    return `Week: ${startOfWeek.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    })} - ${endOfWeek.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`;
  }, [displayDate, timeframe]);

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight mb-6">
        Performance Overview
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <StatCard
          title="Total Profit"
          value={`${currency}${performanceStats.totalProfit.toFixed(2)}`}
          color="text-emerald-600"
        />
        <StatCard
          title="Total Loss"
          value={`${currency}${performanceStats.totalLoss.toFixed(2)}`}
          color="text-rose-600"
        />
        <StatCard
          title="Net Profit"
          value={`${currency}${performanceStats.netProfit.toFixed(2)}`}
          color={performanceStats.netProfit >= 0 ? 'text-emerald-600' : 'text-rose-600'}
        />
        <StatCard
          title="Daily Win Rate"
          value={`${performanceStats.dailyWinRate.toFixed(1)}%`}
          color="text-blue-600"
        />
        <StatCard
          title="Avg Profit"
          value={`${currency}${performanceStats.avgProfit.toFixed(2)}`}
          color="text-emerald-600"
        />
        <StatCard
          title="Avg Loss"
          value={`${currency}${performanceStats.avgLoss.toFixed(2)}`}
          color="text-rose-600"
        />
        <StatCard
          title="Max Profit"
          value={`${currency}${performanceStats.maxProfit.toFixed(2)}`}
          color="text-emerald-600"
        />
        <StatCard
          title="Max Loss"
          value={`${currency}${performanceStats.maxLoss.toFixed(2)}`}
          color="text-rose-600"
        />
      </div>

      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-center mb-8 shadow-sm">
        <h3 className="text-slate-500 text-sm sm:text-base font-medium">Risk / Reward Ratio</h3>
        <p className="text-3xl sm:text-4xl font-serif font-bold text-blue-600 mt-1">
          {performanceStats.riskToReward > 0
            ? `${performanceStats.riskToReward.toFixed(2)} : 1`
            : 'N/A'}
        </p>
        <p className="text-xs text-slate-500 mt-2">
          Calculated as Average Profit / Average Loss for selected period
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
            <h2 className="text-lg font-bold font-serif text-slate-900">Daily P/L Breakdown</h2>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1 border border-slate-200">
                <button
                  onClick={prevPeriod}
                  className="p-1 rounded-lg hover:bg-slate-200 transition text-slate-700"
                  aria-label="Previous period"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="font-semibold text-xs text-slate-800 px-2 text-center min-w-[120px]">
                  {periodLabel}
                </span>
                <button
                  onClick={nextPeriod}
                  className="p-1 rounded-lg hover:bg-slate-200 transition text-slate-700"
                  aria-label="Next period"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="flex gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
                <button
                  onClick={() => setTimeframe('week')}
                  className={`px-3 py-1 text-xs rounded-lg font-semibold transition ${
                    timeframe === 'week'
                      ? 'bg-blue-600 text-white font-semibold shadow-sm'
                      : 'text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Week
                </button>
                <button
                  onClick={() => setTimeframe('month')}
                  className={`px-3 py-1 text-xs rounded-lg font-semibold transition ${
                    timeframe === 'month'
                      ? 'bg-blue-600 text-white font-semibold shadow-sm'
                      : 'text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Month
                </button>
              </div>
            </div>
          </div>
          <CustomBarChart data={processedData} currency={currency} />
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <h2 className="text-lg font-bold font-serif text-slate-900 mb-4 text-center">
            Winning vs Losing Days ({timeframe})
          </h2>
          <div className="flex-grow flex flex-col justify-center items-center py-6">
            {performanceStats.totalTradingDays === 0 ? (
              <p className="text-slate-500 text-sm">No trading data recorded for this period.</p>
            ) : (
              <div className="w-full max-w-md space-y-6">
                <div className="text-center">
                  <span className="text-sm text-slate-500 font-medium">Daily Win Rate: </span>
                  <span className="text-2xl font-bold font-serif text-emerald-600 ml-2">
                    {performanceStats.dailyWinRate.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden p-0.5 border border-slate-200">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${performanceStats.dailyWinRate}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-sm font-semibold pt-2">
                  <span className="flex items-center text-emerald-600">
                    <span className="w-3 h-3 bg-emerald-500 rounded-full mr-2 inline-block" />
                    Winning Days: {performanceStats.profitableDays}
                  </span>
                  <span className="flex items-center text-rose-600">
                    <span className="w-3 h-3 bg-rose-500 rounded-full mr-2 inline-block" />
                    Losing Days: {performanceStats.losingDays}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

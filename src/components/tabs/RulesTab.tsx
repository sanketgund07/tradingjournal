import React, { useState } from 'react';
import { Rule, FollowedRules } from '../../types';
import { Modal } from '../Modal';
import { ChevronLeft, ChevronRight, Plus, Trash2, Edit2, CheckSquare } from 'lucide-react';

interface RulesTabProps {
  rules: Rule[];
  setRules: (rules: Rule[] | ((prev: Rule[]) => Rule[])) => void;
  followedRules: FollowedRules;
  setFollowedRules: (followed: FollowedRules | ((prev: FollowedRules) => FollowedRules)) => void;
}

export const RulesTab: React.FC<RulesTabProps> = ({
  rules,
  setRules,
  followedRules,
  setFollowedRules,
}) => {
  const [ruleText, setRuleText] = useState('');
  const [editingRule, setEditingRule] = useState<Rule | null>(null);
  const [isCalendarModalOpen, setCalendarModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const handleAddRule = () => {
    if (ruleText.trim()) {
      if (editingRule) {
        setRules((prev) =>
          prev.map((r) => (r.id === editingRule.id ? { ...r, text: ruleText.trim() } : r))
        );
        setEditingRule(null);
      } else {
        const newRule: Rule = { id: Date.now().toString(), text: ruleText.trim() };
        setRules((prev) => [...prev, newRule]);
      }
      setRuleText('');
    }
  };

  const handleDeleteRule = (id: string) => {
    setRules((prev) => prev.filter((r) => r.id !== id));
  };

  const handleEditRule = (rule: Rule) => {
    setEditingRule(rule);
    setRuleText(rule.text);
  };

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setCalendarModalOpen(true);
  };

  const handleToggleRuleFollowed = (ruleId: string) => {
    const dateKey = selectedDate.toISOString().split('T')[0];
    const currentFollowed = followedRules[dateKey] || [];
    const newFollowed = currentFollowed.includes(ruleId)
      ? currentFollowed.filter((id) => id !== ruleId)
      : [...currentFollowed, ruleId];

    setFollowedRules((prev) => ({
      ...prev,
      [dateKey]: newFollowed,
    }));
  };

  const [calendarDate, setCalendarDate] = useState(new Date());
  const startOfMonth = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), 1);
  const endOfMonth = new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 0);
  const startDay = startOfMonth.getDay();
  const daysInMonth = endOfMonth.getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: startDay }, (_, i) => i);
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-8">
      <div className="text-center bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm">
        <h1 className="text-2xl sm:text-4xl font-serif font-bold text-rose-400 mb-2 tracking-wider">
          लालच, क्रोध, अहंकार
        </h1>
        <p className="text-blue-400 font-serif text-sm sm:text-lg tracking-widest uppercase font-semibold">
          Discipline | Patience | Consistency
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-serif font-bold mb-4 text-slate-900 flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-blue-600" /> My Trading Rules
            </h2>
            <div className="flex flex-col sm:flex-row gap-2 mb-4">
              <input
                type="text"
                value={ruleText}
                onChange={(e) => setRuleText(e.target.value)}
                placeholder="Enter a new rule (e.g., Max 2 losses/day)"
                className="w-full sm:flex-1 p-2.5 bg-white rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-none text-sm text-slate-900"
                onKeyDown={(e) => e.key === 'Enter' && handleAddRule()}
              />
              <button
                onClick={handleAddRule}
                className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-semibold text-sm shadow-sm flex items-center justify-center gap-1.5 flex-shrink-0"
              >
                {editingRule ? 'Update' : <><Plus className="w-4 h-4" /> Add Rule</>}
              </button>
            </div>

            {rules.length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-6">
                No rules added yet. Add your core trading principles above!
              </p>
            ) : (
              <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1 scrollbar-hide">
                {rules.map((rule, index) => (
                  <div
                    key={rule.id}
                    className="flex items-center justify-between gap-2 bg-slate-50 p-2.5 sm:p-3 rounded-xl border border-slate-200 hover:border-slate-300 transition"
                  >
                    <span className="flex-1 text-sm font-medium text-slate-800 break-words min-w-0">
                      <span className="text-blue-600 font-bold mr-2">{index + 1}.</span>{' '}
                      {rule.text}
                    </span>
                    <div className="space-x-1 flex-shrink-0 flex items-center">
                      <button
                        onClick={() => handleEditRule(rule)}
                        className="p-1.5 text-blue-600 hover:bg-slate-200 rounded-lg transition"
                        aria-label="Edit rule"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteRule(rule.id)}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                        aria-label="Delete rule"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-lg sm:text-xl font-serif font-bold mb-4 text-slate-900 text-center">
            Rule Adherence Tracker
          </h2>

          <div className="flex justify-between items-center mb-4 bg-slate-50 p-2 rounded-xl border border-slate-200">
            <button
              onClick={() =>
                setCalendarDate(
                  new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1)
                )
              }
              className="p-2 bg-white rounded-lg hover:bg-slate-200 transition text-slate-700 border border-slate-200"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <h3 className="text-sm font-bold text-center text-slate-900">
              {calendarDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </h3>
            <button
              onClick={() =>
                setCalendarDate(
                  new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1)
                )
              }
              className="p-2 bg-white rounded-lg hover:bg-slate-200 transition text-slate-700 border border-slate-200"
              aria-label="Next month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {daysOfWeek.map((day) => (
              <div
                key={day}
                className="text-center font-bold text-slate-400 text-[10px] uppercase tracking-wider py-1"
              >
                {day}
              </div>
            ))}

            {blanks.map((i) => (
              <div key={`blank-${i}`} className="h-12 opacity-0 pointer-events-none" />
            ))}

            {days.map((day) => {
              const date = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), day);
              const dateKey = date.toISOString().split('T')[0];
              const followedCount = followedRules[dateKey]?.length || 0;
              const isToday = new Date().toDateString() === date.toDateString();

              return (
                <div
                  key={day}
                  onClick={() => handleDayClick(date)}
                  className={`relative p-1 h-12 rounded-xl cursor-pointer transition flex flex-col justify-center items-center border ${
                    isToday
                      ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold shadow-xs'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800'
                  }`}
                >
                  <span className="font-bold text-xs">{day}</span>
                  {followedCount > 0 && (
                    <span className="text-[9px] text-emerald-600 font-bold leading-tight">
                      {followedCount}/{rules.length}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <Modal
        isOpen={isCalendarModalOpen}
        onClose={() => setCalendarModalOpen(false)}
        title={`Rules Followed on ${selectedDate.toLocaleDateString()}`}
      >
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1 scrollbar-hide pt-2">
          {rules.length > 0 ? (
            rules.map((rule) => {
              const dateKey = selectedDate.toISOString().split('T')[0];
              const isChecked = followedRules[dateKey]?.includes(rule.id) || false;

              return (
                <label
                  key={rule.id}
                  className={`flex items-start p-3 rounded-xl cursor-pointer border transition ${
                    isChecked
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleToggleRuleFollowed(rule.id)}
                    className="w-5 h-5 rounded bg-white border-slate-300 text-blue-600 focus:ring-blue-600 mt-0.5"
                  />
                  <span className="ml-3 text-sm font-medium">{rule.text}</span>
                </label>
              );
            })
          ) : (
            <p className="text-center text-slate-500 py-4 text-sm">
              No rules defined yet. Add rules in the left panel first!
            </p>
          )}

          <div className="flex justify-end pt-4 border-t border-slate-200">
            <button
              onClick={() => setCalendarModalOpen(false)}
              className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-semibold text-sm shadow-sm"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

import React, { useState } from 'react';
import { Goal, Currency } from '../../types';
import { Modal } from '../Modal';
import { Plus, Trash2, Edit2, TrendingUp } from 'lucide-react';

interface GoalsTabProps {
  goals: Goal[];
  setGoals: (goals: Goal[] | ((prev: Goal[]) => Goal[])) => void;
  currency: Currency;
}

export const GoalsTab: React.FC<GoalsTabProps> = ({ goals, setGoals, currency }) => {
  const initialGoalState: Omit<Goal, 'id'> = {
    name: '',
    target: 1000,
    current: 0,
  };

  const [isGoalModalOpen, setGoalModalOpen] = useState(false);
  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Partial<Goal>>(initialGoalState);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [updateAmount, setUpdateAmount] = useState<number>(0);

  const openNewModal = () => {
    setEditingGoal(initialGoalState);
    setGoalModalOpen(true);
  };

  const openEditModal = (goal: Goal) => {
    setEditingGoal(goal);
    setGoalModalOpen(true);
  };

  const openUpdateModal = (goal: Goal) => {
    setSelectedGoal(goal);
    setUpdateAmount(0);
    setUpdateModalOpen(true);
  };

  const handleSaveGoal = () => {
    if (editingGoal.id) {
      setGoals((prev) =>
        prev.map((g) => (g.id === editingGoal.id ? (editingGoal as Goal) : g))
      );
    } else if (editingGoal.name) {
      const newGoal: Goal = {
        name: editingGoal.name,
        target: editingGoal.target || 0,
        current: editingGoal.current || 0,
        id: Date.now().toString(),
      };
      setGoals((prev) => [...prev, newGoal]);
    }
    setGoalModalOpen(false);
  };

  const handleDeleteGoal = (id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
    setGoalModalOpen(false);
  };

  const handleUpdateGoal = () => {
    if (selectedGoal) {
      const newCurrent = selectedGoal.current + updateAmount;
      const updatedGoal = { ...selectedGoal, current: Math.max(0, newCurrent) };
      setGoals((prev) => prev.map((g) => (g.id === selectedGoal.id ? updatedGoal : g)));
    }
    setUpdateModalOpen(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight">Trading Goals</h1>
        <button
          onClick={openNewModal}
          className="px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-semibold shadow-sm flex items-center gap-1.5 text-sm"
        >
          <Plus className="w-4 h-4" /> Add Goal
        </button>
      </div>

      {goals.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200">
          <p className="text-slate-500 text-base mb-3">No trading goals created yet.</p>
          <button
            onClick={openNewModal}
            className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition text-sm font-semibold border border-blue-200"
          >
            Create Your First Goal
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {goals.map((goal) => {
            const progress = goal.target > 0 ? (goal.current / goal.target) * 100 : 0;
            return (
              <div
                key={goal.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-slate-300 transition-all"
              >
                <div className="flex justify-between items-center mb-3">
                  <span className="font-bold text-lg text-slate-900 font-serif">{goal.name}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openUpdateModal(goal)}
                      className="px-3 py-1.5 text-xs bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition flex items-center gap-1 shadow-sm"
                    >
                      <TrendingUp className="w-3.5 h-3.5" /> Update
                    </button>
                    <button
                      onClick={() => openEditModal(goal)}
                      className="p-1.5 text-slate-500 hover:text-slate-800 bg-slate-100 rounded-lg hover:bg-slate-200 transition border border-slate-200"
                      aria-label="Edit goal"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="w-full bg-slate-100 rounded-full h-3 mb-2 p-0.5 border border-slate-200">
                  <div
                    className="bg-blue-600 h-full rounded-full transition-all duration-500 shadow-xs"
                    style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                  />
                </div>

                <div className="flex justify-between items-center text-xs text-slate-600">
                  <span className="font-semibold text-blue-600">
                    {progress.toFixed(1)}% Achieved
                  </span>
                  <span className="font-medium text-slate-700">
                    {currency}
                    {goal.current.toFixed(2)} / {currency}
                    {goal.target.toFixed(2)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal
        isOpen={isGoalModalOpen}
        onClose={() => setGoalModalOpen(false)}
        title={editingGoal.id ? 'Edit Goal' : 'New Goal'}
      >
        <div className="space-y-4 pt-2 text-sm">
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">Goal Name</label>
            <input
              type="text"
              value={editingGoal.name || ''}
              onChange={(e) => setEditingGoal({ ...editingGoal, name: e.target.value })}
              placeholder="e.g. Monthly Profit Target"
              className="w-full p-2.5 bg-white rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">Target Amount ({currency})</label>
            <input
              type="number"
              step="any"
              value={editingGoal.target || ''}
              onChange={(e) =>
                setEditingGoal({ ...editingGoal, target: parseFloat(e.target.value) || 0 })
              }
              placeholder="1000"
              className="w-full p-2.5 bg-white rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">Current Progress ({currency})</label>
            <input
              type="number"
              step="any"
              value={editingGoal.current || ''}
              onChange={(e) =>
                setEditingGoal({ ...editingGoal, current: parseFloat(e.target.value) || 0 })
              }
              placeholder="0"
              className="w-full p-2.5 bg-white rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
            {editingGoal.id && (
              <button
                type="button"
                onClick={() => handleDeleteGoal(editingGoal.id!)}
                className="px-4 py-2 bg-rose-50 text-rose-600 border border-rose-200 rounded-xl hover:bg-rose-100 transition font-semibold text-xs flex items-center gap-1"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            )}
            <button
              type="button"
              onClick={handleSaveGoal}
              className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-semibold shadow-sm text-xs"
            >
              Save Goal
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isUpdateModalOpen}
        onClose={() => setUpdateModalOpen(false)}
        title={`Update ${selectedGoal?.name}`}
      >
        <div className="space-y-4 pt-2 text-sm">
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">
              Amount to add (Use negative number for subtraction)
            </label>
            <input
              type="number"
              step="any"
              value={updateAmount || ''}
              onChange={(e) => setUpdateAmount(parseFloat(e.target.value) || 0)}
              placeholder="e.g. 250 or -50"
              className="w-full p-2.5 bg-white rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
            <button
              onClick={handleUpdateGoal}
              className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition shadow-sm text-xs"
            >
              Update Goal
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

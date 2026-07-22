import React, { useState } from 'react';
import { Achievement } from '../../types';
import { EMOJI_OPTIONS } from '../../constants';
import { Modal } from '../Modal';
import { Plus, Trash2 } from 'lucide-react';

interface AchievementsTabProps {
  achievements: Achievement[];
  setAchievements: (achievements: Achievement[] | ((prev: Achievement[]) => Achievement[])) => void;
}

export const AchievementsTab: React.FC<AchievementsTabProps> = ({
  achievements,
  setAchievements,
}) => {
  const initialAchievementState: Omit<Achievement, 'id'> = {
    text: '',
    emoji: '🏆',
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAchievement, setEditingAchievement] =
    useState<Partial<Achievement>>(initialAchievementState);

  const openNewModal = () => {
    setEditingAchievement(initialAchievementState);
    setIsModalOpen(true);
  };

  const openEditModal = (achievement: Achievement) => {
    setEditingAchievement(achievement);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (editingAchievement.id) {
      setAchievements((prev) =>
        prev.map((a) => (a.id === editingAchievement.id ? (editingAchievement as Achievement) : a))
      );
    } else if (editingAchievement.text) {
      const newAchievement: Achievement = {
        text: editingAchievement.text,
        emoji: editingAchievement.emoji || '🏆',
        id: Date.now().toString(),
      };
      setAchievements((prev) => [newAchievement, ...prev]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setAchievements((prev) => prev.filter((a) => a.id !== id));
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight">Achievements</h1>
        <button
          onClick={openNewModal}
          className="px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-semibold shadow-sm flex items-center gap-1.5 text-sm"
        >
          <Plus className="w-4 h-4" /> Add Achievement
        </button>
      </div>

      {achievements.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200">
          <p className="text-slate-500 text-base mb-3">No achievements recorded yet.</p>
          <button
            onClick={openNewModal}
            className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition text-sm font-semibold border border-blue-200"
          >
            Log Your First Achievement
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              onClick={() => openEditModal(ach)}
              className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col items-center text-center cursor-pointer hover:border-slate-300 hover:shadow-md transition-all group"
            >
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{ach.emoji}</div>
              <p className="text-base font-medium text-slate-900 font-serif">{ach.text}</p>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingAchievement.id ? 'Edit Achievement' : 'New Achievement'}
      >
        <div className="space-y-4 pt-2 text-sm">
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">Achievement Milestone</label>
            <textarea
              value={editingAchievement.text || ''}
              onChange={(e) => setEditingAchievement({ ...editingAchievement, text: e.target.value })}
              placeholder="Describe your milestone (e.g. First 10 consecutive winning trades!)..."
              className="w-full p-2.5 bg-white rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              rows={3}
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-600 mb-2 block">Choose Badge Emoji</label>
            <div className="flex flex-wrap justify-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
              {EMOJI_OPTIONS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setEditingAchievement({ ...editingAchievement, emoji })}
                  className={`text-2xl p-2 rounded-xl transition ${
                    editingAchievement.emoji === emoji
                      ? 'bg-blue-100 scale-125 border border-blue-500 shadow-xs'
                      : 'hover:bg-slate-200/60'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
            {editingAchievement.id && (
              <button
                type="button"
                onClick={() => handleDelete(editingAchievement.id!)}
                className="px-4 py-2 bg-rose-50 text-rose-600 border border-rose-200 rounded-xl hover:bg-rose-100 transition font-semibold text-xs flex items-center gap-1"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            )}
            <button
              type="button"
              onClick={handleSave}
              className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-semibold shadow-sm text-xs"
            >
              Save Achievement
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

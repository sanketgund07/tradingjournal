import React, { useState } from 'react';
import { Trade, Currency } from '../../types';
import { Modal } from '../Modal';
import { Plus, Image as ImageIcon, Trash2 } from 'lucide-react';

interface JournalTabProps {
  trades: Trade[];
  setTrades: (trades: Trade[] | ((prev: Trade[]) => Trade[])) => void;
  currency: Currency;
}

export const JournalTab: React.FC<JournalTabProps> = ({ trades, setTrades, currency }) => {
  const initialTradeState: Omit<Trade, 'id'> = {
    date: new Date().toISOString().split('T')[0],
    tradeOfDay: '1st',
    pair: '',
    buySell: 'Buy',
    type: 'profit',
    amount: 0,
    strategy: '',
    riskAmount: 0,
    slSet: 'Yes',
    confidenceLevel: 5,
    psychology: '',
    observation: '',
    mistakes: '',
    tradeCloseType: 'TP',
    screenshot: '',
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTrade, setEditingTrade] = useState<Partial<Trade>>(initialTradeState);
  const [fullImage, setFullImage] = useState<string | null>(null);

  const openNewTradeModal = () => {
    setEditingTrade(initialTradeState);
    setIsModalOpen(true);
  };

  const openEditTradeModal = (trade: Trade) => {
    setEditingTrade(trade);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (editingTrade.id) {
      // Editing existing trade
      setTrades((prev) =>
        prev.map((t) => (t.id === editingTrade.id ? (editingTrade as Trade) : t))
      );
    } else {
      // Adding new trade
      const newTrade: Trade = {
        ...(editingTrade as Omit<Trade, 'id'>),
        id: Date.now().toString(),
      };
      setTrades((prev) => [newTrade, ...prev]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setTrades((prev) => prev.filter((t) => t.id !== id));
    setIsModalOpen(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingTrade((prev) => ({ ...prev, screenshot: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const groupedTrades = trades.reduce((acc: Record<string, Trade[]>, trade) => {
    const date = trade.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(trade);
    return acc;
  }, {} as Record<string, Trade[]>);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight">Journal</h1>
        <button
          onClick={openNewTradeModal}
          className="px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-semibold shadow-sm flex items-center gap-1.5 text-sm"
        >
          <Plus className="w-4 h-4" /> Add Trade
        </button>
      </div>

      {trades.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200">
          <p className="text-slate-500 text-base mb-3">No trades logged yet.</p>
          <button
            onClick={openNewTradeModal}
            className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition text-sm font-semibold border border-blue-200"
          >
            Log Your First Trade
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.keys(groupedTrades)
            .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
            .map((date) => (
              <div key={date}>
                <h2 className="text-lg font-serif font-semibold mb-3 text-slate-700 border-b border-slate-200 pb-1">
                  {new Date(date).toLocaleDateString(undefined, {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {groupedTrades[date].map((trade) => (
                    <div
                      key={trade.id}
                      className="bg-white p-4 rounded-xl border border-slate-200 cursor-pointer hover:border-slate-300 hover:shadow-md transition-all"
                      onClick={() => openEditTradeModal(trade)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-lg text-slate-900">
                              {trade.pair || 'N/A'}
                            </span>
                            <span
                              className={`text-xs px-2 py-0.5 rounded font-semibold ${
                                trade.buySell === 'Buy'
                                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                  : 'bg-amber-50 text-amber-700 border border-amber-200'
                              }`}
                            >
                              {trade.buySell}
                            </span>
                            <span className="text-xs text-slate-400">#{trade.tradeOfDay}</span>
                          </div>
                          <p
                            className={`text-xl font-bold mt-1 ${
                              trade.type === 'profit' ? 'text-emerald-600' : 'text-rose-600'
                            }`}
                          >
                            {trade.type === 'profit' ? '+' : '-'}
                            {currency}
                            {trade.amount}
                          </p>
                        </div>
                        <div className="text-right text-xs text-slate-500 space-y-1">
                          <p className="bg-slate-100 px-2 py-1 rounded border border-slate-200">
                            SL Set:{' '}
                            <span
                              className={
                                trade.slSet === 'Yes' ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold'
                              }
                            >
                              {trade.slSet}
                            </span>
                          </p>
                          <p className="bg-slate-100 px-2 py-1 rounded border border-slate-200">
                            Close: <span className="text-blue-600 font-semibold">{trade.tradeCloseType}</span>
                          </p>
                        </div>
                      </div>

                      {trade.screenshot && (
                        <div
                          className="mb-3 rounded-lg overflow-hidden border border-slate-200 h-32 cursor-pointer relative group"
                          onClick={(e) => {
                            e.stopPropagation();
                            setFullImage(trade.screenshot || null);
                          }}
                        >
                          <img
                            src={trade.screenshot}
                            alt="Trade Screenshot"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs text-white font-semibold">
                            View Fullscreen
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-2 text-[11px] mb-2">
                        <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                          <span className="text-slate-500 block font-medium">Strategy</span>
                          <span className="text-slate-800 truncate block font-semibold">{trade.strategy || 'N/A'}</span>
                        </div>
                        <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                          <span className="text-slate-500 block font-medium">Risk</span>
                          <span className="text-slate-800 block font-semibold">
                            {currency}
                            {trade.riskAmount || 0}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2 text-xs">
                        {trade.psychology && (
                          <div className="bg-blue-50/60 p-2 rounded-lg border border-blue-200/60">
                            <span className="text-blue-700 font-semibold block mb-0.5">
                              Psychology
                            </span>
                            <p className="text-slate-700 line-clamp-2">{trade.psychology}</p>
                          </div>
                        )}
                        {trade.mistakes && (
                          <div className="bg-rose-50/60 p-2 rounded-lg border border-rose-200/60">
                            <span className="text-rose-700 font-semibold block mb-0.5">Mistakes</span>
                            <p className="text-slate-700 line-clamp-2">{trade.mistakes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTrade.id ? 'Edit Trade' : 'Add New Trade'}
        maxWidth="max-w-lg"
      >
        <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-1 scrollbar-hide text-sm">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">Date</label>
              <input
                type="date"
                value={editingTrade.date || ''}
                onChange={(e) => setEditingTrade({ ...editingTrade, date: e.target.value })}
                className="w-full p-2 bg-white rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-none text-slate-900"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">Trade of Day</label>
              <select
                value={editingTrade.tradeOfDay || '1st'}
                onChange={(e) => setEditingTrade({ ...editingTrade, tradeOfDay: e.target.value })}
                className="w-full p-2 bg-white rounded-lg border border-slate-300 text-slate-900 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              >
                <option value="1st">1st Trade</option>
                <option value="2nd">2nd Trade</option>
                <option value="3rd">3rd Trade</option>
                <option value="4th">4th Trade</option>
                <option value="5th+">5th+ Trade</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">Pair / Ticker</label>
              <input
                type="text"
                value={editingTrade.pair || ''}
                onChange={(e) => setEditingTrade({ ...editingTrade, pair: e.target.value })}
                placeholder="e.g. BTC/USD or NIFTY"
                className="w-full p-2 bg-white rounded-lg border border-slate-300 text-slate-900 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">Side</label>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => setEditingTrade({ ...editingTrade, buySell: 'Buy' })}
                  className={`flex-1 p-2 rounded-lg text-xs font-semibold transition ${
                    editingTrade.buySell === 'Buy'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Buy
                </button>
                <button
                  type="button"
                  onClick={() => setEditingTrade({ ...editingTrade, buySell: 'Sell' })}
                  className={`flex-1 p-2 rounded-lg text-xs font-semibold transition ${
                    editingTrade.buySell === 'Sell'
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Sell
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">Result</label>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => setEditingTrade({ ...editingTrade, type: 'profit' })}
                  className={`flex-1 p-2 rounded-lg text-xs font-semibold transition ${
                    editingTrade.type === 'profit'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Profit
                </button>
                <button
                  type="button"
                  onClick={() => setEditingTrade({ ...editingTrade, type: 'loss' })}
                  className={`flex-1 p-2 rounded-lg text-xs font-semibold transition ${
                    editingTrade.type === 'loss'
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Loss
                </button>
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">PnL Amount ({currency})</label>
              <input
                type="number"
                step="any"
                value={editingTrade.amount || ''}
                onChange={(e) =>
                  setEditingTrade({ ...editingTrade, amount: parseFloat(e.target.value) || 0 })
                }
                className="w-full p-2 bg-white rounded-lg border border-slate-300 text-slate-900 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">Risk Amount ({currency})</label>
              <input
                type="number"
                step="any"
                value={editingTrade.riskAmount || ''}
                onChange={(e) =>
                  setEditingTrade({
                    ...editingTrade,
                    riskAmount: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-full p-2 bg-white rounded-lg border border-slate-300 text-slate-900 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">SL Set?</label>
              <select
                value={editingTrade.slSet || 'Yes'}
                onChange={(e) =>
                  setEditingTrade({
                    ...editingTrade,
                    slSet: e.target.value as 'Yes' | 'No',
                  })
                }
                className="w-full p-2 bg-white rounded-lg border border-slate-300 text-slate-900 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">
                Confidence Level ({editingTrade.confidenceLevel || 5}/10)
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={editingTrade.confidenceLevel || 5}
                onChange={(e) =>
                  setEditingTrade({
                    ...editingTrade,
                    confidenceLevel: parseInt(e.target.value),
                  })
                }
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 mt-2"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">Close Type</label>
              <select
                value={editingTrade.tradeCloseType || 'TP'}
                onChange={(e) =>
                  setEditingTrade({ ...editingTrade, tradeCloseType: e.target.value })
                }
                className="w-full p-2 bg-white rounded-lg border border-slate-300 text-slate-900 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              >
                <option value="TP">TP Hit</option>
                <option value="SL">SL Hit</option>
                <option value="Manual">Manual</option>
                <option value="Trailed SL">Trailed SL</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">Strategy</label>
            <input
              type="text"
              value={editingTrade.strategy || ''}
              onChange={(e) => setEditingTrade({ ...editingTrade, strategy: e.target.value })}
              placeholder="e.g. Breakout, Support/Resistance Retest"
              className="w-full p-2 bg-white rounded-lg border border-slate-300 text-slate-900 focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">Psychology / Emotions</label>
            <textarea
              value={editingTrade.psychology || ''}
              onChange={(e) => setEditingTrade({ ...editingTrade, psychology: e.target.value })}
              placeholder="How were you feeling during the trade?"
              className="w-full p-2 bg-white rounded-lg border border-slate-300 text-slate-900 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              rows={2}
            ></textarea>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">Observation & Mistakes</label>
            <div className="grid grid-cols-1 gap-2">
              <textarea
                value={editingTrade.observation || ''}
                onChange={(e) => setEditingTrade({ ...editingTrade, observation: e.target.value })}
                placeholder="Market setup observations..."
                className="w-full p-2 bg-white rounded-lg border border-slate-300 text-slate-900 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                rows={2}
              ></textarea>
              <textarea
                value={editingTrade.mistakes || ''}
                onChange={(e) => setEditingTrade({ ...editingTrade, mistakes: e.target.value })}
                placeholder="Execution mistakes or lessons..."
                className="w-full p-2 bg-white rounded-lg border border-slate-300 text-slate-900 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                rows={2}
              ></textarea>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">Screenshot</label>
            <div className="flex items-center gap-3">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="screenshot-upload"
              />
              <label
                htmlFor="screenshot-upload"
                className="flex-1 p-2 bg-slate-50 rounded-lg border border-dashed border-slate-300 text-center cursor-pointer hover:bg-slate-100 transition text-xs text-slate-600 flex items-center justify-center gap-2"
              >
                <ImageIcon className="w-4 h-4 text-blue-600" />
                {editingTrade.screenshot ? 'Change Screenshot' : 'Upload Screenshot'}
              </label>
              {editingTrade.screenshot && (
                <button
                  type="button"
                  onClick={() => setEditingTrade({ ...editingTrade, screenshot: '' })}
                  className="p-2 bg-rose-50 text-rose-600 border border-rose-200 rounded-lg text-xs font-semibold"
                >
                  Remove
                </button>
              )}
            </div>
            {editingTrade.screenshot && (
              <div
                className="mt-2 rounded-lg overflow-hidden border border-slate-200 h-24 cursor-pointer"
                onClick={() => setFullImage(editingTrade.screenshot || null)}
              >
                <img
                  src={editingTrade.screenshot}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
            {editingTrade.id && (
              <button
                type="button"
                onClick={() => handleDelete(editingTrade.id!)}
                className="px-4 py-2 bg-rose-50 text-rose-600 border border-rose-200 rounded-lg hover:bg-rose-100 transition font-semibold text-xs flex items-center gap-1"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            )}
            <button
              type="button"
              onClick={handleSave}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-xs font-semibold shadow-sm"
            >
              Save Trade
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={!!fullImage}
        onClose={() => setFullImage(null)}
        title="Trade Chart Screenshot"
        maxWidth="max-w-4xl"
      >
        <div className="flex justify-center p-2">
          <img
            src={fullImage || ''}
            alt="Full Trade Screenshot"
            className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-2xl"
            referrerPolicy="no-referrer"
          />
        </div>
      </Modal>
    </div>
  );
};

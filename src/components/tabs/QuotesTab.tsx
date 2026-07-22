import React, { useState } from 'react';
import { Quote } from '../../types';
import { Modal } from '../Modal';
import { Plus, Edit3, Trash2, Quote as QuoteIcon, Search, Copy, Check, Sparkles } from 'lucide-react';

interface QuotesTabProps {
  quotes: Quote[];
  setQuotes: React.Dispatch<React.SetStateAction<Quote[]>>;
}

const DEFAULT_QUOTES: Quote[] = [
  {
    id: 'default-1',
    text: 'The goal of a successful trader is to make the best trades. Money is secondary.',
    author: 'Alexander Elder',
    category: 'Mindset',
  },
  {
    id: 'default-2',
    text: 'Plan your trade and trade your plan.',
    author: 'Trading Rule',
    category: 'Discipline',
  },
  {
    id: 'default-3',
    text: "It's not whether you're right or wrong that's important, but how much money you make when you're right and how much you lose when you're wrong.",
    author: 'George Soros',
    category: 'Risk Management',
  },
  {
    id: 'default-4',
    text: 'Amateurs focus on how much money they can make. Professionals focus on how much money they can lose.',
    author: 'Mark Douglas',
    category: 'Psychology',
  },
];

const CATEGORIES = ['All', 'Mindset', 'Discipline', 'Risk Management', 'Psychology', 'General'];

export const QuotesTab: React.FC<QuotesTabProps> = ({ quotes, setQuotes }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuote, setEditingQuote] = useState<Quote | null>(null);

  const [quoteText, setQuoteText] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('Mindset');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Initialize with default quotes if empty
  const activeQuotes = quotes.length === 0 ? DEFAULT_QUOTES : quotes;

  const handleOpenAddModal = () => {
    setEditingQuote(null);
    setQuoteText('');
    setAuthor('');
    setCategory('Mindset');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (quote: Quote) => {
    setEditingQuote(quote);
    setQuoteText(quote.text);
    setAuthor(quote.author || '');
    setCategory(quote.category || 'General');
    setIsModalOpen(true);
  };

  const handleSaveQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quoteText.trim()) return;

    if (editingQuote) {
      setQuotes((prev) =>
        prev.map((q) =>
          q.id === editingQuote.id
            ? {
                ...q,
                text: quoteText.trim(),
                author: author.trim() || 'Anonymous',
                category: category || 'General',
              }
            : q
        )
      );
    } else {
      const newQuote: Quote = {
        id: Date.now().toString(),
        text: quoteText.trim(),
        author: author.trim() || 'Anonymous',
        category: category || 'General',
      };
      setQuotes((prev) => [newQuote, ...(prev.length === 0 ? DEFAULT_QUOTES : prev)]);
    }

    setIsModalOpen(false);
  };

  const handleDeleteQuote = (id: string) => {
    if (window.confirm('Are you sure you want to delete this quote window?')) {
      if (quotes.length === 0) {
        // If modifying default list
        setQuotes(DEFAULT_QUOTES.filter((q) => q.id !== id));
      } else {
        setQuotes((prev) => prev.filter((q) => q.id !== id));
      }
    }
  };

  const handleCopyText = (text: string, author?: string, id?: string) => {
    const fullText = author ? `"${text}" — ${author}` : `"${text}"`;
    navigator.clipboard.writeText(fullText);
    if (id) {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const filteredQuotes = activeQuotes.filter((q) => {
    const matchesSearch =
      q.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (q.author && q.author.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory =
      selectedCategory === 'All' || (q.category && q.category === selectedCategory);
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Page Header & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <QuoteIcon className="w-7 h-7 text-blue-600" /> Quotes & Mindset
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Build boxes of trading wisdom and reminders to keep your mind focused.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-semibold text-sm shadow-sm flex items-center justify-center gap-2 flex-shrink-0"
        >
          <Plus className="w-4 h-4" /> Add Quote Box
        </button>
      </div>

      {/* Filters & Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search quotes or authors..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Quotes Cards Grid (Box Style) */}
      {filteredQuotes.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-300 p-6">
          <Sparkles className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-700">No quotes found</h3>
          <p className="text-slate-500 text-xs mt-1">
            Try adjusting your search or add a new quote box.
          </p>
          <button
            onClick={handleOpenAddModal}
            className="mt-4 px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-xl hover:bg-blue-700 transition"
          >
            Create Quote Box
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {filteredQuotes.map((quote) => (
            <div
              key={quote.id}
              className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group relative"
            >
              <div>
                <div className="flex justify-between items-start gap-2 mb-3">
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-100">
                    {quote.category || 'Mindset'}
                  </span>
                  
                  {/* Action buttons */}
                  <div className="flex items-center gap-1 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleCopyText(quote.text, quote.author, quote.id)}
                      className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition"
                      title="Copy quote"
                    >
                      {copiedId === quote.id ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => handleOpenEditModal(quote)}
                      className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition"
                      title="Edit quote"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteQuote(quote.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition"
                      title="Delete quote"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Quote Text Box */}
                <div className="relative pl-3 border-l-4 border-blue-500 my-2">
                  <p className="text-slate-800 font-serif italic text-base sm:text-lg leading-relaxed">
                    "{quote.text}"
                  </p>
                </div>
              </div>

              {/* Author Footer */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-600">
                  — {quote.author || 'Anonymous'}
                </span>
                <button
                  onClick={() => handleCopyText(quote.text, quote.author, quote.id)}
                  className="sm:hidden text-blue-600 font-semibold text-[11px] flex items-center gap-1"
                >
                  {copiedId === quote.id ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Quote Modal Window */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingQuote ? 'Edit Quote Box' : 'Create Quote Box'}
      >
        <form onSubmit={handleSaveQuote} className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Quote Text <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={4}
              required
              value={quoteText}
              onChange={(e) => setQuoteText(e.target.value)}
              placeholder="Enter inspiring quote or trading reminder..."
              className="w-full p-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none text-sm text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Author / Source
            </label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="e.g., Mark Douglas, Warren Buffett, or Self"
              className="w-full p-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none text-sm text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none text-sm text-slate-900"
            >
              <option value="Mindset">Mindset</option>
              <option value="Discipline">Discipline</option>
              <option value="Risk Management">Risk Management</option>
              <option value="Psychology">Psychology</option>
              <option value="General">General</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition shadow-sm"
            >
              {editingQuote ? 'Update Quote' : 'Save Quote'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

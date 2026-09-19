import React from 'react';
import { Clock, Search, ArrowRight, Trash2 } from 'lucide-react';
import { SearchHistoryItem } from '../types';

interface HistoryScreenProps {
  history: SearchHistoryItem[];
  onSelectHistory: (item: SearchHistoryItem) => void;
  onClearHistory: () => void;
  onStartSearch: () => void;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({
  history,
  onSelectHistory,
  onClearHistory,
  onStartSearch,
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#E4E4E7]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EEF2FF] text-[#4F46E5] text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Session Logs</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#27272A] tracking-tight">
            Search History
          </h1>
          <p className="text-xs sm:text-sm text-[#71717A] mt-0.5">
            Your recent discovery queries and matched tool sets.
          </p>
        </div>

        {history.length > 0 && (
          <button
            onClick={onClearHistory}
            className="inline-flex items-center gap-1 text-xs text-[#BE123C] hover:text-[#9F1239] px-3 py-1.5 rounded-lg border border-[#FECDD3] bg-[#FFF1F2] hover:bg-[#FFE4E6] transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear history</span>
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="bg-[#FFFFFF] rounded-2xl border border-[#E4E4E7] p-8 text-center max-w-md mx-auto shadow-xs my-8">
          <div className="w-12 h-12 rounded-full bg-[#F4F4F5] text-[#71717A] mx-auto flex items-center justify-center mb-4">
            <Clock className="w-6 h-6" />
          </div>
          <h2 className="text-base font-bold text-[#27272A] mb-1">
            No searches yet
          </h2>
          <p className="text-xs text-[#52525B] mb-5 leading-relaxed">
            When you search for AI tools, your queries and recommended models will appear here.
          </p>
          <button
            onClick={onStartSearch}
            className="px-4 py-2 rounded-lg bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold shadow-sm transition-all"
          >
            <span>Start a discovery query</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectHistory(item)}
              className="bg-[#FFFFFF] rounded-xl p-4 border border-[#E4E4E7] shadow-xs hover:border-[#4F46E5]/40 hover:shadow-sm transition-all cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#F4F4F5] group-hover:bg-[#EEF2FF] text-[#71717A] group-hover:text-[#4F46E5] flex items-center justify-center shrink-0 transition-colors mt-0.5">
                  <Search className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#27272A] group-hover:text-[#4F46E5] transition-colors leading-snug">
                    "{item.query}"
                  </h3>
                  <div className="flex items-center gap-3 mt-1 text-xs text-[#71717A]">
                    <span>{item.toolCount} tools matched</span>
                    <span>•</span>
                    <span>{new Date(item.timestamp).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-medium text-[#4F46E5] group-hover:translate-x-1 transition-transform">
                <span>View matches</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

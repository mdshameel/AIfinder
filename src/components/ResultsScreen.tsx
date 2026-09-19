import React, { useState, useMemo } from 'react';
import { ExternalLink, ArrowLeft, RefreshCw, AlertCircle, ShieldCheck, SlidersHorizontal, ChevronRight } from 'lucide-react';
import { MatchedTool, PricingTier } from '../types';

interface ResultsScreenProps {
  query: string;
  tools: MatchedTool[];
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
  onNewSearch: () => void;
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({
  query,
  tools,
  isLoading,
  error,
  onRetry,
  onNewSearch,
}) => {
  const [sortBy, setSortBy] = useState<'best_match' | 'price_low_high'>('best_match');

  // Pricing rank weight for sorting
  const getTierWeight = (tier: PricingTier): number => {
    switch (tier) {
      case 'Free': return 1;
      case 'Freemium': return 2;
      case 'Paid': return 3;
      case 'Enterprise': return 4;
      default: return 2;
    }
  };

  // Real data sorting
  const sortedTools = useMemo(() => {
    if (!tools || tools.length === 0) return [];
    const copy = [...tools];
    if (sortBy === 'price_low_high') {
      return copy.sort((a, b) => getTierWeight(a.pricing_tier) - getTierWeight(b.pricing_tier));
    }
    // 'best_match' preserves the relevance ranking from Gemini
    return copy;
  }, [tools, sortBy]);

  const getTierBadgeClass = (tier: PricingTier) => {
    switch (tier) {
      case 'Free':
        return 'bg-[#DCFCE7] text-[#15803D] border border-[#BBF7D0]';
      case 'Freemium':
        return 'bg-[#FEF3C7] text-[#B45309] border border-[#FDE68A]';
      case 'Paid':
      case 'Enterprise':
        return 'bg-[#FFE4E6] text-[#BE123C] border border-[#FECDD3]';
      default:
        return 'bg-[#F4F4F5] text-[#52525B] border border-[#E4E4E7]';
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Header Bar with Query, Back action, and Sort toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#E4E4E7]">
        <div>
          <button
            id="btn-back-to-search"
            onClick={onNewSearch}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#71717A] hover:text-[#27272A] mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Edit search prompt</span>
          </button>
          <h1 className="text-xl sm:text-2xl font-bold text-[#27272A] tracking-tight">
            Matched Tools for: <span className="text-[#4F46E5]">"{query}"</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#71717A] mt-0.5">
            {!isLoading && !error && (
              <span>
                Found {sortedTools.length} verified tools matching your specific workflow parameters.
              </span>
            )}
          </p>
        </div>

        {/* Sort Controls */}
        {!isLoading && !error && tools.length > 0 && (
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <div className="flex items-center gap-1.5 bg-[#FFFFFF] border border-[#E4E4E7] p-1 rounded-lg shadow-2xs">
              <span className="text-xs text-[#71717A] pl-2 pr-1 font-medium flex items-center gap-1">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Sort:</span>
              </span>
              <button
                id="btn-sort-best-match"
                onClick={() => setSortBy('best_match')}
                className={`text-xs px-2.5 py-1 rounded-md font-medium transition-colors ${
                  sortBy === 'best_match'
                    ? 'bg-[#4F46E5] text-white shadow-xs'
                    : 'text-[#52525B] hover:text-[#27272A]'
                }`}
              >
                Best match
              </button>
              <button
                id="btn-sort-price"
                onClick={() => setSortBy('price_low_high')}
                className={`text-xs px-2.5 py-1 rounded-md font-medium transition-colors ${
                  sortBy === 'price_low_high'
                    ? 'bg-[#4F46E5] text-white shadow-xs'
                    : 'text-[#52525B] hover:text-[#27272A]'
                }`}
              >
                Price: low to high
              </button>
            </div>
          </div>
        )}
      </div>

      {/* SKELETON LOADING STATE */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div
              key={idx}
              className="bg-[#FFFFFF] rounded-xl p-5 border border-[#E4E4E7] shadow-sm flex flex-col justify-between animate-pulse"
            >
              <div>
                {/* Top Avatar + Badge Row */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#E4E4E7]"></div>
                    <div className="space-y-1.5">
                      <div className="w-24 h-4 bg-[#E4E4E7] rounded"></div>
                      <div className="w-16 h-3 bg-[#F4F4F5] rounded"></div>
                    </div>
                  </div>
                  <div className="w-16 h-5 bg-[#E4E4E7] rounded-full"></div>
                </div>

                {/* Description Skeleton */}
                <div className="space-y-2 mb-4">
                  <div className="w-full h-3 bg-[#F4F4F5] rounded"></div>
                  <div className="w-4/5 h-3 bg-[#F4F4F5] rounded"></div>
                </div>

                {/* Match Rationale Box Skeleton */}
                <div className="bg-[#F4F4F5] rounded-lg p-3 space-y-2">
                  <div className="w-20 h-3 bg-[#E4E4E7] rounded"></div>
                  <div className="w-full h-3 bg-[#E4E4E7] rounded"></div>
                  <div className="w-3/4 h-3 bg-[#E4E4E7] rounded"></div>
                </div>
              </div>

              {/* Bottom Row Skeleton */}
              <div className="flex items-center justify-between pt-4 mt-4 border-t border-[#F4F4F5]">
                <div className="w-16 h-3 bg-[#E4E4E7] rounded"></div>
                <div className="w-20 h-4 bg-[#E4E4E7] rounded"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ERROR STATE */}
      {!isLoading && error && (
        <div className="w-full bg-[#FFFFFF] rounded-2xl border border-[#FECDD3] p-8 text-center max-w-xl mx-auto shadow-sm my-8">
          <div className="w-12 h-12 rounded-full bg-[#FFE4E6] text-[#BE123C] mx-auto flex items-center justify-center mb-4">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-[#27272A] mb-2">
            Unable to Complete Matching
          </h2>
          <p className="text-sm text-[#52525B] mb-6 leading-relaxed">
            {error}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              id="btn-retry-search"
              onClick={onRetry}
              className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Search</span>
            </button>
            <button
              id="btn-error-new-search"
              onClick={onNewSearch}
              className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-[#FFFFFF] hover:bg-[#F4F4F5] text-[#27272A] border border-[#E4E4E7] text-xs font-semibold flex items-center justify-center transition-all"
            >
              <span>Edit Prompt</span>
            </button>
          </div>
        </div>
      )}

      {/* EMPTY / NO MATCH STATE */}
      {!isLoading && !error && sortedTools.length === 0 && (
        <div className="w-full bg-[#FFFFFF] rounded-2xl border border-[#E4E4E7] p-8 text-center max-w-lg mx-auto shadow-sm my-8">
          <div className="w-12 h-12 rounded-full bg-[#F4F4F5] text-[#71717A] mx-auto flex items-center justify-center mb-4">
            <SlidersHorizontal className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-[#27272A] mb-2">
            No Strong Match Found
          </h2>
          <p className="text-sm text-[#52525B] mb-6 leading-relaxed">
            Our catalog did not find an exact match for this phrasing. Try describing your task with different terms or selecting one of our verified examples.
          </p>
          <button
            id="btn-empty-new-search"
            onClick={onNewSearch}
            className="px-5 py-2.5 rounded-lg bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold shadow-sm transition-all"
          >
            <span>Try Another Prompt</span>
          </button>
        </div>
      )}

      {/* RESULTS GRID */}
      {!isLoading && !error && sortedTools.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedTools.map((tool, index) => {
            const isTopMatch = index === 0;
            const targetUrl = tool.website_url || `https://www.google.com/search?q=${encodeURIComponent(tool.name + ' AI tool')}`;

            return (
              <div
                key={tool.name + index}
                id={`tool-card-${index}`}
                className={`bg-[#FFFFFF] rounded-xl p-5 flex flex-col justify-between shadow-xs transition-all hover:-translate-y-1 hover:shadow-md relative group border ${
                  isTopMatch ? 'border-[#4F46E5]/40 ring-1 ring-[#4F46E5]/10' : 'border-[#E4E4E7]'
                }`}
              >
                {/* Accent top stripe for top recommendation */}
                {isTopMatch && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-[#4F46E5] rounded-t-xl"></div>
                )}

                <div>
                  {/* Top Row: Initial Avatar + Name + Category + Pricing Tier */}
                  <div className={`flex items-start justify-between gap-2 mb-3 ${isTopMatch ? 'pt-1' : ''}`}>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center font-bold text-sm shrink-0 border border-[#C7D2FE]/40">
                        {tool.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="text-left">
                        <h2 className="text-base font-bold text-[#27272A] leading-tight group-hover:text-[#4F46E5] transition-colors">
                          {tool.name}
                        </h2>
                        <span className="text-[11px] text-[#71717A] block">
                          {tool.category || 'AI Tool'}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${getTierBadgeClass(
                        tool.pricing_tier
                      )}`}
                    >
                      {tool.pricing_tier}
                    </span>
                  </div>

                  {/* Short Description */}
                  <p className="text-xs text-[#52525B] line-clamp-2 my-2.5 leading-relaxed">
                    {tool.description}
                  </p>

                  {/* Match Rationale Box (Personalized one sentence why it fits) */}
                  <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-2.5 text-left my-3">
                    <span className="text-[11px] text-[#27272A] font-semibold block mb-0.5">
                      Match Rationale:
                    </span>
                    <p className="text-xs text-[#475569] leading-relaxed">
                      {tool.reason}
                    </p>
                  </div>
                </div>

                {/* Bottom Row: Rank + Outbound Link Button */}
                <div className="flex items-center justify-between pt-3 mt-1 border-t border-[#F4F4F5] text-xs text-[#71717A]">
                  <span className="flex items-center gap-1 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#15803D]" />
                    <span>Rank #{index + 1}</span>
                  </span>

                  <a
                    id={`btn-visit-${index}`}
                    href={targetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#4F46E5] hover:text-[#4338CA] font-semibold flex items-center gap-1 hover:underline group/btn text-xs"
                  >
                    <span>Visit website</span>
                    <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

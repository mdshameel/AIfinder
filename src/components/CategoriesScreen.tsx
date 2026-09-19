import React, { useState } from 'react';
import { ExternalLink, Search, ArrowRight, ShieldCheck } from 'lucide-react';
import toolsData from '../data/ai_tools_database.json';
import { AITool, PricingTier } from '../types';

interface CategoriesScreenProps {
  onSearchTool: (prompt: string) => void;
}

export const CategoriesScreen: React.FC<CategoriesScreenProps> = ({ onSearchTool }) => {
  const tools = toolsData as AITool[];
  const categories = ['All', ...Array.from(new Set(tools.map((t) => t.category)))];
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchFilter, setSearchFilter] = useState('');

  const filteredTools = tools.filter((tool) => {
    const matchesCategory = selectedCategory === 'All' || tool.category === selectedCategory;
    const matchesSearch =
      tool.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
      {/* Header */}
      <div className="text-left mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EEF2FF] text-[#4F46E5] text-xs font-semibold uppercase tracking-wider mb-2">
          <span>Catalog Index</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#27272A] tracking-tight">
          Explore AI Tool Categories
        </h1>
        <p className="text-sm text-[#71717A] mt-1">
          Browse verified models and applications across 8 foundational domains.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full pb-2 sm:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-[#4F46E5] text-white shadow-xs'
                  : 'bg-[#FFFFFF] text-[#52525B] hover:text-[#27272A] border border-[#E4E4E7]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Text Filter */}
        <div className="relative w-full sm:w-64 shrink-0">
          <Search className="w-4 h-4 text-[#A1A1AA] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filter catalog..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full h-9 pl-9 pr-3 text-xs bg-[#FFFFFF] border border-[#E4E4E7] rounded-lg focus:outline-none focus:border-[#4F46E5] text-[#27272A] placeholder-[#A1A1AA]"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTools.map((tool, idx) => (
          <div
            key={tool.name + idx}
            className="bg-[#FFFFFF] rounded-xl p-5 border border-[#E4E4E7] shadow-xs hover:border-[#4F46E5]/40 hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center font-bold text-xs shrink-0">
                    {tool.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#27272A] group-hover:text-[#4F46E5] transition-colors leading-tight">
                      {tool.name}
                    </h3>
                    <span className="text-[11px] text-[#71717A]">{tool.category}</span>
                  </div>
                </div>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${getTierBadgeClass(tool.pricing_tier)}`}>
                  {tool.pricing_tier}
                </span>
              </div>

              <p className="text-xs text-[#52525B] line-clamp-3 leading-relaxed mb-4">
                {tool.description}
              </p>
            </div>

            <div className="pt-3 border-t border-[#F4F4F5] flex items-center justify-between">
              <button
                onClick={() => onSearchTool(`Find tools like ${tool.name} for ${tool.category}`)}
                className="text-[11px] text-[#4F46E5] hover:text-[#4338CA] font-medium flex items-center gap-1"
              >
                <span>Find similar</span>
                <ArrowRight className="w-3 h-3" />
              </button>

              <a
                href={tool.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-[#71717A] hover:text-[#27272A] flex items-center gap-1"
              >
                <span>Visit site</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

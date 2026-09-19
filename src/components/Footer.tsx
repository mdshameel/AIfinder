import React from 'react';

interface FooterProps {
  onNavigate: (screen: 'landing' | 'prompt' | 'results' | 'categories' | 'history') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="w-full bg-[#FFFFFF] border-t border-[#E4E4E7] py-6 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-[#71717A]">
          <span className="font-medium text-[#52525B]">AIFinder Catalog © 2025</span>
          <span className="text-[#D4D4D8]">•</span>
          <span className="text-xs text-[#71717A]">
            Systematic discovery & benchmark matrix
          </span>
        </div>
        <div className="flex items-center gap-6">
          <button
            onClick={() => onNavigate('prompt')}
            className="text-xs text-[#71717A] hover:text-[#27272A] transition-colors"
          >
            Discover
          </button>
          <button
            onClick={() => onNavigate('categories')}
            className="text-xs text-[#71717A] hover:text-[#27272A] transition-colors"
          >
            Categories
          </button>
          <button
            onClick={() => onNavigate('history')}
            className="text-xs text-[#71717A] hover:text-[#27272A] transition-colors"
          >
            History
          </button>
        </div>
      </div>
    </footer>
  );
};

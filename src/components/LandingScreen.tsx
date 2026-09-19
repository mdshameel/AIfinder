import React from 'react';
import { ArrowRight, SlidersHorizontal } from 'lucide-react';
import { SearchGlass3D } from './SearchGlass3D';

interface LandingScreenProps {
  onEnterApp: () => void;
  onExploreCategories: () => void;
  onSelectPrompt: (prompt: string) => void;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({
  onEnterApp,
  onExploreCategories,
  onSelectPrompt,
}) => {
  return (
    <div className="w-full flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full px-4 sm:px-6 pt-12 pb-8 sm:pt-16 sm:pb-12 max-w-6xl mx-auto flex flex-col items-center text-center relative overflow-hidden">
        {/* Status Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFFFFF] shadow-sm text-[#52525B] text-xs sm:text-sm mb-6 border border-[#E4E4E7]">
          <span className="w-2 h-2 rounded-full bg-[#15803D] animate-pulse"></span>
          <span className="font-medium text-[#27272A]">Curated index of 500+ AI tools</span>
          <span className="text-[#A1A1AA]">·</span>
          <span className="text-[#71717A]">Updated weekly</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#27272A] max-w-3xl tracking-tight leading-[1.1] mb-4">
          Find the right AI tool.{' '}
          <span className="text-[#4F46E5]">Instantly.</span>
        </h1>

        {/* Subtext */}
        <p className="text-base sm:text-lg text-[#52525B] max-w-2xl text-balance mb-8 leading-relaxed">
          Describe what you want to create in plain language. We match you with verified tools ranked by your exact workflow, hardware constraints, and real budget.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto mb-10 z-20">
          <button
            id="btn-hero-demo"
            onClick={onEnterApp}
            className="w-full sm:w-auto h-11 px-6 rounded-lg bg-[#4F46E5] hover:bg-[#4338CA] text-white text-sm font-medium flex items-center justify-center gap-2 shadow-sm transition-all hover:translate-y-[-1px]"
          >
            <span>Enter App with Demo ID</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            id="btn-hero-categories"
            onClick={onExploreCategories}
            className="w-full sm:w-auto h-11 px-6 rounded-lg bg-[#FFFFFF] hover:bg-[#F4F4F5] text-[#27272A] text-sm font-medium flex items-center justify-center gap-2 shadow-sm transition-all border border-[#E4E4E7]"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#71717A]" />
            <span>Explore Categories</span>
          </button>
        </div>

        {/* Interactive 3D Search Glass & AI Model Constellation Scene */}
        <div className="w-full relative max-w-5xl my-2 min-h-[520px] sm:min-h-[580px] flex items-center justify-center">
          {/* Subtle ambient glow backdrop */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#EEF2FF]/60 via-[#F5F3FF]/40 to-transparent rounded-3xl blur-2xl -z-10 pointer-events-none"></div>

          <SearchGlass3D onEnterApp={onEnterApp} onSelectPrompt={onSelectPrompt} />
        </div>
      </section>

      {/* Bottom Final CTA Banner (Section 5 in Stitch) */}
      <section className="w-full px-4 sm:px-6 py-12 max-w-6xl mx-auto my-6">
        <div className="w-full bg-[#FFFFFF] rounded-2xl p-6 sm:p-12 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6 border border-[#E4E4E7]">
          <div className="max-w-xl text-center sm:text-left">
            <h3 className="text-2xl font-bold text-[#27272A] tracking-tight">
              Ready to build faster? Cut through the noise.
            </h3>
            <p className="text-sm sm:text-base text-[#52525B] mt-2 leading-relaxed">
              Join thousands of developers using our deterministic ranking engine to ship projects in record time.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto shrink-0">
            <button
              id="btn-footer-demo"
              onClick={onEnterApp}
              className="w-full sm:w-auto h-11 px-7 rounded-lg bg-[#4F46E5] hover:bg-[#4338CA] text-white text-sm font-medium flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <span>Enter App with Demo ID</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

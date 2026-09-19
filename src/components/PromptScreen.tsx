import React, { useState } from 'react';
import { ArrowRight, CornerDownLeft, AlertCircle } from 'lucide-react';

interface PromptScreenProps {
  prompt: string;
  setPrompt: (value: string) => void;
  onSubmit: (budget: 'any' | 'free_only', skill: 'beginner' | 'developer') => void;
  isLoading: boolean;
}

export const PromptScreen: React.FC<PromptScreenProps> = ({
  prompt,
  setPrompt,
  onSubmit,
  isLoading,
}) => {
  const [budget, setBudget] = useState<'any' | 'free_only'>('any');
  const [skill, setSkill] = useState<'beginner' | 'developer'>('beginner');
  const [showEmptyWarning, setShowEmptyWarning] = useState(false);

  const exampleQueries = [
    { text: 'I want to build an app', emoji: '🚀' },
    { text: 'I need to edit a video with captions', emoji: '🎬' },
    { text: 'Help me write SEO blog content', emoji: '✍️' },
    { text: 'I want a customer support chatbot for my website', emoji: '💬' },
    { text: 'Generate game assets and concept art', emoji: '🎨' },
  ];

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleTriggerSubmit();
    }
  };

  const handleTriggerSubmit = () => {
    if (!prompt.trim()) {
      setShowEmptyWarning(true);
      return;
    }
    setShowEmptyWarning(false);
    onSubmit(budget, skill);
  };

  const handleSelectExample = (text: string) => {
    setPrompt(text);
    setShowEmptyWarning(false);
  };

  const isPromptEmpty = !prompt.trim();

  return (
    <div className="w-full flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] py-8 px-4 sm:px-6">
      <div className="w-full max-w-4xl flex flex-col items-center text-center">
        {/* Natural Language Engine Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EEF2FF] text-[#4F46E5] text-xs font-semibold uppercase tracking-wider mb-5 border border-[#C7D2FE]/60">
          <span className="w-2 h-2 rounded-full bg-[#4F46E5]"></span>
          <span>Natural Language Engine</span>
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-5xl font-bold text-[#27272A] tracking-tight mb-3">
          What do you want to build or create?
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-base text-[#52525B] max-w-xl text-balance mb-8">
          Tell us in your own words. We'll analyze hundreds of tools to find your ideal match.
        </p>

        {/* Input Card Container */}
        <div className="w-full bg-[#FFFFFF] rounded-2xl border border-[#E4E4E7] shadow-sm p-4 sm:p-6 text-left transition-all focus-within:border-[#4F46E5] focus-within:ring-2 focus-within:ring-[#4F46E5]/10">
          {/* Main Textarea */}
          <textarea
            id="prompt-input"
            rows={4}
            value={prompt}
            onChange={(e) => {
              setPrompt(e.target.value);
              if (showEmptyWarning && e.target.value.trim()) {
                setShowEmptyWarning(false);
              }
            }}
            onKeyDown={handleKeyDown}
            placeholder="e.g. I want to build a full-stack SaaS web app with authentication and a database without writing complex code..."
            className="w-full text-base sm:text-lg text-[#27272A] placeholder-[#A1A1AA] resize-none bg-transparent border-0 focus:outline-none focus:ring-0 leading-relaxed font-normal"
          />

          {/* Validation Notice if empty */}
          {showEmptyWarning && (
            <div className="mb-3 p-2.5 rounded-lg bg-[#FFE4E6] border border-[#FECDD3] text-[#BE123C] text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Please describe what you want to create before finding tools.</span>
            </div>
          )}

          {/* Bottom Filter Controls Bar inside the prompt card */}
          <div className="pt-3 border-t border-[#F4F4F5] flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              {/* BUDGET Toggle */}
              <div className="flex items-center gap-1.5 bg-[#F4F4F5] p-1 rounded-lg">
                <span className="text-[11px] font-semibold text-[#71717A] px-2 uppercase tracking-wider">
                  Budget
                </span>
                <button
                  type="button"
                  id="filter-budget-any"
                  onClick={() => setBudget('any')}
                  className={`text-xs px-2.5 py-1 rounded-md font-medium transition-colors ${
                    budget === 'any'
                      ? 'bg-[#FFFFFF] text-[#27272A] shadow-xs'
                      : 'text-[#71717A] hover:text-[#27272A]'
                  }`}
                >
                  Any
                </button>
                <button
                  type="button"
                  id="filter-budget-free"
                  onClick={() => setBudget('free_only')}
                  className={`text-xs px-2.5 py-1 rounded-md font-medium transition-colors ${
                    budget === 'free_only'
                      ? 'bg-[#FFFFFF] text-[#27272A] shadow-xs'
                      : 'text-[#71717A] hover:text-[#27272A]'
                  }`}
                >
                  Free Only
                </button>
              </div>

              {/* SKILL Toggle */}
              <div className="flex items-center gap-1.5 bg-[#F4F4F5] p-1 rounded-lg">
                <span className="text-[11px] font-semibold text-[#71717A] px-2 uppercase tracking-wider">
                  Skill
                </span>
                <button
                  type="button"
                  id="filter-skill-beginner"
                  onClick={() => setSkill('beginner')}
                  className={`text-xs px-2.5 py-1 rounded-md font-medium transition-colors ${
                    skill === 'beginner'
                      ? 'bg-[#FFFFFF] text-[#27272A] shadow-xs'
                      : 'text-[#71717A] hover:text-[#27272A]'
                  }`}
                >
                  Beginner
                </button>
                <button
                  type="button"
                  id="filter-skill-developer"
                  onClick={() => setSkill('developer')}
                  className={`text-xs px-2.5 py-1 rounded-md font-medium transition-colors ${
                    skill === 'developer'
                      ? 'bg-[#FFFFFF] text-[#27272A] shadow-xs'
                      : 'text-[#71717A] hover:text-[#27272A]'
                  }`}
                >
                  Developer
                </button>
              </div>
            </div>

            {/* Actions: Enter Hint + Submit Button */}
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-1 text-xs text-[#A1A1AA] font-mono px-2 py-1 bg-[#F4F4F5] rounded-md">
                <CornerDownLeft className="w-3.5 h-3.5" />
                <span>Enter</span>
              </div>

              <div className="relative group">
                <button
                  id="btn-find-tools"
                  type="button"
                  onClick={handleTriggerSubmit}
                  disabled={isPromptEmpty || isLoading}
                  className={`h-10 px-5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 shadow-sm transition-all ${
                    isPromptEmpty || isLoading
                      ? 'bg-[#E4E4E7] text-[#A1A1AA] cursor-not-allowed'
                      : 'bg-[#4F46E5] hover:bg-[#4338CA] text-white hover:translate-y-[-1px]'
                  }`}
                >
                  <span>Find Tools</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Visible tooltip if empty */}
                {isPromptEmpty && (
                  <div className="absolute right-0 bottom-full mb-2 hidden group-hover:block whitespace-nowrap bg-[#27272A] text-white text-[11px] px-2.5 py-1 rounded shadow-md pointer-events-none z-30">
                    Please enter a task or idea to search
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Example Query Section */}
        <div className="w-full mt-6 flex flex-col items-start text-left">
          <div className="w-full flex items-center justify-between mb-2.5 text-xs text-[#71717A]">
            <span>Or try an example query:</span>
            <span className="text-[11px] text-[#A1A1AA]">Click to populate</span>
          </div>

          <div className="flex flex-wrap gap-2 w-full">
            {exampleQueries.map((ex, index) => (
              <button
                key={index}
                type="button"
                id={`example-chip-${index}`}
                onClick={() => handleSelectExample(ex.text)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FFFFFF] hover:bg-[#F4F4F5] border border-[#E4E4E7] text-xs text-[#27272A] transition-all hover:border-[#4F46E5]/40 hover:-translate-y-0.5 cursor-pointer shadow-2xs"
              >
                <span>{ex.emoji}</span>
                <span>{ex.text}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Database Index Verified Badge */}
        <div className="inline-flex items-center gap-2 mt-12 text-xs font-mono text-[#71717A]">
          <span className="w-2 h-2 rounded-full bg-[#15803D]"></span>
          <span>Indexed 48 tools across 8 categories</span>
          <span className="text-[#D4D4D8]">·</span>
          <span>Database verified Jan 2026</span>
        </div>
      </div>
    </div>
  );
};

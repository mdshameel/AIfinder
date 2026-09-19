import React from 'react';
import { User, LogOut } from 'lucide-react';
import { UserProfile } from '../types';
import { Logo } from './Logo';

interface NavbarProps {
  currentScreen: 'landing' | 'prompt' | 'results' | 'categories' | 'history';
  onNavigate: (screen: 'landing' | 'prompt' | 'results' | 'categories' | 'history') => void;
  user: UserProfile | null;
  onOpenAuth: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentScreen,
  onNavigate,
  user,
  onOpenAuth,
  onLogout,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 w-full z-50 bg-[#FFFFFF]/95 backdrop-blur-md border-b border-[#E4E4E7]">
      <div className="h-16 max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-6 sm:gap-8">
          <button
            id="nav-brand-btn"
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-2 text-left focus:outline-none group"
          >
            <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center shadow-xs transition-transform group-hover:scale-105">
              <Logo className="w-8 h-8" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="font-semibold text-lg text-[#27272A] tracking-tight">
                AIFinder
              </span>
              <span className="text-[11px] text-[#71717A] uppercase tracking-wider font-medium ml-1 hidden sm:inline-block">
                Discovery engine
              </span>
            </div>
          </button>

          {/* Navigation Links */}
          <nav className="flex items-center gap-1">
            <button
              id="nav-discover-tab"
              onClick={() => onNavigate('prompt')}
              className={`text-sm px-3 py-1.5 rounded-lg font-medium transition-colors ${
                currentScreen === 'prompt' || currentScreen === 'results'
                  ? 'bg-[#EEF2FF] text-[#4F46E5]'
                  : 'text-[#52525B] hover:text-[#27272A] hover:bg-[#F4F4F5]'
              }`}
            >
              Discover
            </button>
            <button
              id="nav-categories-tab"
              onClick={() => onNavigate('categories')}
              className={`text-sm px-3 py-1.5 rounded-lg font-medium transition-colors ${
                currentScreen === 'categories'
                  ? 'bg-[#EEF2FF] text-[#4F46E5]'
                  : 'text-[#52525B] hover:text-[#27272A] hover:bg-[#F4F4F5]'
              }`}
            >
              Categories
            </button>
            <button
              id="nav-history-tab"
              onClick={() => onNavigate('history')}
              className={`text-sm px-3 py-1.5 rounded-lg font-medium transition-colors ${
                currentScreen === 'history'
                  ? 'bg-[#EEF2FF] text-[#4F46E5]'
                  : 'text-[#52525B] hover:text-[#27272A] hover:bg-[#F4F4F5]'
              }`}
            >
              History
            </button>
          </nav>
        </div>

        {/* Auth / Account */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2.5">
              <div className="hidden sm:flex flex-col items-end text-right">
                <span className="text-xs font-semibold text-[#27272A] leading-tight">
                  {user.name}
                </span>
                <span className="text-[11px] text-[#71717A] leading-none">
                  {user.email}
                </span>
              </div>
              <div
                title={user.email}
                className="w-8 h-8 rounded-full bg-[#4F46E5] text-white flex items-center justify-center font-medium text-xs shadow-sm"
              >
                {user.name ? user.name[0].toUpperCase() : 'U'}
              </div>
              <button
                id="btn-logout"
                onClick={onLogout}
                title="Log out"
                className="p-1.5 rounded-lg text-[#71717A] hover:text-[#DC2626] hover:bg-[#F4F4F5] transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                id="btn-nav-login"
                onClick={onOpenAuth}
                className="text-sm font-medium text-[#52525B] hover:text-[#27272A] px-2.5 py-1.5 rounded-lg transition-colors"
              >
                Login
              </button>
              <button
                id="btn-nav-getstarted"
                onClick={onOpenAuth}
                className="text-sm font-medium bg-[#4F46E5] hover:bg-[#4338CA] text-white px-3.5 py-1.5 rounded-lg transition-colors shadow-sm inline-flex items-center justify-center"
              >
                Get Started
              </button>
              <button
                id="btn-nav-user-icon"
                onClick={onOpenAuth}
                className="w-8 h-8 rounded-full bg-[#4F46E5] flex items-center justify-center text-white shrink-0 hover:opacity-90 transition-opacity"
              >
                <User className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

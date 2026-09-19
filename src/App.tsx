import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingScreen } from './components/LandingScreen';
import { PromptScreen } from './components/PromptScreen';
import { ResultsScreen } from './components/ResultsScreen';
import { CategoriesScreen } from './components/CategoriesScreen';
import { HistoryScreen } from './components/HistoryScreen';
import { AuthModal } from './components/AuthModal';
import { MatchedTool, UserProfile, SearchHistoryItem } from './types';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'landing' | 'prompt' | 'results' | 'categories' | 'history'>('landing');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Search state
  const [prompt, setPrompt] = useState('');
  const [activeQuery, setActiveQuery] = useState('');
  const [activeBudget, setActiveBudget] = useState<'any' | 'free_only'>('any');
  const [activeSkill, setActiveSkill] = useState<'beginner' | 'developer'>('beginner');
  const [tools, setTools] = useState<MatchedTool[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);

  // Load session on startup
  useEffect(() => {
    const savedToken = localStorage.getItem('aifinder_auth_token');
    if (savedToken) {
      setAuthToken(savedToken);
      fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${savedToken}` },
      })
        .then((res) => {
          if (res.ok) return res.json();
          throw new Error('Invalid session');
        })
        .then((data) => {
          if (data.user) {
            setUser(data.user);
          }
        })
        .catch(() => {
          localStorage.removeItem('aifinder_auth_token');
          setAuthToken(null);
        });

      // Fetch search history
      fetch('/api/history', {
        headers: { Authorization: `Bearer ${savedToken}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.history) {
            setHistory(data.history);
          }
        })
        .catch(() => {});
    }
  }, []);

  const handleAuthSuccess = (authenticatedUser: UserProfile, token: string) => {
    setUser(authenticatedUser);
    setAuthToken(token);
    // Fetch user history
    fetch('/api/history', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.history) setHistory(data.history);
      })
      .catch(() => {});
  };

  const handleLogout = async () => {
    if (authToken) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${authToken}` },
        });
      } catch (e) {}
    }
    localStorage.removeItem('aifinder_auth_token');
    setUser(null);
    setAuthToken(null);
  };

  const handleEnterWithDemo = async () => {
    if (!user) {
      try {
        const res = await fetch('/api/auth/demo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
        const data = await res.json();
        if (res.ok) {
          localStorage.setItem('aifinder_auth_token', data.token);
          setUser(data.user);
          setAuthToken(data.token);
        }
      } catch (e) {
        console.error('Demo login error:', e);
      }
    }
    setCurrentScreen('prompt');
  };

  const executeSearch = async (
    searchPrompt: string,
    budget: 'any' | 'free_only' = 'any',
    skill: 'beginner' | 'developer' = 'beginner'
  ) => {
    if (!searchPrompt.trim()) return;

    setActiveQuery(searchPrompt.trim());
    setActiveBudget(budget);
    setActiveSkill(skill);
    setIsLoading(true);
    setSearchError(null);
    setCurrentScreen('results');

    try {
      const res = await fetch('/api/match', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
        body: JSON.stringify({
          prompt: searchPrompt.trim(),
          budget,
          skill,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to match tools. Please try again.');
      }

      const matchedTools: MatchedTool[] = data.tools || [];
      setTools(matchedTools);

      // Save to history
      const historyItem: SearchHistoryItem = {
        id: 'hist_' + Date.now(),
        query: searchPrompt.trim(),
        timestamp: new Date().toISOString(),
        toolCount: matchedTools.length,
        tools: matchedTools,
      };

      setHistory((prev) => [historyItem, ...prev.filter((h) => h.query !== searchPrompt.trim())]);

      if (authToken) {
        fetch('/api/history', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({ searchItem: historyItem }),
        }).catch(() => {});
      }
    } catch (err: any) {
      console.error('Search failed:', err);
      setSearchError(err.message || 'An error occurred while communicating with the AI matching engine.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = async () => {
    setHistory([]);
    if (authToken) {
      try {
        await fetch('/api/history', {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${authToken}` },
        });
      } catch (e) {}
    }
  };

  const handleSelectHistoryItem = (item: SearchHistoryItem) => {
    setActiveQuery(item.query);
    setPrompt(item.query);
    setTools(item.tools);
    setSearchError(null);
    setIsLoading(false);
    setCurrentScreen('results');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] text-[#27272A] font-sans antialiased selection:bg-[#4F46E5]/15 selection:text-[#4F46E5]">
      {/* Navigation Header */}
      <Navbar
        currentScreen={currentScreen}
        onNavigate={(screen) => setCurrentScreen(screen)}
        user={user}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full pt-16 flex flex-col items-center">
        {currentScreen === 'landing' && (
          <LandingScreen
            onEnterApp={handleEnterWithDemo}
            onExploreCategories={() => setCurrentScreen('categories')}
            onSelectPrompt={(text) => {
              setPrompt(text);
              setCurrentScreen('prompt');
            }}
          />
        )}

        {currentScreen === 'prompt' && (
          <PromptScreen
            prompt={prompt}
            setPrompt={setPrompt}
            onSubmit={(budget, skill) => executeSearch(prompt, budget, skill)}
            isLoading={isLoading}
          />
        )}

        {currentScreen === 'results' && (
          <ResultsScreen
            query={activeQuery}
            tools={tools}
            isLoading={isLoading}
            error={searchError}
            onRetry={() => executeSearch(activeQuery, activeBudget, activeSkill)}
            onNewSearch={() => setCurrentScreen('prompt')}
          />
        )}

        {currentScreen === 'categories' && (
          <CategoriesScreen
            onSearchTool={(presetPrompt) => {
              setPrompt(presetPrompt);
              executeSearch(presetPrompt, 'any', 'beginner');
            }}
          />
        )}

        {currentScreen === 'history' && (
          <HistoryScreen
            history={history}
            onSelectHistory={handleSelectHistoryItem}
            onClearHistory={handleClearHistory}
            onStartSearch={() => setCurrentScreen('prompt')}
          />
        )}
      </main>

      {/* Global Footer */}
      <Footer onNavigate={(screen) => setCurrentScreen(screen)} />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
}

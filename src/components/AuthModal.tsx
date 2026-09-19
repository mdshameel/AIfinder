import React, { useState } from 'react';
import { X, Mail, KeyRound, User, AlertCircle, Loader2, Sparkles } from 'lucide-react';
import { UserProfile } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: UserProfile, token: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Client-side quick checks
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      const endpoint = mode === 'signup' ? '/api/auth/signup' : '/api/auth/login';
      const body = mode === 'signup'
        ? { email: email.trim(), password, name: name.trim() }
        : { email: email.trim(), password };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed. Please check your credentials.');
      }

      // Save token to localStorage for persistent session across page refresh
      localStorage.setItem('aifinder_auth_token', data.token);
      onAuthSuccess(data.user, data.token);
      onClose();
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/auth/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Unable to log in with Demo ID.');
      }
      localStorage.setItem('aifinder_auth_token', data.token);
      onAuthSuccess(data.user, data.token);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Unable to log in with Demo ID.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#27272A]/50 backdrop-blur-sm">
      <div className="bg-[#FFFFFF] w-full max-w-md rounded-2xl border border-[#E4E4E7] shadow-xl p-6 sm:p-8 relative">
        {/* Close Button */}
        <button
          id="btn-close-auth-modal"
          onClick={onClose}
          className="absolute top-5 right-5 text-[#71717A] hover:text-[#27272A] p-1.5 rounded-lg hover:bg-[#F4F4F5] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] text-[#4F46E5] mx-auto flex items-center justify-center mb-3">
            <Sparkles className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-[#27272A] tracking-tight">
            {mode === 'login' ? 'Welcome back to AIFinder' : 'Create your AIFinder account'}
          </h2>
          <p className="text-xs sm:text-sm text-[#71717A] mt-1">
            {mode === 'login'
              ? 'Access your search history and personalized matches.'
              : 'Start discovering verified tools for your exact workflows.'}
          </p>
        </div>

        {/* 1-Click Demo Login */}
        <div className="mb-5">
          <button
            id="btn-demo-auth-quick"
            type="button"
            onClick={handleDemoLogin}
            disabled={loading}
            className="w-full h-10 px-4 rounded-lg bg-[#F4F4F5] hover:bg-[#E4E4E7] text-[#27272A] text-xs font-semibold flex items-center justify-center gap-2 border border-[#E4E4E7] transition-colors disabled:opacity-50"
          >
            <span className="w-2 h-2 rounded-full bg-[#15803D]"></span>
            <span>Continue as Demo Architect (instant 1-click)</span>
          </button>
        </div>

        <div className="relative flex py-2 items-center mb-5">
          <div className="flex-grow border-t border-[#E4E4E7]"></div>
          <span className="flex-shrink mx-3 text-[11px] text-[#A1A1AA] uppercase tracking-wider font-medium">
            or with email
          </span>
          <div className="flex-grow border-t border-[#E4E4E7]"></div>
        </div>

        {/* Mode Selector Tabs */}
        <div className="grid grid-cols-2 p-1 bg-[#F4F4F5] rounded-lg mb-5 text-xs font-medium">
          <button
            type="button"
            onClick={() => { setMode('login'); setError(null); }}
            className={`py-1.5 rounded-md transition-all ${
              mode === 'login'
                ? 'bg-[#FFFFFF] text-[#27272A] shadow-xs'
                : 'text-[#71717A] hover:text-[#27272A]'
            }`}
          >
            Log in
          </button>
          <button
            type="button"
            onClick={() => { setMode('signup'); setError(null); }}
            className={`py-1.5 rounded-md transition-all ${
              mode === 'signup'
                ? 'bg-[#FFFFFF] text-[#27272A] shadow-xs'
                : 'text-[#71717A] hover:text-[#27272A]'
            }`}
          >
            Create account
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-[#FFE4E6] border border-[#FECDD3] text-[#BE123C] text-xs flex items-start gap-2 leading-relaxed">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-medium text-[#52525B] mb-1">
                Full name (optional)
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#A1A1AA] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="input-name"
                  type="text"
                  placeholder="e.g. Alex Rivera"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-10 pl-9 pr-3 text-sm bg-[#FFFFFF] border border-[#E4E4E7] rounded-lg focus:outline-none focus:border-[#4F46E5] text-[#27272A] placeholder-[#A1A1AA]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-[#52525B] mb-1">
              Email address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#A1A1AA] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="input-email"
                type="email"
                required
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-10 pl-9 pr-3 text-sm bg-[#FFFFFF] border border-[#E4E4E7] rounded-lg focus:outline-none focus:border-[#4F46E5] text-[#27272A] placeholder-[#A1A1AA]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#52525B] mb-1">
              Password
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-[#A1A1AA] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="input-password"
                type="password"
                required
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-10 pl-9 pr-3 text-sm bg-[#FFFFFF] border border-[#E4E4E7] rounded-lg focus:outline-none focus:border-[#4F46E5] text-[#27272A] placeholder-[#A1A1AA]"
              />
            </div>
          </div>

          <button
            id="btn-auth-submit"
            type="submit"
            disabled={loading}
            className="w-full h-10 mt-2 rounded-lg bg-[#4F46E5] hover:bg-[#4338CA] text-white text-sm font-medium flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <span>{mode === 'login' ? 'Sign in' : 'Create account'}</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

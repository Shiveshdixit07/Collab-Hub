import React, { memo } from 'react';
import { Mail, Lock, LogIn } from 'lucide-react';

const InfluencerLogin = memo(function InfluencerLogin({
  form,
  onChange,
  onBack,
  onSubmit,
  isSubmitting = false,
  error,
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 py-12 px-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden">
          <div className="px-8 py-6 bg-gradient-to-r from-pink-500 to-purple-600">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-white">Influencer Login</h2>
              <button
                onClick={onBack}
                className="text-white/80 hover:text-white transition-colors"
              >
                ← Back
              </button>
            </div>
            <p className="text-pink-100 mt-2">
              Access your dashboard and manage collaborations
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit();
            }}
            className="p-8 space-y-6"
          >
            {error && (
              <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/60" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => onChange('email', e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-400/40 transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/60" />
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => onChange('password', e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-400/40 transition-all"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 disabled:opacity-60 disabled:cursor-not-allowed text-white py-3 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl cursor-pointer"
            >
              <LogIn className="h-5 w-5" />
              <span>{isSubmitting ? 'Logging in...' : 'Log In'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
});

export default InfluencerLogin;


'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authAPI } from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    full_name: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('⚠️ Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('⚠️ Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await authAPI.register({
        email: formData.email,
        username: formData.username,
        password: formData.password,
        full_name: formData.full_name || undefined,
      });

      // Auto-login after registration
      const loginResponse = await authAPI.login(formData.username, formData.password);
      localStorage.setItem('token', loginResponse.access_token);

      const userData = await authAPI.getCurrentUser();
      localStorage.setItem('user', JSON.stringify(userData));

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Registration error:', err);

      // Better error messages
      if (err.message === 'Network Error' || err.code === 'ERR_NETWORK') {
        setError('🔴 Backend server is offline. Please run: docker-compose up -d');
      } else if (err.response?.data?.detail) {
        setError(`⚠️ ${err.response.data.detail}`);
      } else {
        setError('⚠️ Registration failed. Check if backend is running (docker-compose ps)');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cyber-dark-900 flex items-center justify-center py-12 px-4 relative overflow-hidden">
      {/* Animated Grid Background */}
      <div className="absolute inset-0" style={{
        backgroundImage: `
          linear-gradient(rgba(0, 255, 255, 0.02) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0, 255, 255, 0.02) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px',
      }}></div>

      {/* Neon Glow Effects */}
      <div className="absolute top-20 -left-20 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 -right-20 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl"></div>

      <div className="max-w-md w-full relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg blur-md opacity-75 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="text-5xl font-black tracking-tighter">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-500">
                    ⚡ CODEC
                  </span>
                </div>
                <div className="text-xs text-gray-500 uppercase tracking-widest mt-1">Cyberpunk Marketplace</div>
              </div>
            </div>
          </Link>
        </div>

        {/* Register Card */}
        <div className="bg-cyber-dark-700/80 backdrop-blur-md border border-primary-500/30 rounded-xl shadow-glow p-8 animate-scale-in">
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-secondary-500 mb-2 text-center uppercase tracking-tight">
            Join the Network
          </h1>
          <p className="text-gray-400 text-center mb-8">Enter the cyberpunk marketplace</p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-6 animate-slide-down backdrop-blur-sm">
              <p className="text-sm font-mono">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="full_name" className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wide">
                <span className="text-accent-500">▹</span> Full Name (Optional)
              </label>
              <input
                id="full_name"
                type="text"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                className="w-full px-4 py-3 bg-cyber-dark-800 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-600 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/50 outline-none transition-all font-mono"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wide">
                <span className="text-primary-500">▹</span> Username *
              </label>
              <input
                id="username"
                type="text"
                required
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full px-4 py-3 bg-cyber-dark-800 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-600 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/50 outline-none transition-all font-mono"
                placeholder="trader_001"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wide">
                <span className="text-secondary-500">▹</span> Email Address *
              </label>
              <input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-cyber-dark-800 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-600 focus:border-secondary-500 focus:ring-2 focus:ring-secondary-500/50 outline-none transition-all font-mono"
                placeholder="trader@codec.net"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wide">
                <span className="text-primary-500">▹</span> Password *
              </label>
              <input
                id="password"
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 bg-cyber-dark-800 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-600 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/50 outline-none transition-all font-mono"
                placeholder="••••••••"
              />
              <p className="text-xs text-gray-500 mt-1 font-mono">Min. 6 characters</p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wide">
                <span className="text-secondary-500">▹</span> Confirm Password *
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full px-4 py-3 bg-cyber-dark-800 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-600 focus:border-secondary-500 focus:ring-2 focus:ring-secondary-500/50 outline-none transition-all font-mono"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-start pt-2">
              <input
                type="checkbox"
                required
                className="rounded bg-cyber-dark-800 border-gray-700 text-primary-500 focus:ring-primary-500 focus:ring-offset-cyber-dark-700 mt-1"
              />
              <span className="ml-3 text-sm text-gray-400">
                I agree to the{' '}
                <a href="/terms" className="text-primary-500 hover:text-primary-400 font-semibold">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="/privacy" className="text-secondary-500 hover:text-secondary-400 font-semibold">
                  Privacy Policy
                </a>
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg blur opacity-75 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative bg-gradient-to-r from-primary-500 to-secondary-500 text-cyber-dark-900 py-3 rounded-lg font-black text-lg uppercase tracking-wide hover:shadow-glow-lg transition-all duration-300 transform group-hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Connecting...
                  </span>
                ) : (
                  '⚡ Create Account'
                )}
              </div>
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Already connected?{' '}
              <Link href="/auth/login" className="text-primary-500 font-bold hover:text-primary-400 transition-colors">
                Sign In →
              </Link>
            </p>
          </div>
        </div>

        {/* Benefits */}
        <div className="mt-8 bg-cyber-dark-700/50 backdrop-blur-sm border border-primary-500/20 rounded-xl p-6 space-y-3">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-accent-500 to-accent-600 p-2 rounded-lg">
              <svg className="w-5 h-5 text-cyber-dark-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-sm text-gray-300 font-semibold">100% Free Forever</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-2 rounded-lg">
              <svg className="w-5 h-5 text-cyber-dark-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <p className="text-sm text-gray-300 font-semibold">Instant Access</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-secondary-500 to-secondary-600 p-2 rounded-lg">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <p className="text-sm text-gray-300 font-semibold">Join 500+ Traders</p>
          </div>
        </div>
      </div>
    </div>
  );
}

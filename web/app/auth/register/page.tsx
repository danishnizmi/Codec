'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const response = await api.post('/auth/send-code', { email });
      setMessage(response.data.message);
      setStep('code');
    } catch (err: any) {
      console.error('Send code error:', err);

      if (err.response?.data?.detail) {
        setError(`⚠️ ${err.response.data.detail}`);
      } else if (err.message === 'Network Error' || err.code === 'ERR_NETWORK') {
        setError('🔴 Cannot connect to server. Check if Docker containers are running.');
      } else {
        setError('⚠️ Failed to send code. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/verify-code', { email, code });

      // Store token
      localStorage.setItem('token', response.data.access_token);

      // Redirect to home
      router.push('/');
      router.refresh();
    } catch (err: any) {
      console.error('Verify code error:', err);

      if (err.response?.data?.detail) {
        setError(`⚠️ ${err.response.data.detail}`);
      } else if (err.message === 'Network Error' || err.code === 'ERR_NETWORK') {
        setError('🔴 Cannot connect to server. Check if Docker containers are running.');
      } else {
        setError('⚠️ Invalid code. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cyber-dark-900 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Animated grid background */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyber-dark-900 via-cyber-dark-800 to-cyber-dark-900">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(#00FFFF 1px, transparent 1px),
              linear-gradient(90deg, #00FFFF 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            animation: 'grid-flow 20s linear infinite'
          }}></div>
        </div>
      </div>

      {/* Glowing orbs */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>

      {/* Form container */}
      <div className="relative w-full max-w-md">
        <div className="bg-cyber-dark-800/80 backdrop-blur-xl border border-primary-500/30 rounded-2xl shadow-glow p-8 animate-fade-in">

          {/* Logo */}
          <div className="text-center mb-8">
            <div className="text-5xl font-black tracking-tighter">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-500">
                ⚡ CODEC
              </span>
            </div>
            <div className="text-xs text-gray-500 uppercase tracking-widest mt-1">Cyberpunk Marketplace</div>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-100 mb-2">
              {step === 'email' ? 'Join the Network' : 'Verify Your Code'}
            </h1>
            <p className="text-gray-400 text-sm">
              {step === 'email'
                ? 'Enter your email to get started'
                : `Code sent to ${email}`}
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Success message */}
          {message && (
            <div className="mb-6 p-4 bg-accent-500/10 border border-accent-500/30 rounded-lg text-accent-500 text-sm">
              {message}
              <div className="mt-2 text-xs text-gray-400">
                💡 For demo: Check Docker logs with <code className="bg-cyber-dark-900 px-1 py-0.5 rounded">docker-compose logs api</code>
              </div>
            </div>
          )}

          {/* Email step */}
          {step === 'email' && (
            <form onSubmit={handleSendCode} className="space-y-6">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  ▹ Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-cyber-dark-800 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-600 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/50 outline-none transition-all"
                  placeholder="trader@codec.network"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-6 bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-cyber-dark-900 font-bold rounded-lg transition-all duration-200 shadow-glow hover:shadow-glow-fuchsia disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '⚡ Sending...' : '⚡ Send Verification Code'}
              </button>
            </form>
          )}

          {/* Code verification step */}
          {step === 'code' && (
            <form onSubmit={handleVerifyCode} className="space-y-6">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  ▹ Verification Code
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full px-4 py-3 bg-cyber-dark-800 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-600 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/50 outline-none transition-all text-center text-2xl tracking-widest font-mono"
                  placeholder="000000"
                  maxLength={6}
                  required
                />
                <p className="text-gray-500 text-xs mt-2">Enter the 6-digit code from the server logs</p>
              </div>

              <button
                type="submit"
                disabled={loading || code.length !== 6}
                className="w-full py-3 px-6 bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-cyber-dark-900 font-bold rounded-lg transition-all duration-200 shadow-glow hover:shadow-glow-fuchsia disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '⚡ Verifying...' : '⚡ Verify & Login'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep('email');
                  setCode('');
                  setError('');
                  setMessage('');
                }}
                className="w-full py-2 px-4 text-gray-400 hover:text-primary-500 transition-colors text-sm"
              >
                ← Use different email
              </button>
            </form>
          )}

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-primary-500 hover:text-primary-400 font-medium transition-colors">
                Sign In →
              </Link>
            </p>
          </div>

          {/* Features */}
          <div className="mt-8 pt-6 border-t border-gray-700">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-accent-500 text-xl mb-1">⚡</div>
                <div className="text-gray-400 text-xs">Instant Access</div>
              </div>
              <div>
                <div className="text-primary-500 text-xl mb-1">🔒</div>
                <div className="text-gray-400 text-xs">Secure</div>
              </div>
              <div>
                <div className="text-secondary-500 text-xl mb-1">🚀</div>
                <div className="text-gray-400 text-xs">No Password</div>
              </div>
            </div>
          </div>
        </div>

        {/* Powered by */}
        <p className="text-center text-gray-600 text-xs mt-6">
          Powered by Cyberpunk Technology
        </p>
      </div>
    </div>
  );
}

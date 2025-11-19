'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      try {
        const userData = localStorage.getItem('user');
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (e) {
        console.error('Error parsing user data');
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    window.location.href = '/';
  };

  return (
    <nav className="bg-cyber-dark-700/80 backdrop-blur-md border-b border-primary-500/20 shadow-glow sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg blur-md opacity-75 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative bg-gradient-to-r from-primary-500 to-secondary-500 p-2 rounded-lg">
                <svg className="w-6 h-6 text-cyber-dark-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
            <span className="text-2xl font-black tracking-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-secondary-500">
                CODEC
              </span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/listings" className="text-gray-300 hover:text-primary-500 font-medium transition-colors relative group">
              <span>Browse</span>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="/categories" className="text-gray-300 hover:text-primary-500 font-medium transition-colors relative group">
              <span>Categories</span>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 group-hover:w-full transition-all duration-300"></span>
            </Link>

            {isLoggedIn ? (
              <>
                <Link href="/listings/create" className="text-gray-300 hover:text-secondary-500 font-medium transition-colors relative group">
                  <span>+ Sell</span>
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-secondary-500 to-accent-500 group-hover:w-full transition-all duration-300"></span>
                </Link>
                <Link href="/dashboard" className="text-gray-300 hover:text-accent-500 font-medium transition-colors relative group">
                  <span>Dashboard</span>
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-accent-500 to-primary-500 group-hover:w-full transition-all duration-300"></span>
                </Link>
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-gray-300 hover:text-primary-500 font-medium transition-colors">
                    <div className="w-9 h-9 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-cyber-dark-900 font-bold border-2 border-primary-500/50 group-hover:border-primary-500 transition-all">
                      {user?.username?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <span className="hidden lg:inline">{user?.username || 'Account'}</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className="absolute right-0 mt-3 w-52 bg-cyber-dark-700/95 backdrop-blur-md border border-primary-500/30 rounded-lg shadow-glow py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <Link href="/dashboard" className="block px-4 py-2 text-gray-300 hover:bg-primary-500/10 hover:text-primary-500 transition-colors">
                      <span className="flex items-center gap-2">
                        <span className="text-primary-500">▹</span> My Dashboard
                      </span>
                    </Link>
                    <Link href="/dashboard/listings" className="block px-4 py-2 text-gray-300 hover:bg-primary-500/10 hover:text-primary-500 transition-colors">
                      <span className="flex items-center gap-2">
                        <span className="text-primary-500">▹</span> My Listings
                      </span>
                    </Link>
                    <Link href="/dashboard/messages" className="block px-4 py-2 text-gray-300 hover:bg-secondary-500/10 hover:text-secondary-500 transition-colors">
                      <span className="flex items-center gap-2">
                        <span className="text-secondary-500">▹</span> Messages
                      </span>
                    </Link>
                    <Link href="/dashboard/favorites" className="block px-4 py-2 text-gray-300 hover:bg-accent-500/10 hover:text-accent-500 transition-colors">
                      <span className="flex items-center gap-2">
                        <span className="text-accent-500">▹</span> Favorites
                      </span>
                    </Link>
                    <hr className="my-2 border-primary-500/20" />
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-red-400 hover:bg-red-500/10 transition-colors">
                      <span className="flex items-center gap-2">
                        <span>⚠</span> Logout
                      </span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="text-gray-300 hover:text-primary-500 font-medium transition-colors">
                  Login
                </Link>
                <Link href="/auth/register" className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg blur opacity-75 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative bg-gradient-to-r from-primary-500 to-secondary-500 text-cyber-dark-900 px-6 py-2 rounded-lg font-bold hover:shadow-glow-lg transition-all duration-300">
                    Sign Up
                  </div>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-cyber-dark-600/50 border border-primary-500/30 hover:border-primary-500 text-primary-500 transition-all"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-2 animate-slide-down border-t border-primary-500/20">
            <Link href="/listings" className="block px-4 py-2 text-gray-300 hover:bg-primary-500/10 hover:text-primary-500 rounded-lg transition-colors">
              Browse
            </Link>
            <Link href="/categories" className="block px-4 py-2 text-gray-300 hover:bg-primary-500/10 hover:text-primary-500 rounded-lg transition-colors">
              Categories
            </Link>
            {isLoggedIn ? (
              <>
                <Link href="/listings/create" className="block px-4 py-2 text-gray-300 hover:bg-secondary-500/10 hover:text-secondary-500 rounded-lg transition-colors">
                  + Sell Item
                </Link>
                <Link href="/dashboard" className="block px-4 py-2 text-gray-300 hover:bg-accent-500/10 hover:text-accent-500 rounded-lg transition-colors">
                  Dashboard
                </Link>
                <Link href="/dashboard/messages" className="block px-4 py-2 text-gray-300 hover:bg-primary-500/10 hover:text-primary-500 rounded-lg transition-colors">
                  Messages
                </Link>
                <Link href="/dashboard/favorites" className="block px-4 py-2 text-gray-300 hover:bg-primary-500/10 hover:text-primary-500 rounded-lg transition-colors">
                  Favorites
                </Link>
                <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="block px-4 py-2 text-gray-300 hover:bg-primary-500/10 hover:text-primary-500 rounded-lg transition-colors">
                  Login
                </Link>
                <Link href="/auth/register" className="block px-4 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-cyber-dark-900 rounded-lg font-bold hover:shadow-glow transition-all">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

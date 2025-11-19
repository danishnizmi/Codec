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
      // You could fetch user data here
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
    <nav className="bg-white shadow-soft sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-2 rounded-lg group-hover:shadow-glow transition-all">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              Codec
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/listings" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
              Browse
            </Link>
            <Link href="/categories" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
              Categories
            </Link>

            {isLoggedIn ? (
              <>
                <Link href="/listings/create" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                  Sell Item
                </Link>
                <Link href="/dashboard" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                  Dashboard
                </Link>
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 font-medium transition-colors">
                    <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {user?.username?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <span className="hidden lg:inline">{user?.username || 'Account'}</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-soft py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <Link href="/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors">
                      My Dashboard
                    </Link>
                    <Link href="/dashboard/listings" className="block px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors">
                      My Listings
                    </Link>
                    <Link href="/dashboard/messages" className="block px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors">
                      Messages
                    </Link>
                    <Link href="/dashboard/favorites" className="block px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors">
                      Favorites
                    </Link>
                    <hr className="my-2" />
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors">
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                  Login
                </Link>
                <Link href="/auth/register" className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-2 rounded-lg hover:shadow-glow transition-all duration-300 font-medium">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
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
          <div className="md:hidden py-4 space-y-2 animate-slide-down">
            <Link href="/listings" className="block px-4 py-2 text-gray-700 hover:bg-primary-50 rounded-lg transition-colors">
              Browse
            </Link>
            <Link href="/categories" className="block px-4 py-2 text-gray-700 hover:bg-primary-50 rounded-lg transition-colors">
              Categories
            </Link>
            {isLoggedIn ? (
              <>
                <Link href="/listings/create" className="block px-4 py-2 text-gray-700 hover:bg-primary-50 rounded-lg transition-colors">
                  Sell Item
                </Link>
                <Link href="/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-primary-50 rounded-lg transition-colors">
                  Dashboard
                </Link>
                <Link href="/dashboard/messages" className="block px-4 py-2 text-gray-700 hover:bg-primary-50 rounded-lg transition-colors">
                  Messages
                </Link>
                <Link href="/dashboard/favorites" className="block px-4 py-2 text-gray-700 hover:bg-primary-50 rounded-lg transition-colors">
                  Favorites
                </Link>
                <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="block px-4 py-2 text-gray-700 hover:bg-primary-50 rounded-lg transition-colors">
                  Login
                </Link>
                <Link href="/auth/register" className="block px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg hover:shadow-glow transition-all">
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

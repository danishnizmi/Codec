'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { listingsAPI } from '@/lib/api';

const categories = [
  { name: 'Electronics', icon: '💻', color: 'from-primary-500 to-primary-600', glow: 'group-hover:shadow-glow-cyan' },
  { name: 'Vehicles', icon: '🚗', color: 'from-secondary-500 to-secondary-600', glow: 'group-hover:shadow-glow-fuchsia' },
  { name: 'Real Estate', icon: '🏠', color: 'from-accent-500 to-accent-600', glow: 'group-hover:shadow-glow-green' },
  { name: 'Fashion', icon: '👕', color: 'from-secondary-400 to-secondary-500', glow: 'group-hover:shadow-glow-fuchsia' },
  { name: 'Home & Garden', icon: '🌺', color: 'from-primary-400 to-primary-500', glow: 'group-hover:shadow-glow-cyan' },
  { name: 'Sports', icon: '⚽', color: 'from-accent-400 to-accent-500', glow: 'group-hover:shadow-glow-green' },
  { name: 'Pets', icon: '🐾', color: 'from-primary-300 to-secondary-400', glow: 'group-hover:shadow-glow' },
  { name: 'Other', icon: '🛍️', color: 'from-gray-500 to-gray-600', glow: 'group-hover:shadow-soft' },
];

export default function Home() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadListings();
  }, []);

  const loadListings = async () => {
    try {
      const data = await listingsAPI.getAll({ limit: 8 });
      setListings(data);
    } catch (error) {
      console.error('Failed to load listings:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-cyber-dark-900">
      {/* CYBERPUNK HERO SECTION */}
      <section className="relative overflow-hidden border-b border-primary-500/20">
        {/* Animated Grid Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-cyber-dark-800 to-cyber-dark-900"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 255, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}></div>

        {/* Neon Glow Effects */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-pulse-glow"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary-500/20 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }}></div>

        <div className="container mx-auto px-4 py-24 md:py-32 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            {/* Glitch Effect Title */}
            <div className="mb-8">
              <div className="inline-block relative">
                <h1 className="text-6xl md:text-8xl font-black mb-6 animate-fade-in leading-tight tracking-tighter">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-500 animate-pulse-glow">
                    TRADE
                  </span>
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary-500 via-accent-500 to-secondary-500">
                    THE FUTURE
                  </span>
                </h1>
                <div className="absolute -top-2 -left-2 text-primary-500/20 text-6xl md:text-8xl font-black -z-10">
                  TRADE THE FUTURE
                </div>
              </div>
            </div>

            <p className="text-xl md:text-2xl mb-12 text-gray-400 animate-slide-up max-w-3xl mx-auto leading-relaxed">
              Enter the <span className="text-primary-500 font-bold">cyberpunk marketplace</span>.
              Buy, sell, trade in the <span className="text-secondary-500 font-bold">digital realm</span>.
              <br />
              <span className="text-accent-500">No limits. No boundaries.</span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-scale-in">
              <Link href="/listings" className="group relative w-full sm:w-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg blur-lg opacity-75 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative bg-gradient-to-r from-primary-500 to-primary-600 text-cyber-dark-900 px-10 py-4 rounded-lg font-black text-lg flex items-center gap-3 transform group-hover:scale-105 transition-all">
                  <span className="text-2xl">⚡</span>
                  BROWSE LISTINGS
                </div>
              </Link>
              <Link href="/listings/create" className="group relative w-full sm:w-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-secondary-500 to-accent-500 rounded-lg blur-lg opacity-75 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative bg-cyber-dark-700 border-2 border-secondary-500 text-secondary-500 px-10 py-4 rounded-lg font-black text-lg flex items-center gap-3 hover:bg-secondary-500 hover:text-cyber-dark-900 transform group-hover:scale-105 transition-all">
                  <span className="text-2xl">+</span>
                  START SELLING
                </div>
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-secondary-500">1K+</div>
                <div className="text-sm text-gray-500 mt-1">Active Listings</div>
              </div>
              <div className="text-center border-x border-primary-500/20">
                <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-secondary-500 to-accent-500">500+</div>
                <div className="text-sm text-gray-500 mt-1">Traders</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-accent-500 to-primary-500">24/7</div>
                <div className="text-sm text-gray-500 mt-1">Marketplace</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Border Glow */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-500 to-transparent"></div>
      </section>

      {/* CATEGORIES SECTION */}
      <section className="py-20 bg-cyber-dark-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-secondary-500 mb-4">
              BROWSE CATEGORIES
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-primary-500 to-secondary-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={`/listings?category=${category.name.toUpperCase().replace(/ & /g, '_').replace(/ /g, '_')}`}
                className="group"
              >
                <div className={`bg-cyber-dark-700/50 backdrop-blur-sm border border-primary-500/20 rounded-xl p-4 hover:border-primary-500 ${category.glow} transition-all duration-300 transform hover:scale-105 text-center`}>
                  <div className={`w-14 h-14 mx-auto mb-3 rounded-full bg-gradient-to-r ${category.color} flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300 border-2 border-transparent group-hover:border-white/20`}>
                    {category.icon}
                  </div>
                  <h3 className="font-bold text-xs text-gray-300 group-hover:text-primary-500 transition-colors uppercase tracking-wider">
                    {category.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED LISTINGS */}
      <section className="py-20 bg-cyber-dark-800">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-secondary-500">
                FEATURED ITEMS
              </h2>
              <div className="h-1 w-32 bg-gradient-to-r from-primary-500 to-secondary-500 mt-2 rounded-full"></div>
            </div>
            <Link href="/listings" className="text-primary-500 font-bold hover:text-primary-400 flex items-center gap-2 group">
              View All
              <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-cyber-dark-700/50 border border-primary-500/20 rounded-xl p-4 animate-pulse">
                  <div className="aspect-square bg-cyber-dark-600 rounded-lg mb-4"></div>
                  <div className="h-4 bg-cyber-dark-600 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-cyber-dark-600 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : listings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {listings.map((listing) => (
                <Link
                  key={listing.id}
                  href={`/listings/${listing.id}`}
                  className="group bg-cyber-dark-700/50 backdrop-blur-sm border border-primary-500/20 rounded-xl overflow-hidden hover:border-primary-500 hover:shadow-glow transition-all duration-300 transform hover:scale-105"
                >
                  <div className="aspect-square bg-cyber-dark-600 relative overflow-hidden">
                    {listing.images && listing.images.length > 0 ? (
                      <img
                        src={listing.images[0]}
                        alt={listing.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-600 text-5xl">
                        📦
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      <div className="bg-cyber-dark-900/90 backdrop-blur-sm border border-primary-500/50 px-3 py-1 rounded-lg text-sm font-bold text-primary-500">
                        ${parseFloat(listing.price).toFixed(2)}
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2 text-gray-200 truncate group-hover:text-primary-500 transition-colors">
                      {listing.title}
                    </h3>
                    <p className="text-gray-500 text-sm line-clamp-2 mb-3">
                      {listing.description}
                    </p>
                    <div className="flex items-center text-xs text-gray-600">
                      <svg className="w-4 h-4 mr-1 text-secondary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      {listing.location || 'Digital Realm'}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-cyber-dark-700/30 border border-primary-500/20 rounded-xl">
              <div className="text-6xl mb-4">📭</div>
              <p className="text-xl text-gray-400 mb-6">No listings in the digital void yet</p>
              <Link href="/listings/create" className="inline-block bg-gradient-to-r from-primary-500 to-secondary-500 text-cyber-dark-900 px-8 py-3 rounded-lg font-bold hover:shadow-glow transition-all">
                Be the First Trader
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-24 bg-cyber-dark-900 border-t border-primary-500/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 via-secondary-500/5 to-accent-500/5"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-black mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-secondary-500">
              READY TO ENTER
            </span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary-500 to-accent-500">
              THE MARKETPLACE?
            </span>
          </h2>
          <p className="text-xl mb-12 text-gray-400 max-w-2xl mx-auto">
            Join thousands of traders in the cyberpunk marketplace. Free forever. No limits.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/auth/register" className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg blur-lg opacity-75 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative bg-gradient-to-r from-primary-500 to-secondary-500 text-cyber-dark-900 px-12 py-4 rounded-lg font-black text-lg transform group-hover:scale-105 transition-all">
                SIGN UP FREE
              </div>
            </Link>
            <Link href="/listings" className="group relative">
              <div className="relative bg-cyber-dark-700 border-2 border-primary-500 text-primary-500 px-12 py-4 rounded-lg font-black text-lg hover:bg-primary-500 hover:text-cyber-dark-900 transform group-hover:scale-105 transition-all">
                EXPLORE NOW
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

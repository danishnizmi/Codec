/**
 * CODEX - Premium Cyberpunk Marketplace
 * Year 2077 - High-Tech, Low-Life
 */

'use client';

import React, { useState, useEffect } from 'react';
import CyberNavbar from '../components/CyberNavbar';
import ListingCard from '../components/ListingCard';
import CreateListingModal from '../components/CreateListingModal';
import { Listing, Category, MOCK_LISTINGS } from './types';
import { useScrollRevealBatch } from './hooks/useScrollReveal';

export default function HomePage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<Category | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Apply scroll reveal animations
  useScrollRevealBatch('.reveal');

  // Fetch listings on mount
  useEffect(() => {
    fetchListings();
  }, [selectedCategory, searchQuery]);

  const fetchListings = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== 'ALL') {
        params.append('category', selectedCategory);
      }
      if (searchQuery) {
        params.append('search', searchQuery);
      }
      params.append('limit', '50');

      const response = await fetch(`/api/listings?${params.toString()}`);

      if (response.ok) {
        const data = await response.json();
        setListings(data);
      } else {
        console.warn('API not available, using mock data');
        setListings(MOCK_LISTINGS);
      }
    } catch (error) {
      console.error('Error fetching listings:', error);
      setListings(MOCK_LISTINGS);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateListing = () => {
    setIsCreateModalOpen(true);
  };

  const handleListingCreated = () => {
    setIsCreateModalOpen(false);
    fetchListings();
  };

  const categories = ['ALL', ...Object.values(Category)];

  return (
    <div className="min-h-screen bg-cyber-void">
      {/* Premium Navbar */}
      <CyberNavbar onCreateListing={handleCreateListing} />

      {/* Spacer for fixed navbar */}
      <div className="h-20"></div>

      {/* Cinematic Hero Section with 3D Grid */}
      <section className="relative grid-floor py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Overlay gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyber-void/50 to-cyber-void"></div>

        <div className="container mx-auto relative z-10">
          <div className="max-w-5xl mx-auto text-center space-y-8">
            {/* Main Headline */}
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-heading font-black tracking-tighter reveal" data-delay="0">
              <span className="block text-cyber-cyan mb-2">BUY.</span>
              <span className="block text-cyber-pink mb-2">SELL.</span>
              <span className="block text-white">SURVIVE.</span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl sm:text-2xl text-gray-400 font-cyber max-w-3xl mx-auto leading-relaxed reveal" data-delay="100">
              Welcome to CODEX, the underground marketplace of 2077. Trade anything.
              <br />
              <span className="text-cyber-green">No accounts. No traces. Pure business.</span>
            </p>

            {/* Terminal Search Bar */}
            <div className="max-w-3xl mx-auto reveal" data-delay="200">
              <div className="relative">
                <input
                  type="text"
                  placeholder=">> SEARCH THE MARKETPLACE..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="terminal-input w-full pl-16"
                />
                <svg
                  className="absolute left-6 top-1/2 transform -translate-y-1/2 w-6 h-6 text-cyber-cyan"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Stats HUD */}
            <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto reveal" data-delay="300">
              <div className="text-center">
                <div className="text-4xl font-heading font-bold text-cyber-cyan mb-2">
                  {listings.length}+
                </div>
                <div className="text-xs text-gray-500 font-cyber uppercase tracking-wider">
                  Active Listings
                </div>
              </div>
              <div className="text-center border-x border-cyber-cyan/20">
                <div className="text-4xl font-heading font-bold text-cyber-pink mb-2">
                  24/7
                </div>
                <div className="text-xs text-gray-500 font-cyber uppercase tracking-wider">
                  Always Online
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-heading font-bold text-cyber-green mb-2">
                  100%
                </div>
                <div className="text-xs text-gray-500 font-cyber uppercase tracking-wider">
                  Anonymous
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-cyber-dark/30">
        <div className="container mx-auto">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category, index) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category as any)}
                className={`
                  category-badge px-5 py-2.5 font-cyber text-xs uppercase
                  reveal
                  ${selectedCategory === category
                    ? 'bg-cyber-cyan text-cyber-void border-cyber-cyan shadow-cyber-cyan'
                    : 'bg-cyber-dark/60 text-gray-400 border-gray-600 hover:border-cyber-cyan hover:text-cyber-cyan'
                  }
                  transition-all duration-300
                `}
                data-delay={index * 50}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Listings Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          {/* Section Title */}
          <div className="text-center mb-12 reveal">
            <h2 className="text-4xl font-heading font-bold text-white mb-4">
              ACTIVE <span className="text-cyber-cyan">LISTINGS</span>
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-cyber-cyan to-cyber-pink mx-auto"></div>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32">
              <div className="loading-spinner mb-4"></div>
              <p className="text-cyber-cyan font-cyber text-sm uppercase tracking-wider">
                Loading marketplace...
              </p>
            </div>
          ) : listings.length === 0 ? (
            <div className="text-center py-32 reveal">
              <svg className="w-24 h-24 mx-auto mb-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="text-2xl text-gray-500 font-heading mb-2">NO LISTINGS FOUND</p>
              <p className="text-gray-600 font-cyber">Try a different search or category</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {listings.map((listing, index) => (
                <div
                  key={listing.id}
                  className="reveal"
                  data-delay={index * 50}
                >
                  <ListingCard listing={listing} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Create Listing Modal */}
      {isCreateModalOpen && (
        <CreateListingModal
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={handleListingCreated}
        />
      )}
    </div>
  );
}

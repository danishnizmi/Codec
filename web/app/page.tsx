/**
 * CODEX - Premium Cyberpunk Marketplace
 * Year 2077 - High-Tech, Low-Life
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, Clock, Shield, ChevronRight, LayoutGrid } from 'lucide-react';
import CyberNavbar from '../components/CyberNavbar';
import ListingCard from '../components/ListingCard';
import CreateListingModal from '../components/CreateListingModal';
import Footer from '../components/Footer';
import { Listing, Category, MOCK_LISTINGS } from './types';
import { useScrollRevealBatch } from './hooks/useScrollReveal';
import { getCategoryHeroImage } from './constants';

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
                <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 w-5 h-5 text-cyber-cyan" />
                <input
                  type="text"
                  placeholder=">> SEARCH THE MARKETPLACE..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="terminal-input w-full pl-16"
                />
              </div>
            </div>

            {/* Stats HUD */}
            <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto pt-4 reveal" data-delay="300">
              <div className="text-center border border-cyber-cyan/20 clip-corner-sm p-4 bg-cyber-dark/40">
                <div className="text-3xl font-heading font-bold text-cyber-cyan mb-1">
                  {listings.length}+
                </div>
                <div className="text-[10px] text-gray-500 font-cyber uppercase tracking-wider">
                  Active Listings
                </div>
              </div>
              <div className="text-center border border-cyber-pink/20 clip-corner-sm p-4 bg-cyber-dark/40">
                <div className="flex items-center justify-center gap-1 text-3xl font-heading font-bold text-cyber-pink mb-1">
                  <Clock className="w-6 h-6" />
                  24/7
                </div>
                <div className="text-[10px] text-gray-500 font-cyber uppercase tracking-wider">
                  Always Online
                </div>
              </div>
              <div className="text-center border border-cyber-green/20 clip-corner-sm p-4 bg-cyber-dark/40">
                <div className="flex items-center justify-center gap-1 text-3xl font-heading font-bold text-cyber-green mb-1">
                  <Shield className="w-6 h-6" />
                  100%
                </div>
                <div className="text-[10px] text-gray-500 font-cyber uppercase tracking-wider">
                  Anonymous
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter - Minimalistic Grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-cyber-dark/30 border-y border-cyber-cyan/10">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-heading font-bold text-white reveal flex items-center gap-2">
              <LayoutGrid className="w-5 h-5 text-cyber-cyan" />
              BROWSE CATEGORIES
            </h2>
            <span className="text-xs font-cyber text-gray-600">
              {listings.length} RESULTS
            </span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-9 gap-3">
            {categories.map((category, index) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category as any)}
                className={`
                  relative h-24 overflow-hidden group reveal clip-corner-sm
                  border-2 transition-all duration-300
                  ${selectedCategory === category
                    ? 'border-cyber-cyan shadow-cyber-cyan'
                    : 'border-cyber-cyan/20 hover:border-cyber-cyan/60'
                  }
                `}
                data-delay={index * 30}
              >
                {/* Background Image */}
                {category !== 'ALL' && (
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{
                      backgroundImage: `url(${getCategoryHeroImage(category)})`,
                    }}
                  />
                )}

                {/* Dark Overlay */}
                <div className={`
                  absolute inset-0 transition-all duration-300
                  ${selectedCategory === category
                    ? 'bg-cyber-cyan/20'
                    : category === 'ALL'
                      ? 'bg-cyber-dark/90'
                      : 'bg-black/70 group-hover:bg-black/50'
                  }
                `} />

                {/* Category Name */}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                  {selectedCategory === category && (
                    <ChevronRight className="w-4 h-4 text-cyber-cyan animate-pulse" />
                  )}
                  <span className={`
                    font-heading font-bold text-[10px] uppercase tracking-wider text-center px-2
                    ${selectedCategory === category
                      ? 'text-white text-shadow-glow'
                      : 'text-gray-300 group-hover:text-cyber-cyan'
                    }
                    transition-colors duration-300
                  `}>
                    {category}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Listings Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-heading font-bold text-white reveal flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-cyber-pink" />
              ACTIVE LISTINGS
            </h2>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32">
              <div className="loading-spinner mb-4"></div>
              <p className="text-cyber-cyan font-cyber text-sm uppercase tracking-wider">
                Loading marketplace...
              </p>
            </div>
          ) : listings.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-6 bg-cyber-dark/60 border-2 border-cyber-cyan/30 clip-corner-md flex items-center justify-center">
                <Search className="w-10 h-10 text-cyber-cyan/50" />
              </div>
              <h3 className="text-xl font-heading font-bold text-gray-500 mb-2">
                NO LISTINGS FOUND
              </h3>
              <p className="text-sm text-gray-600 font-cyber">
                Try a different search or category
              </p>
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

      {/* Footer */}
      <Footer />

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

/**
 * CyberBazaar - Main Marketplace Page
 * High-Tech, Low-Life
 */

'use client';

import React, { useState, useEffect } from 'react';
import CyberNavbar from '../components/CyberNavbar';
import ListingCard from '../components/ListingCard';
import CreateListingModal from '../components/CreateListingModal';
import { Listing, Category, MOCK_LISTINGS } from './types';

export default function HomePage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<Category | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch listings on mount
  useEffect(() => {
    fetchListings();
  }, [selectedCategory, searchQuery]);

  const fetchListings = async () => {
    setIsLoading(true);
    try {
      // Build query params
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
        // Fallback to mock data in development
        console.warn('API not available, using mock data');
        setListings(MOCK_LISTINGS);
      }
    } catch (error) {
      console.error('Error fetching listings:', error);
      // Fallback to mock data
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
    fetchListings(); // Refresh listings
  };

  const categories = ['ALL', ...Object.values(Category)];

  return (
    <div className="min-h-screen bg-cyber-void">
      {/* Navbar */}
      <CyberNavbar onCreateListing={handleCreateListing} />

      {/* Hero Section */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="container mx-auto">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-heading font-bold">
              <span className="text-neon-cyan">HIGH-TECH</span>{' '}
              <span className="text-neon-pink">LOW-LIFE</span>
            </h2>
            <p className="text-xl text-gray-400 font-cyber max-w-3xl mx-auto">
              Welcome to the streets of 2077. Buy, sell, trade anything. No accounts. No traces. Just business.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="SEARCH THE BAZAAR..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="cyber-input w-full pl-12 pr-4 py-4 text-lg"
              />
              <svg
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-cyber-cyan"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Category Filter */}
          <div className="max-w-6xl mx-auto mb-12">
            <div className="flex flex-wrap gap-3 justify-center">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category as any)}
                  className={`
                    category-badge px-4 py-2 font-cyber text-xs uppercase
                    ${selectedCategory === category
                      ? 'bg-cyber-cyan text-cyber-void border-cyber-cyan'
                      : 'bg-cyber-dark/60 text-gray-400 border-gray-600 hover:border-cyber-cyan hover:text-cyber-cyan'
                    }
                    transition-all duration-300
                  `}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Listings Grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="loading-spinner"></div>
            </div>
          ) : listings.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-2xl text-gray-500 font-heading">NO LISTINGS FOUND</p>
              <p className="text-gray-600 font-cyber mt-4">Try a different search or category</p>
            </div>
          ) : (
            <div className="cyber-grid">
              {listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-cyber-cyan/20">
        <div className="container mx-auto text-center">
          <p className="text-gray-500 font-cyber text-sm">
            CYBERBAZAAR © 2077 | NO WARRANTIES | SOLD AS-IS
          </p>
          <p className="text-gray-600 font-cyber text-xs mt-2">
            HIGH-TECH, LOW-LIFE. WELCOME TO THE FUTURE.
          </p>
        </div>
      </footer>

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

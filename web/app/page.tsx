'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { listingsAPI } from '@/lib/api';

const categories = [
  { name: 'Electronics', icon: '💻', color: 'from-blue-500 to-blue-600' },
  { name: 'Vehicles', icon: '🚗', color: 'from-red-500 to-red-600' },
  { name: 'Real Estate', icon: '🏠', color: 'from-green-500 to-green-600' },
  { name: 'Fashion', icon: '👕', color: 'from-purple-500 to-purple-600' },
  { name: 'Home & Garden', icon: '🌺', color: 'from-pink-500 to-pink-600' },
  { name: 'Sports', icon: '⚽', color: 'from-orange-500 to-orange-600' },
  { name: 'Pets', icon: '🐾', color: 'from-yellow-500 to-yellow-600' },
  { name: 'Other', icon: '🛍️', color: 'from-gray-500 to-gray-600' },
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
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        }}></div>

        <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 animate-fade-in leading-tight">
              Buy & Sell <br />
              <span className="bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
                Anything Locally
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-blue-100 animate-slide-up max-w-2xl mx-auto">
              Discover amazing deals in your area. Connect with buyers and sellers near you!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-scale-in">
              <Link
                href="/listings"
                className="w-full sm:w-auto bg-white text-primary-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 hover:shadow-glow transition-all duration-300 transform hover:scale-105"
              >
                🔍 Browse Listings
              </Link>
              <Link
                href="/listings/create"
                className="w-full sm:w-auto bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-glow transition-all duration-300 transform hover:scale-105"
              >
                📝 Sell Something
              </Link>
            </div>
          </div>
        </div>

        {/* Wave Separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#F9FAFB"/>
          </svg>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Browse by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={`/listings?category=${category.name.toUpperCase().replace(/ & /g, '_').replace(/ /g, '_')}`}
                className="group"
              >
                <div className="bg-white rounded-2xl p-6 shadow-soft hover:shadow-glow transition-all duration-300 transform hover:scale-105 text-center">
                  <div className={`w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-r ${category.color} flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300`}>
                    {category.icon}
                  </div>
                  <h3 className="font-semibold text-sm text-gray-800 group-hover:text-primary-600 transition-colors">
                    {category.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900">
              Featured Listings
            </h2>
            <Link href="/listings" className="text-primary-600 font-semibold hover:text-primary-700 flex items-center gap-2">
              View All
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-4 shadow-soft animate-pulse">
                  <div className="aspect-square bg-gray-200 rounded-xl mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : listings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {listings.map((listing) => (
                <Link
                  key={listing.id}
                  href={`/listings/${listing.id}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-soft hover:shadow-glow transition-all duration-300 transform hover:scale-105"
                >
                  <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                    {listing.images && listing.images.length > 0 ? (
                      <img
                        src={listing.images[0]}
                        alt={listing.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl">
                        📦
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-primary-600">
                        ${listing.price}
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2 text-gray-900 truncate group-hover:text-primary-600 transition-colors">
                      {listing.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                      {listing.description}
                    </p>
                    <div className="flex items-center text-xs text-gray-500">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {listing.location || 'Local'}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📭</div>
              <p className="text-xl text-gray-500">No listings yet. Be the first to post!</p>
              <Link href="/listings/create" className="inline-block mt-6 bg-primary-500 text-white px-8 py-3 rounded-xl font-semibold hover:bg-primary-600 transition-colors">
                Create First Listing
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Start Selling?
          </h2>
          <p className="text-xl mb-10 text-blue-100 max-w-2xl mx-auto">
            Join thousands of sellers making money from items they no longer need. It's free and takes less than a minute!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/register"
              className="bg-white text-primary-600 px-10 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 hover:shadow-glow transition-all duration-300 transform hover:scale-105"
            >
              Sign Up Free
            </Link>
            <Link
              href="/listings"
              className="bg-transparent border-2 border-white text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-primary-600 transition-all duration-300 transform hover:scale-105"
            >
              Explore Listings
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

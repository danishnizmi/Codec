'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { listingsAPI } from '@/lib/api';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [myListings, setMyListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    loadMyListings();
  }, [router]);

  const loadMyListings = async () => {
    try {
      const data = await listingsAPI.getMyListings();
      setMyListings(data.slice(0, 4)); // Show only first 4
    } catch (error) {
      console.error('Failed to load listings:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8 animate-slide-up">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.username || 'User'}! 👋
          </h1>
          <p className="text-gray-600">Manage your listings and account</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl p-6 text-white shadow-soft hover:shadow-glow transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-white/20 p-3 rounded-xl">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold mb-1">{myListings.length}</p>
            <p className="text-primary-100">Active Listings</p>
          </div>

          <div className="bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-2xl p-6 text-white shadow-soft hover:shadow-glow transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-white/20 p-3 rounded-xl">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold mb-1">0</p>
            <p className="text-secondary-100">Messages</p>
          </div>

          <div className="bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl p-6 text-white shadow-soft hover:shadow-glow transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-white/20 p-3 rounded-xl">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold mb-1">0</p>
            <p className="text-accent-100">Favorites</p>
          </div>

          <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl p-6 text-white shadow-soft hover:shadow-glow transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-white/20 p-3 rounded-xl">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold mb-1">0</p>
            <p className="text-yellow-100">Total Views</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link
            href="/listings/create"
            className="bg-white rounded-2xl p-6 shadow-soft hover:shadow-glow transition-all group"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-4 rounded-xl group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Create Listing</h3>
                <p className="text-sm text-gray-600">Sell an item</p>
              </div>
            </div>
          </Link>

          <Link
            href="/dashboard/listings"
            className="bg-white rounded-2xl p-6 shadow-soft hover:shadow-glow transition-all group"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-secondary-500 to-secondary-600 p-4 rounded-xl group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-900">My Listings</h3>
                <p className="text-sm text-gray-600">Manage items</p>
              </div>
            </div>
          </Link>

          <Link
            href="/dashboard/messages"
            className="bg-white rounded-2xl p-6 shadow-soft hover:shadow-glow transition-all group"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-accent-500 to-accent-600 p-4 rounded-xl group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Messages</h3>
                <p className="text-sm text-gray-600">Chat with buyers</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Recent Listings */}
        <div className="bg-white rounded-2xl shadow-soft p-6 md:p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Your Recent Listings</h2>
            <Link href="/dashboard/listings" className="text-primary-600 font-semibold hover:text-primary-700 flex items-center gap-2">
              View All
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : myListings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {myListings.map((listing) => (
                <div key={listing.id} className="group">
                  <div className="aspect-square bg-gray-200 rounded-xl mb-3 overflow-hidden">
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
                  </div>
                  <h3 className="font-bold text-gray-900 truncate mb-1">{listing.title}</h3>
                  <p className="text-primary-600 font-bold">${listing.price}</p>
                  <p className="text-xs text-gray-500">{listing.status}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📭</div>
              <p className="text-xl text-gray-500 mb-4">No listings yet</p>
              <Link
                href="/listings/create"
                className="inline-block bg-gradient-to-r from-primary-500 to-primary-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-glow transition-all"
              >
                Create Your First Listing
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

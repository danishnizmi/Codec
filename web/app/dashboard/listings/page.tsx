'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { listingsAPI } from '@/lib/api';

export default function MyListingsPage() {
  const router = useRouter();
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    loadListings();
  }, [router]);

  const loadListings = async () => {
    try {
      const data = await listingsAPI.getMyListings();
      setListings(data);
    } catch (error) {
      console.error('Failed to load listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this listing?')) return;

    try {
      await listingsAPI.delete(id);
      setListings(listings.filter(l => l.id !== id));
    } catch (error) {
      console.error('Failed to delete listing:', error);
      alert('Failed to delete listing');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">My Listings</h1>
            <p className="text-gray-600">Manage your active listings</p>
          </div>
          <Link
            href="/listings/create"
            className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-glow transition-all flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            New Listing
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : listings.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {listings.map((listing) => (
              <div key={listing.id} className="bg-white rounded-2xl shadow-soft p-6 hover:shadow-glow transition-all">
                <div className="flex gap-6">
                  {/* Image */}
                  <div className="w-32 h-32 flex-shrink-0">
                    {listing.images && listing.images.length > 0 ? (
                      <img
                        src={listing.images[0]}
                        alt={listing.title}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 rounded-xl flex items-center justify-center text-4xl">
                        📦
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{listing.title}</h3>
                        <p className="text-gray-600 line-clamp-2">{listing.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary-600">${listing.price}</p>
                        <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${
                          listing.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                          listing.status === 'SOLD' ? 'bg-gray-100 text-gray-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {listing.status}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 text-sm text-gray-500 mb-4">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        {listing.category}
                      </span>
                      {listing.location && (
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          </svg>
                          {listing.location}
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <Link
                        href={`/listings/${listing.id}`}
                        className="bg-primary-50 text-primary-600 px-4 py-2 rounded-lg font-medium hover:bg-primary-100 transition-colors"
                      >
                        View
                      </Link>
                      <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(listing.id)}
                        className="bg-red-50 text-red-600 px-4 py-2 rounded-lg font-medium hover:bg-red-100 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-soft p-12 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No listings yet</h3>
            <p className="text-gray-600 mb-6">Create your first listing to start selling</p>
            <Link
              href="/listings/create"
              className="inline-block bg-gradient-to-r from-primary-500 to-primary-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-glow transition-all"
            >
              Create Listing
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

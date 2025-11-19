'use client';

import { useEffect, useState } from 'react';
import { listingsAPI } from '@/lib/api';

export default function Home() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadListings();
  }, []);

  const loadListings = async () => {
    try {
      const data = await listingsAPI.getAll({ limit: 12 });
      setListings(data);
    } catch (error) {
      console.error('Failed to load listings:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center py-12 mb-12">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Welcome to Marketplace
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Buy and sell items locally with ease
        </p>
        <div className="flex gap-4 justify-center">
          <a href="/listings" className="btn-primary">
            Browse Listings
          </a>
          <a href="/auth/register" className="btn-secondary">
            Get Started
          </a>
        </div>
      </section>

      {/* Featured Listings */}
      <section>
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          Recent Listings
        </h2>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {listings.map((listing) => (
              <a
                key={listing.id}
                href={`/listings/${listing.id}`}
                className="card"
              >
                <div className="aspect-video bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                  {listing.images && listing.images.length > 0 ? (
                    <img
                      src={listing.images[0]}
                      alt={listing.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <span className="text-gray-400">No image</span>
                  )}
                </div>
                <h3 className="font-semibold text-lg mb-2 truncate">
                  {listing.title}
                </h3>
                <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                  {listing.description}
                </p>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-primary-600 font-bold text-xl">
                    ${listing.price}
                  </span>
                  <span className="text-gray-500 text-sm">
                    {listing.location}
                  </span>
                </div>
              </a>
            ))}
          </div>
        )}

        {!loading && listings.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No listings available yet.</p>
          </div>
        )}
      </section>
    </div>
  );
}

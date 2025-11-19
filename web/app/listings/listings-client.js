'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';

export default function ListingsClient({
  initialListings,
  categories,
  initialSearch,
  initialCategory,
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);

  const handleFilterChange = () => {
    const params = new URLSearchParams(searchParams);

    if (search) {
      params.set('search', search);
    } else {
      params.delete('search');
    }

    if (category) {
      params.set('category', category);
    } else {
      params.delete('category');
    }

    startTransition(() => {
      router.push(`/listings?${params.toString()}`);
    });
  };

  return (
    <>
      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-soft p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              🔍 Search
            </label>
            <input
              type="text"
              placeholder="Search listings..."
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleFilterChange()}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              📁 Category
            </label>
            <select
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none transition-all bg-white"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleFilterChange}
              disabled={isPending}
              className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white font-bold py-3 rounded-xl hover:shadow-glow transition-all disabled:opacity-50"
            >
              {isPending ? '⏳ Searching...' : '✨ Apply Filters'}
            </button>
          </div>
        </div>
      </div>

      {/* Listings Grid */}
      {isPending ? (
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Loading amazing deals...</p>
        </div>
      ) : (
        <>
          {initialListings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {initialListings.map((listing) => (
                <Link
                  key={listing.id}
                  href={`/listings/${listing.id}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-soft hover:shadow-glow transition-all duration-300 transform hover:scale-105"
                >
                  {/* Image */}
                  <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                    {listing.images && listing.images.length > 0 ? (
                      <img
                        src={listing.images[0]}
                        alt={listing.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl">
                        📦
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-primary-600">
                        ${parseFloat(listing.price).toFixed(2)}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2 text-gray-900 truncate group-hover:text-primary-600 transition-colors">
                      {listing.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                      {listing.description}
                    </p>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="bg-primary-50 text-primary-600 px-2 py-1 rounded-lg font-medium">
                        {listing.category.replace(/_/g, ' ')}
                      </span>
                      {listing.location && (
                        <span className="flex items-center">
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {listing.location}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-soft p-20 text-center">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No listings found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your search filters or browse all categories</p>
              <button
                onClick={() => {
                  setSearch('');
                  setCategory('');
                  router.push('/listings');
                }}
                className="inline-block bg-gradient-to-r from-primary-500 to-primary-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-glow transition-all"
              >
                Clear Filters
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
}

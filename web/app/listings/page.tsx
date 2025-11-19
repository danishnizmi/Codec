'use client';

import { useEffect, useState } from 'react';
import { listingsAPI } from '@/lib/api';

export default function ListingsPage() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    loadListings();
  }, [search, category]);

  const loadListings = async () => {
    try {
      setLoading(true);
      const params: any = { limit: 50 };
      if (search) params.search = search;
      if (category) params.category = category;

      const data = await listingsAPI.getAll(params);
      setListings(data);
    } catch (error) {
      console.error('Failed to load listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    'ELECTRONICS',
    'VEHICLES',
    'REAL_ESTATE',
    'JOBS',
    'SERVICES',
    'FASHION',
    'HOME_GARDEN',
    'SPORTS',
    'PETS',
    'BOOKS',
    'TOYS',
    'OTHER',
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Browse Listings</h1>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <input
              type="text"
              placeholder="Search listings..."
              className="input-field"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              className="input-field"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Listings Grid */}
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
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg truncate flex-1">
                  {listing.title}
                </h3>
                <span className="text-xs bg-primary-100 text-primary-800 px-2 py-1 rounded ml-2">
                  {listing.condition}
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                {listing.description}
              </p>
              <div className="flex justify-between items-center mt-4">
                <span className="text-primary-600 font-bold text-xl">
                  ${listing.price}
                </span>
                <span className="text-gray-500 text-sm">{listing.location}</span>
              </div>
            </a>
          ))}
        </div>
      )}

      {!loading && listings.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No listings found. Try adjusting your filters.
          </p>
        </div>
      )}
    </div>
  );
}

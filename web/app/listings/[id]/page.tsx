'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { listingsAPI } from '@/lib/api';

export default function ListingDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    loadListing();
  }, [params.id]);

  const loadListing = async () => {
    try {
      const data = await listingsAPI.getById(params.id);
      setListing(data);
    } catch (err: any) {
      setError('Listing not found');
      console.error('Failed to load listing:', err);
    } finally {
      setLoading(false);
    }
  };

  const nextImage = () => {
    if (listing?.images) {
      setCurrentImageIndex((prev) => (prev + 1) % listing.images.length);
    }
  };

  const prevImage = () => {
    if (listing?.images) {
      setCurrentImageIndex((prev) => (prev - 1 + listing.images.length) % listing.images.length);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="animate-pulse">
              <div className="bg-gray-200 rounded-2xl h-96 mb-8"></div>
              <div className="bg-gray-200 h-8 rounded w-3/4 mb-4"></div>
              <div className="bg-gray-200 h-4 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="text-6xl mb-4">😢</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Listing Not Found</h1>
            <p className="text-gray-600 mb-8">The listing you're looking for doesn't exist or has been removed.</p>
            <Link
              href="/listings"
              className="inline-block bg-gradient-to-r from-primary-500 to-primary-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-glow transition-all"
            >
              Browse All Listings
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-primary-600 mb-6 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Listings
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Gallery */}
            <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
              <div className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200">
                {listing.images && listing.images.length > 0 ? (
                  <>
                    <img
                      src={listing.images[currentImageIndex]}
                      alt={listing.title}
                      className="w-full h-full object-cover"
                    />
                    {listing.images.length > 1 && (
                      <>
                        {/* Previous Button */}
                        <button
                          onClick={prevImage}
                          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-3 rounded-full hover:bg-white transition-all shadow-md"
                        >
                          <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        {/* Next Button */}
                        <button
                          onClick={nextImage}
                          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-3 rounded-full hover:bg-white transition-all shadow-md"
                        >
                          <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                        {/* Image Counter */}
                        <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm">
                          {currentImageIndex + 1} / {listing.images.length}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-6xl">
                    📦
                  </div>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {listing.images && listing.images.length > 1 && (
                <div className="p-4 grid grid-cols-5 gap-2">
                  {listing.images.map((image: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`aspect-square rounded-lg overflow-hidden ${
                        currentImageIndex === index
                          ? 'ring-4 ring-primary-500'
                          : 'ring-2 ring-gray-200 hover:ring-primary-300'
                      } transition-all`}
                    >
                      <img src={image} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Listing Details */}
            <div className="space-y-6">
              {/* Price & Title */}
              <div className="bg-white rounded-2xl shadow-soft p-8">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{listing.title}</h1>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <span className="bg-primary-50 text-primary-600 px-3 py-1 rounded-lg font-medium">
                        {listing.category.replace(/_/g, ' ')}
                      </span>
                      {listing.location && (
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          </svg>
                          {listing.location}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-bold text-primary-600">
                      ${parseFloat(listing.price).toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="flex items-center gap-2 mb-6">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      listing.status === 'ACTIVE'
                        ? 'bg-green-100 text-green-700'
                        : listing.status === 'SOLD'
                        ? 'bg-gray-100 text-gray-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {listing.status}
                  </span>
                  {listing.condition && (
                    <span className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-700">
                      {listing.condition}
                    </span>
                  )}
                </div>

                {/* Description */}
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-3">Description</h2>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{listing.description}</p>
                </div>
              </div>

              {/* Contact Seller */}
              <div className="bg-gradient-to-r from-primary-500 to-secondary-600 rounded-2xl shadow-soft p-8 text-white">
                <h2 className="text-2xl font-bold mb-4">Interested?</h2>
                <p className="mb-6 text-blue-100">Contact the seller to learn more about this item</p>
                <div className="space-y-3">
                  <button className="w-full bg-white text-primary-600 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-all">
                    💬 Send Message
                  </button>
                  <button className="w-full bg-transparent border-2 border-white text-white px-6 py-3 rounded-xl font-bold hover:bg-white hover:text-primary-600 transition-all">
                    ⭐ Save to Favorites
                  </button>
                </div>
              </div>

              {/* Seller Info */}
              <div className="bg-white rounded-2xl shadow-soft p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Seller Information</h2>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {listing.seller?.username?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{listing.seller?.username || 'User'}</p>
                    <p className="text-sm text-gray-600">
                      Member since {new Date(listing.created_at).getFullYear()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Posted Date */}
              <div className="text-sm text-gray-500 text-center">
                Posted on {new Date(listing.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

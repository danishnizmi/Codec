/**
 * Listings Page - React Server Component
 * Fetches data server-side from FastAPI backend via Docker network
 * Optimized for SEO and initial load performance
 */

import ListingsClient from './listings-client';

// Server-side data fetching function
async function getListings(searchParams) {
  // Internal Docker network URL (server-side only)
  const API_URL = process.env.INTERNAL_API_URL || 'http://api:4000';

  // Build query parameters
  const params = new URLSearchParams({
    limit: '50',
    ...(searchParams.search && { search: searchParams.search }),
    ...(searchParams.category && { category: searchParams.category }),
    ...(searchParams.min_price && { min_price: searchParams.min_price }),
    ...(searchParams.max_price && { max_price: searchParams.max_price }),
  });

  try {
    const response = await fetch(`${API_URL}/listings?${params}`, {
      cache: 'no-store', // Always fetch fresh data
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Failed to fetch listings:', response.status);
      return [];
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching listings:', error.message || error.stack || String(error));
    return [];
  }
}

// Get categories from backend or define statically
const CATEGORIES = [
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

// Server Component (default export)
export default async function ListingsPage({ searchParams }) {
  // Fetch listings on the server
  const listings = await getListings(searchParams || {});

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Browse Listings</h1>

      {/* Client Component for interactive filters */}
      <ListingsClient
        initialListings={listings}
        categories={CATEGORIES}
        initialSearch={searchParams?.search || ''}
        initialCategory={searchParams?.category || ''}
      />
    </div>
  );
}

// Generate metadata for SEO
export async function generateMetadata({ searchParams }) {
  const category = searchParams?.category;
  const search = searchParams?.search;

  let title = 'Browse Listings - Marketplace';
  let description = 'Find great deals on classifieds in your local area';

  if (category) {
    title = `${category.replace('_', ' ')} Listings - Marketplace`;
    description = `Browse ${category.replace('_', ' ').toLowerCase()} classifieds`;
  }

  if (search) {
    title = `Search: ${search} - Marketplace`;
    description = `Search results for ${search}`;
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
  };
}

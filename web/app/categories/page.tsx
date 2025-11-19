'use client';

import Link from 'next/link';

const categories = [
  { name: 'Electronics', icon: '💻', color: 'from-blue-500 to-blue-600', description: 'Phones, laptops, tablets, and more' },
  { name: 'Vehicles', icon: '🚗', color: 'from-red-500 to-red-600', description: 'Cars, motorcycles, bikes, and parts' },
  { name: 'Real Estate', icon: '🏠', color: 'from-green-500 to-green-600', description: 'Houses, apartments, and land' },
  { name: 'Jobs', icon: '💼', color: 'from-indigo-500 to-indigo-600', description: 'Full-time, part-time, and freelance' },
  { name: 'Services', icon: '🔧', color: 'from-cyan-500 to-cyan-600', description: 'Professional and home services' },
  { name: 'Fashion', icon: '👕', color: 'from-purple-500 to-purple-600', description: 'Clothing, shoes, and accessories' },
  { name: 'Home & Garden', icon: '🌺', color: 'from-pink-500 to-pink-600', description: 'Furniture, decor, and plants' },
  { name: 'Sports', icon: '⚽', color: 'from-orange-500 to-orange-600', description: 'Equipment, apparel, and gear' },
  { name: 'Pets', icon: '🐾', color: 'from-yellow-500 to-yellow-600', description: 'Pets, supplies, and accessories' },
  { name: 'Books', icon: '📚', color: 'from-teal-500 to-teal-600', description: 'Textbooks, novels, and magazines' },
  { name: 'Toys', icon: '🧸', color: 'from-rose-500 to-rose-600', description: 'Kids toys and games' },
  { name: 'Other', icon: '🛍️', color: 'from-gray-500 to-gray-600', description: 'Everything else' },
];

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 animate-slide-up">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Browse Categories
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find exactly what you're looking for in our organized categories
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={`/listings?category=${category.name.toUpperCase().replace(/ & /g, '_').replace(/ /g, '_')}`}
              className="group"
            >
              <div className="bg-white rounded-2xl p-8 shadow-soft hover:shadow-glow transition-all duration-300 transform hover:scale-105">
                {/* Icon */}
                <div className={`w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${category.color} flex items-center justify-center text-4xl group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                  {category.icon}
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-2 text-center group-hover:text-primary-600 transition-colors">
                  {category.name}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-600 text-center">
                  {category.description}
                </p>

                {/* Arrow */}
                <div className="mt-4 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-primary-500 to-secondary-600 rounded-2xl p-12 text-white text-center shadow-glow">
          <h2 className="text-3xl font-bold mb-4">
            Can't find what you're looking for?
          </h2>
          <p className="text-lg mb-8 text-blue-100">
            Browse all listings or create your own!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/listings"
              className="bg-white text-primary-600 px-8 py-3 rounded-xl font-bold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
            >
              View All Listings
            </Link>
            <Link
              href="/listings/create"
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-xl font-bold hover:bg-white hover:text-primary-600 transition-all duration-300 transform hover:scale-105"
            >
              Post a Listing
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

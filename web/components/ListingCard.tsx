/**
 * ListingCard Component
 * Displays a marketplace listing with cyberpunk styling
 */

import React from 'react';
import { Listing, CATEGORY_COLORS } from '../app/types';
import Link from 'next/link';

interface ListingCardProps {
  listing: Listing;
}

export default function ListingCard({ listing }: ListingCardProps) {
  const imageUrl = listing.images && listing.images.length > 0
    ? listing.images[0]
    : 'https://picsum.photos/seed/default/400/300';

  const categoryColor = CATEGORY_COLORS[listing.category] || 'text-gray-400 border-gray-400';

  return (
    <Link href={`/listings/${listing.id}`}>
      <div className="cyber-card cursor-pointer group h-full flex flex-col">
        {/* Image Container */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={imageUrl}
            alt={listing.title}
            className="listing-image w-full h-full object-cover transition-transform duration-500"
            onError={(e) => {
              e.currentTarget.src = 'https://picsum.photos/seed/fallback/400/300';
            }}
          />
          {/* Category Badge */}
          <div className={`category-badge absolute top-3 right-3 ${categoryColor} bg-cyber-dark/80 backdrop-blur-sm`}>
            {listing.category}
          </div>
          {/* Condition Badge */}
          <div className="absolute bottom-3 left-3 px-2 py-1 bg-cyber-dark/80 backdrop-blur-sm border border-cyber-cyan/50 text-xs font-cyber text-gray-300">
            {listing.condition}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col p-4 space-y-3">
          {/* Title */}
          <h3 className="font-heading text-lg font-bold text-white group-hover:text-neon-cyan transition-colors duration-300 line-clamp-2">
            {listing.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-400 font-cyber line-clamp-2 flex-1">
            {listing.description}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-cyber-cyan/20">
            {/* Price */}
            <div className="price-display">
              {listing.price.toLocaleString()} {listing.currency}
            </div>

            {/* Views */}
            <div className="flex items-center space-x-1 text-xs text-gray-500 font-cyber">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span>{listing.views}</span>
            </div>
          </div>

          {/* Seller & Location */}
          <div className="flex items-center justify-between text-xs text-gray-500 font-cyber">
            <span className="text-cyber-neonGreen">{listing.seller_name}</span>
            <span>{listing.location}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

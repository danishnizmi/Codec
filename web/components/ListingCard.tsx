/**
 * ListingCard Component - Premium Cyberpunk Design
 * Features slide-up overlay on hover with glassmorphism
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
    : 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2070&fit=crop';

  const categoryColor = CATEGORY_COLORS[listing.category] || 'text-gray-400 border-gray-400';

  return (
    <Link href={`/listings/${listing.id}`}>
      <div className="group relative h-full overflow-hidden clip-corner-md cursor-pointer">
        {/* Main Image Container */}
        <div className="relative h-80 overflow-hidden bg-cyber-dark">
          <img
            src={imageUrl}
            alt={listing.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2070&fit=crop';
            }}
          />

          {/* Gradient Overlay (always visible) */}
          <div className="absolute inset-0 bg-gradient-to-t from-cyber-void via-transparent to-transparent opacity-60"></div>

          {/* Category Badge */}
          <div className={`
            absolute top-4 right-4 px-3 py-1 text-xs font-cyber uppercase
            bg-black/80 backdrop-blur-sm border ${categoryColor}
            clip-corner-sm
          `}>
            {listing.category}
          </div>

          {/* Condition Badge */}
          <div className="absolute top-4 left-4 px-3 py-1 text-xs font-cyber text-gray-300 bg-black/80 backdrop-blur-sm border border-gray-700 clip-corner-sm">
            {listing.condition}
          </div>

          {/* Slide-Up Overlay (appears on hover) */}
          <div className="
            absolute bottom-0 left-0 right-0
            bg-black/95 backdrop-blur-lg
            border-t-2 border-cyber-cyan
            transform translate-y-full group-hover:translate-y-0
            transition-transform duration-500 ease-out
            p-6
          ">
            <div className="space-y-4">
              {/* Price */}
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-3xl font-heading font-bold text-cyber-cyan">
                    {listing.price.toLocaleString()}
                  </span>
                  <span className="text-lg text-cyber-cyan ml-2 font-cyber">
                    {listing.currency}
                  </span>
                </div>
                <div className="text-xs text-gray-500 font-cyber">
                  {listing.views} views
                </div>
              </div>

              {/* Description Preview */}
              <p className="text-sm text-gray-400 font-cyber line-clamp-2">
                {listing.description}
              </p>

              {/* Seller & Location */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-cyber-green font-cyber">
                  @{listing.seller_name}
                </span>
                <span className="text-gray-500 font-cyber flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {listing.location}
                </span>
              </div>

              {/* View Details CTA */}
              <div className="text-center pt-2">
                <span className="text-xs uppercase tracking-wider text-cyber-cyan font-cyber">
                  View Details →
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Title (outside image, below) */}
        <div className="bg-cyber-dark/60 backdrop-blur-md border-x-2 border-b-2 border-cyber-cyan/20 p-4 group-hover:border-cyber-cyan/60 transition-colors duration-500">
          <h3 className="font-heading text-lg font-bold text-white group-hover:text-cyber-cyan transition-colors duration-300 line-clamp-1">
            {listing.title}
          </h3>
        </div>

        {/* Glow effect on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute inset-0 shadow-cyber-cyan"></div>
        </div>
      </div>
    </Link>
  );
}

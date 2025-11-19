/**
 * CyberNavbar Component
 * Futuristic navigation bar with glassmorphism
 */

'use client';

import React from 'react';
import Link from 'next/link';
import CyberButton from './CyberButton';

interface CyberNavbarProps {
  onCreateListing?: () => void;
}

export default function CyberNavbar({ onCreateListing }: CyberNavbarProps) {
  return (
    <nav className="sticky top-0 z-50 bg-cyber-dark/60 backdrop-blur-lg border-b border-cyber-cyan/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              {/* Hexagon-ish logo shape using clip-path */}
              <div
                className="w-10 h-10 bg-gradient-to-br from-cyber-cyan to-cyber-pink transition-all duration-300 group-hover:shadow-cyber-cyan"
                style={{
                  clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)'
                }}
              >
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-cyber-void font-heading font-bold text-xl">C</span>
                </div>
              </div>
            </div>
            <div className="font-heading">
              <h1 className="text-2xl font-bold text-neon-cyan tracking-wider">
                CYBER<span className="text-neon-pink">BAZAAR</span>
              </h1>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-cyber">
                Year 2077
              </p>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="font-heading text-sm uppercase tracking-wider text-gray-400 hover:text-cyber-cyan transition-colors duration-300"
            >
              Marketplace
            </Link>
            <Link
              href="/categories"
              className="font-heading text-sm uppercase tracking-wider text-gray-400 hover:text-cyber-cyan transition-colors duration-300"
            >
              Categories
            </Link>
            <Link
              href="/about"
              className="font-heading text-sm uppercase tracking-wider text-gray-400 hover:text-cyber-cyan transition-colors duration-300"
            >
              About
            </Link>
          </div>

          {/* CTA Button */}
          <div>
            <CyberButton
              variant="pink"
              onClick={onCreateListing}
            >
              + Post Listing
            </CyberButton>
          </div>
        </div>
      </div>
    </nav>
  );
}

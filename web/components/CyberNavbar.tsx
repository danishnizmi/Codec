/**
 * Premium CyberNavbar Component
 * Glassmorphic HUD with status indicators
 */

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import CyberButton from './CyberButton';

interface CyberNavbarProps {
  onCreateListing?: () => void;
}

export default function CyberNavbar({ onCreateListing }: CyberNavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [time, setTime] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }));
    };

    window.addEventListener('scroll', handleScroll);
    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(interval);
    };
  }, []);

  return (
    <nav className={`
      fixed top-0 left-0 right-0 z-50
      transition-all duration-500
      ${scrolled
        ? 'bg-black/90 backdrop-blur-xl border-b-2 border-cyber-cyan/50 shadow-cyber-cyan'
        : 'bg-black/60 backdrop-blur-md border-b border-cyber-cyan/20'
      }
    `}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Left: Logo + HUD Status */}
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                {/* Hexagonal logo */}
                <div
                  className="w-12 h-12 bg-gradient-to-br from-cyber-cyan to-cyber-purple transition-all duration-300 group-hover:shadow-cyber-cyan"
                  style={{
                    clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)'
                  }}
                >
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-cyber-void font-heading font-black text-xl">C</span>
                  </div>
                </div>
              </div>
              <div className="font-heading">
                <h1 className="text-2xl font-bold tracking-wider">
                  <span className="text-cyber-cyan">CODEX</span>
                </h1>
                <p className="text-[9px] text-gray-600 uppercase tracking-widest font-cyber -mt-1">
                  Year 2077
                </p>
              </div>
            </Link>

            {/* HUD Status Indicators */}
            <div className="hidden lg:flex items-center space-x-6">
              {/* Secure Connection */}
              <div className="hud-status">
                <span>SECURE_CONNECTION</span>
              </div>

              {/* System Time */}
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-cyber-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-cyber text-xs text-cyber-cyan tracking-wider">
                  {time}
                </span>
              </div>

              {/* Active Users */}
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-cyber-green rounded-full animate-pulse"></div>
                <span className="font-cyber text-xs text-gray-500 tracking-wider">
                  {Math.floor(Math.random() * 50) + 150} ONLINE
                </span>
              </div>
            </div>
          </div>

          {/* Center: Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="relative font-heading text-sm uppercase tracking-wider text-gray-400 hover:text-cyber-cyan transition-colors duration-300 group"
            >
              <span>Marketplace</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyber-cyan group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              href="/categories"
              className="relative font-heading text-sm uppercase tracking-wider text-gray-400 hover:text-cyber-cyan transition-colors duration-300 group"
            >
              <span>Categories</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyber-cyan group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              href="/about"
              className="relative font-heading text-sm uppercase tracking-wider text-gray-400 hover:text-cyber-cyan transition-colors duration-300 group"
            >
              <span>About</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyber-cyan group-hover:w-full transition-all duration-300"></span>
            </Link>
          </div>

          {/* Right: CTA Button */}
          <div className="flex items-center space-x-4">
            <CyberButton
              variant="cyan"
              onClick={onCreateListing}
              className="hidden sm:block"
            >
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Post Listing</span>
              </div>
            </CyberButton>

            {/* Mobile: Just the icon */}
            <button
              onClick={onCreateListing}
              className="sm:hidden cyber-button border-cyber-cyan text-cyber-cyan hover:bg-cyber-cyan hover:text-cyber-void px-4 py-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyber-cyan to-transparent opacity-50"></div>
    </nav>
  );
}

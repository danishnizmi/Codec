/**
 * Premium CyberNavbar Component
 * Minimalistic Cyberpunk HUD with icons
 */

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Shield, Clock, Users, LayoutGrid, Info } from 'lucide-react';
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
        ? 'bg-black/95 backdrop-blur-xl border-b-2 border-cyber-cyan/50 shadow-cyber-cyan'
        : 'bg-black/70 backdrop-blur-md border-b border-cyber-cyan/20'
      }
    `}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Left: Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              {/* Hexagonal logo */}
              <div
                className="w-10 h-10 bg-gradient-to-br from-cyber-cyan to-cyber-purple transition-all duration-300 group-hover:shadow-cyber-cyan"
                style={{
                  clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)'
                }}
              >
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-cyber-void font-heading font-black text-lg">C</span>
                </div>
              </div>
            </div>
            <div className="font-heading">
              <h1 className="text-xl font-bold tracking-wider">
                <span className="text-cyber-cyan">CODEX</span>
              </h1>
              <p className="text-[8px] text-gray-600 uppercase tracking-widest font-cyber -mt-1">
                Year 2077
              </p>
            </div>
          </Link>

          {/* Center: Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className="flex items-center gap-2 font-heading text-xs uppercase tracking-wider text-gray-400 hover:text-cyber-cyan transition-colors duration-300 group"
            >
              <LayoutGrid className="w-4 h-4" />
              <span>Marketplace</span>
            </Link>
            <Link
              href="/about"
              className="flex items-center gap-2 font-heading text-xs uppercase tracking-wider text-gray-400 hover:text-cyber-cyan transition-colors duration-300 group"
            >
              <Info className="w-4 h-4" />
              <span>About</span>
            </Link>
          </div>

          {/* Right: HUD + CTA */}
          <div className="flex items-center space-x-6">
            {/* HUD Status - Desktop Only */}
            <div className="hidden lg:flex items-center space-x-4 border-l border-cyber-cyan/20 pl-6">
              {/* Secure Connection */}
              <div className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-cyber-green" />
                <span className="font-cyber text-[10px] text-cyber-green uppercase tracking-wider">
                  SECURE
                </span>
              </div>

              {/* System Time */}
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-cyber-cyan" />
                <span className="font-cyber text-[10px] text-cyber-cyan tracking-wider">
                  {time}
                </span>
              </div>

              {/* Active Users */}
              <div className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-cyber-pink" />
                <span className="font-cyber text-[10px] text-gray-500 tracking-wider">
                  {Math.floor(Math.random() * 50) + 150}
                </span>
              </div>
            </div>

            {/* CTA Button */}
            <CyberButton
              variant="cyan"
              onClick={onCreateListing}
              className="hidden sm:flex"
            >
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                <span className="text-xs">POST LISTING</span>
              </div>
            </CyberButton>

            {/* Mobile: Just the icon */}
            <button
              onClick={onCreateListing}
              className="sm:hidden cyber-button border-cyber-cyan text-cyber-cyan hover:bg-cyber-cyan hover:text-cyber-void p-2"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyber-cyan to-transparent opacity-30"></div>
    </nav>
  );
}

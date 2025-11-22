/**
 * Footer Component
 * Minimalistic Cyberpunk Footer
 */

'use client';

import React from 'react';
import { Github, Twitter, Mail, Heart, Terminal } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-cyber-cyan/20 bg-cyber-dark/40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left: Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div
                className="w-8 h-8 bg-gradient-to-br from-cyber-cyan to-cyber-purple"
                style={{
                  clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)'
                }}
              >
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-cyber-void font-heading font-black text-sm">C</span>
                </div>
              </div>
              <h3 className="text-xl font-heading font-bold text-cyber-cyan">CODEX</h3>
            </div>
            <p className="text-sm text-gray-500 font-cyber leading-relaxed">
              Your trusted cyberpunk marketplace for buying and selling in the digital realm of 2077.
            </p>
          </div>

          {/* Center: Quick Links */}
          <div>
            <h4 className="text-sm font-heading font-bold text-white mb-4 uppercase tracking-wider flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyber-cyan" />
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-sm text-gray-500 hover:text-cyber-cyan transition-colors font-cyber">
                  ▹ Browse Listings
                </a>
              </li>
              <li>
                <a href="/about" className="text-sm text-gray-500 hover:text-cyber-cyan transition-colors font-cyber">
                  ▹ About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-500 hover:text-cyber-cyan transition-colors font-cyber">
                  ▹ Safety Tips
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-500 hover:text-cyber-cyan transition-colors font-cyber">
                  ▹ FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Right: Connect */}
          <div>
            <h4 className="text-sm font-heading font-bold text-white mb-4 uppercase tracking-wider flex items-center gap-2">
              <Heart className="w-4 h-4 text-cyber-pink" />
              Connect
            </h4>
            <div className="flex gap-3 mb-4">
              <a
                href="#"
                className="w-10 h-10 border-2 border-cyber-cyan/30 hover:border-cyber-cyan hover:bg-cyber-cyan/10 flex items-center justify-center clip-corner-sm transition-all duration-300 group"
              >
                <Github className="w-5 h-5 text-gray-500 group-hover:text-cyber-cyan transition-colors" />
              </a>
              <a
                href="#"
                className="w-10 h-10 border-2 border-cyber-cyan/30 hover:border-cyber-cyan hover:bg-cyber-cyan/10 flex items-center justify-center clip-corner-sm transition-all duration-300 group"
              >
                <Twitter className="w-5 h-5 text-gray-500 group-hover:text-cyber-cyan transition-colors" />
              </a>
              <a
                href="#"
                className="w-10 h-10 border-2 border-cyber-cyan/30 hover:border-cyber-cyan hover:bg-cyber-cyan/10 flex items-center justify-center clip-corner-sm transition-all duration-300 group"
              >
                <Mail className="w-5 h-5 text-gray-500 group-hover:text-cyber-cyan transition-colors" />
              </a>
            </div>
            <p className="text-xs text-gray-600 font-cyber">
              ⚡ Powered by Cyberpunk Technology
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-cyber-cyan/10">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-gray-600 font-cyber text-center sm:text-left">
              © {currentYear} Codec. All rights reserved. | Year 2077
            </p>
            <div className="flex gap-6 text-xs text-gray-600 font-cyber">
              <a href="#" className="hover:text-cyber-cyan transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-cyber-cyan transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-cyber-cyan transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Accent Line */}
      <div className="h-1 bg-gradient-to-r from-transparent via-cyber-cyan to-transparent opacity-30"></div>
    </footer>
  );
}

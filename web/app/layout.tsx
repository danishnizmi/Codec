import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CyberBazaar - Year 2077 Marketplace',
  description: 'Anonymous marketplace for the cyberpunk era. High-tech, low-life. No accounts required. Trade anything in the streets of 2077.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-cyber-void text-gray-100 font-cyber">
        <main className="min-h-screen">
          {children}
        </main>
        <footer className="bg-cyber-dark/60 backdrop-blur-md border-t border-cyber-cyan/20 text-gray-300 py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* About */}
              <div>
                <h3 className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-secondary-500 font-bold text-lg mb-4">
                  Codec
                </h3>
                <p className="text-sm leading-relaxed text-gray-400">
                  Your trusted cyberpunk marketplace for buying and selling items. Connect with traders in the digital realm.
                </p>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="text-gray-100 font-semibold mb-4 flex items-center gap-2">
                  <span className="text-primary-500">⚡</span> Quick Links
                </h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="/listings" className="hover:text-primary-500 transition-colors flex items-center gap-2"><span className="text-primary-500/50">▹</span> Browse Listings</a></li>
                  <li><a href="/categories" className="hover:text-primary-500 transition-colors flex items-center gap-2"><span className="text-primary-500/50">▹</span> Categories</a></li>
                  <li><a href="/listings/create" className="hover:text-primary-500 transition-colors flex items-center gap-2"><span className="text-primary-500/50">▹</span> Sell an Item</a></li>
                  <li><a href="/about" className="hover:text-primary-500 transition-colors flex items-center gap-2"><span className="text-primary-500/50">▹</span> About Us</a></li>
                </ul>
              </div>

              {/* Support */}
              <div>
                <h4 className="text-gray-100 font-semibold mb-4 flex items-center gap-2">
                  <span className="text-secondary-500">💬</span> Support
                </h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="/help" className="hover:text-secondary-500 transition-colors flex items-center gap-2"><span className="text-secondary-500/50">▹</span> Help Center</a></li>
                  <li><a href="/safety" className="hover:text-secondary-500 transition-colors flex items-center gap-2"><span className="text-secondary-500/50">▹</span> Safety Tips</a></li>
                  <li><a href="/contact" className="hover:text-secondary-500 transition-colors flex items-center gap-2"><span className="text-secondary-500/50">▹</span> Contact Us</a></li>
                  <li><a href="/faq" className="hover:text-secondary-500 transition-colors flex items-center gap-2"><span className="text-secondary-500/50">▹</span> FAQ</a></li>
                </ul>
              </div>

              {/* Legal */}
              <div>
                <h4 className="text-gray-100 font-semibold mb-4 flex items-center gap-2">
                  <span className="text-accent-500">⚖️</span> Legal
                </h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="/terms" className="hover:text-accent-500 transition-colors flex items-center gap-2"><span className="text-accent-500/50">▹</span> Terms of Service</a></li>
                  <li><a href="/privacy" className="hover:text-accent-500 transition-colors flex items-center gap-2"><span className="text-accent-500/50">▹</span> Privacy Policy</a></li>
                  <li><a href="/cookies" className="hover:text-accent-500 transition-colors flex items-center gap-2"><span className="text-accent-500/50">▹</span> Cookie Policy</a></li>
                </ul>
              </div>
            </div>

            <div className="border-t border-primary-500/20 mt-8 pt-8 text-center text-sm">
              <p className="text-gray-500">
                &copy; {new Date().getFullYear()} <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-secondary-500 font-bold">Codec</span>. All rights reserved.
              </p>
              <p className="text-xs text-gray-600 mt-2">Powered by Cyberpunk Technology</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}

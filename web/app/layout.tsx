import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'

export const metadata: Metadata = {
  title: 'Codec - Buy & Sell Locally',
  description: 'The best local marketplace to buy and sell items. Find great deals on electronics, vehicles, real estate, and more.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-gray-50">
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <footer className="bg-gray-900 text-gray-300 py-12 mt-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* About */}
              <div>
                <h3 className="text-white font-bold text-lg mb-4">Codec</h3>
                <p className="text-sm leading-relaxed">
                  Your trusted local marketplace for buying and selling items. Connect with buyers and sellers in your area.
                </p>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="text-white font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="/listings" className="hover:text-primary-400 transition-colors">Browse Listings</a></li>
                  <li><a href="/categories" className="hover:text-primary-400 transition-colors">Categories</a></li>
                  <li><a href="/listings/create" className="hover:text-primary-400 transition-colors">Sell an Item</a></li>
                  <li><a href="/about" className="hover:text-primary-400 transition-colors">About Us</a></li>
                </ul>
              </div>

              {/* Support */}
              <div>
                <h4 className="text-white font-semibold mb-4">Support</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="/help" className="hover:text-primary-400 transition-colors">Help Center</a></li>
                  <li><a href="/safety" className="hover:text-primary-400 transition-colors">Safety Tips</a></li>
                  <li><a href="/contact" className="hover:text-primary-400 transition-colors">Contact Us</a></li>
                  <li><a href="/faq" className="hover:text-primary-400 transition-colors">FAQ</a></li>
                </ul>
              </div>

              {/* Legal */}
              <div>
                <h4 className="text-white font-semibold mb-4">Legal</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="/terms" className="hover:text-primary-400 transition-colors">Terms of Service</a></li>
                  <li><a href="/privacy" className="hover:text-primary-400 transition-colors">Privacy Policy</a></li>
                  <li><a href="/cookies" className="hover:text-primary-400 transition-colors">Cookie Policy</a></li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
              <p>&copy; {new Date().getFullYear()} Codec. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}

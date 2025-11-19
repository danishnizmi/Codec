import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Classifieds Marketplace',
  description: 'Buy and sell items locally',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <nav className="bg-primary-600 text-white shadow-lg">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <a href="/" className="text-2xl font-bold">
                Marketplace
              </a>
              <div className="flex gap-4">
                <a href="/listings" className="hover:underline">
                  Browse
                </a>
                <a href="/auth/login" className="hover:underline">
                  Login
                </a>
                <a href="/auth/register" className="hover:underline">
                  Register
                </a>
              </div>
            </div>
          </div>
        </nav>
        <main className="min-h-screen bg-gray-50">
          {children}
        </main>
        <footer className="bg-gray-800 text-white py-8 mt-12">
          <div className="container mx-auto px-4 text-center">
            <p>&copy; 2024 Classifieds Marketplace. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  )
}

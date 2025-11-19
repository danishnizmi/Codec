'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function MessagesPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Messages</h1>
          <p className="text-gray-600">Chat with buyers and sellers</p>
        </div>

        <div className="bg-white rounded-2xl shadow-soft p-12 text-center">
          <div className="text-6xl mb-4">💬</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No messages yet</h3>
          <p className="text-gray-600 mb-6">Start browsing listings to connect with sellers</p>
          <Link
            href="/listings"
            className="inline-block bg-gradient-to-r from-primary-500 to-primary-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-glow transition-all"
          >
            Browse Listings
          </Link>
        </div>
      </div>
    </div>
  );
}

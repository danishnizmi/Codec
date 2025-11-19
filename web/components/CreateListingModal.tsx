/**
 * CreateListingModal Component
 * Holographic terminal-style form for creating listings
 */

'use client';

import React, { useState } from 'react';
import CyberButton from './CyberButton';
import { Category, Condition, CreateListingData } from '../app/types';

interface CreateListingModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateListingModal({ onClose, onSuccess }: CreateListingModalProps) {
  const [formData, setFormData] = useState<CreateListingData>({
    title: '',
    description: '',
    price: 0,
    currency: 'ED',
    category: Category.MISC,
    condition: Condition.USED,
    location: '',
    seller_name: '',
    images: [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // Validate form
      if (!formData.title || !formData.description || !formData.seller_name || !formData.location) {
        throw new Error('Please fill in all required fields');
      }

      if (formData.price <= 0) {
        throw new Error('Price must be greater than 0');
      }

      // Submit to API
      const response = await fetch('/api/listings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();

        // Handle content moderation rejection
        if (response.status === 400 && errorData.detail?.error === 'Content moderation failed') {
          throw new Error(`Content rejected: ${errorData.detail.reason}`);
        }

        throw new Error(errorData.detail || 'Failed to create listing');
      }

      // Success
      setSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 1500);

    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="cyber-modal w-full max-w-3xl max-h-[90vh] overflow-y-auto p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-cyber-cyan/30">
          <div>
            <h2 className="text-3xl font-heading font-bold text-neon-cyan">CREATE LISTING</h2>
            <p className="text-sm text-gray-500 font-cyber mt-1">Year 2077 | Anonymous Posting</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-cyber-pink transition-colors"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-cyber-green/20 border border-cyber-green text-cyber-green clip-corner-sm">
            <p className="font-cyber font-bold">✓ LISTING CREATED SUCCESSFULLY</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-cyber-alert/20 border border-cyber-alert text-cyber-alert clip-corner-sm">
            <p className="font-cyber font-bold">⚠ ERROR: {error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Seller Name */}
          <div>
            <label className="block text-sm font-cyber text-gray-400 mb-2">
              SELLER HANDLE *
            </label>
            <input
              type="text"
              name="seller_name"
              value={formData.seller_name}
              onChange={handleChange}
              placeholder="NetRunner_99"
              className="cyber-input"
              required
              maxLength={50}
            />
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-cyber text-gray-400 mb-2">
              LISTING TITLE *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Arasaka Mk.IV Cyberdeck (Refurbished)"
              className="cyber-input"
              required
              maxLength={200}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-cyber text-gray-400 mb-2">
              DESCRIPTION *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your item in detail. Be honest about condition and functionality."
              className="cyber-input min-h-[120px] resize-y"
              required
              maxLength={5000}
            />
          </div>

          {/* Price & Currency */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-cyber text-gray-400 mb-2">
                PRICE *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price || ''}
                onChange={handleChange}
                placeholder="1200"
                className="cyber-input"
                required
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-cyber text-gray-400 mb-2">
                CURRENCY
              </label>
              <input
                type="text"
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                placeholder="ED"
                className="cyber-input uppercase"
                maxLength={10}
              />
            </div>
          </div>

          {/* Category & Condition */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-cyber text-gray-400 mb-2">
                CATEGORY *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="cyber-select"
                required
              >
                {Object.values(Category).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-cyber text-gray-400 mb-2">
                CONDITION *
              </label>
              <select
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                className="cyber-select"
                required
              >
                {Object.values(Condition).map((cond) => (
                  <option key={cond} value={cond}>
                    {cond}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-cyber text-gray-400 mb-2">
              LOCATION *
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Night City, Sector 4"
              className="cyber-input"
              required
              maxLength={100}
            />
          </div>

          {/* Image URL (optional) */}
          <div>
            <label className="block text-sm font-cyber text-gray-400 mb-2">
              IMAGE URL (Optional)
            </label>
            <input
              type="url"
              name="images"
              placeholder="https://picsum.photos/seed/youritem/400/300"
              onChange={(e) => setFormData(prev => ({
                ...prev,
                images: e.target.value ? [e.target.value] : []
              }))}
              className="cyber-input"
            />
            <p className="text-xs text-gray-600 mt-2 font-cyber">
              Leave blank for a placeholder image
            </p>
          </div>

          {/* Content Moderation Notice */}
          <div className="p-4 bg-cyber-dark/60 border border-cyber-cyan/20 clip-corner-sm">
            <p className="text-xs text-gray-500 font-cyber">
              ⚠ All listings are automatically scanned by AI. Harmful, illegal, or inappropriate content will be rejected.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <CyberButton
              type="submit"
              variant="cyan"
              disabled={isSubmitting}
              fullWidth
            >
              {isSubmitting ? 'SUBMITTING...' : 'CREATE LISTING'}
            </CyberButton>
            <CyberButton
              type="button"
              variant="alert"
              onClick={onClose}
              disabled={isSubmitting}
            >
              CANCEL
            </CyberButton>
          </div>
        </form>
      </div>
    </div>
  );
}

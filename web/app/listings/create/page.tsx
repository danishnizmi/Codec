'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { listingsAPI } from '@/lib/api';
import { uploadFileToS3 } from '@/lib/s3-upload';

const CATEGORIES = [
  'ELECTRONICS',
  'VEHICLES',
  'REAL_ESTATE',
  'JOBS',
  'SERVICES',
  'FASHION',
  'HOME_GARDEN',
  'SPORTS',
  'PETS',
  'BOOKS',
  'TOYS',
  'OTHER',
];

export default function CreateListingPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: 'ELECTRONICS',
    location: '',
  });
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
    }
  }, [router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (files.length + images.length > 10) {
      setError('Maximum 10 images allowed');
      return;
    }

    // Validate file sizes and types
    for (const file of files) {
      if (file.size > 10 * 1024 * 1024) {
        setError('Each image must be less than 10MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        setError('Only image files are allowed');
        return;
      }
    }

    setImages([...images, ...files]);

    // Create previews
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });

    setError('');
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setUploading(true);

    try {
      let imageUrls: string[] = [];

      // Upload images to S3 if any
      if (images.length > 0) {
        const uploadData = await listingsAPI.getS3UploadUrls(images.length);
        setUploadProgress(new Array(images.length).fill(0));

        // Upload each image
        const uploadPromises = images.map(async (file, index) => {
          try {
            const url = await uploadFileToS3(
              file,
              uploadData.upload_urls[index],
              (progress) => {
                setUploadProgress(prev => {
                  const newProgress = [...prev];
                  newProgress[index] = progress;
                  return newProgress;
                });
              }
            );
            return url;
          } catch (err) {
            console.error(`Failed to upload image ${index + 1}:`, err);
            throw new Error(`Failed to upload image ${index + 1}`);
          }
        });

        imageUrls = await Promise.all(uploadPromises);
      }

      setUploading(false);

      // Create listing
      await listingsAPI.create({
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        location: formData.location || undefined,
        images: imageUrls,
      });

      // Redirect to listings page
      router.push('/dashboard/listings');
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Failed to create listing');
      setUploading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Header */}
        <div className="mb-8 animate-slide-up">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Create Listing</h1>
          <p className="text-gray-600">Fill in the details to list your item</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 animate-slide-down">
            <p className="text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Main Card */}
          <div className="bg-white rounded-2xl shadow-soft p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Basic Information</h2>

            <div className="space-y-5">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  id="title"
                  type="text"
                  required
                  maxLength={100}
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none transition-all"
                  placeholder="e.g., iPhone 13 Pro Max 256GB"
                />
                <p className="text-xs text-gray-500 mt-1">{formData.title.length}/100 characters</p>
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  id="description"
                  required
                  rows={6}
                  maxLength={2000}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none transition-all resize-none"
                  placeholder="Describe your item in detail..."
                />
                <p className="text-xs text-gray-500 mt-1">{formData.description.length}/2000 characters</p>
              </div>

              {/* Price & Category Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="price" className="block text-sm font-semibold text-gray-700 mb-2">
                    Price ($) *
                  </label>
                  <input
                    id="price"
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none transition-all"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    id="category"
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none transition-all bg-white"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>
                        {cat.replace(/_/g, ' ')}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Location */}
              <div>
                <label htmlFor="location" className="block text-sm font-semibold text-gray-700 mb-2">
                  Location (Optional)
                </label>
                <input
                  id="location"
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none transition-all"
                  placeholder="e.g., New York, NY"
                />
              </div>
            </div>
          </div>

          {/* Images Card */}
          <div className="bg-white rounded-2xl shadow-soft p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Photos</h2>
            <p className="text-gray-600 mb-6">Add up to 10 photos (max 10MB each)</p>

            {/* Image Upload */}
            <div className="mb-6">
              <label className="block">
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-primary-500 transition-colors cursor-pointer">
                  <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <p className="text-gray-600 font-medium mb-1">Click to upload images</p>
                  <p className="text-sm text-gray-500">PNG, JPG up to 10MB</p>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
              </label>
            </div>

            {/* Image Previews */}
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-xl"
                    />
                    {uploading && (
                      <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center">
                        <div className="text-white text-sm font-semibold">
                          {Math.round(uploadProgress[index] || 0)}%
                        </div>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-xl font-bold text-lg hover:bg-gray-300 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-primary-500 to-primary-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-glow transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  {uploading ? 'Uploading...' : 'Creating...'}
                </span>
              ) : (
                '✨ Publish Listing'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

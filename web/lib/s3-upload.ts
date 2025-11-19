/**
 * S3 Upload Utility for Presigned POST
 * Handles direct client-to-S3 uploads using presigned POST URLs
 */

import { listingsAPI } from './api';

export interface S3UploadUrl {
  file_key: string;
  upload_url: string;
  fields: Record<string, string>;
  public_url: string;
}

export interface UploadProgress {
  file: File;
  progress: number;
  uploaded: boolean;
  error?: string;
  publicUrl?: string;
}

/**
 * Upload a single file to S3 using presigned POST
 */
export async function uploadFileToS3(
  file: File,
  uploadData: S3UploadUrl,
  onProgress?: (progress: number) => void
): Promise<string> {
  return new Promise((resolve, reject) => {
    const formData = new FormData();

    // Add all fields from the presigned POST
    Object.keys(uploadData.fields).forEach((key) => {
      formData.append(key, uploadData.fields[key]);
    });

    // Add the file last (required by S3)
    formData.append('file', file);

    // Create XMLHttpRequest for progress tracking
    const xhr = new XMLHttpRequest();

    // Track upload progress
    if (onProgress) {
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percentComplete = (e.loaded / e.total) * 100;
          onProgress(percentComplete);
        }
      });
    }

    // Handle completion
    xhr.addEventListener('load', () => {
      if (xhr.status === 200 || xhr.status === 204) {
        // S3 returns 204 No Content on successful upload
        resolve(uploadData.public_url);
      } else {
        reject(new Error(`Upload failed with status ${xhr.status}`));
      }
    });

    // Handle errors
    xhr.addEventListener('error', () => {
      reject(new Error('Network error during upload'));
    });

    xhr.addEventListener('abort', () => {
      reject(new Error('Upload aborted'));
    });

    // Send the request
    xhr.open('POST', uploadData.upload_url);
    xhr.send(formData);
  });
}

/**
 * Upload multiple files to S3
 */
export async function uploadFilesToS3(
  files: File[],
  onProgress?: (fileIndex: number, progress: number) => void
): Promise<string[]> {
  // Get presigned URLs from API
  const { upload_urls } = await listingsAPI.getS3UploadUrls(files.length);

  if (upload_urls.length !== files.length) {
    throw new Error('Mismatch between files and upload URLs');
  }

  // Upload each file
  const uploadPromises = files.map((file, index) => {
    return uploadFileToS3(
      file,
      upload_urls[index],
      onProgress ? (progress) => onProgress(index, progress) : undefined
    );
  });

  return Promise.all(uploadPromises);
}

/**
 * Validate image file before upload
 */
export function validateImageFile(
  file: File,
  maxSizeMB: number = 10
): { valid: boolean; error?: string } {
  // Check file type
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid file type. Only JPEG, PNG, and WebP images are allowed.',
    };
  }

  // Check file size
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: `File size exceeds ${maxSizeMB}MB limit.`,
    };
  }

  return { valid: true };
}

/**
 * Compress image before upload (optional, for better UX)
 */
export async function compressImage(
  file: File,
  maxWidth: number = 1920,
  maxHeight: number = 1080,
  quality: number = 0.8
): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;

        // Calculate new dimensions
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width *= ratio;
          height *= ratio;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to compress image'));
              return;
            }
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          },
          'image/jpeg',
          quality
        );
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

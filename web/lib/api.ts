import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: async (data: { email: string; username: string; password: string; full_name?: string }) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  login: async (username: string, password: string) => {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    const response = await api.post('/auth/login', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// Listings API
export const listingsAPI = {
  getAll: async (params?: {
    skip?: number;
    limit?: number;
    category?: string;
    search?: string;
    min_price?: number;
    max_price?: number;
  }) => {
    const response = await api.get('/listings', { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/listings/${id}`);
    return response.data;
  },

  create: async (data: any) => {
    const response = await api.post('/listings', data);
    return response.data;
  },

  update: async (id: string, data: any) => {
    const response = await api.put(`/listings/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    await api.delete(`/listings/${id}`);
  },

  getMyListings: async () => {
    const response = await api.get('/listings/user/my-listings');
    return response.data;
  },
};

// Messages API
export const messagesAPI = {
  getAll: async (listingId?: string) => {
    const params = listingId ? { listing_id: listingId } : {};
    const response = await api.get('/messages', { params });
    return response.data;
  },

  send: async (listingId: string, content: string) => {
    const response = await api.post('/messages', {
      listing_id: listingId,
      content,
    });
    return response.data;
  },

  markRead: async (messageId: string) => {
    const response = await api.put(`/messages/${messageId}/read`);
    return response.data;
  },
};

// Favorites API
export const favoritesAPI = {
  getAll: async () => {
    const response = await api.get('/favorites');
    return response.data;
  },

  add: async (listingId: string) => {
    const response = await api.post(`/favorites/${listingId}`);
    return response.data;
  },

  remove: async (listingId: string) => {
    await api.delete(`/favorites/${listingId}`);
  },
};

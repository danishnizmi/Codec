/**
 * CyberBazaar Type Definitions
 * Year 2077
 */

export enum Category {
  CYBERWARE = 'CYBERWARE',
  SOFTWARE = 'SOFTWARE',
  HARDWARE = 'HARDWARE',
  VEHICLES = 'VEHICLES',
  WEAPONS = 'WEAPONS',
  CLOTHING = 'CLOTHING',
  SERVICES = 'SERVICES',
  MISC = 'MISC',
}

export enum Condition {
  NEW = 'NEW',
  LIKE_NEW = 'LIKE_NEW',
  GOOD = 'GOOD',
  FAIR = 'FAIR',
  USED = 'USED',
}

export enum ListingStatus {
  ACTIVE = 'ACTIVE',
  SOLD = 'SOLD',
  DELETED = 'DELETED',
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  category: Category;
  condition: Condition;
  status: ListingStatus;
  location: string;
  seller_name: string;
  images: string[];
  views: number;
  created_at: string;
  updated_at: string;
}

export interface CreateListingData {
  title: string;
  description: string;
  price: number;
  currency: string;
  category: Category;
  condition: Condition;
  location: string;
  seller_name: string;
  images: string[];
}

export interface ModerationResult {
  approved: boolean;
  reason: string;
  confidence: string;
}

// Category colors for UI
export const CATEGORY_COLORS: Record<Category, string> = {
  [Category.CYBERWARE]: 'text-cyber-neonPink border-cyber-neonPink',
  [Category.SOFTWARE]: 'text-cyber-neonGreen border-cyber-neonGreen',
  [Category.HARDWARE]: 'text-cyber-neonBlue border-cyber-neonBlue',
  [Category.VEHICLES]: 'text-yellow-400 border-yellow-400',
  [Category.WEAPONS]: 'text-cyber-alert border-cyber-alert',
  [Category.CLOTHING]: 'text-cyber-neonPurple border-cyber-neonPurple',
  [Category.SERVICES]: 'text-white border-white',
  [Category.MISC]: 'text-gray-400 border-gray-400',
};

// Mock data for development
export const MOCK_LISTINGS: Listing[] = [
  {
    id: '1',
    title: 'Arasaka Mk.IV Cyberdeck (Refurbished)',
    price: 1200,
    currency: 'ED',
    category: Category.HARDWARE,
    condition: Condition.USED,
    status: ListingStatus.ACTIVE,
    description: 'Pre-owned Arasaka Mk.IV. Slight neural latency issues but fully jailbroken. Comes with IceBreaker v2.0 pre-installed. Perfect for aspiring netrunners on a budget.',
    images: ['https://picsum.photos/seed/cyberdeck/400/300'],
    seller_name: 'NetRunner_99',
    location: 'Night City, Sector 4',
    views: 42,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Kiroshi Optics - Basic Model',
    price: 450,
    currency: 'ED',
    category: Category.CYBERWARE,
    condition: Condition.GOOD,
    status: ListingStatus.ACTIVE,
    description: 'Standard Kiroshi optics. Cleaned and sterilized. HUD functionality intact. Previous owner... no longer needs them.',
    images: ['https://picsum.photos/seed/eye/400/300'],
    seller_name: 'RipperDoc_T',
    location: 'Watson',
    views: 128,
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '3',
    title: 'Yaiba Kusanagi CT-3X Bike',
    price: 22000,
    currency: 'ED',
    category: Category.VEHICLES,
    condition: Condition.LIKE_NEW,
    status: ListingStatus.ACTIVE,
    description: 'The fastest bike on the streets. Custom neon underglow. Engine tuned for max torque. Serious buyers only.',
    images: ['https://picsum.photos/seed/bike/400/300'],
    seller_name: 'SpeedDemon',
    location: 'Westbrook',
    views: 234,
    created_at: new Date(Date.now() - 172800000).toISOString(),
    updated_at: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: '4',
    title: 'Encrypted Datashard (Top Secret)',
    price: 5000,
    currency: 'ED',
    category: Category.SOFTWARE,
    condition: Condition.NEW,
    status: ListingStatus.ACTIVE,
    description: 'Encrypted shard found in a corpo trash bin. High-level encryption. Could be trash, could be credits. Sold as-is.',
    images: ['https://picsum.photos/seed/chip/400/300'],
    seller_name: 'Glitch0',
    location: 'Pacifica',
    views: 89,
    created_at: new Date(Date.now() - 200000).toISOString(),
    updated_at: new Date(Date.now() - 200000).toISOString(),
  },
];

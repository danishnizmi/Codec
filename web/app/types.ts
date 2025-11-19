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

// Mock data for development (using high-quality Unsplash images)
export const MOCK_LISTINGS: Listing[] = [
  {
    id: '1',
    title: 'Elite Gaming Rig - Triple 4K Setup',
    price: 3200,
    currency: 'ED',
    category: Category.HARDWARE,
    condition: Condition.LIKE_NEW,
    status: ListingStatus.ACTIVE,
    description: 'Top-tier gaming station with three 4K monitors. RTX 5090, 64GB RAM, liquid-cooled. Built for netrunning and high-intensity data processing. RGB everything. Used for 6 months, upgrading to neural interface.',
    images: ['https://images.unsplash.com/photo-1593508512255-86ab42a8e620?q=80&w=2078&fit=crop'],
    seller_name: 'CyberGamer_X',
    location: 'Corporate Plaza, District 9',
    views: 287,
    created_at: new Date(Date.now() - 3600000).toISOString(),
    updated_at: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: '2',
    title: 'Quantum VR Neural Interface',
    price: 1850,
    currency: 'ED',
    category: Category.CYBERWARE,
    condition: Condition.GOOD,
    status: ListingStatus.ACTIVE,
    description: 'Professional-grade VR headset with direct neural input capability. 8K per eye, 240Hz refresh. Fully sanitized and tested. Compatible with most augmentation systems. Previous owner upgraded to full wetware.',
    images: ['https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?q=80&w=2070&fit=crop'],
    seller_name: 'TechDoc_Morgan',
    location: 'Watson Medical District',
    views: 512,
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '3',
    title: 'Yaiba Kusanagi CT-3X - Street Racer Edition',
    price: 28000,
    currency: 'ED',
    category: Category.VEHICLES,
    condition: Condition.LIKE_NEW,
    status: ListingStatus.ACTIVE,
    description: 'The fastest bike on the streets. Custom neon underglow, enhanced suspension, AI-assisted handling. Top speed 320 km/h. Freshly serviced, bulletproof windshield. Street legal... mostly. Serious buyers only.',
    images: ['https://images.unsplash.com/photo-1558980664-769d59546b3d?q=80&w=2070&fit=crop'],
    seller_name: 'SpeedDemon',
    location: 'Westbrook Garage',
    views: 1024,
    created_at: new Date(Date.now() - 172800000).toISOString(),
    updated_at: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: '4',
    title: 'Encrypted Military-Grade Datashard',
    price: 12000,
    currency: 'ED',
    category: Category.SOFTWARE,
    condition: Condition.NEW,
    status: ListingStatus.ACTIVE,
    description: 'High-level encrypted storage device recovered from a corporate server farm. Mil-spec encryption (AES-2048). Contents unknown. Could contain classified corpo data, could be decoy. Sold as-is. You crack it, you keep it.',
    images: ['https://images.unsplash.com/photo-1518467241265-89ca16a6e58b?q=80&w=2076&fit=crop'],
    seller_name: 'GhostRunner_0',
    location: 'Pacifica, Dead Zone',
    views: 423,
    created_at: new Date(Date.now() - 200000).toISOString(),
    updated_at: new Date(Date.now() - 200000).toISOString(),
  },
  {
    id: '5',
    title: 'Penthouse Suite - Skyline View',
    price: 450000,
    currency: 'ED',
    category: Category.MISC,
    condition: Condition.NEW,
    status: ListingStatus.ACTIVE,
    description: 'Luxury penthouse on the 87th floor. Floor-to-ceiling windows with panoramic city views. Smart home system, bullet-resistant glass, private elevator. 3BR/2BA. Perfect for corpo execs who value discretion.',
    images: ['https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?q=80&w=1587&fit=crop'],
    seller_name: 'RealEstate_AI',
    location: 'City Center, Corporate Zone',
    views: 892,
    created_at: new Date(Date.now() - 259200000).toISOString(),
    updated_at: new Date(Date.now() - 259200000).toISOString(),
  },
  {
    id: '6',
    title: 'Tactical Urban Jacket - Aramid Fiber',
    price: 680,
    currency: 'ED',
    category: Category.CLOTHING,
    condition: Condition.GOOD,
    status: ListingStatus.ACTIVE,
    description: 'High-end tactical jacket with aramid fiber weave. Knife-resistant, water-repellent. Hidden pockets for tech and gear. Size L. Worn for one season. Still looks chrome.',
    images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=2070&fit=crop'],
    seller_name: 'StreetStyle_77',
    location: 'Japantown Market',
    views: 156,
    created_at: new Date(Date.now() - 345600000).toISOString(),
    updated_at: new Date(Date.now() - 345600000).toISOString(),
  },
  {
    id: '7',
    title: 'Cybersecurity Consulting Services',
    price: 500,
    currency: 'ED',
    category: Category.SERVICES,
    condition: Condition.NEW,
    status: ListingStatus.ACTIVE,
    description: 'Ex-corpo netrunner offering security audits, penetration testing, and firewall optimization. 10+ years experience. Discreet, fast, no questions asked. First consultation free.',
    images: ['https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=2070&fit=crop'],
    seller_name: 'SecureNet_Pro',
    location: 'Remote / Night City',
    views: 234,
    created_at: new Date(Date.now() - 432000000).toISOString(),
    updated_at: new Date(Date.now() - 432000000).toISOString(),
  },
  {
    id: '8',
    title: 'Mantis Blades - Militech Series',
    price: 8500,
    currency: 'ED',
    category: Category.WEAPONS,
    condition: Condition.USED,
    status: ListingStatus.ACTIVE,
    description: 'Military-grade retractable arm blades. Mono-wire edged, heat-treated titanium. Some wear on the chrome but fully functional. Installation service available (extra fee). Street certified.',
    images: ['https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&fit=crop'],
    seller_name: 'RipperDoc_Vic',
    location: 'Little China, Clinic',
    views: 678,
    created_at: new Date(Date.now() - 518400000).toISOString(),
    updated_at: new Date(Date.now() - 518400000).toISOString(),
  },
];

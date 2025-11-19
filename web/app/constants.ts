/**
 * CODEX Image Library
 * High-quality Unsplash images curated for each category
 */

export const UNSPLASH_IMAGES = {
  // Electronics & Hardware
  GAMING_SETUP: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?q=80&w=2078&fit=crop',
  LAPTOP_PRO: 'https://images.unsplash.com/photo-1531297420497-35e9c063e659?q=80&w=2070&fit=crop',
  VR_HEADSET: 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?q=80&w=2070&fit=crop',
  SMARTPHONE: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=2080&fit=crop',
  KEYBOARD: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=2065&fit=crop',
  HEADPHONES: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&fit=crop',
  MONITOR: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=2070&fit=crop',
  DRONE: 'https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?q=80&w=2070&fit=crop',

  // Vehicles
  SPORTS_CAR: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=2070&fit=crop',
  MOTORCYCLE: 'https://images.unsplash.com/photo-1558980664-769d59546b3d?q=80&w=2070&fit=crop',
  ELECTRIC_CAR: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=2071&fit=crop',
  LUXURY_SEDAN: 'https://images.unsplash.com/photo-1617469767053-d3b523a0b982?q=80&w=2070&fit=crop',
  BIKE: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=2070&fit=crop',

  // Real Estate
  PENTHOUSE: 'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?q=80&w=1587&fit=crop',
  MODERN_APARTMENT: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&fit=crop',
  LOFT: 'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?q=80&w=2084&fit=crop',
  SKYLINE_VIEW: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=2070&fit=crop',
  STUDIO: 'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?q=80&w=2032&fit=crop',

  // Fashion & Wearables
  LEATHER_JACKET: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=2070&fit=crop',
  TECH_WEAR: 'https://images.unsplash.com/photo-1483118714900-540cf339fd46?q=80&w=2070&fit=crop',
  SNEAKERS: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?q=80&w=2071&fit=crop',
  SMART_WATCH: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?q=80&w=2070&fit=crop',
  SUNGLASSES: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=2080&fit=crop',

  // Cyberware & Weapons (conceptual/tech)
  CYBER_IMPLANT: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&fit=crop',
  TECH_DEVICE: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&fit=crop',
  NEON_TECH: 'https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=2070&fit=crop',
  CIRCUIT_BOARD: 'https://images.unsplash.com/photo-1518467241265-89ca16a6e58a?q=80&w=2076&fit=crop',

  // Services & Misc
  CITY_NIGHT: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?q=80&w=2069&fit=crop',
  NEON_SIGNS: 'https://images.unsplash.com/photo-1573575305309-a856ddc8f2ea?q=80&w=2070&fit=crop',
  URBAN_STREET: 'https://images.unsplash.com/photo-1541515929569-1771522cbaa9?q=80&w=2070&fit=crop',
  WORKSHOP: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=2070&fit=crop',

  // Cyberpunk Aesthetics
  NEON_CITY: 'https://images.unsplash.com/photo-1603732551681-00bc8c1f8ac3?q=80&w=2070&fit=crop',
  RAIN_STREET: 'https://images.unsplash.com/photo-1494145904049-0dca59b4bbad?q=80&w=2070&fit=crop',
  HOLOGRAM: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2070&fit=crop',
};

// Category-specific image mappings
export const CATEGORY_IMAGE_POOL = {
  HARDWARE: [
    UNSPLASH_IMAGES.GAMING_SETUP,
    UNSPLASH_IMAGES.LAPTOP_PRO,
    UNSPLASH_IMAGES.VR_HEADSET,
    UNSPLASH_IMAGES.MONITOR,
    UNSPLASH_IMAGES.KEYBOARD,
    UNSPLASH_IMAGES.DRONE,
  ],
  SOFTWARE: [
    UNSPLASH_IMAGES.CIRCUIT_BOARD,
    UNSPLASH_IMAGES.TECH_DEVICE,
    UNSPLASH_IMAGES.NEON_TECH,
    UNSPLASH_IMAGES.HOLOGRAM,
  ],
  CYBERWARE: [
    UNSPLASH_IMAGES.VR_HEADSET,
    UNSPLASH_IMAGES.SMART_WATCH,
    UNSPLASH_IMAGES.CYBER_IMPLANT,
    UNSPLASH_IMAGES.NEON_TECH,
  ],
  VEHICLES: [
    UNSPLASH_IMAGES.SPORTS_CAR,
    UNSPLASH_IMAGES.MOTORCYCLE,
    UNSPLASH_IMAGES.ELECTRIC_CAR,
    UNSPLASH_IMAGES.LUXURY_SEDAN,
    UNSPLASH_IMAGES.BIKE,
  ],
  WEAPONS: [
    UNSPLASH_IMAGES.TECH_DEVICE,
    UNSPLASH_IMAGES.NEON_TECH,
    UNSPLASH_IMAGES.CIRCUIT_BOARD,
  ],
  CLOTHING: [
    UNSPLASH_IMAGES.LEATHER_JACKET,
    UNSPLASH_IMAGES.TECH_WEAR,
    UNSPLASH_IMAGES.SNEAKERS,
    UNSPLASH_IMAGES.SUNGLASSES,
  ],
  SERVICES: [
    UNSPLASH_IMAGES.WORKSHOP,
    UNSPLASH_IMAGES.CITY_NIGHT,
    UNSPLASH_IMAGES.URBAN_STREET,
  ],
  MISC: [
    UNSPLASH_IMAGES.NEON_SIGNS,
    UNSPLASH_IMAGES.NEON_CITY,
    UNSPLASH_IMAGES.RAIN_STREET,
  ],
};

// Helper function to get a random image for a category
export function getCategoryImage(category: string, index: number = 0): string {
  const pool = CATEGORY_IMAGE_POOL[category as keyof typeof CATEGORY_IMAGE_POOL] || CATEGORY_IMAGE_POOL.MISC;
  return pool[index % pool.length];
}

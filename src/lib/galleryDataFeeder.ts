// src/lib/galleryDataFeeder.ts
// Data feeder for the Visual Gallery component
// Transforms and processes gallery data with optional defaults

import { galleryData, GalleryItem } from '../data/galleryData';

// Default tech-themed placeholder images for projects without images
const defaultImages = [
  "https://images.unsplash.com/photo-1555066931-4365d14bab8c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", // Code on screen
  "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", // Matrix-style
  "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", // Dark code
  "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", // Circuit board
];

export interface ProcessedGalleryItem {
  id: string;
  title: string;
  category: string;
  image: string;
  description: string;
  year: string;
  techStack: string[];
  featured: boolean;
  link?: string;
  videoUrl?: string;
}

/**
 * Process and transform gallery data
 * - Assigns default images if none provided
 * - Ensures required fields exist
 * - Filters out invalid items
 */
export function processGalleryData(): ProcessedGalleryItem[] {
  return galleryData
    .filter((item): item is GalleryItem => {
      // Ensure required fields exist
      return !!(item.id && item.title && item.description);
    })
    .map((item, index) => ({
      ...item,
      // Use provided image or assign default based on index
      image: item.image || defaultImages[index % defaultImages.length],
      // Ensure featured has a default value
      featured: item.featured ?? false,
    }));
}

/**
 * Get gallery items sorted by featured status and year
 */
export function getSortedGalleryItems(): ProcessedGalleryItem[] {
  const items = processGalleryData();
  
  return items.sort((a, b) => {
    // Featured items first
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    
    // Then by year (newest first)
    const yearA = parseInt(a.year) || 0;
    const yearB = parseInt(b.year) || 0;
    return yearB - yearA;
  });
}

/**
 * Get featured gallery items only
 */
export function getFeaturedGalleryItems(): ProcessedGalleryItem[] {
  return getSortedGalleryItems().filter(item => item.featured);
}

/**
 * Get gallery item by ID
 */
export function getGalleryItemById(id: string): ProcessedGalleryItem | undefined {
  return processGalleryData().find(item => item.id === id);
}

/**
 * Get gallery items by category
 */
export function getGalleryItemsByCategory(category: string): ProcessedGalleryItem[] {
  return processGalleryData().filter(item => 
    item.category.toLowerCase().includes(category.toLowerCase())
  );
}
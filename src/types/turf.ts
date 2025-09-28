// Geographic location data for turfs
// Backend: Can be stored as separate location table or embedded JSON
export interface TurfLocation {
  lat: number;                 // Latitude for Google Maps integration
  lng: number;                 // Longitude for Google Maps integration
  address: string;             // Full address for display
  landmark?: string;           // Nearby landmark for easier navigation
  city: string;               // City for location-based filtering
  state: string;              // State for regional operations
  pincode: string;            // Postal code for delivery/service areas
}

// Time slot representation for booking system
// Backend: Generated dynamically based on turf availability rules
export interface TimeSlot {
  id: string;                 // Unique identifier for the slot
  startTime: string;          // Start time in HH:MM format (24-hour)
  endTime: string;            // End time in HH:MM format (24-hour)
  isAvailable: boolean;       // Real-time availability status
  price: number;              // Dynamic pricing based on time/demand
  date: Date;                 // Specific date for this slot
}

// Amenity/facility information
// Backend: Amenities table with predefined list
export interface Amenity {
  id: string;                 // Unique amenity identifier
  name: string;               // Display name (e.g., "Parking", "Washroom")
  icon: string;               // Emoji or icon class for UI
  description?: string;        // Optional detailed description
}

// Main turf entity - core of the platform
// Backend: Primary turfs table with foreign key relationships
export interface Turf {
  id: string;                 // UUID primary key
  name: string;               // Turf/venue name for display
  description: string;        // Detailed description for listing page
  location: TurfLocation;     // Embedded location data
  basePrice: number;          // Base hourly rate in rupees
  sports: string[];           // Array of supported sports
  photos: string[];           // Array of image URLs from cloud storage
  idealPlayers: number;       // Recommended number of players
  amenities: Amenity[];       // Available facilities/amenities
  rating: number;             // Average rating (calculated from reviews)
  totalReviews: number;       // Total number of reviews received
  ownerId: string;            // Foreign key to users table (owner)
  verified: boolean;          // Admin verification status
  createdAt: Date;            // Record creation timestamp
  updatedAt: Date;            // Last modification timestamp
  availability: {
    openTime: string;         // Daily opening time (HH:MM)
    closeTime: string;        // Daily closing time (HH:MM)
    daysOpen: string[];       // Array of open days ["Monday", "Tuesday", ...]
  };
  rules: string[];            // Array of venue rules/policies
  size: {
    length: number;           // Field length dimension
    width: number;            // Field width dimension
    unit: 'ft' | 'm';        // Unit of measurement
  };
}

// Filter criteria for turf search and listing
// Frontend: Used in search forms and API query parameters
export interface TurfFilters {
  sports: string[];           // Filter by supported sports
  priceRange: {              // Price range filter
    min: number;             // Minimum price per hour
    max: number;             // Maximum price per hour
  };
  location: string;          // City/area filter
  rating: number;            // Minimum rating filter
  amenities: string[];       // Required amenities filter
  availability: Date;        // Date availability filter
}
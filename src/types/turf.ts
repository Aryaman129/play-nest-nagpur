export interface TurfLocation {
  lat: number;
  lng: number;
  address: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
}

export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  price: number;
  date: Date;
}

export interface Amenity {
  id: string;
  name: string;
  icon: string;
  description?: string;
}

export interface Turf {
  id: string;
  name: string;
  description: string;
  location: TurfLocation;
  basePrice: number;
  sports: string[];
  photos: string[];
  idealPlayers: number;
  amenities: Amenity[];
  rating: number;
  totalReviews: number;
  ownerId: string;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
  availability: {
    openTime: string;
    closeTime: string;
    daysOpen: string[];
  };
  rules: string[];
  size: {
    length: number;
    width: number;
    unit: 'ft' | 'm';
  };
}

export interface TurfFilters {
  sports: string[];
  priceRange: {
    min: number;
    max: number;
  };
  location: string;
  rating: number;
  amenities: string[];
  availability: Date;
}
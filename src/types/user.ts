export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: 'customer' | 'owner' | 'admin';
  verified: boolean;
  createdAt: Date;
  avatar?: string;
}

export interface UserProfile extends User {
  preferences: {
    sports: string[];
    priceRange: {
      min: number;
      max: number;
    };
    location: string;
  };
  stats: {
    totalBookings: number;
    totalSpent: number;
    favoriteSpots: string[];
  };
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}
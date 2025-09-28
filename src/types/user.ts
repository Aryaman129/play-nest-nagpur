// Core user interface for all user types in the system
// Backend: This maps to your users table schema
export interface User {
  id: string;                    // UUID primary key from database
  email: string;                 // Unique email for authentication
  name: string;                  // Full name for display
  phone: string;                 // Mobile number for OTP/notifications
  role: 'customer' | 'owner' | 'admin';  // Role-based access control
  verified: boolean;             // Email/phone verification status
  createdAt: Date;              // Account creation timestamp
  avatar?: string;              // Optional profile picture URL
}

// Extended user profile with preferences and statistics
// Backend: Additional tables like user_preferences, user_stats
export interface UserProfile extends User {
  preferences: {
    sports: string[];           // Preferred sports for personalized recommendations
    priceRange: {              // Budget preferences for filtering
      min: number;
      max: number;
    };
    location: string;          // Preferred area/city for nearby turfs
  };
  stats: {
    totalBookings: number;     // Lifetime booking count for loyalty programs
    totalSpent: number;        // Total amount spent for VIP status
    favoriteSpots: string[];   // Array of turf IDs for quick booking
  };
}

// Authentication state management for React Context
// Frontend only: Used by AuthContext to manage login state
export interface AuthState {
  user: User | null;           // Currently logged in user or null
  isLoading: boolean;          // Loading state for auth operations
  isAuthenticated: boolean;    // Quick check for auth status
}
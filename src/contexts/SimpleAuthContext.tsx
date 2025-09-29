// Simplified Authentication Context - Quick Fix for Errors
// **BACKEND INTEGRATION**: This will connect to Supabase for user management

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types/user';
import { MOCK_USERS } from '../utils/mockData';

// **DATABASE INTEGRATION TYPES**
export interface AuthState {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
}

export interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  uploadAvatar: (file: File) => Promise<string>;
  setUser: (user: User | null) => void;
  isCustomer: () => boolean;
  isOwner: () => boolean;
  isAdmin: () => boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  phone?: string;
  role: 'customer' | 'owner';
  businessName?: string;
  businessAddress?: string;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// **BACKEND INTEGRATION PROVIDER**
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  console.log('AuthProvider rendering'); // Debug log
  
  // State management
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // **DATABASE INTEGRATION FUNCTION**
  // Initialize auth state on app load
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {    
    try {
      console.log('Initializing auth...'); // Debug log
      
      // **BACKEND INTEGRATION**: Check current auth session
      // const { data: { user } } = await supabase.auth.getUser();
      // if (user) {
      //   const { data: profile } = await supabase
      //     .from('profiles')
      //     .select('*')
      //     .eq('id', user.id)
      //     .single();
      //   setUser(profile);
      // }
      
      // Mock: Check localStorage for demo user
      const savedUser = localStorage.getItem('auth_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
        console.log('User loaded from localStorage'); // Debug log
      }
      
    } catch (err) {
      console.error('Auth initialization error:', err);
    } finally {
      setLoading(false);
    }
  };

  // **DATABASE INTEGRATION FUNCTION**
  // Login user with email/password
  const login = async (email: string, password: string): Promise<void> => {
    try {
      setLoading(true);
      console.log('Login attempt for:', email); // Debug log
      
      // Find user in mock data by email
      const foundUser = MOCK_USERS.find(user => user.email === email);
      if (!foundUser) {
        throw new Error('Invalid email or password');
      }
      
      const mockUser: User = {
        ...foundUser
      };
      
      setUser(mockUser);
      localStorage.setItem('auth_user', JSON.stringify(mockUser));
      console.log('Login successful for:', mockUser.name); // Debug log
      
    } catch (err: any) {
      console.error('Login failed:', err.message); // Debug log
      throw new Error(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  // **DATABASE INTEGRATION FUNCTION**
  // Register new user
  const register = async (userData: RegisterData): Promise<void> => {
    try {
      setLoading(true);
      console.log('Register attempt for:', userData.email); // Debug log
      
      const mockUser: User = {
        id: Date.now().toString(),
        email: userData.email,
        name: userData.name,
        phone: userData.phone,
        role: userData.role || 'customer',
        createdAt: new Date(),
        verified: false
      };
      
      setUser(mockUser);
      localStorage.setItem('auth_user', JSON.stringify(mockUser));
      console.log('Registration successful for:', mockUser.name); // Debug log
      
    } catch (err: any) {
      console.error('Registration failed:', err.message); // Debug log
      throw new Error(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  // **DATABASE INTEGRATION FUNCTION**
  // Logout user
  const logout = async (): Promise<void> => {
    try {
      console.log('Logout initiated'); // Debug log
      
      setUser(null);
      localStorage.removeItem('auth_user');
      console.log('Logout successful'); // Debug log
      
    } catch (err: any) {
      console.error('Logout failed:', err.message); // Debug log
      throw new Error(err.message || 'Logout failed');
    }
  };

  // **DATABASE INTEGRATION FUNCTION**
  // Send password reset email
  const forgotPassword = async (email: string): Promise<void> => {
    try {
      console.log('Password reset requested for:', email); // Debug log
    } catch (err: any) {
      console.error('Password reset failed:', err.message); // Debug log
      throw new Error(err.message || 'Password reset failed');
    }
  };

  // **DATABASE INTEGRATION FUNCTION**
  // Reset password with token
  const resetPassword = async (token: string, newPassword: string): Promise<void> => {
    try {
      console.log('Password reset with token'); // Debug log
    } catch (err: any) {
      console.error('Password reset failed:', err.message); // Debug log
      throw new Error(err.message || 'Password reset failed');
    }
  };

  // **DATABASE INTEGRATION FUNCTION**
  // Update user profile
  const updateProfile = async (userData: Partial<User>): Promise<void> => {
    try {
      if (!user) throw new Error('No user logged in');
      
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('auth_user', JSON.stringify(updatedUser));
      console.log('Profile updated successfully'); // Debug log
      
    } catch (err: any) {
      console.error('Profile update failed:', err.message); // Debug log
      throw new Error(err.message || 'Profile update failed');
    }
  };

  // **DATABASE INTEGRATION FUNCTION**
  // Upload user avatar
  const uploadAvatar = async (file: File): Promise<string> => {
    try {
      if (!user) throw new Error('No user logged in');
      
      // Mock avatar URL
      const mockUrl = '/placeholder-avatar.jpg';
      console.log('Avatar uploaded successfully'); // Debug log
      
      return mockUrl;
      
    } catch (err: any) {
      console.error('Avatar upload failed:', err.message); // Debug log
      throw new Error(err.message || 'Avatar upload failed');
    }
  };

  // Role checking functions
  const isCustomer = () => user?.role === 'customer';
  const isOwner = () => user?.role === 'owner';
  const isAdmin = () => user?.role === 'admin';

  // Context value
  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    updateProfile,
    uploadAvatar,
    setUser,
    isCustomer,
    isOwner,
    isAdmin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// **PROTECTED ROUTE COMPONENT**
export interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'customer' | 'owner' | 'admin';
  fallback?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  fallback = <div>Access denied</div>
}) => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <div>Please login to access this page</div>;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return fallback;
  }

  return <>{children}</>;
};
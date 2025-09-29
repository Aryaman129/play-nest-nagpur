// Authentication Context - Phase 5 Implementation
// **BACKEND INTEGRATION**: This will connect to Supabase for user management

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAppToast } from '@/components/common/Toast';
import { User } from '../types/user';
import { MOCK_USERS } from '../utils/mockData';

// **DATABASE INTEGRATION TYPES**
export interface AuthState {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
}

export interface AuthContextType extends AuthState {
  // Authentication actions
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  
  // Profile actions
  updateProfile: (userData: Partial<User>) => Promise<void>;
  uploadAvatar: (file: File) => Promise<string>;
  
  // Role-based checks
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
  // Owner-specific fields
  businessName?: string;
  businessAddress?: string;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// **BACKEND INTEGRATION PROVIDER**
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { success, error } = useAppToast();
  
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
      setLoading(true);
      
      // TODO: Replace with Supabase auth check
      // const { data: { user } } = await supabase.auth.getUser();
      // if (user) {
      //   const { data: profile } = await supabase
      //     .from('profiles')
      //     .select('*')
      //     .eq('id', user.id)
      //     .single();
      //   setUser(profile);
      // }
      
      // Mock implementation - check localStorage for demo
      const savedUser = localStorage.getItem('demoUser');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      
    } catch (err) {
      console.error('Auth initialization error:', err);
    } finally {
      setLoading(false);
    }
  };

  // **DATABASE INTEGRATION FUNCTION**
  // User login with email and password
  const login = async (email: string, password: string): Promise<void> => {
    try {
      setLoading(true);
      
      // TODO: Replace with Supabase authentication
      // const { data, error } = await supabase.auth.signInWithPassword({
      //   email,
      //   password,
      // });
      // if (error) throw error;
      
      // Mock implementation for demo
      // TODO: Replace with proper user lookup from database
      // const { data: user } = await supabase.from('profiles').select('*').eq('email', email).single();
      
      // Find user in mock data by email
      const foundUser = MOCK_USERS.find(user => user.email === email);
      if (!foundUser) {
        throw new Error('Invalid email or password');
      }
      
      // In real implementation, verify password hash
      // const isPasswordValid = await bcrypt.compare(password, user.password_hash);
      // if (!isPasswordValid) throw new Error('Invalid email or password');
      
      const mockUser: User = {
        ...foundUser
      };
      
      setUser(mockUser);
      localStorage.setItem('demoUser', JSON.stringify(mockUser));
      success('Login successful', 'Welcome back!');
      
    } catch (err: any) {
      error('Login failed', err.message || 'Invalid credentials');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // **DATABASE INTEGRATION FUNCTION**
  // User registration
  const register = async (userData: RegisterData): Promise<void> => {
    try {
      setLoading(true);
      
      // TODO: Replace with Supabase authentication and profile creation
      // const { data, error } = await supabase.auth.signUp({
      //   email: userData.email,
      //   password: userData.password,
      // });
      // if (error) throw error;
      
      // Create user profile
      // const { error: profileError } = await supabase
      //   .from('profiles')
      //   .insert([{
      //     id: data.user?.id,
      //     email: userData.email,
      //     name: userData.name,
      //     phone: userData.phone,
      //     role: userData.role,
      //     business_name: userData.businessName,
      //     business_address: userData.businessAddress,
      //   }]);
      // if (profileError) throw profileError;
      
      // Mock implementation for demo
      const newUser: User = {
        id: Date.now().toString(),
        email: userData.email,
        name: userData.name,
        phone: userData.phone,
        role: userData.role || 'customer',
        createdAt: new Date(),
        verified: false
      };
      
      setUser(newUser);
      localStorage.setItem('demoUser', JSON.stringify(newUser));
      success('Registration successful', 'Please check your email to verify your account');
      
    } catch (err: any) {
      error('Registration failed', err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // **DATABASE INTEGRATION FUNCTION**
  // User logout
  const logout = async (): Promise<void> => {
    try {
      // TODO: Replace with Supabase logout
      // const { error } = await supabase.auth.signOut();
      // if (error) throw error;
      
      setUser(null);
      localStorage.removeItem('demoUser');
      success('Logged out successfully');
      
    } catch (err: any) {
      error('Logout failed', err.message);
      throw err;
    }
  };

  // **DATABASE INTEGRATION FUNCTION**
  // Forgot password
  const forgotPassword = async (email: string): Promise<void> => {
    try {
      // TODO: Replace with Supabase password reset
      // const { error } = await supabase.auth.resetPasswordForEmail(email, {
      //   redirectTo: `${window.location.origin}/reset-password`,
      // });
      // if (error) throw error;
      
      success('Password reset sent', 'Check your email for reset instructions');
      
    } catch (err: any) {
      error('Failed to send reset email', err.message);
      throw err;
    }
  };

  // **DATABASE INTEGRATION FUNCTION**
  // Reset password with token
  const resetPassword = async (token: string, newPassword: string): Promise<void> => {
    try {
      // TODO: Replace with Supabase password update
      // const { error } = await supabase.auth.updateUser({
      //   password: newPassword
      // });
      // if (error) throw error;
      
      success('Password reset successful', 'You can now login with your new password');
      
    } catch (err: any) {
      error('Password reset failed', err.message);
      throw err;
    }
  };

  // **DATABASE INTEGRATION FUNCTION**
  // Update user profile
  const updateProfile = async (userData: Partial<User>): Promise<void> => {
    try {
      if (!user) throw new Error('No user logged in');
      
      // TODO: Replace with Supabase profile update
      // const { error } = await supabase
      //   .from('profiles')
      //   .update(userData)
      //   .eq('id', user.id);
      // if (error) throw error;
      
      const updatedUser = { ...user, ...userData, updatedAt: new Date() };
      setUser(updatedUser);
      localStorage.setItem('demoUser', JSON.stringify(updatedUser));
      success('Profile updated successfully');
      
    } catch (err: any) {
      error('Profile update failed', err.message);
      throw err;
    }
  };

  // **DATABASE INTEGRATION FUNCTION**
  // Upload user avatar
  const uploadAvatar = async (file: File): Promise<string> => {
    try {
      if (!user) throw new Error('No user logged in');
      
      // TODO: Replace with Supabase storage upload
      // const fileExt = file.name.split('.').pop();
      // const fileName = `${user.id}.${fileExt}`;
      // const { error: uploadError } = await supabase.storage
      //   .from('avatars')
      //   .upload(fileName, file, { upsert: true });
      // if (uploadError) throw uploadError;
      
      // const { data: { publicUrl } } = supabase.storage
      //   .from('avatars')
      //   .getPublicUrl(fileName);
      
      // Mock implementation
      const mockUrl = URL.createObjectURL(file);
      await updateProfile({ avatar: mockUrl });
      
      return mockUrl;
      
    } catch (err: any) {
      error('Avatar upload failed', err.message);
      throw err;
    }
  };

  // Role-based helper functions
  const isCustomer = () => user?.role === 'customer';
  const isOwner = () => user?.role === 'owner';
  const isAdmin = () => user?.role === 'admin';

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

// Protected route component
export const ProtectedRoute: React.FC<{
  children: React.ReactNode;
  requiredRole?: 'customer' | 'owner' | 'admin';
  fallback?: React.ReactNode;
}> = ({ children, requiredRole, fallback = <div>Access denied</div> }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    return <div className="flex justify-center items-center min-h-screen">Please login to continue</div>;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
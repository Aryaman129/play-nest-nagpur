import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState } from '@/types';
import { authService } from '@/services/auth';

// Authentication context interface for React Context API
// Provides authentication state and methods to all components
interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<void>;  // Login function
  signUp: (userData: {                                         // Registration function
    name: string;
    email: string;
    phone: string;
    password: string;
    role?: 'customer' | 'owner';                               // Optional role selection
  }) => Promise<void>;
  signOut: () => Promise<void>;                                // Logout function
  checkRole: (role: 'customer' | 'owner' | 'admin') => boolean; // Role validation
  hasAnyRole: (roles: Array<'customer' | 'owner' | 'admin'>) => boolean; // Multi-role check
  setUser: (user: User | null) => void;                        // Manual user update
}

// Create React Context for authentication state
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to access authentication context
// Usage: const { user, signIn, signOut } = useAuth();
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Props interface for AuthProvider component
interface AuthProviderProps {
  children: ReactNode;  // Child components that need access to auth state
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const user = authService.getCurrentUser();
        const isAuthenticated = authService.isAuthenticated();
        
        setAuthState({
          user,
          isLoading: false,
          isAuthenticated,
        });
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        setAuthState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
        });
      }
    };

    initializeAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      const response = await authService.signIn(email, password);
      
      setAuthState({
        user: response.data.user,
        isLoading: false,
        isAuthenticated: true,
      });
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const signUp = async (userData: {
    name: string;
    email: string;
    phone: string;
    password: string;
    role?: 'customer' | 'owner';
  }) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      const response = await authService.signUp(userData);
      
      setAuthState({
        user: response.data.user,
        isLoading: false,
        isAuthenticated: true,
      });
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const signOut = async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      await authService.signOut();
      
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
    } catch (error) {
      console.error('Sign out error:', error);
      // Force sign out even if API call fails
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
    }
  };

  const checkRole = (role: 'customer' | 'owner' | 'admin'): boolean => {
    return authState.user?.role === role;
  };

  const hasAnyRole = (roles: Array<'customer' | 'owner' | 'admin'>): boolean => {
    return authState.user ? roles.includes(authState.user.role) : false;
  };

  const setUser = (user: User | null) => {
    setAuthState(prev => ({
      ...prev,
      user,
      isAuthenticated: !!user,
    }));
  };

  const value: AuthContextType = {
    ...authState,
    signIn,
    signUp,
    signOut,
    checkRole,
    hasAnyRole,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
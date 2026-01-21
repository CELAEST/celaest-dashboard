'use client'

// Authentication Context for CELAEST with Supabase
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';

export interface UserScopes {
  'templates:write'?: boolean;
  'templates:read'?: boolean;
  'billing:read'?: boolean;
  'billing:write'?: boolean;
  'users:manage'?: boolean;
  'analytics:read'?: boolean;
  'releases:write'?: boolean;
  'releases:read'?: boolean;
  'marketplace:purchase'?: boolean;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  role: 'super_admin' | 'admin' | 'client';
  scopes: UserScopes;
}

interface UserMetadata {
  name?: string;
  role?: 'super_admin' | 'admin' | 'client';
  scopes?: UserScopes;
}

interface AuthResult {
  success: boolean;
  error?: string;
}

interface SignInResult extends AuthResult {
  warning?: string;
  attemptsRemaining?: number;
  remainingMinutes?: number;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<SignInResult>;
  signUp: (email: string, password: string, name: string) => Promise<AuthResult>;
  signInWithGoogle: (isSignUp?: boolean) => Promise<AuthResult>;
  signInWithGitHub: () => Promise<AuthResult>;
  signOut: () => Promise<void>;
  hasScope: (scope: keyof UserScopes) => boolean;
  isAdmin: () => boolean;
  isSuperAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unexpected error occurred';
};

const mapSupabaseUser = (
  supabaseUser: SupabaseUser | null, 
  metadata?: Partial<UserMetadata>
): User | null => {
  if (!supabaseUser) {
    return null;
  }

  const userRole = (metadata?.role || supabaseUser.user_metadata?.role || 'client') as User['role'];
  
  const defaultScopes: UserScopes = userRole === 'super_admin' ? {
    'templates:write': true,
    'templates:read': true,
    'billing:read': true,
    'billing:write': true,
    'users:manage': true,
    'analytics:read': true,
    'releases:write': true,
    'releases:read': true,
    'marketplace:purchase': true,
  } : userRole === 'admin' ? {
    'templates:read': true,
    'billing:read': true,
    'analytics:read': true,
    'releases:read': true,
    'marketplace:purchase': true,
  } : {
    'marketplace:purchase': true,
  };

  const userName = metadata?.name 
    || supabaseUser.user_metadata?.name 
    || supabaseUser.email?.split('@')[0] 
    || '';

  return {
    id: supabaseUser.id,
    email: supabaseUser.email || '',
    name: userName,
    role: userRole,
    scopes: metadata?.scopes || supabaseUser.user_metadata?.scopes || defaultScopes,
  };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          setUser(mapSupabaseUser(session.user));
        }
      } catch (error) {
        console.error('Session check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ? mapSupabaseUser(session.user) : null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string): Promise<SignInResult> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { 
          success: false, 
          error: error.message,
        };
      }

      if (data.user) {
        setUser(mapSupabaseUser(data.user));
      }

      return { success: true };
    } catch (error) {
      console.error('Sign in error:', error);
      return { 
        success: false, 
        error: getErrorMessage(error),
      };
    }
  };

  const signUp = async (email: string, password: string, name: string): Promise<AuthResult> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role: 'client',
          }
        }
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        setUser(mapSupabaseUser(data.user, { name, role: 'client' }));
        return { success: true };
      }

      return { success: false, error: 'Sign up failed' };
    } catch (error) {
      console.error('Sign up error:', error);
      return { 
        success: false, 
        error: getErrorMessage(error),
      };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const signInWithGoogle = async (isSignUp: boolean = false): Promise<AuthResult> => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}`,
          queryParams: isSignUp ? {
            prompt: 'select_account', 
          } : undefined,
        }
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Google sign in error:', error);
      return { 
        success: false, 
        error: getErrorMessage(error),
      };
    }
  };

  const signInWithGitHub = async (): Promise<AuthResult> => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}`,
        }
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('GitHub sign in error:', error);
      return { 
        success: false, 
        error: getErrorMessage(error),
      };
    }
  };

  const hasScope = (scope: keyof UserScopes): boolean => {
    return user?.scopes[scope] === true;
  };

  const isAdmin = (): boolean => {
    return user?.role === 'admin' || user?.role === 'super_admin';
  };

  const isSuperAdmin = (): boolean => {
    return user?.role === 'super_admin';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signInWithGoogle,
        signInWithGitHub,
        signOut,
        hasScope,
        isAdmin,
        isSuperAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

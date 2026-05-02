import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface User {
  id: string;
  email: string;
  name?: string;
  role: 'ADMIN' | 'AGENCY' | 'USER';
  verification_status?: 'PENDING' | 'APPROVED' | 'REJECTED';
  avatar_url?: string;
  cover_url?: string;
  bio?: string;
  phone?: string;
  business_name?: string;
  license_number?: string;
}

interface AuthContextType {
  user: User | null;
  session: any | null;
  isLoading: boolean;
  login: (user: User) => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const setFallbackUser = (supabaseUser: SupabaseUser) => {
    setUser({
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      name: supabaseUser.user_metadata?.name || 'User',
      role: (supabaseUser.user_metadata?.role as any) || 'USER',
      verification_status: 'APPROVED',
    });
  };

  const fetchProfile = async (supabaseUser: SupabaseUser) => {
    let completed = false;

    // Safety timeout: If DB doesn't respond in 3 seconds, use fallback and proceed
    const timeoutId = setTimeout(() => {
      if (!completed) {
        console.warn('Profile fetch timed out. Using fallback metadata.');
        setFallbackUser(supabaseUser);
        setIsLoading(false);
      }
    }, 3000);

    try {
      console.log('Fetching profile for:', supabaseUser.id);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      completed = true;
      clearTimeout(timeoutId);

      if (error) {
        console.warn('Profile fetch error (using metadata):', error.message);
        setFallbackUser(supabaseUser);
      } else {
        console.log('Profile loaded successfully');
        setUser({
          id: data.id,
          email: data.email,
          name: data.name,
          role: data.role,
          verification_status: data.verification_status,
          avatar_url: data.avatar_url,
          cover_url: data.cover_url,
          bio: data.bio,
          phone: data.phone,
          business_name: data.business_name,
          license_number: data.license_number,
        });
      }
    } catch (err) {
      console.error('Critical Auth Error:', err);
      if (!completed) setFallbackUser(supabaseUser);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        if (!mounted) return;

        setSession(initialSession);
        if (initialSession) {
          await fetchProfile(initialSession.user);
        } else {
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Auth initialization failed:', err);
        if (mounted) setIsLoading(false);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      if (!mounted) return;
      
      console.log('Auth state changed:', _event);
      setSession(newSession);
      if (newSession) {
        await fetchProfile(newSession.user);
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = async () => {
    setIsLoading(true);
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setIsLoading(false);
  };

  const refreshUser = async () => {
    if (session?.user) {
      await fetchProfile(session.user);
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, isLoading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

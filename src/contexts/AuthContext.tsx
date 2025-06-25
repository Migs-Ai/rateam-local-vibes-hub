
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string, whatsapp?: string, metadata?: any) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signInWithGoogle: () => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  isVendor: boolean;
  userRoles: string[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Fetch user roles after setting session
          setTimeout(async () => {
            await fetchUserRoles(session.user.id);
          }, 0);
        } else {
          setUserRoles([]);
        }
        
        setLoading(false);
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserRoles(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserRoles = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId);
      
      if (error) {
        console.error('Error fetching user roles:', error);
        return;
      }
      
      setUserRoles(data?.map(r => r.role) || []);
    } catch (error) {
      console.error('Error fetching user roles:', error);
    }
  };

  const getRoleBasedRedirectPath = (roles: string[]) => {
    if (roles.includes('admin')) {
      return '/admin-dashboard';
    }
    if (roles.includes('vendor')) {
      return '/vendor-dashboard';
    }
    return '/user-dashboard';
  };

  const signUp = async (email: string, password: string, fullName: string, whatsapp?: string, metadata?: any) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName,
          whatsapp: whatsapp,
          ...metadata
        }
      }
    });

    if (error) {
      toast({
        title: "Sign up failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      // If it's a vendor signup, create vendor profile
      if (metadata?.user_type === 'vendor' && data.user) {
        setTimeout(async () => {
          try {
            const { error: vendorError } = await supabase
              .from('vendors')
              .insert({
                user_id: data.user!.id,
                business_name: metadata.business_name,
                category: metadata.category,
                location: metadata.location,
                phone: metadata.phone,
                whatsapp: whatsapp,
                email: email,
                status: 'pending'
              });

            if (vendorError) {
              console.error('Error creating vendor profile:', vendorError);
            }
          } catch (err) {
            console.error('Error in vendor profile creation:', err);
          }
        }, 1000);
      }

      toast({
        title: "Account created!",
        description: "Please check your email to verify your account.",
      });
    }

    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast({
        title: "Sign in failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      // Wait for roles to be fetched before redirecting
      setTimeout(async () => {
        if (user) {
          const { data } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', user.id);
          
          const roles = data?.map(r => r.role) || [];
          const redirectPath = getRoleBasedRedirectPath(roles);
          
          toast({
            title: "Welcome back!",
            description: "You have been signed in successfully.",
          });
          
          // Navigate to role-based dashboard
          window.location.href = redirectPath;
        }
      }, 1000);
    }

    return { error };
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`
      }
    });

    if (error) {
      toast({
        title: "Google sign in failed",
        description: error.message,
        variant: "destructive",
      });
    }

    return { error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Sign out failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Signed out successfully",
        description: "You have been logged out.",
      });
    }
  };

  const isAdmin = userRoles.includes('admin');
  const isVendor = userRoles.includes('vendor');

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      signUp,
      signIn,
      signInWithGoogle,
      signOut,
      isAdmin,
      isVendor,
      userRoles
    }}>
      {children}
    </AuthContext.Provider>
  );
};

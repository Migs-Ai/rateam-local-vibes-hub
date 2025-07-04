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
  userType: 'user' | 'vendor' | null;
  vendorProfile: any;
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
  const [userType, setUserType] = useState<'user' | 'vendor' | null>(null);
  const [vendorProfile, setVendorProfile] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Use setTimeout to defer Supabase calls to prevent deadlocks
          setTimeout(() => {
            fetchUserData(session.user.id);
          }, 0);
        } else {
          setUserRoles([]);
          setUserType(null);
          setVendorProfile(null);
        }
        
        setLoading(false);
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserData(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserData = async (userId: string) => {
    try {
      console.log('Fetching user data for:', userId);
      
      // Fetch user roles
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId);
      
      if (rolesError) {
        console.error('Error fetching user roles:', rolesError);
      } else {
        const roles = rolesData?.map(r => r.role) || [];
        console.log('User roles:', roles);
        setUserRoles(roles);
      }

      // Check if user is a vendor by looking for vendor profile
      const { data: vendorData, error: vendorError } = await supabase
        .from('vendors')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (vendorError && vendorError.code !== 'PGRST116') {
        console.error('Error fetching vendor profile:', vendorError);
      } else if (vendorData) {
        console.log('Vendor profile found:', vendorData);
        setUserType('vendor');
        setVendorProfile(vendorData);
        
        // Ensure vendor role is set
        if (!rolesData?.some(r => r.role === 'vendor')) {
          await supabase
            .from('user_roles')
            .insert({ user_id: userId, role: 'vendor' });
          setUserRoles(prev => [...prev, 'vendor']);
        }
      } else {
        // No vendor profile found, user is a regular user
        setUserType('user');
        setVendorProfile(null);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
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
    } else if (data.user) {
      // If it's a vendor signup, create vendor profile immediately
      if (metadata?.user_type === 'vendor') {
        try {
          // Create vendor profile
          const { error: vendorError } = await supabase
            .from('vendors')
            .insert({
              user_id: data.user.id,
              business_name: metadata.business_name,
              category: metadata.category,
              location: metadata.location,
              phone: metadata.phone,
              whatsapp: whatsapp,
              email: email,
              description: metadata.description,
              preferred_contact: metadata.preferred_contact,
              status: 'pending'
            });

          if (vendorError) {
            console.error('Error creating vendor profile:', vendorError);
            toast({
              title: "Vendor profile creation failed",
              description: "Your account was created but vendor profile setup failed. Please contact support.",
              variant: "destructive",
            });
          } else {
            // Assign vendor role
            await supabase
              .from('user_roles')
              .insert({
                user_id: data.user.id,
                role: 'vendor'
              });

            toast({
              title: "Vendor account created!",
              description: "Please check your email to verify your account. Your vendor profile will be reviewed by our admin team.",
            });
          }
        } catch (err) {
          console.error('Error in vendor profile creation:', err);
          toast({
            title: "Setup incomplete",
            description: "Account created but vendor setup failed. Please contact support.",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Account created!",
          description: "Please check your email to verify your account.",
        });
      }
    }

    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
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
      toast({
        title: "Welcome back!",
        description: "You have been signed in successfully.",
      });
    }

    return { error, data };
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

  const isAdmin = userRoles.includes('admin') || userRoles.includes('super_admin');
  const isVendor = userRoles.includes('vendor') || userType === 'vendor';

  console.log('Current user roles:', userRoles);
  console.log('User type:', userType);
  console.log('Is admin:', isAdmin);
  console.log('Is vendor:', isVendor);

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
      userRoles,
      userType,
      vendorProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};
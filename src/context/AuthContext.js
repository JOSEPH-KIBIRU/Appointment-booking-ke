'use client';

import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from '../../utils/supabaseClient';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [signingOut, setSigningOut] = useState(false);
  const redirectTimeoutRef = useRef(null);

  // Clear any pending timeouts on unmount
  useEffect(() => {
    return () => {
      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (mounted) {
          setUser(session?.user ?? null);
          
          if (session?.user) {
            await fetchUserProfile(session.user.id);
          }
          setLoading(false);
        }
      } catch (error) {
        console.error('Session error:', error);
        if (mounted) setLoading(false);
      }
    };

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        console.log('Auth event:', event, session?.user?.email);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchUserProfile(session.user.id);
        } else {
          setUserProfile(null);
        }
        setLoading(false);
      }
    );

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  const fetchUserProfile = useCallback(async (userId) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
      }

      if (data) {
        setUserProfile(data);
        return;
      }

      // If no profile exists, create one from auth metadata
      const { data: userData } = await supabase.auth.getUser();
      
      if (userData?.user) {
        const { data: newProfile, error: insertError } = await supabase
          .from('users')
          .insert({
            id: userId,
            email: userData.user.email,
            full_name: userData.user.user_metadata?.full_name || 
                       userData.user.email?.split('@')[0] || 
                       'User',
            phone: userData.user.user_metadata?.phone || '',
            role: userData.user.user_metadata?.role || 'client',
          })
          .select()
          .single();

        if (insertError) {
          console.error('Error creating profile:', insertError);
        } else {
          setUserProfile(newProfile);
        }
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
    }
  }, []);

  const signInWithEmail = async (email) => {
    try {
      const { data, error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          shouldCreateUser: true,
        }
      });

      if (error) throw error;
      
      return { success: true, data };
    } catch (error) {
      console.error('Email sign in error:', error);
      return { success: false, error: error.message };
    }
  };

  const verifyEmailOTP = async (email, token) => {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: email,
        token: token,
        type: 'email',
      });

      if (error) throw error;
      
      return { success: true, data };
    } catch (error) {
      console.error('Email verification error:', error);
      return { success: false, error: error.message };
    }
  };

  const registerWithEmail = async (email, otp, profileData) => {
    try {
      const verifyResult = await verifyEmailOTP(email, otp);
      if (!verifyResult.success) {
        throw new Error(verifyResult.error);
      }

      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error('User not found after verification');
      }

      await supabase.auth.updateUser({
        data: {
          full_name: profileData.full_name,
          phone: profileData.phone || '',
          role: profileData.role || 'client',
        }
      });

      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('id', user.id)
        .maybeSingle();

      if (existingUser) {
        await supabase
          .from('users')
          .update({
            full_name: profileData.full_name,
            phone: profileData.phone || '',
            role: profileData.role || 'client',
          })
          .eq('id', user.id);
      } else {
        await supabase
          .from('users')
          .insert({
            id: user.id,
            email: email,
            full_name: profileData.full_name,
            phone: profileData.phone || '',
            role: profileData.role || 'client',
          });
      }
      
      await fetchUserProfile(user.id);

      return { success: true, data: user };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: error.message };
    }
  };

  const updateUserProfile = async (updates) => {
    if (!user) throw new Error('No user logged in');

    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      
      setUserProfile(data);
      return { success: true, data };
    } catch (error) {
      console.error('Update profile error:', error);
      return { success: false, error: error.message };
    }
  };

  const signOut = async () => {
    // Prevent multiple simultaneous sign-out attempts
    if (signingOut) return { success: false, error: 'Already signing out' };
    
    setSigningOut(true);
    
    try {
      // Clear any pending redirects
      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current);
        redirectTimeoutRef.current = null;
      }

      // Clear local state immediately for better UX
      setUser(null);
      setUserProfile(null);
      
      // Attempt to sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Sign out error:', error);
      }
      
      // Force a hard redirect to clear any stale state
      window.location.href = '/';
      
      return { success: true };
    } catch (error) {
      console.error('Sign out error:', error);
      setSigningOut(false);
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    signingOut,
    signInWithEmail,
    verifyEmailOTP,
    registerWithEmail,
    updateUserProfile,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
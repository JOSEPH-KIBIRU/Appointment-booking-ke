'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../../utils/supabaseClient';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await fetchUserProfile(session.user.id);
      }
      setLoading(false);
    };

    getInitialSession();

    // Listen for auth changes + role-based redirect
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // console.log('Auth event:', event, session?.user?.email);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchUserProfile(session.user.id);

          // ────────────────────────────────────────────────
          // Redirect based on user role after profile is loaded
          if (userProfile?.role === 'business') {
            // Small delay to let UI show success message or avoid flicker
            setTimeout(() => {
              window.location.href = '/business/dashboard';
            }, 500);
          } else if (userProfile?.role === 'client') {
            // Normal users go to home / landing page
            setTimeout(() => {
              window.location.href = '/';
            }, 500);
          }
          // ────────────────────────────────────────────────
        } else {
          setUserProfile(null);
        }
        setLoading(false);
      }
    );

    return () => subscription?.unsubscribe();
  }, []);

 const fetchUserProfile = async (userId) => {
  try {
    console.log('Fetching profile for user:', userId);
    
    // Try to get existing profile
    let { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching profile:', error);
    }

    // If profile exists, use it
    if (data) {
      // console.log('✅ Profile found:', data);
      setUserProfile(data);
      return;
    }

    // If no profile exists, get user data from auth and create it
    // console.log('No profile found, creating one from auth data');
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
        // console.log('✅ Profile created:', newProfile);
        setUserProfile(newProfile);
      }
    }
  } catch (error) {
    console.error('Error in fetchUserProfile:', error);
  }
};

  const signInWithEmail = async (email) => {
    try {
      // console.log('📧 Signing in with email:', email);
      
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
    // console.log('📝 Registering user with email:', email);
    
    // Verify OTP
    const verifyResult = await verifyEmailOTP(email, otp);
    if (!verifyResult.success) {
      throw new Error(verifyResult.error);
    }

    // Get authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      throw new Error('User not found after verification');
    }

    // console.log('✅ User authenticated with ID:', user.id);

    // Update user metadata
    const { error: updateError } = await supabase.auth.updateUser({
      data: {
        full_name: profileData.full_name,
        phone: profileData.phone || '',
        role: profileData.role || 'client',
      }
    });

    if (updateError) throw updateError;

    // Check if user exists in public.users
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('id', user.id)
      .maybeSingle();

    let profileResult;
    
    if (existingUser) {
      // Update existing profile
      const { data, error } = await supabase
        .from('users')
        .update({
          full_name: profileData.full_name,
          phone: profileData.phone || '',
          role: profileData.role || 'client',
        })
        .eq('id', user.id)
        .select()
        .single();
        
      if (error) throw error;
      profileResult = data;
    } else {
      // Create new profile
      const { data, error } = await supabase
        .from('users')
        .insert({
          id: user.id,
          email: email,
          full_name: profileData.full_name,
          phone: profileData.phone || '',
          role: profileData.role || 'client',
        })
        .select()
        .single();

      if (error) throw error;
      profileResult = data;
    }

    // console.log('✅ Profile saved:', profileResult);
    
    // Fetch the updated profile
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
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      setUserProfile(null);
      
      return { success: true };
    } catch (error) {
      console.error('Sign out error:', error);
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    userProfile,
    loading,
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
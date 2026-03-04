'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '../../utils/supabaseClient';

export default function LoginModal({ isOpen, onClose }) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);

  if (!isOpen) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      const { data: userData, error: profileError } = await supabase
        .from('users')
        .select('status, role, subscription_end')
        .eq('id', data.user.id)
        .single();

      if (profileError) throw profileError;

      if (userData?.status === 'pending') {
        await supabase.auth.signOut();
        setMessage('⏳ Your account is pending approval. Please wait for admin confirmation.');
        setLoading(false);
        return;
      }

      if (userData?.status === 'rejected') {
        await supabase.auth.signOut();
        setMessage('❌ Your registration was rejected. Please contact support.');
        setLoading(false);
        return;
      }

      if (userData?.status === 'suspended') {
        await supabase.auth.signOut();
        setMessage('🚫 Your account has been suspended. Please contact support.');
        setLoading(false);
        return;
      }

      if (userData?.subscription_end && new Date(userData.subscription_end) < new Date()) {
        await supabase.auth.signOut();
        setMessage('⏰ Your subscription has expired. Please renew to continue.');
        setLoading(false);
        return;
      }

      setMessage('✅ Login successful!');
      setTimeout(() => {
        onClose();
        window.location.reload();
      }, 1000);

    } catch (error) {
      console.error('Login error:', error);
      setMessage(`❌ ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      setResetSent(true);
      setMessage('✅ Password reset email sent! Check your inbox.');
    } catch (error) {
      setMessage(`❌ ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 relative shadow-xl dark:shadow-gray-900/50">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          {showForgotPassword ? 'Reset Password' : 'Sign In'}
        </h2>
        
        {!showForgotPassword ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
                required
              />
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-sm text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 transition-colors"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Enter your email address and we'll send you a link to reset your password.
            </p>
            
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
                required
              />
            </div>

            {resetSent && (
              <div className="p-3 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 rounded-lg text-center">
                ✅ Reset link sent! Check your email.
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowForgotPassword(false);
                  setResetSent(false);
                  setResetEmail('');
                }}
                className="flex-1 bg-gray-500 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-500 text-white font-bold py-3 px-4 rounded-lg transition-colors"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg disabled:opacity-50 transition-colors"
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </div>
          </form>
        )}

        {message && (
          <div className={`mt-4 p-3 rounded-lg text-center transition-colors ${
            message.includes('✅') 
              ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300' 
              : message.includes('❌') 
                ? 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300'
                : 'bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300'
          }`}>
            {message}
          </div>
        )}

        {!showForgotPassword && (
          <p className="text-center text-gray-600 dark:text-gray-400 mt-4">
            Don't have an account?{' '}
            <button
              onClick={() => {
                onClose();
                window.location.href = '/register';
              }}
              className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 font-medium transition-colors"
            >
              Request Access
            </button>
          </p>
        )}
      </div>
    </div>
  );
}
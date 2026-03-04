'use client';

import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, userProfile, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      window.location.href = '/login';
    }
    
    if (!loading && user && allowedRoles.length > 0) {
      if (!allowedRoles.includes(userProfile?.role)) {
        window.location.href = '/';
      }
    }
  }, [user, userProfile, loading, allowedRoles]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(userProfile?.role)) {
    return null;
  }

  return children;
}
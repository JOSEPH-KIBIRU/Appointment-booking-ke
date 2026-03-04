'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '../../../../utils/supabaseClient';
import { useRouter } from 'next/navigation';

export default function AdminDashboardPage() {
  const { user, userProfile, loading: authLoading } = useAuth();
  const router = useRouter();
  const [pendingUsers, setPendingUsers] = useState([]);
  const [approvedUsers, setApprovedUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login');
        return;
      }

      if (userProfile?.role !== 'admin') {
        router.push('/');
        return;
      }

      fetchData();
    }
  }, [user, userProfile, authLoading]);

  const fetchData = async () => {
    try {
      // Fetch users with status = 'pending'
      const { data: pending, error: pendingError } = await supabase
        .from('users')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (pendingError) throw pendingError;
      setPendingUsers(pending || []);

      // Fetch users with status = 'approved'
      const { data: approved, error: approvedError } = await supabase
        .from('users')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (approvedError) throw approvedError;
      setApprovedUsers(approved || []);

      // Debug: Log what we found
      // console.log('✅ Pending users:', pending?.length || 0);
      // console.log('✅ Approved users:', approved?.length || 0);
      // console.log('All approved users data:', approved);

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ 
          status: 'approved', 
          role: 'business',
          approved_at: new Date().toISOString(),
          approved_by: user?.id
        })
        .eq('id', userId);

      if (error) throw error;
      fetchData();
    } catch (error) {
      console.error('Error approving user:', error);
      alert('Failed to approve user');
    }
  };

  const handleReject = async (userId) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ status: 'rejected' })
        .eq('id', userId);

      if (error) throw error;
      fetchData();
    } catch (error) {
      console.error('Error rejecting user:', error);
      alert('Failed to reject user');
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 dark:border-purple-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Admin Dashboard
        </h1>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-colors">
            <div className="text-3xl mb-2">⏳</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{pendingUsers.length}</div>
            <div className="text-gray-600 dark:text-gray-400">Pending Approvals</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-colors">
            <div className="text-3xl mb-2">✅</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{approvedUsers.length}</div>
            <div className="text-gray-600 dark:text-gray-400">Active Businesses</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-colors">
            <div className="text-3xl mb-2">💰</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              KES {approvedUsers.length * 2500}
            </div>
            <div className="text-gray-600 dark:text-gray-400">Monthly Revenue</div>
          </div>
        </div>

        {/* Pending Users */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 transition-colors">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Pending Approval Requests</h2>
          
          {pendingUsers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 mb-4">No pending requests</p>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                New user registrations will appear here for approval
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingUsers.map((user) => (
                <div key={user.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md dark:hover:shadow-gray-900 transition-all bg-white dark:bg-gray-800">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
                      <p className="font-medium text-gray-900 dark:text-white">{user.full_name || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                      <p className="font-medium text-gray-900 dark:text-white">{user.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                      <p className="font-medium text-gray-900 dark:text-white">{user.phone || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Role</p>
                      <p className="font-medium text-gray-900 dark:text-white capitalize">{user.role || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Business</p>
                      <p className="font-medium text-gray-900 dark:text-white">{user.business_name || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Type</p>
                      <p className="font-medium text-gray-900 dark:text-white capitalize">{user.business_type || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Registered</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {user.created_at ? new Date(user.created_at).toLocaleDateString('en-KE') : 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleApprove(user.id)}
                      className="bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(user.id)}
                      className="bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Approved Users */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-colors">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Active Businesses</h2>
          
          {approvedUsers.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">No active businesses yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Business</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Owner</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Phone</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Approved</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {approvedUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <td className="px-4 py-4 text-sm font-medium text-gray-900 dark:text-white">{user.business_name || 'N/A'}</td>
                      <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300">{user.full_name}</td>
                      <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300">{user.email}</td>
                      <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300">{user.phone || 'N/A'}</td>
                      <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300 capitalize">{user.business_type || 'N/A'}</td>
                      <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300">
                        {user.approved_at ? new Date(user.approved_at).toLocaleDateString('en-KE') : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Debug info - remove in production */}
        <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Debug Info:</h3>
          <p className="text-xs text-gray-600 dark:text-gray-400">Pending: {pendingUsers.length} | Approved: {approvedUsers.length}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            {approvedUsers.length > 0 ? '✅ Active businesses found' : '⚠️ No active businesses - check database'}
          </p>
        </div>
      </div>
    </div>
  );
}
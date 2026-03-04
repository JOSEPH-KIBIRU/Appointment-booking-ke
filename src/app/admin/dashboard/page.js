'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '../../../../utils/supabaseClient';
import { useRouter } from 'next/navigation';

export default function AdminDashboardPage() {
  const { user, userProfile, loading: authLoading } = useAuth();
  const router = useRouter();
  const [pendingUsers, setPendingUsers] = useState([]);
  const [pendingBusinesses, setPendingBusinesses] = useState([]);
  const [approvedUsers, setApprovedUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('users'); // 'users' or 'businesses'
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
      // Fetch users pending approval
      const { data: pending, error: pendingError } = await supabase
        .from('users')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (pendingError) throw pendingError;
      setPendingUsers(pending || []);

      // Fetch approved users who haven't registered business
      const { data: pendingBiz, error: bizError } = await supabase
        .from('users')
        .select(`
          *,
          businesses:businesses(id)
        `)
        .eq('status', 'approved')
        .eq('role', 'business')
        .order('created_at', { ascending: false });

      if (bizError) throw bizError;

      // Filter users who haven't registered business yet
      const usersWithoutBusiness = (pendingBiz || []).filter(
        user => !user.businesses || user.businesses.length === 0
      );
      setPendingBusinesses(usersWithoutBusiness);

      // Fetch approved users with businesses
      const { data: approved, error: approvedError } = await supabase
        .from('users')
        .select(`
          *,
          businesses:businesses(*)
        `)
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (approvedError) throw approvedError;
      setApprovedUsers(approved || []);

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveUser = async (userId) => {
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

  const handleRejectUser = async (userId) => {
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Admin Dashboard
        </h1>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="text-3xl mb-2">⏳</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{pendingUsers.length}</div>
            <div className="text-gray-600 dark:text-gray-400">Pending Approvals</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="text-3xl mb-2">🏢</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{pendingBusinesses.length}</div>
            <div className="text-gray-600 dark:text-gray-400">Pending Business Reg</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="text-3xl mb-2">✅</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{approvedUsers.length}</div>
            <div className="text-gray-600 dark:text-gray-400">Total Businesses</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="text-3xl mb-2">💰</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              KES {approvedUsers.length * 2500}
            </div>
            <div className="text-gray-600 dark:text-gray-400">Monthly Revenue</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('users')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'users'
                  ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Pending Approvals ({pendingUsers.length})
            </button>
            <button
              onClick={() => setActiveTab('businesses')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'businesses'
                  ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Pending Business Reg ({pendingBusinesses.length})
            </button>
            <button
              onClick={() => setActiveTab('active')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'active'
                  ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Active Businesses ({approvedUsers.length})
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'users' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Pending User Approvals</h2>
            
            {pendingUsers.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">No pending user approvals</p>
            ) : (
              <div className="space-y-4">
                {pendingUsers.map((user) => (
                  <div key={user.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
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
                        <p className="text-sm text-gray-500 dark:text-gray-400">Business</p>
                        <p className="font-medium text-gray-900 dark:text-white">{user.business_name || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Type</p>
                        <p className="font-medium text-gray-900 dark:text-white capitalize">{user.business_type || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleApproveUser(user.id)}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleRejectUser(user.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'businesses' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Pending Business Registrations</h2>
            
            {pendingBusinesses.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">No pending business registrations</p>
            ) : (
              <div className="space-y-4">
                {pendingBusinesses.map((user) => (
                  <div key={user.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-yellow-50 dark:bg-yellow-900/20">
                    <div className="mb-2">
                      <span className="inline-block bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 text-xs px-2 py-1 rounded-full">
                        ⏳ Waiting for business registration
                      </span>
                    </div>
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
                        <p className="text-sm text-gray-500 dark:text-gray-400">Approved</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {user.approved_at ? new Date(user.approved_at).toLocaleDateString('en-KE') : 'N/A'}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      User is approved but hasn't completed business registration yet.
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'active' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Active Businesses</h2>
            
            {approvedUsers.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">No active businesses yet</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Business</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Owner</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Email</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Phone</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Type</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Approved</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {approvedUsers.filter(u => u.businesses && u.businesses.length > 0).map((user) => (
                      <tr key={user.id}>
                        <td className="px-4 py-4 text-sm font-medium text-gray-900 dark:text-white">
                          {user.businesses?.[0]?.name || user.business_name || 'N/A'}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300">{user.full_name}</td>
                        <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300">{user.email}</td>
                        <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300">{user.phone || 'N/A'}</td>
                        <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300 capitalize">
                          {user.businesses?.[0]?.category || user.business_type || 'N/A'}
                        </td>
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
        )}
      </div>
    </div>
  );
}
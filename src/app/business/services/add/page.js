'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '../../../../../utils/supabaseClient';
import { useRouter } from 'next/navigation';

export default function AddServicePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration: 60,
    price: '',
  });

  useEffect(() => {
    if (user) {
      fetchBusiness();
    }
  }, [user]);

  const fetchBusiness = async () => {
    try {
      // console.log('Fetching business for user:', user?.id);
      
      const { data, error } = await supabase
        .from('businesses')
        .select('id, name')
        .eq('owner_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching business:', error);
        setError('No business found. Please register your business first.');
      } else {
        // console.log('Business found:', data);
        setBusiness(data);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('Failed to load business data');
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // console.log('Adding service for business:', business?.id);
      
      // Validate price
      const priceNum = parseFloat(formData.price);
      if (isNaN(priceNum) || priceNum <= 0) {
        throw new Error('Please enter a valid price');
      }

      const { data, error } = await supabase
        .from('services')
        .insert({
          business_id: business.id,
          name: formData.name,
          description: formData.description,
          duration: parseInt(formData.duration),
          price: priceNum,
          is_active: true,
        })
        .select();

      if (error) {
        console.error('Supabase error:', error);
        
        // Handle specific error codes
        if (error.code === '42501') {
          throw new Error('Permission denied. Please check that you own this business.');
        } else if (error.code === '23503') {
          throw new Error('Business not found. Please try again.');
        } else {
          throw new Error(error.message);
        }
      }

      // console.log('✅ Service added:', data);
      alert('Service added successfully!');
      router.push('/business/dashboard?tab=services');
      
    } catch (error) {
      console.error('Error adding service:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-6xl mb-4">🏢</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              No Business Found
            </h2>
            <p className="text-gray-600 mb-6">
              {error || 'You need to register a business before adding services.'}
            </p>
            <button
              onClick={() => router.push('/business/register')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-lg"
            >
              Register Business
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Add New Service
          </h1>
          <p className="text-gray-600 mb-6">
            for <span className="font-semibold text-emerald-600">{business.name}</span>
          </p>
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Service Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Men's haircut, Braiding, Manicure"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of the service..."
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Duration (minutes)
                </label>
                <select
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="15">15 mins</option>
                  <option value="30">30 mins</option>
                  <option value="45">45 mins</option>
                  <option value="60">1 hour</option>
                  <option value="90">1.5 hours</option>
                  <option value="120">2 hours</option>
                  <option value="180">3 hours</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Price (KES)
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="1000"
                  min="0"
                  step="10"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? 'Adding...' : 'Add Service'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
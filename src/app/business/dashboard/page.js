'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '../../../../utils/supabaseClient';
import Link from 'next/link';

export default function BusinessDashboardPage() {
  const { user, userProfile } = useAuth();
  const [business, setBusiness] = useState(null);
  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Payment settings state
  const [paybill, setPaybill] = useState('');
  const [tillNumber, setTillNumber] = useState('');
  const [paymentSaving, setPaymentSaving] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState('');

  // Status update state
  const [updatingBooking, setUpdatingBooking] = useState(null);

  useEffect(() => {
    if (user) {
      fetchBusinessData();
    }
  }, [user]);

  const fetchBusinessData = async () => {
    setLoading(true);
    try {
      // Fetch business owned by this user
      const { data: businessData, error: businessError } = await supabase
        .from('businesses')
        .select('*')
        .eq('owner_id', user.id)
        .maybeSingle();

      if (businessError) throw businessError;

      if (businessData) {
        setBusiness(businessData);
        setPaybill(businessData.mpesa_paybill || '');
        setTillNumber(businessData.mpesa_till || '');

        // Fetch services
        const { data: servicesData, error: servicesError } = await supabase
          .from('services')
          .select('*')
          .eq('business_id', businessData.id)
          .order('created_at', { ascending: false });

        if (servicesError) throw servicesError;
        setServices(servicesData || []);

        // Fetch recent bookings
        const { data: bookingsData, error: bookingsError } = await supabase
          .from('bookings')
          .select(`
            *,
            client:client_id (full_name, phone, email),
            service:service_id (name, price, duration)
          `)
          .eq('business_id', businessData.id)
          .order('booking_date', { ascending: false })
          .limit(10);

        if (bookingsError) throw bookingsError;
        setBookings(bookingsData || []);
      }
    } catch (error) {
      console.error('Error fetching business data:', error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ NEW FUNCTION: Handle booking status update
  const handleStatusChange = async (bookingId, newStatus) => {
    setUpdatingBooking(bookingId);
    
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', bookingId)
        .eq('business_id', business.id); // Extra safety check

      if (error) throw error;

      // Update local state
      setBookings(prevBookings =>
        prevBookings.map(booking =>
          booking.id === bookingId
            ? { ...booking, status: newStatus }
            : booking
        )
      );

      // Optional: Show success message
      // console.log('Booking status updated successfully');
    } catch (error) {
      console.error('Error updating booking status:', error);
      alert('Failed to update booking status. Please try again.');
    } finally {
      setUpdatingBooking(null);
    }
  };

  const handleSavePaymentDetails = async (e) => {
    e.preventDefault();
    if (!business) return;

    setPaymentSaving(true);
    setPaymentMessage('');

    try {
      const { error } = await supabase
        .from('businesses')
        .update({
          mpesa_paybill: paybill.trim() || null,
          mpesa_till: tillNumber.trim() || null,
        })
        .eq('id', business.id)
        .eq('owner_id', user.id); // safety check

      if (error) throw error;

      // Update local state
      setBusiness({
        ...business,
        mpesa_paybill: paybill.trim() || null,
        mpesa_till: tillNumber.trim() || null,
      });

      setPaymentMessage('Payment details saved successfully!');
    } catch (err) {
      console.error('Error saving payment details:', err);
      setPaymentMessage('Failed to save. Please try again.');
    } finally {
      setPaymentSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your business...</p>
        </div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white rounded-2xl shadow-xl p-12">
            <div className="text-6xl mb-6">🏢</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              You haven't registered a business yet
            </h1>
            <p className="text-gray-600 mb-8">
              Start accepting appointments and M-Pesa payments today
            </p>
            <Link
              href="/business/register"
              className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg"
            >
              Register Your Business →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {business.name}
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your appointments, services, and business settings
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="text-3xl mb-2">📅</div>
            <div className="text-2xl font-bold text-gray-900">{bookings.length}</div>
            <div className="text-gray-600">Total Bookings</div>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="text-3xl mb-2">💇</div>
            <div className="text-2xl font-bold text-gray-900">{services.length}</div>
            <div className="text-gray-600">Services Offered</div>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="text-3xl mb-2">⏳</div>
            <div className="text-2xl font-bold text-gray-900">
              {bookings.filter(b => b.status === 'pending').length}
            </div>
            <div className="text-gray-600">Pending Bookings</div>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="text-3xl mb-2">💰</div>
            <div className="text-2xl font-bold text-gray-900">
              KES {bookings.reduce((sum, b) => sum + (b.amount || 0), 0).toLocaleString('en-KE')}
            </div>
            <div className="text-gray-600">Total Revenue</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8">
            {['overview', 'services', 'bookings', 'payment'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab === 'payment' ? 'M-Pesa Settings' : tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Bookings */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Bookings</h2>
              {bookings.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No bookings yet</p>
              ) : (
                <div className="space-y-4">
                  {bookings.slice(0, 5).map((booking) => (
                    <div key={booking.id} className="border-b pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-900">{booking.client?.full_name}</p>
                          <p className="text-sm text-gray-600">{booking.service?.name}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(booking.booking_date).toLocaleDateString('en-KE')} at {booking.booking_time}
                          </p>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          booking.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {booking.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Link
                  href="/business/services/add"
                  className="block w-full bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium py-3 px-4 rounded-lg text-center transition-colors"
                >
                  ➕ Add New Service
                </Link>
                <Link
                  href="/business/settings"
                  className="block w-full bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium py-3 px-4 rounded-lg text-center transition-colors"
                >
                  ⚙️ Edit Business Profile
                </Link>
                <Link
                  href="/business/hours"
                  className="block w-full bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium py-3 px-4 rounded-lg text-center transition-colors"
                >
                  🕒 Set Working Hours
                </Link>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'services' && (
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Your Services</h2>
              <Link
                href="/business/services/add"
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg text-sm"
              >
                + Add Service
              </Link>
            </div>

            {services.length === 0 ? (
              <p className="text-gray-500 text-center py-12">
                You haven't added any services yet. Click "Add Service" to get started.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service) => (
                  <div key={service.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <h3 className="font-bold text-gray-900 mb-2">{service.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{service.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-green-600">KES {service.price}</span>
                      <span className="text-sm text-gray-500">{service.duration} min</span>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <button className="text-sm text-blue-600 hover:text-blue-800">Edit</button>
                      <button className="text-sm text-red-600 hover:text-red-800">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">All Bookings</h2>

            {bookings.length === 0 ? (
              <p className="text-gray-500 text-center py-12">No bookings yet</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {bookings.map((booking) => (
                      <tr key={booking.id}>
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">{booking.client?.full_name}</div>
                          <div className="text-sm text-gray-500">{booking.client?.phone}</div>
                        </td>
                        <td className="px-6 py-4 text-gray-500">{booking.service?.name}</td>
                        <td className="px-6 py-4">
                          <div>{new Date(booking.booking_date).toLocaleDateString('en-KE')}</div>
                          <div className="text-sm text-gray-500">{booking.booking_time}</div>
                        </td>
                        <td className="px-6 py-4 font-medium">KES {booking.amount}</td>
                        <td className="px-6 py-4">
                          <select
                            value={booking.status}
                            onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                            disabled={updatingBooking === booking.id}
                            className={`text-sm border rounded px-2 py-1 ${
                              updatingBooking === booking.id ? 'opacity-50 cursor-wait' : ''
                            }`}
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="px-6 py-4">
                          <button className="text-blue-600 hover:text-blue-800 text-sm mr-2">View</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Payment Settings Tab */}
        {activeTab === 'payment' && (
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">M-Pesa Payment Settings</h2>
            <p className="text-gray-600 mb-8">
              Update your Paybill and/or Till Number so customers can pay you directly.
            </p>

            <form onSubmit={handleSavePaymentDetails} className="space-y-6 max-w-lg">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Paybill Number
                </label>
                <input
                  type="text"
                  value={paybill}
                  onChange={(e) => setPaybill(e.target.value)}
                  placeholder="e.g. 123456"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Used for payments with account number
                </p>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Till Number (Buy Goods)
                </label>
                <input
                  type="text"
                  value={tillNumber}
                  onChange={(e) => setTillNumber(e.target.value)}
                  placeholder="e.g. 987654"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Used for direct Buy Goods payments
                </p>
              </div>

              <button
                type="submit"
                disabled={paymentSaving}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg disabled:opacity-50"
              >
                {paymentSaving ? 'Saving...' : 'Save Payment Details'}
              </button>

              {paymentMessage && (
                <p className={`mt-4 ${paymentMessage.includes('Failed') ? 'text-red-600' : 'text-green-600'}`}>
                  {paymentMessage}
                </p>
              )}
            </form>

            {/* Current values display */}
            <div className="mt-10 pt-6 border-t">
              <h3 className="text-lg font-semibold mb-4">Current Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500">Paybill Number</p>
                  <p className="font-medium text-gray-900 mt-1">
                    {business.mpesa_paybill || 'Not set'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Till Number</p>
                  <p className="font-medium text-gray-900 mt-1">
                    {business.mpesa_till || 'Not set'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
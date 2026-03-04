'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../../utils/supabaseClient';
import Link from 'next/link';
import { BUSINESS_CATEGORIES, KENYAN_COUNTIES } from '@/components/KenyanBusinessCategories';

export default function FindServicesPage() {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    county: '',
    search: '',
  });
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [services, setServices] = useState([]);
  const [showServicesModal, setShowServicesModal] = useState(false);

  useEffect(() => {
    fetchBusinesses();
  }, [filters]);

  const fetchBusinesses = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('businesses')
        .select(`
          *,
          services:services(count)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (filters.category) {
        query = query.eq('category', filters.category);
      }

      if (filters.county) {
        query = query.eq('county', filters.county);
      }

      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      setBusinesses(data || []);
    } catch (error) {
      console.error('Error fetching businesses:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBusinessServices = async (businessId) => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('business_id', businessId)
        .eq('is_active', true)
        .order('price', { ascending: true });

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const handleBusinessClick = async (business) => {
    setSelectedBusiness(business);
    await fetchBusinessServices(business.id);
    setShowServicesModal(true);
  };

  const getCategoryIcon = (categoryId) => {
    const category = BUSINESS_CATEGORIES.find(c => c.id === categoryId);
    return category?.icon || '🏢';
  };

  const getCategoryColor = (categoryId) => {
    const category = BUSINESS_CATEGORIES.find(c => c.id === categoryId);
    return category?.color || 'bg-gray-100';
  };

  const formatPhone = (phone) => {
    if (!phone) return 'N/A';
    return phone.startsWith('0') ? phone : `0${phone}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      
      {/* Hero Section - CENTERED */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-800 dark:to-teal-900 text-white transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">
            Find Services Near You 🇰🇪
          </h1>
          <p className="text-xl text-emerald-50 dark:text-emerald-100 max-w-2xl mx-auto drop-shadow">
            Discover local businesses, book appointments, and pay with M-Pesa
          </p>
        </div>
      </div>

      {/* Filters Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg dark:shadow-gray-900/50 p-6 border border-gray-200 dark:border-gray-800 transition-colors duration-300">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Search
              </label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                placeholder="Business name or service..."
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg 
                           bg-white dark:bg-gray-800 text-gray-900 dark:text-white 
                           placeholder-gray-400 dark:placeholder-gray-500
                           focus:ring-2 focus:ring-emerald-500 focus:border-transparent 
                           transition-colors duration-300"
              />
            </div>

            {/* Category Select */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg 
                           bg-white dark:bg-gray-800 text-gray-900 dark:text-white 
                           focus:ring-2 focus:ring-emerald-500 focus:border-transparent 
                           transition-colors duration-300"
              >
                <option value="">All Categories</option>
                {BUSINESS_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* County Select */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                County
              </label>
              <select
                value={filters.county}
                onChange={(e) => setFilters({ ...filters, county: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg 
                           bg-white dark:bg-gray-800 text-gray-900 dark:text-white 
                           focus:ring-2 focus:ring-emerald-500 focus:border-transparent 
                           transition-colors duration-300"
              >
                <option value="">All Counties</option>
                {KENYAN_COUNTIES.map((county) => (
                  <option key={county} value={county}>{county}</option>
                ))}
              </select>
            </div>

            {/* Clear Button */}
            <div className="flex items-end">
              <button
                onClick={() => setFilters({ category: '', county: '', search: '' })}
                className="w-full bg-gray-500 hover:bg-gray-600 
                           dark:bg-gray-700 dark:hover:bg-gray-600 
                           text-white font-medium py-2 px-4 rounded-lg 
                           transition-all duration-300"
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Results count */}
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            Found <span className="font-semibold text-emerald-600 dark:text-emerald-400">{businesses.length}</span> businesses
          </div>
        </div>
      </div>

      {/* Businesses Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 dark:border-emerald-400"></div>
          </div>
        ) : businesses.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg dark:shadow-gray-900/50 p-12 text-center border border-gray-200 dark:border-gray-800 transition-colors duration-300">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
              No businesses found
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your filters or check back later
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {businesses.map((business) => (
              <div
                key={business.id}
                onClick={() => handleBusinessClick(business)}
                className="bg-white dark:bg-gray-900 rounded-xl shadow-lg dark:shadow-gray-900/50 
                           hover:shadow-xl dark:hover:shadow-gray-800/80 
                           transition-all cursor-pointer transform hover:-translate-y-1 
                           border border-gray-200 dark:border-gray-800"
              >
                {/* Category Color Bar */}
                <div className={`h-2 rounded-t-xl ${getCategoryColor(business.category).replace('bg-', 'dark:bg-').replace('100', '900/50').replace('200', '800/50')}`}></div>
                
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-4xl">{getCategoryIcon(business.category)}</span>
                    <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 text-sm font-medium rounded-full">
                      {business.services?.[0]?.count || 0} services
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {business.name}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {business.description || 'No description provided'}
                  </p>
                  
                  <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <span>📍</span>
                      <span>
                        {business.county}
                        {business.constituency && `, ${business.constituency}`}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>📞</span>
                      <span>{formatPhone(business.phone)}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                    <span className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium flex items-center gap-1 transition-colors">
                      View Services →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Services Modal - Dark Mode */}
      {showServicesModal && selectedBusiness && (
        <div className="fixed inset-0 bg-black/60 dark:bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-gray-200 dark:border-gray-700 shadow-2xl dark:shadow-gray-900/50 transition-colors duration-300">
            
            {/* Modal Header */}
            <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-6 flex justify-between items-center z-10">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedBusiness.name}</h2>
                <p className="text-gray-600 dark:text-gray-400">{selectedBusiness.county}</p>
              </div>
              <button
                onClick={() => setShowServicesModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {services.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">No services available yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {services.map((service) => (
                    <div 
                      key={service.id} 
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 
                                 hover:border-emerald-400 dark:hover:border-emerald-500 
                                 transition-colors bg-gray-50 dark:bg-gray-800/50"
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 dark:text-white text-lg">{service.name}</h3>
                          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{service.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                            <span>⏱️ {service.duration} mins</span>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">KES {service.price}</p>
                          <Link
                            href={`/booking?business=${selectedBusiness.id}&service=${service.id}`}
                            className="inline-block mt-2 bg-emerald-600 hover:bg-emerald-500 
                                       dark:bg-emerald-500 dark:hover:bg-emerald-400 
                                       dark:text-gray-900 text-white 
                                       text-sm font-medium px-4 py-2 rounded-lg 
                                       transition-all duration-300"
                          >
                            Book Now
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-800/80 border-t border-gray-200 dark:border-gray-700 p-4 backdrop-blur-sm">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-gray-600 dark:text-gray-400">
                <span className="flex items-center gap-2">
                  📞 Call: <a href={`tel:${formatPhone(selectedBusiness.phone)}`} className="text-emerald-600 dark:text-emerald-400 hover:underline">{formatPhone(selectedBusiness.phone)}</a>
                </span>
                <button
                  onClick={() => setShowServicesModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                >
                  Close ✕
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
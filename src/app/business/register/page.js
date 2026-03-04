'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '../../../../utils/supabaseClient';
import { BusinessCategorySelector, CountySelector } from '@/components/KenyanBusinessCategories';
import KenyanPhoneInput from '@/components/KenyanPhoneInput';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function BusinessRegistrationPage() {
  const { user, userProfile, loading: authLoading } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    phone: '',
    email: '',
    county: '',
    constituency: '',
    location: '',
  });
  const [loading, setLoading] = useState(false); // This is the state we need
  const [error, setError] = useState('');

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=business/register');
    }
  }, [user, authLoading, router]);

  // Show loading while auth is initializing
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  // If no user after loading, show nothing (will redirect)
  if (!user) {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Using setLoading instead of setSubmitting
    setError('');
    
    try {
      // First, check if user already has a business
      const { data: existingBusiness } = await supabase
        .from('businesses')
        .select('id')
        .eq('owner_id', user.id)
        .maybeSingle();

      if (existingBusiness) {
        setError('You already have a registered business. You can only register one business per account.');
        setLoading(false);
        return;
      }

      // Insert business
      const { data, error } = await supabase
        .from('businesses')
        .insert([
          {
            owner_id: user.id,
            name: formData.name,
            category: formData.category,
            description: formData.description || null,
            phone: formData.phone,
            email: formData.email || null,
            county: formData.county,
            constituency: formData.constituency || null,
            location: formData.location || null,
            is_active: true,
          }
        ])
        .select()
        .single();

      if (error) throw error;

      // Update user role to business if not already
      if (userProfile?.role !== 'business') {
        await supabase
          .from('users')
          .update({ role: 'business' })
          .eq('id', user.id);
      }

      alert('✅ Business registered successfully!');
      router.push('/business/dashboard');
      
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.message);
    } finally {
      setLoading(false); // Using setLoading
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            🇰🇪 Register Your Business
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Start accepting appointments and M-Pesa payments
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 transition-colors">
          {/* Progress Steps */}
          <div className="flex justify-between mb-12">
            {['Category', 'Details', 'Location', 'Complete'].map((s, i) => (
              <div key={s} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold
                  ${step > i + 1 ? 'bg-green-500 text-white' : 
                    step === i + 1 ? 'bg-emerald-600 text-white' : 
                    'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}>
                  {step > i + 1 ? '✓' : i + 1}
                </div>
                <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:block">{s}</span>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Category */}
            {step === 1 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                  What type of business do you have?
                </h2>
                <BusinessCategorySelector
                  selected={formData.category}
                  onChange={(value) => setFormData({ ...formData, category: value })}
                />
                <div className="mt-8 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    disabled={!formData.category}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-8 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next Step →
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Business Details */}
            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                  Tell us about your business
                </h2>
                
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                    Business Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Mama Salama Salon"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of your services..."
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                    Contact Phone *
                  </label>
                  <KenyanPhoneInput
                    value={formData.phone}
                    onChange={(value) => setFormData({ ...formData, phone: value })}
                  />
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                    Business Email (Optional)
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="business@example.com"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-8 rounded-lg transition-colors"
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    disabled={!formData.name || !formData.phone}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-8 rounded-lg disabled:opacity-50 transition-colors"
                  >
                    Next Step →
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Location */}
            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                  Where are you located?
                </h2>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                    County *
                  </label>
                  <CountySelector
                    selected={formData.county}
                    onChange={(value) => setFormData({ ...formData, county: value })}
                  />
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                    Constituency (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.constituency}
                    onChange={(e) => setFormData({ ...formData, constituency: e.target.value })}
                    placeholder="e.g., Langata, Kasarani"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                    Specific Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g., Koinange Street, Next to Hilton"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-8 rounded-lg transition-colors"
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(4)}
                    disabled={!formData.county}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-8 rounded-lg disabled:opacity-50 transition-colors"
                  >
                    Review →
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Review & Submit */}
            {step === 4 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                  Review Your Information
                </h2>

                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Category</p>
                      <p className="font-medium text-gray-900 dark:text-white capitalize">{formData.category}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Business Name</p>
                      <p className="font-medium text-gray-900 dark:text-white">{formData.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                      <p className="font-medium text-gray-900 dark:text-white">0{formData.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">County</p>
                      <p className="font-medium text-gray-900 dark:text-white">{formData.county}</p>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-red-800 dark:text-red-300">{error}</p>
                  </div>
                )}

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-8 rounded-lg transition-colors"
                  >
                    ← Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-8 rounded-lg flex items-center gap-2 disabled:opacity-50 transition-colors"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Registering...
                      </>
                    ) : (
                      '✓ Complete Registration'
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        <p className="text-center text-gray-600 dark:text-gray-400 mt-8">
          Already registered? <Link href="/login" className="text-emerald-600 hover:text-emerald-700 font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
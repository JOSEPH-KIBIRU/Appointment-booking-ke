'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import KenyanPhoneInput from '@/components/KenyanPhoneInput';

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState('form'); // 'form' or 'submitted'
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    business_name: '',
    business_type: '',
    role: 'business', // Default to business since this is for businesses
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setMessage('❌ Passwords do not match');
      setLoading(false);
      return;
    }

    // Validate password strength
    if (formData.password.length < 8) {
      setMessage('❌ Password must be at least 8 characters');
      setLoading(false);
      return;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setMessage('❌ Please enter a valid email address');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: formData.full_name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          business_name: formData.business_name,
          business_type: formData.business_type,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStep('submitted');
      } else {
        setMessage(`❌ ${data.error || 'Registration failed'}`);
      }
    } catch (error) {
      setMessage('❌ Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Success screen after submission
  if (step === 'submitted') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="text-7xl mb-6">🎉</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Request Submitted!
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Thank you for registering, <span className="font-semibold text-green-600">{formData.full_name}</span>!
            </p>
            <div className="bg-green-50 rounded-xl p-6 mb-8 text-left">
              <h3 className="font-bold text-green-800 mb-3">📋 What happens next?</h3>
              <ul className="space-y-2 text-green-700">
                <li className="flex items-start gap-2">
                  <span>1️⃣</span>
                  <span>Our admin team will review your application</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>2️⃣</span>
                  <span>You'll receive an email confirmation within 24 hours</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>3️⃣</span>
                  <span>Once approved, you can log in and set up your business</span>
                </li>
              </ul>
            </div>
            <Link
              href="/"
              className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Registration form
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Register Your Business
          </h1>
          <p className="text-lg text-gray-600">
            Fill out the form below. Admin will review and approve your account within 24 hours.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-medium mb-2">
                    Phone Number
                  </label>
                  <KenyanPhoneInput
                    value={formData.phone}
                    onChange={(value) => setFormData({ ...formData, phone: value })}
                  />
                </div>
              </div>
            </div>

            {/* Business Information */}
            <div className="pt-4 border-t">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Business Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-medium mb-2">
                    Business Name *
                  </label>
                  <input
                    type="text"
                    name="business_name"
                    value={formData.business_name}
                    onChange={handleChange}
                    placeholder="e.g., Mama Salama Salon"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-medium mb-2">
                    Business Type *
                  </label>
                  <select
                    name="business_type"
                    value={formData.business_type}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select business type</option>
                    <option value="salon">Salon & Barber</option>
                    <option value="mechanic">Mechanic & Garage</option>
                    <option value="clinic">Clinic & Medical</option>
                    <option value="tutor">Tutor & Classes</option>
                    <option value="tailor">Tailor & Fashion</option>
                    <option value="cleaning">Cleaning Services</option>
                    <option value="photography">Photography</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Security */}
            <div className="pt-4 border-t">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Security</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Password *
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                    minLength="8"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Password must be at least 8 characters
              </p>
            </div>

            {/* Terms */}
            <div className="pt-4">
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  required
                  className="mt-1 w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <span className="text-sm text-gray-600">
                  I agree to the{' '}
                  <Link href="/terms" className="text-green-600 hover:text-green-700">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-green-600 hover:text-green-700">
                    Privacy Policy
                  </Link>
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-xl text-lg transition-colors disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Submitting...
                </span>
              ) : (
                'Submit for Approval'
              )}
            </button>

            {message && (
              <div className={`mt-4 p-4 rounded-lg text-center ${
                message.includes('✅') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
              }`}>
                {message}
              </div>
            )}
          </form>

          <p className="text-center text-gray-600 mt-8">
            Already have an account?{' '}
            <button
              onClick={() => {
                // Open login modal instead of redirect
                const event = new CustomEvent('openLoginModal');
                window.dispatchEvent(event);
              }}
              className="text-green-600 hover:text-green-700 font-medium"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
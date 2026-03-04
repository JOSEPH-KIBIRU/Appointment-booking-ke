'use client';

import { useState } from 'react';
import PhoneInput from 'react-phone-number-input/input';
import 'react-phone-number-input/style.css';
import MPesaButton from '@/components/MPesaButton';

export default function TestPaymentPage() {
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('100');
  const [name, setName] = useState('');

  const handleSuccess = (data) => {
    // console.log('Payment initiated successfully:', data);
    alert('Payment initiated! Check your phone to complete.');
  };

  const handleError = (error) => {
    console.error('Payment error:', error);
    alert('Payment failed: ' + (error.error || 'Unknown error'));
  };

  // Prepare phone number in format many M-Pesa integrations expect (2547... without +)
  const mpesaReadyPhone = phone && phone.startsWith('+254')
    ? phone.slice(1)
    : phone;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-green-50 p-4 md:p-8">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-800 mb-2">
            💵 Test M-Pesa Payment
          </h1>
          <p className="text-gray-600">
            Try the M-Pesa integration with sandbox credentials
          </p>
        </div>

        {/* Payment Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          {/* Name */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Your Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Phone – starts typing 07... or 7... right away */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              M-Pesa Phone Number
            </label>
            <PhoneInput
              country="KE"
              international={false}
              placeholder="0712 345 678"
              value={phone}
              onChange={setPhone}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              inputMode="tel"
            />
            <p className="mt-2 text-sm text-gray-500">
              Type e.g. 0708374149 or 708374149 • Test: <span className="font-mono">254708374149</span>
            </p>
          </div>

          {/* Amount Selector */}
          <div className="mb-8">
            <label className="block text-gray-700 font-medium mb-3">
              Amount (KES)
            </label>
            <div className="grid grid-cols-4 gap-3">
              {[100, 200, 500, 1000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setAmount(amt.toString())}
                  className={`py-3 rounded-lg font-medium transition-colors ${
                    amount === amt.toString()
                      ? 'bg-green-100 text-green-700 border-2 border-green-500'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {amt}
                </button>
              ))}
            </div>

            <div className="mt-4">
              <label className="block text-gray-700 font-medium mb-2">
                Custom Amount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  KES
                </span>
                <input
                  type="number"
                  min="10"
                  max="70000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Pay Button */}
          <MPesaButton
            amount={amount}
            phone={mpesaReadyPhone || phone}
            accountReference={`Test-${name || 'Booking'}`}
            onSuccess={handleSuccess}
            onError={handleError}
            disabled={!phone || !amount}
          />
        </div>

        {/* Test Instructions */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-xl p-5">
          <h3 className="font-bold text-yellow-800 mb-2">🧪 Test Instructions</h3>
          <ul className="text-yellow-700 text-sm space-y-1">
            <li>• Use test phone: <span className="font-mono">254708374149</span> (or type 0708374149)</li>
            <li>• Use test MPESA PIN: <span className="font-mono">123456</span></li>
            <li>• Use test amount: <span className="font-mono">1 KES</span> (sandbox)</li>
            <li>• You'll receive a success message even with test credentials</li>
            <li>• No real money is deducted in sandbox mode</li>
          </ul>
        </div>

        {/* Back link */}
        <div className="mt-6 text-center">
          <a
            href="/"
            className="text-green-600 hover:text-green-800 font-medium"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
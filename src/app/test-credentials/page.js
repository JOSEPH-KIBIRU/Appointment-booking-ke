'use client';

import { useState } from 'react';

export default function TestCredentialsPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const testCredentials = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const response = await fetch('/api/mpesa/test-auth');
      const data = await response.json();
      
      if (response.ok) {
        setResult(data);
      } else {
        setError(data);
      }
    } catch (err) {
      setError({ message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          🔍 Test M-Pesa Credentials
        </h1>
        
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <button
            onClick={testCredentials}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test M-Pesa Credentials'}
          </button>
        </div>
        
        {result && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
            <h3 className="text-xl font-bold text-green-800 mb-4">✅ Success!</h3>
            <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <h3 className="text-xl font-bold text-red-800 mb-4">❌ Error</h3>
            <pre className="bg-gray-900 text-red-400 p-4 rounded-lg overflow-auto">
              {JSON.stringify(error, null, 2)}
            </pre>
          </div>
        )}
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <h3 className="text-xl font-bold text-yellow-800 mb-4">📋 Environment Variables Check</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>NEXT_PUBLIC_MPESA_CONSUMER_KEY:</span>
              <span className={process.env.NEXT_PUBLIC_MPESA_CONSUMER_KEY ? 'text-green-600' : 'text-red-600'}>
                {process.env.NEXT_PUBLIC_MPESA_CONSUMER_KEY ? 'Present' : 'Missing'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>NEXT_PUBLIC_MPESA_CONSUMER_SECRET:</span>
              <span className={process.env.NEXT_PUBLIC_MPESA_CONSUMER_SECRET ? 'text-green-600' : 'text-red-600'}>
                {process.env.NEXT_PUBLIC_MPESA_CONSUMER_SECRET ? 'Present' : 'Missing'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>NEXT_PUBLIC_MPESA_BUSINESS_SHORTCODE:</span>
              <span className="text-blue-600">{process.env.NEXT_PUBLIC_MPESA_BUSINESS_SHORTCODE || 'Not set'}</span>
            </div>
            <div className="flex justify-between">
              <span>NEXT_PUBLIC_MPESA_ENVIRONMENT:</span>
              <span className="text-blue-600">{process.env.NEXT_PUBLIC_MPESA_ENVIRONMENT || 'Not set'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
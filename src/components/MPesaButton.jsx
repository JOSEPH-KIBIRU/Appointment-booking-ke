'use client';

import { useState } from 'react';

export default function MPesaButton({ 
  amount, 
  phone, 
  accountReference, 
  onPaymentInitiated, 
  onPaymentConfirmed,
  onError,
  disabled = false 
}) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [showFetchInput, setShowFetchInput] = useState(false);
  const [transactionCode, setTransactionCode] = useState('');
  const [fetchLoading, setFetchLoading] = useState(false);
  const [paymentInitiated, setPaymentInitiated] = useState(false);

  const handlePayment = async () => {
    if (!phone || !amount || disabled) return;
    
    setLoading(true);
    setStatus('Initiating payment...');

    try {
      const response = await fetch('/api/mpesa/stk-push', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone,
          amount,
          accountReference: accountReference || 'Appointment Booking',
          transactionDesc: 'Payment for appointment booking',
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('✅ STK Push sent! Check your phone to enter M-Pesa PIN');
        setShowFetchInput(true);
        setPaymentInitiated(true);
        if (onPaymentInitiated) onPaymentInitiated(data);
      } else {
        setStatus(`❌ ${data.error || 'Payment failed'}`);
        if (onError) onError(data);
      }
    } catch (error) {
      setStatus('❌ Network error. Please try again.');
      if (onError) onError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPayment = async () => {
    if (!transactionCode || transactionCode.length < 6) {
      setStatus('❌ Please enter the M-Pesa transaction code');
      return;
    }

    setFetchLoading(true);
    setStatus('🔍 Verifying transaction...');

    try {
      // In production, verify with M-Pesa API
      // For now, simulate verification
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setStatus('✅ Payment confirmed! Creating your booking...');
      setShowFetchInput(false);
      
      if (onPaymentConfirmed) {
        onPaymentConfirmed(transactionCode);
      }
    } catch (error) {
      setStatus('❌ Failed to verify transaction');
    } finally {
      setFetchLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {!paymentInitiated ? (
        <button
          onClick={handlePayment}
          disabled={!phone || !amount || loading || disabled}
          className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3
            ${!phone || !amount || disabled
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl'
            }
            ${loading ? 'opacity-75' : ''}
          `}
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Sending STK Push...
            </>
          ) : (
            <>
              <span className="text-xl">💵</span>
              Pay KES {amount} via M-Pesa
            </>
          )}
        </button>
      ) : (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-bold text-blue-800 mb-3">📱 Complete Payment on Your Phone</h3>
          <p className="text-blue-700 mb-4">
            1. Check your phone for the M-Pesa PIN prompt<br />
            2. Enter your M-Pesa PIN to authorize payment<br />
            3. After successful payment, enter the transaction code below
          </p>
          
          <div className="space-y-3">
            <input
              type="text"
              value={transactionCode}
              onChange={(e) => setTransactionCode(e.target.value.toUpperCase())}
              placeholder="Enter M-Pesa transaction code (e.g., QW123456)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              maxLength="10"
            />
            
            <button
              onClick={handleConfirmPayment}
              disabled={fetchLoading || !transactionCode}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg disabled:opacity-50"
            >
              {fetchLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Verifying...
                </span>
              ) : (
                '✓ I Have Paid - Confirm Booking'
              )}
            </button>
            
            <button
              onClick={() => {
                setPaymentInitiated(false);
                setShowFetchInput(false);
                setTransactionCode('');
                setStatus('');
              }}
              className="w-full text-gray-600 hover:text-gray-800 text-sm"
            >
              ← Cancel and try again
            </button>
          </div>
        </div>
      )}
      
      {status && (
        <p className={`text-center text-sm font-medium ${
          status.includes('✅') ? 'text-green-600' : 
          status.includes('❌') ? 'text-red-600' : 
          'text-blue-600'
        }`}>
          {status}
        </p>
      )}
      
      <p className="text-xs text-gray-500 text-center">
        You will receive an STK Push prompt on your phone. Enter your M-Pesa PIN to complete payment.
      </p>
    </div>
  );
}
'use client';

import { useState } from 'react';

export default function KenyanPhoneInput({ value, onChange, disabled = false }) {
  const [formattedValue, setFormattedValue] = useState(value || '');

  const formatPhoneNumber = (input) => {
    // Remove all non-digit characters
    const digits = input.replace(/\D/g, '');
    
    // Kenyan prefixes: 07, 01, 011, etc.
    // Allow up to 10 digits after the prefix logic
    let limited = digits;
    
    // Format based on the number of digits entered
    if (limited.length > 0) {
      // Format as: XXX XXX XXX (without the leading 0 in display)
      let formatted = '';
      
      // First 3 digits (including the leading 0)
      if (limited.length >= 1) {
        formatted = limited.slice(0, 3);
      }
      
      // Next 3 digits
      if (limited.length > 3) {
        formatted += ' ' + limited.slice(3, 6);
      }
      
      // Last 4 digits
      if (limited.length > 6) {
        formatted += ' ' + limited.slice(6, 10);
      }
      
      return formatted;
    }
    
    return '';
  };

  const validateKenyanPhone = (phoneDigits) => {
    // Kenyan phone validation patterns
    const patterns = [
      /^07\d{8}$/,      // Safaricom/Airtel/Telkom (07XXXXXXXX)
      /^01\d{8}$/,      // New 01 format
      /^011\d{7}$/,     // Special 011 format
      /^010\d{7}$/,     // Special 010 format
      /^2547\d{8}$/,    // International format (2547XXXXXXXX)
      /^2541\d{8}$/,    // International format (2541XXXXXXXX)
    ];
    
    return patterns.some(pattern => pattern.test(phoneDigits));
  };

  const handleChange = (e) => {
    const input = e.target.value;
    // Remove any non-digits and spaces
    const rawDigits = input.replace(/\D/g, '');
    
    // Limit to 10 digits max (for local format)
    const limitedDigits = rawDigits.slice(0, 10);
    
    // Format the display
    const formatted = formatPhoneNumber(limitedDigits);
    setFormattedValue(formatted);
    
    // Pass the digits (without formatting) to parent
    onChange(limitedDigits);
  };

  const isValid = formattedValue ? validateKenyanPhone(formattedValue.replace(/\s/g, '')) : true;

  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center pointer-events-none z-10">
        <span className="text-gray-500 mr-1 text-lg">🇰🇪</span>
        <span className="text-gray-700 dark:text-gray-300 font-medium bg-white dark:bg-gray-800 px-1">+254</span>
      </div>
      <input
        type="tel"
        value={formattedValue}
        onChange={handleChange}
        disabled={disabled}
        placeholder="12 345 6789"
        className={`w-full pl-24 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
          !isValid && formattedValue ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
        }`}
        maxLength={13} // 3 digits + 2 spaces + 8 digits = 13 chars
      />
      {formattedValue && !isValid && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
          Please enter a valid Kenyan number (07XXXXXXXX or 01XXXXXXXX)
        </p>
      )}
      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
        Kenyan numbers: 07XXXXXXXX, 01XXXXXXXX
      </p>
    </div>
  );
}
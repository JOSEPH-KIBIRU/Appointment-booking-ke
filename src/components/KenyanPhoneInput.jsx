'use client';

import { useState } from 'react';

export default function KenyanPhoneInput({ value, onChange, disabled = false }) {
  const [formattedValue, setFormattedValue] = useState(value || '');

  const formatPhoneNumber = (input) => {
    // Remove all non-digit characters
    const digits = input.replace(/\D/g, '');
    
    // Limit to 10 digits (07XXXXXXXX)
    const limited = digits.slice(0, 10);
    
    // Format as 07X XXX XXXX
    let formatted = '';
    if (limited.length > 0) {
      formatted = limited.slice(0, 3);
      if (limited.length > 3) {
        formatted += ' ' + limited.slice(3, 6);
      }
      if (limited.length > 6) {
        formatted += ' ' + limited.slice(6, 10);
      }
    }
    
    return formatted;
  };

  const handleChange = (e) => {
    const input = e.target.value;
    const formatted = formatPhoneNumber(input);
    
    setFormattedValue(formatted);
    
    // Extract digits for the onChange callback
    const digits = formatted.replace(/\D/g, '');
    onChange(digits);
  };

  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center">
        <span className="text-gray-500 mr-1">🇰🇪</span>
        <span className="text-gray-700 font-medium">+254</span>
      </div>
      <input
        type="tel"
        value={formattedValue}
        onChange={handleChange}
        disabled={disabled}
        placeholder="7XX XXX XXX"
        className="w-full pl-20 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
        maxLength={12} // 3 + 1 space + 3 + 1 space + 4 = 12
      />
      {formattedValue && !/^07\d{8}$/.test(formattedValue.replace(/\s/g, '')) && (
        <p className="mt-1 text-sm text-red-600">
          Please enter a valid Kenyan number (07XXXXXXXX)
        </p>
      )}
    </div>
  );
}
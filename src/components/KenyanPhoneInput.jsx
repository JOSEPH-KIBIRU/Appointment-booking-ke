'use client';

import { useState } from 'react';

export default function KenyanPhoneInput({ value, onChange, disabled = false }) {
  const [formattedValue, setFormattedValue] = useState(value || '');

  const formatPhoneNumber = (input) => {
    // Remove all non-digit characters
    const digits = input.replace(/\D/g, '');
    
    // Format as XXX XXX XXX (without the leading 0)
    let formatted = '';
    if (digits.length > 0) {
      // First 3 digits
      formatted = digits.slice(0, 3);
      
      // Next 3 digits
      if (digits.length > 3) {
        formatted += ' ' + digits.slice(3, 6);
      }
      
      // Last 4 digits
      if (digits.length > 6) {
        formatted += ' ' + digits.slice(6, 10);
      }
    }
    
    return formatted;
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
    
    // Limit to 9 digits max (for local format after +254)
    const limitedDigits = rawDigits.slice(0, 9);
    
    // Format the display
    const formatted = formatPhoneNumber(limitedDigits);
    setFormattedValue(formatted);
    
    // Pass the full 12-digit number (with 254 prefix) to parent
    // If they entered 723456789, we pass 0723456789
    const fullNumber = limitedDigits.padStart(9, '').padStart(10, '0');
    onChange(fullNumber);
  };

  const isValid = formattedValue ? validateKenyanPhone('0' + formattedValue.replace(/\s/g, '')) : true;

  return (
    <div className="space-y-1">
      <div className="relative">
        {/* Prefix - now properly positioned with background */}
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center bg-white dark:bg-gray-700 pr-2 z-10">
          <span className="text-gray-500 mr-1 text-base">🇰🇪</span>
          <span className="text-gray-700 dark:text-gray-300 font-medium">+254</span>
        </div>
        
        {/* Input with proper padding */}
        <input
          type="tel"
          value={formattedValue}
          onChange={handleChange}
          disabled={disabled}
          placeholder="723 456 789"
          className={`w-full pl-24 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
            !isValid && formattedValue ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
          }`}
          style={{ paddingLeft: '5.5rem' }} // Extra padding to ensure text clears the prefix
        />
      </div>
      
      {/* Validation message */}
      {formattedValue && !isValid && (
        <p className="text-sm text-red-600 dark:text-red-400">
          Please enter a valid Kenyan number (07XXXXXXXX or 01XXXXXXXX)
        </p>
      )}
      
      {/* Helper text */}
      <p className="text-xs text-gray-500 dark:text-gray-400">
        Kenyan numbers: 07XXXXXXXX, 01XXXXXXXX
      </p>
    </div>
  );
}
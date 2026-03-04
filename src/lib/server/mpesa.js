import axios from 'axios';
import base64 from 'base-64';

class MPesaService {
  constructor() {
    // Load credentials from environment variables - MATCHING YOUR NAMES
    this.consumerKey = process.env.MPESA_CONSUMER_KEY;
    this.consumerSecret = process.env.MPESA_CONSUMER_SECRET;
    this.businessShortCode = process.env.MPESA_SHORTCODE; // Changed from MPESA_BUSINESS_SHORTCODE
    this.passkey = process.env.MPESA_PASSKEY;
    this.callbackURL = process.env.MPESA_CALLBACK_URL;
    this.environment = process.env.MPESA_ENV || 'sandbox'; // Changed from MPESA_ENVIRONMENT
    
    // // DEBUG: Log what's being loaded
    // console.log('🔍 M-Pesa ENV Variables:');
    // console.log('- Consumer Key:', this.consumerKey ? '✅ Present' : '❌ Missing');
    // console.log('- Consumer Secret:', this.consumerSecret ? '✅ Present' : '❌ Missing');
    // console.log('- Business ShortCode:', this.businessShortCode ? `✅ ${this.businessShortCode}` : '❌ Missing');
    // console.log('- Passkey:', this.passkey ? '✅ Present' : '❌ Missing');
    // console.log('- Callback URL:', this.callbackURL ? '✅ Present' : '❌ Missing');
    // console.log('- Environment:', this.environment);
    
    // Validate that all required credentials are present
    this.validateCredentials();
    
    // Set base URL based on environment
    this.baseURL = this.environment === 'production' 
      ? 'https://api.safaricom.co.ke'
      : 'https://sandbox.safaricom.co.ke';
    
    // console.log(`🔧 M-Pesa Service initialized in ${this.environment} mode`);
  }

  validateCredentials() {
    const required = [
      { name: 'MPESA_CONSUMER_KEY', value: this.consumerKey },
      { name: 'MPESA_CONSUMER_SECRET', value: this.consumerSecret },
      { name: 'MPESA_SHORTCODE', value: this.businessShortCode },
      { name: 'MPESA_PASSKEY', value: this.passkey },
      { name: 'MPESA_CALLBACK_URL', value: this.callbackURL }
    ];

    const missing = required.filter(req => !req.value).map(req => req.name);
    
    if (missing.length > 0) {
      throw new Error(`Missing required M-Pesa environment variables: ${missing.join(', ')}`);
    }

    // More flexible shortcode validation
    const shortcodeStr = String(this.businessShortCode).trim();
    if (!/^\d{5,6}$/.test(shortcodeStr)) {
      throw new Error(`Business shortcode must be 5-6 digits. Got: "${shortcodeStr}"`);
    }
    
    // Convert to string if it's a number
    this.businessShortCode = shortcodeStr;
  }

  async getAccessToken() {
    try {
      // console.log('🔑 Getting access token...');
      
      const auth = base64.encode(`${this.consumerKey}:${this.consumerSecret}`);
      
      const response = await axios.get(
        `${this.baseURL}/oauth/v1/generate?grant_type=client_credentials`,
        {
          headers: {
            'Authorization': `Basic ${auth}`,
            'Cache-Control': 'no-cache',
          },
          timeout: 10000,
        }
      );
      
      // console.log('✅ Token received');
      return response.data.access_token;
      
    } catch (error) {
      console.error('❌ Token error:', error.response?.data || error.message);
      throw new Error(`Failed to get access token: ${error.response?.data?.errorMessage || error.message}`);
    }
  }

  async stkPush(phoneNumber, amount, accountReference, transactionDesc) {
    try {
      // console.log('💰 Initiating STK Push...');
      
      // Validate amount
      if (amount < 10 || amount > 150000) {
        throw new Error('Amount must be between KES 10 and KES 150,000');
      }
      
      // Get token
      const accessToken = await this.getAccessToken();
      
      // Generate timestamp (YYYYMMDDHHmmss)
      const now = new Date();
      const timestamp = 
        now.getFullYear().toString() +
        (now.getMonth() + 1).toString().padStart(2, '0') +
        now.getDate().toString().padStart(2, '0') +
        now.getHours().toString().padStart(2, '0') +
        now.getMinutes().toString().padStart(2, '0') +
        now.getSeconds().toString().padStart(2, '0');
      
      // Generate password
      const passwordData = `${this.businessShortCode}${this.passkey}${timestamp}`;
      const password = base64.encode(passwordData);
      
      // Format phone
      const formattedPhone = this.formatPhoneNumber(phoneNumber);
      
      // Prepare payload
      const payload = {
        BusinessShortCode: this.businessShortCode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: Math.floor(amount), // Ensure integer
        PartyA: formattedPhone,
        PartyB: this.businessShortCode,
        PhoneNumber: formattedPhone,
        CallBackURL: this.callbackURL,
        AccountReference: accountReference.substring(0, 12).toUpperCase(),
        TransactionDesc: transactionDesc.substring(0, 13),
      };
      
      // Make request
      const response = await axios.post(
        `${this.baseURL}/mpesa/stkpush/v1/processrequest`,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          timeout: 15000,
        }
      );
      
      // console.log('✅ STK Push successful:', response.data);
      return {
        success: true,
        data: response.data,
        merchantRequestId: response.data.MerchantRequestID,
        checkoutRequestId: response.data.CheckoutRequestID,
        responseCode: response.data.ResponseCode,
        responseDescription: response.data.ResponseDescription,
        customerMessage: response.data.CustomerMessage
      };
      
    } catch (error) {
      console.error('❌ STK Push failed:', error.response?.data || error.message);
      
      // Handle specific error cases
      if (error.response?.status === 404) {
        throw new Error('M-Pesa service unavailable. Please try again later.');
      }
      
      if (error.response?.data?.errorCode === '404.001.03') {
        throw new Error('Invalid access token. Please check your credentials.');
      }
      
      throw new Error(error.response?.data?.errorMessage || error.message);
    }
  }

  async queryStatus(checkoutRequestId) {
    try {
      // console.log('🔍 Querying transaction status...');
      
      const accessToken = await this.getAccessToken();
      
      const now = new Date();
      const timestamp = 
        now.getFullYear().toString() +
        (now.getMonth() + 1).toString().padStart(2, '0') +
        now.getDate().toString().padStart(2, '0') +
        now.getHours().toString().padStart(2, '0') +
        now.getMinutes().toString().padStart(2, '0') +
        now.getSeconds().toString().padStart(2, '0');
      
      const passwordData = `${this.businessShortCode}${this.passkey}${timestamp}`;
      const password = base64.encode(passwordData);
      
      const payload = {
        BusinessShortCode: this.businessShortCode,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: checkoutRequestId
      };
      
      const response = await axios.post(
        `${this.baseURL}/mpesa/stkpushquery/v1/query`,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          timeout: 10000,
        }
      );
      
      return {
        success: response.data.ResultCode === '0',
        data: response.data,
        resultCode: response.data.ResultCode,
        resultDesc: response.data.ResultDesc
      };
      
    } catch (error) {
      console.error('❌ Query failed:', error.message);
      throw new Error('Failed to query transaction status');
    }
  }

  formatPhoneNumber(phone) {
    // Remove all non-digits
    let cleaned = phone.replace(/\D/g, '');
    
    // Handle different formats
    if (cleaned.startsWith('0')) {
      cleaned = '254' + cleaned.substring(1);
    } else if (cleaned.startsWith('7')) {
      cleaned = '254' + cleaned;
    } else if (cleaned.startsWith('254') && cleaned.length === 12) {
      // Already in correct format
    } else if (cleaned.startsWith('+254')) {
      cleaned = cleaned.substring(1);
    } else {
      throw new Error('Invalid phone number format. Please use 07XXXXXXXX format.');
    }
    
    // Validate length
    if (cleaned.length !== 12) {
      throw new Error(`Invalid phone number length. Expected 12 digits, got ${cleaned.length}`);
    }
    
    return cleaned;
  }
}

// Create and export a single instance
export const mpesaService = new MPesaService();
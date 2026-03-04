export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET() {
  try {
    // Use correct server-side environment variables (not NEXT_PUBLIC_)
    const consumerKey = process.env.MPESA_CONSUMER_KEY;
    const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
    const environment = process.env.MPESA_ENV || 'sandbox';
    
    const baseURL = environment === 'production' 
      ? 'https://api.safaricom.co.ke'
      : 'https://sandbox.safaricom.co.ke';
    
    // Check if credentials exist
    if (!consumerKey || !consumerSecret) {
      return NextResponse.json({
        success: false,
        message: 'Missing credentials',
        consumerKey: !!consumerKey,
        consumerSecret: !!consumerSecret,
        hint: 'Check MPESA_CONSUMER_KEY and MPESA_CONSUMER_SECRET in .env.local'
      }, { status: 400 });
    }
    
    // Try to get access token using built-in Buffer (no external package needed)
    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
    
    // console.log('🔄 Testing M-Pesa credentials...');
    // console.log('- Environment:', environment);
    // console.log('- Base URL:', baseURL);
    
    const response = await axios.get(
      `${baseURL}/oauth/v1/generate?grant_type=client_credentials`,
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
        timeout: 30000, // Increased timeout to 30 seconds
      }
    );
    
    // console.log('✅ M-Pesa credentials valid!');
    
    return NextResponse.json({
      success: true,
      message: 'Credentials are valid!',
      hasAccessToken: !!response.data.access_token,
      tokenType: response.data.token_type,
      expiresIn: response.data.expires_in,
      environment: environment,
      baseURL: baseURL,
    });
    
  } catch (error) {
    console.error('❌ M-Pesa auth test failed:', error.message);
    
    // Provide more helpful error messages
    let errorHint = '';
    if (error.code === 'ETIMEDOUT') {
      errorHint = 'Network timeout - Check your internet connection or firewall settings';
    } else if (error.code === 'ECONNREFUSED') {
      errorHint = 'Connection refused - Safaricom API may be down or blocked';
    } else if (error.response?.status === 400) {
      errorHint = 'Invalid credentials - Check your consumer key and secret';
    }
    
    return NextResponse.json({
      success: false,
      message: 'Failed to authenticate',
      error: error.message,
      errorCode: error.code,
      hint: errorHint,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
    }, { status: 500 });
  }
}

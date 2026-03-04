import { mpesaService } from '@/lib/server/mpesa';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { phone, amount, accountReference, transactionDesc } = await request.json();

    // Validate input
    if (!phone || !amount || !accountReference) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate phone number
    const phoneRegex = /^(07\d{8}|7\d{8}|\+2547\d{8}|2547\d{8})$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
      return NextResponse.json(
        { error: 'Please enter a valid Kenyan phone number (07XXXXXXXX)' },
        { status: 400 }
      );
    }

    // Initiate STK Push
    const result = await mpesaService.stkPush(
      phone,
      parseFloat(amount),
      accountReference,
      transactionDesc || 'Appointment Booking'
    );

    return NextResponse.json({
      success: true,
      data: result,
      message: 'Payment initiated successfully'
    });

  } catch (error) {
    console.error('STK Push error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error.message || 'Payment initiation failed' 
      },
      { status: 500 }
    );
  }
}
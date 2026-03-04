export const runtime = 'nodejs';

import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();
    // console.log('📦 M-Pesa Callback Received:', JSON.stringify(body, null, 2));

    const stkCallback = body.Body?.stkCallback;
    const resultCode = stkCallback?.ResultCode;
    const resultDesc = stkCallback?.ResultDesc;
    const checkoutId = stkCallback?.CheckoutRequestID;

    let amount, mpesaReceipt, phone;
    const metadataItems = stkCallback?.CallbackMetadata?.Item;

    if (resultCode === 0 && Array.isArray(metadataItems)) {
      amount = metadataItems.find(i => i.Name === 'Amount')?.Value;
      mpesaReceipt = metadataItems.find(i => i.Name === 'MpesaReceiptNumber')?.Value;
      phone = metadataItems.find(i => i.Name === 'PhoneNumber')?.Value;

      // console.log('✅ Payment Successful:', { receipt: mpesaReceipt, amount, phone, checkoutId });
      // TODO: Save to DB here
    } else {
      // console.log('❌ Payment Failed:', { resultCode, resultDesc, checkoutId });
    }

    return NextResponse.json({ ResultCode: 0, ResultDesc: 'Success' });
  } catch (error) {
    console.error('Callback processing error:', error);
    return NextResponse.json({ ResultCode: 1, ResultDesc: 'Failed' });
  }
}

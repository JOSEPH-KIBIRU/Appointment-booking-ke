import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { full_name, email, phone, password, business_name, business_type } = await request.json();

    const supabase = createRouteHandlerClient({ cookies });

    // 1. Create user in auth.users (but set email confirmation to false)
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name,
          phone,
          business_name,
          business_type,
          role: 'pending_business', // Special role for pending approval
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/login`,
      },
    });

    if (authError) throw authError;

    // 2. Create/update user profile with pending status
    const { error: profileError } = await supabase
      .from('users')
      .upsert({
        id: authData.user.id,
        email,
        full_name,
        phone: phone || null,
        role: 'pending_business',
        status: 'pending',
        created_at: new Date().toISOString(),
      });

    if (profileError) throw profileError;

    // 3. Send notification to admin (you can implement this later)
    // await sendAdminNotification(newRequest);

    return NextResponse.json({ 
      success: true, 
      message: 'Request submitted successfully' 
    });

  } catch (error) {
    console.error('Request error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to submit request' },
      { status: 500 }
    );
  }
}
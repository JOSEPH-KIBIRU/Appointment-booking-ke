import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { full_name, email, phone, password, business_name, business_type } = await request.json()
    
    // console.log('📝 Registration attempt:', { email, full_name, business_name, phone });

    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          get(name) {
            return cookieStore.get(name)?.value
          },
          set(name, value, options) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name, options) {
            cookieStore.set({ name, value: '', ...options })
          },
        },
      }
    )

    // Create user in auth.users with ALL metadata including phone
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name,
          phone: phone || '',  // Make sure phone is included
          business_name,
          business_type,
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/login`,
      },
    })

    if (authError) {
      console.error('❌ Auth error:', authError)
      return NextResponse.json(
        { error: authError.message },
        { status: 500 }
      )
    }

    // console.log('✅ Auth user created:', authData.user?.id);

    // The trigger will now create the profile with all fields including phone
    return NextResponse.json({ 
      success: true, 
      message: 'Registration submitted for approval' 
    })

  } catch (error) {
    console.error('❌ Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
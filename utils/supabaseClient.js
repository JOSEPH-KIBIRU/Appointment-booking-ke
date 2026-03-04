import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// 🔴 Fail fast if env vars are missing (prevents silent hangs)
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('❌ Missing Supabase environment variables. Check your .env.local file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,           // ✅ Keep session in localStorage
    autoRefreshToken: true,         // ✅ Auto-refresh tokens
    detectSessionInUrl: true,       // ✅ Handle OAuth/callback redirects
    flowType: 'pkce',               // ✅ More secure than implicit flow
  },
  global: {
    headers: {
      'X-Client-Info': 'unaPay-web-app',
    },
  },
  // Optional: Add timeout for debugging
  fetch: (url, options) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
    return fetch(url, { ...options, signal: controller.signal })
      .finally(() => clearTimeout(timeoutId));
  },
});
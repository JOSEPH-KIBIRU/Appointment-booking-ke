# M-Pesa STK Push Error Analysis Log

**Analysis Date:** 2026-01-19
**Project:** Appointment Booking App
**Environment:** Sandbox (using ngrok for HTTPS)

---

## 🚨 RUNTIME ERROR DETECTED

### Network Connection Timeout to Safaricom API
**Error Message:**
```
❌ Failed to get M-Pesa token: connect ETIMEDOUT 45.223.20.17:443
```

**Problem:** The application cannot establish a connection to Safaricom's sandbox API server at `https://sandbox.safaricom.co.ke` (IP: 45.223.20.17:443).

**Possible Causes:**

1. **Firewall/Network Blocking** - Your network (ISP, corporate firewall, or Windows Firewall) may be blocking outbound connections to Safaricom's servers.

2. **VPN Required** - Some networks require VPN to access certain external APIs.

3. **Safaricom API Server Down** - The sandbox server may be temporarily unavailable.

4. **DNS Resolution Issues** - The domain may not be resolving correctly.

5. **Proxy Configuration** - If you're behind a proxy, axios may need proxy configuration.

**Diagnostic Steps:**

```bash
# 1. Test if you can reach Safaricom's sandbox API
curl -v https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials

# 2. Test DNS resolution
nslookup sandbox.safaricom.co.ke

# 3. Test TCP connectivity (PowerShell)
Test-NetConnection -ComputerName sandbox.safaricom.co.ke -Port 443

# 4. Check if ping works
ping sandbox.safaricom.co.ke
```

**Solutions:**

1. **Try a different network** - Switch to mobile hotspot or different WiFi
2. **Disable VPN** if you have one running, or **enable VPN** if your network blocks external APIs
3. **Check Windows Firewall** - Ensure Node.js is allowed through
4. **Add timeout and retry logic** to handle transient failures
5. **Use a proxy** if required by your network

**Confirmed Status:** ❌ **NO ACCESS TOKEN AVAILABLE** - Network cannot reach Safaricom servers.

**Code Fix - Add retry logic to [`src/lib/server/mpesa.js`](src/lib/server/mpesa.js):** ✅ APPLIED

```javascript
async getAccessToken(retries = 3) {
  if (this.accessToken && Date.now() < this.tokenExpiry) {
    return this.accessToken;
  }

  const auth = Buffer.from(
    `${this.consumerKey}:${this.consumerSecret}`,
  ).toString("base64");

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`🔄 Attempting to get access token (attempt ${attempt}/${retries})...`);
      const response = await axios.get(
        `${this.baseURL}/oauth/v1/generate?grant_type=client_credentials`,
        {
          headers: { Authorization: `Basic ${auth}` },
          timeout: 30000, // 30 second timeout
        }
      );
      
      if (!response.data.access_token)
        throw new Error("No access token returned");

      this.accessToken = response.data.access_token;
      this.tokenExpiry = Date.now() + response.data.expires_in * 1000;

      console.log(
        "✅ Access token received:",
        this.accessToken.substring(0, 20) + "...",
      );
      return this.accessToken;
    } catch (err) {
      console.error(`❌ Attempt ${attempt} failed:`, err.message);
      if (attempt === retries) {
        throw new Error(`Failed to get M-Pesa token after ${retries} attempts: ${err.message}`);
      }
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
}
```

---

## 🔴 CRITICAL ERRORS

### 1. **Callback Route File Naming Error**
**File:** [`src/app/api/mpesa/callback/router.js`](src/app/api/mpesa/callback/router.js)  
**Error Type:** Next.js Route Handler Convention Violation

**Problem:** The file is named `router.js` instead of `route.js`. Next.js App Router requires API route handlers to be named `route.js` (or `route.ts`).

**Impact:** The callback endpoint `/api/mpesa/callback` will return a 404 error. M-Pesa will not be able to send payment confirmation callbacks, causing:
- No payment status updates
- Unable to verify if payment was successful
- Transaction records won't be updated

**Fix:**
```bash
# Rename the file
mv src/app/api/mpesa/callback/router.js src/app/api/mpesa/callback/route.js
```

---

### 2. **Test Auth Route File Naming Error**
**File:** [`src/app/api/mpesa/test-auth/router.js`](src/app/api/mpesa/test-auth/router.js)  
**Error Type:** Next.js Route Handler Convention Violation

**Problem:** Same as above - file is named `router.js` instead of `route.js`.

**Impact:** The test auth endpoint `/api/mpesa/test-auth` will return a 404 error.

**Fix:**
```bash
# Rename the file
mv src/app/api/mpesa/test-auth/router.js src/app/api/mpesa/test-auth/route.js
```

---

### 3. **Callback URL Missing Path**
**File:** [`.env.local`](.env.local:11)  
**Error Type:** Configuration Error

**Current Value:**
```
MPESA_CALLBACK_URL=https://nondiathermanous-arletta-bijugate.ngrok-free.dev 
```

**Problem:** The callback URL points to the root domain but doesn't include the `/api/mpesa/callback` path. M-Pesa will send callbacks to the wrong endpoint.

**Impact:** Even after fixing the route file naming, callbacks will still fail because they're sent to `/` instead of `/api/mpesa/callback`.

**Fix:**
```env
MPESA_CALLBACK_URL=https://nondiathermanous-arletta-bijugate.ngrok-free.dev/api/mpesa/callback
```

---

### 4. **Test Credentials Page File Naming Error**
**File:** [`src/app/test-credentials/pages.js`](src/app/test-credentials/pages.js)  
**Error Type:** Next.js Page Convention Violation

**Problem:** The file is named `pages.js` instead of `page.js`. Next.js App Router requires page components to be named `page.js` (or `page.tsx`).

**Impact:** The `/test-credentials` route will return a 404 error.

**Fix:**
```bash
# Rename the file
mv src/app/test-credentials/pages.js src/app/test-credentials/page.js
```

---

## 🟠 MEDIUM SEVERITY ISSUES

### 5. **Inconsistent Environment Variable Naming**
**Files:** 
- [`src/lib/server/mpesa.js`](src/lib/server/mpesa.js) - Uses `MPESA_CONSUMER_KEY`
- [`src/app/api/mpesa/test-auth/router.js`](src/app/api/mpesa/test-auth/router.js:7-8) - Uses `NEXT_PUBLIC_MPESA_CONSUMER_KEY`

**Problem:** The test-auth route uses `NEXT_PUBLIC_` prefixed environment variables which:
1. Don't exist in `.env.local`
2. Would expose sensitive credentials to the client-side if they did exist

**Impact:** The test-auth endpoint will always fail with "Missing credentials" error.

**Fix:** Update [`src/app/api/mpesa/test-auth/router.js`](src/app/api/mpesa/test-auth/router.js:7-9) to use server-side env vars:
```javascript
const consumerKey = process.env.MPESA_CONSUMER_KEY;
const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
const environment = process.env.MPESA_ENV || 'sandbox';
```

---

### 6. **Test Credentials Page Checking Wrong Environment Variables**
**File:** [`src/app/test-credentials/pages.js`](src/app/test-credentials/pages.js:70-88)

**Problem:** The page checks for `NEXT_PUBLIC_MPESA_*` environment variables that don't exist in `.env.local`. The actual variables are:
- `MPESA_CONSUMER_KEY` (not `NEXT_PUBLIC_MPESA_CONSUMER_KEY`)
- `MPESA_CONSUMER_SECRET` (not `NEXT_PUBLIC_MPESA_CONSUMER_SECRET`)
- `MPESA_SHORTCODE` (not `NEXT_PUBLIC_MPESA_BUSINESS_SHORTCODE`)
- `MPESA_ENV` (not `NEXT_PUBLIC_MPESA_ENVIRONMENT`)

**Impact:** The environment variable check will always show "Missing" even when variables are correctly set.

**Note:** Server-side environment variables cannot be accessed from client components. This check should be done via an API endpoint.

---

### 7. **Phone Number Format Mismatch**
**Files:**
- [`src/components/KenyanPhoneInput.jsx`](src/components/KenyanPhoneInput.jsx:56) - Validates `07XXXXXXXX` format
- [`src/app/test-payment/page.js`](src/app/test-payment/page.js:61) - Suggests test number `254708374149`

**Problem:** The phone input component expects format `07XXXXXXXX` (10 digits starting with 07), but the test instructions suggest using `254708374149` (12 digits with country code).

**Impact:** Users following the test instructions will get validation errors.

**Fix Options:**
1. Update test instructions to use `0708374149` format
2. Or update the phone input to accept both formats

---

### 8. **Missing Runtime Declaration in Test Auth Route**
**File:** [`src/app/api/mpesa/test-auth/router.js`](src/app/api/mpesa/test-auth/router.js)

**Problem:** Missing `export const runtime = 'nodejs';` declaration that exists in other route files.

**Impact:** May cause issues with certain Node.js APIs in edge runtime environments.

**Fix:** Add at the top of the file:
```javascript
export const runtime = 'nodejs';
```

---

## 🟡 LOW SEVERITY ISSUES

### 9. **Trailing Space in Callback URL**
**File:** [`.env.local`](.env.local:11)

**Problem:** There's a trailing space after the URL:
```
MPESA_CALLBACK_URL=https://nondiathermanous-arletta-bijugate.ngrok-free.dev 
```

**Impact:** Could cause URL parsing issues in some cases.

**Fix:** Remove the trailing space.

---

### 10. **Empty Utility File**
**File:** [`utils/mpesa-payment.js`](utils/mpesa-payment.js)

**Problem:** The file is empty but exists in the project.

**Impact:** No functional impact, but indicates incomplete implementation or dead code.

**Recommendation:** Either implement the utility functions or remove the file.

---

### 11. **Unnecessary base-64 Package Import**
**File:** [`src/app/api/mpesa/test-auth/router.js`](src/app/api/mpesa/test-auth/router.js:3)

**Problem:** Uses `base-64` npm package when Node.js has built-in `Buffer.from().toString('base64')`.

**Impact:** Unnecessary dependency. The main mpesa.js file correctly uses the built-in method.

**Fix:**
```javascript
// Instead of:
import base64 from 'base-64';
const auth = base64.encode(`${consumerKey}:${consumerSecret}`);

// Use:
const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
```

---

## 📋 SUMMARY OF REQUIRED FIXES

| Priority | Issue | File | Action |
|----------|-------|------|--------|
| 🔴 Critical | Wrong filename | `callback/router.js` | Rename to `route.js` |
| 🔴 Critical | Wrong filename | `test-auth/router.js` | Rename to `route.js` |
| 🔴 Critical | Missing callback path | `.env.local` | Add `/api/mpesa/callback` to URL |
| 🔴 Critical | Wrong filename | `test-credentials/pages.js` | Rename to `page.js` |
| 🟠 Medium | Wrong env var names | `test-auth/router.js` | Use `MPESA_*` instead of `NEXT_PUBLIC_MPESA_*` |
| 🟠 Medium | Wrong env var names | `test-credentials/pages.js` | Update env var references |
| 🟠 Medium | Phone format mismatch | `test-payment/page.js` | Update test instructions |
| 🟠 Medium | Missing runtime | `test-auth/router.js` | Add runtime declaration |
| 🟡 Low | Trailing space | `.env.local` | Remove trailing space |
| 🟡 Low | Empty file | `utils/mpesa-payment.js` | Implement or remove |
| 🟡 Low | Unnecessary import | `test-auth/router.js` | Use built-in Buffer |

---

## 🔧 QUICK FIX COMMANDS

```bash
# Fix file naming issues
mv src/app/api/mpesa/callback/router.js src/app/api/mpesa/callback/route.js
mv src/app/api/mpesa/test-auth/router.js src/app/api/mpesa/test-auth/route.js
mv src/app/test-credentials/pages.js src/app/test-credentials/page.js
```

---

## ✅ VERIFICATION CHECKLIST

After applying fixes, verify:

1. [ ] `/api/mpesa/callback` endpoint responds (POST request)
2. [ ] `/api/mpesa/test-auth` endpoint responds (GET request)
3. [ ] `/test-credentials` page loads
4. [ ] STK Push initiates successfully
5. [ ] Callback URL is reachable from M-Pesa (test with ngrok inspector)
6. [ ] Phone number validation accepts test number format

---

## 🔍 DEBUGGING TIPS

1. **Check ngrok logs:** Visit `http://127.0.0.1:4040` to see incoming requests
2. **Verify callback URL:** Ensure ngrok is running and URL matches `.env.local`
3. **Test OAuth:** Use `/api/mpesa/test-auth` to verify credentials work
4. **Check server logs:** Look for `📦`, `✅`, `❌` emoji prefixed logs

---

*Generated by M-Pesa Integration Analysis Tool*

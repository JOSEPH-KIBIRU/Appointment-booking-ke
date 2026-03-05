"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../../utils/supabaseClient";
import { useSearchParams, useRouter } from "next/navigation";
import KenyanPhoneInput from "@/components/KenyanPhoneInput";
import MPesaButton from "@/components/MPesaButton";
import Link from "next/link";
import { showReceipt } from "@/components/Receipt";

export default function BookingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [business, setBusiness] = useState(null);
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1); // 1: details, 2: payment, 3: confirmation
  const [guestInfo, setGuestInfo] = useState({
    name: "",
    phone: "",
    email: "",
  });
  const [bookingDetails, setBookingDetails] = useState({
    date: "",
    time: "",
    notes: "",
  });
  const [availableTimes, setAvailableTimes] = useState([]);
  const [bookingData, setBookingData] = useState(null); // Store completed booking
  const [error, setError] = useState("");
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

  const businessId = searchParams.get("business");
  const serviceId = searchParams.get("service");

  useEffect(() => {
    if (!businessId || !serviceId) {
      router.push("/businesses");
      return;
    }
    fetchData();
  }, [businessId, serviceId]);

  const fetchData = async () => {
    try {
      // Fetch business details
      const { data: businessData } = await supabase
        .from("businesses")
        .select("*")
        .eq("id", businessId)
        .single();

      // Fetch service details
      const { data: serviceData } = await supabase
        .from("services")
        .select("*")
        .eq("id", serviceId)
        .single();

      setBusiness(businessData);
      setService(serviceData);

      // Generate available times (9 AM - 5 PM, every hour)
      const times = [];
      for (let hour = 9; hour <= 17; hour++) {
        times.push(`${hour.toString().padStart(2, "0")}:00`);
        if (hour < 17) {
          times.push(`${hour.toString().padStart(2, "0")}:30`);
        }
      }
      setAvailableTimes(times);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load booking details");
    } finally {
      setLoading(false);
    }
  };

  const handleDetailsSubmit = async (e) => {
    e.preventDefault();

    if (!bookingDetails.date || !bookingDetails.time) {
      setError("Please select date and time");
      return;
    }

    if (!guestInfo.name || !guestInfo.phone) {
      setError("Please enter your name and phone number");
      return;
    }

    // Validate phone
    const phoneDigits = guestInfo.phone.replace(/\D/g, "");
    if (phoneDigits.length < 9) {
      setError("Please enter a valid Kenyan phone number");
      return;
    }

    setStep(2);
  };

 const handlePaymentSuccess = async (transactionCode) => {
  try {
    setPaymentConfirmed(true);
    
    // Format phone for database
    const formattedPhone = guestInfo.phone.replace(/\D/g, '');
    
    // Try to find existing user
    let userId = null;
    let userEmail = guestInfo.email || null;
    
    // Check if user exists with this phone
    const { data: existingUser } = await supabase
      .from('users')
      .select('id, email')
      .eq('phone', formattedPhone)
      .maybeSingle();

    if (existingUser) {
      userId = existingUser.id;
      console.log('Found existing user:', userId);
    } else {
      // For guest bookings, we don't create a user account
      // We'll store booking with client_phone and client_name directly
      console.log('Guest booking - no user account created');
    }

    // Create a unique booking number
    const bookingNumber = `BK-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    
    // Create the booking - using client_phone and client_name for guests
    const bookingData = {
      booking_number: bookingNumber,
      business_id: businessId,
      service_id: serviceId,
      booking_date: bookingDetails.date,
      booking_time: bookingDetails.time,
      duration: service.duration,
      amount: service.price,
      status: 'confirmed',
      payment_status: 'paid',
      notes: bookingDetails.notes,
      mpesa_receipt: transactionCode,
      client_phone: formattedPhone,
      client_name: guestInfo.name,
    };

    // Only add client_id if user exists
    if (userId) {
      bookingData.client_id = userId;
    }

    const { data, error } = await supabase
      .from('bookings')
      .insert([bookingData])
      .select()
      .single();

    if (error) {
      console.error('Booking error:', error);
      throw error;
    }

    // Store booking data for receipt
    setBookingData({
      id: data.id,
      bookingNumber: bookingNumber,
      businessName: business.name,
      serviceName: service.name,
      clientName: guestInfo.name,
      clientPhone: guestInfo.phone,
      amount: service.price,
      date: new Date(bookingDetails.date).toLocaleDateString('en-KE', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      time: bookingDetails.time,
      transactionCode: transactionCode,
      paymentDate: new Date().toLocaleDateString('en-KE'),
    });

    setStep(3);
    
  } catch (error) {
    console.error('Error creating booking:', error);
    setError('Failed to create booking. Please contact support.');
    setPaymentConfirmed(false);
  }
};

  const handlePaymentError = (error) => {
    setError("Payment failed. Please try again.");
    setPaymentConfirmed(false);
  };

  const handleFetchTransaction = async (transactionCode) => {
    // In production, verify with M-Pesa API
    // For now, simulate verification
    setPaymentConfirmed(true);

    // Format phone for database
    const formattedPhone = guestInfo.phone.replace(/\D/g, "");

    // Check if user exists
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("phone", formattedPhone)
      .maybeSingle();

    let userId = null;

    if (existingUser) {
      userId = existingUser.id;
    } else {
      const { data: newUser } = await supabase
        .from("users")
        .insert({
          phone: formattedPhone,
          full_name: guestInfo.name,
          email: guestInfo.email || null,
          role: "client",
        })
        .select()
        .single();
      userId = newUser.id;
    }

    // Create booking
    const bookingNumber = `BK-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

    const { data } = await supabase
      .from("bookings")
      .insert({
        booking_number: bookingNumber,
        client_id: userId,
        business_id: businessId,
        service_id: serviceId,
        booking_date: bookingDetails.date,
        booking_time: bookingDetails.time,
        duration: service.duration,
        amount: service.price,
        status: "confirmed",
        payment_status: "paid",
        notes: bookingDetails.notes,
        mpesa_receipt: transactionCode,
        client_phone: formattedPhone,
        client_name: guestInfo.name,
      })
      .select()
      .single();

    setBookingData({
      id: data.id,
      bookingNumber: bookingNumber,
      businessName: business.name,
      serviceName: service.name,
      clientName: guestInfo.name,
      clientPhone: guestInfo.phone,
      amount: service.price,
      date: new Date(bookingDetails.date).toLocaleDateString("en-KE", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      time: bookingDetails.time,
      transactionCode: transactionCode,
      paymentDate: new Date().toLocaleDateString("en-KE"),
    });

    setStep(3);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (error && step === 1) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-6xl mb-4">❌</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Booking Error
            </h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link
              href="/businesses"
              className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-lg"
            >
              Browse Services
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            {["Your Details", "Payment", "Confirmation"].map((s, i) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold
                  ${
                    step > i + 1
                      ? "bg-green-600 text-white"
                      : step === i + 1
                        ? "bg-emerald-600 text-white"
                        : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {step > i + 1 ? "✓" : i + 1}
                </div>
                <span className="ml-2 text-sm font-medium text-gray-700 hidden sm:block">
                  {s}
                </span>
              </div>
            ))}
          </div>
        </div>

        {step === 1 && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Complete Your Booking
            </h1>
            <p className="text-gray-600 mb-6">
              No account needed - just enter your details below
            </p>

            {/* Service Summary */}
            <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl p-6 mb-8">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{business?.name}</p>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {service?.name}
                  </h2>
                  <p className="text-gray-600 mb-4">{service?.description}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
                      ⏱️ {service?.duration} mins
                    </span>
                    <span className="text-2xl font-bold text-emerald-600">
                      KES {service?.price}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handleDetailsSubmit} className="space-y-6">
              {/* Guest Information */}
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <h3 className="font-bold text-blue-800 mb-2">
                  📱 Your Contact Information
                </h3>
                <p className="text-sm text-blue-600 mb-4">
                  We'll send your booking confirmation via SMS
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Your Full Name
                    </label>
                    <input
                      type="text"
                      value={guestInfo.name}
                      onChange={(e) =>
                        setGuestInfo({ ...guestInfo, name: e.target.value })
                      }
                      placeholder="John Doe"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Phone Number (for M-Pesa & SMS)
                    </label>
                    <KenyanPhoneInput
                      value={guestInfo.phone}
                      onChange={(value) =>
                        setGuestInfo({ ...guestInfo, phone: value })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Email (Optional)
                    </label>
                    <input
                      type="email"
                      value={guestInfo.email}
                      onChange={(e) =>
                        setGuestInfo({ ...guestInfo, email: e.target.value })
                      }
                      placeholder="you@example.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Date Selection */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Select Date
                </label>
                <input
                  type="date"
                  value={bookingDetails.date}
                  onChange={(e) =>
                    setBookingDetails({
                      ...bookingDetails,
                      date: e.target.value,
                    })
                  }
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Time Selection */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Select Time
                </label>
                <select
                  value={bookingDetails.time}
                  onChange={(e) =>
                    setBookingDetails({
                      ...bookingDetails,
                      time: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  required
                >
                  <option value="">Choose a time</option>
                  {availableTimes.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Additional Notes (Optional)
                </label>
                <textarea
                  value={bookingDetails.notes}
                  onChange={(e) =>
                    setBookingDetails({
                      ...bookingDetails,
                      notes: e.target.value,
                    })
                  }
                  placeholder="Any special requests or information for the business"
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-yellow-800 text-sm flex items-center gap-2">
                  <span>⚠️</span>
                  <span>
                    You will only be charged after confirming your details
                  </span>
                </p>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-6 rounded-xl text-lg transition-colors"
              >
                Continue to Payment
              </button>
            </form>
          </div>
        )}

        {step === 2 && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              Complete Payment
            </h1>
            {/* Customer Summary */}
            <div className="bg-blue-50 rounded-xl p-4 mb-4">
              <p className="text-sm text-blue-800">
                <span className="font-bold">Booking for:</span> {guestInfo.name}{" "}
                • {guestInfo.phone}
              </p>
            </div>
            {/* Booking Summary */}
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <h3 className="font-bold text-gray-900 mb-4">Booking Summary</h3>
              <div className="space-y-2 text-gray-600">
                <p>
                  <span className="font-medium">Business:</span>{" "}
                  {business?.name}
                </p>
                <p>
                  <span className="font-medium">Service:</span> {service?.name}
                </p>
                <p>
                  <span className="font-medium">Date:</span>{" "}
                  {new Date(bookingDetails.date).toLocaleDateString("en-KE", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p>
                  <span className="font-medium">Time:</span>{" "}
                  {bookingDetails.time}
                </p>
                <p>
                  <span className="font-medium">Duration:</span>{" "}
                  {service?.duration} minutes
                </p>
                <div className="pt-2 border-t border-gray-200 mt-2">
                  <p className="font-bold text-gray-900">
                    Total: KES {service?.price}
                  </p>
                </div>
              </div>
            </div>
            {/* M-Pesa Payment */}
          
            <MPesaButton
              amount={service?.price}
              phone={guestInfo.phone}
              accountReference={`BOOK-${Date.now().toString().slice(-6)}`}
              description={`${service?.name} at ${business?.name}`}
              onPaymentInitiated={(data) => {
                // console.log("Payment initiated:", data);
                // Optional: Store checkout request ID
              }}
              onPaymentConfirmed={handlePaymentSuccess}
              onError={handlePaymentError}
            />
            {error && (
              <div className="mt-4 p-3 bg-red-50 text-red-800 rounded-lg text-center">
                {error}
              </div>
            )}
            <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
              <p className="text-yellow-800 text-sm flex items-center gap-2">
                <span>🔒</span>
                <span>
                  Your payment is secure. Booking will be created after payment
                  confirmation.
                </span>
              </p>
            </div>
            <button
              onClick={() => setStep(1)}
              className="w-full mt-4 text-gray-600 hover:text-gray-800 font-medium"
            >
              ← Back to Details
            </button>
          </div>
        )}
        {step === 3 && bookingData && (
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="text-7xl mb-6">🎉</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Payment Successful!
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Thank you, {guestInfo.name}! Your booking is confirmed.
            </p>

            <div className="bg-emerald-50 rounded-xl p-6 mb-8 text-left">
              <h3 className="font-bold text-gray-900 mb-4">Booking Details</h3>
              <div className="space-y-2 text-gray-700">
                <p>
                  <span className="font-medium">Booking #:</span>{" "}
                  {bookingData.bookingNumber}
                </p>
                <p>
                  <span className="font-medium">Business:</span>{" "}
                  {bookingData.businessName}
                </p>
                <p>
                  <span className="font-medium">Service:</span>{" "}
                  {bookingData.serviceName}
                </p>
                <p>
                  <span className="font-medium">Date:</span> {bookingData.date}
                </p>
                <p>
                  <span className="font-medium">Time:</span> {bookingData.time}
                </p>
                <p>
                  <span className="font-medium">Amount:</span> KES{" "}
                  {bookingData.amount}
                </p>
                <p>
                  <span className="font-medium">Transaction:</span>{" "}
                  {bookingData.transactionCode}
                </p>
                <p>
                  <span className="font-medium">Phone:</span>{" "}
                  {bookingData.clientPhone}
                </p>
              </div>
            </div>

            {/* Receipt Button - ONLY appears in Step 3 */}
            <button
              onClick={() => showReceipt(bookingData)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 mx-auto mb-6"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                />
              </svg>
              View Receipt
            </button>

            <div className="space-y-3">
              <p className="text-gray-600">
                A confirmation SMS has been sent to {guestInfo.phone}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
                <Link
                  href="/"
                  className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg"
                >
                  Home
                </Link>
                <Link
                  href="/businesses"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-lg"
                >
                  Browse More Services
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

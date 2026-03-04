import Link from 'next/link';

export default function HowItWorksPage() {
  const steps = [
    {
      number: 1,
      title: "Register Your Business",
      description: "Sign up in minutes with just your business details and M-Pesa paybill/till number.",
      icon: "📝",
      color: "bg-green-100",
      darkColor: "dark:bg-green-900/40",
      textColor: "text-green-700",
      darkTextColor: "dark:text-green-300"
    },
    {
      number: 2,
      title: "Set Up Your Services",
      description: "Add your services, pricing, and availability. Customize your booking page.",
      icon: "⚙️",
      color: "bg-blue-100",
      darkColor: "dark:bg-blue-900/40",
      textColor: "text-blue-700",
      darkTextColor: "dark:text-blue-300"
    },
    {
      number: 3,
      title: "Share Your Link",
      description: "Share your unique LunaPay link on social media or with customers directly.",
      icon: "🔗",
      color: "bg-purple-100",
      darkColor: "dark:bg-purple-900/40",
      textColor: "text-purple-700",
      darkTextColor: "dark:text-purple-300"
    },
    {
      number: 4,
      title: "Get Bookings & Payments",
      description: "Customers book and pay instantly via M-Pesa. You get confirmed appointments.",
      icon: "💰",
      color: "bg-orange-100",
      darkColor: "dark:bg-orange-900/40",
      textColor: "text-orange-700",
      darkTextColor: "dark:text-orange-300"
    }
  ];

  const forCustomers = [
    "Browse businesses by category and location",
    "View services, prices, and availability",
    "Book appointments in seconds",
    "Pay securely with M-Pesa",
    "Get SMS confirmations and reminders",
    "View booking history"
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300">
      
      {/* Hero - CENTERED */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 dark:from-green-800 dark:to-blue-900 text-white transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h1 className="text-5xl font-bold mb-6 drop-shadow-lg">
            How LunaPay Works
          </h1>
          <p className="text-xl max-w-3xl mx-auto text-green-50 dark:text-emerald-100 drop-shadow">
            Simple steps to start accepting M-Pesa payments and managing appointments online.
          </p>
        </div>
      </div>

      {/* Steps for Businesses */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white text-center mb-16">
          For Businesses
        </h2>
        
        <div className="relative">
          {/* Connecting Line - Dark Mode Aware */}
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-1 bg-green-200 dark:bg-green-900/40 transform -translate-y-1/2 transition-colors duration-300" />
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={step.number} className="relative text-center group">
                {/* Step Icon */}
                <div className={`w-24 h-24 ${step.color} ${step.darkColor} rounded-3xl flex items-center justify-center mx-auto mb-6 relative z-10 group-hover:scale-110 group-hover:shadow-xl transition-all duration-300`}>
                  <span className={`text-4xl ${step.textColor} ${step.darkTextColor} transition-colors`}>{step.icon}</span>
                </div>
                
                {/* Step Number Badge */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-green-600 dark:bg-green-500 text-white rounded-full flex items-center justify-center font-bold z-20 shadow-lg">
                  {step.number}
                </div>
                
                {/* Step Content */}
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* For Customers Section */}
      <div className="bg-gray-50 dark:bg-gray-900/50 py-20 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white text-center mb-16">
            For Customers
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Image */}
            <div className="order-2 md:order-1">
              <img 
                src="https://images.unsplash.com/photo-1556740714-a8395b3bf30f?q=80&w=2070&auto=format&fit=crop" 
                alt="Happy customer using app"
                className="rounded-3xl shadow-2xl dark:shadow-gray-900/50 border border-gray-200 dark:border-gray-800 transition-colors duration-300"
              />
            </div>
            
            {/* List */}
            <div className="order-1 md:order-2">
              <ul className="space-y-4">
                {forCustomers.map((item, index) => (
                  <li key={index} className="flex items-center gap-4 text-lg">
                    <span className="w-8 h-8 bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center font-bold transition-colors">
                      ✓
                    </span>
                    <span className="text-gray-700 dark:text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Link
                  href="/businesses"
                  className="inline-block bg-green-600 hover:bg-green-500 
                             dark:bg-green-500 dark:hover:bg-green-400 dark:text-gray-900
                             text-white font-bold py-4 px-8 rounded-xl text-lg 
                             transition-all duration-300 transform hover:scale-105 
                             shadow-lg hover:shadow-green-500/30"
                >
                  Find Services Near You →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Section - Dark Mode Optimized */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 
                        dark:from-gray-800 dark:to-gray-900
                        rounded-3xl p-8 md:p-12 text-white text-center 
                        border border-gray-700 dark:border-gray-700
                        transition-colors duration-300">
          <h2 className="text-3xl font-bold mb-4 drop-shadow">Watch How It Works</h2>
          <p className="text-xl text-gray-300 dark:text-gray-400 mb-8">2-minute video guide</p>
          <div className="max-w-3xl mx-auto bg-gray-700/50 dark:bg-gray-800/50 rounded-2xl aspect-video flex items-center justify-center border border-gray-600 dark:border-gray-700">
            <button 
              className="w-20 h-20 bg-green-600 hover:bg-green-500 
                         dark:bg-green-500 dark:hover:bg-green-400 
                         rounded-full flex items-center justify-center 
                         cursor-pointer hover:scale-110 transition-all duration-300 
                         shadow-lg hover:shadow-green-500/40"
              aria-label="Play video"
            >
              <span className="text-4xl ml-1 text-white dark:text-gray-900">▶</span>
            </button>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="bg-gradient-to-r from-green-600 to-blue-600 
                        dark:from-green-700 dark:to-blue-800
                        rounded-3xl p-8 md:p-12 text-white text-center 
                        transition-colors duration-300">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg text-green-50 dark:text-emerald-100 mb-8 max-w-2xl mx-auto">
            Join hundreds of Kenyan businesses using LunaPay today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/business/register"
              className="group bg-white text-green-700 hover:bg-green-50 
                         dark:bg-green-500 dark:hover:bg-green-400 dark:text-gray-900
                         font-bold py-4 px-8 rounded-xl text-lg 
                         transition-all duration-300 transform hover:scale-105 
                         shadow-lg"
            >
              <span className="flex items-center gap-2 justify-center">
                🇰🇪 Register Your Business
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </span>
            </Link>
            <Link
              href="/businesses"
              className="group bg-transparent border-2 border-white text-white 
                         hover:bg-white/10 dark:border-green-400 dark:text-green-300 
                         dark:hover:bg-green-500/10
                         font-bold py-4 px-8 rounded-xl text-lg 
                         transition-all duration-300 transform hover:scale-105"
            >
              <span className="flex items-center gap-2 justify-center">
                🔍 Browse Services
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
import Link from 'next/link';

export default function WhyChooseUsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 transition-colors duration-300">
      
      {/* Hero Section - CENTERED */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 dark:from-green-800 dark:to-blue-900 text-white transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h1 className="text-5xl font-bold mb-6 drop-shadow-lg">
            Why Choose LunaPay?
          </h1>
          <p className="text-xl max-w-3xl mx-auto text-green-50 dark:text-emerald-100 drop-shadow">
            Discover why hundreds of Kenyan businesses trust us for their appointment and payment needs.
          </p>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* Feature 1 */}
          <div className="flex gap-6 group">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/40 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-green-600 dark:group-hover:bg-green-500 transition-all duration-300">
              <span className="text-3xl text-green-700 dark:text-green-300 group-hover:text-white transition-colors">📱</span>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Instant M-Pesa Payments</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Accept payments instantly via M-Pesa STK Push. No waiting, no hassle. Funds are available immediately in your account.
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="flex gap-6 group">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/40 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600 dark:group-hover:bg-blue-500 transition-all duration-300">
              <span className="text-3xl text-blue-700 dark:text-blue-300 group-hover:text-white transition-colors">📅</span>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Smart Booking System</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Automated appointment scheduling with reminders. Reduce no-shows by up to 80%.
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="flex gap-6 group">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/40 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-purple-600 dark:group-hover:bg-purple-500 transition-all duration-300">
              <span className="text-3xl text-purple-700 dark:text-purple-300 group-hover:text-white transition-colors">📊</span>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Business Analytics</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Track revenue, popular services, and customer insights. Make data-driven decisions.
              </p>
            </div>
          </div>

          {/* Feature 4 */}
          <div className="flex gap-6 group">
            <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/40 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-orange-600 dark:group-hover:bg-orange-500 transition-all duration-300">
              <span className="text-3xl text-orange-700 dark:text-orange-300 group-hover:text-white transition-colors">🔒</span>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Secure & Reliable</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Bank-grade security for all transactions. Your data and money are always safe.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 
                        bg-gray-50 dark:bg-gray-900/50 
                        rounded-3xl p-8 md:p-12 
                        border border-gray-200 dark:border-gray-800
                        transition-colors duration-300">
          <div className="text-center">
            <div className="text-5xl font-bold text-green-600 dark:text-green-400 mb-2 drop-shadow">500+</div>
            <div className="text-gray-600 dark:text-gray-400 font-medium">Active Businesses</div>
          </div>
          <div className="text-center">
            <div className="text-5xl font-bold text-green-600 dark:text-green-400 mb-2 drop-shadow">10K+</div>
            <div className="text-gray-600 dark:text-gray-400 font-medium">Appointments Booked</div>
          </div>
          <div className="text-center">
            <div className="text-5xl font-bold text-green-600 dark:text-green-400 mb-2 drop-shadow">98%</div>
            <div className="text-gray-600 dark:text-gray-400 font-medium">Customer Satisfaction</div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to Join Them?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Start your free trial today and see why Kenyan businesses love LunaPay.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/business/register"
              className="group bg-green-600 hover:bg-green-500 
                         dark:bg-green-500 dark:hover:bg-green-400 dark:text-gray-900
                         text-white font-bold py-4 px-8 rounded-xl text-lg 
                         transition-all duration-300 transform hover:scale-105 
                         shadow-lg hover:shadow-green-500/30"
            >
              <span className="flex items-center gap-2 justify-center">
                🇰🇪 Start Free Trial
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </span>
            </Link>
            <Link
              href="/businesses"
              className="group bg-white hover:bg-gray-50 
                         dark:bg-gray-800 dark:hover:bg-gray-700
                         text-green-600 dark:text-green-400 
                         font-bold py-4 px-8 rounded-xl text-lg 
                         transition-all duration-300 transform hover:scale-105
                         border border-gray-300 dark:border-gray-700
                         shadow-lg hover:shadow-gray-500/20"
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
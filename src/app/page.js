'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const backgroundImages = [
  {
    url: 'https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?q=80&w=2070&auto=format&fit=crop',
    alt: 'Woman booking service on phone'
  },
  {
    url: 'https://images.unsplash.com/photo-1556740714-a8395b3bf30f?q=80&w=2070&auto=format&fit=crop',
    alt: 'Happy customer with phone'
  },
  {
    url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop',
    alt: 'People using phones together'
  }
];

export default function HomePage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300">
      
      {/* Hero Section with Rotating Background */}
      <div className="relative h-screen overflow-hidden">
        {/* Rotating Background Images */}
        {backgroundImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url('${image.url}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        ))}

        {/* Hero Content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 animate-fade-in drop-shadow-lg">
              Book Appointments.
              <br />
              <span className="text-green-300 dark:text-green-400 drop-shadow-md">Pay with M-Pesa.</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-100 dark:text-gray-300 max-w-3xl mx-auto mb-12 animate-fade-in-delay drop-shadow">
              The easiest way for Kenyan businesses to accept payments and manage appointments online
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-delay-2">
              {/* Find Services Button - White style */}
              <Link
                href="/businesses"
                className="group bg-white/95 text-green-700 hover:bg-green-600 hover:text-white 
                           dark:bg-gray-800/95 dark:text-green-400 dark:hover:bg-green-500 dark:hover:text-gray-900 
                           font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 
                           shadow-xl hover:shadow-green-500/40 dark:shadow-green-900/40 
                           backdrop-blur-sm transform hover:scale-105 border border-gray-200 dark:border-gray-700"
              >
                <span className="flex items-center gap-2">
                  🔍 Find Services
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </span>
              </Link>
              
              {/* Register Button - Green style with dark mode optimization */}
              <Link
                href="/business/register"
                className="group bg-green-600 text-white hover:bg-green-500 
                           dark:bg-green-500 dark:hover:bg-green-400 dark:text-gray-900
                           font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 
                           shadow-xl hover:shadow-green-500/40 dark:shadow-green-400/40 
                           transform hover:scale-105 border border-green-700 dark:border-green-400"
              >
                <span className="flex items-center gap-2">
                  🇰🇪 Register Your Business
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </span>
              </Link>
            </div>

            {/* Feature Icons */}
            <div className="mt-12 flex items-center justify-center gap-2 text-gray-200 dark:text-gray-400 animate-fade-in-delay-3">
              <span className="w-12 h-12 bg-white/15 dark:bg-gray-800/60 rounded-full flex items-center justify-center text-2xl backdrop-blur-sm border border-white/20 dark:border-gray-700">
                📱
              </span>
              <span className="w-12 h-12 bg-white/15 dark:bg-gray-800/60 rounded-full flex items-center justify-center text-2xl backdrop-blur-sm border border-white/20 dark:border-gray-700">
                💳
              </span>
              <span className="w-12 h-12 bg-white/15 dark:bg-gray-800/60 rounded-full flex items-center justify-center text-2xl backdrop-blur-sm border border-white/20 dark:border-gray-700">
                ✅
              </span>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/70 dark:border-gray-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/70 dark:bg-gray-400 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Quick Stats Bar */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 
                      dark:from-green-800 dark:to-blue-900 
                      py-12 transition-colors duration-300 border-b border-green-500/20 dark:border-green-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-white">
            <div className="transform hover:scale-110 transition-transform duration-300">
              <div className="text-4xl font-bold mb-2 drop-shadow">500+</div>
              <div className="text-green-50 dark:text-green-200 font-medium">Active Businesses</div>
            </div>
            <div className="transform hover:scale-110 transition-transform duration-300">
              <div className="text-4xl font-bold mb-2 drop-shadow">10,000+</div>
              <div className="text-green-50 dark:text-green-200 font-medium">Appointments Booked</div>
            </div>
            <div className="transform hover:scale-110 transition-transform duration-300">
              <div className="text-4xl font-bold mb-2 drop-shadow">24/7</div>
              <div className="text-green-50 dark:text-green-200 font-medium">Customer Support</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="bg-gradient-to-r from-green-600 via-green-500 to-blue-600 
                        dark:from-green-800 dark:via-green-700 dark:to-blue-900 
                        rounded-3xl shadow-2xl p-8 md:p-12 relative overflow-hidden 
                        transition-colors duration-300 border border-green-400/30 dark:border-green-700/30">
          {/* Decorative blobs */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 dark:bg-white/5 rounded-full -mt-32 -mr-32 blur-2xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 dark:bg-white/5 rounded-full -mb-24 -ml-24 blur-2xl" />
          
          <div className="relative text-center text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 drop-shadow-lg">
              Ready to Transform Your Business?
            </h2>
            <p className="text-lg md:text-xl mb-10 max-w-3xl mx-auto text-green-50 dark:text-gray-200 leading-relaxed">
              Join hundreds of Kenyan businesses already accepting M-Pesa payments and managing appointments effortlessly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {/* Start Free Trial - Green button */}
              <Link
                href="/business/register"
                className="group bg-white text-green-700 hover:bg-green-50 
                           dark:bg-green-500 dark:hover:bg-green-400 dark:text-gray-900
                           font-bold py-4 px-10 rounded-xl text-lg transition-all duration-300 
                           transform hover:scale-105 shadow-xl hover:shadow-green-500/30 
                           border border-green-200 dark:border-green-400"
              >
                <span className="flex items-center gap-2">
                  🇰🇪 Start Free Trial
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </span>
              </Link>
              {/* Browse Services - Outline style */}
              <Link
                href="/businesses"
                className="group bg-transparent border-2 border-white/90 text-white 
                           hover:bg-white/10 dark:border-green-400 dark:text-green-300 
                           dark:hover:bg-green-500/10 dark:hover:text-green-200
                           font-bold py-4 px-10 rounded-xl text-lg transition-all duration-300 
                           transform hover:scale-105 backdrop-blur-sm"
              >
                <span className="flex items-center gap-2">
                  🔍 Browse Services
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </span>
              </Link>
            </div>
            <p className="mt-6 text-green-50/90 dark:text-gray-300 text-sm">
              ✨ No credit card required • 14-day free trial • Cancel anytime
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-gray-950 text-white transition-colors duration-300 border-t border-gray-800 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="md:col-span-1">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                Luna<span className="text-green-400 dark:text-green-300">Pay</span>
              </h3>
              <p className="text-gray-400 dark:text-gray-500 text-sm leading-relaxed">
                Making it easy for Kenyan businesses to accept payments and manage appointments online.
              </p>
            </div>
            
            {/* For Businesses */}
            <div>
              <h4 className="font-bold mb-4 text-gray-200 dark:text-gray-300">For Businesses</h4>
              <ul className="space-y-3 text-gray-400 dark:text-gray-500">
                <li><Link href="/business/register" className="hover:text-green-400 dark:hover:text-green-300 transition-colors flex items-center gap-2"><span className="text-green-500">▹</span> Register</Link></li>
                <li><Link href="/pricing" className="hover:text-green-400 dark:hover:text-green-300 transition-colors flex items-center gap-2"><span className="text-green-500">▹</span> Pricing</Link></li>
                <li><Link href="/why-choose-us" className="hover:text-green-400 dark:hover:text-green-300 transition-colors flex items-center gap-2"><span className="text-green-500">▹</span> Why Choose Us</Link></li>
              </ul>
            </div>
            
            {/* For Customers */}
            <div>
              <h4 className="font-bold mb-4 text-gray-200 dark:text-gray-300">For Customers</h4>
              <ul className="space-y-3 text-gray-400 dark:text-gray-500">
                <li><Link href="/businesses" className="hover:text-green-400 dark:hover:text-green-300 transition-colors flex items-center gap-2"><span className="text-green-500">▹</span> Find Services</Link></li>
                <li><Link href="/how-it-works" className="hover:text-green-400 dark:hover:text-green-300 transition-colors flex items-center gap-2"><span className="text-green-500">▹</span> How It Works</Link></li>
                <li><Link href="/testimonials" className="hover:text-green-400 dark:hover:text-green-300 transition-colors flex items-center gap-2"><span className="text-green-500">▹</span> Testimonials</Link></li>
                <li><Link href="/faq" className="hover:text-green-400 dark:hover:text-green-300 transition-colors flex items-center gap-2"><span className="text-green-500">▹</span> FAQ</Link></li>
              </ul>
            </div>
            
            {/* Contact */}
            <div>
              <h4 className="font-bold mb-4 text-gray-200 dark:text-gray-300">Contact</h4>
              <ul className="space-y-3 text-gray-400 dark:text-gray-500">
                <li className="flex items-center gap-2 hover:text-green-400 dark:hover:text-green-300 transition-colors">
                  <span>📞</span> 0738 119 756
                </li>
                <li className="flex items-center gap-2 hover:text-green-400 dark:hover:text-green-300 transition-colors">
                  <span>📧</span> josephkibiru@gmail.com
                </li>
                <li className="flex items-center gap-2 hover:text-green-400 dark:hover:text-green-300 transition-colors">
                  <span>📍</span> Nairobi, Kenya
                </li>
              </ul>
            </div>
          </div>
          
          {/* Bottom Bar */}
          <div className="border-t border-gray-800 dark:border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400 dark:text-gray-600">
              © {new Date().getFullYear()} LunaPay. All rights reserved.
            </p>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-700">
              Powered by M-Pesa • Secure • Reliable • Made for Kenya 🇰🇪
            </p>
          </div>
        </div>
      </footer>

      {/* Animation Keyframes */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
        }
        
        .animate-fade-in-delay {
          animation: fade-in 1s ease-out 0.3s forwards;
          opacity: 0;
        }
        
        .animate-fade-in-delay-2 {
          animation: fade-in 1s ease-out 0.6s forwards;
          opacity: 0;
        }
        
        .animate-fade-in-delay-3 {
          animation: fade-in 1s ease-out 0.9s forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}
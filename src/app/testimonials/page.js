import Link from 'next/link';

export default function TestimonialsPage() {
  const testimonials = [
    {
      quote: "LunaPay has transformed how I run my salon. M-Pesa payments are instant and booking management is a breeze! My revenue has increased by 40% since joining.",
      author: "Mary Wanjiku",
      business: "Mama Salama Salon, Nairobi",
      rating: 5,
      image: "👩‍🦱"
    },
    {
      quote: "My customers love how easy it is to book appointments. The automatic reminders have reduced no-shows by 80%. Best decision I made for my garage.",
      author: "James Omondi",
      business: "Omondi Auto Repair, Kisumu",
      rating: 5,
      image: "👨‍🔧"
    },
    {
      quote: "The analytics help me understand my busiest days and most popular services. I've optimized my schedule and doubled my daily appointments.",
      author: "Amina Hassan",
      business: "Amina Beauty Spa, Mombasa",
      rating: 5,
      image: "👩‍🎨"
    },
    {
      quote: "As a customer, I love how easy it is to find services and pay with M-Pesa. No more carrying cash or waiting in long queues.",
      author: "John Kimani",
      business: "Regular Customer, Nakuru",
      rating: 5,
      image: "👨‍💼"
    },
    {
      quote: "The support team is amazing! They helped me set up my business in under 10 minutes. Highly recommended for any Kenyan business.",
      author: "Lucy Akinyi",
      business: "Lucy's Hair & Beauty, Eldoret",
      rating: 5,
      image: "👩‍🦰"
    },
    {
      quote: "Integration was seamless and my customers are loving the convenience. Best investment I've made for my photography business.",
      author: "Peter Mwangi",
      business: "Mwangi Photography, Thika",
      rating: 5,
      image: "👨‍🎨"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      
      {/* Hero - CENTERED */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 dark:from-green-800 dark:to-blue-900 text-white transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h1 className="text-5xl font-bold mb-6 drop-shadow-lg">
            What Our Users Say
          </h1>
          <p className="text-xl max-w-3xl mx-auto text-green-50 dark:text-emerald-100 drop-shadow">
            Join hundreds of satisfied Kenyan businesses and customers who trust LunaPay.
          </p>
        </div>
      </div>

      {/* Testimonials Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg dark:shadow-gray-900/50 
                         hover:shadow-xl dark:hover:shadow-gray-800/80 
                         transition-all duration-300 p-8 
                         border border-gray-100 dark:border-gray-800
                         group hover:-translate-y-1"
            >
              {/* Avatar */}
              <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                {testimonial.image}
              </div>
              
              {/* Rating Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span 
                    key={i} 
                    className="text-yellow-400 dark:text-yellow-300 text-xl drop-shadow"
                  >
                    ★
                  </span>
                ))}
              </div>
              
              {/* Quote */}
              <p className="text-gray-700 dark:text-gray-300 mb-6 italic leading-relaxed">
                "{testimonial.quote}"
              </p>
              
              {/* Author Info */}
              <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
                <p className="font-bold text-gray-900 dark:text-white">{testimonial.author}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.business}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA - CENTERED */}
        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Ready to join them?
          </h2>
          <Link
            href="/business/register"
            className="inline-block bg-green-600 hover:bg-green-500 
                       dark:bg-green-500 dark:hover:bg-green-400 dark:text-gray-900
                       text-white font-bold py-4 px-10 rounded-xl text-lg 
                       transition-all duration-300 transform hover:scale-105 
                       shadow-lg hover:shadow-green-500/30"
          >
            Start Your Free Trial Today →
          </Link>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            ✨ No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </div>

      {/* Trust Badges Section */}
      <div className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-12 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 dark:text-gray-400 mb-8 text-sm uppercase tracking-wide">
            Trusted by businesses across Kenya
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-70 dark:opacity-60">
            <span className="text-2xl">🇰🇪</span>
            <span className="text-2xl">💳</span>
            <span className="text-2xl">📱</span>
            <span className="text-2xl">🔒</span>
            <span className="text-2xl">⭐</span>
          </div>
        </div>
      </div>
    </div>
  );
}
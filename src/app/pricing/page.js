import Link from 'next/link';

export default function PricingPage() {
  const plans = [
    {
      name: "Starter",
      price: "Free",
      description: "Perfect for new businesses just getting started",
      features: [
        "Up to 50 appointments/month",
        "M-Pesa payments",
        "Basic booking management",
        "Email support",
        "SMS confirmations"
      ],
      buttonText: "Get Started",
      buttonColor: "bg-gray-600 hover:bg-gray-700",
      darkButtonColor: "dark:bg-gray-700 dark:hover:bg-gray-600",
      popular: false
    },
    {
      name: "Growth",
      price: "KES 2,500",
      period: "/month",
      description: "For growing businesses with regular appointments",
      features: [
        "Unlimited appointments",
        "M-Pesa payments",
        "Advanced booking management",
        "Priority support",
        "SMS & Email reminders",
        "Business analytics",
        "Customer reviews"
      ],
      buttonText: "Start Free Trial",
      buttonColor: "bg-green-600 hover:bg-green-500",
      darkButtonColor: "dark:bg-green-500 dark:hover:bg-green-400 dark:text-gray-900",
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For large businesses with multiple locations",
      features: [
        "Multi-location support",
        "API access",
        "Dedicated account manager",
        "Custom integrations",
        "Training & onboarding",
        "SLA guarantee"
      ],
      buttonText: "Contact Sales",
      buttonColor: "bg-blue-600 hover:bg-blue-500",
      darkButtonColor: "dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-gray-900",
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      
      {/* Hero - CENTERED */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 dark:from-green-800 dark:to-blue-900 text-white transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h1 className="text-5xl font-bold mb-6 drop-shadow-lg">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl max-w-3xl mx-auto text-green-50 dark:text-emerald-100 drop-shadow">
            Choose the plan that fits your business. No hidden fees.
          </p>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`bg-white dark:bg-gray-900 rounded-3xl shadow-xl dark:shadow-gray-900/50 
                         overflow-hidden transform hover:-translate-y-2 transition-all duration-300 
                         border border-gray-100 dark:border-gray-800
                         ${plan.popular ? 'ring-4 ring-green-500 dark:ring-green-400' : ''}`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="bg-green-500 dark:bg-green-600 text-white text-center py-2 font-semibold">
                  Most Popular ✨
                </div>
              )}
              
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{plan.name}</h3>
                
                {/* Price */}
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">{plan.price}</span>
                  {plan.period && (
                    <span className="text-gray-500 dark:text-gray-400">{plan.period}</span>
                  )}
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 mb-6">{plan.description}</p>
                
                {/* Features List */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <span className="text-green-500 dark:text-green-400 font-bold">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                
                {/* CTA Button */}
                <Link
                  href={plan.name === "Enterprise" ? "/contact" : "/business/register"}
                  className={`block text-center ${plan.buttonColor} ${plan.darkButtonColor} 
                             text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 
                             w-full shadow-md hover:shadow-lg`}
                >
                  {plan.buttonText}
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Teaser - CENTERED */}
        <div className="mt-16 text-center bg-white dark:bg-gray-900 rounded-3xl p-8 md:p-12 
                        border border-gray-200 dark:border-gray-800 
                        shadow-lg dark:shadow-gray-900/50 transition-colors duration-300">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Have questions about pricing?
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
            Check our FAQ or contact our sales team for custom enterprise solutions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/faq"
              className="inline-block bg-gray-600 hover:bg-gray-700 
                         dark:bg-gray-700 dark:hover:bg-gray-600 
                         text-white font-bold py-3 px-8 rounded-lg 
                         transition-all duration-300"
            >
              View FAQ
            </Link>
            <Link
              href="/contact"
              className="inline-block bg-transparent border-2 border-gray-600 
                         dark:border-gray-400 text-gray-700 dark:text-gray-300 
                         hover:bg-gray-600 hover:text-white 
                         dark:hover:bg-gray-400 dark:hover:text-gray-900 
                         font-bold py-3 px-8 rounded-lg 
                         transition-all duration-300"
            >
              Contact Sales
            </Link>
          </div>
        </div>

        {/* Money-Back Guarantee */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center gap-2">
            <span className="text-green-500 dark:text-green-400">🔒</span>
            14-day money-back guarantee • No credit card required for trial
          </p>
        </div>
      </div>

      {/* Comparison Table Teaser */}
      <div className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-16 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
            Compare All Features
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full max-w-4xl mx-auto text-left">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="py-4 px-6 text-gray-900 dark:text-white font-semibold">Feature</th>
                  <th className="py-4 px-6 text-center text-gray-900 dark:text-white font-semibold">Starter</th>
                  <th className="py-4 px-6 text-center text-green-600 dark:text-green-400 font-semibold">Growth</th>
                  <th className="py-4 px-6 text-center text-gray-900 dark:text-white font-semibold">Enterprise</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 dark:text-gray-400">
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-4 px-6">M-Pesa Payments</td>
                  <td className="py-4 px-6 text-center text-green-500">✓</td>
                  <td className="py-4 px-6 text-center text-green-500">✓</td>
                  <td className="py-4 px-6 text-center text-green-500">✓</td>
                </tr>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-4 px-6">Unlimited Appointments</td>
                  <td className="py-4 px-6 text-center text-gray-400">—</td>
                  <td className="py-4 px-6 text-center text-green-500">✓</td>
                  <td className="py-4 px-6 text-center text-green-500">✓</td>
                </tr>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-4 px-6">Business Analytics</td>
                  <td className="py-4 px-6 text-center text-gray-400">—</td>
                  <td className="py-4 px-6 text-center text-green-500">✓</td>
                  <td className="py-4 px-6 text-center text-green-500">✓</td>
                </tr>
                <tr>
                  <td className="py-4 px-6">Multi-Location Support</td>
                  <td className="py-4 px-6 text-center text-gray-400">—</td>
                  <td className="py-4 px-6 text-center text-gray-400">—</td>
                  <td className="py-4 px-6 text-center text-green-500">✓</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-8">
            <Link
              href="/pricing/compare"
              className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium inline-flex items-center gap-1"
            >
              View full comparison →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
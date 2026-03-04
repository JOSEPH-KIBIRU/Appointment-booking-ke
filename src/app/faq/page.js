'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How does M-Pesa payment work?",
      answer: "When a customer books an appointment, they receive an STK Push on their phone. They enter their M-Pesa PIN, and the payment is processed instantly. You receive confirmation immediately."
    },
    {
      question: "Do I need a Till Number or Paybill?",
      answer: "Yes, you'll need either a Till Number (for small businesses) or Paybill (for larger businesses). You can add this during registration."
    },
    {
      question: "How long does it take to set up?",
      answer: "Most businesses are set up in under 10 minutes. Just register, add your services, and you're ready to accept bookings."
    },
    {
      question: "Is there a contract or setup fee?",
      answer: "No contracts, no setup fees. You can cancel anytime. The Starter plan is completely free, and paid plans are month-to-month."
    },
    {
      question: "What if a customer doesn't show up?",
      answer: "Our system sends automatic reminders via SMS. If they still don't show, you can mark them as 'no-show' and decide on your cancellation policy."
    },
    {
      question: "Can I use LunaPay on multiple devices?",
      answer: "Yes! You can access your dashboard from any device - phone, tablet, or computer. All data syncs in real-time."
    },
    {
      question: "Is my data secure?",
      answer: "Absolutely. We use bank-level encryption for all data. Your customers' payment information is never stored on our servers."
    },
    {
      question: "What happens if I need help?",
      answer: "We offer email support for all plans, and priority support for paid plans. Our team typically responds within 2 hours."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      
      {/* Hero - CENTERED */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 dark:from-green-800 dark:to-blue-900 text-white transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h1 className="text-5xl font-bold mb-6 drop-shadow-lg">
            Frequently Asked Questions
          </h1>
          <p className="text-xl max-w-3xl mx-auto text-green-50 dark:text-emerald-100 drop-shadow">
            Everything you need to know about LunaPay
          </p>
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-900 rounded-xl shadow-md dark:shadow-gray-900/50 
                         overflow-hidden border border-gray-100 dark:border-gray-800 
                         transition-all duration-300"
            >
              <button
                className="w-full px-6 py-4 text-left flex justify-between items-center 
                           hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                aria-expanded={openIndex === index}
              >
                <span className="font-semibold text-gray-900 dark:text-white pr-4">
                  {faq.question}
                </span>
                <span className={`text-2xl font-bold transition-all duration-300 flex-shrink-0
                                  ${openIndex === index 
                                    ? 'text-green-600 dark:text-green-400 rotate-180' 
                                    : 'text-green-600 dark:text-green-400'}`}>
                  {openIndex === index ? '−' : '+'}
                </span>
              </button>
              
              {/* Answer Content with smooth expand animation */}
              <div 
                className={`px-6 overflow-hidden transition-all duration-300 
                           ${openIndex === index ? 'pb-4 max-h-96' : 'max-h-0'}`}
              >
                <div className="text-gray-600 dark:text-gray-400 leading-relaxed border-t border-gray-100 dark:border-gray-800 pt-4">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Still Have Questions - CENTERED */}
        <div className="mt-12 text-center bg-white dark:bg-gray-900 rounded-2xl p-8 
                        shadow-lg dark:shadow-gray-900/50 border border-gray-200 dark:border-gray-800 
                        transition-colors duration-300">
          <div className="text-5xl mb-4">💬</div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Still have questions?
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-xl mx-auto">
            Our support team is here to help. Reach out and we'll get back to you within 2 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-block bg-green-600 hover:bg-green-500 
                         dark:bg-green-500 dark:hover:bg-green-400 dark:text-gray-900
                         text-white font-bold py-3 px-8 rounded-lg 
                         transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Contact Us
            </Link>
            <Link
              href="/business/register"
              className="inline-block bg-transparent border-2 border-green-600 
                         dark:border-green-400 text-green-600 dark:text-green-400 
                         hover:bg-green-600 hover:text-white 
                         dark:hover:bg-green-400 dark:hover:text-gray-900 
                         font-bold py-3 px-8 rounded-lg 
                         transition-all duration-300"
            >
              Start Free Trial
            </Link>
          </div>
        </div>

        {/* Quick Links - CENTERED */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Or check out these helpful resources:
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/how-it-works"
              className="text-green-600 dark:text-green-400 hover:text-green-700 
                         dark:hover:text-green-300 font-medium transition-colors"
            >
              How It Works →
            </Link>
            <span className="text-gray-300 dark:text-gray-700">|</span>
            <Link
              href="/pricing"
              className="text-green-600 dark:text-green-400 hover:text-green-700 
                         dark:hover:text-green-300 font-medium transition-colors"
            >
              Pricing →
            </Link>
            <span className="text-gray-300 dark:text-gray-700">|</span>
            <Link
              href="/testimonials"
              className="text-green-600 dark:text-green-400 hover:text-green-700 
                         dark:hover:text-green-300 font-medium transition-colors"
            >
              Testimonials →
            </Link>
          </div>
        </div>
      </div>

      {/* Support Info Bar */}
      <div className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-12 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl mb-2">📧</div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-1">Email Support</h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">support@lunapay.co.ke</p>
            </div>
            <div>
              <div className="text-3xl mb-2">📞</div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-1">Phone Support</h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">0738 119 756</p>
            </div>
            <div>
              <div className="text-3xl mb-2">⏰</div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-1">Response Time</h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Within 2 hours</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
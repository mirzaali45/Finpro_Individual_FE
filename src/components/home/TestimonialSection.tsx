"use client";

import { motion } from "framer-motion";
import SectionTitle from "./SectionTitle";

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  avatar: string;
}

const testimonials: Testimonial[] = [
  {
    quote:
      "InvoicePro has cut our payment processing time by 70%. The automated reminders feature alone has been a game-changer for our cash flow.",
    author: "Sarah Johnson",
    role: "CEO, Design Studio",
    avatar: "SJ",
  },
  {
    quote:
      "The reporting features help us understand our financial health at a glance. We've made better business decisions since switching to InvoicePro.",
    author: "Michael Chen",
    role: "Finance Director, TechStart",
    avatar: "MC",
  },
  {
    quote:
      "As a freelancer, keeping track of invoices was always a challenge. InvoicePro makes it simple and professional. My clients are impressed!",
    author: "Jamie Williams",
    role: "Independent Consultant",
    avatar: "JW",
  },
];

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="Testimonials"
          title="What Our Customers Say"
          description="Join thousands of satisfied businesses that trust InvoicePro for their invoicing needs."
        />

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mt-16">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="bg-white p-8 rounded-xl shadow-sm border border-gray-100"
            >
              <div className="flex items-center gap-1 text-yellow-400 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 mb-6">"{testimonial.quote}"</p>
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                  {testimonial.avatar}
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-900">
                    {testimonial.author}
                  </h4>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { User } from "@/types/homeTypes";

interface HeroSectionProps {
  user: User | null;
}

export default function HeroSection({ user }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Smart Invoicing for{" "}
              <span className="text-blue-700">Modern Businesses</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-gray-600 leading-relaxed">
              Streamline your invoicing workflow, get paid faster, and gain
              valuable insights into your business finances with our powerful
              yet simple platform.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link href={user ? "/dashboard" : "/register"}>
                <Button className="px-8 py-3.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-base font-medium transition-all shadow-md hover:shadow-lg w-full sm:w-auto">
                  {user ? "Go to Dashboard" : "Start Free Trial"}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="#features">
                <Button
                  variant="outline"
                  className="px-8 py-3.5 border-gray-300 text-gray-700 hover:text-blue-700 hover:border-blue-700 rounded-lg text-base font-medium transition-all w-full sm:w-auto"
                >
                  See how it works
                </Button>
              </Link>
            </div>
            <div className="mt-8 flex items-center">
              <div className="flex -space-x-2">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className={`h-10 w-10 rounded-full border-2 border-white flex items-center justify-center text-xs font-medium text-white bg-blue-${
                      600 - i * 100
                    }`}
                  >
                    {["JD", "RW", "AM", "KC"][i]}
                  </div>
                ))}
              </div>
              <div className="ml-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="h-5 w-5 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">4.9/5</span> from over 1,200+
                  reviews
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="mt-12 lg:mt-0"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div className="relative rounded-2xl bg-white shadow-2xl overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
              <div className="p-1">
                <div className="relative w-full h-[500px]">
                  <Image
                    src="/Vendor-Invoice.png"
                    alt="InvoicePro Dashboard"
                    className="rounded-xl"
                    fill
                    style={{ objectFit: "cover" }}
                    priority
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Floating logos */}
      <div className="hidden lg:block absolute bottom-0 left-0 right-0 py-6 bg-gradient-to-r from-transparent via-blue-50/70 to-transparent backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-8">
          <p className="text-sm text-gray-500 text-center mb-4">
            Trusted by companies worldwide
          </p>
          <div className="flex justify-between items-center">
            {["Acme Inc", "Globex", "Soylent", "Initech", "Umbrella"].map(
              (name, i) => (
                <div key={i} className="text-gray-400 font-semibold text-xl">
                  {name}
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

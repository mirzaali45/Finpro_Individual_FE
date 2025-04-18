"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  sidebarTitle: string;
  sidebarSubtitle: string;
  sidebarDescription: string;
  sidebarFeatures: string[];
}

export function AuthLayout({
  children,
  title,
  subtitle,
  sidebarTitle,
  sidebarSubtitle,
  sidebarDescription,
  sidebarFeatures,
}: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-slate-100">
      {/* Left section (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-blue-600 text-white">
        <div className="h-full w-full flex flex-col justify-center items-center p-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-md"
          >
            <h1 className="text-4xl font-bold mb-6">{sidebarTitle}</h1>
            <h2 className="text-2xl font-semibold mb-4">{sidebarSubtitle}</h2>
            <p className="text-blue-100 mb-8">{sidebarDescription}</p>
            <div className="space-y-4">
              {sidebarFeatures.map((feature, index) => (
                <div key={index} className="flex items-center">
                  <div className="bg-blue-500 p-2 rounded-full mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <p>{feature}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right section (Form) */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-blue-700 mb-2">{title}</h1>
            <p className="text-slate-600">{subtitle}</p>
          </div>

          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="bg-white p-8 rounded-xl shadow-lg"
          >
            {children}
          </motion.div>
        </motion.div>

        <p className="mt-8 text-center text-sm text-slate-500">
          © 2025 InvoicePro. All rights reserved.
        </p>
      </div>
    </div>
  );
}

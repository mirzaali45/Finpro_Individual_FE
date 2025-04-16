// app/loading.tsx
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Loading() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress((progress) => {
        if (progress >= 100) {
          return 100;
        }
        return progress + Math.floor(Math.random() * 10) + 1;
      });
    }, 200);

    return () => clearTimeout(timer);
  }, [progress]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl font-bold text-blue-700">InvoicePro</h1>
            <p className="text-slate-600 mt-2">
              Modern Invoice Management System
            </p>
          </motion.div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <div className="mb-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-blue-600 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{
                    type: "spring",
                    stiffness: 50,
                    damping: 10,
                  }}
                />
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-xs text-slate-500">
                  Preparing your workspace
                </span>
                <span className="text-xs font-medium text-blue-700">
                  {progress}%
                </span>
              </div>
            </motion.div>
          </div>

          <div className="space-y-3">
            {progress > 20 && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="flex items-center"
              >
                <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-blue-600"
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
                <span className="text-sm text-slate-700">
                  Loading user data
                </span>
              </motion.div>
            )}

            {progress > 45 && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1, duration: 0.4 }}
                className="flex items-center"
              >
                <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-blue-600"
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
                <span className="text-sm text-slate-700">
                  Connecting to secure server
                </span>
              </motion.div>
            )}

            {progress > 70 && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.5, duration: 0.4 }}
                className="flex items-center"
              >
                <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-blue-600"
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
                <span className="text-sm text-slate-700">
                  Fetching latest invoices
                </span>
              </motion.div>
            )}

            {progress > 90 && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 2, duration: 0.4 }}
                className="flex items-center"
              >
                <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-blue-600"
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
                <span className="text-sm text-slate-700">
                  Preparing your dashboard
                </span>
              </motion.div>
            )}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: progress > 95 ? 1 : 0 }}
          transition={{ duration: 0.4 }}
          className="text-center"
        >
          <p className="text-slate-600 text-sm">
            Almost there! Finalizing your experience...
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="absolute bottom-4 text-xs text-slate-500"
      >
        © 2025 InvoicePro | Enterprise Invoice Management
      </motion.div>
    </div>
  );
}

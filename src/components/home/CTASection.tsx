'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { User } from '@/types/homeTypes';

interface CtaSectionProps {
  user: User | null;
}

export default function CtaSection({ user }: CtaSectionProps) {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold leading-tight">
              Ready to streamline your invoicing?
            </h2>
            <p className="mt-6 text-xl text-blue-100">
              Join thousands of businesses that trust InvoicePro for their invoicing needs. Get started with a free 14-day trial.
            </p>
            <div className="mt-10">
              <Link href={user ? "/dashboard" : "/register"}>
                <Button className="px-8 py-4 bg-white text-blue-700 hover:bg-blue-50 rounded-lg text-lg font-medium transition-all shadow-lg hover:shadow-xl">
                  {user ? "Go to Dashboard" : "Start Your Free Trial"}
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
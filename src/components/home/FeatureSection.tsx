"use client";

import { motion } from "framer-motion";
import {
  FileText,
  CreditCard,
  Clock,
  Globe,
  BarChart2,
  Shield,
  LucideFileClock,
} from "lucide-react";
import SectionTitle from "./SectionTitle";

interface FeatureItem {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

const features: FeatureItem[] = [
  {
    icon: <FileText className="h-8 w-8 text-white" />,
    title: "Professional Invoices",
    description:
      "Create beautiful, customizable invoices with your branding in seconds. Include payment terms, notes, and itemized line details.",
    color: "blue",
  },
  {
    icon: <CreditCard className="h-8 w-8 text-white" />,
    title: "Seamless Payments",
    description:
      "Accept payments online with integrations for major payment processors. Get notified instantly when a client pays.",
    color: "red",
  },
  {
    icon: <LucideFileClock className="h-8 w-8 text-white" />,
    title: "Automated Reminders",
    description:
      "Set up automatic payment reminders for overdue invoices. Never chase a late payment again.",
    color: "yellow",
  },
  {
    icon: <Globe className="h-8 w-8 text-white" />,
    title: "Multi-Currency Support",
    description:
      "Invoice clients in their preferred currency with automatic exchange rate calculations.",
    color: "gray",
  },
  {
    icon: <BarChart2 className="h-8 w-8 text-white" />,
    title: "Insightful Reports",
    description:
      "Gain valuable insights with detailed financial reports. Track revenue, outstanding payments, and client history.",
    color: "green",
  },
  {
    icon: <Shield className="h-8 w-8 text-white" />,
    title: "Secure & Compliant",
    description:
      "Your data is encrypted and stored securely. We maintain compliance with financial regulations.",
    color: "gray",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="Features"
          title="Everything You Need to Manage Invoices"
          description="Our comprehensive platform helps you create, track, and analyze all your financial documents in one place."
        />

        <div className="mt-20 grid gap-12 lg:grid-cols-3 md:grid-cols-2">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="relative"
            >
              <div
                className={`absolute -top-6 left-0 p-3 rounded-lg shadow-md bg-${feature.color}-600`}
              >
                {feature.icon}
              </div>
              <div className="pt-8 pl-4">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

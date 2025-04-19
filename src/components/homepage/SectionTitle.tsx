"use client";

import { motion } from "framer-motion";

interface SectionTitleProps {
  eyebrow: string;
  title: string;
  description: string;
  center?: boolean;
}

export default function SectionTitle({
  eyebrow,
  title,
  description,
  center = true,
}: SectionTitleProps) {
  return (
    <div className={`${center ? "text-center max-w-3xl mx-auto" : ""}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <span className="inline-block px-3 py-1 text-xs font-semibold text-blue-700 bg-blue-50 rounded-full uppercase tracking-wide mb-4">
          {eyebrow}
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
          {title}
        </h2>
        <p className="mt-4 text-xl text-gray-600">{description}</p>
      </motion.div>
    </div>
  );
}

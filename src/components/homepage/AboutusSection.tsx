"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import SectionTitle from "./SectionTitle";
import TeamMember from "./TeamMember";

interface TeamMemberType {
  name: string;
  role: string;
  bio: string;
}

const teamMembers: TeamMemberType[] = [
  {
    name: "Mirza Ali Yusuf",
    role: "CEO & Co-founder",
    bio: "15+ years experience in fintech and small business solutions.",
  },
];

export default function AboutUsSection() {
  return (
    <section id="about" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="About Us"
          title="We're Changing How Businesses Handle Invoicing"
          description="Our mission is to make professional invoicing accessible to businesses of all sizes."
        />

        <div className="grid md:grid-cols-2 gap-16 items-center mt-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Our Story</h3>
            <p className="text-gray-600 mb-6">
              Founded in 2022, InvoicePro was born from a simple idea: invoicing
              shouldn&apos;t be complicated. Our founders, experienced small business
              owners themselves, were frustrated with the existing solutions
              that were either too complex or too basic for their needs.
            </p>
            <p className="text-gray-600 mb-6">
              We built InvoicePro to strike the perfect balance between powerful
              features and ease of use. Today, thousands of businesses around
              the world rely on our platform to manage their invoicing and get
              paid faster.
            </p>
            <div className="flex items-center space-x-8 mt-8">
              <div>
                <div className="text-3xl font-bold text-blue-700">5000+</div>
                <div className="text-gray-600">Happy Customers</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-700">120+</div>
                <div className="text-gray-600">Countries</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-700">$2B+</div>
                <div className="text-gray-600">Invoices Processed</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="rounded-2xl overflow-hidden shadow-xl">
              <div className="relative w-full h-[400px]">
                <Image
                  src="/About-us.jpeg"
                  alt="Our team"
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
            </div>
            <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-xl shadow-lg">
              <h4 className="font-bold text-gray-900 mb-2">Our Values</h4>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <svg
                      className="h-4 w-4 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-700">Simplicity</span>
                </li>
                <li className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <svg
                      className="h-4 w-4 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-700">Transparency</span>
                </li>
                <li className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <svg
                      className="h-4 w-4 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-700">Customer-first</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>

        <div className="mt-24">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-12">
            Meet Our Leadership Team
          </h3>
          <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-8">
            {teamMembers.map((member, index) => (
              <TeamMember
                key={index}
                name={member.name}
                role={member.role}
                bio={member.bio}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

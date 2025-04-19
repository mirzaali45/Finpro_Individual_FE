"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface TeamMemberProps {
  name: string;
  role: string;
  bio: string;
  index: number;
}

export default function TeamMember({
  name,
  role,
  bio,
  index,
}: TeamMemberProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm"
    >
      <div className="h-48 bg-gray-200 relative">
        <Image
          src={`/Foto-Mirza.jpg?text=${name}`}
          alt={name}
          fill
          style={{ objectFit: "cover" }}
        />
      </div>
      <div className="p-6">
        <h4 className="font-bold text-gray-900">{name}</h4>
        <p className="text-blue-600 font-medium text-sm mb-2">{role}</p>
        <p className="text-gray-600 text-sm">{bio}</p>
      </div>
    </motion.div>
  );
}

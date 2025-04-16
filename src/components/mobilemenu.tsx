"use client";

import Link from "next/link";
import { User } from "@/types/homeTypes";

interface MobileMenuProps {
  user: User | null;
}

export default function MobileMenu({ user }: MobileMenuProps) {
  return (
    <div className="md:hidden bg-white px-4 pt-2 pb-4 border-t border-gray-100">
      <div className="space-y-3">
        <Link
          href="#features"
          className="block py-2 text-gray-700 font-medium hover:text-blue-700"
        >
          Features
        </Link>
        <Link
          href="#testimonials"
          className="block py-2 text-gray-700 font-medium hover:text-blue-700"
        >
          Testimonials
        </Link>
        <Link
          href="#about"
          className="block py-2 text-gray-700 font-medium hover:text-blue-700"
        >
          About Us
        </Link>
        {!user && (
          <Link
            href="/login"
            className="block py-2 text-gray-700 font-medium hover:text-blue-700"
          >
            Sign in
          </Link>
        )}
      </div>
    </div>
  );
}

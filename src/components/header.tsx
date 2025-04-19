"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MenuIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import MobileMenu from "./mobilemenu";
import { User } from "@/types";


interface HeaderProps {
  user: User | null; // User can be an object or null when not authenticated
}

export default function Header({ user }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Handle scroll for sticky header effects
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full ${
        isScrolled ? "bg-white/95 backdrop-blur-sm shadow-sm" : "bg-white"
      } transition-all duration-200`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent">
              InvoicePro
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-10">
            <Link
              href="#features"
              className="text-gray-600 hover:text-blue-700 transition-colors text-sm font-medium"
            >
              Features
            </Link>
            <Link
              href="#testimonials"
              className="text-gray-600 hover:text-blue-700 transition-colors text-sm font-medium"
            >
              Testimonials
            </Link>
            <Link
              href="#about"
              className="text-gray-600 hover:text-blue-700 transition-colors text-sm font-medium"
            >
              About Us
            </Link>
          </nav>

          {/* Authentication Buttons */}
          <div className="flex items-center space-x-4">
            {user ? (
              // Show Dashboard button when user is logged in
              <Link href="/dashboard">
                <Button className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-medium transition-colors shadow-sm">
                  Dashboard
                </Button>
              </Link>
            ) : (
              // Show Sign in and Get Started when user is not logged in
              <>
                <Link href="/login" className="hidden md:block">
                  <Button
                    variant="outline"
                    className="px-5 py-2.5 border-gray-300 text-gray-700 hover:text-blue-700 hover:border-blue-700 rounded-lg font-medium transition-colors"
                  >
                    Sign in
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-medium transition-colors shadow-sm">
                    Get Started
                  </Button>
                </Link>
              </>
            )}

            {/* Mobile menu button */}
            <button
              className="md:hidden flex items-center"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-gray-700" />
              ) : (
                <MenuIcon className="h-6 w-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && <MobileMenu user={user} />}
    </header>
  );
}

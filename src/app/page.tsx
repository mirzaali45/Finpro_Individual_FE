'use client';

import { useAuth } from "@/providers/AuthProviders";
import Header from "../components/header";
import Footer from "../components/Footer";
import HeroSection from "@/components/homepage/HeroSection";
import FeaturesSection from "@/components/homepage/FeatureSection";
import TestimonialsSection from "@/components/homepage/TestimonialSection";
import AboutUsSection from "@/components/homepage/AboutusSection";
import CtaSection from "@/components/homepage/CTASection";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Main Layout */}
      <Header user={user} />
      
      <main className="flex-1">
        <HeroSection user={user} />
        <FeaturesSection />
        <TestimonialsSection />
        <AboutUsSection />
        <CtaSection user={user} />
      </main>
      
      <Footer />
    </div>
  );
}
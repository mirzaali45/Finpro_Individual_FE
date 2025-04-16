'use client';

import { useAuth } from "@/providers/AuthProviders";
import { 
  HeroSection,
  FeaturesSection,
  TestimonialsSection,
  AboutUsSection,
  CtaSection
} from "./home/page";
import Header from "../components/header";
import Footer from "../components/Footer";

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
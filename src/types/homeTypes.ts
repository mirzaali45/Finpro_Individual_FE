// This should match your existing User type from src/types/index.ts
// Since your app already has a User type defined, we'll use that one

import { ReactNode } from "react";

// Create a proper interface without any type
export interface HomeUser {
  // Define specific properties that are used in the home page context
  id?: number | string;
  name?: string;
  email?: string;
  avatar?: string;
  username?: string;
}

export interface FeatureItem {
  icon: ReactNode;
  title: string;
  description: string;
  color: string;
}

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
  avatar: string;
}

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
}

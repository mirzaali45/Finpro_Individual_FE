// This should match your existing User type from src/types/index.ts
// Since your app already has a User type defined, we'll use that one
// and not add properties like 'id' that might not exist in your existing User type
export interface User {
  // We're not defining specific properties here to avoid conflicts
  // Use your existing User type
  [key: string]: any;
}

export interface FeatureItem {
  icon: React.ReactNode;
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
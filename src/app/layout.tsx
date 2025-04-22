import type { Metadata } from "next";
// import localFont from "next/font/local";
import "./globals.css";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/providers/AuthProviders";
import { ToastProvider } from "@/components/ui/use-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "InvoicePro - Invoice Management System",
  description: "Professional invoice management for businesses and freelancers",
  // icons: { icon: "public/iconinvoice.png" },
  // apple: "/icon.png",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ToastProvider>
          <AuthProvider>{children}</AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}

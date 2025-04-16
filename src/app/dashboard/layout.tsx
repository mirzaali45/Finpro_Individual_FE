"use client";

import { useAuth } from "@/providers/AuthProviders";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  FileText,
  Users,
  Package,
  Home,
  Settings,
  LogOut,
  Menu,
  X,
  ClipboardList
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Invoices", href: "/dashboard/invoices", icon: FileText },
    { name: "Clients", href: "/dashboard/clients", icon: Users },
    { name: "Products", href: "/dashboard/products", icon: Package },
    { name: "Reports", href: "/dashboard/reports", icon: ClipboardList },
  ];

  const userNavigation = [
    { name: "Profile", href: "/dashboard/profile", icon: Settings },
    { name: "Back to home", href: "/", icon: Settings },
    {
      name: "Sign out",
      href: "#",
      icon: LogOut,
      onClick: () => {
        logout();
        router.push("/login");
      },
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile menu */}
      <div
        className={cn(
          "fixed inset-0 z-50 lg:hidden bg-gray-900/80 backdrop-blur-sm transition-opacity duration-300",
          mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        <div className="fixed inset-y-0 left-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold">Invoice Management</span>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "group flex items-center rounded-md px-3 py-2 text-base font-medium",
                      pathname === item.href
                        ? "bg-primary text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <item.icon
                      className={cn(
                        "mr-3 h-6 w-6 flex-shrink-0",
                        pathname === item.href
                          ? "text-white"
                          : "text-gray-500 group-hover:text-primary"
                      )}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="py-6">
                {userNavigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="group flex items-center rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
                    onClick={(e) => {
                      if (item.onClick) {
                        e.preventDefault();
                        item.onClick();
                      }
                      setMobileMenuOpen(false);
                    }}
                  >
                    <item.icon
                      className="mr-3 h-6 w-6 flex-shrink-0 text-gray-500 group-hover:text-primary"
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:block lg:w-64 lg:overflow-y-auto lg:bg-white lg:pb-4 lg:pt-5">
        <div className="flex h-16 shrink-0 items-center px-6">
          <span className="text-xl font-bold">Invoice Management</span>
        </div>
        <nav className="mt-5 space-y-1 px-3">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center rounded-md px-3 py-2 text-sm font-medium",
                pathname === item.href
                  ? "bg-primary text-white"
                  : "text-gray-700 hover:bg-gray-100"
              )}
            >
              <item.icon
                className={cn(
                  "mr-3 h-5 w-5 flex-shrink-0",
                  pathname === item.href
                    ? "text-white"
                    : "text-gray-500 group-hover:text-primary"
                )}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 px-3 py-4 border-t border-gray-200">
          {userNavigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="group flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              onClick={(e) => {
                if (item.onClick) {
                  e.preventDefault();
                  item.onClick();
                }
              }}
            >
              <item.icon
                className="mr-3 h-5 w-5 flex-shrink-0 text-gray-500 group-hover:text-primary"
                aria-hidden="true"
              />
              {item.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Main content area */}
      <div className="lg:pl-64">
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 justify-end">
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <div className="hidden sm:flex sm:items-center sm:gap-4">
                <span className="text-sm font-medium">
                  {user?.username || user?.email}
                </span>
                <div className="h-6 w-6 overflow-hidden rounded-full bg-gray-100">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user?.username || "User"} />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-primary text-white text-xs">
                      {user?.username?.charAt(0).toUpperCase() ||
                        user?.email?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <main className="py-8 px-4 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}

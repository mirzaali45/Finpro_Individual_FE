// "use client";

// import { AuthLayout } from "@/components/auth/Authlayout";
// import RegisterForm from "@/components/auth/register/registerForm";

// export default function RegisterPage() {
//   return (
//     <AuthLayout
//       title="Get Started"
//       subtitle="Create your account"
//       sidebarTitle="InvoicePro"
//       sidebarSubtitle="Your Complete Invoice Solution"
//       sidebarDescription="Join thousands of businesses that trust InvoicePro to manage their invoicing needs. Get started in minutes with our simple registration process."
//       sidebarFeatures={[
//         "Unlimited invoices and estimates",
//         "Secure cloud-based storage",
//         "Free for small businesses",
//       ]}
//     >
//       <RegisterForm />
//     </AuthLayout>
//   );
// }

// src/app/(auth)/register/page.tsx
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authApi } from "@/lib/api";
import { AlertCircle, CheckCircle } from "lucide-react";

// Type for Google credential response
interface GoogleCredentialResponse {
  credential: string;
  select_by?: string;
  clientId?: string;
}

// Handle Google error response
interface GoogleErrorResponse {
  type: string;
  message?: string;
}

// Type for API errors
interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [googleLoaded, setGoogleLoaded] = useState(false);
  const googleButtonRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  // Handle Google credential - using useCallback to prevent dependency issues
  const handleGoogleCredential = useCallback(
    async (response: GoogleCredentialResponse) => {
      try {
        setIsLoading(true);
        setError("");

        console.log("Received Google credential response");
        const credential = response.credential;

        // Decode JWT token from Google
        const base64Url = credential.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split("")
            .map(function (c) {
              return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join("")
        );

        const { email, name, picture } = JSON.parse(jsonPayload);
        console.log(`Processing Google sign-up for ${email}`);

        // Register using Google credential
        const result = await authApi.googleLogin({
          email,
          name,
          picture,
        });

        console.log("Google sign-up successful");
        localStorage.setItem("token", result.token);
        router.push("/dashboard");
      } catch (err: unknown) {
        console.error("Google registration error:", err);

        // Handle specific error responses from the API
        if (err && typeof err === "object" && "response" in err) {
          const apiError = err as {
            response?: { data?: { message?: string } };
          };
          setError(
            apiError.response?.data?.message ||
              "Failed to register with Google. Please try again."
          );
        } else {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to register with Google. Please try again."
          );
        }
      } finally {
        setIsLoading(false);
      }
    },
    [router]
  );

  // Check if Google API is available
  useEffect(() => {
    const checkGoogleAPI = () => {
      if (
        typeof window !== "undefined" &&
        window.google &&
        window.google.accounts &&
        window.google.accounts.id
      ) {
        setGoogleLoaded(true);
      } else {
        setTimeout(checkGoogleAPI, 100);
      }
    };

    checkGoogleAPI();

    // Log if the Google Client ID is missing
    if (
      typeof window !== "undefined" &&
      !process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
    ) {
      console.error("Google Client ID is not defined in environment variables");
    }
  }, []);

  // Initialize Google button when API is loaded
  useEffect(() => {
    if (!googleLoaded || !googleButtonRef.current) return;

    try {
      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

      if (!clientId) {
        console.error("Google Client ID is not defined");
        setError(
          "Google registration configuration is missing. Please contact support."
        );
        return;
      }

      if (
        window.google &&
        window.google.accounts &&
        window.google.accounts.id
      ) {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleGoogleCredential,
          context: "signup",
          error_callback: (error: GoogleErrorResponse) => {
            console.error("Google Sign-Up Error:", error);

            // Show specific error messages based on error type
            if (error.type === "popup_failed_to_open") {
              setError(
                "Google sign-up popup was blocked. Please allow popups for this site."
              );
            } else if (error.type === "popup_closed") {
              setError("Google sign-up was cancelled. Please try again.");
            } else if (error.type === "invalid_client") {
              setError("Invalid client configuration. Please contact support.");
            } else if (error.type === "invalid_request") {
              setError("Invalid request. Please try again later.");
            } else if (error.type === "origin_mismatch") {
              setError(
                "Domain not authorized for Google sign-up. Please contact support."
              );
              console.error(
                `Current origin ${window.location.origin} is not authorized in Google Cloud Console`
              );
            } else {
              setError(
                `Google sign-up failed: ${
                  error.type || "Unknown error"
                }. Please try email registration.`
              );
            }
          },
        });

        window.google.accounts.id.renderButton(googleButtonRef.current, {
          type: "standard",
          theme: "outline",
          size: "large",
          text: "signup_with",
          shape: "rectangular",
          logo_alignment: "center",
          width: 250,
        });
      }

      console.log("Google Sign-Up button initialized successfully");
    } catch (err) {
      console.error("Error initializing Google sign-up:", err);
      setError(
        "Failed to initialize Google sign-up. Please try email registration."
      );
    }
  }, [googleLoaded, handleGoogleCredential]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setIsLoading(true);

    try {
      await authApi.register({ email });
      setSuccess(true);
    } catch (err: unknown) {
      const apiError = err as ApiError;
      setError(
        apiError.response?.data?.message ||
          "Failed to register. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-slate-100">
      {/* Left section (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-blue-600 text-white">
        <div className="h-full w-full flex flex-col justify-center items-center p-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-md"
          >
            <h1 className="text-4xl font-bold mb-6">InvoicePro</h1>
            <h2 className="text-2xl font-semibold mb-4">
              Your Complete Invoice Solution
            </h2>
            <p className="text-blue-100 mb-8">
              Join thousands of businesses that trust InvoicePro to manage their
              invoicing needs. Get started in minutes with our simple
              registration process.
            </p>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="bg-blue-500 p-2 rounded-full mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <p>Unlimited invoices and estimates</p>
              </div>
              <div className="flex items-center">
                <div className="bg-blue-500 p-2 rounded-full mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <p>Secure cloud-based storage</p>
              </div>
              <div className="flex items-center">
                <div className="bg-blue-500 p-2 rounded-full mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <p>Free for small businesses</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right section (Register form) */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-blue-700 mb-2">
              Get Started
            </h1>
            <p className="text-slate-600">Create your account</p>
          </div>

          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="bg-white p-8 rounded-xl shadow-lg"
          >
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-start"
                role="alert"
              >
                <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <p>{error}</p>
              </motion.div>
            )}

            {success ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-4"
              >
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl leading-6 font-bold text-slate-900 mb-2">
                  Registration successful
                </h3>
                <div className="mt-2 mb-6">
                  <p className="text-slate-600">
                    We&apos;ve sent a verification email to{" "}
                    <span className="font-semibold">{email}</span>.
                    <br />
                    Please check your inbox to complete your registration.
                  </p>
                </div>
                <Button
                  onClick={() => router.push("/login")}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition duration-200"
                >
                  Return to Login
                </Button>
              </motion.div>
            ) : (
              <>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-1">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-slate-700"
                    >
                      Business Email
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@business.com"
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <p className="mt-2 text-sm text-slate-500">
                      We&apos;ll send you a verification email to complete your
                      registration.
                    </p>
                  </div>

                  <div>
                    <Button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition duration-200 ease-in-out transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Registering...
                        </div>
                      ) : (
                        "Create Account"
                      )}
                    </Button>
                  </div>
                </form>

                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-200" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="bg-white px-2 text-slate-500">
                        Or continue with
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-center">
                    {/* Rendered Google button */}
                    <div
                      ref={googleButtonRef}
                      className="flex justify-center"
                    ></div>
                  </div>
                </div>
              </>
            )}
          </motion.div>

          {!success && (
            <div className="mt-8 text-center">
              <p className="text-slate-600">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </div>
          )}
        </motion.div>

        <p className="mt-8 text-center text-sm text-slate-500">
          © 2025 InvoicePro. All rights reserved.
        </p>
      </div>
    </div>
  );
}

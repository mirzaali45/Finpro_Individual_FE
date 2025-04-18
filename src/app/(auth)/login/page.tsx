// "use client";

// import { AuthLayout } from "@/components/auth/Authlayout";
// import LoginForm from "@/components/auth/login/LoginForm";

// export default function LoginPage() {
//   return (
//     <AuthLayout
//       title="Welcome Back"
//       subtitle="Sign in to access your account"
//       sidebarTitle="InvoicePro"
//       sidebarSubtitle="Streamline Your Invoice Management"
//       sidebarDescription="Efficiently manage your invoices, track payments, and gain insights into your financial performance with our intuitive platform."
//       sidebarFeatures={[
//         "Create and send professional invoices in seconds",
//         "Track payment status in real-time",
//         "Generate comprehensive financial reports"
//       ]}
//     >
//       <LoginForm />
//     </AuthLayout>
//   );
// }
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/providers/AuthProviders";
import { Eye, EyeOff, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [googleLoaded, setGoogleLoaded] = useState(false);
  const googleButtonRef = useRef<HTMLDivElement>(null);

  const { login, googleLogin } = useAuth();
  const router = useRouter();

  // Load Google Identity API
  useEffect(() => {
    const loadGoogleScript = () => {
      // Check if script is already loaded
      if (
        document.querySelector(
          'script[src="https://accounts.google.com/gsi/client"]'
        )
      ) {
        setGoogleLoaded(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.onload = () => setGoogleLoaded(true);
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    };

    loadGoogleScript();
  }, []);

  // Initialize Google button when API is loaded
  useEffect(() => {
    if (!googleLoaded || !googleButtonRef.current) return;

    try {
      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

      if (!clientId) {
        console.error(
          "Google Client ID is not defined in environment variables"
        );
        setError(
          "Google login configuration is missing. Please contact support."
        );
        return;
      }

      if (window.google && window.google.accounts) {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleGoogleCredential,
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        window.google.accounts.id.renderButton(googleButtonRef.current, {
          type: "standard",
          theme: "outline",
          size: "large",
          text: "signin_with",
          shape: "rectangular",
          logo_alignment: "center",
          width: 250,
        });

        // Optional: Display One Tap UI
        // window.google.accounts.id.prompt();
      }
    } catch (err) {
      console.error("Error initializing Google sign-in:", err);
      setError("Failed to initialize Google sign-in. Please try email login.");
    }
  }, [googleLoaded]);

  // Handler for Google credential
  const handleGoogleCredential = async (response: any) => {
    try {
      setIsLoading(true);
      setError("");

      console.log("Received Google credential response");
      const credential = response.credential;

      // Decode JWT token from Google to extract basic info
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
      console.log(`Processing Google sign-in for ${email}`);

      // Login using Google credential
      await googleLogin({
        email,
        name,
        picture,
      });

      console.log("Google sign-in successful");
      router.push("/dashboard");
    } catch (err: any) {
      console.error("Google login error:", err);

      // Handle specific error responses from the API
      if (err && typeof err === "object" && "response" in err) {
        const apiError = err as { response?: { data?: { message?: string } } };
        setError(
          apiError.response?.data?.message ||
            "Failed to login with Google. Please try again."
        );
      } else {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to login with Google. Please try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Failed to login. Please try again."
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
              Streamline Your Invoice Management
            </h2>
            <p className="text-blue-100 mb-8">
              Efficiently manage your invoices, track payments, and gain
              insights into your financial performance with our intuitive
              platform.
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
                <p>Create and send professional invoices in seconds</p>
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
                <p>Track payment status in real-time</p>
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
                <p>Generate comprehensive financial reports</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right section (Login form) */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-blue-700 mb-2">
              Welcome Back
            </h1>
            <p className="text-slate-600">Sign in to access your account</p>
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

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-slate-700"
                >
                  Email address
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Password
                  </label>
                  <Link
                    href="/reset-password"
                    className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-700"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
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
                      Signing in...
                    </div>
                  ) : (
                    "Sign in"
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
                {/* Google Sign-In button */}
                <div
                  ref={googleButtonRef}
                  className="flex justify-center"
                ></div>
              </div>
            </div>
          </motion.div>

          <div className="mt-8 text-center">
            <p className="text-slate-600">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
              >
                Create an account
              </Link>
            </p>
          </div>
        </motion.div>

        <p className="mt-8 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} InvoicePro. All rights reserved.
        </p>
      </div>
    </div>
  );
}

// "use client";

// import { useVerifyToken } from "@/components/auth/verify/hooks/useVerifyToken";
// import VerifyForm from "@/components/auth/verify/VerifyForm";
// import InvalidToken from "@/components/auth/verify/InvalidToken";
// import VerificationSuccess from "@/components/auth/verify/VerificationSucces";
// import VerifyingToken from "@/components/auth/verify/VerifyingToken";

// export default function VerifyAccountPage({
//   params,
// }: {
//   params: { token: string };
// }) {
//   const { token } = params;
//   const { isVerifying, tokenValid, success, error } = useVerifyToken(token);

//   if (isVerifying) {
//     return <VerifyingToken />;
//   }

//   if (!tokenValid) {
//     return <InvalidToken error={error} />;
//   }

//   if (success) {
//     return <VerificationSuccess />;
//   }

//   return <VerifyForm token={token} />;
// }

// src/app/(auth)/verify/[token]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authApi } from "@/lib/api";
import { VerifyAccountFormData } from "@/types";
import Link from "next/link";

export default function VerifyAccountPage({
  params,
}: {
  params: { token: string };
}) {
  const router = useRouter();
  const { token } = params;

  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);
  const [formData, setFormData] = useState<VerifyAccountFormData>({
    username: "",
    firstName: "",
    lastName: "",
    phone: "",
    password: "",
    confirmPassword: "",
    companyName: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    website: "",
    taxNumber: "",
  });

  const [activeSection, setActiveSection] = useState(1);

  // Check if token is valid
  useEffect(() => {
    const verifyToken = async () => {
      try {
        await authApi.checkEmailToken(token);
        setTokenValid(true);
      } catch (err) {
        setTokenValid(false);
        setError(
          "This verification link is invalid or has expired. Please request a new one."
        );
      } finally {
        setIsVerifying(false);
      }
    };

    verifyToken();
  }, [token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      await authApi.verifyAccount(token, formData);
      setSuccess(true);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Failed to verify account. Please try again or contact support."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    // Validate current section before moving to next
    if (activeSection === 1) {
      // Validate account information
      if (!formData.username) {
        setError("Username is required");
        return;
      }
      if (!formData.password) {
        setError("Password is required");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        return;
      }
      if (formData.password.length < 8) {
        setError("Password must be at least 8 characters long");
        return;
      }
    }

    setError("");
    setActiveSection(activeSection + 1);
  };

  const handleBack = () => {
    setError("");
    setActiveSection(activeSection - 1);
  };

  // Show loading state
  if (isVerifying) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying your email...</p>
        </div>
      </div>
    );
  }

  // Show token invalid state
  if (!tokenValid) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-900">Link Expired</h1>
            <p className="mt-2 text-gray-600">
              The verification link is invalid or has expired
            </p>
          </div>

          <div className="bg-white p-8 shadow-md rounded-lg text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <svg
                className="h-6 w-6 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Invalid or Expired Link
            </h3>
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                The verification link you clicked is no longer valid. Please
                register again to receive a new verification link.
              </p>
            </div>
            <div className="mt-5">
              <Link href="/register">
                <Button className="w-full">Register Again</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-900">
              Account Verified
            </h1>
            <p className="mt-2 text-gray-600">
              Your account has been successfully verified.
            </p>
          </div>

          <div className="bg-white p-8 shadow-md rounded-lg text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <svg
                className="h-6 w-6 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Verification Complete
            </h3>
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                Your account has been successfully verified. You can now log in
                to access your dashboard.
              </p>
            </div>
            <div className="mt-5">
              <Link href="/login">
                <Button className="w-full">Continue to Login</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900">
            Complete Your Registration
          </h1>
          <p className="mt-2 text-gray-600">Please set up your account</p>
        </div>

        {error && (
          <div
            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4"
            role="alert"
          >
            <p>{error}</p>
          </div>
        )}

        <div className="bg-white p-8 shadow-md rounded-lg">
          <form onSubmit={handleSubmit}>
            {/* Progress steps */}
            <div className="mb-8">
              <div className="flex justify-between items-center">
                <div
                  className={`flex items-center ${
                    activeSection >= 1 ? "text-primary" : "text-gray-400"
                  }`}
                >
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full ${
                      activeSection >= 1
                        ? "bg-primary text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    1
                  </div>
                  <span className="ml-2 text-sm font-medium">Account</span>
                </div>
                <div
                  className={`flex-1 border-t ${
                    activeSection >= 2 ? "border-primary" : "border-gray-200"
                  } mx-2`}
                ></div>
                <div
                  className={`flex items-center ${
                    activeSection >= 2 ? "text-primary" : "text-gray-400"
                  }`}
                >
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full ${
                      activeSection >= 2
                        ? "bg-primary text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    2
                  </div>
                  <span className="ml-2 text-sm font-medium">Business</span>
                </div>
                <div
                  className={`flex-1 border-t ${
                    activeSection >= 3 ? "border-primary" : "border-gray-200"
                  } mx-2`}
                ></div>
                <div
                  className={`flex items-center ${
                    activeSection >= 3 ? "text-primary" : "text-gray-400"
                  }`}
                >
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full ${
                      activeSection >= 3
                        ? "bg-primary text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    3
                  </div>
                  <span className="ml-2 text-sm font-medium">Confirm</span>
                </div>
              </div>
            </div>

            {/* Section 1: Account Information */}
            {activeSection === 1 && (
              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Username*
                  </label>
                  <Input
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    className="mt-1"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      First Name
                    </label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Last Name
                    </label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Phone Number
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="mt-1"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password*
                  </label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="mt-1"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Must be at least 8 characters long
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Confirm Password*
                  </label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="mt-1"
                  />
                </div>

                <div className="flex justify-end">
                  <Button type="button" onClick={handleNext}>
                    Next
                  </Button>
                </div>
              </div>
            )}

            {/* Section 2: Business Information */}
            {activeSection === 2 && (
              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="companyName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Company Name
                  </label>
                  <Input
                    id="companyName"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    className="mt-1"
                  />
                </div>

                <div>
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Address
                  </label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="mt-1"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="city"
                      className="block text-sm font-medium text-gray-700"
                    >
                      City
                    </label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="state"
                      className="block text-sm font-medium text-gray-700"
                    >
                      State/Province
                    </label>
                    <Input
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="postalCode"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Postal Code
                    </label>
                    <Input
                      id="postalCode"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="country"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Country
                    </label>
                    <Input
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="website"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Website
                  </label>
                  <Input
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    className="mt-1"
                  />
                </div>

                <div>
                  <label
                    htmlFor="taxNumber"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Tax/VAT Number
                  </label>
                  <Input
                    id="taxNumber"
                    name="taxNumber"
                    value={formData.taxNumber}
                    onChange={handleChange}
                    className="mt-1"
                  />
                </div>

                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={handleBack}>
                    Back
                  </Button>
                  <Button type="button" onClick={handleNext}>
                    Next
                  </Button>
                </div>
              </div>
            )}

            {/* Section 3: Review Information */}
            {activeSection === 3 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Review Information
                  </h3>

                  <div className="border rounded-md p-4 bg-gray-50">
                    <h4 className="font-medium mb-2">Account Information</h4>
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">
                          Username
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {formData.username}
                        </dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">
                          Name
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {formData.firstName} {formData.lastName}
                        </dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">
                          Phone
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {formData.phone || "-"}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  {(formData.companyName || formData.address) && (
                    <div className="border rounded-md p-4 bg-gray-50">
                      <h4 className="font-medium mb-2">Business Information</h4>
                      <dl className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
                        {formData.companyName && (
                          <div className="sm:col-span-2">
                            <dt className="text-sm font-medium text-gray-500">
                              Company Name
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900">
                              {formData.companyName}
                            </dd>
                          </div>
                        )}
                        {formData.address && (
                          <div className="sm:col-span-2">
                            <dt className="text-sm font-medium text-gray-500">
                              Address
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900">
                              {formData.address}
                              {formData.city && `, ${formData.city}`}
                              {formData.state && `, ${formData.state}`}
                              {formData.postalCode && ` ${formData.postalCode}`}
                              {formData.country && `, ${formData.country}`}
                            </dd>
                          </div>
                        )}
                        {formData.website && (
                          <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">
                              Website
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900">
                              {formData.website}
                            </dd>
                          </div>
                        )}
                        {formData.taxNumber && (
                          <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">
                              Tax/VAT Number
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900">
                              {formData.taxNumber}
                            </dd>
                          </div>
                        )}
                      </dl>
                    </div>
                  )}
                </div>

                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={handleBack}>
                    Back
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading
                      ? "Creating Account..."
                      : "Complete Registration"}
                  </Button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

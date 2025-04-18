import { useState } from "react";
import { authApi } from "@/lib/api";
import { VerifyAccountFormData } from "@/types";

export function useVerifyForm(token: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [activeSection, setActiveSection] = useState(1);
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

  return {
    formData,
    isLoading,
    error,
    success,
    activeSection,
    handleChange,
    handleSubmit,
    handleNext,
    handleBack,
  };
}

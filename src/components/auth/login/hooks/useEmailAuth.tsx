import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProviders";
import { ApiError } from "@/lib/utils";

export function useEmailAuth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (err: unknown) {
      const apiError = err as ApiError;
      setError(
        apiError.response?.data?.message || "Failed to login. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    isLoading,
    error,
    setError,
    handleSubmit,
  };
}

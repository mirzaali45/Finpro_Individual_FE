import { useState } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api";
import { ApiError } from "@/lib/utils";

export function useRegister() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const router = useRouter();

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

  return {
    email,
    setEmail,
    error,
    setError,
    isLoading,
    success,
    setSuccess,
    handleSubmit,
    router,
  };
}

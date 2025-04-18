import { useState } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api";

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
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Failed to register. Please try again."
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

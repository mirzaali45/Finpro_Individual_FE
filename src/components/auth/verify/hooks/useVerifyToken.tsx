import { useState, useEffect } from "react";
import { authApi } from "@/lib/api";

export function useVerifyToken(token: string) {
  const [isVerifying, setIsVerifying] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);

  // Check if token is valid
  useEffect(() => {
    const verifyToken = async () => {
      try {
        await authApi.checkEmailToken(token);
        setTokenValid(true);
      } catch {
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

  return {
    isVerifying,
    error,
    setError,
    success,
    setSuccess,
    tokenValid
  };
}
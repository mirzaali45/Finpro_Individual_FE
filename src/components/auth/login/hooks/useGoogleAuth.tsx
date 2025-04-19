import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProviders";

// Google types
interface GoogleCredentialResponse {
  credential: string;
  select_by?: string;
  clientId?: string;
}

interface GoogleErrorResponse {
  type: string;
  message?: string;
}

interface GoogleUser {
  email: string;
  name: string;
  picture: string;
}

export function useGoogleAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [googleLoaded, setGoogleLoaded] = useState(false);
  const googleButtonRef = useRef<HTMLDivElement>(null);

  const { googleLogin } = useAuth();
  const router = useRouter();

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

  // Decode JWT token from Google
  const decodeGoogleJwt = (credential: string): GoogleUser => {
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
    return { email, name, picture };
  };

  // Handler for Google credential
  const handleGoogleCredential = async (response: GoogleCredentialResponse) => {
    try {
      setIsLoading(true);
      setError("");

      console.log("Received Google credential response");
      const credential = response.credential;
      const { email, name, picture } = decodeGoogleJwt(credential);

      console.log(`Processing Google sign-in for ${email}`);

      // Login using Google credential
      await googleLogin({
        email,
        name,
        picture,
      });

      console.log("Google sign-in successful");
      router.push("/dashboard");
    } catch (err: unknown) {
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

  const handleGoogleError = (error: GoogleErrorResponse) => {
    console.error("Google Sign-In Error:", error);

    // Show specific error messages based on error type
    if (error.type === "popup_failed_to_open") {
      setError(
        "Google sign-in popup was blocked. Please allow popups for this site."
      );
    } else if (error.type === "popup_closed") {
      setError("Google sign-in was cancelled. Please try again.");
    } else if (error.type === "invalid_client") {
      setError("Invalid client configuration. Please contact support.");
    } else if (error.type === "invalid_request") {
      setError("Invalid request. Please try again later.");
    } else if (error.type === "origin_mismatch") {
      setError(
        "Domain not authorized for Google sign-in. Please contact support."
      );
      console.error(
        `Current origin ${window.location.origin} is not authorized in Google Cloud Console`
      );
    } else {
      setError(
        `Google sign-in failed: ${
          error.type || "Unknown error"
        }. Please try email login.`
      );
    }
  };

  return {
    isLoading,
    error,
    setError,
    googleLoaded,
    googleButtonRef,
    handleGoogleCredential,
    handleGoogleError,
  };
}

import { useEffect } from "react";
import { useGoogleRegister } from "./hooks/useGoogleRegister";

export default function GoogleSignUp() {
  const {
    googleLoaded,
    googleButtonRef,
    handleGoogleCredential,
    handleGoogleError
  } = useGoogleRegister();

  // Initialize Google button when API is loaded
  useEffect(() => {
    if (!googleLoaded || !googleButtonRef.current) return;

    try {
      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

      if (!clientId) {
        console.error("Google Client ID is not defined");
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
          error_callback: handleGoogleError,
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
    }
  }, [googleLoaded, googleButtonRef, handleGoogleCredential, handleGoogleError]);

  return (
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
  );
}
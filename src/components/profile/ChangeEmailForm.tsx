import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authApi } from "@/lib/api";
import { Mail } from "lucide-react";

interface ChangeEmailFormProps {
  currentEmail: string;
}

export default function ChangeEmailForm({
  currentEmail,
}: ChangeEmailFormProps) {
  const [state, setState] = useState({
    newEmail: "",
    showForm: false,
    loading: false,
    success: false,
    error: "",
  });

  const handleChangeEmail = async () => {
    // Validate email before sending request
    if (!state.newEmail || !state.newEmail.includes("@")) {
      setState({
        ...state,
        error: "Please enter a valid email address",
      });
      return;
    }

    setState({
      ...state,
      loading: true,
      error: "",
    });

    try {
      const response = await authApi.requestChangeEmail({
        newEmail: state.newEmail,
      });

      if (response && response.status === "success") {
        setState({
          ...state,
          success: true,
          loading: false,
        });
      } else {
        throw new Error(response?.message || "Failed to request email change");
      }
    } catch (err: any) {
      console.error("Email change error:", err);
      setState({
        ...state,
        error:
          err.response?.data?.message ||
          err.message ||
          "Failed to request email change. Please try again.",
        loading: false,
      });
    }
  };

  const resetForm = () => {
    setState({
      newEmail: "",
      showForm: false,
      loading: false,
      success: false,
      error: "",
    });
  };

  return (
    <div className="mt-5 md:mt-0 md:col-span-2">
      <div className="flex">
        <div className="flex-grow flex flex-col">
          <div className="flex items-center">
            <Mail className="h-5 w-5 text-gray-400 mr-2" />
            <span className="text-sm font-medium text-gray-800">
              {currentEmail}
            </span>
          </div>
          {!state.showForm && (
            <Button
              type="button"
              variant="outline"
              className="mt-3 w-auto"
              onClick={() =>
                setState({
                  ...state,
                  showForm: true,
                })
              }
            >
              Change Email
            </Button>
          )}
        </div>
      </div>

      {state.showForm && (
        <div className="mt-4">
          {state.success ? (
            <div
              className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded"
              role="alert"
            >
              <p>
                Verification email sent to {state.newEmail}. Please check your
                inbox to complete the email change.
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={resetForm}
              >
                Close
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {state.error && (
                <div
                  className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded"
                  role="alert"
                >
                  <p>{state.error}</p>
                </div>
              )}

              <div>
                <label
                  htmlFor="newEmail"
                  className="block text-sm font-medium text-gray-700"
                >
                  New Email Address
                </label>
                <Input
                  id="newEmail"
                  name="newEmail"
                  type="email"
                  value={state.newEmail}
                  onChange={(e) =>
                    setState({
                      ...state,
                      newEmail: e.target.value,
                      error: "", // Reset error when typing
                    })
                  }
                  required
                  className="mt-1"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  onClick={handleChangeEmail}
                  disabled={state.loading || !state.newEmail}
                >
                  {state.loading ? "Sending..." : "Send Verification"}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

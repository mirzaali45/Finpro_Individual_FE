// src/components/ui/use-toast.tsx
"use client";
import * as React from "react";
import { useState } from "react";

export type ToastProps = {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: "default" | "destructive";
  duration?: number;
};

type ToastContextType = {
  toast: (props: ToastProps) => string;
  dismiss: (id: string) => void;
};

const ToastContext = React.createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Array<ToastProps & { id: string }>>([]);

  const addToast = (props: ToastProps) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prevToasts) => [...prevToasts, { ...props, id }]);

    // Auto dismiss after duration
    if (props.duration !== 0) {
      setTimeout(() => {
        dismissToast(id);
      }, props.duration || 5000);
    }

    return id;
  };

  const dismissToast = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider
      value={{
        toast: addToast,
        dismiss: dismissToast,
      }}
    >
      {children}
      {toasts.length > 0 && (
        <div className="fixed bottom-0 right-0 p-4 space-y-2 z-50">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`bg-white rounded shadow-lg p-4 transition-all transform translate-y-0 opacity-100 flex flex-col max-w-sm ${
                toast.variant === "destructive"
                  ? "border-l-4 border-red-500"
                  : "border-l-4 border-primary"
              }`}
            >
              {toast.title && <h3 className="font-medium">{toast.title}</h3>}
              {toast.description && (
                <p className="text-sm text-gray-500">{toast.description}</p>
              )}
              {toast.action}
              <button
                onClick={() => dismissToast(toast.id)}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}
    </ToastContext.Provider>
  );
}

// Custom hook to use toast
export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

// Define the toast function interface properly
interface ToastFunction {
  (): string | undefined;
  default: () => string | undefined;
  destructive: () => string | undefined;
}

// Export a toast function and methods
export const toast: ToastFunction = function toastFn() {
  // This is not a hook call but a regular function
  // This will be called from components where useToast is properly called
  console.warn(
    "Direct toast() call should be used inside a component with useToast. For standalone usage, import and use useToast() hook instead."
  );
  return undefined;
} as ToastFunction;

// Add variants as properties
toast.default = function () {
  console.warn(
    "Direct toast.default() call should be used inside a component with useToast. For standalone usage, import and use useToast() hook instead."
  );
  return undefined;
};

toast.destructive = function () {
  console.warn(
    "Direct toast.destructive() call should be used inside a component with useToast. For standalone usage, import and use useToast() hook instead."
  );
  return undefined;
};

// Example of the correct way to use toast in a component:
/*
function MyComponent() {
  // 1. Get the toast function from the useToast hook
  const { toast: showToast } = useToast();
  
  // 2. Use it in event handlers
  const handleClick = () => {
    showToast({
      title: "Success",
      description: "Operation completed successfully",
      variant: "default"
    });
  };
  
  return <button onClick={handleClick}>Show Toast</button>;
}
*/

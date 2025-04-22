// src/components/shared/AlertMessage.tsx
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AlertMessageProps {
  error?: string;
  success?: string;
}

export default function AlertMessage({ error, success }: AlertMessageProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"error" | "success" | "">("");

  useEffect(() => {
    if (error) {
      setMessage(error);
      setMessageType("error");
      setIsVisible(true);
      
      // Set timer to hide message after 4 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 4000);
      
      return () => clearTimeout(timer);
    } else if (success) {
      setMessage(success);
      setMessageType("success");
      setIsVisible(true);
      
      // Set timer to hide message after 4 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 4000);
      
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [error, success]);

  if (!message) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className={`${
            messageType === "error"
              ? "bg-red-50 border border-red-200 text-red-700"
              : "bg-green-50 border border-green-200 text-green-700"
          } px-4 py-3 rounded`}
          role="alert"
        >
          <p>{message}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
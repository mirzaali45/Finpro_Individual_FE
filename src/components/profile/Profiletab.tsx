// src/components/profile/ProfileTabs.tsx
"use client";

import * as Tabs from "@radix-ui/react-tabs";
import { motion } from "framer-motion";

interface ProfileTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function ProfileTabs({
  activeTab,
  setActiveTab,
}: ProfileTabsProps) {
  const tabs = [
    { id: "personal", label: "Personal Information" },
    { id: "business", label: "Business Details" },
    { id: "payments", label: "Payment Methods" },
    { id: "account", label: "Account Settings" },
  ];

  return (
    <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
      <Tabs.List className="flex border-b border-gray-200 w-full">
        {tabs.map((tab) => (
          <Tabs.Trigger
            key={tab.id}
            value={tab.id}
            className={`relative w-1/4 py-4 px-1 text-center text-sm font-medium transition-colors focus:outline-none ${
              activeTab === tab.id
                ? "text-primary"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                initial={false}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
    </Tabs.Root>
  );
}

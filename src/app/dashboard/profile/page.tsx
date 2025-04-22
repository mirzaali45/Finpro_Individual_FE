// src/app/dashboard/profile/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/providers/AuthProviders";
import { UpdateProfileFormData } from "@/types";
import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/utils";
import apiClient from "@/lib/api";
import * as Tabs from "@radix-ui/react-tabs";
import { motion, AnimatePresence } from "framer-motion";
import ProfileTabs from "@/components/profile/Profiletab";
import PersonalInfoTab from "@/components/profile/PersonalInfoTab";
import BusinessDetailsTab from "@/components/profile/BusinessDetailsTab";
import PaymentMethodsTab from "@/components/profile/PaymentMethodTabs";
import AccountSettingsTab from "@/components/profile/AccountSettingTab";
import AlertMessage from "@/components/profile/shared/AllertMessage";

export default function ProfilePage() {
  const { user, profile, bankAccounts, eWallets, updateUserData } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState("personal");

  // Form state
  const [formData, setFormData] = useState<UpdateProfileFormData>({
    username: "",
    firstName: "",
    lastName: "",
    phone: "",
    avatar: "",
    companyName: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    logo: "",
    website: "",
    taxNumber: "",
  });

  // Image previews
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        firstName: user.first_name || "",
        lastName: user.last_name || "",
        phone: user.phone || "",
        avatar: user.avatar || "",
        companyName: profile?.company_name || "",
        address: profile?.address || "",
        city: profile?.city || "",
        state: profile?.state || "",
        postalCode: profile?.postal_code || "",
        country: profile?.country || "",
        logo: profile?.logo || "",
        website: profile?.website || "",
        taxNumber: profile?.tax_number || "",
      });

      // Set initial previews if images exist
      if (user.avatar) setAvatarPreview(user.avatar);
      if (profile?.logo) setLogoPreview(profile.logo);

      setIsLoading(false);
    } else {
      setIsLoading(true);
    }
  }, [user, profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (activeTab === "payments") {
      return;
    }

    setIsSaving(true);
    setError("");
    setSuccess("");

    try {
      // Create FormData object to handle file uploads
      const formDataToSend = new FormData();

      // Add text fields
      Object.entries(formData).forEach(([key, value]) => {
        if (
          key !== "avatar" &&
          key !== "logo" &&
          value !== undefined &&
          value !== null
        ) {
          formDataToSend.append(key, String(value));
        }
      });

      // Add image data if they're base64 strings
      if (formData.avatar && formData.avatar.startsWith("data:")) {
        formDataToSend.append("avatar", formData.avatar);
      }

      if (formData.logo && formData.logo.startsWith("data:")) {
        formDataToSend.append("logo", formData.logo);
      }

      const response = await apiClient.put("/auth/profile", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      updateUserData({
        user: response.data.user,
        profile: response.data.profile,
        bankAccounts:
          response.data.profile?.bank_accounts || bankAccounts || [],
        eWallets: response.data.profile?.e_wallets || eWallets || [],
      });

      // Update local state with the new image URLs
      if (response.data.user.avatar) {
        setAvatarPreview(response.data.user.avatar);
      }
      if (response.data.profile?.logo) {
        setLogoPreview(response.data.profile.logo);
      }

      setSuccess("Profile updated successfully");
    } catch (err: unknown) {
      console.error("Error updating profile:", err);
      const apiError = err as ApiError;
      setError(
        apiError.response?.data?.message ||
          "Failed to update profile. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const tabVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.3 } },
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Profile Settings</h1>
      <AlertMessage error={error} success={success} />
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
          <Tabs.Content value="personal">
            <AnimatePresence mode="wait">
              <motion.div
                key="personal"
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <form onSubmit={handleSubmit}>
                  <div className="p-6">
                    <PersonalInfoTab
                      formData={formData}
                      setFormData={setFormData}
                      avatarPreview={avatarPreview}
                      setAvatarPreview={setAvatarPreview}
                    />
                  </div>
                  <div className="px-6 py-3 bg-gray-50 text-right">
                    <Button type="submit" disabled={isSaving}>
                      {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </form>
              </motion.div>
            </AnimatePresence>
          </Tabs.Content>

          <Tabs.Content value="business">
            <AnimatePresence mode="wait">
              <motion.div
                key="business"
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <form onSubmit={handleSubmit}>
                  <div className="p-6">
                    <BusinessDetailsTab
                      formData={formData}
                      setFormData={setFormData}
                      logoPreview={logoPreview}
                      setLogoPreview={setLogoPreview}
                    />
                  </div>
                  <div className="px-6 py-3 bg-gray-50 text-right">
                    <Button type="submit" disabled={isSaving}>
                      {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </form>
              </motion.div>
            </AnimatePresence>
          </Tabs.Content>

          <Tabs.Content value="payments">
            <AnimatePresence mode="wait">
              <motion.div
                key="payments"
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <div className="p-6">
                  <PaymentMethodsTab
                    bankAccounts={bankAccounts || []}
                    eWallets={eWallets || []}
                    updateUserData={updateUserData}
                    user={user}
                    profile={profile}
                    setError={setError}
                    setSuccess={setSuccess}
                  />
                </div>
              </motion.div>
            </AnimatePresence>
          </Tabs.Content>

          <Tabs.Content value="account">
            <AnimatePresence mode="wait">
              <motion.div
                key="account"
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <form onSubmit={handleSubmit}>
                  <div className="p-6">
                    <AccountSettingsTab user={user} />
                  </div>
                  <div className="px-6 py-3 bg-gray-50 text-right">
                    <Button type="submit" disabled={isSaving}>
                      {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </form>
              </motion.div>
            </AnimatePresence>
          </Tabs.Content>
        </Tabs.Root>
      </div>
    </div>
  );
}

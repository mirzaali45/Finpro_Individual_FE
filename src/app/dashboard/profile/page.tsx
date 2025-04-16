// // src/app/dashboard/profile/page.tsx
// "use client";

// import { useState, useEffect, useRef, ChangeEvent } from "react";
// import { useAuth } from "@/providers/AuthProviders";
// import apiClient, { authApi } from "@/lib/api";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { UpdateProfileFormData, BankAccount, EWallet } from "@/types";
// import { User, Building, CreditCard, Wallet, Upload } from "lucide-react";
// import ChangeEmailForm from "@/components/profile/ChangeEmailForm";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// export default function ProfilePage() {
//   const { user, profile, bankAccounts, eWallets, updateUserData } = useAuth();
//   const [isLoading, setIsLoading] = useState(false);
//   const [isSaving, setIsSaving] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [activeTab, setActiveTab] = useState("personal");

//   // Refs for file inputs
//   const avatarFileRef = useRef<HTMLInputElement>(null);
//   const logoFileRef = useRef<HTMLInputElement>(null);

//   // Preview states
//   const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
//   const [logoPreview, setLogoPreview] = useState<string | null>(null);

//   // Bank account form state
//   const [showBankForm, setShowBankForm] = useState(false);
//   const [bankFormData, setBankFormData] = useState({
//     bank_name: "",
//     account_number: "",
//     account_name: "",
//     is_primary: false,
//   });

//   // E-wallet form state
//   const [showWalletForm, setShowWalletForm] = useState(false);
//   const [walletFormData, setWalletFormData] = useState({
//     wallet_type: "",
//     phone_number: "",
//     account_name: "",
//     is_primary: false,
//   });

//   const [formData, setFormData] = useState<UpdateProfileFormData>({
//     username: "",
//     firstName: "",
//     lastName: "",
//     phone: "",
//     avatar: "",
//     companyName: "",
//     address: "",
//     city: "",
//     state: "",
//     postalCode: "",
//     country: "",
//     logo: "",
//     website: "",
//     taxNumber: "",
//   });

//   useEffect(() => {
//     if (user) {
//       setFormData({
//         username: user.username || "",
//         firstName: user.first_name || "",
//         lastName: user.last_name || "",
//         phone: user.phone || "",
//         avatar: user.avatar || "",
//         companyName: profile?.company_name || "",
//         address: profile?.address || "",
//         city: profile?.city || "",
//         state: profile?.state || "",
//         postalCode: profile?.postal_code || "",
//         country: profile?.country || "",
//         logo: profile?.logo || "",
//         website: profile?.website || "",
//         taxNumber: profile?.tax_number || "",
//       });

//       // Set initial previews if images exist
//       if (user.avatar) setAvatarPreview(user.avatar);
//       if (profile?.logo) setLogoPreview(profile.logo);

//       setIsLoading(false);
//     } else {
//       setIsLoading(true);
//     }
//   }, [user, profile]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   // Handle file uploads
//   const handleFileChange = (
//     e: ChangeEvent<HTMLInputElement>,
//     type: "avatar" | "logo"
//   ) => {
//     if (e.target.files && e.target.files[0]) {
//       const file = e.target.files[0];
//       const reader = new FileReader();

//       reader.onloadend = () => {
//         const base64String = reader.result as string;

//         if (type === "avatar") {
//           setFormData({
//             ...formData,
//             avatar: base64String,
//           });
//           setAvatarPreview(base64String);
//         } else {
//           setFormData({
//             ...formData,
//             logo: base64String,
//           });
//           setLogoPreview(base64String);
//         }
//       };

//       reader.readAsDataURL(file);
//     }
//   };
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSaving(true);
//     setError("");
//     setSuccess("");

//     try {
//       // Create FormData object to handle file uploads
//       const formDataToSend = new FormData();

//       // Add text fields
//       Object.entries(formData).forEach(([key, value]) => {
//         if (
//           key !== "avatar" &&
//           key !== "logo" &&
//           value !== undefined &&
//           value !== null
//         ) {
//           formDataToSend.append(key, String(value));
//         }
//       });

//       // If avatar is a base64 string, add it directly
//       if (formData.avatar && formData.avatar.startsWith("data:")) {
//         formDataToSend.append("avatar", formData.avatar);
//       } else if (
//         avatarFileRef.current?.files &&
//         avatarFileRef.current.files[0]
//       ) {
//         formDataToSend.append("avatar", avatarFileRef.current.files[0]);
//       }

//       // If logo is a base64 string, add it directly
//       if (formData.logo && formData.logo.startsWith("data:")) {
//         formDataToSend.append("logo", formData.logo);
//       } else if (logoFileRef.current?.files && logoFileRef.current.files[0]) {
//         formDataToSend.append("logo", logoFileRef.current.files[0]);
//       }

//       console.log("Submitting profile update with images");

//       const response = await apiClient.put("/auth/profile", formDataToSend, {
//         headers: {
//           // Let the browser set the content type with boundary
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       console.log("Profile update response:", response.data);

//       // Update the context with the new data
//       updateUserData({
//         user: response.data.user,
//         profile: response.data.profile,
//         bankAccounts: response.data.profile?.bank_accounts || [],
//         eWallets: response.data.profile?.e_wallets || [],
//       });

//       // Update local state with the new image URLs
//       if (response.data.user.avatar) {
//         setAvatarPreview(response.data.user.avatar);
//       }
//       if (response.data.profile?.logo) {
//         setLogoPreview(response.data.profile.logo);
//       }

//       setSuccess("Profile updated successfully");
//     } catch (err: any) {
//       console.error("Error updating profile:", err);
//       setError(
//         err.response?.data?.message ||
//           "Failed to update profile. Please try again."
//       );
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   // Bank account handlers
//   const handleBankFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value, type, checked } = e.target;
//     setBankFormData({
//       ...bankFormData,
//       [name]: type === "checkbox" ? checked : value,
//     });
//   };

//   const handleBankFormSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");

//     try {
//       const response = await authApi.addBankAccount(bankFormData);

//       // Update bank accounts list
//       updateUserData({
//         user: user!,
//         profile: profile,
//         bankAccounts: [...bankAccounts, response.bankAccount],
//       });

//       setSuccess("Bank account added successfully");
//       setShowBankForm(false);
//       setBankFormData({
//         bank_name: "",
//         account_number: "",
//         account_name: "",
//         is_primary: false,
//       });
//     } catch (err: any) {
//       setError(
//         err.response?.data?.message ||
//           "Failed to add bank account. Please try again."
//       );
//     }
//   };

//   const handleDeleteBankAccount = async (id: number) => {
//     try {
//       await authApi.deleteBankAccount(id);

//       // Update bank accounts list
//       updateUserData({
//         user: user!,
//         profile: profile,
//         bankAccounts: bankAccounts.filter((account) => account.id !== id),
//       });

//       setSuccess("Bank account deleted successfully");
//     } catch (err: any) {
//       setError(
//         err.response?.data?.message ||
//           "Failed to delete bank account. Please try again."
//       );
//     }
//   };

//   const handleSetPrimaryBank = async (id: number) => {
//     try {
//       const response = await authApi.updateBankAccount(id, {
//         is_primary: true,
//       });

//       // Update bank accounts list
//       updateUserData({
//         user: user!,
//         profile: profile,
//         bankAccounts: bankAccounts.map((account) =>
//           account.id === id
//             ? { ...account, is_primary: true }
//             : { ...account, is_primary: false }
//         ),
//       });

//       setSuccess("Primary bank account updated successfully");
//     } catch (err: any) {
//       setError(
//         err.response?.data?.message ||
//           "Failed to update primary bank account. Please try again."
//       );
//     }
//   };

//   // E-wallet handlers
//   const handleWalletFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value, type, checked } = e.target;
//     setWalletFormData({
//       ...walletFormData,
//       [name]: type === "checkbox" ? checked : value,
//     });
//   };

//   const handleWalletTypeChange = (value: string) => {
//     setWalletFormData({
//       ...walletFormData,
//       wallet_type: value,
//     });
//   };

//   const handleWalletFormSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");

//     try {
//       const response = await authApi.addEWallet(walletFormData);

//       // Update e-wallets list
//       updateUserData({
//         user: user!,
//         profile: profile,
//         eWallets: [...eWallets, response.eWallet],
//       });

//       setSuccess("E-wallet added successfully");
//       setShowWalletForm(false);
//       setWalletFormData({
//         wallet_type: "",
//         phone_number: "",
//         account_name: "",
//         is_primary: false,
//       });
//     } catch (err: any) {
//       setError(
//         err.response?.data?.message ||
//           "Failed to add e-wallet. Please try again."
//       );
//     }
//   };

//   const handleDeleteWallet = async (id: number) => {
//     try {
//       await authApi.deleteEWallet(id);

//       // Update e-wallets list
//       updateUserData({
//         user: user!,
//         profile: profile,
//         eWallets: eWallets.filter((wallet) => wallet.id !== id),
//       });

//       setSuccess("E-wallet deleted successfully");
//     } catch (err: any) {
//       setError(
//         err.response?.data?.message ||
//           "Failed to delete e-wallet. Please try again."
//       );
//     }
//   };

//   const handleSetPrimaryWallet = async (id: number) => {
//     try {
//       const response = await authApi.updateEWallet(id, { is_primary: true });

//       // Update e-wallets list
//       updateUserData({
//         user: user!,
//         profile: profile,
//         eWallets: eWallets.map((wallet) =>
//           wallet.id === id
//             ? { ...wallet, is_primary: true }
//             : { ...wallet, is_primary: false }
//         ),
//       });

//       setSuccess("Primary e-wallet updated successfully");
//     } catch (err: any) {
//       setError(
//         err.response?.data?.message ||
//           "Failed to update primary e-wallet. Please try again."
//       );
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <h1 className="text-2xl font-bold tracking-tight">Profile Settings</h1>

//       {error && (
//         <div
//           className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded"
//           role="alert"
//         >
//           <p>{error}</p>
//         </div>
//       )}

//       {success && (
//         <div
//           className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded"
//           role="alert"
//         >
//           <p>{success}</p>
//         </div>
//       )}

//       <div className="bg-white shadow rounded-lg overflow-hidden">
//         <div className="border-b border-gray-200">
//           <nav className="flex -mb-px" aria-label="Tabs">
//             <button
//               onClick={() => setActiveTab("personal")}
//               className={`w-1/4 py-4 px-1 text-center border-b-2 text-sm font-medium ${
//                 activeTab === "personal"
//                   ? "border-primary text-primary"
//                   : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
//               }`}
//             >
//               Personal Information
//             </button>
//             <button
//               onClick={() => setActiveTab("business")}
//               className={`w-1/4 py-4 px-1 text-center border-b-2 text-sm font-medium ${
//                 activeTab === "business"
//                   ? "border-primary text-primary"
//                   : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
//               }`}
//             >
//               Business Details
//             </button>
//             <button
//               onClick={() => setActiveTab("payments")}
//               className={`w-1/4 py-4 px-1 text-center border-b-2 text-sm font-medium ${
//                 activeTab === "payments"
//                   ? "border-primary text-primary"
//                   : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
//               }`}
//             >
//               Payment Methods
//             </button>
//             <button
//               onClick={() => setActiveTab("account")}
//               className={`w-1/4 py-4 px-1 text-center border-b-2 text-sm font-medium ${
//                 activeTab === "account"
//                   ? "border-primary text-primary"
//                   : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
//               }`}
//             >
//               Account Settings
//             </button>
//           </nav>
//         </div>

//         <form onSubmit={handleSubmit}>
//           <div className="p-6">
//             {/* Personal Information Tab */}
//             {activeTab === "personal" && (
//               <div className="space-y-6">
//                 <div className="flex items-center gap-6">
//                   <div className="flex-shrink-0">
//                     <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden relative group">
//                       {avatarPreview ? (
//                         <img
//                           src={avatarPreview}
//                           alt={formData.username}
//                           className="h-full w-full object-cover"
//                         />
//                       ) : (
//                         <User className="h-12 w-12 text-gray-400" />
//                       )}
//                       <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
//                         <Upload
//                           className="h-8 w-8 text-white cursor-pointer"
//                           onClick={() => avatarFileRef.current?.click()}
//                         />
//                       </div>
//                     </div>
//                   </div>
//                   <div className="flex-grow max-w-sm">
//                     <input
//                       type="file"
//                       ref={avatarFileRef}
//                       className="hidden"
//                       accept="image/*"
//                       onChange={(e) => handleFileChange(e, "avatar")}
//                     />
//                     <Button
//                       type="button"
//                       variant="outline"
//                       onClick={() => avatarFileRef.current?.click()}
//                       className="w-full"
//                     >
//                       Upload Profile Picture
//                     </Button>
//                     <p className="mt-1 text-xs text-gray-500">
//                       Upload your profile picture (max 5MB)
//                     </p>
//                   </div>
//                 </div>

//                 <div>
//                   <label
//                     htmlFor="username"
//                     className="block text-sm font-medium text-gray-700"
//                   >
//                     Username
//                   </label>
//                   <Input
//                     id="username"
//                     name="username"
//                     value={formData.username}
//                     onChange={handleChange}
//                     className="mt-1"
//                   />
//                 </div>

//                 <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
//                   <div>
//                     <label
//                       htmlFor="firstName"
//                       className="block text-sm font-medium text-gray-700"
//                     >
//                       First Name
//                     </label>
//                     <Input
//                       id="firstName"
//                       name="firstName"
//                       value={formData.firstName}
//                       onChange={handleChange}
//                       className="mt-1"
//                     />
//                   </div>
//                   <div>
//                     <label
//                       htmlFor="lastName"
//                       className="block text-sm font-medium text-gray-700"
//                     >
//                       Last Name
//                     </label>
//                     <Input
//                       id="lastName"
//                       name="lastName"
//                       value={formData.lastName}
//                       onChange={handleChange}
//                       className="mt-1"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label
//                     htmlFor="phone"
//                     className="block text-sm font-medium text-gray-700"
//                   >
//                     Phone Number
//                   </label>
//                   <Input
//                     id="phone"
//                     name="phone"
//                     value={formData.phone}
//                     onChange={handleChange}
//                     className="mt-1"
//                   />
//                 </div>
//               </div>
//             )}

//             {/* Business Details Tab */}
//             {activeTab === "business" && (
//               <div className="space-y-6">
//                 <div className="flex items-center gap-6">
//                   <div className="flex-shrink-0">
//                     <div className="h-24 w-24 rounded-lg bg-gray-200 flex items-center justify-center overflow-hidden relative group">
//                       {logoPreview ? (
//                         <img
//                           src={logoPreview}
//                           alt={formData.companyName || "Company logo"}
//                           className="h-full w-full object-contain"
//                         />
//                       ) : (
//                         <Building className="h-12 w-12 text-gray-400" />
//                       )}
//                       <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
//                         <Upload
//                           className="h-8 w-8 text-white cursor-pointer"
//                           onClick={() => logoFileRef.current?.click()}
//                         />
//                       </div>
//                     </div>
//                   </div>
//                   <div className="flex-grow max-w-sm">
//                     <input
//                       type="file"
//                       ref={logoFileRef}
//                       className="hidden"
//                       accept="image/*"
//                       onChange={(e) => handleFileChange(e, "logo")}
//                     />
//                     <Button
//                       type="button"
//                       variant="outline"
//                       onClick={() => logoFileRef.current?.click()}
//                       className="w-full"
//                     >
//                       Upload Company Logo
//                     </Button>
//                     <p className="mt-1 text-xs text-gray-500">
//                       Upload your company logo (max 5MB)
//                     </p>
//                   </div>
//                 </div>

//                 <div>
//                   <label
//                     htmlFor="companyName"
//                     className="block text-sm font-medium text-gray-700"
//                   >
//                     Company Name
//                   </label>
//                   <Input
//                     id="companyName"
//                     name="companyName"
//                     value={formData.companyName}
//                     onChange={handleChange}
//                     className="mt-1"
//                   />
//                 </div>

//                 <div>
//                   <label
//                     htmlFor="address"
//                     className="block text-sm font-medium text-gray-700"
//                   >
//                     Address
//                   </label>
//                   <Input
//                     id="address"
//                     name="address"
//                     value={formData.address}
//                     onChange={handleChange}
//                     className="mt-1"
//                   />
//                 </div>

//                 <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
//                   <div>
//                     <label
//                       htmlFor="city"
//                       className="block text-sm font-medium text-gray-700"
//                     >
//                       City
//                     </label>
//                     <Input
//                       id="city"
//                       name="city"
//                       value={formData.city}
//                       onChange={handleChange}
//                       className="mt-1"
//                     />
//                   </div>
//                   <div>
//                     <label
//                       htmlFor="state"
//                       className="block text-sm font-medium text-gray-700"
//                     >
//                       State / Province
//                     </label>
//                     <Input
//                       id="state"
//                       name="state"
//                       value={formData.state}
//                       onChange={handleChange}
//                       className="mt-1"
//                     />
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
//                   <div>
//                     <label
//                       htmlFor="postalCode"
//                       className="block text-sm font-medium text-gray-700"
//                     >
//                       Postal Code
//                     </label>
//                     <Input
//                       id="postalCode"
//                       name="postalCode"
//                       value={formData.postalCode}
//                       onChange={handleChange}
//                       className="mt-1"
//                     />
//                   </div>
//                   <div>
//                     <label
//                       htmlFor="country"
//                       className="block text-sm font-medium text-gray-700"
//                     >
//                       Country
//                     </label>
//                     <Input
//                       id="country"
//                       name="country"
//                       value={formData.country}
//                       onChange={handleChange}
//                       className="mt-1"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label
//                     htmlFor="website"
//                     className="block text-sm font-medium text-gray-700"
//                   >
//                     Website
//                   </label>
//                   <Input
//                     id="website"
//                     name="website"
//                     value={formData.website}
//                     onChange={handleChange}
//                     className="mt-1"
//                   />
//                 </div>

//                 <div>
//                   <label
//                     htmlFor="taxNumber"
//                     className="block text-sm font-medium text-gray-700"
//                   >
//                     Tax/VAT Number
//                   </label>
//                   <Input
//                     id="taxNumber"
//                     name="taxNumber"
//                     value={formData.taxNumber}
//                     onChange={handleChange}
//                     className="mt-1"
//                   />
//                 </div>
//               </div>
//             )}

//             {/* Payment Methods Tab */}
//             {activeTab === "payments" && (
//               <div className="space-y-6">
//                 {/* Bank Accounts Section */}
//                 <div>
//                   <div className="flex justify-between items-center mb-4">
//                     <h3 className="text-lg font-medium text-gray-900">
//                       Bank Accounts
//                     </h3>
//                     <Button
//                       type="button"
//                       onClick={() => setShowBankForm(!showBankForm)}
//                       size="sm"
//                     >
//                       {showBankForm ? "Cancel" : "Add Bank Account"}
//                     </Button>
//                   </div>

//                   {/* Bank Account Form */}
//                   {showBankForm && (
//                     <div className="mb-6 p-4 border rounded-md bg-gray-50">
//                       <h4 className="text-sm font-medium mb-3">
//                         New Bank Account
//                       </h4>
//                       <form
//                         onSubmit={handleBankFormSubmit}
//                         className="space-y-4"
//                       >
//                         <div>
//                           <label
//                             htmlFor="bank_name"
//                             className="block text-sm font-medium text-gray-700"
//                           >
//                             Bank Name*
//                           </label>
//                           <Input
//                             id="bank_name"
//                             name="bank_name"
//                             value={bankFormData.bank_name}
//                             onChange={handleBankFormChange}
//                             required
//                             className="mt-1"
//                           />
//                         </div>
//                         <div>
//                           <label
//                             htmlFor="account_number"
//                             className="block text-sm font-medium text-gray-700"
//                           >
//                             Account Number*
//                           </label>
//                           <Input
//                             id="account_number"
//                             name="account_number"
//                             value={bankFormData.account_number}
//                             onChange={handleBankFormChange}
//                             required
//                             className="mt-1"
//                           />
//                         </div>
//                         <div>
//                           <label
//                             htmlFor="account_name"
//                             className="block text-sm font-medium text-gray-700"
//                           >
//                             Account Holder Name*
//                           </label>
//                           <Input
//                             id="account_name"
//                             name="account_name"
//                             value={bankFormData.account_name}
//                             onChange={handleBankFormChange}
//                             required
//                             className="mt-1"
//                           />
//                         </div>
//                         <div className="flex items-center">
//                           <input
//                             id="is_primary"
//                             name="is_primary"
//                             type="checkbox"
//                             checked={bankFormData.is_primary}
//                             onChange={handleBankFormChange}
//                             className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                           />
//                           <label
//                             htmlFor="is_primary"
//                             className="ml-2 block text-sm text-gray-700"
//                           >
//                             Set as primary bank account
//                           </label>
//                         </div>
//                         <div className="flex justify-end mt-4">
//                           <Button type="submit">Save Bank Account</Button>
//                         </div>
//                       </form>
//                     </div>
//                   )}

//                   {/* Bank Accounts List */}
//                   {bankAccounts && bankAccounts.length > 0 ? (
//                     <div className="border rounded-md overflow-hidden">
//                       <table className="min-w-full divide-y divide-gray-200">
//                         <thead className="bg-gray-50">
//                           <tr>
//                             <th
//                               scope="col"
//                               className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                             >
//                               Bank Name
//                             </th>
//                             <th
//                               scope="col"
//                               className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                             >
//                               Account Number
//                             </th>
//                             <th
//                               scope="col"
//                               className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                             >
//                               Account Name
//                             </th>
//                             <th
//                               scope="col"
//                               className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                             >
//                               Status
//                             </th>
//                             <th
//                               scope="col"
//                               className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
//                             >
//                               Actions
//                             </th>
//                           </tr>
//                         </thead>
//                         <tbody className="bg-white divide-y divide-gray-200">
//                           {bankAccounts.map((account) => (
//                             <tr key={account.id}>
//                               <td className="px-6 py-4 whitespace-nowrap">
//                                 <div className="text-sm font-medium text-gray-900">
//                                   {account.bank_name}
//                                 </div>
//                               </td>
//                               <td className="px-6 py-4 whitespace-nowrap">
//                                 <div className="text-sm text-gray-500">
//                                   {account.account_number}
//                                 </div>
//                               </td>
//                               <td className="px-6 py-4 whitespace-nowrap">
//                                 <div className="text-sm text-gray-500">
//                                   {account.account_name}
//                                 </div>
//                               </td>
//                               <td className="px-6 py-4 whitespace-nowrap">
//                                 {account.is_primary ? (
//                                   <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
//                                     Primary
//                                   </span>
//                                 ) : (
//                                   <button
//                                     type="button"
//                                     onClick={() =>
//                                       handleSetPrimaryBank(account.id)
//                                     }
//                                     className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
//                                   >
//                                     Set as Primary
//                                   </button>
//                                 )}
//                               </td>
//                               <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                                 <button
//                                   type="button"
//                                   onClick={() =>
//                                     handleDeleteBankAccount(account.id)
//                                   }
//                                   className="text-red-600 hover:text-red-900"
//                                 >
//                                   Delete
//                                 </button>
//                               </td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>
//                     </div>
//                   ) : (
//                     <div className="border rounded-md p-6 text-center">
//                       <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
//                       <h3 className="mt-2 text-sm font-medium text-gray-900">
//                         No bank accounts
//                       </h3>
//                       <p className="mt-1 text-sm text-gray-500">
//                         Get started by adding a new bank account.
//                       </p>
//                       <div className="mt-6">
//                         <Button
//                           type="button"
//                           onClick={() => setShowBankForm(true)}
//                           size="sm"
//                         >
//                           Add Bank Account
//                         </Button>
//                       </div>
//                     </div>
//                   )}
//                 </div>

//                 {/* E-Wallets Section */}
//                 <div className="mt-8">
//                   <div className="flex justify-between items-center mb-4">
//                     <h3 className="text-lg font-medium text-gray-900">
//                       E-Wallets
//                     </h3>
//                     <Button
//                       type="button"
//                       onClick={() => setShowWalletForm(!showWalletForm)}
//                       size="sm"
//                     >
//                       {showWalletForm ? "Cancel" : "Add E-Wallet"}
//                     </Button>
//                   </div>

//                   {/* E-Wallet Form */}
//                   {showWalletForm && (
//                     <div className="mb-6 p-4 border rounded-md bg-gray-50">
//                       <h4 className="text-sm font-medium mb-3">New E-Wallet</h4>
//                       <form
//                         onSubmit={handleWalletFormSubmit}
//                         className="space-y-4"
//                       >
//                         <div>
//                           <label
//                             htmlFor="wallet_type"
//                             className="block text-sm font-medium text-gray-700"
//                           >
//                             Wallet Type*
//                           </label>
//                           <Select
//                             onValueChange={handleWalletTypeChange}
//                             value={walletFormData.wallet_type}
//                           >
//                             <SelectTrigger>
//                               <SelectValue placeholder="Select a wallet type" />
//                             </SelectTrigger>
//                             <SelectContent>
//                               <SelectItem value="GoPay">GoPay</SelectItem>
//                               <SelectItem value="OVO">OVO</SelectItem>
//                               <SelectItem value="DANA">DANA</SelectItem>
//                               <SelectItem value="LinkAja">LinkAja</SelectItem>
//                               <SelectItem value="ShopeePay">
//                                 ShopeePay
//                               </SelectItem>
//                               <SelectItem value="Other">Other</SelectItem>
//                             </SelectContent>
//                           </Select>
//                         </div>
//                         <div>
//                           <label
//                             htmlFor="phone_number"
//                             className="block text-sm font-medium text-gray-700"
//                           >
//                             Phone Number*
//                           </label>
//                           <Input
//                             id="phone_number"
//                             name="phone_number"
//                             value={walletFormData.phone_number}
//                             onChange={handleWalletFormChange}
//                             required
//                             className="mt-1"
//                           />
//                         </div>
//                         <div>
//                           <label
//                             htmlFor="account_name"
//                             className="block text-sm font-medium text-gray-700"
//                           >
//                             Account Name*
//                           </label>
//                           <Input
//                             id="account_name"
//                             name="account_name"
//                             value={walletFormData.account_name}
//                             onChange={handleWalletFormChange}
//                             required
//                             className="mt-1"
//                           />
//                         </div>
//                         <div className="flex items-center">
//                           <input
//                             id="is_primary_wallet"
//                             name="is_primary"
//                             type="checkbox"
//                             checked={walletFormData.is_primary}
//                             onChange={handleWalletFormChange}
//                             className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                           />
//                           <label
//                             htmlFor="is_primary_wallet"
//                             className="ml-2 block text-sm text-gray-700"
//                           >
//                             Set as primary e-wallet
//                           </label>
//                         </div>
//                         <div className="flex justify-end mt-4">
//                           <Button type="submit">Save E-Wallet</Button>
//                         </div>
//                       </form>
//                     </div>
//                   )}

//                   {/* E-Wallets List */}
//                   {eWallets && eWallets.length > 0 ? (
//                     <div className="border rounded-md overflow-hidden">
//                       <table className="min-w-full divide-y divide-gray-200">
//                         <thead className="bg-gray-50">
//                           <tr>
//                             <th
//                               scope="col"
//                               className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                             >
//                               Wallet Type
//                             </th>
//                             <th
//                               scope="col"
//                               className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                             >
//                               Phone Number
//                             </th>
//                             <th
//                               scope="col"
//                               className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                             >
//                               Account Name
//                             </th>
//                             <th
//                               scope="col"
//                               className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                             >
//                               Status
//                             </th>
//                             <th
//                               scope="col"
//                               className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
//                             >
//                               Actions
//                             </th>
//                           </tr>
//                         </thead>
//                         <tbody className="bg-white divide-y divide-gray-200">
//                           {eWallets.map((wallet) => (
//                             <tr key={wallet.id}>
//                               <td className="px-6 py-4 whitespace-nowrap">
//                                 <div className="text-sm font-medium text-gray-900">
//                                   {wallet.wallet_type}
//                                 </div>
//                               </td>
//                               <td className="px-6 py-4 whitespace-nowrap">
//                                 <div className="text-sm text-gray-500">
//                                   {wallet.phone_number}
//                                 </div>
//                               </td>
//                               <td className="px-6 py-4 whitespace-nowrap">
//                                 <div className="text-sm text-gray-500">
//                                   {wallet.account_name}
//                                 </div>
//                               </td>
//                               <td className="px-6 py-4 whitespace-nowrap">
//                                 {wallet.is_primary ? (
//                                   <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
//                                     Primary
//                                   </span>
//                                 ) : (
//                                   <button
//                                     type="button"
//                                     onClick={() =>
//                                       handleSetPrimaryWallet(wallet.id)
//                                     }
//                                     className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
//                                   >
//                                     Set as Primary
//                                   </button>
//                                 )}
//                               </td>
//                               <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                                 <button
//                                   type="button"
//                                   onClick={() => handleDeleteWallet(wallet.id)}
//                                   className="text-red-600 hover:text-red-900"
//                                 >
//                                   Delete
//                                 </button>
//                               </td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>
//                     </div>
//                   ) : (
//                     <div className="border rounded-md p-6 text-center">
//                       <Wallet className="mx-auto h-12 w-12 text-gray-400" />
//                       <h3 className="mt-2 text-sm font-medium text-gray-900">
//                         No e-wallets
//                       </h3>
//                       <p className="mt-1 text-sm text-gray-500">
//                         Get started by adding a new e-wallet.
//                       </p>
//                       <div className="mt-6">
//                         <Button
//                           type="button"
//                           onClick={() => setShowWalletForm(true)}
//                           size="sm"
//                         >
//                           Add E-Wallet
//                         </Button>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}

//             {/* Account Settings Tab */}
//             {activeTab === "account" && (
//               <div className="space-y-6">
//                 {/* Email Change Section */}
//                 <div className="px-4 py-5 sm:p-6 bg-gray-50 rounded-md">
//                   <div className="md:grid md:grid-cols-3 md:gap-6">
//                     <div className="md:col-span-1">
//                       <h3 className="text-base font-medium leading-6 text-gray-900">
//                         Email Address
//                       </h3>
//                       <p className="mt-1 text-sm text-gray-500">
//                         Update your email address. You'll need to verify the new
//                         email before the change takes effect.
//                       </p>
//                     </div>
//                     {/* Use ChangeEmailForm component */}
//                     {user?.email && (
//                       <ChangeEmailForm currentEmail={user.email} />
//                     )}
//                   </div>
//                 </div>

//                 {/* Password Reset Section */}
//                 <div className="px-4 py-5 sm:p-6 bg-gray-50 rounded-md">
//                   <div className="md:grid md:grid-cols-3 md:gap-6">
//                     <div className="md:col-span-1">
//                       <h3 className="text-base font-medium leading-6 text-gray-900">
//                         Change Password
//                       </h3>
//                       <p className="mt-1 text-sm text-gray-500">
//                         Update your password using the Reset Password flow.
//                       </p>
//                     </div>
//                     <div className="mt-5 md:mt-0 md:col-span-2">
//                       <Button
//                         type="button"
//                         variant="outline"
//                         onClick={() =>
//                           (window.location.href = "/reset-password")
//                         }
//                       >
//                         Reset Password
//                       </Button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>

//           <div className="px-6 py-3 bg-gray-50 text-right">
//             <Button type="submit" disabled={isSaving}>
//               {isSaving ? "Saving..." : "Save Changes"}
//             </Button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }
// src/app/dashboard/profile/page.tsx
"use client";

import { useState, useEffect, useRef, ChangeEvent } from "react";
import { useAuth } from "@/providers/AuthProviders";
import apiClient, { authApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UpdateProfileFormData, BankAccount, EWallet } from "@/types";
import { User, Building, CreditCard, Wallet, Upload } from "lucide-react";
import ChangeEmailForm from "@/components/profile/ChangeEmailForm";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ProfilePage() {
  const { user, profile, bankAccounts, eWallets, updateUserData } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState("personal");

  // Refs for file inputs
  const avatarFileRef = useRef<HTMLInputElement>(null);
  const logoFileRef = useRef<HTMLInputElement>(null);

  // Preview states
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  // Bank account form state
  const [showBankForm, setShowBankForm] = useState(false);
  const [bankFormData, setBankFormData] = useState({
    bank_name: "",
    account_number: "",
    account_name: "",
    is_primary: false,
  });

  // E-wallet form state
  const [showWalletForm, setShowWalletForm] = useState(false);
  const [walletFormData, setWalletFormData] = useState({
    wallet_type: "",
    phone_number: "",
    account_name: "",
    is_primary: false,
  });

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle file uploads
  const handleFileChange = (
    e: ChangeEvent<HTMLInputElement>,
    type: "avatar" | "logo"
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        const base64String = reader.result as string;

        if (type === "avatar") {
          setFormData({
            ...formData,
            avatar: base64String,
          });
          setAvatarPreview(base64String);
        } else {
          setFormData({
            ...formData,
            logo: base64String,
          });
          setLogoPreview(base64String);
        }
      };

      reader.readAsDataURL(file);
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

      // If avatar is a base64 string, add it directly
      if (formData.avatar && formData.avatar.startsWith("data:")) {
        formDataToSend.append("avatar", formData.avatar);
      } else if (
        avatarFileRef.current?.files &&
        avatarFileRef.current.files[0]
      ) {
        formDataToSend.append("avatar", avatarFileRef.current.files[0]);
      }

      // If logo is a base64 string, add it directly
      if (formData.logo && formData.logo.startsWith("data:")) {
        formDataToSend.append("logo", formData.logo);
      } else if (logoFileRef.current?.files && logoFileRef.current.files[0]) {
        formDataToSend.append("logo", logoFileRef.current.files[0]);
      }

      console.log("Submitting profile update with images");

      const response = await apiClient.put("/auth/profile", formDataToSend, {
        headers: {
          // Let the browser set the content type with boundary
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Profile update response:", response.data);

      // Update the context with the new data
      updateUserData({
        user: response.data.user,
        profile: response.data.profile,
        bankAccounts: response.data.profile?.bank_accounts || [],
        eWallets: response.data.profile?.e_wallets || [],
      });

      // Update local state with the new image URLs
      if (response.data.user.avatar) {
        setAvatarPreview(response.data.user.avatar);
      }
      if (response.data.profile?.logo) {
        setLogoPreview(response.data.profile.logo);
      }

      setSuccess("Profile updated successfully");
    } catch (err: any) {
      console.error("Error updating profile:", err);
      setError(
        err.response?.data?.message ||
          "Failed to update profile. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Bank account handlers
  const handleBankFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setBankFormData({
      ...bankFormData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleBankFormSubmit = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await authApi.addBankAccount(bankFormData);

      // Update bank accounts list
      updateUserData({
        user: user!,
        profile: profile,
        bankAccounts: [...bankAccounts, response.bankAccount],
        eWallets: eWallets,
      });

      setSuccess("Bank account added successfully");
      setShowBankForm(false);
      setBankFormData({
        bank_name: "",
        account_number: "",
        account_name: "",
        is_primary: false,
      });
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Failed to add bank account. Please try again."
      );
    }
  };

  const handleDeleteBankAccount = async (id: number) => {
    try {
      await authApi.deleteBankAccount(id);

      // Update bank accounts list
      updateUserData({
        user: user!,
        profile: profile,
        bankAccounts: bankAccounts.filter((account) => account.id !== id),
        eWallets: eWallets,
      });

      setSuccess("Bank account deleted successfully");
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Failed to delete bank account. Please try again."
      );
    }
  };

  const handleSetPrimaryBank = async (id: number) => {
    try {
      const response = await authApi.updateBankAccount(id, {
        is_primary: true,
      });

      // Update bank accounts list
      updateUserData({
        user: user!,
        profile: profile,
        bankAccounts: bankAccounts.map((account) =>
          account.id === id
            ? { ...account, is_primary: true }
            : { ...account, is_primary: false }
        ),
        eWallets: eWallets,
      });

      setSuccess("Primary bank account updated successfully");
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Failed to update primary bank account. Please try again."
      );
    }
  };

  // E-wallet handlers
  const handleWalletFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setWalletFormData({
      ...walletFormData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleWalletTypeChange = (value: string) => {
    setWalletFormData({
      ...walletFormData,
      wallet_type: value,
    });
  };

  const handleWalletFormSubmit = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await authApi.addEWallet(walletFormData);

      // Update e-wallets list
      updateUserData({
        user: user!,
        profile: profile,
        bankAccounts: bankAccounts,
        eWallets: [...eWallets, response.eWallet],
      });

      setSuccess("E-wallet added successfully");
      setShowWalletForm(false);
      setWalletFormData({
        wallet_type: "",
        phone_number: "",
        account_name: "",
        is_primary: false,
      });
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Failed to add e-wallet. Please try again."
      );
    }
  };

  const handleDeleteWallet = async (id: number) => {
    try {
      await authApi.deleteEWallet(id);

      // Update e-wallets list
      updateUserData({
        user: user!,
        profile: profile,
        bankAccounts: bankAccounts,
        eWallets: eWallets.filter((wallet) => wallet.id !== id),
      });

      setSuccess("E-wallet deleted successfully");
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Failed to delete e-wallet. Please try again."
      );
    }
  };

  const handleSetPrimaryWallet = async (id: number) => {
    try {
      const response = await authApi.updateEWallet(id, { is_primary: true });

      // Update e-wallets list
      updateUserData({
        user: user!,
        profile: profile,
        bankAccounts: bankAccounts,
        eWallets: eWallets.map((wallet) =>
          wallet.id === id
            ? { ...wallet, is_primary: true }
            : { ...wallet, is_primary: false }
        ),
      });

      setSuccess("Primary e-wallet updated successfully");
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Failed to update primary e-wallet. Please try again."
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Profile Settings</h1>

      {error && (
        <div
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded"
          role="alert"
        >
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div
          className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded"
          role="alert"
        >
          <p>{success}</p>
        </div>
      )}

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px" aria-label="Tabs">
            <button
              onClick={() => setActiveTab("personal")}
              className={`w-1/4 py-4 px-1 text-center border-b-2 text-sm font-medium ${
                activeTab === "personal"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Personal Information
            </button>
            <button
              onClick={() => setActiveTab("business")}
              className={`w-1/4 py-4 px-1 text-center border-b-2 text-sm font-medium ${
                activeTab === "business"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Business Details
            </button>
            <button
              onClick={() => setActiveTab("payments")}
              className={`w-1/4 py-4 px-1 text-center border-b-2 text-sm font-medium ${
                activeTab === "payments"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Payment Methods
            </button>
            <button
              onClick={() => setActiveTab("account")}
              className={`w-1/4 py-4 px-1 text-center border-b-2 text-sm font-medium ${
                activeTab === "account"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Account Settings
            </button>
          </nav>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6">
            {/* Personal Information Tab */}
            {activeTab === "personal" && (
              <div className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="flex-shrink-0">
                    <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden relative group">
                      {avatarPreview ? (
                        <img
                          src={avatarPreview}
                          alt={formData.username}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <User className="h-12 w-12 text-gray-400" />
                      )}
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Upload
                          className="h-8 w-8 text-white cursor-pointer"
                          onClick={() => avatarFileRef.current?.click()}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex-grow max-w-sm">
                    <input
                      type="file"
                      ref={avatarFileRef}
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, "avatar")}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => avatarFileRef.current?.click()}
                      className="w-full"
                    >
                      Upload Profile Picture
                    </Button>
                    <p className="mt-1 text-xs text-gray-500">
                      Upload your profile picture (max 5MB)
                    </p>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Username
                  </label>
                  <Input
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="mt-1"
                  />
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      First Name
                    </label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Last Name
                    </label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Phone Number
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="mt-1"
                  />
                </div>
              </div>
            )}

            {/* Business Details Tab */}
            {activeTab === "business" && (
              <div className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="flex-shrink-0">
                    <div className="h-24 w-24 rounded-lg bg-gray-200 flex items-center justify-center overflow-hidden relative group">
                      {logoPreview ? (
                        <img
                          src={logoPreview}
                          alt={formData.companyName || "Company logo"}
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <Building className="h-12 w-12 text-gray-400" />
                      )}
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Upload
                          className="h-8 w-8 text-white cursor-pointer"
                          onClick={() => logoFileRef.current?.click()}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex-grow max-w-sm">
                    <input
                      type="file"
                      ref={logoFileRef}
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, "logo")}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => logoFileRef.current?.click()}
                      className="w-full"
                    >
                      Upload Company Logo
                    </Button>
                    <p className="mt-1 text-xs text-gray-500">
                      Upload your company logo (max 5MB)
                    </p>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="companyName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Company Name
                  </label>
                  <Input
                    id="companyName"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    className="mt-1"
                  />
                </div>

                <div>
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Address
                  </label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="mt-1"
                  />
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="city"
                      className="block text-sm font-medium text-gray-700"
                    >
                      City
                    </label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="state"
                      className="block text-sm font-medium text-gray-700"
                    >
                      State / Province
                    </label>
                    <Input
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="postalCode"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Postal Code
                    </label>
                    <Input
                      id="postalCode"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="country"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Country
                    </label>
                    <Input
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="website"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Website
                  </label>
                  <Input
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    className="mt-1"
                  />
                </div>

                <div>
                  <label
                    htmlFor="taxNumber"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Tax/VAT Number
                  </label>
                  <Input
                    id="taxNumber"
                    name="taxNumber"
                    value={formData.taxNumber}
                    onChange={handleChange}
                    className="mt-1"
                  />
                </div>
              </div>
            )}

            {/* Payment Methods Tab */}
            {activeTab === "payments" && (
              <div className="space-y-6">
                {/* Bank Accounts Section */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Bank Accounts
                    </h3>
                    <Button
                      type="button"
                      onClick={() => setShowBankForm(!showBankForm)}
                      size="sm"
                    >
                      {showBankForm ? "Cancel" : "Add Bank Account"}
                    </Button>
                  </div>

                  {/* Bank Account Form - FIXED: Changed from form to div */}
                  {showBankForm && (
                    <div className="mb-6 p-4 border rounded-md bg-gray-50">
                      <h4 className="text-sm font-medium mb-3">
                        New Bank Account
                      </h4>
                      <div className="space-y-4">
                        <div>
                          <label
                            htmlFor="bank_name"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Bank Name*
                          </label>
                          <Input
                            id="bank_name"
                            name="bank_name"
                            value={bankFormData.bank_name}
                            onChange={handleBankFormChange}
                            required
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="account_number"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Account Number*
                          </label>
                          <Input
                            id="account_number"
                            name="account_number"
                            value={bankFormData.account_number}
                            onChange={handleBankFormChange}
                            required
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="account_name"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Account Holder Name*
                          </label>
                          <Input
                            id="account_name"
                            name="account_name"
                            value={bankFormData.account_name}
                            onChange={handleBankFormChange}
                            required
                            className="mt-1"
                          />
                        </div>
                        <div className="flex items-center">
                          <input
                            id="is_primary"
                            name="is_primary"
                            type="checkbox"
                            checked={bankFormData.is_primary}
                            onChange={handleBankFormChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label
                            htmlFor="is_primary"
                            className="ml-2 block text-sm text-gray-700"
                          >
                            Set as primary bank account
                          </label>
                        </div>
                        <div className="flex justify-end mt-4">
                          <Button type="button" onClick={handleBankFormSubmit}>
                            Save Bank Account
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Bank Accounts List */}
                  {bankAccounts && bankAccounts.length > 0 ? (
                    <div className="border rounded-md overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Bank Name
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Account Number
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Account Name
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Status
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {bankAccounts.map((account) => (
                            <tr key={account.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                  {account.bank_name}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">
                                  {account.account_number}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">
                                  {account.account_name}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {account.is_primary ? (
                                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                    Primary
                                  </span>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleSetPrimaryBank(account.id)
                                    }
                                    className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
                                  >
                                    Set as Primary
                                  </button>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleDeleteBankAccount(account.id)
                                  }
                                  className="text-red-600 hover:text-red-900"
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="border rounded-md p-6 text-center">
                      <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">
                        No bank accounts
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Get started by adding a new bank account.
                      </p>
                      <div className="mt-6">
                        <Button
                          type="button"
                          onClick={() => setShowBankForm(true)}
                          size="sm"
                        >
                          Add Bank Account
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* E-Wallets Section */}
                <div className="mt-8">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      E-Wallets
                    </h3>
                    <Button
                      type="button"
                      onClick={() => setShowWalletForm(!showWalletForm)}
                      size="sm"
                    >
                      {showWalletForm ? "Cancel" : "Add E-Wallet"}
                    </Button>
                  </div>

                  {/* E-Wallet Form - FIXED: Changed from form to div */}
                  {showWalletForm && (
                    <div className="mb-6 p-4 border rounded-md bg-gray-50">
                      <h4 className="text-sm font-medium mb-3">New E-Wallet</h4>
                      <div className="space-y-4">
                        <div>
                          <label
                            htmlFor="wallet_type"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Wallet Type*
                          </label>
                          <Select
                            onValueChange={handleWalletTypeChange}
                            value={walletFormData.wallet_type}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select a wallet type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="GoPay">GoPay</SelectItem>
                              <SelectItem value="OVO">OVO</SelectItem>
                              <SelectItem value="DANA">DANA</SelectItem>
                              <SelectItem value="LinkAja">LinkAja</SelectItem>
                              <SelectItem value="ShopeePay">
                                ShopeePay
                              </SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label
                            htmlFor="phone_number"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Phone Number*
                          </label>
                          <Input
                            id="phone_number"
                            name="phone_number"
                            value={walletFormData.phone_number}
                            onChange={handleWalletFormChange}
                            required
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="account_name"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Account Name*
                          </label>
                          <Input
                            id="account_name"
                            name="account_name"
                            value={walletFormData.account_name}
                            onChange={handleWalletFormChange}
                            required
                            className="mt-1"
                          />
                        </div>
                        <div className="flex items-center">
                          <input
                            id="is_primary_wallet"
                            name="is_primary"
                            type="checkbox"
                            checked={walletFormData.is_primary}
                            onChange={handleWalletFormChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label
                            htmlFor="is_primary_wallet"
                            className="ml-2 block text-sm text-gray-700"
                          >
                            Set as primary e-wallet
                          </label>
                        </div>
                        <div className="flex justify-end mt-4">
                          <Button
                            type="button"
                            onClick={handleWalletFormSubmit}
                          >
                            Save E-Wallet
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* E-Wallets List */}
                  {eWallets && eWallets.length > 0 ? (
                    <div className="border rounded-md overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Wallet Type
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Phone Number
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Account Name
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Status
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {eWallets.map((wallet) => (
                            <tr key={wallet.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                  {wallet.wallet_type}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">
                                  {wallet.phone_number}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">
                                  {wallet.account_name}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {wallet.is_primary ? (
                                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                    Primary
                                  </span>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleSetPrimaryWallet(wallet.id)
                                    }
                                    className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
                                  >
                                    Set as Primary
                                  </button>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button
                                  type="button"
                                  onClick={() => handleDeleteWallet(wallet.id)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="border rounded-md p-6 text-center">
                      <Wallet className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">
                        No e-wallets
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Get started by adding a new e-wallet.
                      </p>
                      <div className="mt-6">
                        <Button
                          type="button"
                          onClick={() => setShowWalletForm(true)}
                          size="sm"
                        >
                          Add E-Wallet
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Account Settings Tab */}
            {activeTab === "account" && (
              <div className="space-y-6">
                {/* Email Change Section */}
                <div className="px-4 py-5 sm:p-6 bg-gray-50 rounded-md">
                  <div className="md:grid md:grid-cols-3 md:gap-6">
                    <div className="md:col-span-1">
                      <h3 className="text-base font-medium leading-6 text-gray-900">
                        Email Address
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Update your email address. You'll need to verify the new
                        email before the change takes effect.
                      </p>
                    </div>
                    {/* Use ChangeEmailForm component */}
                    {user?.email && (
                      <ChangeEmailForm currentEmail={user.email} />
                    )}
                  </div>
                </div>

                {/* Password Reset Section */}
                <div className="px-4 py-5 sm:p-6 bg-gray-50 rounded-md">
                  <div className="md:grid md:grid-cols-3 md:gap-6">
                    <div className="md:col-span-1">
                      <h3 className="text-base font-medium leading-6 text-gray-900">
                        Change Password
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Update your password using the Reset Password flow.
                      </p>
                    </div>
                    <div className="mt-5 md:mt-0 md:col-span-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          (window.location.href = "/reset-password")
                        }
                      >
                        Reset Password
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="px-6 py-3 bg-gray-50 text-right">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
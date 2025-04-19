"use client";

import { authApi } from "@/lib/api";
import {
  AuthResponse,
  BankAccount,
  EWallet,
  Profile,
  User,
} from "@/types/index";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  bankAccounts: BankAccount[];
  eWallets: EWallet[];
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<AuthResponse | undefined>;
  googleLogin: (credentials: {
    email: string;
    name: string;
    picture: string;
  }) => Promise<AuthResponse | undefined>;
  logout: () => void;
  updateUserData: (userData: {
    user: User;
    profile: Profile | null;
    bankAccounts?: BankAccount[];
    eWallets?: EWallet[];
  }) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  bankAccounts: [],
  eWallets: [],
  isAuthenticated: false,
  isLoading: true,
  login: async () => undefined,
  googleLogin: async () => undefined,
  logout: () => {},
  updateUserData: () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [eWallets, setEWallets] = useState<EWallet[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;

      if (token) {
        // Get user profile
        const { user, profile } = await authApi.getProfile();
        setUser(user);
        setProfile(profile);

        // Set bank accounts and e-wallets if available
        if (profile) {
          setBankAccounts(profile.bank_accounts || []);
          setEWallets(profile.e_wallets || []);
        }
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
      }
      setUser(null);
      setProfile(null);
      setBankAccounts([]);
      setEWallets([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await authApi.login({ email, password });
      setUser(response.user);
      setProfile(response.profile || null);
      setBankAccounts(response.bankAccounts || []);
      setEWallets(response.eWallets || []);
      return response;
    } finally {
      setIsLoading(false);
    }
  };

  const googleLogin = async (credentials: {
    email: string;
    name: string;
    picture: string;
  }) => {
    setIsLoading(true);
    try {
      const response = await authApi.googleLogin(credentials);
      setUser(response.user);
      setProfile(response.profile || null);
      setBankAccounts(response.bankAccounts || []);
      setEWallets(response.eWallets || []);
      return response;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authApi.logout();
    setUser(null);
    setProfile(null);
    setBankAccounts([]);
    setEWallets([]);
  };

  const updateUserData = (userData: {
    user: User;
    profile: Profile | null;
    bankAccounts?: BankAccount[];
    eWallets?: EWallet[];
  }) => {
    setUser(userData.user);
    setProfile(userData.profile);
    if (userData.bankAccounts) setBankAccounts(userData.bankAccounts);
    if (userData.eWallets) setEWallets(userData.eWallets);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        bankAccounts,
        eWallets,
        isAuthenticated: !!user,
        isLoading,
        login,
        googleLogin,
        logout,
        updateUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

import axios from "axios";
import {
  AuthResponse,
  BankAccount,
  ChangeEmailFormData,
  Client,
  CreateClientFormData,
  CreateInvoiceFormData,
  CreatePaymentFormData,
  CreateProductFormData,
  CreateRecurringInvoiceData,
  EWallet,
  Invoice,
  InvoiceStatus,
  LoginFormData,
  Payment,
  Product,
  Profile,
  RecurringInvoice,
  RegisterFormData,
  ResetPasswordFormData,
  UpdateProfileFormData,
  UpdateRecurringInvoiceData,
  User,
  VerifyAccountFormData,
  VerifyResetPasswordFormData,
} from "@/types";

const API_URL =
  process.env.NEXT_PUBLIC_BASE_URL_BE;

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to add the auth token to every request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for better error handling
// apiClient.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     return Promise.reject(error);
//   }
// );
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Logging error
    if (error.response) {
      console.error(`API Error: ${error.response.status}`, error.response.data);
    } else if (error.request) {
      console.error('API Request Error: No response received', error.request);
    } else {
      console.error('API Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Auth API functions
export const authApi = {
  register: async (data: RegisterFormData): Promise<AuthResponse> => {
    const response = await apiClient.post("/auth/register", data);
    return response.data;
  },

  verifyAccount: async (
    token: string,
    data: VerifyAccountFormData
  ): Promise<{ status: string; message: string }> => {
    apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
    const response = await apiClient.post("/auth/verification", data);
    return response.data;
  },

  login: async (data: LoginFormData): Promise<AuthResponse> => {
    const response = await apiClient.post("/auth/login", data);
    localStorage.setItem("token", response.data.token);
    return response.data;
  },

  googleLogin: async (credentials: {
    email: string;
    name: string;
    picture: string;
  }): Promise<AuthResponse> => {
    const response = await apiClient.post("/auth/google", credentials);
    localStorage.setItem("token", response.data.token);
    return response.data;
  },

  logout: (): void => {
    localStorage.removeItem("token");
  },

  resetPassword: async (
    data: ResetPasswordFormData
  ): Promise<{ status: string; token: string; message: string }> => {
    const response = await apiClient.post("/auth/reset-password", data);
    return response.data;
  },

  verifyResetPassword: async (
    token: string,
    data: VerifyResetPasswordFormData
  ): Promise<{ status: string; message: string }> => {
    apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
    const response = await apiClient.post("/auth/verify/reset-password", data);
    return response.data;
  },

  checkEmailToken: async (
    token: string
  ): Promise<{ status: string; message: string }> => {
    const response = await apiClient.get(`/auth/check-email-token/${token}`);
    return response.data;
  },

  requestChangeEmail: async (
    data: ChangeEmailFormData
  ): Promise<{ status: string; message: string }> => {
    const response = await apiClient.post("/auth/request-change-email", data);
    return response.data;
  },

  verifyChangeEmail: async (
    token: string
  ): Promise<{ status: string; message: string }> => {
    const response = await apiClient.post("/auth/verify-change-email", {
      token,
    });
    return response.data;
  },

  getProfile: async (): Promise<{
    status: string;
    user: User;
    profile: Profile | null;
  }> => {
    const response = await apiClient.get("/auth/profile");
    return response.data;
  },

  // Define a type for File input
  updateProfile: async (
    data: UpdateProfileFormData
  ): Promise<{
    status: string;
    message: string;
    user: User;
    profile: Profile | null;
  }> => {
    // Check if we need to use FormData for file uploads or base64 strings
    const hasBase64Avatar =
      typeof data.avatar === "string" && data.avatar.startsWith("data:");
    const hasBase64Logo =
      typeof data.logo === "string" && data.logo.startsWith("data:");
    const hasFileUploads =
      (data.avatar && typeof data.avatar === "object") ||
      (data.logo && typeof data.logo === "object");

    // Use FormData for either base64 or file uploads
    if (hasBase64Avatar || hasBase64Logo || hasFileUploads) {
      const formData = new FormData();

      // Add text fields
      Object.entries(data).forEach(([key, value]) => {
        if (
          value !== undefined &&
          value !== null &&
          key !== "avatar" &&
          key !== "logo" &&
          typeof value !== "object"
        ) {
          formData.append(key, String(value));
        }
      });

      // Add avatar if it exists
      if (hasBase64Avatar) {
        formData.append("avatar", data.avatar as string);
      } else if (data.avatar && typeof data.avatar === "object") {
        // Use File type for file uploads
        formData.append("avatar", data.avatar as File);
      }

      // Add logo if it exists
      if (hasBase64Logo) {
        formData.append("logo", data.logo as string);
      } else if (data.logo && typeof data.logo === "object") {
        // Use File type for file uploads
        formData.append("logo", data.logo as File);
      }

      const response = await apiClient.put("/auth/profile", formData, {
        headers: {
          // Let the browser set the content type with the correct boundary
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } else {
      // Just use JSON if no file/image data
      const response = await apiClient.put("/auth/profile", data);
      return response.data;
    }
  },

  // Bank account methods
  addBankAccount: async (data: {
    bank_name: string;
    account_number: string;
    account_name: string;
    is_primary?: boolean;
  }): Promise<{
    status: string;
    message: string;
    bankAccount: BankAccount;
  }> => {
    const response = await apiClient.post("/auth/bank-accounts", data);
    return response.data;
  },

  updateBankAccount: async (
    id: number,
    data: {
      bank_name?: string;
      account_number?: string;
      account_name?: string;
      is_primary?: boolean;
    }
  ): Promise<{ status: string; message: string; bankAccount: BankAccount }> => {
    const response = await apiClient.put(`/auth/bank-accounts/${id}`, data);
    return response.data;
  },

  deleteBankAccount: async (
    id: number
  ): Promise<{ status: string; message: string }> => {
    const response = await apiClient.delete(`/auth/bank-accounts/${id}`);
    return response.data;
  },

  // E-wallet methods
  addEWallet: async (data: {
    wallet_type: string;
    phone_number: string;
    account_name: string;
    is_primary?: boolean;
  }): Promise<{ status: string; message: string; eWallet: EWallet }> => {
    const response = await apiClient.post("/auth/e-wallets", data);
    return response.data;
  },

  updateEWallet: async (
    id: number,
    data: {
      wallet_type?: string;
      phone_number?: string;
      account_name?: string;
      is_primary?: boolean;
    }
  ): Promise<{ status: string; message: string; eWallet: EWallet }> => {
    const response = await apiClient.put(`/auth/e-wallets/${id}`, data);
    return response.data;
  },

  deleteEWallet: async (
    id: number
  ): Promise<{ status: string; message: string }> => {
    const response = await apiClient.delete(`/auth/e-wallets/${id}`);
    return response.data;
  },
};

// Client API functions
export const clientApi = {
  getClients: async (): Promise<Client[]> => {
    const response = await apiClient.get(`/clients`);
    return response.data.clients;
  },

  getClient: async (id: number): Promise<Client> => {
    const response = await apiClient.get(`/clients/${id}`);
    return response.data.client;
  },

  createClient: async (data: CreateClientFormData): Promise<Client> => {
    const response = await apiClient.post("/clients", data);
    return response.data.client;
  },

  updateClient: async (
    id: number,
    data: Partial<CreateClientFormData>
  ): Promise<Client> => {
    const response = await apiClient.put(`/clients/${id}`, data);
    return response.data.client;
  },

  deleteClient: async (id: number): Promise<void> => {
    await apiClient.delete(`/clients/${id}`);
  },
};

// Product API functions
export const productApi = {
  // Get all products
  // Get all products
  getProducts: async (showArchivedProducts?: boolean): Promise<Product[]> => {
    try {
      const response = await apiClient.get(`/products`);
      let products: Product[] = [];

      // Handle different response formats
      if (Array.isArray(response.data)) {
        products = response.data;
      } else if (response.data.products) {
        products = response.data.products;
      }

      // Filter out archived products if not explicitly requested to show them
      if (showArchivedProducts === false) {
        return products.filter((product) => !product.deleted_at);
      }

      return products;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  },

  // Get a single product by ID
  getProduct: async (id: number): Promise<Product> => {
    try {
      const response = await apiClient.get(`/products/${id}`);
      // Handle different response formats
      if (response.data.product) {
        return response.data.product;
      } else {
        return response.data;
      }
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      throw error;
    }
  },

  createProduct: async (data: CreateProductFormData): Promise<Product> => {
    const response = await apiClient.post("/products", data);
    return response.data.product;
  },

  /**
   * Create a new product with image
   * Uses FormData to support file uploads
   */
  async createProductWithImage(formData: FormData): Promise<Product> {
    const response = await apiClient.post("/products/with-image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  updateProduct: async (
    id: number,
    data: Partial<CreateProductFormData>
  ): Promise<Product> => {
    const response = await apiClient.put(`/products/${id}`, data);
    return response.data.product;
  },
  // Update a product with image
  updateProductWithImage: async (
    id: number,
    formData: FormData
  ): Promise<Product> => {
    try {
      const response = await apiClient.put(
        `/products/${id}/with-image`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      // Handle different response formats
      if (response.data.product) {
        return response.data.product;
      } else {
        return response.data;
      }
    } catch (error) {
      console.error(`Error updating product ${id} with image:`, error);
      throw error;
    }
  },

  // deleteProduct: async (id: number): Promise<void> => {
  //   await apiClient.delete(`/products/${id}`);
  // },
  deleteProduct: async (id: number): Promise<void> => {
    try {
      await apiClient.delete(`/products/${id}`);
    } catch (error) {
      throw error; // Re-throw atau tangani dengan cara yang sesuai
    }
  },

  // Archive a product (soft delete)
  archiveProduct: async (id: number): Promise<Product> => {
    const response = await apiClient.post(`/products/${id}/archive`);
    return response.data.product || response.data; // Handle both response formats
  },

  // Restore an archived product
  restoreProduct: async (id: number): Promise<Product> => {
    const response = await apiClient.post(`/products/${id}/restore`);
    return response.data.product || response.data; // Handle both response formats
  },

  // Search products by name or description
  searchProducts: async (query: string): Promise<Product[]> => {
    const response = await apiClient.get(
      `/products/search?q=${encodeURIComponent(query)}`
    );
    return response.data;
  },

  // Get products by category
  getProductsByCategory: async (category: string): Promise<Product[]> => {
    const response = await apiClient.get(
      `/products/category/${encodeURIComponent(category)}`
    );
    return response.data;
  },

  // Get product usage in invoices
  getProductUsage: async (
    productId: number
  ): Promise<Record<string, unknown>[]> => {
    try {
      const response = await apiClient.get(
        `/invoices/product-usage/${productId}`
      );
      // Handle different response formats
      if (Array.isArray(response.data)) {
        return response.data;
      } else if (response.data.items) {
        return response.data.items;
      } else {
        return [];
      }
    } catch (error) {
      console.error(
        `Error fetching product usage for product ${productId}:`,
        error
      );
      // Return empty array instead of throwing to prevent UI crashes
      return [];
    }
  },
};

// Invoice API functions
export const invoiceApi = {
  getInvoices: async (): Promise<Invoice[]> => {
    const response = await apiClient.get("/invoices");
    return response.data.invoices;
  },

  getInvoice: async (id: number): Promise<Invoice> => {
    const response = await apiClient.get(`/invoices/${id}`);
    return response.data.invoice;
  },

  async createInvoice(data: CreateInvoiceFormData): Promise<Invoice> {
    // Ubah status invoice di backend
    const response = await apiClient.post("/invoices", {
      ...data,
      status: data.status || "DRAFT", // Gunakan status yang disediakan atau default ke DRAFT
    });
    return response.data.invoice;
  },

  updateInvoice: async (
    id: number,
    data: Partial<CreateInvoiceFormData>
  ): Promise<Invoice> => {
    const response = await apiClient.put(`/invoices/${id}`, data);
    return response.data.invoice;
  },

  deleteInvoice: async (id: number): Promise<void> => {
    await apiClient.delete(`/invoices/${id}`);
  },

  addPayment: async (data: CreatePaymentFormData): Promise<Payment> => {
    const response = await apiClient.post("/invoices/payments", data);
    return response.data.payment;
  },

  getInvoicePayments: async (invoiceId: number): Promise<Payment[]> => {
    const response = await apiClient.get(`/invoices/${invoiceId}/payments`);
    return response.data.payments;
  },

  changeStatus: async (id: number, status: string): Promise<Invoice> => {
    const response = await apiClient.patch(`/invoices/${id}/status`, {
      status,
    });
    return response.data.invoice;
  },

  // Recurring Invoice API Functions
  getRecurringInvoices: async (): Promise<RecurringInvoice[]> => {
    const response = await apiClient.get("/recurring-invoices");
    return response.data.recurringInvoices;
  },

  getRecurringInvoice: async (id: number): Promise<RecurringInvoice> => {
    const response = await apiClient.get(`/recurring-invoices/${id}`);
    return response.data.recurringInvoice;
  },

  createRecurringInvoice: async (
    data: CreateRecurringInvoiceData
  ): Promise<RecurringInvoice> => {
    try {
      console.log(
        "Creating recurring invoice with data:",
        JSON.stringify({
          ...data,
          // Hindari logging data lengkap untuk keamanan
          items: data.items ? `[${data.items.length} items]` : "no items",
        })
      );

      // Pastikan data memiliki format yang benar
      const formattedData = {
        client_id: Number(data.client_id),
        pattern: data.pattern,
        next_invoice_date: data.next_invoice_date,
        items: data.items.map((item) => ({
          product_id: Number(item.product_id),
          quantity: Number(item.quantity),
          description: item.description || "",
        })),
        source_invoice_id: data.source_invoice_id
          ? Number(data.source_invoice_id)
          : undefined,
      };

      const response = await apiClient.post(
        "/recurring-invoices",
        formattedData
      );
      console.log("Recurring invoice created successfully");
      return response.data.recurringInvoice;
    } catch (error) {
      console.error("Error creating recurring invoice:", error);
      throw error;
    }
  },

  updateRecurringInvoice: async (
    id: number,
    data: UpdateRecurringInvoiceData
  ): Promise<RecurringInvoice> => {
    const response = await apiClient.put(`/recurring-invoices/${id}`, data);
    return response.data.recurringInvoice;
  },

  deleteRecurringInvoice: async (id: number): Promise<void> => {
    await apiClient.delete(`/recurring-invoices/${id}`);
  },

  activateRecurringInvoice: async (id: number): Promise<RecurringInvoice> => {
    const response = await apiClient.patch(
      `/recurring-invoices/${id}/activate`,
      {}
    );
    return response.data.recurringInvoice;
  },

  deactivateRecurringInvoice: async (id: number): Promise<RecurringInvoice> => {
    const response = await apiClient.patch(
      `/recurring-invoices/${id}/deactivate`,
      {}
    );
    return response.data.recurringInvoice;
  },

  getGeneratedInvoices: async (recurringId: number): Promise<Invoice[]> => {
    const response = await apiClient.get(
      `/recurring-invoices/${recurringId}/invoices`
    );
    return response.data.invoices;
  },

  generateInvoiceManually: async (recurringId: number): Promise<Invoice> => {
    const response = await apiClient.post(
      `/recurring-invoices/${recurringId}/generate`,
      {}
    );
    return response.data.invoice;
  },

  /**
   * Send an invoice via email to the client
   */
  async sendInvoiceEmail(id: number): Promise<boolean> {
    try {
      const response = await apiClient.post(`/invoices/${id}/send`);
      return response.status === 200;
    } catch (error) {
      console.error("Error sending invoice email:", error);
      throw error;
    }
  },

  /**
   * Send a reminder email for an invoice
   */
  async sendReminderEmail(id: number): Promise<boolean> {
    try {
      const response = await apiClient.post(`/invoices/${id}/remind`);
      return response.status === 200;
    } catch (error) {
      console.error("Error sending reminder email:", error);
      throw error;
    }
  },

  /**
   * Create an invoice and send it to the client via email
   */
  async createAndSendInvoice(data: CreateInvoiceFormData): Promise<Invoice> {
    // First create the invoice with PENDING status
    const invoiceData = {
      ...data,
      status: "PENDING" as InvoiceStatus,
    };

    const invoice = await this.createInvoice(invoiceData);

    try {
      // Send the email
      await this.sendInvoiceEmail(invoice.invoice_id);
      return invoice;
    } catch (error) {
      console.error("Error sending invoice email:", error);
      // Even if email fails, return the created invoice
      return invoice;
    }
  },
};

export default apiClient;

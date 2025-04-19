export interface User {
  user_id: number;
  email: string;
  username?: string;
  password?: string;
  phone?: string;
  first_name?: string;
  last_name?: string;
  avatar?: string;
  is_google: boolean;
  verified: boolean;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  verify_token?: string;
  password_reset_token?: string;

  // Relations
  profile?: Profile;
  clients?: Client[];
  products?: Product[];
  invoices?: Invoice[];
  recurringInvoices?: RecurringInvoice[];
}

export interface Profile {
  profile_id: number;
  user_id: number;
  company_name?: string;
  address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  logo?: string;
  website?: string;
  tax_number?: string;
  created_at: string;
  updated_at: string;

  bank_accounts?: BankAccount[];
  e_wallets?: EWallet[];
  // Relations
  user?: User;
}

export interface AuthResponse {
  status: string;
  token: string;
  message: string;
  user: User;
  profile?: Profile;
  bankAccounts?: BankAccount[];
  eWallets?: EWallet[];
}

export interface BankAccount {
  id: number;
  profile_id: number;
  bank_name: string;
  account_number: string;
  account_name: string;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
}

export interface EWallet {
  id: number;
  profile_id: number;
  wallet_type: string;
  phone_number: string;
  account_name: string;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
}

export interface RegisterFormData {
  email: string;
}

export interface VerifyAccountFormData {
  username: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  password: string;
  confirmPassword: string;
  companyName?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  website?: string;
  taxNumber?: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface ResetPasswordFormData {
  email: string;
}

export interface VerifyResetPasswordFormData {
  password: string;
  confirmPassword: string;
}

export interface ChangeEmailFormData {
  newEmail: string;
}

export interface UpdateProfileFormData {
  username?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
  companyName?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  logo?: string;
  website?: string;
  taxNumber?: string;
}

// Client Types
export interface Client {
  client_id: number;
  user_id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  company_name?: string;
  payment_preference?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;

  // Relations
  user?: User;
  invoices?: Invoice[];
  recurringInvoices?: RecurringInvoice[];
}

export interface CreateClientFormData {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  company_name?: string;
  payment_preference?: string;
  notes?: string;
}

// Product Types
export interface Product {
  product_id: number;
  user_id: number;
  name: string;
  description?: string;
  price: number;
  unit?: string;
  tax_rate?: number;
  category?: string;
  image: string | null; // Added image field
  created_at: string;
  updated_at: string;
  deleted_at?: string;

  // Relations
  user?: User;
  invoiceItems?: InvoiceItem[];
  recurringInvoiceItems?: RecurringInvoiceItem[];
}
// Error interface
export interface ApiError {
  message: string;
  errors?: { [key: string]: string[] };
  statusCode?: number;
}

// File interface
export interface FileData {
  name: string;
  size: number;
  type: string;
  url: string;
}

// Pagination interface
export interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// Paginated response interface
export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationData;
}

// Product creation/update form data
export interface CreateProductFormData {
  name: string;
  description: string;
  price: number;
  unit: string;
  tax_rate: number;
  category: string;
}

// Multer file type for file uploads
export interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination?: string;
  filename?: string;
  path?: string;
  buffer: Buffer;
}
// Invoice Types
export type InvoiceStatus =
  | "DRAFT"
  | "PENDING"
  | "PAID"
  | "PARTIAL"
  | "OVERDUE"
  | "CANCELLED";

export type RecurringPattern =
  | "WEEKLY"
  | "BIWEEKLY"
  | "MONTHLY"
  | "QUARTERLY"
  | "SEMIANNUALLY"
  | "ANNUALLY";

export type PaymentMethod =
  | "CASH"
  | "BANK_TRANSFER"
  | "E_WALLET"
  | "OTHER";

export interface InvoiceItem {
  item_id: number;
  invoice_id: number;
  product_id: number;
  description?: string;
  quantity: number;
  unit_price: number;
  tax_rate?: number;
  tax_amount?: number;
  amount: number;

  // Relations
  invoice?: Invoice;
  product?: Product;
}

export interface Payment {
  payment_id: number;
  invoice_id: number;
  amount: number;
  payment_date: string;
  payment_method: PaymentMethod;
  reference?: string;
  notes?: string;
  created_at: string;

  // Relations
  invoice?: Invoice;
}

// Update definisi Invoice untuk menyertakan data pembayaran
export interface Invoice {
  // ...existing fields
  invoice_id: number;
  user_id: number;
  client_id: number;
  invoice_number: string;
  issue_date: string;
  due_date: string;
  status: InvoiceStatus;
  subtotal: number;
  tax_amount: number;
  discount_amount?: number;
  total_amount: number;
  notes?: string;
  terms?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;

  // Recurring invoice relation field
  source_recurring_id?: number;
  is_recurring?: boolean;
  recurring_pattern?: RecurringPattern;

  // Relations
  user?: {
    email?: string;
    phone?: string;
    profile?: {
      company_name?: string | null;
      address?: string | null;
      phone?: string | null;
      bank_accounts?: Array<{
        id: number;
        bank_name: string;
        account_number: string;
        account_name: string;
        is_primary: boolean;
      }> | null;
      e_wallets?: Array<{
        id: number;
        wallet_type: string;
        phone_number: string;
        account_name: string;
        is_primary: boolean;
      }> | null;
    } | null;
  } | null;
  client?: Client;
  items?: InvoiceItem[];
  payments?: Payment[];
  source_recurring?: RecurringInvoice;
}

export interface CreateInvoiceFormData {
  client_id: number;
  issue_date: string;
  due_date: string;
  items: {
    product_id: number;
    quantity: number;
    description?: string;
  }[];
  notes?: string;
  terms?: string;
  is_recurring: boolean;
  recurring_pattern?: RecurringPattern;
  status?: InvoiceStatus; // Tambahkan status sebagai properti opsional
}

export interface CreatePaymentFormData {
  invoice_id: number;
  amount: number;
  payment_date: string;
  payment_method: PaymentMethod;
  reference?: string;
  notes?: string;
}

// Recurring Invoice Types
export interface RecurringInvoice {
  id: number;
  user_id: number;
  client_id: number;
  pattern: RecurringPattern;
  next_invoice_date: string;
  start_date: string;
  end_date?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at?: string;

  // Relations
  user?: User;
  client?: Client;
  items?: RecurringInvoiceItem[];
  generated_invoices?: Invoice[];
}

export interface RecurringInvoiceItem {
  id: number;
  recurring_id: number;
  product_id: number;
  description?: string;
  quantity: number;
  unit_price: number;
  tax_rate?: number;

  // Relations
  recurring_invoice?: RecurringInvoice;
  product?: Product;
}

export interface CreateRecurringInvoiceData {
  client_id: number;
  pattern: RecurringPattern;
  next_invoice_date: string;
  items: {
    product_id: number;
    quantity: number;
    description?: string;
  }[];
  source_invoice_id?: number;
}

export interface UpdateRecurringInvoiceData {
  pattern?: RecurringPattern;
  next_invoice_date?: string;
  is_active?: boolean;
  items?: {
    product_id: number;
    quantity: number;
    description?: string;
  }[];
}

export interface AddPaymentData {
  invoice_id: number;
  amount: number;
  payment_date: string;
  payment_method: PaymentMethod;
  reference?: string;
  notes?: string;
}

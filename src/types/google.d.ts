// google.d.ts - Place this in your types directory
// This extends the existing Google type definitions
// types/google.d.ts
interface Window {
  google:
    | {
        accounts: {
          id: {
            initialize: (config: GoogleAuthConfig) => void;
            renderButton: (
              element: HTMLElement,
              options: GoogleButtonOptions
            ) => void;
            prompt: (config?: GooglePromptConfig) => void;
            disableAutoSelect: () => void;
            storeCredential: (
              credential: string,
              callback?: () => void
            ) => void;
            cancel: () => void;
            revoke: (
              hint: string,
              callback: (response: GoogleRevokeResponse) => void
            ) => void;
          };
          oauth2: {
            initTokenClient: (config: GoogleOauth2Config) => GoogleTokenClient;
            GoogleAuth: (config: GoogleAuthClientConfig) => GoogleAuthClient;
          };
        };
      }
    | undefined;
}

// Interface for OAuth2 configuration
interface GoogleOauth2Config {
  client_id: string;
  scope: string;
  callback: (response: GoogleTokenResponse) => void;
  [key: string]: unknown;
}

// Interface for Google Auth client config
interface GoogleAuthClientConfig {
  client_id: string;
  scope: string;
  [key: string]: unknown;
}

// Interface for token client
interface GoogleTokenClient {
  requestAccessToken: (options?: { prompt?: string }) => void;
  [key: string]: unknown;
}

// Interface for auth client
interface GoogleAuthClient {
  signIn: () => Promise<GoogleUser>;
  [key: string]: unknown;
}

// Interface for token response
interface GoogleTokenResponse {
  access_token: string;
  expires_in: number;
  scope: string;
  token_type: string;
  [key: string]: unknown;
}

interface GoogleUser {
  getBasicProfile: () => GoogleUserProfile;
  [key: string]: unknown;
}

interface GoogleUserProfile {
  getId: () => string;
  getName: () => string;
  getEmail: () => string;
  [key: string]: unknown;
}

// Type definitions for Google Identity Services
interface GoogleAuthConfig {
  client_id: string;
  callback: (response: GoogleCredentialResponse) => void;
  context?: string;
  auto_select?: boolean;
  itp_support?: boolean;
  login_uri?: string;
  native_callback?: (response: GoogleNativeResponse) => void;
  cancel_on_tap_outside?: boolean;
  prompt_parent_id?: string;
  nonce?: string;
  state_cookie_domain?: string;
  ux_mode?: "popup" | "redirect";
  allowed_parent_origin?: string | string[];
  intermediate_iframe_close_callback?: () => void;
  error_callback?: (error: GoogleErrorResponse) => void;
}

interface GoogleNativeResponse {
  id: string;
  email: string;
  name: string;
  [key: string]: unknown;
}

interface GoogleCredentialResponse {
  credential: string;
  select_by?:
    | "auto"
    | "user"
    | "user_1tap"
    | "user_2tap"
    | "btn"
    | "btn_confirm"
    | "btn_add_session"
    | "btn_confirm_add_session";
  clientId?: string;
}

interface GoogleErrorResponse {
  type: string;
  message?: string;
}

interface GoogleButtonOptions {
  type?: "standard" | "icon";
  theme?: "outline" | "filled_blue" | "filled_black";
  size?: "large" | "medium" | "small";
  text?: "signin_with" | "signup_with" | "continue_with" | "signin";
  shape?: "rectangular" | "pill" | "circle" | "square";
  logo_alignment?: "left" | "center";
  width?: number | string;
  locale?: string;
  click_listener?: () => void;
}

interface GooglePromptConfig {
  is_direct_connect_allowed?: boolean;
}

interface GoogleRevokeResponse {
  successful: boolean;
  error?: string;
}

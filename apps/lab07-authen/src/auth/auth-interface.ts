export interface AuthUser {
  uid: string;
  email?: string | null;
  phoneNumber?: string | null;
  displayName?: string | null;
  photoUrl?: string | null;
}


export interface EmailPasswordCredentials {
  email: string;
  password: string;
}


export interface PhoneCredentials {
  phoneNumberE164: string; // เช่น +66812345678
}


export type AuthProvider = "email" | "phone" | "google";


export interface IAuthService {
  loginWithEmail(email: string, password: string): Promise<void>;
  loginWithGoogle(): Promise<void>;
  loginWithPhone(): Promise<void>;
  getCurrentUser(): Promise<any | null>;
}

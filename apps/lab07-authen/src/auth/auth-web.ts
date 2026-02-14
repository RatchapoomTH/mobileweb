import { initializeApp } from "firebase/app";
import { 
  getAuth, signInWithEmailAndPassword, GoogleAuthProvider, 
  signInWithPopup, signInWithPhoneNumber, RecaptchaVerifier, 
  updateProfile, ConfirmationResult 
} from "firebase/auth";
import { AuthUser, IAuthService, EmailPasswordCredentials, PhoneCredentials } from "./auth-interface";

const firebaseConfig = {
  // *** ใส่ค่า Config ของคุณตรงนี้ ***
  apiKey: "AIzaSyARogb6S407cole8hfdn6Zwx5lEXts3P80",
  authDomain: "mobileweb-f3802.firebaseapp.com",
  projectId: "mobileweb-f3802",
  appId: "1:945912545642:web:405a382fb2296d083fa513"
};

export const firebaseApp = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(firebaseApp);

function mapUser(u: any): AuthUser {
  return {
    uid: u.uid,
    email: u.email,
    displayName: u.displayName,
    photoUrl: u.photoURL,
    phoneNumber: u.phoneNumber, // บรรทัดนี้สำคัญสำหรับโชว์เบอร์โทร
  };
}

// ตัวแปรสำหรับเก็บ Verifier และ Result
let verifier: RecaptchaVerifier | null = null;
let confirmationResult: ConfirmationResult | null = null;

export class FirebaseWebAuthService implements IAuthService {
  async getCurrentUser() {
    return firebaseAuth.currentUser ? mapUser(firebaseAuth.currentUser) : null;
  }

  async loginWithEmailPassword(creds: EmailPasswordCredentials) {
    const r = await signInWithEmailAndPassword(firebaseAuth, creds.email, creds.password);
    return mapUser(r.user);
  }

  async loginWithGoogle() {
    const r = await signInWithPopup(firebaseAuth, new GoogleAuthProvider());
    return mapUser(r.user);
  }

  async startPhoneLogin(creds: PhoneCredentials) {
    // 1. เคลียร์ Verifier เก่าทิ้งก่อน (ถ้ามี) เพื่อป้องกัน Error "RecaptchaVerifier is already initialized"
    try {
      if (verifier) {
        verifier.clear();
      }
    } catch (e) {
      console.warn("Clear verifier error", e);
    }

    // 2. สร้าง Verifier ใหม่แบบ "normal" (แสดงให้เห็นชัดเจน)
    verifier = new RecaptchaVerifier(firebaseAuth, "recaptcha-container", {
      size: "normal", // <--- แก้ตรงนี้ให้ Captcha แสดงออกมา
    });

    // 3. ส่ง SMS
    confirmationResult = await signInWithPhoneNumber(firebaseAuth, creds.phoneNumberE164, verifier);
    
    return { verificationId: confirmationResult.verificationId };
  }

  async confirmPhoneCode(payload: any) {
    if (!confirmationResult) {
      throw new Error("No confirmation result found. Please request OTP first.");
    }
    const r = await confirmationResult.confirm(payload.verificationCode);
    return mapUser(r.user);
  }

  async updateProfile(data: any) {
    if (firebaseAuth.currentUser) {
      await updateProfile(firebaseAuth.currentUser, { 
        displayName: data.displayName, 
        photoURL: data.photoUrl 
      });
    }
  }

  async logout() { await firebaseAuth.signOut(); }
}
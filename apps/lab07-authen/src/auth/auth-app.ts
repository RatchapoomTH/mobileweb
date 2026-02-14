import { FirebaseAuthentication } from "@capacitor-firebase/authentication";
import { AuthUser, IAuthService, EmailPasswordCredentials, PhoneCredentials } from "./auth-interface";

function mapUser(u: any): AuthUser {
  return {
    uid: u.uid,
    email: u.email ?? null,
    displayName: u.displayName ?? null,
    photoUrl: u.photoUrl ?? null,
    phoneNumber: u.phoneNumber ?? null,
  };
}

export class FirebaseAppAuthService implements IAuthService {
  async getCurrentUser() {
    const { user } = await FirebaseAuthentication.getCurrentUser();
    return user ? mapUser(user) : null;
  }

  async loginWithEmailPassword(creds: EmailPasswordCredentials) {
    const { user } = await FirebaseAuthentication.signInWithEmailAndPassword(creds);
    return mapUser(user);
  }

  async loginWithGoogle() {
    const { user } = await FirebaseAuthentication.signInWithGoogle();
    return mapUser(user);
  }

  async startPhoneLogin(creds: PhoneCredentials): Promise<{ verificationId: string }> {
    return new Promise(async (resolve, reject) => {
      await FirebaseAuthentication.addListener("phoneCodeSent", (e) => resolve({ verificationId: e.verificationId }));
      await FirebaseAuthentication.addListener("phoneVerificationFailed", (e) => reject(new Error(e.message)));
      await FirebaseAuthentication.signInWithPhoneNumber({ phoneNumber: creds.phoneNumberE164 });
    });
  }

  async confirmPhoneCode(payload: any) {
    const { user } = await FirebaseAuthentication.confirmVerificationCode(payload);
    return mapUser(user);
  }

  async updateProfile(data: any) {
    await FirebaseAuthentication.updateProfile({ displayName: data.displayName, photoUrl: data.photoUrl });
  }

  async logout() { await FirebaseAuthentication.signOut(); }
}
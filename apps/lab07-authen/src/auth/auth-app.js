import { FirebaseAuthentication } from "@capacitor-firebase/authentication";
function mapUser(u) {
    return {
        uid: u.uid,
        email: u.email ?? null,
        displayName: u.displayName ?? null,
        photoUrl: u.photoUrl ?? null,
        phoneNumber: u.phoneNumber ?? null,
    };
}
export class FirebaseAppAuthService {
    async getCurrentUser() {
        const { user } = await FirebaseAuthentication.getCurrentUser();
        return user ? mapUser(user) : null;
    }
    async loginWithEmailPassword(creds) {
        const { user } = await FirebaseAuthentication.signInWithEmailAndPassword(creds);
        return mapUser(user);
    }
    async loginWithGoogle() {
        const { user } = await FirebaseAuthentication.signInWithGoogle();
        return mapUser(user);
    }
    async startPhoneLogin(creds) {
        return new Promise(async (resolve, reject) => {
            await FirebaseAuthentication.addListener("phoneCodeSent", (e) => resolve({ verificationId: e.verificationId }));
            await FirebaseAuthentication.addListener("phoneVerificationFailed", (e) => reject(new Error(e.message)));
            await FirebaseAuthentication.signInWithPhoneNumber({ phoneNumber: creds.phoneNumberE164 });
        });
    }
    async confirmPhoneCode(payload) {
        const { user } = await FirebaseAuthentication.confirmVerificationCode(payload);
        return mapUser(user);
    }
    async updateProfile(data) {
        await FirebaseAuthentication.updateProfile({ displayName: data.displayName, photoUrl: data.photoUrl });
    }
    async logout() { await FirebaseAuthentication.signOut(); }
}

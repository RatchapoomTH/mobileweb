import { Capacitor } from "@capacitor/core";
import { FirebaseWebAuthService } from "./auth-web";
import { FirebaseAppAuthService } from "./auth-app";
export const authService = Capacitor.isNativePlatform()
    ? new FirebaseAppAuthService() // สำหรับ Android / iOS
    : new FirebaseWebAuthService(); // สำหรับ Web

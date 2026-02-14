import { Capacitor } from "@capacitor/core";
import { IAuthService } from "./auth-interface";
import { FirebaseWebAuthService } from "./auth-web";
import { FirebaseAppAuthService } from "./auth-app";

export const authService: IAuthService = Capacitor.isNativePlatform()
    ? new FirebaseAppAuthService()  // สำหรับ Android / iOS
    : new FirebaseWebAuthService(); // สำหรับ Web
<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Login</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-card>
        <ion-card-header>
          <ion-card-title>Sign in / Register</ion-card-title>
        </ion-card-header>

        <ion-card-content>
          <ion-item class="ion-margin-bottom">
            <ion-input 
              label="Display Name (ชื่อที่ต้องการแสดง)" 
              label-placement="stacked" 
              placeholder="กรอกชื่อของคุณที่นี่..."
              v-model="displayName"
            ></ion-input>
          </ion-item>

          <hr style="background: #ccc; height: 1px; margin: 20px 0;">

          <ion-item>
            <ion-input 
              label="Email" 
              label-placement="stacked" 
              type="email" 
              placeholder="email@domain.com"
              v-model="email"
            ></ion-input>
          </ion-item>

          <ion-item>
            <ion-input 
              label="Password" 
              label-placement="stacked" 
              type="password" 
              v-model="password"
            ></ion-input>
          </ion-item>

          <ion-button expand="block" class="ion-margin-top" @click="handleLoginEmail">
            Login Email/Password
          </ion-button>

          <ion-button expand="block" color="tertiary" @click="handleLoginGoogle">
            Login Google
          </ion-button>

          <ion-button expand="block" color="secondary" @click="handleLoginPhone">
            Login by Phone
          </ion-button>

          <div id="recaptcha-container" style="margin-top: 20px;"></div>

        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { authService } from '@/auth/auth-service';
import { 
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, 
  IonCard, IonCardHeader, IonCardTitle, IonCardContent, 
  IonItem, IonInput, IonButton 
} from '@ionic/vue';

const router = useRouter();
// สร้างตัวแปร v-model
const displayName = ref('');
const email = ref('');
const password = ref('');

// ฟังก์ชันอัปเดตชื่อ (แยกออกมาเพื่อให้เรียกใช้ซ้ำได้)
async function updateProfileName() {
  if (displayName.value) {
    try {
      console.log('Updating profile name to:', displayName.value);
      await authService.updateProfile({ displayName: displayName.value });
    } catch (e) {
      console.error('Update profile failed', e);
    }
  }
}

// 1. Login Email/Password
async function handleLoginEmail() {
  // ตรวจสอบค่าว่างทีละตัว
  if (!displayName.value) {
    alert("กรุณากรอก Display Name ก่อน");
    return;
  }
  if (!email.value) {
    alert("กรุณากรอก Email");
    return;
  }
  if (!password.value) {
    alert("กรุณากรอก Password");
    return;
  }

  try {
    await authService.loginWithEmailPassword({ 
      email: email.value, 
      password: password.value 
    });
    // ถ้า Login ผ่าน ให้ไปอัปเดตชื่อต่อ
    await updateProfileName();
    router.push('/tabs/tab1');
  } catch (err: any) {
    console.error(err);
    alert("Login Error: " + (err.message || err));
  }
}

// 2. Login Google
async function handleLoginGoogle() {
  if (!displayName.value) {
    alert("กรุณากรอก Display Name ก่อนกด Login Google");
    return;
  }

  try {
    await authService.loginWithGoogle();
    await updateProfileName();
    router.push('/tabs/tab1');
  } catch (err: any) {
    console.error(err);
    alert("Google Login Error: " + (err.message || err));
  }
}

// 3. Login Phone
async function handleLoginPhone() {
  if (!displayName.value) {
    alert("กรุณากรอก Display Name ก่อนกด Login Phone");
    return;
  }

  // ใช้ prompt เพื่อรับเบอร์โทร (ง่ายและไม่รกหน้าจอ)
  const phoneNumber = prompt("กรุณากรอกเบอร์โทรศัพท์ (เช่น +66812345678)");
  if (!phoneNumber) return;

  try {
    // Step 1: ขอ OTP
    const { verificationId } = await authService.startPhoneLogin({ 
      phoneNumberE164: phoneNumber 
    });
    
    // Step 2: กรอก OTP
    const otp = prompt("กรุณากรอกรหัส OTP ที่ได้รับทาง SMS");
    if (!otp) return;

    // Step 3: ยืนยัน
    await authService.confirmPhoneCode({ 
      verificationId, 
      verificationCode: otp 
    });

    // Step 4: อัปเดตชื่อ
    await updateProfileName();
    
    router.push('/tabs/tab1');
  } catch (err: any) {
    console.error(err);
    alert("Phone Login Error: " + (err.message || err));
  }
}
</script>
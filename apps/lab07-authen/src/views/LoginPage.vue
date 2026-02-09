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
          <ion-card-title>Sign in</ion-card-title>
        </ion-card-header>

        <ion-card-content>
          <ion-item>
            <ion-label position="stacked">Email</ion-label>
            <ion-input v-model="email" type="email" />
          </ion-item>

          <ion-item>
            <ion-label position="stacked">Password</ion-label>
            <ion-input v-model="password" type="password" />
          </ion-item>

          <ion-button expand="block" class="ion-margin-top" @click="loginEmail">Login Email/Password</ion-button>
          <ion-button expand="block" color="tertiary" @click="loginGoogle">Login Google</ion-button>
          <ion-button expand="block" color="secondary" @click="loginPhone">Login by Phone</ion-button>

          <!-- required by firebase RecaptchaVerifier for web (invisible widget) -->
          <div id="recaptcha-container" style="display:none;"></div>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { authService } from '@/auth/auth-service';

const router = useRouter();
const email = ref('');
const password = ref('');

async function loginEmail() {
  if (!email.value || !password.value) {
    alert("Please enter email and password");
    return;
  }
  try {
    await authService.loginWithEmail(email.value, password.value);
    await router.push('/tabs/tab1');
  } catch (err: any) {
    console.error("Login error:", err);
    alert(err?.message || String(err));
  }
}

async function loginGoogle() {
  try {
    await authService.loginWithGoogle();
    await router.push('/tabs/tab1');
  } catch (err: any) {
    alert(err?.message || String(err));
  }
}

async function loginPhone() {
  try {
    await authService.loginWithPhone();
    await router.push('/tabs/tab1');
  } catch (err: any) {
    alert(err?.message || String(err));
  }
}
</script>
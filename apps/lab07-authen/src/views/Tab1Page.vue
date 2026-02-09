<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Tab 1 - Profile</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div v-if="user">
        <ion-avatar v-if="user.photoUrl" style="width:80px;height:80px">
          <img :src="user.photoUrl" />
        </ion-avatar>

        <ion-list>
          <ion-item>
            <ion-label>
              <h2>UID</h2>
              <p>{{ user.uid }}</p>
            </ion-label>
          </ion-item>

          <ion-item>
            <ion-label>
              <h2>Email</h2>
              <p>{{ user.email ?? '-' }}</p>
            </ion-label>
          </ion-item>

          <ion-item>
            <ion-label>
              <h2>Phone</h2>
              <p>{{ user.phoneNumber ?? '-' }}</p>
            </ion-label>
          </ion-item>

          <ion-item>
            <ion-label>
              <h2>Display Name</h2>
              <p>{{ user.displayName ?? '-' }}</p>
            </ion-label>
          </ion-item>
        </ion-list>
      </div>

      <div v-else>
        <p>Not logged in.</p>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { authService } from '@/auth/auth-service';

interface AuthUser {
  uid: string;
  email?: string | null;
  phoneNumber?: string | null;
  displayName?: string | null;
  photoUrl?: string | null;
}

const user = ref<AuthUser | null>(null);

onMounted(async () => {
  try {
    const u: any = await authService.getCurrentUser();
    if (u) {
      user.value = {
        uid: u.uid,
        email: u.email ?? null,
        phoneNumber: u.phoneNumber ?? null,
        displayName: u.displayName ?? null,
        photoUrl: (u.photoURL ?? u.photoUrl) ?? null
      };
    } else {
      user.value = null;
    }
  } catch {
    user.value = null;
  }
});
</script>

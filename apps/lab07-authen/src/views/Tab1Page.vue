<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Tab 1 - Profile</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div v-if="user">
        <div class="ion-text-center ion-margin-bottom" v-if="user.photoUrl">
          <ion-avatar style="width:100px; height:100px; margin: 0 auto;">
            <img :src="user.photoUrl" alt="Profile" />
          </ion-avatar>
        </div>

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

        <ion-button 
          expand="block" 
          color="danger" 
          class="ion-margin-top" 
          @click="handleLogout"
        >
          Log out
        </ion-button>
      </div>

      <div v-else class="ion-text-center ion-padding">
        <p>กำลังโหลดข้อมูล หรือ ยังไม่ได้เข้าสู่ระบบ...</p>
        <ion-button router-link="/login">ไปหน้า Login</ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router'; // 1. import router
import { authService } from '@/auth/auth-service';
import { 
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, 
  IonList, IonItem, IonLabel, IonAvatar, IonButton 
} from '@ionic/vue'; // 2. import components ให้ครบ

// Interface
interface AuthUser {
  uid: string;
  email?: string | null;
  phoneNumber?: string | null;
  displayName?: string | null;
  photoUrl?: string | null;
}

const router = useRouter();
const user = ref<AuthUser | null>(null);

// ฟังก์ชัน Logout
async function handleLogout() {
  try {
    // 1. สั่ง Logout จาก Firebase
    await authService.logout();
    
    // 2. เคลียร์ค่า user ในหน้านี้ (เพื่อความสวยงามก่อนเปลี่ยนหน้า)
    user.value = null;

    // 3. เปลี่ยนหน้าไป Login (ใช้ replace เพื่อไม่ให้กด Back กลับมาได้)
    router.replace('/login');
  } catch (error) {
    console.error("Logout failed", error);
  }
}

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
      // ถ้าไม่มี user ให้ดีดกลับไปหน้า login อัตโนมัติ (Optional)
      router.replace('/login');
    }
  } catch {
    user.value = null;
  }
});
</script>
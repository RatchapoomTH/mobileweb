<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar color="primary">
        <ion-title>ARM WORKOUT</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding ion-text-center">
      <div class="display-container">
        <h1 class="main-count">{{ state?.repDisplay ?? 0 }}</h1>
        <p class="label">จำนวนครั้ง</p>
      </div>

      <div class="status-msg" :class="{ 'warning': state?.stats.lastMessage !== 'OK' && state?.stats.lastMessage }">
        <ion-icon :name="state?.stats.lastMessage === 'OK' ? 'checkmark-circle' : 'alert-circle'"></ion-icon>
        <span>
          {{ state?.stats.lastMessage === 'OK' ? 'ท่าทางถูกต้อง' : (state?.stats.lastMessage || 'กด START เพื่อเริ่ม') }}
        </span>
      </div>

      <div class="stats-grid">
        <div class="stat-box">
          <small>คะแนน</small>
          <div>{{ state?.stats.score ?? 0 }}</div>
        </div>
        <div class="stat-box">
          <small>ความเร็วเฉลี่ย</small>
          <div>{{ state ? (state.stats.avgRepMs / 1000).toFixed(1) : 0 }} วิ</div>
        </div>
      </div>

      <div class="button-group">
        <ion-button v-if="state?.status !== 'RUNNING'" expand="block" shape="round" size="large" @click="start">
          <ion-icon slot="start" name="play"></ion-icon> START
        </ion-button>
        <ion-button v-else expand="block" color="danger" shape="round" size="large" @click="stop">
          <ion-icon slot="start" name="stop"></ion-icon> STOP
        </ion-button>
      </div>
    </ion-content>

    <ion-footer class="ion-text-center ion-padding">
      <small>663380231-4 รัชภูมิ ทองแดง</small>
    </ion-footer>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { MotionService } from "../core/MotionService";
import { TtsService } from "../core/TtsService";
import { ArmWorkoutEngine } from "../core/ArmWorkoutEngine";
import { 
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, 
  IonFooter, IonButton, IonIcon 
} from "@ionic/vue";
import { play, stop as stopIcon, checkmarkCircle, alertCircle } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import type { WorkoutState } from "../core/types";

addIcons({ play, stop: stopIcon, 'checkmark-circle': checkmarkCircle, 'alert-circle': alertCircle });

const state = ref<WorkoutState | null>(null);
const engine = new ArmWorkoutEngine();
const motion = new MotionService();
const tts = new TtsService();

onMounted(() => {
  engine.onChange((s) => (state.value = s));
});

async function start() {
  // เปลี่ยนคำพูดเริ่มต้นให้เข้ากับท่าทางใหม่
  await tts.speak("เตรียมตัว ถือโทรศัพท์แนวนอนหันหัวไปข้างหน้า แล้วยกขึ้นครับ");
  engine.start();
  await motion.start((s) => engine.process(s));
}

async function stop() {
  await motion.stop();
  engine.stop();
  // สรุปคะแนนเมื่อจบ
  const finalScore = state.value?.stats.score ?? 0;
  await tts.speak(`จบการทำงาน คะแนนรวมคือ ${finalScore} ครั้ง เก่งมากครับ`);
}
</script>

<style scoped>
.display-container {
  background: #f4f4f4;
  border-radius: 20px;
  padding: 40px 0;
  margin: 20px 0;
}
.main-count {
  font-size: 6rem; /* ตัวเลขใหญ่มาก */
  margin: 0;
  color: var(--ion-color-primary);
  font-weight: 800;
}
.label { font-weight: bold; color: #666; letter-spacing: 2px; }
.status-msg {
  padding: 15px;
  border-radius: 12px;
  background: #e8f5e9;
  color: #2e7d32;
  font-weight: bold;
  margin-bottom: 20px;
}
.status-msg.warning { background: #ffebee; color: #c62828; }
.stats-grid {
  display: flex;
  justify-content: space-around;
  margin-bottom: 30px;
}
.stat-box small { color: #888; display: block; }
.stat-box div { font-size: 1.5rem; font-weight: bold; }
.button-group { margin-top: 20px; }
</style>
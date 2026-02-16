<template>
  <ion-page class="cyber-page">
    <ion-header class="ion-no-border">
      <ion-toolbar class="cyber-toolbar">
        <ion-title>LAB-08: <span class="neon-text">GEMINI VISION</span></ion-title>
        <div slot="end" class="user-tag">663380231-4 รัชภูมิ ทองแดง Sec.1</div>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding cyber-content">
      <input ref="fileEl" type="file" accept="image/*" hidden @change="onFileChange" />

      <div class="action-container">
        <div class="button-group">
          <ion-button class="cyber-btn" @click="fileEl?.click()">
            <span class="btn-glitch">SELECT_FILE</span>
          </ion-button>
          <ion-button class="cyber-btn neon-purple" @click="onTakePhoto">
            <span class="btn-glitch">SCAN_IMAGE</span>
          </ion-button>
        </div>

        <div v-if="previewUrl" :class="['image-frame', { 'analyzed-glow': result }]">
          <div class="corner-tl"></div><div class="corner-tr"></div>
          <ion-img :src="previewUrl" class="preview-img" />
          <div class="scan-line"></div>
          <div class="corner-bl"></div><div class="corner-br"></div>
        </div>

        <ion-button 
          expand="block" 
          class="analyze-btn" 
          :disabled="!img || loading" 
          @click="onAnalyze"
        >
          <span v-if="!loading">INITIATE_ANALYSIS</span>
          <ion-spinner v-else name="crescent" color="light" />
        </ion-button>
      </div>

      <div v-if="result" class="result-panel">
        <div class="panel-header">ANALYSIS_LOGS</div>
        <pre class="cyber-json">{{ JSON.stringify(result, null, 2) }}</pre>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from "vue";
// ลบ IonSubtitle ออกจาก import แล้ว
import {
  IonButton, IonContent, IonHeader, IonImg, IonPage, IonSpinner, IonTitle, IonToolbar
} from "@ionic/vue";
import { PhotoService } from "../core/photo.service";
import { GeminiVisionService } from "../core/gemini.service";
import type { Base64Image } from "../core/ai.interface";
import type { ImageAnalysisResult } from "../core/ai.interface";

const fileEl = ref<HTMLInputElement | null>(null);
const img = ref<Base64Image | null>(null);
const previewUrl = ref("");
const result = ref<ImageAnalysisResult | null>(null);
const loading = ref(false);

async function onFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;
  
  result.value = null;
  img.value = await PhotoService.fromFile(file);
  previewUrl.value = URL.createObjectURL(file);
}

async function onTakePhoto() {
  loading.value = true;
  try {
    const b64 = await PhotoService.fromCamera();
    result.value = null;
    img.value = b64;
    previewUrl.value = `data:${b64.mimeType};base64,${b64.base64}`;
  } finally {
    loading.value = false;
  }
}

async function onAnalyze() {
  if (!img.value) return;
  loading.value = true;
  result.value = null;
  try {
    result.value = await GeminiVisionService.analyze(img.value);
  } catch (err) {
    console.error(err);
    alert("Analysis Failed. Check console.");
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
/* Main Theme Colors */
.cyber-page { --ion-background-color: #0d0221; color: #a29bfe; }
.cyber-toolbar { --background: #1a083d; --color: #f1f2f6; border-bottom: 2px solid #6c5ce7; box-shadow: 0 0 15px rgba(108, 92, 231, 0.5); }
.neon-text { color: #00d2ff; text-shadow: 0 0 10px #00d2ff, 0 0 20px #00d2ff; font-weight: bold; }
/* ปรับ user-tag ให้แสดงผลสวยงามใน toolbar */
.user-tag { font-size: 0.7rem; padding-right: 15px; color: #ef57ff; text-shadow: 0 0 5px #ef57ff; display: flex; align-items: center; height: 100%; }

/* Buttons */
.cyber-btn { --background: transparent; --border-color: #6c5ce7; --border-style: solid; --border-width: 2px; --color: #6c5ce7; margin-bottom: 0; filter: drop-shadow(0 0 5px rgba(108, 92, 231, 0.3)); font-family: 'Courier New', Courier, monospace; font-weight: bold; }
.neon-purple { --border-color: #ef57ff; --color: #ef57ff; filter: drop-shadow(0 0 5px rgba(239, 87, 255, 0.3)); }
.analyze-btn { margin-top: 20px; --background: linear-gradient(45deg, #6c5ce7, #ef57ff); --border-radius: 0; font-weight: bold; letter-spacing: 2px; box-shadow: 0 0 20px rgba(239, 87, 255, 0.4); --color: white; }

/* Layout Helpers */
.cyber-content { display: flex; flex-direction: column; }
.action-container { margin-bottom: 20px; }
.button-group { display: flex; gap: 10px; margin-bottom: 15px; }
.button-group ion-button { flex: 1; }

/* Image Frame & Glow */
.image-frame { position: relative; margin: 20px 0; padding: 5px; background: rgba(108, 92, 231, 0.05); border: 1px solid rgba(108, 92, 231, 0.3); display: flex; justify-content: center; align-items: center; box-shadow: inset 0 0 20px rgba(108, 92, 231, 0.2); transition: all 0.5s ease-in-out; }
.analyzed-glow { border-color: #00d2ff; animation: pulsate-glow 2s infinite ease-in-out; }
@keyframes pulsate-glow {
  0% { box-shadow: inset 0 0 20px rgba(108, 92, 231, 0.2), 0 0 10px #00d2ff, 0 0 20px #ef57ff; }
  50% { box-shadow: inset 0 0 20px rgba(108, 92, 231, 0.2), 0 0 25px #00d2ff, 0 0 50px #ef57ff; }
  100% { box-shadow: inset 0 0 20px rgba(108, 92, 231, 0.2), 0 0 10px #00d2ff, 0 0 20px #ef57ff; }
}

.preview-img { width: 100%; height: auto; display: block; filter: contrast(1.1) brightness(1.1); }

/* Scanner Animation */
.scan-line { position: absolute; top: 0; left: 0; width: 100%; height: 3px; background: linear-gradient(to right, transparent, #00d2ff, transparent); box-shadow: 0 0 15px #00d2ff; animation: scan 3s linear infinite; z-index: 10; opacity: 0.7; pointer-events: none; }
@keyframes scan { 0% { top: 0% } 100% { top: 100% } }

/* Corners */
[class^="corner-"] { position: absolute; width: 15px; height: 15px; border: 2px solid #00d2ff; box-shadow: 0 0 5px #00d2ff; pointer-events: none; }
.corner-tl { top: -2px; left: -2px; border-right: 0; border-bottom: 0; }
.corner-tr { top: -2px; right: -2px; border-left: 0; border-bottom: 0; }
.corner-bl { bottom: -2px; left: -2px; border-right: 0; border-top: 0; }
.corner-br { bottom: -2px; right: -2px; border-left: 0; border-top: 0; }

/* JSON Result */
.result-panel { margin-top: 30px; background: rgba(13, 2, 33, 0.9); border: 1px solid #ef57ff; box-shadow: 0 0 15px rgba(239, 87, 255, 0.3); padding: 15px; font-family: 'Courier New', Courier, monospace; position: relative; }
.result-panel::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, #ef57ff, transparent); }
.panel-header { color: #ef57ff; font-size: 0.9rem; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 1px; font-weight: bold; display: flex; align-items: center; }
.panel-header::after { content: ''; flex: 1; height: 1px; background: rgba(239, 87, 255, 0.5); margin-left: 10px; }
.cyber-json { color: #00d2ff; font-size: 0.8rem; white-space: pre-wrap; word-wrap: break-word; text-shadow: 0 0 2px rgba(0, 210, 255, 0.5); }
</style>
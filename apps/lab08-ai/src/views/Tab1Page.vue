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
          <div v-if="loading" class="scan-line"></div>
          <div class="corner-bl"></div><div class="corner-br"></div>
        </div>

        <ion-button 
          expand="block" 
          class="analyze-btn" 
          :disabled="!img || loading" 
          @click="onAnalyze"
        >
          <span v-if="!loading">INITIATE ANALYSIS</span>
          <ion-spinner v-else name="crescent" color="light" />
        </ion-button>
      </div>

      <div v-if="result" class="results-container animate__animated animate__fadeInUp">
        
        <div class="cyber-card">
          <div class="card-header">
            <ion-icon :icon="textIcon" /> AI OBSERVATION
          </div>
          <div class="caption-text">
            "{{ result.caption }}"
          </div>
        </div>

        <div class="cyber-card" v-if="result.tags && result.tags.length > 0">
          <div class="card-header">
            <ion-icon :icon="pricetagIcon" /> DETECTED TAGS
          </div>
          <div class="tags-wrapper">
            <span v-for="(tag, index) in result.tags" :key="index" class="neon-chip">
              #{{ tag }}
            </span>
          </div>
        </div>

        <div class="cyber-card" v-if="result.objects && result.objects.length > 0">
          <div class="card-header">
            <ion-icon :icon="scanIcon" /> OBJECT DATA
          </div>
          <div class="object-list">
  <div v-for="(obj, idx) in result.objects" :key="idx" class="object-row">
    <div class="obj-info">
      <span class="obj-name">{{ obj.name }}</span>
      <span class="obj-conf" v-if="obj.confidence">
        {{ Math.round(obj.confidence * 100) }}%
      </span>
      <span class="obj-conf" v-else style="opacity: 0.7; font-size: 0.7rem;">
        DETECTED
      </span>
    </div>
    
    <div class="progress-track">
      <div 
        class="progress-fill" 
        :style="{ 
          width: (obj.confidence ? obj.confidence * 100 : 100) + '%',
          opacity: obj.confidence ? 1 : 0.3 
        }"
      ></div>
    </div>
  </div>
</div>
        </div>

        <div class="cyber-card safety-card" :class="{ 'danger': result.safety?.isSensitive }">
          <div class="card-header">
            <ion-icon :icon="shieldIcon" /> SAFETY CHECK
          </div>
          <div class="safety-status">
            {{ result.safety?.isSensitive ? 'SENSITIVE CONTENT DETECTED' : 'CONTENT SAFE' }}
          </div>
        </div>

      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {
  IonButton, IonContent, IonHeader, IonImg, IonPage, IonSpinner, IonTitle, IonToolbar, IonIcon
} from "@ionic/vue";
import { textOutline, pricetagOutline, scanOutline, shieldCheckmarkOutline } from 'ionicons/icons';
import { PhotoService } from "../core/photo.service";
import { GeminiVisionService } from "../core/gemini.service";
import type { Base64Image } from "../core/ai.interface";
import type { ImageAnalysisResult } from "../core/ai.interface";

// Icons
const textIcon = textOutline;
const pricetagIcon = pricetagOutline;
const scanIcon = scanOutline;
const shieldIcon = shieldCheckmarkOutline;

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
.cyber-page { --ion-background-color: #0d0221; color: #a29bfe; font-family: 'Courier New', Courier, monospace; }
.cyber-toolbar { --background: #1a083d; --color: #f1f2f6; border-bottom: 2px solid #6c5ce7; box-shadow: 0 0 15px rgba(108, 92, 231, 0.5); }
.neon-text { color: #00d2ff; text-shadow: 0 0 10px #00d2ff, 0 0 20px #00d2ff; font-weight: bold; }
.user-tag { font-size: 0.7rem; padding-right: 15px; color: #ef57ff; text-shadow: 0 0 5px #ef57ff; display: flex; align-items: center; height: 100%; }

/* Buttons */
.cyber-btn { --background: transparent; --border-color: #6c5ce7; --border-style: solid; --border-width: 2px; --color: #6c5ce7; margin-bottom: 0; filter: drop-shadow(0 0 5px rgba(108, 92, 231, 0.3)); font-weight: bold; letter-spacing: 1px; }
.neon-purple { --border-color: #ef57ff; --color: #ef57ff; filter: drop-shadow(0 0 5px rgba(239, 87, 255, 0.3)); }
.analyze-btn { margin-top: 20px; --background: linear-gradient(45deg, #6c5ce7, #ef57ff); --border-radius: 0; font-weight: bold; letter-spacing: 2px; box-shadow: 0 0 20px rgba(239, 87, 255, 0.4); --color: white; }

/* Image Frame */
.image-frame { position: relative; margin: 20px 0; padding: 5px; background: rgba(108, 92, 231, 0.05); border: 1px solid rgba(108, 92, 231, 0.3); display: flex; justify-content: center; align-items: center; box-shadow: inset 0 0 20px rgba(108, 92, 231, 0.2); transition: all 0.5s; }
.analyzed-glow { border-color: #00d2ff; box-shadow: 0 0 15px #00d2ff; }
.preview-img { width: 100%; height: auto; display: block; filter: contrast(1.1) brightness(1.1); }

/* Animation Elements */
.scan-line { position: absolute; top: 0; left: 0; width: 100%; height: 3px; background: linear-gradient(to right, transparent, #00d2ff, transparent); box-shadow: 0 0 15px #00d2ff; animation: scan 2s linear infinite; z-index: 10; opacity: 0.8; }
@keyframes scan { 0% { top: 0% } 100% { top: 100% } }
[class^="corner-"] { position: absolute; width: 15px; height: 15px; border: 2px solid #00d2ff; pointer-events: none; }
.corner-tl { top: -2px; left: -2px; border-right: 0; border-bottom: 0; }
.corner-tr { top: -2px; right: -2px; border-left: 0; border-bottom: 0; }
.corner-bl { bottom: -2px; left: -2px; border-right: 0; border-top: 0; }
.corner-br { bottom: -2px; right: -2px; border-left: 0; border-top: 0; }

/* =========================================
   NEW: Result Cards Styling
   ========================================= */
.results-container { margin-top: 30px; display: flex; flex-direction: column; gap: 15px; }

.cyber-card {
  background: rgba(13, 2, 33, 0.8);
  border: 1px solid #6c5ce7;
  padding: 15px;
  position: relative;
  box-shadow: 0 0 10px rgba(108, 92, 231, 0.2);
}
.cyber-card::before { content: ''; position: absolute; top: 0; left: 0; width: 4px; height: 100%; background: #6c5ce7; }

.card-header {
  color: #6c5ce7;
  font-size: 0.8rem;
  letter-spacing: 2px;
  margin-bottom: 10px;
  display: flex; align-items: center; gap: 8px;
  font-weight: bold; border-bottom: 1px dashed rgba(108, 92, 231, 0.5); padding-bottom: 5px;
}
.card-header ion-icon { font-size: 1.2rem; }

/* Caption */
.caption-text { color: #fff; font-size: 1rem; line-height: 1.5; text-shadow: 0 0 2px rgba(255,255,255,0.5); }

/* Tags */
.tags-wrapper { display: flex; flex-wrap: wrap; gap: 8px; }
.neon-chip {
  background: rgba(0, 210, 255, 0.1);
  color: #00d2ff;
  border: 1px solid #00d2ff;
  padding: 4px 10px;
  font-size: 0.8rem;
  border-radius: 15px;
  text-shadow: 0 0 5px #00d2ff;
  box-shadow: 0 0 5px rgba(0, 210, 255, 0.2);
}

/* Objects */
.object-row { margin-bottom: 10px; }
.obj-info { display: flex; justify-content: space-between; font-size: 0.8rem; margin-bottom: 3px; color: #ef57ff; }
.progress-track { width: 100%; height: 6px; background: rgba(255, 255, 255, 0.1); border-radius: 3px; overflow: hidden; }
.progress-fill { height: 100%; background: linear-gradient(90deg, #6c5ce7, #ef57ff); box-shadow: 0 0 10px #ef57ff; transition: width 1s ease-out; }

/* Safety */
.safety-card.danger { border-color: #ff4757; box-shadow: 0 0 15px rgba(255, 71, 87, 0.4); }
.safety-card.danger::before { background: #ff4757; }
.safety-card.danger .card-header { color: #ff4757; border-bottom-color: rgba(255, 71, 87, 0.5); }
.safety-status { color: #a29bfe; font-size: 0.9rem; }
.safety-card.danger .safety-status { color: #ff4757; font-weight: bold; }
</style>
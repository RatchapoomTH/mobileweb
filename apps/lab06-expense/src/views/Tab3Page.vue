<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>ตั้งค่า & สรุปผล</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="ion-padding">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">ตั้งค่า</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-card class="analysis-card">
        <ion-card-header>
          <ion-card-title>หมดเงินไปกับอะไร?</ion-card-title>
          <ion-card-subtitle>5 อันดับหมวดหมู่รายจ่ายสูงสุด</ion-card-subtitle>
        </ion-card-header>
        <ion-card-content>
          <div v-if="topCategories.length === 0" class="no-data">
            ยังไม่มีข้อมูลรายจ่าย
          </div>
          <div v-else v-for="(cat, index) in topCategories" :key="index" class="category-row">
            <div class="cat-label">
              <span>{{ cat.name }}</span>
              <span>{{ formatMoney(cat.total) }}</span>
            </div>
            <div class="progress-bg">
              <div class="progress-fill" :style="{ width: cat.percent + '%' }"></div>
            </div>
          </div>
        </ion-card-content>
      </ion-card>

      <ion-list :inset="true">
        <ion-list-header>
          <ion-label>ทั่วไป</ion-label>
        </ion-list-header>
        
        <ion-item>
          <ion-icon :icon="moon" slot="start"></ion-icon>
          <ion-label>โหมดกลางคืน (Dark Mode)</ion-label>
          <ion-toggle slot="end" @ionChange="toggleTheme" :checked="isDark"></ion-toggle>
        </ion-item>
      </ion-list>

      <ion-list :inset="true">
        <ion-list-header>
          <ion-label>จัดการข้อมูล</ion-label>
        </ion-list-header>

        <ion-item button @click="confirmReset" :detail="false">
          <ion-icon :icon="trash" slot="start" color="danger"></ion-icon>
          <ion-label color="danger">ล้างข้อมูลทั้งหมด</ion-label>
        </ion-item>
      </ion-list>
      
      <div class="version-text">
        Version 1.0.0 (Beta)
      </div>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { 
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, 
  IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent,
  IonList, IonListHeader, IonItem, IonLabel, IonIcon, IonToggle,
  alertController, toastController
} from '@ionic/vue';
import { trash, moon } from 'ionicons/icons';

import { db } from '@/firebase';
// ตัด query และ where ที่ไม่ได้ใช้ออก
import { collection, getDocs, deleteDoc, onSnapshot } from 'firebase/firestore';

// กำหนด Interface ให้ชัดเจน เพื่อแก้ Error เรื่อง Type
interface Expense {
  amount: number;
  type: string;
  category: string;
}

interface CategorySummary {
  name: string;
  total: number;
  percent: number;
}

const isDark = ref(false);
const expenses = ref<Expense[]>([]);
let unsubscribe: any = null; // ตัวแปรสำหรับปิดการเชื่อมต่อเมื่อออกจากหน้า

// --- 1. ส่วนคำนวณ Top Categories ---
const topCategories = computed<CategorySummary[]>(() => {
  // กรองเฉพาะรายจ่าย
  const expenseItems = expenses.value.filter(e => e.type === 'expense');
  const totalExpense = expenseItems.reduce((sum, item) => sum + item.amount, 0);

  if (totalExpense === 0) return [];

  // รวมเงินตามหมวดหมู่ (Grouping)
  const groups: Record<string, number> = {};
  
  expenseItems.forEach(item => {
    const cat = item.category || 'อื่นๆ';
    groups[cat] = (groups[cat] || 0) + item.amount;
  });

  // แปลงเป็น Array, เรียงลำดับ, และคำนวณ %
  return Object.keys(groups)
    .map(key => ({
      name: key,
      total: groups[key],
      percent: (groups[key] / totalExpense) * 100
    }))
    .sort((a, b) => b.total - a.total) // เรียงมากไปน้อย
    .slice(0, 5); // เอาแค่ 5 อันดับแรก
});

onMounted(() => {
  // เช็ค Theme ปัจจุบัน
  isDark.value = document.body.classList.contains('dark');

  // ดึงข้อมูล Real-time
  const expensesRef = collection(db, "expenses");
  unsubscribe = onSnapshot(expensesRef, (snapshot) => {
    expenses.value = snapshot.docs.map(doc => doc.data() as Expense);
  });
});

// เพิ่ม onUnmounted เพื่อหยุดฟังข้อมูลเมื่อเปลี่ยนหน้า (ลด Error Memory Leak)
onUnmounted(() => {
  if (unsubscribe) {
    unsubscribe();
  }
});

// --- 2. ฟังก์ชันเปลี่ยน Theme ---
const toggleTheme = (ev: any) => {
  isDark.value = ev.detail.checked;
  document.body.classList.toggle('dark', isDark.value);
};

// --- 3. ฟังก์ชันล้างข้อมูล (Reset) ---
const confirmReset = async () => {
  const alert = await alertController.create({
    header: 'ยืนยันการล้างข้อมูล',
    message: 'ข้อมูลทั้งหมดจะหายไปและกู้คืนไม่ได้ คุณแน่ใจหรือไม่?',
    buttons: [
      { text: 'ยกเลิก', role: 'cancel' },
      {
        text: 'ลบทิ้งทั้งหมด',
        role: 'destructive',
        handler: async () => {
          await deleteAllData();
        },
      },
    ],
  });
  await alert.present();
};

const deleteAllData = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "expenses"));
    const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
    
    const toast = await toastController.create({
      message: 'ล้างข้อมูลเรียบร้อยแล้ว',
      duration: 2000,
      color: 'success'
    });
    await toast.present();
  } catch (error) {
    console.error("Error clearing data:", error);
  }
};

const formatMoney = (amount: number) => {
  return new Intl.NumberFormat('th-TH').format(amount);
};
</script>

<style scoped>
/* Card สถิติ */
.analysis-card {
  margin-top: 10px;
  /* ลบ background แบบ Gradient เดิมออก เพื่อให้รองรับ Dark Mode */
  /* หรือใช้คำสั่งนี้เพื่อให้เปลี่ยนสีตามธีม: */
  background: var(--ion-card-background, #ffffff);
}

/* เพิ่ม: สั่งให้ใช้สีเข้มเมื่ออยู่ในโหมด Dark */
:global(body.dark) .analysis-card {
  background: #1c1c1d; 
}

.category-row {
  margin-bottom: 12px;
}

.cat-label {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
  font-size: 0.9em;
  font-weight: 500;
}

/* Custom Progress Bar */
.progress-bg {
  width: 100%;
  height: 8px;
  background-color: #e0e0e0; /* สีเทาอ่อน (สำหรับ Light Mode) */
  border-radius: 4px;
  overflow: hidden;
}

/* เพิ่ม: เปลี่ยนสีพื้นหลังหลอดให้เข้มขึ้นใน Dark Mode */
:global(body.dark) .progress-bg {
  background-color: #333333;
}

.progress-fill {
  height: 100%;
  background-color: #eb445a;
  border-radius: 4px;
  transition: width 0.5s ease;
}

.version-text {
  text-align: center;
  color: #ccc;
  font-size: 0.8em;
  margin-top: 20px;
}

.no-data {
  text-align: center;
  color: #999;
  padding: 20px;
}
</style>
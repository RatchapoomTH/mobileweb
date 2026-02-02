<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>รายการย้อนหลัง</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">รายการย้อนหลัง</ion-title>
        </ion-toolbar>
      </ion-header>

      <div class="summary-section ion-padding-top ion-padding-horizontal">
        <ion-card class="summary-card">
          <ion-card-content>
            <div class="balance-container">
              <span class="label">ยอดคงเหลือสุทธิ</span>
              <h1 :class="{'positive': balance >= 0, 'negative': balance < 0}">
                {{ formatMoney(balance) }}
              </h1>
            </div>
            
            <ion-grid class="ion-no-padding">
              <ion-row>
                <ion-col class="ion-text-center income-col">
                  <div class="sub-label">รายรับรวม</div>
                  <div class="sub-value income">+{{ formatMoney(totalIncome) }}</div>
                </ion-col>
                <div class="divider"></div>
                <ion-col class="ion-text-center expense-col">
                  <div class="sub-label">รายจ่ายรวม</div>
                  <div class="sub-value expense">-{{ formatMoney(totalExpense) }}</div>
                </ion-col>
              </ion-row>
            </ion-grid>
          </ion-card-content>
        </ion-card>
      </div>
      <div v-if="expenses.length === 0" class="empty-state">
        <p>ยังไม่มีรายการบันทึก</p>
      </div>

      <ion-list v-else>
        <ion-list-header>
          <ion-label>ประวัติธุรกรรม</ion-label>
        </ion-list-header>

        <ion-item 
          v-for="item in expenses" 
          :key="item.id" 
          button 
          @click="presentActionSheet(item)"
        >
          <ion-icon 
            slot="start" 
            :icon="item.type === 'income' ? arrowUpCircle : arrowDownCircle"
            :color="item.type === 'income' ? 'success' : 'danger'">
          </ion-icon>

          <ion-label>
            <h2>{{ item.title }}</h2>
            <p>{{ item.category }} | {{ formatDate(item.createdAt) }}</p>
            <p v-if="item.note" style="font-size: 0.8em; color: gray;">{{ item.note }}</p>
          </ion-label>

          <ion-note slot="end" :color="item.type === 'income' ? 'success' : 'danger'" class="amount-text">
            {{ item.type === 'income' ? '+' : '-' }} {{ formatMoney(item.amount) }}
          </ion-note>
        </ion-item>
      </ion-list>

      <ion-modal :is-open="isModalOpen" @didDismiss="isModalOpen = false">
        <ion-header>
          <ion-toolbar>
            <ion-title>แก้ไขรายการ</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="isModalOpen = false">ปิด</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
          <ion-item>
            <ion-input label="ชื่อรายการ" label-placement="floating" v-model="editingItem.title"></ion-input>
          </ion-item>
          <ion-item>
            <ion-input label="จำนวนเงิน" type="number" label-placement="floating" v-model="editingItem.amount"></ion-input>
          </ion-item>
          <ion-item>
            <ion-select label="ประเภท" label-placement="floating" v-model="editingItem.type">
              <ion-select-option value="income">รายรับ</ion-select-option>
              <ion-select-option value="expense">รายจ่าย</ion-select-option>
            </ion-select>
          </ion-item>
          <ion-item>
            <ion-input label="หมวดหมู่" label-placement="floating" v-model="editingItem.category"></ion-input>
          </ion-item>
          <ion-item>
            <ion-textarea label="หมายเหตุ" label-placement="floating" v-model="editingItem.note"></ion-textarea>
          </ion-item>
          
          <ion-button expand="block" class="ion-margin-top" @click="updateExpense">
            บันทึกการแก้ไข
          </ion-button>
        </ion-content>
      </ion-modal>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'; // เพิ่ม computed เข้ามา
import { 
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, 
  IonList, IonItem, IonLabel, IonNote, IonIcon, IonListHeader,
  IonModal, IonButton, IonButtons, IonInput, IonSelect, IonSelectOption, IonTextarea,
  IonCard, IonCardContent, IonGrid, IonRow, IonCol, // เพิ่ม component สำหรับ Card
  actionSheetController, alertController, toastController
} from '@ionic/vue';
import { arrowUpCircle, arrowDownCircle, trash, create, close } from 'ionicons/icons';

import { db } from '@/firebase';
import { collection, query, orderBy, onSnapshot, doc, deleteDoc, updateDoc, Timestamp } from 'firebase/firestore';

interface Expense {
  id: string;
  title: string;
  amount: number;
  type: string;
  category: string;
  note: string;
  createdAt: Timestamp;
}

const expenses = ref<Expense[]>([]);
let unsubscribe: any = null;

const isModalOpen = ref(false);
const editingItem = ref<Partial<Expense>>({});

// --- ส่วนคำนวณยอดเงิน (Computed Properties) ---
const totalIncome = computed(() => {
  return expenses.value
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
});

const totalExpense = computed(() => {
  return expenses.value
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
});

const balance = computed(() => {
  return totalIncome.value - totalExpense.value;
});
// ------------------------------------------

onMounted(() => {
  const q = query(collection(db, "expenses"), orderBy("createdAt", "desc"));
  unsubscribe = onSnapshot(q, (snapshot) => {
    expenses.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Expense));
  });
});

onUnmounted(() => {
  if (unsubscribe) unsubscribe();
});

// Action Sheet, Edit, Delete Functions (เหมือนเดิม)
const presentActionSheet = async (item: Expense) => {
  const actionSheet = await actionSheetController.create({
    header: 'จัดการรายการ',
    buttons: [
      {
        text: 'แก้ไข',
        icon: create,
        handler: () => { openEditModal(item); },
      },
      {
        text: 'ลบรายการ',
        role: 'destructive',
        icon: trash,
        handler: () => { confirmDelete(item.id); },
      },
      { text: 'ยกเลิก', icon: close, role: 'cancel' },
    ],
  });
  await actionSheet.present();
};

const confirmDelete = async (id: string) => {
  const alert = await alertController.create({
    header: 'ยืนยันการลบ',
    message: 'คุณต้องการลบรายการนี้ใช่ไหม?',
    buttons: [
      { text: 'ยกเลิก', role: 'cancel' },
      {
        text: 'ลบ',
        role: 'destructive',
        handler: async () => {
          await deleteDoc(doc(db, "expenses", id));
          showToast('ลบรายการเรียบร้อยแล้ว');
        },
      },
    ],
  });
  await alert.present();
};

const openEditModal = (item: Expense) => {
  editingItem.value = { ...item };
  isModalOpen.value = true;
};

const updateExpense = async () => {
  if (!editingItem.value.id) return;
  try {
    const expenseRef = doc(db, "expenses", editingItem.value.id);
    await updateDoc(expenseRef, {
      title: editingItem.value.title,
      amount: Number(editingItem.value.amount),
      type: editingItem.value.type,
      category: editingItem.value.category,
      note: editingItem.value.note
    });
    isModalOpen.value = false;
    showToast('แก้ไขข้อมูลสำเร็จ');
  } catch (error) {
    console.error("Update error:", error);
  }
};

const showToast = async (msg: string) => {
  const toast = await toastController.create({
    message: msg,
    duration: 2000,
    position: 'bottom'
  });
  await toast.present();
};

const formatDate = (timestamp: any) => {
  if (!timestamp) return "";
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return new Intl.DateTimeFormat('th-TH', { 
    day: 'numeric', month: 'short', year: '2-digit', hour: '2-digit', minute:'2-digit'
  }).format(date);
};

const formatMoney = (amount: number) => {
  return new Intl.NumberFormat('th-TH', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  }).format(amount);
};
</script>

<style scoped>
/* สไตล์สำหรับส่วนสรุปยอด */
.summary-card {
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  margin-bottom: 0;
  /* ลบ Gradient สีขาวเดิมออก */
  background: var(--ion-card-background, #ffffff);
}

/* เพิ่ม: ให้เป็นสีดำเมื่ออยู่ใน Dark Mode */
:global(body.dark) .summary-card {
  background: #1c1c1d;
}

.balance-container {
  text-align: center;
  margin-bottom: 15px;
}

/* ... (โค้ด CSS ส่วนอื่นๆ คงเดิม) ... */
.balance-container .label { font-size: 0.9em; color: #666; }
/* ถ้าตัวหนังสือ "ยอดคงเหลือสุทธิ" มองไม่เห็นใน Dark Mode ให้เพิ่มตัวนี้: */
:global(body.dark) .balance-container .label { color: #aaa; }

.balance-container h1 { font-size: 2.5em; margin: 5px 0; font-weight: 800; }
.positive { color: #2dd36f; }
.negative { color: #eb445a; }
.sub-label { font-size: 0.8em; color: #888; margin-bottom: 4px; }
.sub-value { font-weight: bold; font-size: 1.1em; }
.income { color: #2dd36f; }
.expense { color: #eb445a; }
.divider { width: 1px; background-color: #ddd; margin: 0 10px; }
/* ปรับสีเส้นคั่นใน Dark Mode */
:global(body.dark) .divider { background-color: #333; }

.empty-state { text-align: center; margin-top: 50px; color: #888; }
.amount-text { font-weight: bold; font-size: 1.1em; }
</style>
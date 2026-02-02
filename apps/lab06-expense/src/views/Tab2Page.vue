<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>เพิ่มรายการรายรับ–รายจ่าย</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-item>
        <ion-input 
          label="ชื่อรายการ" 
          label-placement="floating" 
          v-model="title" 
          placeholder="ระบุชื่อรายการ">
        </ion-input>
      </ion-item>

      <ion-item>
        <ion-input
          label="จำนวนเงิน"
          label-placement="floating"
          type="number"
          v-model="amount"
          placeholder="0.00">
        </ion-input>
      </ion-item>

      <ion-item>
        <ion-select label="ประเภท" label-placement="floating" v-model="type">
          <ion-select-option value="income">รายรับ</ion-select-option>
          <ion-select-option value="expense">รายจ่าย</ion-select-option>
        </ion-select>
      </ion-item>

      <ion-item>
        <ion-input 
          label="หมวดหมู่" 
          label-placement="floating" 
          v-model="category"
          placeholder="เช่น อาหาร, เดินทาง">
        </ion-input>
      </ion-item>

      <ion-item>
        <ion-textarea 
          label="หมายเหตุ" 
          label-placement="floating" 
          v-model="note"
          :rows="3">
        </ion-textarea>
      </ion-item>

      <ion-button expand="block" class="ion-margin-top" @click="saveExpense">
        บันทึกข้อมูล
      </ion-button>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
// --- ส่วนสำคัญที่ต้องเพิ่ม ---
import { 
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, 
  IonInput, IonSelect, IonSelectOption, IonTextarea, 
  IonButton, IonItem 
} from '@ionic/vue';
// -------------------------
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/firebase";

const router = useRouter();

const title = ref("");
const amount = ref<number | null>(null); // ปรับเป็น null เริ่มต้นจะได้ไม่ขึ้นเลข 0 ค้างไว้
const type = ref("expense");
const category = ref("");
const note = ref("");

const saveExpense = async () => {
  // เช็คข้อมูลก่อนบันทึก (Validation)
  if (!title.value || !amount.value) {
    alert("กรุณากรอกชื่อรายการและจำนวนเงิน");
    return;
  }

  try {
    await addDoc(collection(db, "expenses"), {
      title: title.value,
      amount: Number(amount.value),
      type: type.value,
      category: category.value,
      note: note.value,
      createdAt: new Date()
    });
    
    console.log("บันทึกสำเร็จ!");
    // เคลียร์ค่า หรือ เปลี่ยนหน้า
    router.push("/tabs/list"); // ตรวจสอบว่า path นี้ถูกต้อง
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};
</script>
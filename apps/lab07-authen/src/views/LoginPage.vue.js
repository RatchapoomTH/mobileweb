/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { authService } from '@/auth/auth-service';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem, IonInput, IonButton } from '@ionic/vue';
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
        }
        catch (e) {
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
    }
    catch (err) {
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
    }
    catch (err) {
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
    if (!phoneNumber)
        return;
    try {
        // Step 1: ขอ OTP
        const { verificationId } = await authService.startPhoneLogin({
            phoneNumberE164: phoneNumber
        });
        // Step 2: กรอก OTP
        const otp = prompt("กรุณากรอกรหัส OTP ที่ได้รับทาง SMS");
        if (!otp)
            return;
        // Step 3: ยืนยัน
        await authService.confirmPhoneCode({
            verificationId,
            verificationCode: otp
        });
        // Step 4: อัปเดตชื่อ
        await updateProfileName();
        router.push('/tabs/tab1');
    }
    catch (err) {
        console.error(err);
        alert("Phone Login Error: " + (err.message || err));
    }
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
const __VLS_0 = {}.IonPage;
/** @type {[typeof __VLS_components.IonPage, typeof __VLS_components.ionPage, typeof __VLS_components.IonPage, typeof __VLS_components.ionPage, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({}));
const __VLS_2 = __VLS_1({}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_4 = {};
__VLS_3.slots.default;
const __VLS_5 = {}.IonHeader;
/** @type {[typeof __VLS_components.IonHeader, typeof __VLS_components.ionHeader, typeof __VLS_components.IonHeader, typeof __VLS_components.ionHeader, ]} */ ;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({}));
const __VLS_7 = __VLS_6({}, ...__VLS_functionalComponentArgsRest(__VLS_6));
__VLS_8.slots.default;
const __VLS_9 = {}.IonToolbar;
/** @type {[typeof __VLS_components.IonToolbar, typeof __VLS_components.ionToolbar, typeof __VLS_components.IonToolbar, typeof __VLS_components.ionToolbar, ]} */ ;
// @ts-ignore
const __VLS_10 = __VLS_asFunctionalComponent(__VLS_9, new __VLS_9({}));
const __VLS_11 = __VLS_10({}, ...__VLS_functionalComponentArgsRest(__VLS_10));
__VLS_12.slots.default;
const __VLS_13 = {}.IonTitle;
/** @type {[typeof __VLS_components.IonTitle, typeof __VLS_components.ionTitle, typeof __VLS_components.IonTitle, typeof __VLS_components.ionTitle, ]} */ ;
// @ts-ignore
const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({}));
const __VLS_15 = __VLS_14({}, ...__VLS_functionalComponentArgsRest(__VLS_14));
__VLS_16.slots.default;
var __VLS_16;
var __VLS_12;
var __VLS_8;
const __VLS_17 = {}.IonContent;
/** @type {[typeof __VLS_components.IonContent, typeof __VLS_components.ionContent, typeof __VLS_components.IonContent, typeof __VLS_components.ionContent, ]} */ ;
// @ts-ignore
const __VLS_18 = __VLS_asFunctionalComponent(__VLS_17, new __VLS_17({
    ...{ class: "ion-padding" },
}));
const __VLS_19 = __VLS_18({
    ...{ class: "ion-padding" },
}, ...__VLS_functionalComponentArgsRest(__VLS_18));
__VLS_20.slots.default;
const __VLS_21 = {}.IonCard;
/** @type {[typeof __VLS_components.IonCard, typeof __VLS_components.ionCard, typeof __VLS_components.IonCard, typeof __VLS_components.ionCard, ]} */ ;
// @ts-ignore
const __VLS_22 = __VLS_asFunctionalComponent(__VLS_21, new __VLS_21({}));
const __VLS_23 = __VLS_22({}, ...__VLS_functionalComponentArgsRest(__VLS_22));
__VLS_24.slots.default;
const __VLS_25 = {}.IonCardHeader;
/** @type {[typeof __VLS_components.IonCardHeader, typeof __VLS_components.ionCardHeader, typeof __VLS_components.IonCardHeader, typeof __VLS_components.ionCardHeader, ]} */ ;
// @ts-ignore
const __VLS_26 = __VLS_asFunctionalComponent(__VLS_25, new __VLS_25({}));
const __VLS_27 = __VLS_26({}, ...__VLS_functionalComponentArgsRest(__VLS_26));
__VLS_28.slots.default;
const __VLS_29 = {}.IonCardTitle;
/** @type {[typeof __VLS_components.IonCardTitle, typeof __VLS_components.ionCardTitle, typeof __VLS_components.IonCardTitle, typeof __VLS_components.ionCardTitle, ]} */ ;
// @ts-ignore
const __VLS_30 = __VLS_asFunctionalComponent(__VLS_29, new __VLS_29({}));
const __VLS_31 = __VLS_30({}, ...__VLS_functionalComponentArgsRest(__VLS_30));
__VLS_32.slots.default;
var __VLS_32;
var __VLS_28;
const __VLS_33 = {}.IonCardContent;
/** @type {[typeof __VLS_components.IonCardContent, typeof __VLS_components.ionCardContent, typeof __VLS_components.IonCardContent, typeof __VLS_components.ionCardContent, ]} */ ;
// @ts-ignore
const __VLS_34 = __VLS_asFunctionalComponent(__VLS_33, new __VLS_33({}));
const __VLS_35 = __VLS_34({}, ...__VLS_functionalComponentArgsRest(__VLS_34));
__VLS_36.slots.default;
const __VLS_37 = {}.IonItem;
/** @type {[typeof __VLS_components.IonItem, typeof __VLS_components.ionItem, typeof __VLS_components.IonItem, typeof __VLS_components.ionItem, ]} */ ;
// @ts-ignore
const __VLS_38 = __VLS_asFunctionalComponent(__VLS_37, new __VLS_37({
    ...{ class: "ion-margin-bottom" },
}));
const __VLS_39 = __VLS_38({
    ...{ class: "ion-margin-bottom" },
}, ...__VLS_functionalComponentArgsRest(__VLS_38));
__VLS_40.slots.default;
const __VLS_41 = {}.IonInput;
/** @type {[typeof __VLS_components.IonInput, typeof __VLS_components.ionInput, typeof __VLS_components.IonInput, typeof __VLS_components.ionInput, ]} */ ;
// @ts-ignore
const __VLS_42 = __VLS_asFunctionalComponent(__VLS_41, new __VLS_41({
    label: "Display Name (ชื่อที่ต้องการแสดง)",
    labelPlacement: "stacked",
    placeholder: "กรอกชื่อของคุณที่นี่...",
    modelValue: (__VLS_ctx.displayName),
}));
const __VLS_43 = __VLS_42({
    label: "Display Name (ชื่อที่ต้องการแสดง)",
    labelPlacement: "stacked",
    placeholder: "กรอกชื่อของคุณที่นี่...",
    modelValue: (__VLS_ctx.displayName),
}, ...__VLS_functionalComponentArgsRest(__VLS_42));
var __VLS_40;
__VLS_asFunctionalElement(__VLS_intrinsicElements.hr, __VLS_intrinsicElements.hr)({
    ...{ style: {} },
});
const __VLS_45 = {}.IonItem;
/** @type {[typeof __VLS_components.IonItem, typeof __VLS_components.ionItem, typeof __VLS_components.IonItem, typeof __VLS_components.ionItem, ]} */ ;
// @ts-ignore
const __VLS_46 = __VLS_asFunctionalComponent(__VLS_45, new __VLS_45({}));
const __VLS_47 = __VLS_46({}, ...__VLS_functionalComponentArgsRest(__VLS_46));
__VLS_48.slots.default;
const __VLS_49 = {}.IonInput;
/** @type {[typeof __VLS_components.IonInput, typeof __VLS_components.ionInput, typeof __VLS_components.IonInput, typeof __VLS_components.ionInput, ]} */ ;
// @ts-ignore
const __VLS_50 = __VLS_asFunctionalComponent(__VLS_49, new __VLS_49({
    label: "Email",
    labelPlacement: "stacked",
    type: "email",
    placeholder: "email@domain.com",
    modelValue: (__VLS_ctx.email),
}));
const __VLS_51 = __VLS_50({
    label: "Email",
    labelPlacement: "stacked",
    type: "email",
    placeholder: "email@domain.com",
    modelValue: (__VLS_ctx.email),
}, ...__VLS_functionalComponentArgsRest(__VLS_50));
var __VLS_48;
const __VLS_53 = {}.IonItem;
/** @type {[typeof __VLS_components.IonItem, typeof __VLS_components.ionItem, typeof __VLS_components.IonItem, typeof __VLS_components.ionItem, ]} */ ;
// @ts-ignore
const __VLS_54 = __VLS_asFunctionalComponent(__VLS_53, new __VLS_53({}));
const __VLS_55 = __VLS_54({}, ...__VLS_functionalComponentArgsRest(__VLS_54));
__VLS_56.slots.default;
const __VLS_57 = {}.IonInput;
/** @type {[typeof __VLS_components.IonInput, typeof __VLS_components.ionInput, typeof __VLS_components.IonInput, typeof __VLS_components.ionInput, ]} */ ;
// @ts-ignore
const __VLS_58 = __VLS_asFunctionalComponent(__VLS_57, new __VLS_57({
    label: "Password",
    labelPlacement: "stacked",
    type: "password",
    modelValue: (__VLS_ctx.password),
}));
const __VLS_59 = __VLS_58({
    label: "Password",
    labelPlacement: "stacked",
    type: "password",
    modelValue: (__VLS_ctx.password),
}, ...__VLS_functionalComponentArgsRest(__VLS_58));
var __VLS_56;
const __VLS_61 = {}.IonButton;
/** @type {[typeof __VLS_components.IonButton, typeof __VLS_components.ionButton, typeof __VLS_components.IonButton, typeof __VLS_components.ionButton, ]} */ ;
// @ts-ignore
const __VLS_62 = __VLS_asFunctionalComponent(__VLS_61, new __VLS_61({
    ...{ 'onClick': {} },
    expand: "block",
    ...{ class: "ion-margin-top" },
}));
const __VLS_63 = __VLS_62({
    ...{ 'onClick': {} },
    expand: "block",
    ...{ class: "ion-margin-top" },
}, ...__VLS_functionalComponentArgsRest(__VLS_62));
let __VLS_65;
let __VLS_66;
let __VLS_67;
const __VLS_68 = {
    onClick: (__VLS_ctx.handleLoginEmail)
};
__VLS_64.slots.default;
var __VLS_64;
const __VLS_69 = {}.IonButton;
/** @type {[typeof __VLS_components.IonButton, typeof __VLS_components.ionButton, typeof __VLS_components.IonButton, typeof __VLS_components.ionButton, ]} */ ;
// @ts-ignore
const __VLS_70 = __VLS_asFunctionalComponent(__VLS_69, new __VLS_69({
    ...{ 'onClick': {} },
    expand: "block",
    color: "tertiary",
}));
const __VLS_71 = __VLS_70({
    ...{ 'onClick': {} },
    expand: "block",
    color: "tertiary",
}, ...__VLS_functionalComponentArgsRest(__VLS_70));
let __VLS_73;
let __VLS_74;
let __VLS_75;
const __VLS_76 = {
    onClick: (__VLS_ctx.handleLoginGoogle)
};
__VLS_72.slots.default;
var __VLS_72;
const __VLS_77 = {}.IonButton;
/** @type {[typeof __VLS_components.IonButton, typeof __VLS_components.ionButton, typeof __VLS_components.IonButton, typeof __VLS_components.ionButton, ]} */ ;
// @ts-ignore
const __VLS_78 = __VLS_asFunctionalComponent(__VLS_77, new __VLS_77({
    ...{ 'onClick': {} },
    expand: "block",
    color: "secondary",
}));
const __VLS_79 = __VLS_78({
    ...{ 'onClick': {} },
    expand: "block",
    color: "secondary",
}, ...__VLS_functionalComponentArgsRest(__VLS_78));
let __VLS_81;
let __VLS_82;
let __VLS_83;
const __VLS_84 = {
    onClick: (__VLS_ctx.handleLoginPhone)
};
__VLS_80.slots.default;
var __VLS_80;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    id: "recaptcha-container",
    ...{ style: {} },
});
var __VLS_36;
var __VLS_24;
var __VLS_20;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['ion-padding']} */ ;
/** @type {__VLS_StyleScopedClasses['ion-margin-bottom']} */ ;
/** @type {__VLS_StyleScopedClasses['ion-margin-top']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            IonPage: IonPage,
            IonHeader: IonHeader,
            IonToolbar: IonToolbar,
            IonTitle: IonTitle,
            IonContent: IonContent,
            IonCard: IonCard,
            IonCardHeader: IonCardHeader,
            IonCardTitle: IonCardTitle,
            IonCardContent: IonCardContent,
            IonItem: IonItem,
            IonInput: IonInput,
            IonButton: IonButton,
            displayName: displayName,
            email: email,
            password: password,
            handleLoginEmail: handleLoginEmail,
            handleLoginGoogle: handleLoginGoogle,
            handleLoginPhone: handleLoginPhone,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */

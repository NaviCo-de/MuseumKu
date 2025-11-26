import { getApp, getApps, initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence, browserLocalPersistence, getAuth } from "firebase/auth";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore, initializeFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { Platform } from "react-native";

const firebaseConfig = {
  apiKey: "AIzaSyARXcfJvF4jssUs2Sm0b0hmIjzx876pnVM",
  authDomain: "museumku-1baf8.firebaseapp.com",
  projectId: "museumku-1baf8",
  storageBucket: "museumku-1baf8.firebasestorage.app",
  messagingSenderId: "850646870652",
  appId: "1:850646870652:web:59d22fe7ede7a11a09b7f9",
  measurementId: "G-QDGBWZCFN9"
};

// Reuse instance kalau sudah pernah di-initialize (menghindari error saat Fast Refresh)
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// --- LOGIKA CERDAS DI SINI ---
let authPersistence;

if (Platform.OS === 'web') {
  // Kalau lagi dibuka di Browser/Laptop, pakai ini:
  authPersistence = browserLocalPersistence;
} else {
  authPersistence = getReactNativePersistence(ReactNativeAsyncStorage);
}

export const auth = (() => {
  try {
    return initializeAuth(app, { persistence: authPersistence });
  } catch (error) {
    // Kalau auth sudah pernah dibuat (mis. karena Fast Refresh), ambil instance yang ada
    return getAuth(app);
  }
})();

// Pakai auto detect long polling supaya Firestore tidak macet di React Native
export const db = (() => {
  try {
    return initializeFirestore(app, { experimentalAutoDetectLongPolling: true });
  } catch (error) {
    return getFirestore(app);
  }
})();
export const storage = getStorage(app);

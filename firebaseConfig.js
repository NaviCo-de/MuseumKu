import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence, browserLocalPersistence } from "firebase/auth";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { Platform } from "react-native"; // <--- Import Platform buat cek OS

const firebaseConfig = {
  apiKey: "AIzaSyARXcfJvF4jssUs2Sm0b0hmIjzx876pnVM",
  authDomain: "museumku-1baf8.firebaseapp.com",
  projectId: "museumku-1baf8",
  storageBucket: "museumku-1baf8.firebasestorage.app",
  messagingSenderId: "850646870652",
  appId: "1:850646870652:web:59d22fe7ede7a11a09b7f9",
  measurementId: "G-QDGBWZCFN9"
};

const app = initializeApp(firebaseConfig);

// --- LOGIKA CERDAS DI SINI ---
let authPersistence;

if (Platform.OS === 'web') {
  // Kalau lagi dibuka di Browser/Laptop, pakai ini:
  authPersistence = browserLocalPersistence;
} else {
  // Kalau lagi dibuka di HP (Android/iOS), pakai AsyncStorage:
  authPersistence = getReactNativePersistence(ReactNativeAsyncStorage);
}

export const auth = initializeAuth(app, {
  persistence: authPersistence
});

export const db = getFirestore(app);
export const storage = getStorage(app);
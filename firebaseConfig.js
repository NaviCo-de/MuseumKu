import { initializeApp } from "firebase/app";
// 1. Ganti import getAuth biasa dengan yang lebih canggih ini
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyARXcfJvF4jssUs2Sm0b0hmIjzx876pnVM",
  authDomain: "museumku-1baf8.firebaseapp.com",
  projectId: "museumku-1baf8",
  storageBucket: "museumku-1baf8.firebasestorage.app",
  messagingSenderId: "850646870652",
  appId: "1:850646870652:web:59d22fe7ede7a11a09b7f9",
  measurementId: "G-QDGBWZCFN9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// 2. JANGAN PAKE 'getAuth(app)' BIASA.
// Gunakan initializeAuth dengan settingan AsyncStorage biar login gak ilang saat app ditutup.
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

// 3. Hapus Analytics. Itu sering bikin error di React Native Expo Go.
// const analytics = getAnalytics(app); <--- BUANG INI

export const db = getFirestore(app);
export const storage = getStorage(app);
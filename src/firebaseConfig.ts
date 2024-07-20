// src/firebaseConfig.ts
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase 구성 객체
const firebaseConfig = {
  apiKey: 'AIzaSyBdTPXgRfRxfgHspv4teLhY2Ueor1D38c0',
  authDomain: 'loginimplement-8e324.firebaseapp.com',
  projectId: 'loginimplement-8e324',
  storageBucket: 'loginimplement-8e324.appspot.com',
  messagingSenderId: '710538217051',
  appId: '1:710538217051:web:2cdbfe3a70d2776bf1a17e',
  measurementId: 'G-GJ6L6KHKR6',
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);

// Analytics 초기화
const analytics = getAnalytics(app);

// 인증, Firestore, Storage 서비스 초기화
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);

export { app, analytics, auth, firestore, storage };

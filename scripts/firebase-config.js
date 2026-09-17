import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyDQAyEObHa0WdEs_jO50CSkMAOw8iFuDCo",
    authDomain: "vanity-app-da95a.firebaseapp.com",
    projectId: "vanity-app-da95a",
    storageBucket: "vanity-app-da95a.firebasestorage.app",
    messagingSenderId: "549198840567",
    appId: "1:549198840567:web:b62d0397a77037613c89f2"
  };

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);
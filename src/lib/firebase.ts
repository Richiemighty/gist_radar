import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";  // ✅ You need to import getAuth
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


// Your Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyDlWNd9XJoqb_XUMO7pCZ4DMRiQNTyu-G0",
    authDomain: "gistradar-c85c6.firebaseapp.com",
    projectId: "gistradar-c85c6",
    storageBucket: "gistradar-c85c6.appspot.com",  // ✅ Fix typo: should be .appspot.com
    //   storageBucket: "gistradar-c85c6.firebasestorage.app",
    messagingSenderId: "868142702699",
    appId: "1:868142702699:web:b81a4d370f16857f19512e",
    measurementId: "G-MLZ6Z48JVM"
};

// Initialize Firebase ap
const app = initializeApp(firebaseConfig);

// ✅ Add and export auth instance
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// (Optional) Export analytics if you're using it
// export const analytics = getAnalytics(app);

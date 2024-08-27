// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDfmTE1_TwH8-oq_DWMttob0bD2urwyWOI",
    authDomain: "ficonnect.firebaseapp.com",
    projectId: "ficonnect",
    storageBucket: "ficonnect.appspot.com",
    messagingSenderId: "1096349556369",
    appId: "1:1096349556369:web:e9efb4093cc3fe0ce2a930",
    measurementId: "G-V0MMH5VNTZ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

export { auth, firestore };
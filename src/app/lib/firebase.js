// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAmjoD2JiW19kumdwMO_yFRPCYMnJCzzRw",
    authDomain: "rafconsolestudio-f27bb.firebaseapp.com",
    projectId: "rafconsolestudio-f27bb",
    storageBucket: "rafconsolestudio-f27bb.firebasestorage.app",
    messagingSenderId: "243191212",
    appId: "1:243191212:web:4481e88e9c2df856fe3e09",
    measurementId: "G-B8H61V5CHB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
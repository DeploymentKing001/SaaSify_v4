import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
    apiKey: "AIzaSyB89nIW7OOsUmfYaxsnbe-zSmH93f6sLlI",
    authDomain: "saasify-aa525.firebaseapp.com",
    projectId: "saasify-aa525",
    storageBucket: "saasify-aa525.appspot.com",
    messagingSenderId: "850520142818",
    appId: "1:850520142818:web:1d15b5c380da3292a0ffbb",
    measurementId: "G-L9JWWVYZJK"
  };
  
export const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

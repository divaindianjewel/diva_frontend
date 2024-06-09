// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAH7y1n5SGP0os5Iu2F3vAQGX1mJK409wU",
  authDomain: "otp-test-4f683.firebaseapp.com",
  projectId: "otp-test-4f683",
  storageBucket: "otp-test-4f683.appspot.com",
  messagingSenderId: "168179710210",
  appId: "1:168179710210:web:8b5744f854c9a4d8ed2a1b",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
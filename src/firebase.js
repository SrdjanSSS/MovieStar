import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAHng4-diVaibA6Lyu1yFbehX8K3QVVB38",
  authDomain: "moviestar-5f2e1.firebaseapp.com",
  projectId: "moviestar-5f2e1",
  storageBucket: "moviestar-5f2e1.appspot.com",
  messagingSenderId: "145001290676",
  appId: "1:145001290676:web:452175a21324a4e628b0e1",
  measurementId: "G-NJCSRVKSEG",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };

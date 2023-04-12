import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyCxFQEVhVcKQSUGeqa5Ifda7Z4B3fCk5Mg",
  authDomain: "tarefasplus-884bd.firebaseapp.com",
  projectId: "tarefasplus-884bd",
  storageBucket: "tarefasplus-884bd.appspot.com",
  messagingSenderId: "274367892778",
  appId: "1:274367892778:web:4f2f4101edf8b5eb4a6253"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export {db};
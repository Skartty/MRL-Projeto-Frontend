import { db } from "./firebase_config.js";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

export async function BuscarClientePorEmail(email) {
  const q = query(collection(db, "Cliente"), where("email", "==", email));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    console.warn("Cliente não encontrado para o e-mail:", email);
    return null;
  }

  const docSnap = snapshot.docs[0];
  return { id: docSnap.id, ...docSnap.data() };
}

export async function BuscarClientePorId(uid) {
  const docRef = doc(db, "Cliente", uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) return { id: docSnap.id, ...docSnap.data() };
  else return null;
}

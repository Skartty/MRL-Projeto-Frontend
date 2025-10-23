import { db } from "./firebase_config.js";
import {
  doc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { encryptPassword } from "./Criptografia.js";

export async function AtualizarCliente(clienteId, novosDados) {
  try {
    const clienteRef = doc(db, "Cliente", clienteId);

    if (novosDados.senha) {
      novosDados.senhaHash = await encryptPassword(
        novosDados.senha,
        "mrl-site-teste-secret"
      );
      delete novosDados.senha;
    }

    await updateDoc(clienteRef, novosDados);

    console.log("✅ Cliente atualizado com sucesso!");
    return true;
  } catch (error) {
    console.error("Erro ao atualizar cliente:", error);
    throw error;
  }
}

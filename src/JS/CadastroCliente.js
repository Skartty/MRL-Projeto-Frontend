import { db } from "./firebase_config.js";
import {
  collection,
  addDoc,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { encryptPassword } from "./Criptografia.js";

async function CadastrarCliente(cliente) {
  const encryptPass = await encryptPassword(cliente.senha, "mrl-site-teste-secret");

  const clienteRef = await addDoc(collection(db, "Cliente"), {
    nome: cliente.nome,
    email: cliente.email,
    cpfCnpj: cliente.cpfCnpj,
    telefone: cliente.telefone,
    senhaHash: encryptPass,
  });

  return clienteRef.id;
}

function validarFormulario(cliente) {
  if (!cliente.nome?.trim()) return "Preencha o nome.";
  if (!cliente.email?.trim()) return "Preencha o e-mail.";
  if (!cliente.cpfCnpj?.trim()) return "Preencha o CPF/CNPJ.";
  if (!cliente.telefone?.trim()) return "Preencha o telefone.";
  if (!cliente.senha?.trim()) return "Preencha a senha.";
  if (!cliente.confirmarSenha?.trim()) return "Confirme a senha.";
  if (cliente.senha !== cliente.confirmarSenha)
    return "As senhas não conferem.";
  return null;
}

document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ Script de cadastro carregado!");
  const form = document.getElementById("formCadastro");

  if (!form) {
    console.error("⚠️ Formulário não encontrado!");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("🟢 Evento submit acionado");

    const cliente = {
      nome: form.querySelector('[name="nome"]').value,
      email: form.querySelector('[name="email"]').value,
      cpfCnpj: form.querySelector('[name="cpfCnpj"]').value,
      telefone: form.querySelector('[name="telefone"]').value,
      senha: form.querySelector('[name="senha"]').value,
      confirmarSenha: form.querySelector('[name="confirmarSenha"]').value,
    };

    console.log("Dados capturados:", cliente);

    const erro = validarFormulario(cliente);
    if (erro) {
      alert(erro);
      return;
    }

    try {
      const idGerado = await CadastrarCliente(cliente);
      console.log("Cliente salvo com ID:", idGerado);
      alert("✅ Cadastro realizado com sucesso!");
      form.reset();
    } catch (err) {
      console.error("❌ Erro ao cadastrar:", err);
      alert("Erro ao cadastrar. Verifique o console.");
    }
  });
});

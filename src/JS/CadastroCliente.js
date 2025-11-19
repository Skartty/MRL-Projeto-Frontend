import { db } from "./firebase_config.js";
import {
  doc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { encryptPassword } from "./Criptografia.js";
import { criarUsuarioAuthEmailSenha } from "./Auth.js";

async function CadastrarCliente(cliente) {
  
  const userId = await criarUsuarioAuthEmailSenha(cliente.email, cliente.senha);
  
  if (!userId) return;

  const encryptPass = await encryptPassword(cliente.senha, "mrl-site-teste-secret");

  const clienteRef = doc(db, "Cliente", userId)

  await setDoc(clienteRef, {
    idAuth: userId,
    nome: cliente.nome,
    email: cliente.email,
    cpfCnpj: cliente.cpfCnpj,
    telefone: cliente.telefone,
    senhaHash: encryptPass,
    admin: false, 
  });

  return userId;
}

function validarFormulario(cliente) {
  if (!cliente.nome?.trim()) return "Preencha o nome.";
  if (!cliente.email?.trim()) return "Preencha o e-mail.";

  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailValido.test(cliente.email)) return "Digite um e-mail válido.";

  if (!cliente.cpfCnpj?.trim()) return "Preencha o CPF/CNPJ.";

  const cpfCnpjLimpo = cliente.cpfCnpj.replace(/\D/g, "");
  if (cpfCnpjLimpo.length !== 11 && cpfCnpjLimpo.length !== 14)
    return "CPF deve ter 11 dígitos ou CNPJ deve ter 14 dígitos.";

  if (!cliente.telefone?.trim()) return "Preencha o telefone.";

  const telefoneLimpo = cliente.telefone.replace(/\D/g, "");
  if (telefoneLimpo.length < 10)
    return "Telefone inválido. Informe DDD e número (mínimo 10 dígitos).";

  if (!cliente.senha?.trim()) return "Preencha a senha.";
  if (!cliente.confirmarSenha?.trim()) return "Confirme a senha.";
  
  if (cliente.senha.length < 6)
    return "A senha deve ter pelo menos 6 caracteres.";

  if (cliente.senha !== cliente.confirmarSenha)
    return "As senhas não conferem.";

  return null;
}

document.addEventListener("DOMContentLoaded", () => {
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

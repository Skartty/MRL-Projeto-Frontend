import { auth } from "./firebase_config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { BuscarClientePorEmail } from "./BuscaCliente.js";
import { AtualizarCliente } from "./AtualizaCliente.js";
import { decryptPassword } from "./Criptografia.js";

let clienteAtual = null;
let clienteId = null;

document.addEventListener("DOMContentLoaded", () => {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      alert("Usuário autenticado:", user.email);
      alert("UID do usuário:", user);
      await carregarPerfil(user.uid);
    } else {
      console.warn("Nenhum usuário autenticado. Redirecionando...");
      window.location.href = "/screens/Home/Login.html";
    }
  });
});

async function carregarPerfil(uid) {
  try {
    // const cliente = await BuscarClientePorEmail(email);
    const cliente = await BuscarClientePorId(uid);
    console.log("📄 Resultado do cliente:", cliente);
    alert("Dados do cliente carregados:", cliente);
    if (!cliente) {
      alert("Cliente não encontrado!");
      return;
    }

    clienteAtual = cliente;
    clienteId = cliente.id;

    document.getElementById("perfilNome").value = cliente.nome || "";
    document.getElementById("perfilEmail").value = cliente.email || "";
    document.getElementById("perfilCpfCnpj").value = cliente.cpfCnpj || "";
    document.getElementById("perfilTelefone").value = cliente.telefone || "";

    if (cliente.senhaHash) {
      const senhaDescriptografada = await decryptPassword(
        cliente.senhaHash,
        "mrl-site-teste-secret"
      );
      document.getElementById("perfilSenha").value = senhaDescriptografada;
    } else {
      document.getElementById("perfilSenha").value = "";
    }
  } catch (error) {
    console.error("Erro ao carregar perfil:", error);
  }
}

document.getElementById("btnToggleSenha").addEventListener("click", () => {
  const senhaInput = document.getElementById("perfilSenha");
  senhaInput.type = senhaInput.type === "password" ? "text" : "password";
});

document.getElementById("btnEdit").addEventListener("click", () => {
  const inputs = document.querySelectorAll("#perfilForm input");
  inputs.forEach((input) => input.removeAttribute("disabled"));
  document.getElementById("btnEdit").style.display = "none";
  document.getElementById("btnSave").style.display = "inline-block";
});

document.getElementById("btnSave").addEventListener("click", async () => {
  try {
    const novosDados = {
      nome: document.getElementById("perfilNome").value.trim(),
      email: document.getElementById("perfilEmail").value.trim(),
      cpfCnpj: document.getElementById("perfilCpfCnpj").value.trim(),
      telefone: document.getElementById("perfilTelefone").value.trim(),
      senha: document.getElementById("perfilSenha").value.trim(),
    };

    await AtualizarCliente(clienteId, novosDados);
    alert("✅ Informações atualizadas com sucesso!");

    const inputs = document.querySelectorAll("#perfilForm input");
    inputs.forEach((input) => input.setAttribute("disabled", true));

    document.getElementById("btnEdit").style.display = "inline-block";
    document.getElementById("btnSave").style.display = "none";
  } catch (error) {
    console.error("Erro ao salvar perfil:", error);
    alert("❌ Erro ao salvar informações. Verifique o console.");
  }
});

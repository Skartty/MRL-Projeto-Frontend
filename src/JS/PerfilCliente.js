import { auth } from "./firebase_config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { BuscarClientePorEmail, BuscarClientePorId } from "./BuscaCliente.js";
import { AtualizarCliente } from "./AtualizaCliente.js";
import { decryptPassword } from "./Criptografia.js";

let clienteAtual = null;
let clienteId = null;

document.addEventListener("DOMContentLoaded", () => {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      console.log("Usuário autenticado:", user.email);

      // 🔍 Use o método adequado conforme seu banco
      // const cliente = await BuscarClientePorId(user.uid);
      const cliente = await BuscarClientePorEmail(user.email);

      if (!cliente) {
        console.error("Cliente não encontrado!");
        return;
      }

      console.log("📄 Dados do cliente:", cliente);
      clienteAtual = cliente;
      clienteId = cliente.id;

      const campos = {
        perfilNome: cliente.nome,
        perfilEmail: cliente.email,
        perfilCpfCnpj: cliente.cpfCnpj,
        perfilTelefone: cliente.telefone
      };

      Object.entries(campos).forEach(([id, valor]) => {
        const elemento = document.getElementById(id);
        if (elemento) elemento.value = valor || "";
        else console.warn(`Elemento ${id} não encontrado`);
      });

      const senhaInput = document.getElementById("perfilSenha");
      if (senhaInput && cliente.senhaHash) {
        try {
          const senhaDescriptografada = await decryptPassword(
            cliente.senhaHash,
            "mrl-site-teste-secret"
          );
          senhaInput.value = senhaDescriptografada;
        } catch {
          senhaInput.value = "";
        }
      }
    } else {
      console.warn("Nenhum usuário autenticado. Redirecionando...");
      window.location.href = "/screens/Home/Login/";
    }
  });

  // ✅ eventos DOM
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
      alert("❌ Erro ao salvar informações.");
    }
  });
});

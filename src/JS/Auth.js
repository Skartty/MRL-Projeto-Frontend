import { auth, provider, signInWithPopup } from "./firebase_config.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { db } from "./firebase_config.js";
import {
  doc,
  setDoc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


export function monitorarAuthRedirecionar() {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      console.log("👤 Usuário logado automaticamente:", user.email || user.displayName);

      try {
        const clienteRef = doc(db, "Cliente", user.uid);
        const clienteSnap = await getDoc(clienteRef);

        if (clienteSnap.exists()) {
          const cliente = clienteSnap.data();
          const currentPath = window.location.pathname;

          if (cliente.admin === true && !currentPath.includes("/screens/Adm/")) {
            console.log("🔐 Redirecionando para área de Admin...");
            window.location.href = "/screens/Adm/";
          } else if (!cliente.admin && !currentPath.includes("/screens/User/Perfil/index.html")) {
            console.log("👤 Redirecionando para área de Perfil...");
            window.location.href = "/screens/User/Perfil/";
          }
        } else {
          console.warn("⚠️ Cliente não encontrado. Redirecionando para Perfil.");
          window.location.href = "/screens/Home/";
        }
      } catch (error) {
        console.error("❌ Erro ao buscar dados do cliente:", error);
        window.location.href = "/screens/Home/";
      }
    } else {
      console.log("🚪 Nenhum usuário logado.");
    }
  });
}

export function verificarUsuarioLogado() {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      console.log("⚠️ Usuário não logado. Redirecionando para a Home...");
      window.location.href = "/screens/Home/";
    }
  });
}

export async function logout() {
  try {
    await signOut(auth);
    alert("Você saiu da conta!");
    window.location.href = "/screens/Home/";
  } catch (error) {
    console.error("❌ Erro ao sair:", error);
    alert("❌ Erro ao sair. Tente novamente.");
  }
}


document.addEventListener("DOMContentLoaded", () => {
  const btnFacebook = document.getElementById("socialLogin");
  if (btnFacebook) {
    btnFacebook.addEventListener("click", async () => {
      try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        await setDoc(
          doc(db, "Cliente", user.uid),
          {
            nome: user.displayName || "",
            email: user.email || "",
            foto: user.photoURL || "",
            loginFacebook: true,
          },
          { merge: true }
        );

        alert(`✅ Bem-vindo, ${user.displayName || user.email}!`);

        window.location.href = "/screens/User/Perfil/";
      } catch (error) {
        console.error("❌ Erro no login com Facebook:", error);
        alert("Erro ao fazer login com Facebook. Verifique o console.");
      }
    });
  }


  // ✅ LOGIN POR E-MAIL E SENHA
  const formLogin = document.getElementById("formLogin");
  if (formLogin) {
    formLogin.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("loginEmail").value.trim();
      const senha = document.getElementById("loginSenha").value.trim();

      if (!email || !senha) {
        alert("Preencha o e-mail e a senha!");
        return;
      }

      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, senha);
        const user = userCredential.user;

        console.log("✅ Login bem-sucedido:", user.email);
        const clienteRef = doc(db, "Cliente", user.uid);
        const clienteSnap = await getDoc(clienteRef);

        if (clienteSnap.exists()) {
          const cliente = clienteSnap.data();
          if (cliente.admin === true) {
            console.log("🔐 Redirecionando para /screens/Adm/Admin.html...");
            window.location.href = "/screens/Adm/";
          } else {
            console.log("👤 Redirecionando para /screens/User/Perfil...");
            window.location.href = "/screens/User/Perfil/";
          }
        } else {
          console.warn("⚠️ Cliente não encontrado. Redirecionando para /screens/User/Perfil...");
          window.location.href = "/screens/User/Perfil/";
        }
      } catch (error) {
        console.error("❌ Erro no login com e-mail/senha:", error);
        alert("E-mail ou senha incorretos.");
      }
    });
  }
});




// ✅ Cadastro de usuário por e-mail e senha (chamado no CadastroCliente.js)
export async function criarUsuarioAuthEmailSenha(email, senha) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
    const user = userCredential.user;
    console.log("✅ Usuário criado no Firebase Auth:", user.uid);
    return user.uid;
  } catch (error) {
    console.error("❌ Erro ao criar usuário no Auth:", error);
    throw error;
  }
}

export async function loginUsuarioEmail(email, senha) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, senha);
    const user = userCredential.user;
    alert(`✅ Bem-vindo, ${user.email}!`);
    return user;
  } catch (error) {
    console.error("❌ Erro no login com e-mail/senha:", error);
    alert("E-mail ou senha inválidos.");
  }
}
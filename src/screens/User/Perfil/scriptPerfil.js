// Alternar abas
const buttons = document.querySelectorAll(".tab-button");
const contents = document.querySelectorAll(".tab-content");

buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    buttons.forEach(b => b.classList.remove("active"));
    contents.forEach(c => c.classList.remove("active"));

    btn.classList.add("active");
    document.getElementById(btn.dataset.tab).classList.add("active");
  });
});

// Mostrar/ocultar senha
function toggleSenha() {
  const input = document.getElementById("senha");
  input.type = input.type === "password" ? "text" : "password";
}

// Ativar/desativar edição dos campos
const btnEdit = document.getElementById("btnEdit");
const form = document.getElementById("perfilForm");
const inputs = form.querySelectorAll("input");

btnEdit.addEventListener("click", () => {
  const isEditing = btnEdit.classList.toggle("editing");

  inputs.forEach(input => {
    // CPF/CNPJ permanece bloqueado mesmo no modo edição
    if (input.type !== "text" || input.previousElementSibling?.innerText !== "CPF/CNPJ:") {
      input.disabled = !isEditing;
    }
  });

  btnEdit.textContent = isEditing ? "Salvar Alterações" : "Editar Informações";

  if (!isEditing) {
    alert("Alterações salvas com sucesso!");
    // aqui você pode implementar o envio real dos dados para o servidor
  }
});

// Expansão/recolhimento dos contratos
const contratos = document.querySelectorAll(".contrato-card");

function atualizarEstadoContratos() {
  if (contratos.length === 1) {
    contratos[0].classList.add("active"); // único contrato já expandido
  }
}

contratos.forEach(card => {
  const header = card.querySelector(".contrato-header");
  const expandIcon = card.querySelector(".expand img");

  header.addEventListener("click", () => {
    // Fecha os outros e abre o selecionado
    if (card.classList.contains("active")) {
      card.classList.remove("active");
    } else {
      contratos.forEach(c => c.classList.remove("active"));
      card.classList.add("active");
    }
  });

  // Ícone também clicável
  expandIcon.addEventListener("click", e => {
    e.stopPropagation();
    card.classList.toggle("active");
  });
});

atualizarEstadoContratos();

// Filtro
const filtro = document.getElementById("filtro");
filtro.addEventListener("change", () => {
  const tipo = filtro.value;
  const lista = document.querySelector(".contratos-lista");
  const cards = Array.from(lista.querySelectorAll(".contrato-card"));

  if (tipo === "alfabetica") {
    cards.sort((a, b) => a.querySelector("h3").textContent.localeCompare(b.querySelector("h3").textContent));
  } else if (tipo === "status") {
    cards.sort((a, b) => a.querySelector(".status").textContent.localeCompare(b.querySelector(".status").textContent));
  } else if (tipo === "data") {
    cards.sort((a, b) => new Date(a.querySelector(".data").textContent) - new Date(b.querySelector(".data").textContent));
  }

  lista.innerHTML = "";
  cards.forEach(c => lista.appendChild(c));
});

// Expansão/recolhimento dos pagamentos
const pagamentos = document.querySelectorAll(".pagamento-card");

function atualizarEstadoPagamentos() {
  if (pagamentos.length === 1) {
    pagamentos[0].classList.add("active"); // único pagamento já expandido
  }
}

pagamentos.forEach(card => {
  const header = card.querySelector(".pagamento-header");
  const expandIcon = card.querySelector(".expand img");

  header.addEventListener("click", () => {
    if (card.classList.contains("active")) {
      card.classList.remove("active");
    } else {
      pagamentos.forEach(c => c.classList.remove("active"));
      card.classList.add("active");
    }
  });

  expandIcon.addEventListener("click", e => {
    e.stopPropagation();
    card.classList.toggle("active");
  });
});

atualizarEstadoPagamentos();

// Filtro
const filtroPag = document.getElementById("filtro-pag");
filtroPag.addEventListener("change", () => {
  const tipo = filtroPag.value;
  const lista = document.querySelector(".pagamentos-lista");
  const cards = Array.from(lista.querySelectorAll(".pagamento-card"));

  if (tipo === "alfabetica") {
    cards.sort((a, b) =>
      a.querySelector("h3").textContent.localeCompare(b.querySelector("h3").textContent)
    );
  } else if (tipo === "contrato") {
    cards.sort(
      (a, b) =>
        new Date(a.querySelector(".data-contrato").textContent) -
        new Date(b.querySelector(".data-contrato").textContent)
    );
  } else if (tipo === "vencimento") {
    cards.sort(
      (a, b) =>
        new Date(a.querySelector(".data-vencimento").textContent) -
        new Date(b.querySelector(".data-vencimento").textContent)
    );
  }

  lista.innerHTML = "";
  cards.forEach(c => lista.appendChild(c));
});

// =====================
// 🔹 POP-UP DE SAIR DA CONTA
// =====================
document.addEventListener("DOMContentLoaded", () => {
  // Cria o pop-up
  async function criarPopup(mensagem, duracao = 0) {
    const popup = document.createElement("div");
    popup.className = "popup-overlay";
    popup.innerHTML = `
      <div class="popup-box">
        <p>${mensagem}</p>
        <button id="popup-ok">OK</button>
      </div>
    `;
    document.body.appendChild(popup);

    const botaoOk = popup.querySelector("#popup-ok");
    botaoOk.addEventListener("click", () => popup.remove());
    await signOut(auth);

    if (duracao > 0) {
      setTimeout(() => popup.remove(), duracao);
    }
  }
  
  const btnSair = document.querySelector(".btn-home");
  if (btnSair) {
    btnSair.addEventListener("click", (e) => {
      e.preventDefault();
      criarPopup("Você saiu da conta com sucesso!");

      const popup = document.querySelector(".popup-overlay");
      popup.querySelector("#popup-ok").addEventListener("click", () => {
        window.location.href = "/screens/Home/index.html";
      });
    });
  }
});
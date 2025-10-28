// ===== scriptCatalog.js =====

// Helpers
function parsePrice(priceStr) {
  // transforma "R$ 1.800,50" ou "R$ 1800" em Number 1800.5 / 1800
  let raw = priceStr.replace(/\s/g, "").replace("R$", "");
  if (raw.indexOf(",") > -1) {
    raw = raw.replace(/\./g, "").replace(",", ".");
  } else {
    raw = raw.replace(/\./g, "");
  }
  const n = parseFloat(raw);
  return isNaN(n) ? 0 : n;
}

function getCatalogContainer() {
  return document.querySelector(".catalogo-grid");
}

// ===== CARRINHO =====
const btnCarrinho = document.querySelector(".btn-carrinho");
const carrinho = document.getElementById("carrinho");
const listaCarrinho = document.getElementById("lista-carrinho");
const totalValor = document.getElementById("total-valor");
const cartBadge = document.getElementById("cart-badge");
const btnFinalizar = document.getElementById("finalizar-compra");
const inputDataReuniao = document.getElementById("data-reuniao");

let total = 0;
let itensCarrinho = 0;

if (btnCarrinho) {
  btnCarrinho.addEventListener("click", () => {
    carrinho.classList.toggle("active");
  });
}

// função para atualizar badge (apenas visível/invisível)
function updateBadge() {
  cartBadge.style.display = itensCarrinho > 0 ? "block" : "none";
}

// Adiciona itens ao carrinho
document.querySelectorAll(".btn-contratar").forEach(btn => {
  btn.addEventListener("click", e => {
    const card = e.target.closest(".card-servico");
    const nome = card.querySelector("h3").textContent.trim();
    const precoStr = card.querySelector(".preco p").textContent.trim();
    const preco = parsePrice(precoStr);

    const item = document.createElement("li");
    item.classList.add("carrinho-item");
    item.innerHTML = `
      <span class="item-nome">${nome}</span>
      <span class="item-preco">R$ ${preco.toFixed(2)}</span>
      <button class="remover">X</button>
    `;
    listaCarrinho.appendChild(item);

    total += preco;
    totalValor.textContent = total.toFixed(2);
    itensCarrinho++;

    updateBadge();

    const removerBtn = item.querySelector(".remover");
    removerBtn.addEventListener("click", () => {
      total -= preco;
      if (total < 0) total = 0;
      totalValor.textContent = total.toFixed(2);
      item.remove();
      itensCarrinho--;
      updateBadge();
    });
  });
});

// ===== FINALIZAR COMPRA =====
if (btnFinalizar) {
  btnFinalizar.addEventListener("click", () => {
    if (itensCarrinho === 0) {
      alert("Seu carrinho está vazio!");
      return;
    }

    const formaPagamento = document.querySelector('input[name="pagamento"]:checked');
    if (!formaPagamento) {
      alert("Por favor, selecione uma forma de pagamento antes de finalizar a compra.");
      return;
    }

    const dataReuniao = inputDataReuniao ? inputDataReuniao.value : "";
    if (!dataReuniao) {
      alert("Por favor, selecione uma data para a reunião antes de finalizar a compra.");
      return;
    }

    // Aqui você pode executar a integração real de pagamento (API) se houver.
    // Por enquanto mostramos popup e limpamos o carrinho.
    showPurchasePopup(); // mostra modal estilizado

    // Limpa o carrinho
    listaCarrinho.innerHTML = "";
    total = 0;
    itensCarrinho = 0;
    totalValor.textContent = "0.00";
    updateBadge();

    // fecha o carrinho
    carrinho.classList.remove("active");
    // reseta seleção de pagamento e data (opcional)
    const checked = document.querySelector('input[name="pagamento"]:checked');
    if (checked) checked.checked = false;
    if (inputDataReuniao) inputDataReuniao.value = "";
  });
}

// ===== FILTRO / REORDENAR CARDS =====
const btnFiltro = document.querySelector(".btn-filtro");
const menuFiltro = document.getElementById("filtro-opcoes");

if (btnFiltro && menuFiltro) {
  btnFiltro.addEventListener("click", (e) => {
    e.stopPropagation();
    menuFiltro.classList.toggle("active");
  });

  // clique fora fecha
  document.addEventListener("click", e => {
    if (!menuFiltro.contains(e.target) && !btnFiltro.contains(e.target)) {
      menuFiltro.classList.remove("active");
    }
  });

  // opções do menu
  menuFiltro.querySelectorAll("li").forEach(li => {
    li.addEventListener("click", () => {
      const filtro = li.dataset.filtro;
      sortCards(filtro);
      menuFiltro.classList.remove("active");
    });
  });
}

function sortCards(type) {
  const container = getCatalogContainer();
  if (!container) return;

  const cards = Array.from(container.querySelectorAll(".card-servico"));

  let sorted;
  if (type === "menor") {
    sorted = cards.sort((a, b) => {
      const pa = parsePrice(a.querySelector(".preco p").textContent);
      const pb = parsePrice(b.querySelector(".preco p").textContent);
      return pa - pb;
    });
  } else if (type === "maior") {
    sorted = cards.sort((a, b) => {
      const pa = parsePrice(a.querySelector(".preco p").textContent);
      const pb = parsePrice(b.querySelector(".preco p").textContent);
      return pb - pa;
    });
  } else if (type === "alfabetica") {
    sorted = cards.sort((a, b) => {
      const ta = a.querySelector("h3").textContent.trim();
      const tb = b.querySelector("h3").textContent.trim();
      return ta.localeCompare(tb, 'pt-BR', { sensitivity: 'base' });
    });
  } else if (type === "vendidos") {
    // usa atributo data-vendidos (maior primeiro). se ausente, assume 0.
    sorted = cards.sort((a, b) => {
      const va = parseInt(a.getAttribute("data-vendidos") || "0", 10);
      const vb = parseInt(b.getAttribute("data-vendidos") || "0", 10);
      return vb - va;
    });
  } else {
    // default: mantém ordem atual
    return;
  }

  // reapenda na nova ordem
  sorted.forEach(c => container.appendChild(c));
}

// ===== BUSCA =====
const searchBar = document.getElementById("search-bar");
if (searchBar) {
  searchBar.addEventListener("input", () => {
    const termo = searchBar.value.toLowerCase();
    document.querySelectorAll(".card-servico").forEach(card => {
      const nome = card.querySelector("h3").textContent.toLowerCase();
      const descricaoEl = card.querySelector(".card-conteudo p");
      const descricao = descricaoEl ? descricaoEl.textContent.toLowerCase() : "";
      card.style.display = (nome.includes(termo) || descricao.includes(termo)) ? "flex" : "none";
    });
  });
}

// ===== BOTÃO VOLTAR =====
const btnVoltar = document.querySelector(".btn-voltar");
if (btnVoltar) {
  btnVoltar.addEventListener("click", () => {
    window.location.href = "/screens/User/index.html";
  });
}

// ===== POPUP DE COMPRA (simples) =====
const purchasePopup = document.getElementById("purchase-popup");
const popupClose = document.getElementById("popup-close");

function showPurchasePopup() {
  if (!purchasePopup) {
    alert("Compra realizada com sucesso!");
    return;
  }
  purchasePopup.classList.add("active");
}

if (popupClose) {
  popupClose.addEventListener("click", () => {
    purchasePopup.classList.remove("active");
  });
}

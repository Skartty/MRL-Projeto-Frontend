document.addEventListener("DOMContentLoaded", () => {
  const track = document.querySelector(".carousel-track");
  const cards = Array.from(document.querySelectorAll(".servico-card"));
  const prevBtn = document.querySelector(".prev");
  const nextBtn = document.querySelector(".next");
  const carousel = document.querySelector(".carousel");

  let index = 0;
  let autoSlide;
  const interval = 20; // 🔹 tempo menor para efeito suave (ms)
  const step = 0.8;   // 🔹 quanto "anda" por frame
  const cardsPerView = 3;

  // 🔹 Clonar todos os cards para loop infinito
  cards.forEach(card => {
    const clone = card.cloneNode(true);
    track.appendChild(clone);
  });

  const allCards = document.querySelectorAll(".servico-card");

  function updateCarousel(animate = true) {
    const cardWidth = allCards[0].offsetWidth + 20; // largura + margem
    const moveX = index;

    if (animate) {
      track.style.transition = "transform 0.05s linear";
    } else {
      track.style.transition = "none";
    }

    track.style.transform = `translateX(${-moveX}px)`;

    // 🔹 Reset invisível quando passa da metade
    if (index >= cardWidth * cards.length) {
      index = 0;
      updateCarousel(false);
    }
  }

  // Avançar
  function nextSlide() {
    const cardWidth = allCards[0].offsetWidth + 20;
    index += cardWidth;
    updateCarousel();
  }

  // Voltar
  function prevSlide() {
    const cardWidth = allCards[0].offsetWidth + 20;
    if (index === 0) {
      index = cardWidth * cards.length;
      updateCarousel(false);
    }
    index -= cardWidth;
    updateCarousel();
  }

  // Autoplay suave
  function startAutoSlide() {
    autoSlide = setInterval(() => {
      index += step;
      updateCarousel();
    }, interval);
  }

  function stopAutoSlide() {
    clearInterval(autoSlide);
  }

  // Eventos botões
  nextBtn.addEventListener("click", () => {
    stopAutoSlide();
    nextSlide();
    startAutoSlide();
  });

  prevBtn.addEventListener("click", () => {
    stopAutoSlide();
    prevSlide();
    startAutoSlide();
  });

  // Pausa no hover (em qualquer card)
  track.addEventListener("mouseenter", stopAutoSlide);
  track.addEventListener("mouseleave", startAutoSlide);

  // Inicialização
  updateCarousel(false);
  startAutoSlide();
});

// === POPUPS DE CONFIRMAÇÃO ===
document.addEventListener("DOMContentLoaded", () => {

  // Função para criar o pop-up genérico
  function criarPopup(mensagem, duracao = 0) {
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

    if (duracao > 0) {
      setTimeout(() => popup.remove(), duracao);
    }
  }

  // === 1️⃣ POPUP AO SAIR ===
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

  // === 2️⃣ POPUP AO ENVIAR AVALIAÇÃO ===
  const formAvaliacao = document.querySelector(".avaliacao-form");
  if (formAvaliacao) {
    formAvaliacao.addEventListener("submit", (e) => {
      e.preventDefault();

      // --- VALIDAÇÃO ---
      const estrelas = formAvaliacao.querySelector('input[name="estrela"]:checked');
      const servico = formAvaliacao.querySelector("#servico").value;

      if (!estrelas) {
        criarPopup("Por favor, selecione uma quantidade de estrelas antes de enviar!");
        return;
      }

      if (!servico) {
        criarPopup("Por favor, selecione um serviço antes de enviar!");
        return;
      }

      // Se passou na validação
      criarPopup("✅ Avaliação enviada com sucesso! Obrigado por compartilhar sua opinião.");
      formAvaliacao.reset();
    });
  }
});


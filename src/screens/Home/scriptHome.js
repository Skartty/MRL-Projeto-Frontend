// CONTROLE DO MENU HAMBÚRGUER
document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");
  const navLinks = document.querySelectorAll(".nav a");

  if (menuToggle && nav) {
    // Alterna a classe 'open' para mostrar/esconder o menu
    menuToggle.addEventListener("click", () => {
      nav.classList.toggle("open");
    });

    // Fecha o menu ao clicar em um link (navegação)
    navLinks.forEach(link => {
      link.addEventListener("click", () => {
        if (nav.classList.contains("open")) {
          nav.classList.remove("open");
        }
      });
    });
  }

  const track = document.querySelector(".carousel-track");
  const cards = Array.from(document.querySelectorAll(".servico-card"));
  const prevBtn = document.querySelector(".prev");
  const nextBtn = document.querySelector(".next");
  const carousel = document.querySelector(".carousel");

  let index = 0;
  let autoSlide;
  const interval = 20; // 🔹 tempo menor para efeito suave (ms)
  const step = 0.8;    // 🔹 quanto "anda" por frame
  const cardsPerView = 3;

  // 🔹 Clonar todos os cards para loop infinito
  cards.forEach(card => {
    const clone = card.cloneNode(true);
    track.appendChild(clone);
  });

  const allCards = document.querySelectorAll(".servico-card");

  // Ajusta a largura do card baseada na tela
  function getCardWidth() {
    // Calcula a largura do primeiro card no momento da chamada
    // É importante recalcular para garantir responsividade
    const firstCard = allCards[0];
    if (!firstCard) return 0;
    return firstCard.offsetWidth + 20; // largura + margem
  }

  function updateCarousel(animate = true) {
    const cardWidth = getCardWidth();
    const moveX = index;

    if (animate) {
      track.style.transition = "transform 0.05s linear";
    } else {
      track.style.transition = "none";
    }

    track.style.transform = `translateX(${-moveX}px)`;

    // Reset invisível quando passa do total dos cards originais (loop)
    if (index >= cardWidth * cards.length) {
      index = index % (cardWidth * cards.length); // Reseta o índice
      updateCarousel(false);
    }
  }

  // Avançar
  function nextSlide() {
    const cardWidth = getCardWidth();
    index = Math.ceil(index / cardWidth) * cardWidth; // Arredonda para o próximo card
    index += cardWidth;
    updateCarousel();
  }

  // Voltar
  function prevSlide() {
    const cardWidth = getCardWidth();
    if (index === 0) {
      index = cardWidth * cards.length;
      updateCarousel(false);
    }
    // Arredonda para o card anterior
    index = Math.floor(index / cardWidth) * cardWidth;
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

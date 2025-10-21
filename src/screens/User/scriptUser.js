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

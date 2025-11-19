document.addEventListener("DOMContentLoaded", () => {

  /* ============================================
     🔹 MÁSCARAS E VALIDAÇÕES CPF/CNPJ & TELEFONE
     ============================================ */

  function somenteNumeros(valor) {
    return valor.replace(/\D/g, "");
  }

  function aplicarMascaraCpfCnpj(valor) {
    valor = somenteNumeros(valor);

    if (valor.length <= 11) {
      // CPF = 000.000.000-00
      valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
      valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
      valor = valor.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    } else {
      // CNPJ = 00.000.000/0000-00
      valor = valor.replace(/^(\d{2})(\d)/, "$1.$2");
      valor = valor.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
      valor = valor.replace(/\.(\d{3})(\d)/, ".$1/$2");
      valor = valor.replace(/(\d{4})(\d)/, "$1-$2");
    }

    return valor;
  }

  function aplicarMascaraTelefone(valor) {
    valor = somenteNumeros(valor);

    if (valor.length <= 10) {
      valor = valor.replace(/(\d{2})(\d)/, "($1) $2");
      valor = valor.replace(/(\d{4})(\d)/, "$1-$2");
    } else {
      valor = valor.replace(/(\d{2})(\d)/, "($1) $2");
      valor = valor.replace(/(\d{5})(\d)/, "$1-$2");
    }

    return valor;
  }

  // Localizando os inputs (se existirem)
  const cpfCnpjInput = document.querySelector("input[name='cpfCnpj']");
  const telefoneInput = document.querySelector("input[name='telefone']");

  if (cpfCnpjInput) {
    cpfCnpjInput.addEventListener("input", () => {
      cpfCnpjInput.value = aplicarMascaraCpfCnpj(cpfCnpjInput.value);
    });
  }

  if (telefoneInput) {
    telefoneInput.addEventListener("input", () => {
      telefoneInput.value = aplicarMascaraTelefone(telefoneInput.value);
    });
  }


  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");
  const navLinks = document.querySelectorAll(".nav a");

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      nav.classList.toggle("open");
    });

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
  const interval = 20;
  const step = 0.8;

  if (track && cards.length > 0) {

    cards.forEach(card => {
      const clone = card.cloneNode(true);
      track.appendChild(clone);
    });

    const allCards = document.querySelectorAll(".servico-card");

    function getCardWidth() {
      const firstCard = allCards[0];
      if (!firstCard) return 0;
      return firstCard.offsetWidth + 20;
    }

    function updateCarousel(animate = true) {
      const cardWidth = getCardWidth();
      const moveX = index;

      track.style.transition = animate ? "transform 0.05s linear" : "none";
      track.style.transform = `translateX(${-moveX}px)`;

      if (index >= cardWidth * cards.length) {
        index = index % (cardWidth * cards.length);
        updateCarousel(false);
      }
    }

    function nextSlide() {
      const cardWidth = getCardWidth();
      index = Math.ceil(index / cardWidth) * cardWidth;
      index += cardWidth;
      updateCarousel();
    }

    function prevSlide() {
      const cardWidth = getCardWidth();
      if (index === 0) {
        index = cardWidth * cards.length;
        updateCarousel(false);
      }
      index = Math.floor(index / cardWidth) * cardWidth;
      index -= cardWidth;
      updateCarousel();
    }

    function startAutoSlide() {
      autoSlide = setInterval(() => {
        index += step;
        updateCarousel();
      }, interval);
    }

    function stopAutoSlide() {
      clearInterval(autoSlide);
    }

    nextBtn?.addEventListener("click", () => {
      stopAutoSlide();
      nextSlide();
      startAutoSlide();
    });

    prevBtn?.addEventListener("click", () => {
      stopAutoSlide();
      prevSlide();
      startAutoSlide();
    });

    track.addEventListener("mouseenter", stopAutoSlide);
    track.addEventListener("mouseleave", startAutoSlide);

    updateCarousel(false);
    startAutoSlide();
  }

});

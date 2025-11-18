document.addEventListener("DOMContentLoaded", () => {
  // Cria o botão principal com imagem
  const btn = document.createElement("button");
  btn.id = "acessibilidade-btn";
  btn.title = "Acessibilidade";

  // Caminho da imagem (ajuste se necessário)
  const img = document.createElement("img");
  img.src = "/screens/Acessibilidade/Imagens/Img_Acessibilidade.png";
  img.alt = "Botão de acessibilidade";
  btn.appendChild(img);

  document.body.appendChild(btn);

  // Cria o menu oculto
  const menu = document.createElement("div");
  menu.id = "acessibilidade-menu";
  menu.innerHTML = `
    <button id="btn-lupa">🔍 Lupa</button>
    <button id="btn-leitor">🔊 Iniciar Leitura</button>
    <button id="btn-pausar">⏸️ Pausar</button>
    <button id="btn-parar">⏹️ Parar</button>
  `;
  document.body.appendChild(menu);

  // Alterna exibição do menu
  btn.addEventListener("click", () => {
    menu.style.display = menu.style.display === "flex" ? "none" : "flex";
  });

  // ---- Função de LUPA ----
  let zoomAtivo = false;
  document.getElementById("btn-lupa").addEventListener("click", () => {
    zoomAtivo = !zoomAtivo;
    document.body.style.zoom = zoomAtivo ? "1.5" : "1";
  });

  // ---- Controle do LEITOR DE TELA ----
  let leituraAtiva = false;
  let pausado = false;
  let textos = [];
  let indice = 0;

  const sintetizador = window.speechSynthesis;

  // Iniciar leitura
  document.getElementById("btn-leitor").addEventListener("click", () => {
    if (leituraAtiva) {
      alert("A leitura já está em andamento.");
      return;
    }

    sintetizador.cancel(); // limpa qualquer leitura anterior
    textos = [];
    indice = 0;

    // Coleta o conteúdo da página em ordem
    const elementos = document.querySelectorAll(
      "h1, h2, h3, h4, h5, h6, p, li, a, button, label, span"
    );

    elementos.forEach((el) => {
      const texto = el.innerText.trim();
      if (texto.length > 0) {
        textos.push(texto);
      }
    });

    if (textos.length === 0) {
      const aviso = new SpeechSynthesisUtterance("Nenhum conteúdo legível encontrado nesta página.");
      aviso.lang = "pt-BR";
      sintetizador.speak(aviso);
      return;
    }

    leituraAtiva = true;
    lerProximo();
  });

  // Pausar leitura
  document.getElementById("btn-pausar").addEventListener("click", () => {
    if (!leituraAtiva) return;

    if (!pausado) {
      sintetizador.pause();
      pausado = true;
    } else {
      sintetizador.resume();
      pausado = false;
    }
  });

  // Parar leitura
  document.getElementById("btn-parar").addEventListener("click", () => {
    sintetizador.cancel();
    leituraAtiva = false;
    pausado = false;
    indice = 0;
  });

  // Função recursiva para leitura em sequência
  function lerProximo() {
    if (indice < textos.length && leituraAtiva) {
      const fala = new SpeechSynthesisUtterance(textos[indice]);
      fala.lang = "pt-BR";
      fala.rate = 1;
      fala.pitch = 1;
      fala.onend = () => {
        indice++;
        lerProximo();
      };
      sintetizador.speak(fala);
    } else {
      leituraAtiva = false;
      pausado = false;
      indice = 0;
    }
  }
});

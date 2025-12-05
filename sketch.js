let canvasRef;

let xBolinha = 0;
let yBolinha = 0;
let diametroBolinha = 13;
let raio = diametroBolinha / 2;
let bolaVelocidadeBase = 6;
let velocidadeXBolinha = 0;
let velocidadeYBolinha = 0;

let larguraRaquetes = 12;
let alturaRaquetes = 100;
let velocidadeMinhaRaquete = 8;
let velocidadeRaqueteOponente = 8;

let xMinhaRaquete = 20;
let yMinhaRaquete = 0;
let xRaqueteOponente = 0;
let yRaqueteOponente = 0;

let colidiuNoFrame = false;

let meusPontos = 0;
let pontosOponente = 0;

let gameMode = "bot";
let botLevel = "medio";
const botLevels = {
  facil: { follow: 0.08, erro: 30 },
  medio: { follow: 0.12, erro: 16 },
  dificil: { follow: 0.18, erro: 6 },
};

let controles = {};
let mostrarAjuda = false;
let placarY = 12;

let raquetada;
let ponto;
let trilha;

function preload() {
  trilha = loadSound("trilha.mp3");
  ponto = loadSound("ponto.mp3");
  raquetada = loadSound("raquetada.mp3");
}

function setup() {
  canvasRef = createCanvas(windowWidth, windowHeight);
  textFont("monospace");
  trilha.loop();
  configuraControles();
  resetPosicoes();
  resetBolinha();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  resetPosicoes();
}

function draw() {
  background(0);
  colidiuNoFrame = false;
  movimentaBolinha();
  verificaColisaoBorda();
  placarY = alturaMenu() + 12;
  movimentaMinhaRaquete();
  movimentaRaqueteOponente();
  verificaColisoesRaquetes();
  marcaPonto();
  mostraRaquetes(xMinhaRaquete, yMinhaRaquete);
  mostraRaquetes(xRaqueteOponente, yRaqueteOponente);
  mostraBolinha();
  incluiPlacar();
  mostraAjuda();
}

function configuraControles() {
  controles.fullscreen = document.getElementById("fullscreen-toggle");
  controles.mode = document.getElementById("mode-select");
  controles.botLevel = document.getElementById("bot-level");
  controles.botLevelWrapper = document.getElementById("bot-level-wrapper");
  controles.ballSpeed = document.getElementById("ball-speed");
  controles.ballSpeedValue = document.getElementById("ball-speed-value");
  controles.paddleSpeed = document.getElementById("paddle-speed");
  controles.paddleSpeedValue = document.getElementById("paddle-speed-value");
  controles.reset = document.getElementById("reset-game");
  controles.toggleHelp = document.getElementById("toggle-help");
  controles.menuToggle = document.getElementById("menu-toggle");

  controles.fullscreen.addEventListener("click", toggleFullscreen);
  controles.mode.addEventListener("change", () => {
    gameMode = controles.mode.value;
    controles.botLevelWrapper.style.display =
      gameMode === "bot" ? "flex" : "none";
    resetPosicoes();
  });
  controles.botLevel.addEventListener("change", () => {
    botLevel = controles.botLevel.value;
  });

  const atualizarBola = () => {
    bolaVelocidadeBase = Number(controles.ballSpeed.value);
    controles.ballSpeedValue.textContent = controles.ballSpeed.value;
    sincronizaVelocidadeBolinha();
  };
  const atualizarRaquete = () => {
    velocidadeMinhaRaquete = Number(controles.paddleSpeed.value);
    velocidadeRaqueteOponente = Number(controles.paddleSpeed.value);
    controles.paddleSpeedValue.textContent = controles.paddleSpeed.value;
  };

  controles.ballSpeed.addEventListener("input", atualizarBola);
  controles.paddleSpeed.addEventListener("input", atualizarRaquete);
  controles.reset.addEventListener("click", reiniciarJogo);
  controles.toggleHelp.addEventListener("click", () => {
    mostrarAjuda = !mostrarAjuda;
    controles.toggleHelp.textContent = mostrarAjuda
      ? "Esconder instruções"
      : "Ver instruções";
  });
  controles.menuToggle.addEventListener("click", () => {
    const wrapper = document.getElementById("controls");
    const collapsed = wrapper.classList.toggle("collapsed");
    controles.menuToggle.textContent = collapsed
      ? "Mostrar menu"
      : "Minimizar menu";
    setTimeout(() => {
      placarY = alturaMenu() + 12;
    }, 0);
  });

  atualizarBola();
  atualizarRaquete();
  controles.botLevelWrapper.style.display = "flex";
}

function toggleFullscreen() {
  const fs = fullscreen();
  fullscreen(!fs);
  setTimeout(() => {
    resizeCanvas(windowWidth, windowHeight);
    resetPosicoes();
  }, 80);
}

function resetPosicoes() {
  xMinhaRaquete = 20;
  xRaqueteOponente = width - larguraRaquetes - 20;
  yMinhaRaquete = height / 2 - alturaRaquetes / 2;
  yRaqueteOponente = height / 2 - alturaRaquetes / 2;
}

function reiniciarJogo() {
  meusPontos = 0;
  pontosOponente = 0;
  resetPosicoes();
  resetBolinha();
}

function resetBolinha() {
  xBolinha = width / 2;
  yBolinha = height / 2;
  const direcaoX = random() > 0.5 ? 1 : -1;
  const direcaoY = random() > 0.5 ? 1 : -1;
  const angulo = random(-PI / 4, PI / 4);
  velocidadeXBolinha = bolaVelocidadeBase * cos(angulo) * direcaoX;
  velocidadeYBolinha = max(2, bolaVelocidadeBase * 0.6) * direcaoY;
}

function sincronizaVelocidadeBolinha() {
  const dirX = velocidadeXBolinha >= 0 ? 1 : -1;
  const dirY = velocidadeYBolinha >= 0 ? 1 : -1;
  velocidadeXBolinha = bolaVelocidadeBase * dirX;
  velocidadeYBolinha = max(2, bolaVelocidadeBase * 0.6) * dirY;
}

function mostraBolinha() {
  circle(xBolinha, yBolinha, diametroBolinha);
}

function movimentaBolinha() {
  xBolinha += velocidadeXBolinha;
  yBolinha += velocidadeYBolinha;
}

function verificaColisaoBorda() {
  if (yBolinha + raio >= height || yBolinha - raio <= 0) {
    velocidadeYBolinha *= -1;
  }
}

function mostraRaquetes(x, y) {
  rect(x, y, larguraRaquetes, alturaRaquetes);
}

function movimentaMinhaRaquete() {
  let sobe = keyIsDown(87); // W
  let desce = keyIsDown(83); // S

  if (gameMode === "bot") {
    sobe = sobe || keyIsDown(UP_ARROW);
    desce = desce || keyIsDown(DOWN_ARROW);
  }

  if (sobe) {
    yMinhaRaquete -= velocidadeMinhaRaquete;
  }

  if (desce) {
    yMinhaRaquete += velocidadeMinhaRaquete;
  }

  yMinhaRaquete = constrain(yMinhaRaquete, 0, height - alturaRaquetes);
}

function movimentaRaqueteOponente() {
  if (gameMode === "bot") {
    movimentaBot();
  } else {
    movimentaJogadorDois();
  }
}

function movimentaBot() {
  const config = botLevels[botLevel];
  const centroBolinha = yBolinha;
  const centroRaquete = yRaqueteOponente + alturaRaquetes / 2;
  const erro = random(-config.erro, config.erro);
  const delta = centroBolinha - centroRaquete + erro;
  yRaqueteOponente += delta * config.follow;
  yRaqueteOponente = constrain(yRaqueteOponente, 0, height - alturaRaquetes);
}

function movimentaJogadorDois() {
  if (keyIsDown(UP_ARROW)) {
    yRaqueteOponente -= velocidadeRaqueteOponente;
  }
  if (keyIsDown(DOWN_ARROW)) {
    yRaqueteOponente += velocidadeRaqueteOponente;
  }
  yRaqueteOponente = constrain(yRaqueteOponente, 0, height - alturaRaquetes);
}

function verificaColisoesRaquetes() {
  // Raquete esquerda
  const bateEsquerda =
    xBolinha - raio <= xMinhaRaquete + larguraRaquetes &&
    xBolinha >= xMinhaRaquete - raio &&
    yBolinha + raio >= yMinhaRaquete &&
    yBolinha - raio <= yMinhaRaquete + alturaRaquetes &&
    velocidadeXBolinha < 0;

  if (bateEsquerda) {
    colidiuNoFrame = true;
    xBolinha = xMinhaRaquete + larguraRaquetes + raio;
    velocidadeXBolinha = Math.abs(velocidadeXBolinha);
    raquetada.play();
  }

  // Raquete direita
  const bateDireita =
    xBolinha + raio >= xRaqueteOponente &&
    xBolinha <= xRaqueteOponente + larguraRaquetes + raio &&
    yBolinha + raio >= yRaqueteOponente &&
    yBolinha - raio <= yRaqueteOponente + alturaRaquetes &&
    velocidadeXBolinha > 0;

  if (bateDireita) {
    colidiuNoFrame = true;
    xBolinha = xRaqueteOponente - raio;
    velocidadeXBolinha = -Math.abs(velocidadeXBolinha);
    raquetada.play();
  }
}

function incluiPlacar() {
  const boxW = 56;
  const boxH = 30;
  const gap = 18;
  const cx = width / 2;
  const y = placarY;
  const leftX = cx - boxW - gap / 2;
  const rightX = cx + gap / 2;
  const leftColor =
    meusPontos > pontosOponente ? color(255, 180, 70) : color(255, 140, 0);
  const rightColor =
    pontosOponente > meusPontos ? color(255, 180, 70) : color(255, 140, 0);

  noStroke();
  fill(0, 0, 0, 120);
  rect(cx - boxW - gap / 2 - 12, y - 10, boxW * 2 + gap + 24, boxH + 20, 12);

  fill(leftColor);
  rect(leftX, y, boxW, boxH, 8);
  fill(rightColor);
  rect(rightX, y, boxW, boxH, 8);

  textAlign(CENTER, CENTER);
  textSize(11);
  fill(25);
  text("P1", leftX + boxW / 2, y + 9);
  text(gameMode === "bot" ? "BOT" : "P2", rightX + boxW / 2, y + 9);

  textSize(18);
  fill(255);
  text(meusPontos, leftX + boxW / 2, y + 21);
  text(pontosOponente, rightX + boxW / 2, y + 21);
}

function marcaPonto() {
  if (colidiuNoFrame) return;
  if (xBolinha - raio >= width) {
    meusPontos += 1;
    ponto.play();
    xBolinha = width - raio - 2;
    velocidadeXBolinha = -Math.abs(velocidadeXBolinha);
  }
  if (xBolinha + raio <= 0) {
    pontosOponente += 1;
    ponto.play();
    xBolinha = raio + 2;
    velocidadeXBolinha = Math.abs(velocidadeXBolinha);
  }
}

function mostraAjuda() {
  if (!mostrarAjuda) return;
  noStroke();
  fill(255, 255, 255, 170);
  textSize(13);
  textAlign(LEFT);
  const linhas = [
    "Controles: W/S (jogador 1) | Setas (bot ou jogador 2).",
    "Modo: escolha Bot ou 2 Jogadores no painel. Nivel do bot no seletor.",
    "Velocidade: ajuste bola e raquetes no painel. F para tela cheia.",
  ];
  for (let i = 0; i < linhas.length; i++) {
    text(linhas[i], 14, height - 48 + i * 16);
  }
}

function keyPressed() {
  if (key === "f" || key === "F") {
    toggleFullscreen();
  }
}

function alturaMenu() {
  const menu = document.getElementById("controls");
  return menu ? menu.offsetHeight + 8 : 0;
}

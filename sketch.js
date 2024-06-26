let xBolinha = 300;
let yBolinha = 200;
let diametroBolinha = 13;
let raio = diametroBolinha/2;
let velocidadeXBolinha = 6;
let velocidadeYBolinha = 6;

let xMinhaRaquete = 10;
let yMinhaRaquete = 150;
let yMinMinhaRaquete = 0;
let yMaxMinhaRaquete = 300;
let alturaRaquetes = 100;
let larguraRaquetes = 10;
let velocidadeMinhaRaquete = 8;

let xRaqueteOponente = 580;
let yRaqueteOponente = 150;
let velocidadeYOponente;
let chanceDeErrar = 0;

let colidiu = false;

let meusPontos = 0;
let pontosOponente = 0;

let raquetada;
let ponto;
let trilha;

function preload(){
  trilha = loadSound("trilha.mp3");
  ponto = loadSound("ponto.mp3");
  raquetada = loadSound("raquetada.mp3");
}

function setup() {
  createCanvas(600, 400);
  trilha.loop();
}

function draw() {
  background(0);
  mostraBolinha();
  movimentaBolinha();
  verificaColisaoBorda();  
  mostraRaquetes(xMinhaRaquete, yMinhaRaquete);
  movimentaMinhaRaquete();
  verificaColisaoRaquetes(xMinhaRaquete, yMinhaRaquete);
  mostraRaquetes(xRaqueteOponente, yRaqueteOponente);
  movimentaRaqueteOponente();
  verificaColisaoRaquetes(xRaqueteOponente, yRaqueteOponente);
  incluiPlacar();
  marcaPonto();
}

function mostraBolinha(){
  circle(xBolinha, yBolinha, diametroBolinha);
}

function movimentaBolinha(){
  xBolinha += velocidadeXBolinha;
  yBolinha += velocidadeYBolinha;
}

function verificaColisaoBorda(){
  if(xBolinha + raio >= width || xBolinha - raio <= 0){
    velocidadeXBolinha *= -1;
  }
  
  if(yBolinha + raio >= height || yBolinha - raio <= 0){
		velocidadeYBolinha *= -1;
	}
}

function mostraRaquetes(x, y){
  rect(x, y, larguraRaquetes, alturaRaquetes)
}

function movimentaMinhaRaquete(){
  if(keyIsDown(DOWN_ARROW)){
    yMinhaRaquete += velocidadeMinhaRaquete;
  } else if(yMinhaRaquete >= yMaxMinhaRaquete){
    yMinhaRaquete = yMaxMinhaRaquete;
  }
    
  if(keyIsDown(UP_ARROW)){
    yMinhaRaquete -= velocidadeMinhaRaquete;
  } else if(yMinhaRaquete <= yMinMinhaRaquete){
    yMinhaRaquete = yMinMinhaRaquete;
  }
}

function verificaColisaoRaquetes(x, y){
  colidiu = collideRectCircle(x, y, larguraRaquetes, alturaRaquetes, xBolinha, yBolinha, raio);
  if(colidiu){
    velocidadeXBolinha *= -1;
    raquetada.play();
  }
}

function movimentaRaqueteOponente() {
    velocidadeYOponente = yBolinha - yRaqueteOponente - alturaRaquetes / 2 - 40;
    yRaqueteOponente += velocidadeYOponente + chanceDeErrar
}

function incluiPlacar(){
	stroke(255);
	textAlign(CENTER);
	textSize(16);
	fill(color(255, 140, 0));
	rect(130, 10, 40, 20);
	fill(255);
	text(meusPontos, 150, 26);
	fill(color(255, 140, 0));
	rect(450, 10, 40, 20);
	fill(255);
	text(pontosOponente, 470, 26);
}

function marcaPonto(){
  if(xBolinha > 590){
    meusPontos += 1;
    ponto.play();
  }
  if(xBolinha < 10){
    pontosOponente += 1;
    ponto.play();
  }
}

function calculaChanceDeErrar() {
  if (pontosDoOponente >= meusPontos) {
    chanceDeErrar += 1
    if (chanceDeErrar >= 39){
    chanceDeErrar = 40
    }
  } else {
    chanceDeErrar -= 1
    if (chanceDeErrar <= 35){
    chanceDeErrar = 35
    }
  }
}

function bolinhaNaoFicaPresa(){
    if (XBolinha - raio < 0){
    XBolinha = 23
    }
}

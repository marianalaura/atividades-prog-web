// lista de símbolos que vão formar os pares
var simbolos = ["<html>", "<div>", "{ }", "( )", "=>", "const", "git", "npm"];

var cartas = [];
var primeiraCarta = null;
var segundaCarta = null;
var podeClicar = true;
var movimentos = 0;
var paresEncontrados = 0;
var segundos = 0;
var cronometro = null;

var boardEl = document.getElementById("board");
var movesEl = document.getElementById("moves");
var matchesEl = document.getElementById("matches");
var timerEl = document.getElementById("timer");
var finalMovesEl = document.getElementById("final-moves");
var finalTimeEl = document.getElementById("final-time");

document.getElementById("start-btn").addEventListener("click", iniciarJogo);
document.getElementById("play-again-btn").addEventListener("click", iniciarJogo);
document.getElementById("restart-btn").addEventListener("click", voltarInicio);

function embaralhar(lista) {
  for (var i = lista.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = lista[i];
    lista[i] = lista[j];
    lista[j] = temp;
  }
  return lista;
}

function iniciarJogo() {
  cartas = embaralhar(simbolos.concat(simbolos));
  primeiraCarta = null;
  segundaCarta = null;
  podeClicar = true;
  movimentos = 0;
  paresEncontrados = 0;
  segundos = 0;

  movesEl.textContent = "0";
  matchesEl.textContent = "0";
  timerEl.textContent = "00:00";

  document.getElementById("start-screen").hidden = true;
  document.getElementById("win-screen").hidden = true;
  boardEl.hidden = false;

  desenharTabuleiro();

  if (cronometro) clearInterval(cronometro);
  cronometro = setInterval(function () {
    segundos++;
    timerEl.textContent = formatarTempo(segundos);
  }, 1000);
}

function voltarInicio() {
  if (cronometro) clearInterval(cronometro);
  boardEl.hidden = true;
  document.getElementById("win-screen").hidden = true;
  document.getElementById("start-screen").hidden = false;
}

function formatarTempo(total) {
  var min = Math.floor(total / 60);
  var seg = total % 60;
  if (min < 10) min = "0" + min;
  if (seg < 10) seg = "0" + seg;
  return min + ":" + seg;
}

function desenharTabuleiro() {
  boardEl.innerHTML = "";
  for (var i = 0; i < cartas.length; i++) {
    var div = document.createElement("div");
    div.className = "card";
    div.setAttribute("data-index", i);
    div.setAttribute("data-simbolo", cartas[i]);
    div.textContent = "?";
    div.addEventListener("click", cliqueCarta);
    boardEl.appendChild(div);
  }
}

function cliqueCarta(e) {
  var carta = e.target;

  if (!podeClicar) return;
  if (carta.classList.contains("virada") || carta.classList.contains("encontrada")) return;
  if (carta === primeiraCarta) return;

  carta.classList.add("virada");
  carta.textContent = carta.getAttribute("data-simbolo");

  if (!primeiraCarta) {
    primeiraCarta = carta;
    return;
  }

  segundaCarta = carta;
  movimentos++;
  movesEl.textContent = movimentos;
  podeClicar = false;

  var simbolo1 = primeiraCarta.getAttribute("data-simbolo");
  var simbolo2 = segundaCarta.getAttribute("data-simbolo");

  if (simbolo1 === simbolo2) {
    primeiraCarta.classList.add("encontrada");
    segundaCarta.classList.add("encontrada");
    paresEncontrados++;
    matchesEl.textContent = paresEncontrados;
    primeiraCarta = null;
    segundaCarta = null;
    podeClicar = true;

    if (paresEncontrados === simbolos.length) {
      terminarJogo();
    }
  } else {
    primeiraCarta.classList.add("errada");
    segundaCarta.classList.add("errada");

    setTimeout(function () {
      primeiraCarta.classList.remove("virada", "errada");
      segundaCarta.classList.remove("virada", "errada");
      primeiraCarta.textContent = "?";
      segundaCarta.textContent = "?";
      primeiraCarta = null;
      segundaCarta = null;
      podeClicar = true;
    }, 800);
  }
}

function terminarJogo() {
  clearInterval(cronometro);
  finalMovesEl.textContent = movimentos;
  finalTimeEl.textContent = formatarTempo(segundos);
  boardEl.hidden = true;
  document.getElementById("win-screen").hidden = false;
}

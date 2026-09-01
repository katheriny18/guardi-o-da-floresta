const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const livesEl = document.getElementById('lives');
const timeEl = document.getElementById('time');
const levelEl = document.getElementById('level');
const capa = document.getElementById('capa');
const startBtn = document.getElementById('startBtn');
const leftBtn = document.getElementById('leftBtn');
const rightBtn = document.getElementById('rightBtn');

let score = 0;
let lives = 3;
let time = 90;
let level = 1;
let playerX = 180;
let left = false;
let right = false;
let items = [];
let gameActive = false;

// ANIMAIS POR FASE
const animaisPorFase = {
  1: ['🦜', '🐒', '🦋'], // ARARA, MICO-LEÃO, BORBOLETA
  2: ['🐢', '🐆'],
  3: ['🦥', '🐍'],
  4: ['🦜', '🐒', '🦋', '🐢'],
  5: ['🦜', '🐒', '🦋', '🐢', '🐆', '🦥']
};

const pontosPorFase = {
  1: 20,
  2: 30,
  3: 40,
  4: 50,
  5: 60
};

const perigos = ['🔥', '🪓'];

// Controles
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft' || e.key === 'a') left = true;
  if (e.key === 'ArrowRight' || e.key === 'd') right = true;
});
document.addEventListener('keyup', e => {
  if (e.key === 'ArrowLeft' || e.key === 'a') left = false;
  if (e.key === 'ArrowRight' || e.key === 'd') right = false;
});

leftBtn.addEventListener('touchstart', e => { e.preventDefault(); left = true; });
leftBtn.addEventListener('touchend', () => left = false);
rightBtn.addEventListener('touchstart', e => { e.preventDefault(); right = true; });
rightBtn.addEventListener('touchend', () => right = false);

function loop() {
  if (!gameActive) return;
  ctx.clearRect(0, 0, 420, 600);

  if (left) playerX -= 6;
  if (right) playerX += 6;
  if (playerX < 0) playerX = 0;
  if (playerX > 360) playerX = 360;

  // Criar itens
  if (Math.random() < 0.04 + level * 0.01) {
    let isGood = Math.random() > 0.35;
    let lista = animaisPorFase[level];
    let emoji = isGood? lista[Math.floor(Math.random() * lista.length)] : perigos[Math.floor(Math.random() * perigos.length)];
    items.push({ x: Math.random() * 380, y: -20, good: isGood, emoji: emoji });
  }

  for (let i = items.length - 1; i >= 0; i--) {
    let it = items[i];
    it.y += 3 + level;
    ctx.font = '34px serif';
    ctx.fillText(it.emoji, it.x, it.y);

    // Colisão
    if (it.y > 500 && it.y < 570 && it.x > playerX - 10 && it.x < playerX + 60) {
      if (it.good) {
        // PONTUAÇÃO DE CADA ANIMAL DE CADA FASE
        score += pontosPorFase[level];
        scoreEl.textContent = score;

        // SÓ PASSA DA PRIMEIRA FASE COM 200 PONTOS
        if (level === 1) {
          if (score >= 200) {
            level = 2;
            levelEl.textContent = level;
          }
        } else {
          if (score >= level * 200) {
            level++;
            if (level > 5) { win(); return; }
            levelEl.textContent = level;
          }
        }

      } else {
        lives--;
        livesEl.textContent = lives;
        if (lives <= 0) { gameOver(); return; }
      }
      items.splice(i, 1);
    } else if (it.y > 620) {
      items.splice(i, 1);
    }
  }

  ctx.font = '50px serif';
  ctx.fillText('🧑‍🌾', playerX, 560);
  requestAnimationFrame(loop);
}

function gameOver() {
  gameActive = false;
  alert('Game Over! Fez ' + score + ' pontos');
  location.reload();
}

function win() {
  gameActive = false;
  alert('VOCÊ SALVOU A FLORESTA! 🌳 ' + score + ' pontos');
  location.reload();
}

startBtn.onclick = () => {
  capa.classList.add('hidden');
  gameActive = true;
  loop();
  setInterval(() => {
    if (!gameActive) return;
    time--;
    timeEl.textContent = time;
    if (time <= 0) gameOver();
  }, 1000);
};
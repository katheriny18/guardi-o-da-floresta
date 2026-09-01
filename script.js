const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const scoreEl = document.getElementById('score');
const livesEl = document.getElementById('lives');
const timeEl = document.getElementById('time');
const levelEl = document.getElementById('level');
const capa = document.getElementById('capa');
const startBtn = document.getElementById('startBtn');

let score = 0, lives = 3, time = 90, level = 1;
let playerX = 180;
let left = false, right = false;
let items = [];
let gameActive = false;

const animais = ['🦜','🐒','🦋','🐢'];
const perigos = ['🔥','🪓'];

// TECLADO PC - FUNCIONA
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') left = true;
  if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') right = true;
});
document.addEventListener('keyup', (e) => {
  if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') left = false;
  if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') right = false;
});

// CELULAR
const leftBtn = document.getElementById('leftBtn');
const rightBtn = document.getElementById('rightBtn');
leftBtn.addEventListener('touchstart', e => { e.preventDefault(); left = true; });
leftBtn.addEventListener('touchend', () => left = false);
rightBtn.addEventListener('touchstart', e => { e.preventDefault(); right = true; });
rightBtn.addEventListener('touchend', () => right = false);

function loop() {
  if (!gameActive) return;
  ctx.clearRect(0,0,420,600);

  if (left) playerX -= 7;
  if (right) playerX += 7;
  if (playerX < 0) playerX = 0;
  if (playerX > 360) playerX = 360;

  if (Math.random() < 0.05 + level * 0.01) {
    let isGood = Math.random() > 0.35;
    items.push({
      x: Math.random()*380,
      y: -20,
      good: isGood,
      emoji: isGood? animais[Math.floor(Math.random()*animais.length)] : perigos[Math.floor(Math.random()*perigos.length)]
    });
  }

  for (let i = items.length - 1; i >= 0; i--) {
    let it = items[i];
    it.y += 3 + level;
    ctx.font = '32px serif';
    ctx.fillText(it.emoji, it.x, it.y);

    if (it.y > 510 && it.y < 570 && it.x > playerX - 10 && it.x < playerX + 50) {
      if (it.good) {
        score += 20;
        scoreEl.textContent = score;
        if (score >= level * 200) {
          level++;
          if (level > 5) { win(); return; }
          levelEl.textContent = level;
          alert('Fase ' + level + '!');
        }
      } else {
        lives--;
        livesEl.textContent = lives;
        if (lives <= 0) { gameOver(); return; }
      }
      items.splice(i,1);
    } else if (it.y > 610) {
      items.splice(i,1);
    }
  }

  ctx.font = '50px serif';
  ctx.fillText('🧑‍🌾', playerX, 560);
  requestAnimationFrame(loop);
}

function gameOver() {
  gameActive = false;
  alert('Game Over! Você fez ' + score + ' pontos');
  location.reload();
}
function win() {
  gameActive = false;
  alert('VOCÊ VENCEU! Salvou a floresta! 🌳⭐ Pontos: ' + score);
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
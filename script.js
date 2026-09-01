const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const livesEl = document.getElementById('lives');
const timeEl = document.getElementById('time');
const levelEl = document.getElementById('level');
const rules = document.getElementById('rules');
const startBtn = document.getElementById('startBtn');
const leftBtn = document.getElementById('leftBtn');
const rightBtn = document.getElementById('rightBtn');

let score=0, lives=3, time=90, level=1;
let playerX=180;
let keys={left:false, right:false};
let items=[];
let gameActive=false;

// TECLADO PC
document.addEventListener('keydown', e=>{
  if(e.key==='ArrowLeft' || e.key==='a' || e.key==='A') keys.left=true;
  if(e.key==='ArrowRight' || e.key==='d' || e.key==='D') keys.right=true;
});
document.addEventListener('keyup', e=>{
  if(e.key==='ArrowLeft' || e.key==='a' || e.key==='A') keys.left=false;
  if(e.key==='ArrowRight' || e.key==='d' || e.key==='D') keys.right=false;
});

// CELULAR
leftBtn.addEventListener('touchstart', e=>{e.preventDefault(); keys.left=true;});
leftBtn.addEventListener('touchend', ()=>keys.left=false);
rightBtn.addEventListener('touchstart', e=>{e.preventDefault(); keys.right=true;});
rightBtn.addEventListener('touchend', ()=>keys.right=false);
leftBtn.addEventListener('mousedown', ()=>keys.left=true);
leftBtn.addEventListener('mouseup', ()=>keys.left=false);
rightBtn.addEventListener('mousedown', ()=>keys.right=true);
rightBtn.addEventListener('mouseup', ()=>keys.right=false);

function gameLoop(){
  if(!gameActive) return;
  ctx.clearRect(0,0,420,600);
  if(keys.left) playerX-=6;
  if(keys.right) playerX+=6;
  if(playerX<0) playerX=0;
  if(playerX>360) playerX=360;

  if(Math.random()<0.05){
    items.push({x:Math.random()*380, y:-20, good:Math.random()>0.35, emoji: Math.random()>0.35?'🦜':'🔥'});
  }

  for(let i=items.length-1; i>=0; i--){
    let it=items[i];
    it.y+=3+level;
    ctx.font='30px serif';
    ctx.fillText(it.emoji, it.x, it.y);
    if(it.y>520 && it.y<570 && it.x>playerX-10 && it.x<playerX+50){
      if(it.good){score+=20; scoreEl.textContent=score;}
      else {lives--; livesEl.textContent=lives; if(lives<=0){gameOver(); return;}}
      items.splice(i,1);
    } else if(it.y>620){items.splice(i,1);}
  }
  ctx.font='45px serif';
  ctx.fillText('🧑‍🌾', playerX, 560);
  requestAnimationFrame(gameLoop);
}

function gameOver(){
  gameActive=false;
  alert('Fim de jogo! Pontos: '+score);
  location.reload();
}

startBtn.onclick=()=>{
  rules.classList.add('hidden');
  gameActive=true;
  gameLoop();
  setInterval(()=>{
    if(!gameActive) return;
    time--; timeEl.textContent=time;
    if(time<=0){gameOver();}
  },1000);
};
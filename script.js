const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const timeEl = document.getElementById('time');
const livesEl = document.getElementById('lives');
const levelEl = document.getElementById('level');

let score = 0, time = 90, lives = 3, gameActive = false, level = 1;
let player = { x: 180, y: 530, w: 60, h: 40 };
let items = [];
let keys = { left: false, right: false };

const fases = [
  { nome: "Mata Atlântica", cor: "#a5d6a7", meta: 200,
    good: [{emoji:'🐒',points:20},{emoji:'🦜',points:15},{emoji:'🦋',points:10}],
    bad: [{emoji:'🔥',points:-15},{emoji:'🪓',points:-15}] },
  { nome: "Rio Poluído", cor: "#4fc3f7", meta: 400,
    good: [{emoji:'🦫',points:30},{emoji:'🐢',points:25},{emoji:'🐟',points:20}],
    bad: [{emoji:'🧴',points:-20},{emoji:'🛢️',points:-20},{emoji:'🥤',points:-15}] },
  { nome: "Cerrado em Chamas", cor: "#ffcc80", meta: 600,
    good: [{emoji:'🐆',points:40},{emoji:'🦥',points:30},{emoji:'🐜',points:20}],
    bad: [{emoji:'🔥',points:-25},{emoji:'🚜',points:-20},{emoji:'💨',points:-15}] },
  { nome: "Cidade Poluída", cor: "#b0bec5", meta: 800,
    good: [{emoji:'🌳',points:50},{emoji:'🌱',points:35},{emoji:'🐝',points:25}],
    bad: [{emoji:'🏭',points:-30},{emoji:'🚗',points:-25},{emoji:'💨',points:-20}] },
  { nome: "Oceano - FINAL", cor: "#0277bd", meta: 1000,
    good: [{emoji:'🐋',points:60},{emoji:'🐬',points:50},{emoji:'⭐',points:70}],
    bad: [{emoji:'🗑️',points:-35},{emoji:'🥤',points:-35},{emoji:'🛢️',points:-40}] }
];

function getFaseAtual(){
  if(score >= 800) return fases[4];
  if(score >= 600) return fases[3];
  if(score >= 400) return fases[2];
  if(score >= 200) return fases[1];
  return fases[0];
}

function mostrarAvisoFase(){
  const aviso = document.createElement('div');
  aviso.textContent = "🌍 FASE "+level+": "+getFaseAtual().nome+"!";
  Object.assign(aviso.style, {
    position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)',
    background:'gold', color:'black', padding:'15px 25px', borderRadius:'15px',
    fontWeight:'bold', fontSize:'18px', zIndex:'30', boxShadow:'0 10px 20px rgba(0,0,0,0.4)',
    animation:'pop 0.5s ease'
  });
  document.getElementById('gameContainer').appendChild(aviso);
  setTimeout(()=>aviso.remove(), 2500);
}

function spawnItem(){
  const fase = getFaseAtual();
  const isGood = Math.random() > 0.4;
  const lista = isGood? fase.good : fase.bad;
  const tipo = lista[Math.floor(Math.random()*lista.length)];
  items.push({ x:Math.random()*360, y:-40, speed:2+Math.random()*3+(level*0.4), type:tipo, isGood:isGood });
}

// AQUI MUDEI PRA PESSOA
function drawPlayer(){
  ctx.font='42px serif';
  ctx.fillText('🧑‍🌾',player.x,player.y+30);
}

function update(){
  if(!gameActive) return;
  ctx.clearRect(0,0,420,600);
  canvas.style.background = getFaseAtual().cor;

  if(keys.left) player.x-=6; if(keys.right) player.x+=6;
  player.x=Math.max(0,Math.min(360,player.x));

  if(Math.random()<0.06) spawnItem();

  for(let i=items.length-1;i>=0;i--){
    let it=items[i]; it.y+=it.speed;
    ctx.font='32px serif'; ctx.fillText(it.type.emoji,it.x,it.y);
    if(it.y>player.y && it.y<player.y+40 && it.x>player.x-20 && it.x<player.x+60){
      if(it.isGood){ score+=it.type.points; } else { score=Math.max(0,score+it.type.points); lives--; livesEl.textContent=lives; if(lives<=0){ alert('Game Over! Fez '+score+' pts'); location.reload(); return; } }
      scoreEl.textContent=score;
      let novaFase=1;
      if(score>=800) novaFase=5; else if(score>=600) novaFase=4; else if(score>=400) novaFase=3; else if(score>=200) novaFase=2;
      if(novaFase>level){
        level=novaFase; levelEl.textContent=level;
        document.body.className='fase-'+level;
        mostrarAvisoFase();
      }
      items.splice(i,1); continue;
    }
    if(it.y>620) items.splice(i,1);
  }
  drawPlayer(); requestAnimationFrame(update);
}

function startGame(){
  document.getElementById('rules').classList.add('hidden');
  gameActive=true; update();
  setInterval(()=>{ time--; timeEl.textContent=time; if(time<=0){ alert('Fim! Fez '+score+' pts'); location.reload(); } },1000);
}

document.getElementById('startBtn').onclick=startGame;
const leftBtn=document.getElementById('leftBtn'), rightBtn=document.getElementById('rightBtn');
leftBtn.onmousedown=()=>keys.left=true; leftBtn.onmouseup=()=>keys.left=false;
rightBtn.onmousedown=()=>keys.right=true; rightBtn.onmouseup=()=>keys.right=false;
leftBtn.ontouchstart=(e)=>{e.preventDefault();keys.left=true}; leftBtn.ontouchend=()=>keys.left=false;
rightBtn.ontouchstart=(e)=>{e.preventDefault();keys.right=true}; rightBtn.ontouchend=()=>keys.right=false;
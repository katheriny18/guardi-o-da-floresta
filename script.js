const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score'), timeEl = document.getElementById('time'), livesEl = document.getElementById('lives');
let score=0,time=60,lives=3,gameActive=false, level=1;
let player={x:180,y:530,w:60,h:40};
let items=[], keys={left:false,right:false};

// --- 5 FASES DO JOGO ---
const fases = [
  { // FASE 1 - 0 pts
    nome: "Mata Atlântica",
    cor: "#a5d6a7",
    good: [{emoji:'🐒',points:20},{emoji:'🦜',points:15},{emoji:'🦋',points:10}],
    bad: [{emoji:'🔥',points:-15},{emoji:'🪓',points:-15}]
  },
  { // FASE 2 - 50 pts
    nome: "Rio Poluído",
    cor: "#4fc3f7",
    good: [{emoji:'🦫',points:20},{emoji:'🐢',points:15},{emoji:'🐟',points:10}],
    bad: [{emoji:'🧴',points:-20},{emoji:'🛢️',points:-20},{emoji:'🥤',points:-15}]
  },
  { // FASE 3 - 100 pts
    nome: "Cerrado em Chamas",
    cor: "#ffcc80",
    good: [{emoji:'🐆',points:25},{emoji:'🦥',points:20},{emoji:'🐜',points:10}],
    bad: [{emoji:'🔥',points:-25},{emoji:'🚜',points:-20},{emoji:'💨',points:-15}]
  },
  { // FASE 4 - 150 pts
    nome: "Cidade Poluída",
    cor: "#b0bec5",
    good: [{emoji:'🌳',points:30},{emoji:'🌱',points:20},{emoji:'🐝',points:15}],
    bad: [{emoji:'🏭',points:-25},{emoji:'🚗',points:-20},{emoji:'💨',points:-20}]
  },
  { // FASE 5 - 200 pts - FINAL
    nome: "Oceano - Fase Final",
    cor: "#0277bd",
    good: [{emoji:'🐋',points:40},{emoji:'🐬',points:30},{emoji:'⭐',points:50}],
    bad: [{emoji:'🗑️',points:-30},{emoji:'🥤',points:-30},{emoji:'🛢️',points:-35}]
  }
];

function getFaseAtual(){
  if(score >= 200) return fases[4];
  if(score >= 150) return fases[3];
  if(score >= 100) return fases[2];
  if(score >= 50) return fases[1];
  return fases[0];
}

function spawnItem(){
  const fase = getFaseAtual();
  const isGood = Math.random() > 0.35;
  const lista = isGood? fase.good : fase.bad;
  const tipo = lista[Math.floor(Math.random()*lista.length)];
  items.push({x:Math.random()*360,y:-40,speed:2+Math.random()*3+level,type:tipo,isGood:isGood});
}

function drawPlayer(){ ctx.font='40px serif'; ctx.fillText('🦊',player.x,player.y+30); }

function update(){
  if(!gameActive) return;
  ctx.clearRect(0,0,420,600);

  // muda cor de fundo da fase
  canvas.style.background = getFaseAtual().cor;

  if(keys.left) player.x-=6; if(keys.right) player.x+=6;
  player.x=Math.max(0,Math.min(360,player.x));

  if(Math.random()<0.05) spawnItem();

  for(let i=items.length-1;i>=0;i--){
    let it=items[i]; it.y+=it.speed;
    ctx.font='32px serif'; ctx.fillText(it.type.emoji,it.x,it.y);
    if(it.y>player.y && it.y<player.y+40 && it.x>player.x-20 && it.x<player.x+60){
      if(it.isGood){ score+=it.type.points; } else { score=Math.max(0,score+it.type.points); lives--; livesEl.textContent=lives; if(lives<=0){ alert('Game Over! Fez '+score+' pts'); location.reload(); return; } }
      scoreEl.textContent=score;

      // CHECA PASSAGEM DE FASE
      let novaFase = 1;
      if(score >= 200) novaFase=5; else if(score >=150) novaFase=4; else if(score >=100) novaFase=3; else if(score >=50) novaFase=2;
      if(novaFase > level){
        level=novaFase;
        alert("🌍 FASE "+level+" DESBLOQUEADA: "+getFaseAtual().nome+"!");
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
  setInterval(()=>{ time--; timeEl.textContent=time; if(time<=0){ alert('Tempo! Fez '+score+' pts na fase '+level); location.reload(); } },1000);
}

document.getElementById('startBtn').onclick=startGame;
const leftBtn=document.getElementById('leftBtn'), rightBtn=document.getElementById('rightBtn');
leftBtn.onmousedown=()=>keys.left=true; leftBtn.onmouseup=()=>keys.left=false;
rightBtn.onmousedown=()=>keys.right=true; rightBtn.onmouseup=()=>keys.right=false;
leftBtn.ontouchstart=(e)=>{e.preventDefault();keys.left=true}; leftBtn.ontouchend=()=>keys.left=false;
rightBtn.ontouchstart=(e)=>{e.preventDefault();keys.right=true}; rightBtn.ontouchend=()=>keys.right=false;
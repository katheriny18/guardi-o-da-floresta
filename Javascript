const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score'), timeEl = document.getElementById('time'), livesEl = document.getElementById('lives');
let score=0,time=60,lives=3,gameActive=false;
let player={x:180,y:530,w:60,h:40};
let items=[], keys={left:false,right:false};

const goodTypes=[{emoji:'🐒',points:20},{emoji:'🐆',points:15},{emoji:'🦜',points:10},{emoji:'🦫',points:10}];
const badTypes=[{emoji:'🔥',points:-15},{emoji:'🪓',points:-15},{emoji:'🗑️',points:-15}];

function spawnItem(){
  const isGood = Math.random() > 0.35;
  const lista = isGood? goodTypes : badTypes;
  const tipo = lista[Math.floor(Math.random()*lista.length)];
  items.push({x:Math.random()*380,y:-40,speed:2+Math.random()*3,type:tipo,isGood:isGood});
}
function drawPlayer(){ ctx.font='40px serif'; ctx.fillText('🧑‍🌾',player.x,player.y+30); }
function update(){
  if(!gameActive) return;
  ctx.clearRect(0,0,420,600);
  if(keys.left) player.x-=6; if(keys.right) player.x+=6;
  player.x=Math.max(0,Math.min(360,player.x));
  if(Math.random()<0.04) spawnItem();
  for(let i=items.length-1;i>=0;i--){
    let it=items[i]; it.y+=it.speed;
    ctx.font='32px serif'; ctx.fillText(it.type.emoji,it.x,it.y);
    if(it.y>player.y && it.y<player.y+40 && it.x>player.x-20 && it.x<player.x+60){
      if(it.isGood) score+=it.type.points; else { score=Math.max(0,score+it.type.points); lives--; livesEl.textContent=lives; if(lives<=0){ alert('Fim! Fez '+score+' pts'); location.reload(); return; } }
      scoreEl.textContent=score; items.splice(i,1); continue;
    }
    if(it.y>620) items.splice(i,1);
  }
  drawPlayer(); requestAnimationFrame(update);
}
function startGame(){
  document.getElementById('rules').classList.add('hidden');
  gameActive=true; update();
  setInterval(()=>{ time--; timeEl.textContent=time; if(time<=0){ alert('Tempo! Fez '+score+' pts'); location.reload(); } },1000);
}
document.getElementById('startBtn').onclick=startGame;
leftBtn.onmousedown=()=>keys.left=true; leftBtn.onmouseup=()=>keys.left=false;
rightBtn.onmousedown=()=>keys.right=true; rightBtn.onmouseup=()=>keys.right=false;
leftBtn.ontouchstart=(e)=>{e.preventDefault();keys.left=true}; leftBtn.ontouchend=()=>keys.left=false;
rightBtn.ontouchstart=(e)=>{e.preventDefault();keys.right=true}; rightBtn.ontouchend=()=>keys.right=false;
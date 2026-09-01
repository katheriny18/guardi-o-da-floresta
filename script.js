const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const timeEl = document.getElementById('time');
const livesEl = document.getElementById('lives');
const levelEl = document.getElementById('level');

let score=0,time=90,lives=3,gameActive=false,level=1;
let player={x:180,y:530};
let items=[], keys={left:false,right:false};

const fases=[
 {nome:"Mata",cor:"#a5d6a7",good:['🐒','🦜','🦋'],pts:[20,15,10],bad:['🔥','🪓']},
 {nome:"Rio",cor:"#4fc3f7",good:['🦫','🐢','🐟'],pts:[30,25,20],bad:['🧴','🛢️','🥤']},
 {nome:"Cerrado",cor:"#ffcc80",good:['🐆','🦥','🐜'],pts:[40,30,20],bad:['🔥','🚜']},
 {nome:"Cidade",cor:"#b0bec5",good:['🌳','🌱','🐝'],pts:[50,35,25],bad:['🏭','🚗']},
 {nome:"Oceano",cor:"#0277bd",good:['🐋','🐬','⭐'],pts:[60,50,70],bad:['🗑️','🥤']}
];

function getFase(){
 if(score>=800) return 4; if(score>=600) return 3; if(score>=400) return 2; if(score>=200) return 1; return 0;
}

function spawn(){
 let f=fases[getFase()];
 let isGood=Math.random()>0.35;
 let emoji;
 let p=10;
 if(isGood){ let i=Math.floor(Math.random()*f.good.length); emoji=f.good[i]; p=f.pts[i]; }
 else { emoji=f.bad[Math.floor(Math.random()*f.bad.length)]; p=-15; }
 if(items.length<15) items.push({x:Math.random()*380,y:-30,speed:2+Math.random()*2,emoji:emoji,points:p,good:isGood});
}

function loop(){
 if(!gameActive) return;
 ctx.clearRect(0,0,420,600);
 if(keys.left) player.x-=7; if(keys.right) player.x+=7;
 player.x=Math.max(0,Math.min(360,player.x));
 if(Math.random()<0.04) spawn();
 for(let i=items.length-1;i>=0;i--){
  let it=items[i]; it.y+=it.speed;
  ctx.font='30px serif'; ctx.fillText(it.emoji,it.x,it.y);
  if(it.y>530 && it.y<570 && it.x>player.x-15 && it.x<player.x+50){
   if(it.good) score+=it.points; else {score=Math.max(0,score+it.points); lives--; livesEl.textContent=lives;}
   scoreEl.textContent=score;
   let nf=getFase()+1;
   if(nf>level){
    level=nf; levelEl.textContent=level;
    document.body.className='fase-'+level;
    canvas.style.background=fases[getFase()].cor;
    let av=document.createElement('div');
    av.textContent='FASE '+level; av.style.cssText='position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);background:gold;padding:12px 20px;border-radius:10px;font-weight:bold;z-index:20';
    document.getElementById('gameContainer').appendChild(av); setTimeout(()=>av.remove(),1200);
   }
   items.splice(i,1); continue;
  }
  if(it.y>610) items.splice(i,1);
 }
 ctx.font='40px serif'; ctx.fillText('🧑‍🌾',player.x,player.y);
 if(lives<=0 || time<=0){ gameActive=false; alert('Fim! '+score+' pontos'); location.reload(); return; }
 requestAnimationFrame(loop);
}

document.getElementById('startBtn').onclick=()=>{
 document.getElementById('rules').classList.add('hidden');
 gameActive=true; canvas.style.background=fases[0].cor; loop();
 setInterval(()=>{if(gameActive){time--; timeEl.textContent=time}},1000);
};
const lb=document.getElementById('leftBtn'), rb=document.getElementById('rightBtn');
lb.ontouchstart=(e)=>{e.preventDefault();keys.left=true}; lb.ontouchend=()=>keys.left=false;
rb.ontouchstart=(e)=>{e.preventDefault();keys.right=true}; rb.ontouchend=()=>keys.right=false;
lb.onmousedown=()=>keys.left=true; lb.onmouseup=()=>keys.left=false;
rb.onmousedown=()=>keys.right=true; rb.onmouseup=()=>keys.right=false;






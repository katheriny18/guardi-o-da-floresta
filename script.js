const canvas=document.getElementById('canvas'),ctx=canvas.getContext('2d');
const scoreEl=document.getElementById('score'),livesEl=document.getElementById('lives'),timeEl=document.getElementById('time'),levelEl=document.getElementById('level');
const capa=document.getElementById('capa'),startBtn=document.getElementById('startBtn'),leftBtn=document.getElementById('leftBtn'),rightBtn=document.getElementById('rightBtn'),avisoEl=document.getElementById('avisoFase');
let score=0,lives=3,time=90,level=1,playerX=180,left=false,right=false,items=[],gameActive=false;

const animaisPorFase={
  1: ['🦜','🐒','🦋'],
  2: ['🐢','🐊','🐸'],
  3: ['🐆','🦥','🐍'],
  4: ['🦉','🦇','🦝'],
  5: ['🦜','🐒','🦋','🐢','🐊','🐆']
};
const pontosPorFase={1:20,2:30,3:40,4:50,5:60};
const perigos=['🔥','🪓'];
const nomesFases={2:"FASE 2 - PANTANAL!",3:"FASE 3 - MATA FECHADA!",4:"FASE 4 - NOITE NA FLORESTA!",5:"FASE FINAL - TODOS OS ANIMAIS!"};

document.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='a')left=true;if(e.key==='ArrowRight'||e.key==='d')right=true});
document.addEventListener('keyup',e=>{if(e.key==='ArrowLeft'||e.key==='a')left=false;if(e.key==='ArrowRight'||e.key==='d')right=false});
leftBtn.addEventListener('touchstart',e=>{e.preventDefault();left=true});leftBtn.addEventListener('touchend',()=>left=false);
rightBtn.addEventListener('touchstart',e=>{e.preventDefault();right=true});rightBtn.addEventListener('touchend',()=>right=false);

function loop(){
  if(!gameActive)return;
  ctx.clearRect(0,0,420,600);
  if(left)playerX-=6;if(right)playerX+=6;
  if(playerX<0)playerX=0;if(playerX>360)playerX=360;

  if(Math.random()<0.05+level*0.01){
    let isGood=Math.random()>0.35;
    let lista=animaisPorFase[level];
    let emoji=isGood?lista[Math.floor(Math.random()*lista.length)]:perigos[Math.floor(Math.random()*perigos.length)];
    items.push({x:Math.random()*380,y:-20,good:isGood,emoji});
  }
  for(let i=items.length-1;i>=0;i--){
    let it=items[i];it.y+=3+level;
    ctx.font='34px serif';ctx.fillText(it.emoji,it.x,it.y);
    if(it.y>500&&it.y<570&&it.x>playerX-10&&it.x<playerX+60){
      if(it.good){
        score+=pontosPorFase[level];scoreEl.textContent=score;
        if(score>=level*200){
          if(level===1 && score<200){} else {
            if(level>=5){win();return}
            gameActive=false;
            avisoEl.innerHTML=`<span>🎉</span>${nomesFases[level+1]}<br><small style="font-size:16px;margin-top:10px;">Cada animal agora vale ${pontosPorFase[level+1]} pontos!</small>`;
            avisoEl.classList.remove('hidden');
            let proximoLevel=level+1;
            setTimeout(()=>{
              avisoEl.classList.add('hidden');
              level=proximoLevel;
              levelEl.textContent=level;
              gameActive=true;
              loop();
            },2500);
            items.splice(i,1);
            return;
          }
        }
      }else{lives--;livesEl.textContent=lives;if(lives<=0){gameOver();return}}
      items.splice(i,1);
    }else if(it.y>620)items.splice(i,1);
  }
  ctx.font='50px serif';ctx.fillText('🧑‍🌾',playerX,560);
  requestAnimationFrame(loop);
}
function gameOver(){gameActive=false;alert('Game Over! '+score+' pts');location.reload()}
function win(){gameActive=false;alert('VENCEU! SALVOU A FLORESTA 🌳 '+score+' pts');location.reload()}
startBtn.onclick=()=>{
  capa.classList.add('hidden');gameActive=true;loop();
  setInterval(()=>{if(!gameActive)return;time--;timeEl.textContent=time;if(time<=0)gameOver()},1000);
};
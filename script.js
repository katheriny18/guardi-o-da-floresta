const canvas=document.getElementById('canvas'),ctx=canvas.getContext('2d');
const scoreEl=document.getElementById('score'),livesEl=document.getElementById('lives'),timeEl=document.getElementById('time'),levelEl=document.getElementById('level');
const capa=document.getElementById('capa'),avisoEl=document.getElementById('avisoFase'),startBtn=document.getElementById('startBtn'),leftBtn=document.getElementById('leftBtn'),rightBtn=document.getElementById('rightBtn');
const avisoTitulo=document.getElementById('avisoTitulo'),avisoTexto=document.getElementById('avisoTexto'),avisoEmoji=document.getElementById('avisoEmoji');
let score=0,lives=3,time=120,level=1,playerX=180,left=false,right=false,items=[],gameActive=false;

// ANIMAIS POR FASE - REGRAS NOVAS
const animaisPorFase={
  1: ['🦜','🐒'], // FASE 1: Arara-azul (SÓ AQUI) + Mico-leão
  2: ['🐢','🦦'], // FASE 2: Tartaruga + Ariranha
  3: ['🐆','🐺'], // FASE 3: Onça + Lobo-guará
  4: ['🦥','🐊'], // FASE 4: Tamanduá + Jacaré-açu
  5: ['🐆','🐺','🦥','🦦','🐊'] // FASE 5 FINAL: SEM arara e SEM tartaruga
};

// OBSTÁCULOS QUE MUDAM POR FASE
const obstaculosPorFase={
  1: ['🔥','🪓'], // Desmatamento
  2: ['🛢️','🥤'], // Poluição
  3: ['🏗️','🚜'], // Construção
  4: ['🔫','🪤'], // Caça
  5: ['🔥','🛢️','🔫','🏗️'] // Tudo junto na final
};

const nomeAnimal={'🦜':'Arara-azul','🐒':'Mico-leão','🐢':'Tartaruga','🐆':'Onça-pintada','🐺':'Lobo-guará','🦥':'Tamanduá','🦦':'Ariranha','🐊':'Jacaré-açu'};
const nomeObstaculo={'🔥':'Fogo','🪓':'Machado','🛢️':'Óleo','🥤':'Lixo','🏗️':'Construção','🚜':'Trator','🔫':'Caça','🪤':'Armadilha'};
const pontosPorFase={1:20,2:30,3:40,4:50,5:60};
const metaParaPassar={1:200,2:400,3:800,4:1200,5:2000};

const coresFase={
  1:{body:'#a5d6a7',canvas:'#e8f5e9',topo:'#1b5e20',nome:'MATA ATLÂNTICA'},
  2:{body:'#81d4fa',canvas:'#e1f5fe',topo:'#01579b',nome:'PANTANAL'},
  3:{body:'#ffcc80',canvas:'#fff3e0',topo:'#e65100',nome:'CERRADO'},
  4:{body:'#b39ddb',canvas:'#ede7f6',topo:'#311b92',nome:'AMAZÔNIA PROFUNDA'},
  5:{body:'#ffd54f',canvas:'#fffde7',topo:'#bf360c',nome:'FASE FINAL'}
};

function mudarFundo(f){let c=coresFase[f];document.body.style.background=c.body;canvas.style.background=c.canvas;document.getElementById('topo').style.background=c.topo;}
function mostrarAviso(novaFase){
  gameActive=false;
  let c=coresFase[novaFase];
  mudarFundo(novaFase);
  avisoEmoji.textContent=animaisPorFase[novaFase][0];
  avisoTitulo.textContent=`FASE ${novaFase} - ${c.nome}`;
  avisoTexto.innerHTML=`Meta: ${metaParaPassar[novaFase-1]} pts feita!<br><br>Salve: ${animaisPorFase[novaFase].map(e=>nomeAnimal[e]).join(' + ')}<br>Cuidado: ${obstaculosPorFase[novaFase].map(e=>nomeObstaculo[e]).join(' e ')}<br><br>Próxima meta: ${metaParaPassar[novaFase]} pts`;
  avisoEl.classList.remove('hidden');
  setTimeout(()=>{avisoEl.classList.add('hidden');level=novaFase;levelEl.textContent=level;gameActive=true;loop();},3500);
}

document.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='a')left=true;if(e.key==='ArrowRight'||e.key==='d')right=true});
document.addEventListener('keyup',e=>{if(e.key==='ArrowLeft'||e.key==='a')left=false;if(e.key==='ArrowRight'||e.key==='d')right=false});
leftBtn.ontouchstart=e=>{e.preventDefault();left=true};leftBtn.ontouchend=()=>left=false;
rightBtn.ontouchstart=e=>{e.preventDefault();right=true};rightBtn.ontouchend=()=>right=false;

function loop(){
  if(!gameActive)return;
  ctx.clearRect(0,0,420,600);
  if(left)playerX-=6;if(right)playerX+=6;if(playerX<0)playerX=0;if(playerX>360)playerX=360;
  if(Math.random()<0.055){
    let isGood=Math.random()>0.38;
    let emoji;
    if(isGood){
      let lista=animaisPorFase[level];
      emoji=lista[Math.floor(Math.random()*lista.length)];
    }else{
      let lista=obstaculosPorFase[level];
      emoji=lista[Math.floor(Math.random()*lista.length)];
    }
    items.push({x:Math.random()*380,y:-20,good:isGood,emoji});
  }
  for(let i=items.length-1;i>=0;i--){
    let it=items[i];it.y+=4+level*0.6;ctx.font='36px serif';ctx.fillText(it.emoji,it.x,it.y);
    if(it.y>500&&it.y<570&&it.x>playerX-15&&it.x<playerX+60){
      if(it.good){score+=pontosPorFase[level];scoreEl.textContent=score;
        if(score>=metaParaPassar[level]){if(level===5){alert('VENCEU! 🌳 Você salvou todos! '+score+' pts');location.reload();return}items=[];mostrarAviso(level+1);return}
      }else{lives--;livesEl.textContent=lives;if(lives<=0){alert('Game Over! '+score+' pts');location.reload();return}}
      items.splice(i,1);
    }else if(it.y>620)items.splice(i,1);
  }
  ctx.font='50px serif';ctx.fillText('🧑‍🌾',playerX,560);requestAnimationFrame(loop);
}
startBtn.onclick=()=>{capa.classList.add('hidden');mudarFundo(1);gameActive=true;loop();setInterval(()=>{if(!gameActive)return;time--;timeEl.textContent=time;if(time<=0){alert('Acabou o tempo!');location.reload()}},1000);};
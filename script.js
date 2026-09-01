const canvas=document.getElementById('canvas'),ctx=canvas.getContext('2d');
const scoreEl=document.getElementById('score'),livesEl=document.getElementById('lives'),timeEl=document.getElementById('time'),levelEl=document.getElementById('level');
const capa=document.getElementById('capa'),avisoEl=document.getElementById('avisoFase'),startBtn=document.getElementById('startBtn'),leftBtn=document.getElementById('leftBtn'),rightBtn=document.getElementById('rightBtn');
const avisoTitulo=document.getElementById('avisoTitulo'),avisoTexto=document.getElementById('avisoTexto'),avisoEmoji=document.getElementById('avisoEmoji');
let score=0,lives=3,time=90,level=1,playerX=180,left=false,right=false,items=[],gameActive=false;

// SÓ ANIMAIS EM EXTINÇÃO DO BRASIL
const animaisPorFase={
  1: ['🦜','🐒','🐢'], // Arara-azul, Mico-leão-dourado, Tartaruga-marinha
  2: ['🐆','🐺','🦥'], // Onça-pintada, Lobo-guará, Tamanduá-bandeira
  3: ['🦦','🐊','🦜'], // Ariranha, Jacaré-açu, Papagaio-de-cara-roxa
  4: ['🐆','🦜','🐒','🐢'], // Mistura
  5: ['🦜','🐒','🐢','🐆','🐺','🦥','🦦'] // Todos em extinção
};
const nomeAnimal={'🦜':'Arara-azul','🐒':'Mico-leão','🐢':'Tartaruga','🐆':'Onça','🐺':'Lobo-guará','🦥':'Tamanduá','🦦':'Ariranha','🐊':'Jacaré-açu'};
const pontosPorFase={1:20,2:30,3:40,4:50,5:60};

const coresFase={
  1:{body:'#a5d6a7',canvas:'#e8f5e9',topo:'#1b5e20',nome:'MATA ATLÂNTICA'},
  2:{body:'#81d4fa',canvas:'#e1f5fe',topo:'#01579b',nome:'PANTANAL'},
  3:{body:'#ffcc80',canvas:'#fff3e0',topo:'#e65100',nome:'CERRADO / AMAZÔNIA'},
  4:{body:'#c8e6c9',canvas:'#f1f8e9',topo:'#2e7d32',nome:'RESERVA FINAL'},
  5:{body:'#ffd54f',canvas:'#fffde7',topo:'#f57f17',nome:'FLORESTA SALVA'}
};

document.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='a')left=true;if(e.key==='ArrowRight'||e.key==='d')right=true});
document.addEventListener('keyup',e=>{if(e.key==='ArrowLeft'||e.key==='a')left=false;if(e.key==='ArrowRight'||e.key==='d')right=false});
leftBtn.ontouchstart=e=>{e.preventDefault();left=true};leftBtn.ontouchend=()=>left=false;
rightBtn.ontouchstart=e=>{e.preventDefault();right=true};rightBtn.ontouchend=()=>right=false;

function mudarFundoFase(f){let c=coresFase[f];document.body.style.background=c.body;canvas.style.background=c.canvas;document.getElementById('topo').style.background=c.topo;}
function mostrarAviso(novaFase){
  gameActive=false;let c=coresFase[novaFase];
  avisoEmoji.textContent=animaisPorFase[novaFase][0];
  avisoTitulo.textContent=`FASE ${novaFase} - ${c.nome}!`;
  avisoTexto.innerHTML=`Você salvou ${score} animais!<br>Agora salve:<br>${animaisPorFase[novaFase].map(e=>nomeAnimal[e]).join(', ')}<br><br>Vale ${pontosPorFase[novaFase]} pontos!`;
  avisoEl.classList.remove('hidden');mudarFundoFase(novaFase);
  setTimeout(()=>{avisoEl.classList.add('hidden');level=novaFase;levelEl.textContent=level;gameActive=true;loop();},3000);
}
function loop(){
  if(!gameActive)return;
  ctx.clearRect(0,0,420,600);
  if(left)playerX-=6;if(right)playerX+=6;if(playerX<0)playerX=0;if(playerX>360)playerX=360;
  if(Math.random()<0.05){
    let isGood=Math.random()>0.4;let lista=animaisPorFase[level];
    let emoji=isGood?lista[Math.floor(Math.random()*lista.length)]:['🔥','🪓','🪵'][Math.floor(Math.random()*3)];
    items.push({x:Math.random()*380,y:-20,good:isGood,emoji});
  }
  for(let i=items.length-1;i>=0;i--){
    let it=items[i];it.y+=4+level;ctx.font='34px serif';ctx.fillText(it.emoji,it.x,it.y);
    if(it.y>500&&it.y<570&&it.x>playerX-10&&it.x<playerX+60){
      if(it.good){
        score+=pontosPorFase[level];scoreEl.textContent=score;
        if(level===1&&score>=200){items=[];mostrarAviso(2);return}
        if(level===2&&score>=400){items=[];mostrarAviso(3);return}
        if(level===3&&score>=600){items=[];mostrarAviso(4);return}
        if(level===4&&score>=800){items=[];mostrarAviso(5);return}
        if(level===5&&score>=1000){win();return}
      }else{lives--;livesEl.textContent=lives;if(lives<=0){gameOver();return}}
      items.splice(i,1);
    }else if(it.y>620)items.splice(i,1);
  }
  ctx.font='50px serif';ctx.fillText('🧑‍🌾',playerX,560);requestAnimationFrame(loop);
}
function gameOver(){gameActive=false;alert('Game Over! Você salvou '+score+' animais em extinção');location.reload()}
function win(){gameActive=false;alert('VOCÊ SALVOU TODOS! 🌳 '+score+' animais salvos!');location.reload()}
startBtn.onclick=()=>{capa.classList.add('hidden');mudarFundoFase(1);gameActive=true;loop();setInterval(()=>{if(!gameActive)return;time--;timeEl.textContent=time;if(time<=0)gameOver()},1000);}
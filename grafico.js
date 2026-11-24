/* grafico.js — ferramentas de desenho compartilhadas pelos jogos do hub.
   Tudo fica dentro do objeto G para não misturar com o código de cada jogo. */
const G=(()=>{
  /* Converte uma variável de cor do CSS (ex.: '--blue') numa cor que o canvas entende */
  let el=null;
  const cor=v=>{if(!el){el=document.createElement('i');el.style.display='none';document.body.appendChild(el);}
    el.style.color=`var(${v})`;return getComputedStyle(el).color;};

  /* Números no formato brasileiro: vírgula decimal e sinal de menos de verdade */
  const fmt=(v,d=3)=>{if(!isFinite(v))return v>0?'+∞':v<0?'−∞':'—';
    return(v<0&&Math.abs(v)>=Math.pow(10,-d)/2?'−':'')+String(+Math.abs(v).toFixed(d)).replace('.',',');};

  /* Embaralha uma lista (algoritmo de Fisher–Yates) */
  const emb=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};

  /* Espaçamento "redondo" para a grade (1, 2, 5, 10, 20…) */
  const passo=r=>{const b=Math.pow(10,Math.floor(Math.log10(r/6)));for(const k of[1,2,5,10])if(r/(b*k)<=10)return b*k;return b*10;};

  /* Prepara um canvas que se ajusta ao tamanho da caixa e à densidade da tela */
  function tela(canvas){
    const s={c:canvas,ctx:canvas.getContext('2d'),W:0,H:0,dpr:1},box=canvas.parentElement;
    new ResizeObserver(()=>{s.dpr=devicePixelRatio||1;s.W=box.clientWidth;s.H=box.clientHeight;
      canvas.width=Math.round(s.W*s.dpr);canvas.height=Math.round(s.H*s.dpr);}).observe(box);
    s.limpa=()=>{s.ctx.setTransform(s.dpr,0,0,s.dpr,0,0);s.ctx.clearRect(0,0,s.W,s.H);};
    return s;
  }

  /* Cria um plano cartesiano: converte coordenadas do mundo (x, y) em pixels (X, Y) e vice-versa.
     o.igual = true usa a mesma escala nos dois eixos (necessário quando a inclinação precisa ser fiel). */
  function plano(s,v,o={}){
    const mL=o.mL??48,mR=o.mR??14,mT=o.mT??14,mB=o.mB??34,w=s.W-mL-mR,h=s.H-mT-mB;
    let{x0,x1,y0,y1}=v;
    if(o.igual){const u=Math.min(w/(x1-x0),h/(y1-y0)),cx=(x0+x1)/2,cy=(y0+y1)/2;x0=cx-w/u/2;x1=cx+w/u/2;y0=cy-h/u/2;y1=cy+h/u/2;}
    return{s,x0,x1,y0,y1,mL,mR,mT,mB,
      X:x=>mL+(x-x0)/(x1-x0)*w,Y:y=>mT+(y1-y)/(y1-y0)*h,
      xi:px=>x0+(px-mL)/w*(x1-x0),yi:py=>y1-(py-mT)/h*(y1-y0)};
  }

  /* Desenha grade, eixos e números nas margens */
  function grade(p,o={}){
    const c=p.s.ctx,{X,Y,x0,x1,y0,y1,mL,mR,mT,mB}=p,W=p.s.W,H=p.s.H;
    const sx=o.sx||passo(x1-x0),sy=o.sy||passo(y1-y0),xs=[],ys=[];
    for(let x=Math.ceil(x0/sx-1e-9)*sx;x<=x1+1e-9;x+=sx)xs.push(+x.toFixed(6));
    for(let y=Math.ceil(y0/sy-1e-9)*sy;y<=y1+1e-9;y+=sy)ys.push(+y.toFixed(6));
    c.save();c.strokeStyle=cor('--line');c.lineWidth=1;c.beginPath();
    for(const x of xs){c.moveTo(X(x),mT);c.lineTo(X(x),H-mB);}
    for(const y of ys){c.moveTo(mL,Y(y));c.lineTo(W-mR,Y(y));}c.stroke();
    c.strokeStyle=cor('--mut');c.lineWidth=1.8;c.beginPath();
    if(y0<=0&&y1>=0){c.moveTo(mL,Y(0));c.lineTo(W-mR,Y(0));}
    if(x0<=0&&x1>=0){c.moveTo(X(0),mT);c.lineTo(X(0),H-mB);}c.stroke();
    c.fillStyle=cor('--mut');c.font='13px Archivo,sans-serif';
    c.textAlign='right';for(const y of ys)c.fillText(o.fy?o.fy(y):fmt(y),mL-7,Y(y)+4);
    c.textAlign='center';for(const x of xs)if(!(o.pula&&o.pula(x)))c.fillText(o.fx?o.fx(x):fmt(x),X(x),H-mB+19);
    c.font='600 13px Archivo,sans-serif';
    if(o.tx){c.textAlign='right';c.fillText(o.tx,W-mR-4,H-mB-8);}
    if(o.ty){c.textAlign='left';c.fillText(o.ty,mL+8,mT+14);}
    c.restore();
  }

  /* Limita o desenho à área do gráfico (chame G.solta depois) */
  const prende=p=>{const c=p.s.ctx;c.save();c.beginPath();c.rect(p.mL,p.mT,p.s.W-p.mL-p.mR,p.s.H-p.mT-p.mB);c.clip();};
  const solta=p=>p.s.ctx.restore();

  /* Desenha y = f(x), interrompendo onde a função não existe ou dá saltos grandes */
  function curva(p,f,corL,lw=3.5,o={}){
    const c=p.s.ctx,span=p.y1-p.y0,a=o.de??p.x0,b=o.ate??p.x1;prende(p);
    c.strokeStyle=corL;c.lineWidth=lw;c.lineJoin='round';c.lineCap='round';c.setLineDash(o.dash||[]);if(o.brilho){c.shadowColor=corL;c.shadowBlur=o.brilho;}
    c.beginPath();let on=false,ya=null;
    for(let px=p.X(a);px<=p.X(b)+.75;px+=1.5){const x=Math.min(p.xi(px),b),y=f(x);
      const ok=isFinite(y)&&Math.abs(y)<1e7&&!(ya!==null&&Math.abs(y-ya)>span*1.5);
      if(ok&&on)c.lineTo(px,p.Y(y));else if(ok)c.moveTo(px,p.Y(y));on=ok;ya=ok?y:null;}
    c.stroke();c.setLineDash([]);solta(p);
  }

  const ponto=(c,x,y,r,fill,stroke,lw=2.5)=>{c.beginPath();c.arc(x,y,r,0,7);if(fill){c.fillStyle=fill;c.fill();}if(stroke){c.strokeStyle=stroke;c.lineWidth=lw;c.stroke();}};

  /* Etiqueta com fundo, para textos sobre o gráfico */
  function rotulo(c,t,x,y,corT,o={}){
    c.save();c.font=o.font||'700 13px Archivo,sans-serif';const w=c.measureText(t).width+12;
    if(o.dir)x-=w;if(o.centro)x-=w/2;
    c.fillStyle='rgba(7,6,26,.92)';c.strokeStyle=corT||cor('--line');c.lineWidth=2;c.beginPath();c.rect(x,y-11,w,22);c.fill();c.stroke();
    c.fillStyle=corT||cor('--ink');c.textAlign='left';c.fillText(t,x+6,y+5);c.restore();return w;
  }

  /* Recorde salvo no navegador (pode não existir: por isso o try) */
  function recorde(chave,valor,menorMelhor=false){
    try{const r=localStorage.getItem(chave),antigo=r===null?null:+r;
      const novo=antigo===null||(menorMelhor?valor<antigo:valor>antigo);if(novo)localStorage.setItem(chave,valor);
      return{antigo,novo};}catch(e){return{antigo:null,novo:false};}
  }

  /* Tela de fim de jogo */
  function fim(el,o){
    const r=o.rec;
    el.innerHTML=`<div class="fim"><h3>${o.titulo}</h3><b>${o.valor}</b><p>${o.detalhe||''}</p>
      <p>${r&&r.novo?'Novo recorde!':r&&r.antigo!==null?'Recorde: '+(o.fr?o.fr(r.antigo):r.antigo):''}</p>
      <div class="acts" style="justify-content:center"><button class="pri" id="gDeNovo">Jogar de novo</button><a class="btn" href="index.html">Voltar ao hub</a></div></div>`;
    document.getElementById('gDeNovo').onclick=()=>location.reload();
  }


  /* Pixel art: cada linha é um texto; cada letra vira um "pixel" com a cor da paleta ('.' = transparente) */
  function sprite(c,linhas,pal,x,y,px,o={}){
    const h=linhas.length,w=linhas[0].length;c.save();c.translate(x,y);if(o.rot)c.rotate(o.rot);if(o.vira)c.scale(-1,1);
    for(let j=0;j<h;j++)for(let i=0;i<w;i++){const k=linhas[j][i];if(k==='.'||!pal[k])continue;c.fillStyle=pal[k];c.fillRect((i-w/2)*px,(j-h/2)*px,px+.4,px+.4);}
    c.restore();
  }
  /* Textos de pontuação que sobem e somem ("+10 PERFEITO!") */
  const pops=[];
  const pop=(t,x,y,corT)=>pops.push({t,x,y,corT,t0:performance.now()});
  function desenhaPops(c){const now=performance.now();
    for(let i=pops.length-1;i>=0;i--){const p=pops[i],k=(now-p.t0)/1200;if(k>1){pops.splice(i,1);continue;}
      c.save();c.globalAlpha=1-k*k;c.font='13px "Press Start 2P",monospace';c.textAlign='center';c.lineWidth=5;c.strokeStyle='#000';c.fillStyle=p.corT;
      c.strokeText(p.t,p.x,p.y-46*k);c.fillText(p.t,p.x,p.y-46*k);c.restore();}}
  /* Partículas de explosão/brilho */
  const parts=[];
  function explode(x,y,cores,n=28,forca=4){for(let i=0;i<n;i++){const a=Math.random()*6.283,v=1+Math.random()*forca;
    parts.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-2,vida:1,cor:cores[i%cores.length]});}}
  function desenhaParts(c){for(let i=parts.length-1;i>=0;i--){const p=parts[i];p.x+=p.vx;p.y+=p.vy;p.vy+=.14;p.vida-=.018;
    if(p.vida<=0){parts.splice(i,1);continue;}c.globalAlpha=p.vida;c.fillStyle=p.cor;c.fillRect(p.x-2,p.y-2,4,4);}c.globalAlpha=1;}
  /* Texto em fonte de fliperama com contorno preto */
  function arcade(c,t,x,y,corT,tam=14,al='center'){c.save();c.font=`${tam}px "Press Start 2P",monospace`;c.textAlign=al;c.lineWidth=Math.max(3,tam/3);c.strokeStyle='#000';c.strokeText(t,x,y);c.fillStyle=corT;c.fillText(t,x,y);c.restore();}


  /* Tutorial: janela passo a passo (abre sozinha na 1ª visita) + guia fixo no fim da página.
     O conteúdo de cada jogo fica em tutoriais.js (objeto TUTORIAIS). */
  function tutorial(id){
    const T=(typeof TUTORIAIS!=='undefined'?TUTORIAIS:{})[id];if(!T)return;let i=0,ultimoFoco=null;
    const box=document.createElement('div');box.className='tuto';box.hidden=true;box.setAttribute('role','dialog');box.setAttribute('aria-modal','true');box.setAttribute('aria-label','Tutorial: '+T.titulo);
    box.innerHTML=`<div class="caixa"><div class="cab"><span>TUTORIAL · ${T.titulo.toUpperCase()}</span><span id="tutoN"></span></div>
      <h2 id="tutoT"></h2><div class="corpo" id="tutoC"></div><div class="pontos" id="tutoP"></div>
      <div class="rodape"><button id="tutoPula">Pular tutorial</button><span style="display:flex;gap:10px"><button id="tutoAnt">← Voltar</button><button class="pri" id="tutoProx">Próximo →</button></span></div></div>`;
    document.body.appendChild(box);
    const $=s=>box.querySelector(s);
    function mostra(){const p=T.passos[i];$('#tutoT').textContent=p.t;$('#tutoC').innerHTML=p.h;$('#tutoN').textContent=`${i+1}/${T.passos.length}`;
      $('#tutoP').innerHTML=T.passos.map((_,k)=>`<i class="${k<=i?'on':''}"></i>`).join('');$('#tutoAnt').disabled=i===0;
      $('#tutoProx').textContent=i===T.passos.length-1?'Jogar!':'Próximo →';$('#tutoProx').focus();}
    function abre(){i=0;ultimoFoco=document.activeElement;box.hidden=false;mostra();}
    function fecha(){box.hidden=true;try{localStorage.setItem('tuto-'+id,'1');}catch(e){}if(ultimoFoco&&ultimoFoco.focus)ultimoFoco.focus();}
    $('#tutoProx').onclick=()=>{if(i<T.passos.length-1){i++;mostra();}else fecha();};
    $('#tutoAnt').onclick=()=>{if(i>0){i--;mostra();}};$('#tutoPula').onclick=fecha;
    box.addEventListener('click',e=>{if(e.target===box)fecha();});
    box.addEventListener('keydown',e=>{if(e.key==='Escape')fecha();if(e.key==='ArrowRight'){e.stopPropagation();$('#tutoProx').click();}if(e.key==='ArrowLeft'){e.stopPropagation();$('#tutoAnt').click();}
      if(e.key===' '||e.key.startsWith('Arrow'))e.stopPropagation();
      if(e.key==='Tab'){const f=[...box.querySelectorAll('button:not(:disabled)')];if(!f.length)return;const a=f[0],z=f[f.length-1];
        if(e.shiftKey&&document.activeElement===a){z.focus();e.preventDefault();}else if(!e.shiftKey&&document.activeElement===z){a.focus();e.preventDefault();}}});
    // impede que as teclas do jogo funcionem com o tutorial aberto
    addEventListener('keydown',e=>{if(!box.hidden&&!box.contains(e.target)){e.stopImmediatePropagation();}},true);
    // botão "? Tutorial" no topo
    const nav=document.querySelector('.topo');if(nav){const b=document.createElement('button');b.className='btnTuto';b.textContent='? Tutorial';b.onclick=abre;nav.insertBefore(b,nav.lastElementChild);}
    // guia fixo no fim da página
    const g=document.createElement('section');g.className='band guia';g.id='guia';
    g.innerHTML=`<h2>Como resolver: ${T.titulo}</h2><div class="passos">${T.passos.map((p,k)=>`<div class="passo"><h3>${k+1}. ${p.t}</h3>${p.h}</div>`).join('')}</div>`;
    const bands=document.querySelectorAll('body > .band');(bands[bands.length-1]||document.body).after(g);
    let visto=false;try{visto=localStorage.getItem('tuto-'+id)==='1';}catch(e){}
    if(!visto)abre();
  }

  /* Repete uma função a cada quadro da tela (~60 vezes por segundo) */
  const loop=fn=>{const t=now=>{fn(now);requestAnimationFrame(t);};requestAnimationFrame(t);};

  return{cor,fmt,emb,passo,tela,plano,grade,prende,solta,curva,ponto,rotulo,recorde,fim,loop,sprite,pop,desenhaPops,explode,desenhaParts,arcade,tutorial};
})();

'use strict';
/* ============ ДАННЫЕ ============ */
const PRODUCTS = [
  {id:1, name:'Дед Мороз — Стандарт', short:'Дед Мороз', who:['santa'], vip:false,
   prices:{15:2500,30:3500,60:5500},
   desc:'Дед Мороз в красной шубе: поздравление, стихи, загадки, вручение подарка. Подходит для небольшого семейного праздника.',
   feat:['Дед Мороз','Стихи и загадки','Вручение подарка','Фото на память']},
  {id:2, name:'Дед Мороз + Снегурочка — Стандарт', short:'Дед Мороз и Снегурочка', who:['santa','maiden'], vip:false,
   prices:{15:3500,30:5000,60:8000},
   desc:'Дед Мороз со Снегурочкой: хоровод, игры, песни и конкурсы для детей и взрослых.',
   feat:['Дед Мороз','Снегурочка','Хоровод и игры','Вручение подарка','Фото на память']},
  {id:3, name:'Дед Мороз — VIP', short:'Дед Мороз VIP', who:['santa'], vip:true,
   prices:{15:5000,30:7000,60:11000},
   desc:'Расшитая золотом шуба, посох, опытный артист и сценарий под вашу семью: имена, увлечения, достижения ребёнка.',
   feat:['Премиальный костюм','Индивидуальный сценарий','Световые и звуковые эффекты','Вручение подарка','Видео-поздравление']},
  {id:4, name:'Дед Мороз + Снегурочка — VIP', short:'Дед Мороз и Снегурочка VIP', who:['santa','maiden'], vip:true,
   prices:{15:7000,30:10000,60:15000},
   desc:'Два артиста в премиальных костюмах, авторская программа, снежное шоу и живая музыка. Для больших семейных праздников.',
   feat:['Премиальные костюмы','Авторский сценарий','Снежное шоу','Живая музыка','Видеосъёмка','Подарок ребёнку']}
];
const DURS = [15,30,60];
const TIMES = []; for(let h=10;h<=23;h++){TIMES.push(h+':00'); if(h<23)TIMES.push(h+':30');}
const MONTHS = [[2026,11],[2027,0]];
const MN = ['январь','февраль','март','апрель','май','июнь','июль','август','сентябрь','октябрь','ноябрь','декабрь'];
const MG = ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];
const rub = n => n.toLocaleString('ru-RU')+' ₽';
const $ = (s,el=document)=>el.querySelector(s);
const $$ = (s,el=document)=>[...el.querySelectorAll(s)];

/* ============ ЦЕНООБРАЗОВАНИЕ ============ */
function dateCoef(iso){
  const [y,m,d]=iso.split('-').map(Number);
  if(m===12){ if(d===31)return{k:1.6,l:'31 декабря ×1.6'}; if(d===30)return{k:1.3,l:'30 декабря ×1.3'};
    if(d>=28)return{k:1.15,l:'28–29 декабря ×1.15'}; if(d<20)return{k:.95,l:'Ранняя запись −5%'}; }
  if(m===1){ if(d===1)return{k:1.3,l:'1 января ×1.3'}; if(d===6||d===7)return{k:1.1,l:'Рождество ×1.1'}; }
  return{k:1,l:''};
}
function timeCoef(t){
  const h=+t.split(':')[0];
  if(h>=22)return{k:1.25,l:'Ночное время ×1.25'}; if(h>=18)return{k:1.1,l:'Вечернее время ×1.1'};
  return{k:1,l:''};
}
function calc(p,date,time,dur){
  const base=p.prices[dur]; const dc=date?dateCoef(date):{k:1,l:''}; const tc=time?timeCoef(time):{k:1,l:''};
  return{base,price:Math.round(base*dc.k*tc.k/50)*50,notes:[dc.l,tc.l].filter(Boolean)};
}
function dateLevel(iso){const k=dateCoef(iso).k;return k>=1.3?'hot':k>1?'warm':'';}
function busy(pid,date,time){ // демо-занятость слотов
  let s=0; const str=pid+date+time; for(let i=0;i<str.length;i++)s=(s*31+str.charCodeAt(i))>>>0;
  const h=+time.split(':')[0]; const load = date.endsWith('12-31')?(h>=17?.8:.4):date.endsWith('12-30')?.35:.2;
  return (s%100)/100<load;
}
const fmtDate = iso=>{const [y,m,d]=iso.split('-').map(Number);return d+' '+MG[m-1]+' '+y;};

/* ============ ИЛЛЮСТРАЦИИ (SVG, цвета фона берутся из темы) ============ */
/* Объёмные (псевдо-3D) иллюстрации: радиальные градиенты = свет сверху-слева,
   затеняющий слой справа, мягкие тени и блики. Градиенты лежат в <defs> index.html. */
function cone(x,y,s,r){
  let sc='';
  for(let row=0;row<7;row++){const yy=-22+row*6.6;
    for(let col=-2;col<=2;col++){const xx=col*8+(row%2?4:0);
      sc+=`<path d="M${xx-5} ${yy} Q${xx} ${yy+10} ${xx+5} ${yy} Q${xx} ${yy+3} ${xx-5} ${yy}Z" fill="url(#gCone2)" stroke="#2f1809" stroke-width=".7"/>`;}}
  return `<g transform="translate(${x} ${y}) rotate(${r||0}) scale(${s})">
    <ellipse cx="0" cy="0" rx="11" ry="21" fill="url(#gCone)"/>
    <g clip-path="url(#cClip)">${sc}<ellipse cx="-4" cy="-8" rx="4" ry="9" fill="#fff" opacity=".16"/><ellipse cx="6" cy="6" rx="10" ry="22" fill="url(#gShade)" opacity=".7"/></g>
    <path d="M-3 -21 q3 -6 6 0" stroke="#4a2a12" stroke-width="2.2" fill="none"/></g>`;
}
function ornament(x,y,r,gold){
  return `<g><path d="M${x} ${y-r-5} v5" stroke="#d9b24a" stroke-width="1.2"/><rect x="${x-r*.35}" y="${y-r-2.5}" width="${r*.7}" height="3" rx="1" fill="url(#gGold)"/>
  <circle cx="${x}" cy="${y}" r="${r}" fill="url(#${gold?'gOrnG':'gOrn'})"/><ellipse cx="${x-r*.35}" cy="${y-r*.4}" rx="${r*.28}" ry="${r*.18}" fill="#fff" opacity=".75" transform="rotate(-30 ${x-r*.35} ${y-r*.4})"/></g>`;
}
function branch(x,y,rot,s,len){
  len=len||120; let n='';
  for(let i=0;i<14;i++){const t=6+i*(len/15), w=30-i*1.55, l=18+(i%2)*3;
    n+=`<path d="M${t} 0 Q${t+3} ${-w*.62} ${t+l} ${-w} Q${t+6} ${-w*.32} ${t} 0Z" fill="url(#gFir2)"/>
        <path d="M${t} 0 Q${t+3} ${w*.62} ${t+l} ${w} Q${t+6} ${w*.32} ${t} 0Z" fill="url(#gFir2)"/>`;}
  for(let i=0;i<14;i++){const t=10+i*(len/15), w=26-i*1.4, l=16;
    n+=`<path d="M${t} 0 Q${t+2} ${-w*.55} ${t+l} ${-w*.92} Q${t+5} ${-w*.25} ${t} 0Z" fill="url(#gFir)"/>
        <path d="M${t} 0 Q${t+2} ${w*.55} ${t+l} ${w*.92} Q${t+5} ${w*.25} ${t} 0Z" fill="url(#gFir)"/>`;}
  return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><path d="M-6 0 H${len+8}" stroke="#4a2c14" stroke-width="3.2" stroke-linecap="round"/>${n}</g>`;
}
function tree(x,y,s){
  const tier=(w,h,yy)=>`<path d="M${-w} ${yy} L0 ${yy-h} L${w} ${yy}Q0 ${yy+7} ${-w} ${yy}Z" fill="url(#gTree)"/><path d="M${-w*.62} ${yy-h*.36} Q${-w*.2} ${yy-h*.3} 0 ${yy-h} Q${w*.16} ${yy-h*.5} ${w*.5} ${yy-h*.42} Q${w*.1} ${yy-h*.3} ${-w*.1} ${yy-h*.2}Z" fill="#fff" opacity=".85"/>`;
  return `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-4" y="-6" width="8" height="14" fill="#4a2c14"/>${tier(26,34,-4)}${tier(20,30,-26)}${tier(14,26,-46)}
  <circle cx="-8" cy="-12" r="2.2" fill="#ffd45a" class="tw"/><circle cx="9" cy="-32" r="2" fill="#ff6b6f" class="tw d2"/><circle cx="-4" cy="-50" r="1.8" fill="#8fd3ff" class="tw d3"/></g>`;
}
function gift(x,y,w,h,g){
  return `<g><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="2" fill="url(#${g})"/><rect x="${x+w*.44}" y="${y}" width="${w*.12}" height="${h}" fill="url(#gGold)"/><rect x="${x}" y="${y+h*.4}" width="${w}" height="${h*.12}" fill="url(#gGold)"/>
  <path d="M${x+w/2} ${y} q-9 -9 -11 -2 q4 4 11 2 q7 2 11 -2 q-2 -7 -11 2Z" fill="url(#gGold)"/><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="2" fill="url(#gShade)" opacity=".55"/></g>`;
}
function santa(x,y,s,vip){
  const g=vip?'gBlue':'gRed', mid=vip?'#1e3fae':'#d62839', dk=vip?'#0b1d5e':'#7a1020';
  return `<g transform="translate(${x} ${y}) scale(${s})">
  <ellipse cx="0" cy="124" rx="64" ry="9" fill="#04122e" opacity=".4" filter="url(#fSoft)"/>
  <g class="bob">
  <path d="M-62 120 Q-70 40 -34 22 L34 22 Q70 40 62 120Z" fill="url(#${g})"/>
  <path d="M-62 120 Q-70 40 -34 22 L34 22 Q70 40 62 120Z" fill="url(#gShade)"/>
  <path d="M-9 22 L9 22 L13 120 L-13 120Z" fill="url(#gFur)"/>
  ${vip?'<g fill="url(#gGold)"><circle cx="0" cy="50" r="4.5"/><circle cx="0" cy="72" r="4.5"/></g>':''}
  <rect x="-60" y="84" width="120" height="13" fill="#17171f"/><rect x="-60" y="84" width="120" height="4" fill="#fff" opacity=".12"/>
  <rect x="-11" y="81" width="22" height="19" rx="3" fill="url(#gGold)" stroke="#8a5a10" stroke-width="1.4"/><rect x="-6" y="86" width="12" height="9" rx="1.5" fill="#17171f"/>
  <rect x="-64" y="106" width="128" height="16" rx="8" fill="url(#gFur)"/>
  <path d="M-52 58 Q-76 74 -56 100" stroke="${dk}" stroke-width="15" stroke-linecap="round" fill="none"/><circle cx="-56" cy="101" r="9" fill="url(#gFur)"/>
  ${vip?'<rect x="-84" y="-28" width="5" height="150" rx="2" fill="url(#gGold)"/><g class="glow"><circle cx="-82" cy="-34" r="14" fill="#bfe9ff" opacity=".5" filter="url(#fGlow)"/><circle cx="-82" cy="-34" r="10" fill="#d8f2ff" stroke="url(#gGold)" stroke-width="3"/></g>':'<rect x="-84" y="8" width="5" height="114" rx="2" fill="#c9923a"/>'}
  <g class="wave"><path d="M44 36 Q76 24 84 -8" stroke="${mid}" stroke-width="16" stroke-linecap="round" fill="none"/><circle cx="85" cy="-14" r="10" fill="url(#gFur)"/></g>
  <circle cx="0" cy="-8" r="34" fill="url(#gSkin)"/>
  <circle cx="-23" cy="4" r="7" fill="#ff7d7d" opacity=".4" filter="url(#fSoft)"/><circle cx="23" cy="4" r="7" fill="#ff7d7d" opacity=".4" filter="url(#fSoft)"/>
  <path d="M-38 -2 Q-46 58 0 70 Q46 58 38 -2 Q26 18 0 18 Q-26 18 -38 -2Z" fill="url(#gFur)"/>
  <path d="M-30 20 q6 18 22 22 M30 20 q-6 18 -22 22 M-10 48 q10 8 20 0" stroke="#b9c4da" stroke-width="2" fill="none" stroke-linecap="round"/>
  <path d="M-19 25 Q0 12 19 25 Q0 36 -19 25Z" fill="url(#gFur)"/>
  <g class="blink"><ellipse cx="-12" cy="-10" rx="3.6" ry="4" fill="#1b2438"/><ellipse cx="12" cy="-10" rx="3.6" ry="4" fill="#1b2438"/><circle cx="-13.2" cy="-11.5" r="1.3" fill="#fff"/><circle cx="10.8" cy="-11.5" r="1.3" fill="#fff"/></g>
  <circle cx="0" cy="3" r="7" fill="#f09078"/><ellipse cx="-2" cy="0.5" rx="2.4" ry="1.6" fill="#fff" opacity=".55"/>
  <path d="M-17 -20 Q-12 -25 -5 -21 M5 -21 Q12 -25 17 -20" stroke="#e6ebf5" stroke-width="3.4" fill="none" stroke-linecap="round"/>
  <path d="M-38 -14 Q-36 -60 0 -64 Q36 -60 38 -14Z" fill="url(#${g})"/><path d="M-38 -14 Q-36 -60 0 -64 Q36 -60 38 -14Z" fill="url(#gShade)"/>
  <rect x="-43" y="-25" width="86" height="17" rx="8.5" fill="url(#gFur)"/>
  ${vip?'<path d="M-30 -28 l-3 -3 l6 0z M-8 -34 l-3 -4 l6 0z M12 -32 l-3 -4 l6 0z" fill="url(#gGold)"/>':''}
  <path d="M30 -58 Q50 -52 46 -30" stroke="${mid}" stroke-width="10" stroke-linecap="round" fill="none"/><circle cx="46" cy="-28" r="11" fill="url(#gFur)"/>
  </g></g>`;
}
function maiden(x,y,s,vip){
  const g=vip?'gViolet':'gSky', mid=vip?'#7b3fe4':'#4aa3ff';
  return `<g transform="translate(${x} ${y}) scale(${s})">
  <ellipse cx="0" cy="124" rx="56" ry="8" fill="#04122e" opacity=".4" filter="url(#fSoft)"/>
  <g class="bob d2">
  <path d="M-30 -4 Q-48 44 -28 96 Q-18 44 -20 -4Z" fill="url(#gHair)"/><path d="M30 -4 Q48 44 28 96 Q18 44 20 -4Z" fill="url(#gHair)"/>
  <path d="M-34 20 q8 4 12 -2 M-36 44 q8 4 12 -2 M-32 68 q8 4 12 -2" stroke="#a8742a" stroke-width="1.6" fill="none"/>
  <circle cx="-28" cy="98" r="7" fill="url(#gOrn)"/><circle cx="28" cy="98" r="7" fill="url(#gOrn)"/>
  <path d="M-52 120 Q-58 44 -26 24 L26 24 Q58 44 52 120Z" fill="url(#${g})"/><path d="M-52 120 Q-58 44 -26 24 L26 24 Q58 44 52 120Z" fill="url(#gShade)"/>
  <path d="M-14 24 L0 62 L14 24Z" fill="url(#gFur)" opacity=".9"/>
  <path d="M-30 80 l0 8 M-34 84 l8 0 M30 62 l0 8 M26 66 l8 0 M-12 100 l0 8 M-16 104 l8 0" stroke="#fff" stroke-width="1.6" opacity=".8"/>
  <rect x="-56" y="104" width="112" height="16" rx="8" fill="url(#gFur)"/>
  <g class="wave r"><path d="M-40 38 Q-72 26 -80 -6" stroke="${mid}" stroke-width="14" stroke-linecap="round" fill="none"/><circle cx="-81" cy="-12" r="9" fill="url(#gFur)"/></g>
  <path d="M40 40 Q58 64 40 86" stroke="${mid}" stroke-width="13" stroke-linecap="round" fill="none"/><circle cx="40" cy="88" r="8.5" fill="url(#gFur)"/>
  <circle cx="0" cy="-8" r="30" fill="url(#gSkin)"/>
  <path d="M-31 -6 Q-32 -36 0 -38 Q32 -36 31 -6 Q18 -24 0 -24 Q-18 -24 -31 -6Z" fill="url(#gHair)"/>
  <g class="blink"><ellipse cx="-11" cy="-5" rx="3.4" ry="4" fill="#1b2438"/><ellipse cx="11" cy="-5" rx="3.4" ry="4" fill="#1b2438"/><circle cx="-12.1" cy="-6.5" r="1.2" fill="#fff"/><circle cx="9.9" cy="-6.5" r="1.2" fill="#fff"/></g>
  <circle cx="-18" cy="6" r="6" fill="#ff8aa0" opacity=".6" filter="url(#fSoft)"/><circle cx="18" cy="6" r="6" fill="#ff8aa0" opacity=".6" filter="url(#fSoft)"/>
  <path d="M-8 8 Q0 16 8 8" stroke="#c0394f" stroke-width="3" fill="none" stroke-linecap="round"/>
  <path d="M-31 -20 L-26 -58 L-11 -46 L0 -68 L11 -46 L26 -58 L31 -20Z" fill="url(#${vip?'gGold':'gFur'})" stroke="${vip?'#fff6c8':'#8fd3ff'}" stroke-width="1.6"/>
  <circle cx="0" cy="-34" r="5" fill="url(#gOrn)"/><circle cx="-16" cy="-30" r="2.6" fill="#fff"/><circle cx="16" cy="-30" r="2.6" fill="#fff"/>
  </g></g>`;
}
function artSvg(p){
  const stars=Array.from({length:22},(_,i)=>`<circle class="tw ${['','d2','d3'][i%3]}" cx="${(i*47+13)%200}" cy="${(i*29+9)%110}" r="${i%4?1:1.7}" fill="#fff"/>`).join('');
  const two=p.who.length===2;
  return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <rect width="200" height="200" fill="url(#gSkyBg)"/>
    <circle cx="164" cy="34" r="24" fill="#fff4c8" opacity=".5" filter="url(#fGlow)"/><circle cx="164" cy="34" r="12" fill="#fff8de"/>
    ${stars}
    <path d="M0 146 Q40 126 90 142 T200 136 V200 H0Z" fill="#b6c9e6"/>
    ${tree(22,152,.9)}${tree(176,150,.8)}${tree(48,148,.55)}
    <path d="M0 160 Q50 142 100 156 T200 150 V200 H0Z" fill="url(#gSnow)"/><path d="M0 180 Q60 168 120 178 T200 174 V200 H0Z" fill="#c4d4ec"/>
    ${two?santa(72,50,.82,p.vip)+maiden(140,64,.72,p.vip):santa(100,46,1.02,p.vip)}
    ${gift(8,168,22,18,'gBox')}${gift(168,170,20,16,'gBox2')}
    ${branch(-6,196,-22,.62,110)}${cone(40,184,.7,24)}${branch(206,196,202,.62,110)}${cone(160,186,.62,-20)}${ornament(98,191,5,true)}
  </svg>`;
}

/* декор: еловые лапы, шишки, шары — углы секций */
function firDeco(kind){
  const o=(x,y,r,g)=>ornament(x,y,r,g);
  const body=`${branch(8,30,22,1.35,170)}${branch(10,70,50,1.05,130)}${branch(0,18,4,.9,120)}
    ${cone(150,76,1,-18)}${cone(96,112,.85,16)}${o(214,50,9,false)}${o(70,150,8,true)}
    <circle cx="190" cy="34" r="3" fill="#fff" opacity=".9"/><circle cx="120" cy="52" r="2.2" fill="#fff" opacity=".9"/><circle cx="60" cy="98" r="2" fill="#fff" opacity=".9"/>`;
  return `<div class="fir ${kind}" aria-hidden="true"><svg viewBox="0 0 260 200" xmlns="http://www.w3.org/2000/svg">${body}</svg></div>`;
}
/* ============ СОСТОЯНИЕ ============ */
let cart = JSON.parse(localStorage.getItem('cart')||'[]');
const saveCart=()=>{localStorage.setItem('cart',JSON.stringify(cart));updateCount();};
function updateCount(){$('#cartCount').textContent=cart.length;}
function toast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('on');clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove('on'),2400);}

/* ============ ТЕМЫ ============ */
function setTheme(t,save){
  document.documentElement.dataset.theme=t;if(save)localStorage.setItem('theme2',t);
  $$('[data-theme-set]').forEach(b=>b.classList.toggle('on',b.dataset.themeSet===t));
}
$$('[data-theme-set]').forEach(b=>b.onclick=()=>setTheme(b.dataset.themeSet,true));
setTheme(new URLSearchParams(location.search).get('theme')||localStorage.getItem('theme2')||'card');

/* ============ РОУТЕР С ПЕРЕХОДАМИ ============ */
const app=$('#app'),curtain=$('#curtain');
let busyNav=false,lastClick={x:innerWidth/2,y:innerHeight/2};
addEventListener('pointerdown',e=>{lastClick={x:e.clientX,y:e.clientY};},true);
const route=()=>location.hash.replace(/^#/,'')||'/';
async function render(first){
  if(busyNav)return; kill3d(); busyNav=true; const r=route();
  curtain.style.setProperty('--cx',lastClick.x+'px');curtain.style.setProperty('--cy',lastClick.y+'px');
  if(!first){app.style.transition='opacity .22s ease';app.style.opacity='0';await new Promise(res=>setTimeout(res,230));}
  window.scrollTo(0,0);
  const [,page,arg]=r.split('/');
  if(page==='product')app.innerHTML=viewProduct(+arg);
  else if(page==='cart')app.innerHTML=viewCart();
  else if(page==='checkout')app.innerHTML=viewCheckout();
  else if(page==='done')app.innerHTML=viewDone(arg);
  else app.innerHTML=viewHome();
  bind(page,arg);observeReveal();mount3D(page,arg);sceneForRoute(page,arg);
  if(!first){requestAnimationFrame(()=>{app.style.opacity='1';});}
  busyNav=false;
  if(route()!==r)render();
}
addEventListener('hashchange',()=>render());
addEventListener('scroll',()=>$('#header').classList.toggle('scrolled',scrollY>30),{passive:true});
function observeReveal(){
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('show');io.unobserve(e.target);}}),{threshold:.1});
  $$('.reveal').forEach(el=>{el.style.transitionDelay=(el.dataset.d||0)+'ms';io.observe(el);});
}

/* ============ ФОТО-ВАРИАНТ: images/hero.jpg (если файл есть) ============ */
let HAS_PHOTO=false;
const PHOTO='images/hero.jpg', PR=1200/896;
const bp=(z,cx,cy)=>{const x=z>1?(cx*z-.5)/(z-1):50/100, y=(cy*PR*z-.5)/(PR*z-1); return (x*100).toFixed(1)+'% '+(y*100).toFixed(1)+'%';};
/* кадрирование: Дед Мороз слева, Снегурочка справа; VIP — ближе */
function photoArt(p,hero){
  let z,cx,cy;
  if(hero){return '<div class="ph hero-ph" style="background-image:url('+PHOTO+')"></div>';}
  if(p.who.length===1){z=p.vip?2.5:2.2;cx=p.vip?.35:.35;cy=p.vip?.42:.44;} else {z=p.vip?1.12:1.3;cx=.5;cy=p.vip?.5:.56;}
  return '<div class="ph" style="background-image:url('+PHOTO+');background-size:'+(z*100)+'% auto;background-position:'+bp(z,cx,cy)+'"></div>';
}
const art=(p,hero)=>HAS_PHOTO?photoArt(p,hero):artSvg(p);


/* ============ ФОН-СЦЕНА: герои на фоне страницы, кадр меняется при прокрутке ============ */
const SCENES={A:{z:1,cx:.5,cy:.5,mx:'50%'},M:{u:'images/snowman.jpg',bs:'cover',bp:'50% 38%',mx:'40%'},T:{u:'images/tree2.jpg',bs:'cover',bp:'50% 55%',mx:'50%'}};
const bp2=(z,c)=>z>1?((c*z-.5)/(z-1)*100).toFixed(1)+'%':'50%';
const DEVSCENE=new URLSearchParams(location.search).get('scene');
let sceneBase=DEVSCENE||'A',sceneHover=null,px=0,py=0;
function buildStage(){
  document.body.classList.add('photo-mode');
  const st=document.createElement('div');st.id='stage';
  st.innerHTML=Object.entries(SCENES).map(([k,s])=>`<div class="layer" data-s="${k}" style="--bs:${s.bs||(s.z*100+'% auto')};--bp:${s.bp||(bp2(s.z,s.cx)+' '+bp2(s.z,s.cy))};--mx:${s.mx};background-image:url(${s.u||PHOTO})"></div>`).join('')+'<div class="glints"></div>';
  document.body.prepend(st);
  const sky=document.createElement('div');sky.id='sky';sky.setAttribute('aria-hidden','true');sky.innerHTML=window.SKY?window.SKY.svg:'';document.body.prepend(sky);
  const sky2=document.createElement('div');sky2.id='sky2';sky2.className='skyl';sky2.setAttribute('aria-hidden','true');sky2.innerHTML='';const bk=document.createElement('div');bk.id='bokeh';bk.setAttribute('aria-hidden','true');bk.innerHTML=Array.from({length:16},(_,i)=>`<i style="left:${(Math.random()*100).toFixed(1)}%;top:${(Math.random()*100).toFixed(1)}%;width:${(40+Math.random()*110).toFixed(0)}px;height:${(40+Math.random()*110).toFixed(0)}px;animation-delay:-${(Math.random()*20).toFixed(1)}s;animation-duration:${(16+Math.random()*16).toFixed(1)}s"></i>`).join('');document.body.prepend(bk);document.body.prepend(sky2);
  const sp=new URLSearchParams(location.search).get('scene'); if(sp)sceneBase=sp;
  setScene(); skyLoop();
}
function setScene(){const k=sceneHover||sceneBase;$$('#stage .layer').forEach(l=>l.classList.toggle('on',l.dataset.s===k));document.body.classList.toggle('sky-on',k==='S');}
function skyLoop(){
  const t0=performance.now();
  (function f(){requestAnimationFrame(f); if(window.SKY&&document.body.classList.contains('sky2-on'))window.SKY.updateR(px,py,0); if(!document.body.classList.contains('sky-on')||!window.SKY)return;
    const e=document.getElementById('how'); let p=.5; const dp=new URLSearchParams(location.search).get('p'); if(dp!==null)p=+dp; else if(e){const r=e.getBoundingClientRect();p=Math.max(0,Math.min(1,(innerHeight-r.top)/(innerHeight+r.height)));}
    window.SKY.update(p,(performance.now()-t0)/1000);})();
}
function sceneForRoute(page,arg){
  if(!HAS_PHOTO)return; sceneHover=null;
  if(page==='product'){const p=PRODUCTS.find(x=>x.id===+arg);sceneBase='A';}
  else sceneBase=DEVSCENE||'A';
  setScene(); if(!page)onSceneScroll();
}
function onSceneScroll(){
  if(!HAS_PHOTO)return; par(); if(DEVSCENE||route()!=='/')return;
  const m=innerHeight*.5; let k='A';
  [['how','S'],['faq','M'],['finale','T']].forEach(([id,s])=>{const e=document.getElementById(id);if(e&&e.getBoundingClientRect().top<m)k=s;});
  if(k!==sceneBase){sceneBase=k;if(!sceneHover)setScene();}
}
function par(){const st=$('#stage');if(st)st.style.transform=`translate3d(${(-px*22).toFixed(1)}px,${(-py*14).toFixed(1)}px,0)`;}
addEventListener('scroll',onSceneScroll,{passive:true});
addEventListener('pointermove',e=>{px=e.clientX/innerWidth-.5;py=e.clientY/innerHeight-.5;par();},{passive:true});
/* ============ 3D-ГЕРОИ (three.js, запасной вариант — SVG) ============ */
let m3d=[];
function kill3d(){m3d.forEach(m=>m.dispose());m3d=[];}
async function mount3D(page,arg){
  if(HAS_PHOTO)return;
  const el=page==='product'?$('.p-art'):(!page?$('.hero-art'):null); if(!el)return;
  const p=page==='product'?PRODUCTS.find(x=>x.id===+arg):PRODUCTS[3]; if(!p)return;
  try{const mod=await import('./hero3d.js'); if(!el.isConnected)return; m3d.push(mod.mount(el,{who:p.who,vip:p.vip})); el.dataset.three='1'; el.classList.add('is3d');}
  catch(e){console.warn('3D недоступно, показываю SVG',e);}
}

/* ============ СТРАНИЦЫ ============ */
const SHOTS=[['Снегурочка',2.6,.66,.4],['Сказочный дом',2.6,.84,.3],['Мешок с подарками',2.6,.2,.82],['Ёлки в огнях',2.4,.12,.3]];
const SHOW_GALLERY=false;
const gallery=()=>SHOW_GALLERY?`<section id="gallery"><h2 class="sec-title reveal">Атмосфера праздника</h2><p class="sec-sub reveal">Так выглядит сказка, которую мы приносим в ваш дом</p>
  <div class="gallery">${SHOTS.map((s,i)=>`<figure class="shot reveal" data-d="${i*90}"><div class="ph" style="background-image:url(${PHOTO});background-size:${s[1]*100}% auto;background-position:${bp(s[1],s[2],s[3])}"></div><figcaption>${s[0]}</figcaption></figure>`).join('')}</div></section>`:'';
function viewHome(){
  return `<div class="page">
  <div class="hero">
    ${firDeco('tr')}
    <div>
      <span class="eyebrow">Новогодние поздравления · 2027</span>
      <h1>Дед Мороз и Снегурочка у вас дома</h1>
      <p>Выберите программу, дату и время. Цена считается сразу, оплатить можно онлайн. После заказа мы перезвоним и уточним детали.</p>
      <a href="#/" class="btn" data-scroll="catalog">Выбрать программу</a>
      <div class="hero-facts">
        <div><b>4 программы</b><span>стандарт и VIP</span></div>
        <div><b>15 · 30 · 60 минут</b><span>на выбор</span></div>
        <div><b>Онлайн-оплата</b><span>или артисту на месте</span></div>
      </div>
    </div>
    ${HAS_PHOTO?'':`<div class="hero-art">${art(PRODUCTS[3],true)}</div>`}
  </div>

  <section id="catalog">
    ${firDeco('tr small')}
    <h2 class="sec-title reveal">Программы</h2>
    <p class="sec-sub reveal">Выберите, кто придёт к вам на праздник</p>
    <div class="grid">${PRODUCTS.map((p,i)=>`
      <a class="card reveal" data-d="${i*90}" href="#/product/${p.id}">
        <div class="thumb"><span class="tag ${p.vip?'vip':''}">${p.vip?'VIP':'Стандарт'}</span>${art(p)}</div>
        <div class="body"><h3>${p.name}</h3><p>${p.desc}</p>
          <div class="price-row"><div class="from">от<b>${rub(p.prices[15])}</b></div><span class="go">Выбрать</span></div></div>
      </a>`).join('')}</div>
  </section>

  ${gallery()}
  <section id="how">
    ${firDeco('tl small')}
    <h2 class="sec-title reveal">Как заказать</h2><p class="sec-sub reveal">Как в обычном интернет-магазине</p>
    <div class="steps reveal">
      ${[['Выберите программу','Дед Мороз один или со Снегурочкой, стандарт или VIP.'],['Дата, время, длительность','Календарь покажет свободное время. Цена пересчитывается сразу.'],['Корзина и оплата','Можно заказать несколько поздравлений в разные дни.'],['Мы перезвоним','Подтвердим время и адрес, обсудим детали программы.']]
      .map(s=>`<div class="step"><h4>${s[0]}</h4><p>${s[1]}</p></div>`).join('')}
    </div>
  </section>

  <section id="faq">
    ${firDeco('tr small')}
    <h2 class="sec-title reveal">Вопросы и ответы</h2><p class="sec-sub reveal">Текст в этом блоке — пример, итоговые условия согласуются</p>
    <div class="faq reveal">
      <details><summary>Как формируется цена?</summary><p>Цена зависит от программы, длительности и даты. В самые востребованные дни (30–31 декабря, 1 января) и в вечернее время действует повышающий коэффициент. Итоговая цена видна до оплаты.</p></details>
      <details><summary>Можно ли перенести заказ?</summary><p>Да, позвоните нам не позднее чем за 24 часа.</p></details>
      <details><summary>Вы выезжаете за город?</summary><p>Да, стоимость выезда уточняется при подтверждении заказа.</p></details>
      <details><summary>Как проходит оплата?</summary><p>Онлайн картой или по договорённости артисту на месте.</p></details>
    </div>
  </section>
  <section id="finale"><div class="finale-box reveal"><span class="eyebrow">Скоро Новый год</span><h2>Подарите детям настоящую сказку</h2><p>Дед Мороз и Снегурочка придут в назначенный час: с песнями, играми и подарками. Осталось выбрать дату.</p><a href="#/" class="btn" data-scroll="catalog">Выбрать программу</a></div></section></div>`;
}

const sel={date:null,time:null,dur:30,month:0};
function viewProduct(id){
  const p=PRODUCTS.find(x=>x.id===id); if(!p)return `<div class="narrow page"><h1>Не найдено</h1><a class="btn" href="#/">На главную</a></div>`;
  Object.assign(sel,{date:null,time:null,dur:30,month:0});
  return `<div class="page product">
    <div><a class="back" href="#/">← Все программы</a>${HAS_PHOTO?'':`<div class="p-art">${art(p)}</div>`}</div>
    <div class="p-info">
      <span class="tag ${p.vip?'vip':''}">${p.vip?'VIP':'Стандарт'}</span>
      <h1>${p.name}</h1><p class="desc">${p.desc}</p>
      <ul class="feat">${p.feat.map(f=>`<li>${f}</li>`).join('')}</ul>

      <div class="block"><h3><i>1</i>Дата</h3><div id="cal"></div>
        <div class="legend"><span><i style="width:5px;height:5px;border-radius:50%"></i>повышенный спрос</span><span><i style="width:12px;height:3px"></i>пиковые дни</span></div></div>
      <div class="block" id="timeBlock"><h3><i>2</i>Время</h3><div id="slots"></div></div>
      <div class="block"><h3><i>3</i>Длительность программы</h3>
        <div class="durs">${DURS.map(d=>`<button class="dur ${d===30?'sel':''}" data-dur="${d}"><b>${d}</b><span>минут</span></button>`).join('')}</div></div>

      <div class="buy"><div class="total"><small id="tSmall">Итого</small><b id="tPrice">${rub(p.prices[30])}</b></div>
        <button class="btn" id="addBtn" disabled>В корзину</button><div class="breakdown" id="bd"></div></div>
    </div></div>`;
}
function viewCart(){
  if(!cart.length)return `<div class="narrow page"><h1>Корзина</h1><div class="empty"><p>В корзине пока ничего нет.</p><a class="btn" href="#/">К программам</a></div></div>`;
  const total=cart.reduce((s,i)=>s+i.price,0);
  return `<div class="narrow page"><h1>Корзина</h1><div class="cart-wrap"><div id="items">
    ${cart.map(i=>{const p=PRODUCTS.find(x=>x.id===i.pid);return `<div class="item">
      <div class="th">${art(p)}</div>
      <div><h4>${p.name}</h4><p>${fmtDate(i.date)}, ${i.time}<br>${i.dur} минут</p></div>
      <div class="pr"><b>${rub(i.price)}</b><button class="rm" data-rm="${i.uid}">Удалить</button></div></div>`}).join('')}
    </div>
    <aside class="summary"><h3>Ваш заказ</h3>
      <div class="row"><span>Поздравлений</span><span>${cart.length}</span></div>
      <div class="promo"><input id="promo" placeholder="Промокод (SNOW10)"><button class="btn ghost" id="promoBtn" style="padding:10px 16px">OK</button></div>
      <div class="row" id="discRow" style="display:none"><span>Скидка 10%</span><span id="disc"></span></div>
      <div class="row big"><span>Итого</span><b id="sum">${rub(total)}</b></div><br>
      <a class="btn" href="#/checkout" style="width:100%">Оформить заказ</a></aside></div></div>`;
}
function viewCheckout(){
  if(!cart.length){location.hash='#/cart';return '';}
  const total=Math.round(cart.reduce((s,i)=>s+i.price,0)*(sessionStorage.promo?0.9:1));
  return `<div class="narrow page"><a class="back" href="#/cart">← Назад в корзину</a><h1>Оформление заказа</h1>
  <div class="cart-wrap"><form class="form" id="chk">
    <label>Ваше имя<input required name="n" placeholder="Екатерина"></label>
    <label>Телефон<input required name="t" type="tel" placeholder="+7 (___) ___-__-__"></label>
    <label>Адрес<input required name="a" placeholder="Город, улица, дом, квартира"></label>
    <label>Имя и возраст ребёнка, пожелания<textarea name="c" rows="3" placeholder="Например: Маша, 6 лет, любит рисовать"></textarea></label>
    <div class="pay"><label><input type="radio" name="pay" value="card" checked>Картой онлайн</label><label><input type="radio" name="pay" value="cash">Артисту на месте</label></div>
    <button class="btn">Оплатить ${rub(total)}</button>
    <p class="hint">Демо-режим: деньги не списываются, оплата имитируется.</p></form>
    <aside class="summary"><h3>Состав заказа</h3>${cart.map(i=>{const p=PRODUCTS.find(x=>x.id===i.pid);return `<div class="row"><span>${p.short}<br><small>${fmtDate(i.date)}, ${i.time}, ${i.dur} мин</small></span><span>${rub(i.price)}</span></div>`}).join('')}
    <div class="row big"><span>Итого</span><b>${rub(total)}</b></div></aside></div></div>`;
}
const viewDone=no=>`<div class="done page"><div class="box"><h1>Заказ принят</h1>
  <div class="order-no">№ ${no}</div><p>Мы перезвоним в течение 15 минут, чтобы подтвердить дату, время и адрес.</p><br><a class="btn" href="#/">На главную</a></div></div>`;

/* ============ ПОВЕДЕНИЕ ============ */
function bind(page,arg){
  updateCount();
  $$('[data-scroll]').forEach(a=>a.onclick=e=>{e.preventDefault();const go=()=>{const el=document.getElementById(a.dataset.scroll);el&&el.scrollIntoView({behavior:'smooth'});};
    if(route()!=='/'){location.hash='#/';setTimeout(go,1100);}else go();});
  if(HAS_PHOTO&&!page)$$('.card').forEach(c=>{const p=PRODUCTS.find(x=>x.id===+c.getAttribute('href').split('/').pop());if(!p)return;
    c.onmouseenter=()=>{sceneHover=null;};c.onmouseleave=()=>{sceneHover=null;setScene();};});
  if(page==='product')bindProduct(+arg);
  if(page==='cart')bindCart();
  if(page==='checkout')bindCheckout();
}
function bindProduct(id){
  const p=PRODUCTS.find(x=>x.id===id); if(!p)return;
  const now=new Date(),today=`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
  function drawCal(){
    const [y,m]=MONTHS[sel.month]; const off=(new Date(y,m,1).getDay()+6)%7; const n=new Date(y,m+1,0).getDate();
    let h=`<div class="cal-head"><button class="cal-nav" id="pm" ${sel.month===0?'disabled':''}>‹</button><b>${MN[m]} ${y}</b><button class="cal-nav" id="nm" ${sel.month===MONTHS.length-1?'disabled':''}>›</button></div><div class="cal">`;
    ['Пн','Вт','Ср','Чт','Пт','Сб','Вс'].forEach(d=>h+=`<div class="dow">${d}</div>`);
    for(let i=0;i<off;i++)h+='<div></div>';
    for(let d=1;d<=n;d++){const iso=`${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;const lv=dateLevel(iso);
      h+=`<button class="day ${sel.date===iso?'sel':''}" data-d="${iso}" ${iso<today?'disabled':''}>${d}${lv?`<span class="dot ${lv}"></span>`:''}</button>`;}
    $('#cal').innerHTML=h+'</div>';
    $('#pm').onclick=()=>{sel.month--;drawCal();};$('#nm').onclick=()=>{sel.month++;drawCal();};
    $$('.day').forEach(b=>b.onclick=()=>{sel.date=b.dataset.d;sel.time=null;drawCal();drawSlots();update();
      if(innerWidth<860)$('#timeBlock').scrollIntoView({behavior:'smooth',block:'center'});});
  }
  function drawSlots(){
    if(!sel.date){$('#slots').innerHTML='<p class="hint">Сначала выберите дату.</p>';return;}
    $('#slots').innerHTML=`<div class="slots">${TIMES.map(t=>{const b=busy(p.id,sel.date,t);const tc=timeCoef(t);
      return `<button class="slot ${sel.time===t?'sel':''}" data-t="${t}" ${b?'disabled':''}>${t}${tc.k>1?`<small>×${tc.k}</small>`:''}</button>`}).join('')}</div>`;
    $$('.slot').forEach(b=>b.onclick=()=>{sel.time=b.dataset.t;drawSlots();update();});
  }
  function update(){
    const c=calc(p,sel.date,sel.time,sel.dur); const el=$('#tPrice'); const old=el.textContent;
    el.textContent=rub(c.price); if(old!==el.textContent){el.classList.remove('tick');void el.offsetWidth;el.classList.add('tick');}
    $('#tSmall').textContent=sel.date&&sel.time?`${fmtDate(sel.date)}, ${sel.time}, ${sel.dur} мин`:'Итого (выберите дату и время)';
    $('#bd').innerHTML=`<span>База: ${rub(c.base)}</span>`+c.notes.map(n=>`<span>${n}</span>`).join('');
    $('#addBtn').disabled=!(sel.date&&sel.time);
  }
  $$('.dur').forEach(b=>b.onclick=()=>{sel.dur=+b.dataset.dur;$$('.dur').forEach(x=>x.classList.toggle('sel',x===b));update();});
  $('#addBtn').onclick=()=>{
    const c=calc(p,sel.date,sel.time,sel.dur);
    cart.push({uid:Date.now(),pid:p.id,date:sel.date,time:sel.time,dur:sel.dur,price:c.price});saveCart();
    const cc=$('#cartCount');cc.classList.remove('bump');void cc.offsetWidth;cc.classList.add('bump');
    toast('Добавлено в корзину');
  };
  drawCal();drawSlots();update();
}
function bindCart(){
  $$('[data-rm]').forEach(b=>b.onclick=()=>{b.closest('.item').classList.add('removing');
    setTimeout(()=>{cart=cart.filter(i=>i.uid!=b.dataset.rm);saveCart();app.innerHTML=viewCart();bind('cart');},330);});
  const pb=$('#promoBtn'); if(!pb)return;
  const apply=()=>{const total=cart.reduce((s,i)=>s+i.price,0);
    if(sessionStorage.promo){$('#discRow').style.display='flex';$('#disc').textContent='−'+rub(Math.round(total*.1));$('#sum').textContent=rub(Math.round(total*.9));}};
  apply();
  pb.onclick=()=>{if($('#promo').value.trim().toUpperCase()==='SNOW10'){sessionStorage.promo='1';apply();toast('Промокод применён');}else toast('Промокод не найден');};
}
function bindCheckout(){
  const f=$('#chk'); if(!f)return;
  f.onsubmit=e=>{e.preventDefault();const btn=f.querySelector('.btn');btn.textContent='Обработка платежа…';btn.disabled=true;
    setTimeout(()=>{const no=String(Math.floor(10000+Math.random()*90000));cart=[];saveCart();sessionStorage.removeItem('promo');location.hash='#/done/'+no;},1300);};
}

/* ============ СНЕГ (виден только в теме «Ночь») ============ */
(function snow(){
  const cv=$('#snow'),ctx=cv.getContext('2d');let W,H;const fl=[];
  const rs=()=>{W=cv.width=innerWidth;H=cv.height=innerHeight;};rs();addEventListener('resize',rs);
  const spr=document.createElement('canvas');spr.width=spr.height=32;{const x=spr.getContext('2d'),gr=x.createRadialGradient(16,16,0,16,16,16);gr.addColorStop(0,'rgba(255,244,190,1)');gr.addColorStop(.35,'rgba(255,208,90,.5)');gr.addColorStop(1,'rgba(255,208,90,0)');x.fillStyle=gr;x.fillRect(0,0,32,32);}
  const sparks=Array.from({length:Math.min(46,Math.floor(innerWidth/30))},()=>({x:Math.random()*innerWidth,y:Math.random()*innerHeight,v:.15+Math.random()*.35,r:.5+Math.random()*.9,p:Math.random()*6}));
  for(let i=0;i<Math.min(110,Math.floor(innerWidth/12));i++)fl.push({x:Math.random()*W,y:Math.random()*H,r:Math.random()*2.2+.7,s:Math.random()*.7+.3,p:Math.random()*6});
    const mkFlake=(size,seed,blur)=>{
    const R=a=>{seed=(seed*9301+49297)%233280;return seed/233280*a;};
    const c=document.createElement('canvas');c.width=c.height=size*2;const x=c.getContext('2d');
    x.translate(size,size);x.lineCap='round';x.strokeStyle='rgba(255,255,255,.96)';x.shadowColor='rgba(170,210,255,.95)';x.shadowBlur=size*.16;
    const br=[.28+R(.12),.5+R(.1),.7+R(.08)],bl=[.3+R(.12),.22+R(.08),.14+R(.06)],plate=R(1)>.55;
    for(let i=0;i<6;i++){x.save();x.rotate(i*Math.PI/3);
      x.lineWidth=size*.06;x.beginPath();x.moveTo(0,0);x.lineTo(0,-size*.92);x.stroke();
      x.lineWidth=size*.038;
      br.forEach((t,k)=>{const L=size*bl[k],y=-size*t;x.beginPath();x.moveTo(0,y);x.lineTo(L*.87,y-L*.5);x.moveTo(0,y);x.lineTo(-L*.87,y-L*.5);x.stroke();});
      x.beginPath();x.moveTo(-size*.07,-size*.82);x.lineTo(0,-size*.97);x.lineTo(size*.07,-size*.82);x.stroke();
      x.restore();}
    if(plate){x.fillStyle='rgba(235,245,255,.35)';x.beginPath();for(let i=0;i<6;i++){const a=i*Math.PI/3;x.lineTo(Math.sin(a)*size*.22,-Math.cos(a)*size*.22);}x.closePath();x.fill();}
    x.fillStyle='rgba(255,255,255,.95)';x.beginPath();x.arc(0,0,size*.07,0,7);x.fill();
    if(!blur)return c;
    const o=document.createElement('canvas');o.width=o.height=size*2;const y=o.getContext('2d');y.filter='blur('+blur+'px)';y.drawImage(c,0,0);return o;
  };
  const sharpS=[11,23,37,59].map(s=>mkFlake(40,s,0)),blurS=[71,83,97].map(s=>mkFlake(40,s,3.4));
  const flakes=Array.from({length:Math.min(80,Math.floor(innerWidth/18))},()=>{const r=Math.random(),L=r<.5?0:r<.88?1:2;
    return{x:Math.random()*innerWidth,y:Math.random()*innerHeight,L,d:L===0?8+Math.random()*10:L===1?20+Math.random()*16:46+Math.random()*44,v:L===0?.25+Math.random()*.25:L===1?.6+Math.random()*.5:1.2+Math.random()*.9,a:L===0?.55:L===1?.85:.5,p:Math.random()*6,rot:Math.random()*6,rv:(Math.random()-.5)*.02,spr:L===2?blurS[(Math.random()*3)|0]:sharpS[(Math.random()*4)|0]};}).sort((a,b)=>a.L-b.L);
  const drawFlakes=t=>{flakes.forEach(f=>{f.y+=f.v;f.x+=Math.sin(t/1300+f.p)*.25*(f.L+1)+.15*f.L;f.rot+=f.rv;if(f.y>H+f.d){f.y=-f.d;f.x=Math.random()*W;}if(f.x>W+f.d)f.x=-f.d;ctx.globalAlpha=f.a;ctx.save();ctx.translate(f.x,f.y);ctx.rotate(f.rot);ctx.drawImage(f.spr,-f.d/2,-f.d/2,f.d,f.d);ctx.restore();});};  (function loop(t){
    ctx.clearRect(0,0,W,H);ctx.fillStyle=document.documentElement.dataset.theme==='night'?'#fff':'#9db8dc';
    drawFlakes(t);
    ctx.globalCompositeOperation='lighter';
    sparks.forEach(s=>{s.y-=s.v;s.x+=Math.sin(t/900+s.p)*.3;if(s.y<-20){s.y=H+20;s.x=Math.random()*W;}ctx.globalAlpha=(.3+.7*Math.abs(Math.sin(t/700+s.p)))*.8;const r=s.r*14;ctx.drawImage(spr,s.x-r/2,s.y-r/2,r,r);});
    ctx.globalCompositeOperation='source-over';
    requestAnimationFrame(loop);})(0);
})();

/* ============ ГИРЛЯНДА И 3D-НАКЛОН КАРТИНОК ============ */
(function garland(){
  const g=$('#garland'); if(!g)return;
  const NS='http://www.w3.org/2000/svg', rnd=(a,b)=>a+Math.random()*(b-a);
  const C=[['#ffb3a8','#ff3b3b','#7a0f10'],['#fff0b0','#ffc24a','#8a5a08'],['#c4ecff','#4db8ff','#124d85'],['#c8ffd4','#5be07a','#146b2c'],['#ffd0ec','#ff7ac8','#85205f']];
  const pt=(a,b,c,t)=>[(1-t)*(1-t)*a[0]+2*(1-t)*t*b[0]+t*t*c[0],(1-t)*(1-t)*a[1]+2*(1-t)*t*b[1]+t*t*c[1]];
  const build=()=>{
    const W=innerWidth, n=Math.max(4,Math.round(W/200)), aw=W/n, sag=15;
    const defs=C.map((c,i)=>`<radialGradient id="gb${i}" cx=".35" cy=".3" r=".85"><stop offset="0" stop-color="${c[0]}"/><stop offset=".45" stop-color="${c[1]}"/><stop offset="1" stop-color="${c[2]}"/></radialGradient><radialGradient id="gg${i}"><stop offset="0" stop-color="${c[1]}" stop-opacity=".75"/><stop offset=".4" stop-color="${c[1]}" stop-opacity=".28"/><stop offset="1" stop-color="${c[1]}" stop-opacity="0"/></radialGradient>`).join('')
      +'<linearGradient id="gcap" x1="0" x2="1"><stop offset="0" stop-color="#7a5a1c"/><stop offset=".4" stop-color="#f0d27a"/><stop offset="1" stop-color="#5a3f10"/></linearGradient>';
    const ndl=['#0d3322','#14472f','#1f6340','#2c7d52','#3f9a68'];
    let out='', bulbs='', bi=0;
    for(let a=0;a<n;a++){
      const P0=[a*aw-2,6],P2=[(a+1)*aw+2,6],P1=[(P0[0]+P2[0])/2,6+2*sag], d=`M${P0[0]} ${P0[1]} Q${P1[0]} ${P1[1]} ${P2[0]} ${P2[1]}`;
      out+=`<path d="${d}" stroke="#0a2217" stroke-width="9" fill="none" stroke-linecap="round"/><path d="${d}" stroke="#17452d" stroke-width="5" fill="none" stroke-linecap="round"/>`;
      for(let k=0;k<80;k++){const t=k/79,[x,y]=pt(P0,P1,P2,t), dx=2*(1-t)*(P1[0]-P0[0])+2*t*(P2[0]-P1[0]), dy=2*(1-t)*(P1[1]-P0[1])+2*t*(P2[1]-P1[1]);
        const na=Math.atan2(dy,dx)+Math.PI/2+(Math.random()-.5)*2.6, L=rnd(7,13), col=ndl[(Math.random()*5)|0];
        out+=`<path d="M${x.toFixed(1)} ${y.toFixed(1)} l${(Math.cos(na)*L).toFixed(1)} ${(Math.sin(na)*L).toFixed(1)}" stroke="${col}" stroke-width="1.6" stroke-linecap="round"/>`;}
      for(let k=0;k<4;k++){const [x,y]=pt(P0,P1,P2,rnd(.08,.92));out+=`<circle cx="${x.toFixed(1)}" cy="${(y+rnd(0,5)).toFixed(1)}" r="2.4" fill="#c4262c"/><circle cx="${(x-.7).toFixed(1)}" cy="${(y-.6).toFixed(1)}" r=".8" fill="#fff" opacity=".7"/>`;}
      [.22,.5,.78].forEach(t=>{const [x,y]=pt(P0,P1,P2,t),ci=bi%5,dl=((bi*.37)%2.4).toFixed(2);bi++;
        bulbs+=`<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)})"><circle class="gl" style="animation-delay:${dl}s" cx="0" cy="17" r="26" fill="url(#gg${ci})"/>
          <path d="M0 0 V5" stroke="#0a2217" stroke-width="1.4"/><rect x="-3.2" y="4" width="6.4" height="6" rx="1" fill="url(#gcap)"/><path d="M-3.2 6 h6.4 M-3.2 8 h6.4" stroke="#3a2808" stroke-width=".6"/>
          <path d="M-3.6 10 C-8 15 -7.5 24 0 26 C7.5 24 8 15 3.6 10Z" fill="url(#gb${ci})" class="bl" style="animation-delay:${dl}s"/>
          <ellipse cx="-2.4" cy="15" rx="1.6" ry="3.4" fill="#fff" opacity=".7" transform="rotate(12 -2.4 15)"/></g>`;});
    }
    g.innerHTML=`<svg viewBox="0 0 ${W} 64" width="${W}" height="64" xmlns="${NS}"><defs>${defs}</defs>${out}${bulbs}</svg>`;
  };
  build();let rt;addEventListener('resize',()=>{clearTimeout(rt);rt=setTimeout(build,200);});
})();
document.addEventListener('pointermove',e=>{
  const el=e.target.closest&&e.target.closest('.hero-art,.p-art,.shot'); if(!el||el.dataset.three)return;
  const r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
  el.style.transform=`perspective(900px) rotateY(${x*9}deg) rotateX(${-y*9}deg)`;
});
document.addEventListener('pointerout',e=>{const el=e.target.closest&&e.target.closest('.hero-art,.p-art,.shot');if(el)el.style.transform='';});
updateCount();
const _ph=new Image(); const _go=()=>render(true);
_ph.onload=()=>{HAS_PHOTO=true;buildStage();if(!localStorage.getItem('theme2'))if(!new URLSearchParams(location.search).get('theme'))setTheme('night');_go();}; _ph.onerror=_go; _ph.src=PHOTO;

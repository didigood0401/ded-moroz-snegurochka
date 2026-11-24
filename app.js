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
function santa(x,y,s,vip){
  const coat=vip?'#1e3fae':'#d62839', trim=vip?'#f6c453':'#fff', dark=vip?'#142a7a':'#a81c2a';
  return `<g transform="translate(${x} ${y}) scale(${s})">
  <path d="M-62 120 Q-70 40 -34 22 L34 22 Q70 40 62 120Z" fill="${coat}"/>
  <path d="M-8 22 L8 22 L12 120 L-12 120Z" fill="${trim}"/>
  ${vip?'<g fill="#f6c453"><circle cx="0" cy="55" r="4"/><circle cx="0" cy="80" r="4"/><circle cx="0" cy="105" r="4"/></g>':''}
  <path d="M-62 108 H62 V120 H-62Z" fill="${trim}"/>
  <circle cx="0" cy="-8" r="34" fill="#ffd3b0"/>
  <path d="M-38 -2 Q-44 56 0 68 Q44 56 38 -2 Q26 18 0 18 Q-26 18 -38 -2Z" fill="#fff"/>
  <path d="M-16 26 Q0 16 16 26 Q0 34 -16 26Z" fill="#f1f1f1"/>
  <circle cx="-12" cy="-10" r="3.4" fill="#223"/><circle cx="12" cy="-10" r="3.4" fill="#223"/>
  <circle cx="0" cy="3" r="6.5" fill="#f0a08a"/>
  <path d="M-16 -19 Q-12 -23 -6 -20 M6 -20 Q12 -23 16 -19" stroke="#ddd" stroke-width="3" fill="none" stroke-linecap="round"/>
  <path d="M-38 -14 Q-36 -58 0 -62 Q36 -58 38 -14Z" fill="${coat}"/>
  <rect x="-42" y="-24" width="84" height="16" rx="8" fill="${trim}"/>
  <circle cx="30" cy="-66" r="10" fill="${trim}"/>
  <path d="M-60 62 q-16 30 0 40" stroke="${dark}" stroke-width="14" stroke-linecap="round" fill="none"/>
  ${vip?'<rect x="66" y="-20" width="5" height="140" rx="2" fill="#f6c453"/><circle cx="68" cy="-26" r="12" fill="#bfe4ff" stroke="#f6c453" stroke-width="3"/>':'<rect x="66" y="10" width="5" height="110" rx="2" fill="#c9923a"/>'}
  </g>`;
}
function maiden(x,y,s,vip){
  const coat=vip?'#7b3fe4':'#4aa3ff', trim=vip?'#f6c453':'#fff';
  return `<g transform="translate(${x} ${y}) scale(${s})">
  <path d="M-52 120 Q-56 44 -26 24 L26 24 Q56 44 52 120Z" fill="${coat}"/>
  <path d="M-52 106 H52 V120 H-52Z" fill="${trim}"/>
  <path d="M-14 24 L0 60 L14 24Z" fill="${trim}" opacity=".85"/>
  <path d="M-30 -6 Q-44 40 -26 90 Q-20 40 -20 -6Z" fill="#e8b25a"/>
  <path d="M30 -6 Q44 40 26 90 Q20 40 20 -6Z" fill="#e8b25a"/>
  <circle cx="-26" cy="92" r="6" fill="#ff7a9a"/><circle cx="26" cy="92" r="6" fill="#ff7a9a"/>
  <circle cx="0" cy="-8" r="30" fill="#ffd3b0"/>
  <path d="M-30 -8 Q-30 -34 0 -36 Q30 -34 30 -8 Q18 -22 0 -22 Q-18 -22 -30 -8Z" fill="#e8b25a"/>
  <circle cx="-11" cy="-5" r="3.2" fill="#223"/><circle cx="11" cy="-5" r="3.2" fill="#223"/>
  <circle cx="-18" cy="6" r="5" fill="#ff9aa8" opacity=".55"/><circle cx="18" cy="6" r="5" fill="#ff9aa8" opacity=".55"/>
  <path d="M-8 8 Q0 15 8 8" stroke="#c0394f" stroke-width="3" fill="none" stroke-linecap="round"/>
  <path d="M-30 -22 L-24 -58 L-10 -46 L0 -66 L10 -46 L24 -58 L30 -22Z" fill="${vip?'#f6c453':'#dff1ff'}" stroke="${vip?'#fff':'#8fd3ff'}" stroke-width="2"/>
  </g>`;
}
function art(p){
  const dots=Array.from({length:16},(_,i)=>`<circle cx="${(i*47+13)%200}" cy="${(i*29+9)%120}" r="${i%3?1.2:2}" fill="#fff" opacity=".55"/>`).join('');
  const two=p.who.length===2;
  return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <rect width="200" height="200" style="fill:var(--sky)"/>${dots}
    <path d="M0 160 Q50 142 100 156 T200 150 V200 H0Z" style="fill:var(--ground1)"/><path d="M0 178 Q60 166 120 176 T200 172 V200 H0Z" style="fill:var(--ground2)"/>
    <path d="M18 150 l14 -44 l14 44z" fill="#2a7a64"/><path d="M26 126 l6 -22 l6 22z" fill="#3b9a80"/>
    ${two?santa(70,52,.85,p.vip)+maiden(142,66,.74,p.vip):santa(100,48,1.05,p.vip)}
  </svg>`;
}

/* ============ СОСТОЯНИЕ ============ */
let cart = JSON.parse(localStorage.getItem('cart')||'[]');
const saveCart=()=>{localStorage.setItem('cart',JSON.stringify(cart));updateCount();};
function updateCount(){$('#cartCount').textContent=cart.length;}
function toast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('on');clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove('on'),2400);}

/* ============ ТЕМЫ ============ */
function setTheme(t){
  document.documentElement.dataset.theme=t;localStorage.setItem('theme',t);
  $$('[data-theme-set]').forEach(b=>b.classList.toggle('on',b.dataset.themeSet===t));
}
$$('[data-theme-set]').forEach(b=>b.onclick=()=>setTheme(b.dataset.themeSet));
setTheme(localStorage.getItem('theme')||'card');

/* ============ РОУТЕР С ПЕРЕХОДАМИ ============ */
const app=$('#app'),curtain=$('#curtain');
let busyNav=false,lastClick={x:innerWidth/2,y:innerHeight/2};
addEventListener('pointerdown',e=>{lastClick={x:e.clientX,y:e.clientY};},true);
const route=()=>location.hash.replace(/^#/,'')||'/';
async function render(first){
  if(busyNav)return; busyNav=true; const r=route();
  curtain.style.setProperty('--cx',lastClick.x+'px');curtain.style.setProperty('--cy',lastClick.y+'px');
  if(!first){curtain.className='curtain in';await new Promise(res=>setTimeout(res,450));}
  window.scrollTo(0,0);
  const [,page,arg]=r.split('/');
  if(page==='product')app.innerHTML=viewProduct(+arg);
  else if(page==='cart')app.innerHTML=viewCart();
  else if(page==='checkout')app.innerHTML=viewCheckout();
  else if(page==='done')app.innerHTML=viewDone(arg);
  else app.innerHTML=viewHome();
  bind(page,arg);observeReveal();
  if(!first){curtain.className='curtain out';setTimeout(()=>{curtain.className='curtain';},520);}
  busyNav=false;
  if(route()!==r)render();
}
addEventListener('hashchange',()=>render());
addEventListener('scroll',()=>$('#header').classList.toggle('scrolled',scrollY>30),{passive:true});
function observeReveal(){
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('show');io.unobserve(e.target);}}),{threshold:.1});
  $$('.reveal').forEach(el=>{el.style.transitionDelay=(el.dataset.d||0)+'ms';io.observe(el);});
}

/* ============ СТРАНИЦЫ ============ */
function viewHome(){
  return `<div class="page">
  <div class="hero">
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
    <div class="hero-art">${art(PRODUCTS[3])}</div>
  </div>

  <section id="catalog">
    <h2 class="sec-title reveal">Программы</h2>
    <p class="sec-sub reveal">Выберите, кто придёт к вам на праздник</p>
    <div class="grid">${PRODUCTS.map((p,i)=>`
      <a class="card reveal" data-d="${i*90}" href="#/product/${p.id}">
        <div class="thumb"><span class="tag ${p.vip?'vip':''}">${p.vip?'VIP':'Стандарт'}</span>${art(p)}</div>
        <div class="body"><h3>${p.name}</h3><p>${p.desc}</p>
          <div class="price-row"><div class="from">от<b>${rub(p.prices[15])}</b></div><span class="go">Выбрать</span></div></div>
      </a>`).join('')}</div>
  </section>

  <section id="how">
    <h2 class="sec-title reveal">Как заказать</h2><p class="sec-sub reveal">Как в обычном интернет-магазине</p>
    <div class="steps reveal">
      ${[['Выберите программу','Дед Мороз один или со Снегурочкой, стандарт или VIP.'],['Дата, время, длительность','Календарь покажет свободное время. Цена пересчитывается сразу.'],['Корзина и оплата','Можно заказать несколько поздравлений в разные дни.'],['Мы перезвоним','Подтвердим время и адрес, обсудим детали программы.']]
      .map(s=>`<div class="step"><h4>${s[0]}</h4><p>${s[1]}</p></div>`).join('')}
    </div>
  </section>

  <section id="faq">
    <h2 class="sec-title reveal">Вопросы и ответы</h2><p class="sec-sub reveal">Текст в этом блоке — пример, итоговые условия согласуются</p>
    <div class="faq reveal">
      <details><summary>Как формируется цена?</summary><p>Цена зависит от программы, длительности и даты. В самые востребованные дни (30–31 декабря, 1 января) и в вечернее время действует повышающий коэффициент. Итоговая цена видна до оплаты.</p></details>
      <details><summary>Можно ли перенести заказ?</summary><p>Да, позвоните нам не позднее чем за 24 часа.</p></details>
      <details><summary>Вы выезжаете за город?</summary><p>Да, стоимость выезда уточняется при подтверждении заказа.</p></details>
      <details><summary>Как проходит оплата?</summary><p>Онлайн картой или по договорённости артисту на месте.</p></details>
    </div>
  </section></div>`;
}

const sel={date:null,time:null,dur:30,month:0};
function viewProduct(id){
  const p=PRODUCTS.find(x=>x.id===id); if(!p)return `<div class="narrow page"><h1>Не найдено</h1><a class="btn" href="#/">На главную</a></div>`;
  Object.assign(sel,{date:null,time:null,dur:30,month:0});
  return `<div class="page product">
    <div><a class="back" href="#/">← Все программы</a><div class="p-art">${art(p)}</div></div>
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
  for(let i=0;i<Math.min(80,Math.floor(innerWidth/16));i++)fl.push({x:Math.random()*W,y:Math.random()*H,r:Math.random()*2.2+.7,s:Math.random()*.7+.3,p:Math.random()*6});
  (function loop(t){
    if(document.documentElement.dataset.theme==='night'){
      ctx.clearRect(0,0,W,H);ctx.fillStyle='#fff';
      fl.forEach(f=>{f.y+=f.s+f.r*.12;f.x+=Math.sin(t/1400+f.p)*.35;if(f.y>H+5){f.y=-5;f.x=Math.random()*W;}
        ctx.globalAlpha=.35+f.r/5;ctx.beginPath();ctx.arc(f.x,f.y,f.r,0,7);ctx.fill();});
    }
    requestAnimationFrame(loop);})(0);
})();

updateCount();render(true);

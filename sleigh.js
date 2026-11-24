'use strict';
/* Сцена «Дед Мороз на санях с оленями» над ночной деревней. window.SKY = {svg, update(p,t)} */
(function(){
const rnd=i=>{const x=Math.sin(i*127.1+3.7)*43758.5453;return x-Math.floor(x);};
const stars=Array.from({length:110},(_,i)=>`<circle class="tw ${['','d2','d3'][i%3]}" cx="${(rnd(i)*1600).toFixed(0)}" cy="${(rnd(i+200)*520).toFixed(0)}" r="${(.7+rnd(i+400)*1.6).toFixed(1)}" fill="#fff" opacity="${(.5+rnd(i+600)*.5).toFixed(2)}"/>`).join('');

function reindeer(x,y,s,rudolph,d){
  const leg=(p,cls,dl)=>`<g class="leg ${cls}" style="animation-delay:${dl}s"><path d="${p}" stroke="#0c1226" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>`;
  return `<g transform="translate(${x} ${y}) scale(${s})"><g class="gal" style="animation-delay:${d}s">
  ${leg('M24 10 C38 24 52 30 64 42','',0)}${leg('M-26 10 C-40 24 -52 38 -64 44','b',0)}
  <path d="M-46 0 C-46 -22 -10 -30 20 -25 C42 -22 50 -12 47 0 C45 14 20 21 -5 21 C-30 21 -46 14 -46 0Z" fill="url(#rdBody)"/>
  <path d="M-40 -14 C-18 -30 22 -28 46 -14" stroke="#b4ccff" stroke-width="1.8" fill="none" opacity=".5"/>
  <path d="M-46 -6 C-56 -10 -60 -2 -56 6 C-52 2 -48 2 -46 4Z" fill="#e9dcc8"/>
  <path d="M26 -22 C40 -34 52 -50 60 -66 L76 -58 C70 -44 62 -28 52 -8Z" fill="url(#rdBody)"/>
  <path d="M60 -68 C66 -77 80 -75 90 -65 C97 -58 99 -54 95 -51 C88 -47 78 -52 72 -52 C64 -54 58 -60 60 -68Z" fill="url(#rdBody)"/>
  <path d="M62 -70 C58 -80 52 -80 50 -74 C54 -72 58 -70 62 -66Z" fill="#3a2414"/>
  <circle cx="76" cy="-62" r="1.8" fill="#f6e6b8"/>
  <path d="M70 -68 C66 -86 74 -100 66 -118 M68 -86 C58 -92 54 -102 48 -106 M72 -98 C82 -102 86 -112 84 -122 M66 -110 C60 -114 58 -122 52 -126" stroke="#0e1428" stroke-width="3.2" fill="none" stroke-linecap="round"/>
  <path d="M34 -16 Q42 2 38 18" stroke="#c0242f" stroke-width="3.5" fill="none"/><circle cx="40" cy="16" r="3.6" fill="url(#gdG)"/>
  <circle cx="95" cy="-54" r="${rudolph?5.5:4}" fill="${rudolph?'#ff2d2d':'#1a0f08'}"/>${rudolph?'<circle cx="95" cy="-54" r="16" fill="url(#redGlow)"/>':''}
  ${leg('M30 12 C40 28 36 40 44 54','b',.12)}${leg('M-20 12 C-14 28 -22 42 -16 54','',.12)}
  </g></g>`;
}
function sleigh(){
  return `<g class="sl">
  <path d="M-74 54 C-44 70 54 70 90 44 C101 36 105 22 98 11" stroke="url(#gdG)" stroke-width="6" fill="none" stroke-linecap="round"/>
  <path d="M-42 58 V30 M30 60 V30" stroke="url(#gdG)" stroke-width="4"/>
  <ellipse cx="-52" cy="-10" rx="32" ry="28" fill="#8a5a2b"/><path d="M-70 -26 Q-52 -40 -34 -26" stroke="#c9a05a" stroke-width="4" fill="none"/>
  <rect x="-70" y="-30" width="20" height="16" rx="2" fill="#d33a4a" transform="rotate(-14 -60 -22)"/><rect x="-46" y="-34" width="18" height="16" rx="2" fill="#3f8fe0" transform="rotate(12 -36 -26)"/>
  <path d="M-76 36 L-68 -10 C-30 -2 36 -4 72 -22 C88 -27 96 -18 94 -6 C92 16 78 36 42 44 C0 52 -40 46 -76 36Z" fill="url(#slRed)" stroke="url(#gdG)" stroke-width="3"/>
  <path d="M-68 -10 C-30 -2 36 -4 72 -22" stroke="url(#gdG)" stroke-width="5" fill="none"/>
  <path d="M-60 22 C-30 30 20 28 60 14" stroke="url(#gdG)" stroke-width="2.4" fill="none" opacity=".8"/>
  <path d="M94 -6 C106 -14 114 -4 104 6" stroke="url(#gdG)" stroke-width="4" fill="none" stroke-linecap="round"/>
  <ellipse cx="14" cy="-6" rx="25" ry="24" fill="#c8192b"/><path d="M-6 -2 H34" stroke="#17171f" stroke-width="5"/>
  <circle cx="18" cy="-42" r="15" fill="#f6c3a0"/>
  <path d="M3 -40 Q2 -16 18 -12 Q34 -16 33 -40 Q26 -30 18 -30 Q10 -30 3 -40Z" fill="#fff"/>
  <path d="M4 -48 Q10 -70 30 -60 L44 -52 Q30 -54 22 -52 Q12 -56 4 -48Z" fill="#c8192b"/><rect x="2" y="-52" width="32" height="8" rx="4" fill="#fff"/><circle cx="46" cy="-52" r="6" fill="#fff"/>
  <circle cx="24" cy="-44" r="1.6" fill="#223"/><circle cx="12" cy="-44" r="1.6" fill="#223"/><circle cx="18" cy="-38" r="3.2" fill="#f09078"/>
  <path d="M34 -8 Q60 -16 66 -34" stroke="#c8192b" stroke-width="10" stroke-linecap="round" fill="none"/><circle cx="67" cy="-38" r="6" fill="#fff"/>
  </g>`;
}
function house(x,y,w,h,lit){
  const rh=h*.62, mid=x+w/2;
  return `<g><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#0b1535"/>
  <path d="M${x-9} ${y+3} L${mid} ${y-rh} L${x+w+9} ${y+3}Z" fill="#09112c"/><path d="M${x-9} ${y+3} L${mid} ${y-rh} L${x+w+9} ${y+3}" stroke="#dbe8ff" stroke-width="4.5" fill="none" stroke-linejoin="round" opacity=".9"/>
  <rect x="${x+w*.72}" y="${y-rh*.9}" width="${w*.12}" height="${rh*.55}" fill="#0b1535"/>
  <circle class="smoke" cx="${x+w*.78}" cy="${y-rh}" r="4" fill="#b9c8e6" opacity=".28"/><circle class="smoke s2" cx="${x+w*.78}" cy="${y-rh}" r="5" fill="#b9c8e6" opacity=".22"/>
  ${[.18,.58].map(k=>`<circle cx="${x+w*k+w*.12}" cy="${y+h*.39}" r="${w*.34}" fill="url(#winGlow)"/><rect x="${x+w*k}" y="${y+h*.22}" width="${w*.24}" height="${h*.34}" fill="#ffd98a"/><path d="M${x+w*k+w*.12} ${y+h*.22} v${h*.34} M${x+w*k} ${y+h*.39} h${w*.24}" stroke="#7a4a1a" stroke-width="1.6"/>`).join('')}
  ${lit?`<path d="M${x-4} ${y+3} Q${mid} ${y+14} ${x+w+4} ${y+3}" stroke="#ff9d7a" stroke-width="2" fill="none" stroke-dasharray="2 7" stroke-linecap="round" class="tw"/>`:''}</g>`;
}
function fir(x,y,s){return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 -150 L34 -60 L18 -62 L44 -10 L20 -12 L50 40 H-50 L-20 -12 L-44 -10 L-18 -62 L-34 -60Z" fill="#0a2230"/><path d="M0 -150 L34 -60 M18 -62 L44 -10 M20 -12 L50 40" stroke="#cfe0ff" stroke-width="2.5" opacity=".45" fill="none"/><rect x="-5" y="40" width="10" height="14" fill="#1a1008"/></g>`;}

const houses=[[60,740,130,100,1],[260,760,100,80,0],[470,730,150,110,1],[690,770,96,70,0],[860,740,140,100,1],[1070,760,110,80,0],[1260,730,150,110,1],[1470,764,100,76,0]];
const firs=[[20,800,.9],[210,820,.7],[420,810,.8],[640,830,.65],[800,815,.75],[1030,825,.7],[1230,812,.8],[1440,822,.7],[1580,800,.9]];

const svg=`<svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
<defs>
 <linearGradient id="skyG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#040a22"/><stop offset=".55" stop-color="#0e2757"/><stop offset=".9" stop-color="#2d5190"/><stop offset="1" stop-color="#6a7fb0"/></linearGradient>
 <radialGradient id="maria"><stop offset="0" stop-color="#b9ad78" stop-opacity=".55"/><stop offset=".6" stop-color="#bfb482" stop-opacity=".3"/><stop offset="1" stop-color="#c8bd8a" stop-opacity="0"/></radialGradient><radialGradient id="moonLimb"><stop offset=".72" stop-color="#0a1230" stop-opacity="0"/><stop offset="1" stop-color="#0a1230" stop-opacity=".6"/></radialGradient><radialGradient id="moonG" cx=".38" cy=".35" r=".8"><stop offset="0" stop-color="#fffdf0"/><stop offset=".7" stop-color="#f6efc8"/><stop offset="1" stop-color="#d9cfa0"/></radialGradient>
 <linearGradient id="auG" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#3dffb0" stop-opacity="0"/><stop offset=".5" stop-color="#3de0c0" stop-opacity=".5"/><stop offset="1" stop-color="#8a6bff" stop-opacity="0"/></linearGradient>
 <linearGradient id="rdBody" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#27324f"/><stop offset="1" stop-color="#090e1e"/></linearGradient>
 <linearGradient id="slRed" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#c0303c"/><stop offset=".6" stop-color="#7a1220"/><stop offset="1" stop-color="#2a060c"/></linearGradient>
 <linearGradient id="gdG" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff3b8"/><stop offset=".5" stop-color="#f2c14e"/><stop offset="1" stop-color="#a9741a"/></linearGradient>
 <linearGradient id="snG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e9f1ff"/><stop offset="1" stop-color="#9db4de"/></linearGradient>
 <radialGradient id="redGlow"><stop offset="0" stop-color="#ff4b4b" stop-opacity=".95"/><stop offset="1" stop-color="#ff4b4b" stop-opacity="0"/></radialGradient>
 <radialGradient id="winGlow"><stop offset="0" stop-color="#ffc45a" stop-opacity=".7"/><stop offset="1" stop-color="#ffc45a" stop-opacity="0"/></radialGradient><radialGradient id="moonGlow"><stop offset="0" stop-color="#fff6cc" stop-opacity=".5"/><stop offset="1" stop-color="#fff6cc" stop-opacity="0"/></radialGradient><radialGradient id="auR"><stop offset="0" stop-color="#46f0c0" stop-opacity=".55"/><stop offset=".55" stop-color="#3ab8d8" stop-opacity=".25"/><stop offset="1" stop-color="#7a5cff" stop-opacity="0"/></radialGradient>
</defs>
<rect width="1600" height="900" fill="url(#skyG)"/>
<g><ellipse class="aur" cx="500" cy="230" rx="620" ry="150" fill="url(#auR)" transform="rotate(-8 500 230)"/><ellipse class="aur a2" cx="1100" cy="150" rx="560" ry="120" fill="url(#auR)" opacity=".8" transform="rotate(6 1100 150)"/></g>
${stars}
<circle cx="1180" cy="230" r="260" fill="url(#moonGlow)"/>
<circle cx="1180" cy="230" r="112" fill="url(#moonG)"/>
<ellipse cx="1146" cy="204" rx="36" ry="27" fill="url(#maria)" transform="rotate(-22 1146 204)"/><ellipse cx="1218" cy="256" rx="42" ry="31" fill="url(#maria)" transform="rotate(24 1218 256)"/>
<ellipse cx="1186" cy="166" rx="28" ry="14" fill="url(#maria)"/><ellipse cx="1128" cy="268" rx="24" ry="19" fill="url(#maria)"/><ellipse cx="1226" cy="196" rx="20" ry="26" fill="url(#maria)" opacity=".7"/>
<g fill="#e2d8ab" stroke="#c8bd8a" stroke-width="1.2" opacity=".75"><circle cx="1160" cy="238" r="9"/><circle cx="1206" cy="204" r="6.5"/><circle cx="1196" cy="286" r="11"/><circle cx="1136" cy="190" r="5"/><circle cx="1236" cy="236" r="7"/><circle cx="1170" cy="300" r="5"/></g>
<circle cx="1180" cy="230" r="112" fill="url(#moonLimb)"/>
<circle cx="1180" cy="230" r="122" fill="none" stroke="#fff6cc" stroke-opacity=".22" stroke-width="7"/>

<path d="M0 700 Q200 640 420 690 T820 670 T1240 690 T1600 650 V900 H0Z" fill="#1a2f63"/>
<path d="M0 750 Q260 700 520 740 T1020 725 T1600 735 V900 H0Z" fill="#12234d"/>
${firs.filter((f,i)=>i%2===0).map(f=>fir(f[0],f[1]-20,f[2]*.8)).join('')}
${houses.map(h=>house(h[0],h[1],h[2],h[3],h[4])).join('')}
${firs.filter((f,i)=>i%2===1).map(f=>fir(f[0],f[1],f[2])).join('')}
<path d="M0 830 Q300 790 640 825 T1300 810 T1600 820 V900 H0Z" fill="url(#snG)"/>
<g id="trail">${Array.from({length:18},(_,i)=>`<circle class="spk" style="animation-delay:${(i*.09).toFixed(2)}s" cx="${-20-i*34}" cy="${(rnd(i+30)*70-20).toFixed(0)}" r="${(2+rnd(i+60)*3).toFixed(1)}" fill="#ffe9a0"/>`).join('')}</g>
<g id="fleet">${sleigh()}
 <path d="M104 -4 C260 -30 360 -20 560 -40" stroke="#f2c14e" stroke-width="1.6" fill="none" opacity=".7"/>
 ${reindeer(250,8,.72,false,.1)}${reindeer(380,-6,.72,false,.3)}${reindeer(510,6,.72,false,.5)}${reindeer(650,-8,.74,true,.2)}
</g>
</svg>`;
let cur=-1;
function update(p,t){
  const f=document.getElementById('fleet'); if(!f)return;
  if(cur<0)cur=p; cur+=(p-cur)*.06; const q=cur;
  const x=-900+q*2750, y=450-Math.sin(Math.PI*q)*110+Math.sin(t*1.4)*9, r=-3+Math.sin(t*1.1)*1.2;
  f.setAttribute('transform',`translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${r.toFixed(2)}) scale(.95)`);
  const tr=document.getElementById('trail'); if(tr)tr.setAttribute('transform',`translate(${x.toFixed(1)} ${(y+8).toFixed(1)}) scale(.95)`);
}
/* ---------- Сцена R: олени в зимнем лесу на закате ---------- */
function stag(x,y,s,flip,d){
  const leg=(x0,p)=>`<path d="M${x0} 12 ${p}" stroke="#2a190e" stroke-width="7.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  const ant=(c,w)=>`<path d="M62 -104 C54 -130 66 -152 56 -178 M60 -128 C48 -134 44 -146 38 -150 M64 -150 C76 -156 80 -168 76 -178 M58 -166 C52 -170 50 -180 44 -184 M56 -178 C62 -182 62 -190 58 -196" stroke="${c}" stroke-width="${w}" fill="none" stroke-linecap="round"/>`;
  return `<g transform="translate(${x} ${y}) scale(${flip?-s:s} ${s})"><g class="idle" style="animation-delay:${d}s">
  <g opacity=".6" transform="translate(12 5)">${ant('#2a1a0e',3.2)}</g>
  ${leg(-34,'L-38 52 L-35 88')}${leg(-22,'L-20 52 L-22 88')}${leg(28,'L30 52 L27 88')}${leg(38,'L42 52 L45 88')}
  <g fill="#120b06">${[-35,-22,27,45].map(a=>`<ellipse cx="${a}" cy="90" rx="6.5" ry="3.2"/>`).join('')}</g>
  <path d="M-46 0 C-46 -22 -10 -30 20 -25 C42 -22 50 -12 47 0 C45 14 20 21 -5 21 C-30 21 -46 14 -46 0Z" fill="url(#rdBodyR)"/>
  <ellipse cx="0" cy="13" rx="34" ry="8" fill="#d9c9ad" opacity=".5"/>
  <path d="M-40 -14 C-18 -30 22 -28 46 -14" stroke="#f0c987" stroke-width="2" fill="none" opacity=".5"/>
  <path d="M-46 -6 C-56 -10 -60 -2 -56 6 C-52 2 -48 2 -46 4Z" fill="#efe4d0"/>
  <path d="M24 -22 C34 -44 42 -66 50 -88 L70 -82 C64 -62 58 -38 52 -10Z" fill="url(#rdBodyR)"/>
  <path d="M46 -72 C52 -58 54 -42 52 -26 C46 -40 44 -58 46 -72Z" fill="#cdb893" opacity=".55"/>
  <path d="M52 -94 C58 -106 76 -106 90 -96 C98 -90 101 -85 97 -82 C88 -78 76 -83 68 -81 C58 -81 50 -86 52 -94Z" fill="url(#rdBodyR)"/>
  <path d="M56 -98 C48 -108 42 -106 42 -100 C46 -98 50 -96 56 -94Z" fill="#3a2414"/>
  <circle cx="97" cy="-84" r="3.6" fill="#120b06"/><circle cx="71" cy="-93" r="2.4" fill="#120b06"/><circle cx="70.2" cy="-93.8" r=".8" fill="#fff"/>
  ${ant('#4a3320',3.8)}${ant('#9a7650',1)}
  <g class="breath"><circle cx="102" cy="-80" r="5" fill="#dfe9ff" opacity=".5"/></g><g class="breath b2"><circle cx="102" cy="-80" r="6" fill="#dfe9ff" opacity=".4"/></g>
  </g></g>`;
}
function bigFir(x,y,s){
  const tiers=9, H=tiers*56*s+110*s, top=y-H, cols=['#ffcf6a','#ffcf6a','#ffd98a','#ff6b5a','#8fd0ff'];
  let o=`<rect x="${x-9*s}" y="${y-30*s}" width="${18*s}" height="${34*s}" fill="#1a1008"/>`, lights='';
  for(let i=0;i<tiers;i++){
    const c=top+70*s+i*56*s, w=(42+i*30)*s, h=(92+i*4)*s, by=c+h*.45, ap=c-h*.55, n=5, wd=2*w/n;
    let d=`M${x} ${ap} L${x+w} ${by}`; for(let k=0;k<n;k++){d+=` Q${(x+w-(k+.5)*wd).toFixed(1)} ${by+16*s} ${(x+w-(k+1)*wd).toFixed(1)} ${by}`;} d+=' Z';
    o+=`<path d="${d}" fill="url(#gTreeR)"/>`;
    const y2=c-h*.05;
    o+=`<path d="M${x} ${ap} L${x+w*.6} ${y2} Q${x+w*.42} ${y2+10*s} ${x+w*.26} ${y2+2*s} Q${x+w*.1} ${y2+13*s} ${x} ${y2+4*s} Q${x-w*.1} ${y2+13*s} ${x-w*.26} ${y2+2*s} Q${x-w*.42} ${y2+10*s} ${x-w*.6} ${y2}Z" fill="#eef4ff" opacity=".88"/>`;
    for(let k=0;k<n-1;k++){const lx=x+w-(k+1)*wd, ly=by+3*s, ci=(i*3+k)%5, col=cols[ci];
      lights+=`<circle class="tw ${['','d2','d3'][(i+k)%3]}" cx="${lx.toFixed(1)}" cy="${ly.toFixed(1)}" r="${(15*s).toFixed(1)}" fill="${col}" opacity=".5"/><circle cx="${lx.toFixed(1)}" cy="${ly.toFixed(1)}" r="${(3.3*s).toFixed(1)}" fill="#fff6d8"/>`;}
  }
  return `<g>${o}${lights}</g>`;
}
const orbs=Array.from({length:30},(_,i)=>`<circle class="orb" style="animation-delay:${(-rnd(i+900)*9).toFixed(1)}s;animation-duration:${(7+rnd(i+950)*6).toFixed(1)}s" cx="${(rnd(i+800)*1600).toFixed(0)}" cy="${(520+rnd(i+850)*330).toFixed(0)}" r="${(3+rnd(i+700)*5).toFixed(1)}" fill="url(#orbG)"/>`).join('');
const farFirs=Array.from({length:34},(_,i)=>fir(i*50-20,700+rnd(i+11)*30,.55+rnd(i+5)*.5)).join('');
const svgR=`<svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
<defs>
 <linearGradient id="skyR" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#050d28"/><stop offset=".5" stop-color="#1b3b72"/><stop offset=".78" stop-color="#6a79ac"/><stop offset=".92" stop-color="#d99a86"/><stop offset="1" stop-color="#f0c08e"/></linearGradient>
 <linearGradient id="gTreeR" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#2c8a62"/><stop offset=".5" stop-color="#14543b"/><stop offset="1" stop-color="#06261a"/></linearGradient>
 <linearGradient id="rdBodyR" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7a5236"/><stop offset="1" stop-color="#2a180c"/></linearGradient>
 <linearGradient id="snGR" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f4d9d0"/><stop offset=".25" stop-color="#cdd9f0"/><stop offset="1" stop-color="#7f94c4"/></linearGradient>
 <radialGradient id="orbG"><stop offset="0" stop-color="#fff3b8" stop-opacity="1"/><stop offset=".4" stop-color="#ffd25a" stop-opacity=".55"/><stop offset="1" stop-color="#ffd25a" stop-opacity="0"/></radialGradient>
 <radialGradient id="winGlow"><stop offset="0" stop-color="#ffc45a" stop-opacity=".7"/><stop offset="1" stop-color="#ffc45a" stop-opacity="0"/></radialGradient>
 <radialGradient id="auR"><stop offset="0" stop-color="#46f0c0" stop-opacity=".4"/><stop offset=".55" stop-color="#3ab8d8" stop-opacity=".18"/><stop offset="1" stop-color="#7a5cff" stop-opacity="0"/></radialGradient>
 <radialGradient id="dusk"><stop offset="0" stop-color="#ffb27a" stop-opacity=".7"/><stop offset="1" stop-color="#ffb27a" stop-opacity="0"/></radialGradient>
</defs>
<rect width="1600" height="900" fill="url(#skyR)"/>
<ellipse cx="800" cy="200" rx="900" ry="120" fill="url(#auR)" class="aur"/>
<ellipse cx="800" cy="720" rx="900" ry="170" fill="url(#dusk)"/>
${stars}
<g id="bgR"><g opacity=".95" fill="#0a1a38">${farFirs.replace(/#0a2230/g,'#0b1c3c')}</g>
<path d="M0 730 Q300 690 600 725 T1200 710 T1600 722 V900 H0Z" fill="#1d3466"/>
${house(520,690,150,100,1)}</g>
<path d="M0 790 Q400 760 800 785 T1600 770 V900 H0Z" fill="url(#snGR)"/>
<g id="fgR">
${bigFir(1540,884,1.05)}
${stag(1130,690,1.25,false,0)}${stag(1345,712,1.05,true,1.5)}
<path d="M0 850 Q400 820 800 845 T1600 830 V900 H0Z" fill="#dfe8f7" opacity=".9"/>
${orbs}
</g>
</svg>`;
function updateR(px,py,t){
  const a=document.getElementById('bgR'),b=document.getElementById('fgR');
  if(a)a.setAttribute('transform',`translate(${(px*-8).toFixed(1)} ${(py*-4).toFixed(1)})`);
  if(b)b.setAttribute('transform',`translate(${(px*-20).toFixed(1)} ${(py*-8).toFixed(1)})`);
}
window.SKY={svg,svgR,update,updateR};
})();
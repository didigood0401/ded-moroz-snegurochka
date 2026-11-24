import * as THREE from 'three';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';

const std=(c,o={})=>new THREE.MeshStandardMaterial({color:c,roughness:.7,metalness:0,...o});
const fabric=c=>new THREE.MeshPhysicalMaterial({color:c,roughness:.75,sheen:1,sheenRoughness:.45,sheenColor:new THREE.Color(0xffffff)});
const fur=()=>std(0xf6f8fd,{roughness:1});
const skinMat=()=>new THREE.MeshPhysicalMaterial({color:0xf6c3a0,roughness:.55,sheen:.6,sheenColor:new THREE.Color(0xff9a8a)});
const gold=()=>std(0xf2c14e,{metalness:.9,roughness:.25});
const mesh=(g,m,x=0,y=0,z=0)=>{const o=new THREE.Mesh(g,m);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;return o;};
const sph=(r,m,x,y,z,sx=1,sy=1,sz=1)=>{const o=mesh(new THREE.SphereGeometry(r,32,24),m,x,y,z);o.scale.set(sx,sy,sz);return o;};
const lathe=(pts,m)=>{const o=new THREE.Mesh(new THREE.LatheGeometry(pts.map(p=>new THREE.Vector2(p[0],p[1])),64),m);o.castShadow=o.receiveShadow=true;return o;};
const radiusAt=(pts,y)=>{for(let i=1;i<pts.length;i++){if(y<=pts[i][1]){const a=pts[i-1],b=pts[i],t=(y-a[1])/(b[1]-a[1]||1);return a[0]+(b[0]-a[0])*t;}}return pts[pts.length-1][0];};
const torus=(r,t,m,y,rotX=Math.PI/2)=>{const o=mesh(new THREE.TorusGeometry(r,t,16,64),m,0,y,0);o.rotation.x=rotX;return o;};

/* рука: плечо -> локоть -> варежка */
function makeArm(coatMat,sx){
  const sh=new THREE.Group(); sh.position.set(sx*.62,1.58,0);
  sh.add(mesh(new THREE.CapsuleGeometry(.15,.45,8,20),coatMat,0,-.3,0));
  const el=new THREE.Group(); el.position.set(0,-.58,0); sh.add(el);
  el.add(mesh(new THREE.CapsuleGeometry(.135,.4,8,20),coatMat,0,-.25,0));
  const cuff=torus(.15,.06,fur(),-.45); el.add(cuff);
  el.add(sph(.17,fur(),0,-.62,0,1,1.05,.9));
  el.add(sph(.07,fur(),sx*-.13,-.58,.06));
  return {sh,el};
}
function makeEyes(){
  const g=new THREE.Group(); const m=std(0x141b2e,{roughness:.2});
  for(const s of [-1,1]){const e=new THREE.Group();e.position.set(s*.13,.1,.3);
    e.add(sph(.045,m,0,0,0,1,1.15,.7)); e.add(sph(.014,std(0xffffff,{emissive:0xffffff}),-.012,.02,.03)); g.add(e);}
  return g;
}

function buildSanta(vip){
  const G=new THREE.Group(), coatCol=vip?0x1e3fae:0xd01f31, coat=fabric(coatCol);
  const prof=[[0,.35],[.78,.35],[.8,.5],[.72,.95],[.62,1.35],[.5,1.6],[.3,1.75],[0,1.78]];
  const body=new THREE.Group(); G.add(body);
  body.add(lathe(prof,coat));
  body.add(torus(.795,.1,fur(),.4));
  for(let y=.5;y<=1.65;y+=.13){const r=radiusAt(prof,y); body.add(sph(.09,fur(),0,y,r*.97,1,1.1,.55));}
  body.add(torus(radiusAt(prof,.92)+.01,.07,std(0x16161d,{roughness:.4}),.92));
  body.add(mesh(new THREE.BoxGeometry(.2,.17,.05),gold(),0,.92,radiusAt(prof,.92)+.06));
  body.add(torus(.36,.07,fur(),1.72));
  for(const s of [-1,1]) body.add(mesh(new THREE.CylinderGeometry(.19,.21,.4,24),std(0x15151b,{roughness:.35}),s*.27,.18,.08),sph(.2,std(0x15151b,{roughness:.35}),s*.27,.07,.2,1,.6,1.3));
  const armR=makeArm(coat,1), armL=makeArm(coat,-1); body.add(armR.sh,armL.sh);
  armL.sh.rotation.set(-.55,0,-.22); armL.el.rotation.x=-.9;
  // посох
  const staff=new THREE.Group(); staff.position.set(-.95,0,.28);
  staff.add(mesh(new THREE.CylinderGeometry(.03,.035,2.7,12),vip?gold():std(0x8a5a2b),0,1.35,0));
  let orb=null;
  if(vip){orb=sph(.15,std(0xbfe9ff,{emissive:0x7fd0ff,emissiveIntensity:1.2,roughness:.1}),0,2.82,0); staff.add(orb,torus(.18,.03,gold(),2.82,0));
    const l=new THREE.PointLight(0x9fdcff,2.2,3);l.position.set(0,2.82,.1);staff.add(l);}
  else{staff.add(torus(.13,.035,std(0x8a5a2b),2.7,0));}
  body.add(staff);
  armL.sh.updateMatrixWorld();
  // голова
  const head=new THREE.Group(); head.position.set(0,2.08,0); G.add(head);
  head.add(sph(.36,skinMat(),0,0,0));
  head.add(sph(.37,fur(),0,-.13,.1,1.02,1,.82));
  for(const [x,y,z,r] of [[-.2,-.32,.22,.19],[0,-.44,.22,.21],[.2,-.32,.22,.19],[-.3,-.12,.1,.16],[.3,-.12,.1,.16]]) head.add(sph(r,fur(),x,y,z));
  head.add(sph(.1,fur(),-.13,-.02,.35,1.7,.6,.8)); head.add(sph(.1,fur(),.13,-.02,.35,1.7,.6,.8));
  head.add(sph(.08,std(0xf08a78,{roughness:.4}),0,.04,.38));
  for(const s of [-1,1]){head.add(sph(.07,std(0xff8a8a,{roughness:1}),s*.22,.02,.3,1,.8,.4));
    const b=mesh(new THREE.CapsuleGeometry(.025,.1,4,8),fur(),s*.13,.2,.33); b.rotation.z=Math.PI/2+s*.2; head.add(b);}
  const eyes=makeEyes(); head.add(eyes);
  const hat=new THREE.Group(); head.add(hat);
  const cone=mesh(new THREE.ConeGeometry(.4,.8,40),coat,.06,.58,-.02); cone.rotation.z=-.32; hat.add(cone);
  const brim=torus(.37,.11,fur(),.2); brim.scale.set(1,1,1); hat.add(brim);
  hat.add(sph(.12,fur(),.18,.93,-.02));
  return {group:G,body,head,eyes,armR,armL,orb,type:'santa'};
}

function buildMaiden(vip){
  const G=new THREE.Group(), col=vip?0x7b3fe4:0x4aa3ff, dress=fabric(col);
  const prof=[[0,.3],[.86,.3],[.82,.5],[.62,1.2],[.4,1.55],[.27,1.68],[0,1.7]];
  const body=new THREE.Group(); G.add(body);
  body.add(lathe(prof,dress)); body.add(torus(.84,.09,fur(),.35));
  for(let y=.5;y<=1.5;y+=.14){const r=radiusAt(prof,y); body.add(sph(.075,fur(),0,y,r*.97,1,1.1,.5));}
  body.add(torus(radiusAt(prof,1.06)+.01,.05,gold(),1.06)); body.add(torus(.3,.06,fur(),1.66));
  const armR=makeArm(dress,1), armL=makeArm(dress,-1); armR.sh.position.set(.5,1.52,0); armL.sh.position.set(-.5,1.52,0); body.add(armR.sh,armL.sh);
  armR.sh.rotation.set(-.2,0,-.2); armR.el.rotation.x=-.5;
  const head=new THREE.Group(); head.position.set(0,2.0,0); G.add(head);
  const hairM=std(0xe3a948,{roughness:.45,metalness:.1});
  head.add(sph(.32,skinMat(),0,0,0));
  head.add(sph(.35,hairM,0,.04,-.1,1.05,1.05,.95));
  head.add(sph(.3,hairM,0,.19,.07,1.05,.62,.9));
  for(const s of [-1,1]){ for(let i=0;i<7;i++) head.add(sph(.07-i*.003,hairM,s*(.3-i*.004),-.1-i*.14,.02+i*.05));
    head.add(sph(.08,std(0xe02a3a,{roughness:.3}),s*.28,-1.0,.3)); }
  head.add(sph(.065,std(0xf08a78,{roughness:.4}),0,0,.31,.9,.8,.6));
  for(const s of [-1,1]) head.add(sph(.065,std(0xff8aa0,{roughness:1}),s*.2,-.04,.25,1,.8,.4));
  const eyes=new THREE.Group(); const em=std(0x141b2e,{roughness:.2});
  for(const s of [-1,1]){const e=new THREE.Group();e.position.set(s*.12,.05,.27);e.add(sph(.045,em,0,0,0,1,1.2,.7));e.add(sph(.014,std(0xffffff,{emissive:0xffffff}),-.012,.02,.03));eyes.add(e);}
  head.add(eyes);
  const crownM=vip?gold():std(0xdff1ff,{metalness:.5,roughness:.2});
  const ring=mesh(new THREE.CylinderGeometry(.31,.34,.15,32,1,true),crownM,0,.3,-.02); ring.material.side=THREE.DoubleSide; head.add(ring);
  for(let i=0;i<9;i++){const a=(i/9)*Math.PI*2, h=.2+(i%2)*.12; const sp=mesh(new THREE.ConeGeometry(.045,h,8),crownM,Math.sin(a)*.32,.37+h/2,Math.cos(a)*.32-.02); head.add(sp);
    head.add(sph(.025,std(0xffffff,{emissive:0xffffff,emissiveIntensity:.6}),Math.sin(a)*.32,.37+h,Math.cos(a)*.32-.02));}
  head.add(sph(.05,std(0xe02a3a,{roughness:.2,metalness:.4}),0,.3,.31));
  return {group:G,body,head,eyes,armR,armL,type:'maiden'};
}

function firTree(h){
  const g=new THREE.Group(), green=std(0x1b6847,{roughness:.9}), snow=std(0xffffff,{roughness:.95});
  g.add(mesh(new THREE.CylinderGeometry(.1*h/3,.14*h/3,.5*h/3,10),std(0x4a2c14),0,.2,0));
  const lights=[];
  for(let i=0;i<5;i++){const t=i/5, r=(1.15-t*.85)*h/3, ch=h*.36, y=h*.2+t*h*.6;
    g.add(mesh(new THREE.ConeGeometry(r,ch,28),green,0,y,0)); g.add(mesh(new THREE.ConeGeometry(r*.8,ch*.5,28),snow,0,y+ch*.2,0));
    for(let k=0;k<3;k++){const a=Math.random()*6.28,c=[0xffd45a,0xff5a6a,0x7fd0ff][k];const m=std(c,{emissive:c,emissiveIntensity:1});
      const b=sph(.05*h/3,m,Math.sin(a)*r*.62,y-ch*.18,Math.cos(a)*r*.62); b.castShadow=false; g.add(b); lights.push(m);}}
  const star=sph(.09*h/3,std(0xffe27a,{emissive:0xffd45a,emissiveIntensity:1.5}),0,h*.2+h*.6+h*.34,0); g.add(star); lights.push(star.material);
  g.userData.lights=lights; return g;
}
function firBranch(len){
  const g=new THREE.Group();
  const stem=mesh(new THREE.CylinderGeometry(.03,.055,len,8),std(0x4a2c14)); stem.rotation.z=-Math.PI/2; stem.position.x=len/2; g.add(stem);
  const N=300, geo=new THREE.ConeGeometry(.04,.5,5); geo.translate(0,.25,0);
  const im=new THREE.InstancedMesh(geo,std(0xffffff,{roughness:.8}),N); im.castShadow=true;
  const d=new THREE.Object3D(), c=new THREE.Color(), up=new THREE.Vector3(0,1,0);
  for(let i=0;i<N;i++){const t=Math.random(), taper=1-t*.65, a=Math.random()*Math.PI*2, pitch=.9+Math.random()*.5;
    const dir=new THREE.Vector3(Math.cos(pitch),Math.sin(pitch)*Math.cos(a)*.7-.15,Math.sin(pitch)*Math.sin(a)).normalize();
    d.position.set(t*len,0,0); d.quaternion.setFromUnitVectors(up,dir); const s=taper*(.7+Math.random()*.6); d.scale.set(s,s,s); d.updateMatrix(); im.setMatrixAt(i,d.matrix);
    c.setHSL(.39+Math.random()*.04,.6,.09+Math.random()*.1); im.setColorAt(i,c);}
  g.add(im);
  for(let i=0;i<7;i++) g.add(sph(.07,std(0xffffff,{roughness:1}),Math.random()*len,.05+Math.random()*.1,(Math.random()-.5)*.3,1.6,.5,1.2));
  return g;
}
function pineCone(s){
  const pts=[];const n=18; for(let i=0;i<=n;i++){const t=i/n, base=Math.sin(Math.PI*Math.pow(t,.8))*.2+.012; pts.push([base*(i%2?1:.74),t*.62]);}
  const o=new THREE.Mesh(new THREE.LatheGeometry(pts.map(p=>new THREE.Vector2(p[0],p[1])),12),std(0x6b3f1d,{roughness:.8,flatShading:true}));
  o.castShadow=true; const g=new THREE.Group(); g.add(o); g.add(mesh(new THREE.CylinderGeometry(.012,.012,.25,6),std(0x4a2c14),0,.74,0));
  g.scale.setScalar(s); return g;
}
function ornament(r,col){
  const g=new THREE.Group(); g.add(sph(r,std(col,{metalness:.7,roughness:.15}),0,0,0)); g.add(mesh(new THREE.CylinderGeometry(r*.3,r*.3,r*.3,12),gold(),0,r*1.05,0));
  g.add(mesh(new THREE.CylinderGeometry(.006,.006,.25,4),gold(),0,r*1.05+.15,0)); return g;
}
function gift(w,h,d,col){
  const g=new THREE.Group(); g.add(mesh(new THREE.BoxGeometry(w,h,d),std(col,{roughness:.5}),0,h/2,0));
  g.add(mesh(new THREE.BoxGeometry(w*1.02,h*1.02,d*.14),gold(),0,h/2,0)); g.add(mesh(new THREE.BoxGeometry(w*.14,h*1.02,d*1.02),gold(),0,h/2,0));
  g.add(sph(.07,gold(),-.05,h+.04,0,1,.7,1),sph(.07,gold(),.05,h+.04,0,1,.7,1)); return g;
}
function glowTex(){
  const c=document.createElement('canvas');c.width=c.height=128;const x=c.getContext('2d'),g=x.createRadialGradient(64,64,0,64,64,64);
  g.addColorStop(0,'rgba(255,250,225,1)');g.addColorStop(.25,'rgba(255,244,200,.55)');g.addColorStop(1,'rgba(255,244,200,0)');x.fillStyle=g;x.fillRect(0,0,128,128);return new THREE.CanvasTexture(c);
}
function dotTex(){
  const c=document.createElement('canvas');c.width=c.height=32;const x=c.getContext('2d'),g=x.createRadialGradient(16,16,0,16,16,16);
  g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,32,32);return new THREE.CanvasTexture(c);
}

export function mount(el,{who=['santa'],vip=false}={}){
  const two=who.length===2, W=el.clientWidth||400, H=el.clientHeight||400;
  const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'high-performance'});
  renderer.setPixelRatio(Math.min(devicePixelRatio,2)); renderer.setSize(W,H);
  renderer.shadowMap.enabled=true; renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  renderer.toneMapping=THREE.ACESFilmicToneMapping; renderer.toneMappingExposure=.82; renderer.outputColorSpace=THREE.SRGBColorSpace;
  const cv=renderer.domElement; cv.className='three-canvas'; el.appendChild(cv);
  const scene=new THREE.Scene(), pm=new THREE.PMREMGenerator(renderer);
  scene.environment=pm.fromScene(new RoomEnvironment(),.04).texture; scene.environmentIntensity=.3;
  const cam=new THREE.PerspectiveCamera(30,W/H,.1,60); const camBase=new THREE.Vector3(0,1.9,two?10.2:8.8); cam.position.copy(camBase);
  scene.add(new THREE.HemisphereLight(0xbcd7ff,0x3a4a6a,.7));
  const key=new THREE.DirectionalLight(0xfff0d8,2.0); key.position.set(3,6,5); key.castShadow=true; key.shadow.mapSize.set(2048,2048);
  Object.assign(key.shadow.camera,{left:-6,right:6,top:6,bottom:-6,near:1,far:20}); key.shadow.bias=-.0005; key.shadow.radius=4; scene.add(key);
  const rim=new THREE.DirectionalLight(0x7fb6ff,1.8); rim.position.set(-4,3,-4); scene.add(rim);
  const warm=new THREE.PointLight(0xffb066,8,12); warm.position.set(0,2,3.5); scene.add(warm);
  // земля
  const ground=new THREE.Mesh(new THREE.CircleGeometry(9,64),std(0xeaf1fb,{roughness:.95})); ground.rotation.x=-Math.PI/2; ground.receiveShadow=true; scene.add(ground);
  for(let i=0;i<14;i++){const m=sph(.5+Math.random()*.8,std(0xf4f8ff,{roughness:1}),(Math.random()-.5)*14,0,-2-Math.random()*5,1.8,.28,1.2); m.castShadow=false; scene.add(m);}
  // ёлки
  const trees=[]; [[-3.6,-3.5,3.4],[3.8,-3,3.8],[-2,-5.5,4.4],[2.4,-5.8,4.8],[-5.5,-4.5,3.6],[5.8,-4.5,3.2]].forEach(([x,z,h])=>{const t=firTree(h);t.position.set(x,0,z);scene.add(t);trees.push(t);});
  // луна и звёзды
  const moon=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex(),transparent:true,depthWrite:false})); moon.position.set(3.6,5.4,-9); moon.scale.set(4.2,4.2,1); scene.add(moon);
  const sp=[];for(let i=0;i<140;i++)sp.push((Math.random()-.5)*26,3+Math.random()*8,-10);
  const sg=new THREE.BufferGeometry();sg.setAttribute('position',new THREE.Float32BufferAttribute(sp,3));
  scene.add(new THREE.Points(sg,new THREE.PointsMaterial({color:0xffffff,size:.06,transparent:true,opacity:.9})));
  // герои
  const heroes=[];
  if(two){const s=buildSanta(vip),m=buildMaiden(vip); s.group.position.set(-.95,0,0);s.group.rotation.y=.28;s.group.scale.setScalar(.92); m.group.position.set(1.15,0,.2);m.group.rotation.y=-.32;m.group.scale.setScalar(.84); heroes.push(s,m);}
  else{const s=buildSanta(vip); s.group.position.set(.2,0,0);s.group.scale.setScalar(1.22); heroes.push(s);}
  heroes.forEach(h=>scene.add(h.group));
  // подарки и мешок
  const g1=gift(.5,.4,.45,0xd01f31); g1.position.set(-2,0,1.3); g1.rotation.y=.4; const g2=gift(.4,.5,.4,0x2a6fc0); g2.position.set(2.05,0,1.1); g2.rotation.y=-.5; scene.add(g1,g2);
  // передний план: еловые лапы, шишки, шары
  const front=new THREE.Group(); scene.add(front);
  const mk=(x,y,z,rz,ry,len)=>{const b=firBranch(len);b.position.set(x,y,z);b.rotation.set(0,ry,rz);front.add(b);return b;};
  mk(-2.0,.1,3.3,.3,0,1.1); mk(2.0,.1,3.3,.3,Math.PI,1.1); mk(-2.0,3.55,3.2,-.4,0,1.0); mk(2.0,3.55,3.2,-.4,Math.PI,1.0);
  const hang=[]; [[-1.55,3.15,3.25,0xd01f31],[1.5,3.1,3.25,0xf2c14e],[-1.1,3.3,3.25,0x2a6fc0]].forEach(([x,y,z,c])=>{const o=ornament(.1,c);o.position.set(x,y,z);front.add(o);hang.push(o);});
  const cones=[[-1.75,.55,3.5,.45],[1.7,.55,3.5,.45],[-1.3,3.1,3.4,.32],[1.2,3.1,3.4,.32]].map(([x,y,z,s])=>{const c=pineCone(s*1.4);c.position.set(x,y,z);c.rotation.z=(Math.random()-.5)*.4;front.add(c);return c;});
  // снег
  const N=700, pos=new Float32Array(N*3); for(let i=0;i<N;i++){pos[i*3]=(Math.random()-.5)*14;pos[i*3+1]=Math.random()*7;pos[i*3+2]=(Math.random()-.5)*10;}
  const pg=new THREE.BufferGeometry();pg.setAttribute('position',new THREE.BufferAttribute(pos,3));
  scene.add(new THREE.Points(pg,new THREE.PointsMaterial({map:dotTex(),size:.1,transparent:true,depthWrite:false,opacity:.9})));
  // управление
  const ptr={x:0,y:0,tx:0,ty:0}; const onMove=e=>{const r=el.getBoundingClientRect();ptr.tx=Math.max(-1,Math.min(1,((e.clientX-r.left)/r.width-.5)*2));ptr.ty=Math.max(-1,Math.min(1,((e.clientY-r.top)/r.height-.5)*2));};
  const onLeave=()=>{ptr.tx=0;ptr.ty=0;};
  addEventListener('pointermove',onMove,{passive:true}); el.addEventListener('pointerleave',onLeave);
  const ro=new ResizeObserver(()=>{const w=el.clientWidth,h=el.clientHeight;if(!w||!h)return;renderer.setSize(w,h);cam.aspect=w/h;cam.updateProjectionMatrix();});ro.observe(el);
  let vis=true; const io=new IntersectionObserver(es=>{vis=es[0].isIntersecting;}); io.observe(el);
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  let raf=0,dead=false,blinkAt=2,clock=new THREE.Clock(); const look=new THREE.Vector3(0,1.5,0);
  const lerp=(a,b,t)=>a+(b-a)*t;
  function frame(){
    if(dead)return; raf=requestAnimationFrame(frame); if(!vis||document.hidden)return;
    const t=reduce?0:clock.getElapsedTime(); ptr.x=lerp(ptr.x,ptr.tx,.06); ptr.y=lerp(ptr.y,ptr.ty,.06);
    cam.position.set(camBase.x+ptr.x*1.1,camBase.y-ptr.y*.35,camBase.z); cam.lookAt(look);
    front.position.x=-ptr.x*.08;
    heroes.forEach((h,i)=>{const ph=i*1.7;
      h.body.scale.set(1+Math.sin(t*1.7+ph)*.008,1+Math.sin(t*1.7+ph)*.014,1+Math.sin(t*1.7+ph)*.008);
      h.group.position.y=Math.sin(t*1.7+ph)*.012;
      h.head.rotation.y=lerp(h.head.rotation.y,ptr.x*.55-h.group.rotation.y*.4,.08); h.head.rotation.x=lerp(h.head.rotation.x,ptr.y*.25,.08);
      h.head.rotation.z=Math.sin(t*.9+ph)*.04;
      const wv=h.type==='santa'?h.armR:h.armL, sign=h.type==='santa'?1:-1;
      wv.sh.rotation.z=sign*(2.25+Math.sin(t*2.2+ph)*.08); wv.sh.rotation.x=0; wv.el.rotation.z=sign*(Math.sin(t*4.4+ph)*.55);
      if(h.type==='maiden'){h.armR.sh.rotation.z=-.2+Math.sin(t*1.7)*.02;}
      else {h.armL.sh.rotation.z=-.22+Math.sin(t*1.7)*.02;}
      const bl=(t>blinkAt&&t<blinkAt+.14)?.08:1; h.eyes.scale.y=bl; if(t>blinkAt+.2)blinkAt=t+2.5+Math.random()*3;
      if(h.orb)h.orb.material.emissiveIntensity=1.1+Math.sin(t*3)*.4;
    });
    trees.forEach((tr,i)=>tr.userData.lights.forEach((m,k)=>{m.emissiveIntensity=.7+.7*Math.abs(Math.sin(t*1.8+i+k*1.3));}));
    hang.forEach((o,i)=>{o.rotation.z=Math.sin(t*1.4+i)*.08;});
    cones.forEach((c,i)=>{c.rotation.x=Math.sin(t*1.1+i)*.05;});
    const p=pg.attributes.position; for(let i=0;i<N;i++){let y=p.getY(i)-.012-(i%5)*.002; let x=p.getX(i)+Math.sin(t*.8+i)*.0025; if(y<0)y=7; p.setXYZ(i,x,y,p.getZ(i));} p.needsUpdate=true;
    renderer.render(scene,cam);
  }
  frame();
  return {dispose(){dead=true;cancelAnimationFrame(raf);removeEventListener('pointermove',onMove);ro.disconnect();io.disconnect();
    scene.traverse(o=>{if(o.geometry)o.geometry.dispose();});pm.dispose();renderer.dispose();cv.remove();}};
}
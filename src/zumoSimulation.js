// Illustrative geometry and accelerated time; not an emulator or measured robot data.
export const ARENA_RADIUS=3;
export const presets={three:[[-1.15,.3],[1.05,-.4],[.2,1.2]],domino:[[-.8,-1.2],[0,-1.2],[.8,-1.2],[-.8,1.2],[0,1.2],[.8,1.2]],edge:[[0,-2.72],[-1.1,.4],[1.1,.3]]};
export const newZumo=()=>({phase:'ready',x:0,z:0,angle:0,t:0,total:0,trial:0,counts:[],count:0,ir:false,white:[false,false],running:false,cooldown:0,turn:1,scan:0,led:false,perimeterDirection:1});
// The disk encloses every chassis/track corner at every yaw (actual half extents .56 x .50).
export const BODY_RADIUS=.76,OBJECT_RADIUS=.18,CLEARANCE=.025;
const separation=BODY_RADIUS+OBJECT_RADIUS+CLEARANCE;
export function segmentDistance(x,z,tx,tz,ox,oz){const dx=tx-x,dz=tz-z,t=Math.max(0,Math.min(1,((ox-x)*dx+(oz-z)*dz)/(dx*dx+dz*dz||1)));return Math.hypot(x+t*dx-ox,z+t*dz-oz);}
export function clearTravel(s,x,z,objects){return objects.every(([ox,oz])=>segmentDistance(s.x,s.z,x,z,ox,oz)>=separation-1e-9);}
export function placementReason(objects,index,x,z,robot){if(!Number.isFinite(x)||!Number.isFinite(z)||Math.hypot(x,z)>2.72+.0001)return 'Keep the cylinder inside the arena.';if(objects.some(([ox,oz],i)=>i!==index&&Math.hypot(ox-x,oz-z)<2*OBJECT_RADIUS+.04))return 'Leave space between the cylinders.';if([robot,{x:0,z:0}].some(p=>Math.hypot(p.x-x,p.z-z)<separation))return 'Leave room for the robot and its tracks.';return '';}
const wrap=a=>Math.atan2(Math.sin(a),Math.cos(a));
export function sense(s,objects){const f=[Math.sin(s.angle),-Math.cos(s.angle)],side=[Math.cos(s.angle),Math.sin(s.angle)];s.white=[-1,1].map(sign=>Math.hypot(s.x+f[0]*.36+side[0]*sign*.23,s.z+f[1]*.36+side[1]*sign*.23)>ARENA_RADIUS-.12);let nearest=Infinity;s.hit=null;objects.forEach(([x,z],i)=>{const dx=x-s.x,dz=z-s.z,along=dx*f[0]+dz*f[1],cross=Math.abs(dx*f[1]-dz*f[0]);if(along>.35&&along<4.8&&cross<.19&&along<nearest){nearest=along;s.hit=i;}});s.ir=s.hit!==null;return s;}
export function stepZumo(s,delta,objects){if(!s.running)return s;const dt=Math.min(delta,.025);s.t+=dt;s.total+=dt;s.cooldown=Math.max(0,s.cooldown-dt);sense(s,objects);s.led=s.phase==='calibrate'||s.ir;
 const change=phase=>{s.phase=phase;s.t=0;};
 const avoid=()=>{s.avoidances=(s.avoidances||0)+1;if(!s.avoidOrigin){s.avoidOrigin=[s.x,s.z];s.avoidArc=0;}if(s.phase!=='avoid')s.avoidStart=s.angle;change('avoid');};
 const travel=(speed)=>{let x=s.x+Math.sin(s.angle)*dt*speed,z=s.z-Math.cos(s.angle)*dt*speed;const r=Math.hypot(x,z);if(r>2.66){x*=2.66/r;z*=2.66/r;}if(clearTravel(s,x,z,objects)){s.x=x;s.z=z;if(s.avoidOrigin&&Math.hypot(x-s.avoidOrigin[0],z-s.avoidOrigin[1])>.65){s.avoidOrigin=null;s.avoidArc=0;}}else avoid();};
 if(s.phase==='ready'){change('calibrate');}
 else if(s.phase==='calibrate'&&s.t>1.2)change('approach');
 else if(s.phase==='approach'){
  if(s.white.some(Boolean)){s.turn=s.white[0]?1:-1;s.origin=s.angle;s.scan=0;s.count=0;change('scan');}
  else if(s.ir){avoid();}
  else{travel(.9);}
  if(s.t>16){s.origin=s.angle;s.turn=1;s.scan=0;s.count=0;change('scan');}
 }else if(s.phase==='avoid'){
  // Original approach turns left until IR clears. The exhibit also guards the full footprint.
  s.angle+=dt*1.7;s.avoidArc=(s.avoidArc||0)+dt*1.7;sense(s,objects);
  const x=s.x+Math.sin(s.angle)*.5,z=s.z-Math.cos(s.angle)*.5;
  if(s.t>.35&&!s.ir&&clearTravel(s,x,z,objects))change('approach');
  else if(s.avoidOrigin&&s.avoidArc>Math.PI*2+.15){change('obstructed');s.running=false;}
 }else if(s.phase==='scan'){
  s.angle+=s.turn*dt*1.4;s.scan+=dt*1.4;sense(s,objects);
  if(s.ir&&s.cooldown===0){s.count++;s.cooldown=.2;}
  if((s.scan>1&&s.white[s.turn===1?1:0])||s.scan>Math.PI*2-.2){s.counts.push(s.count);s.trial++;change('return');}
 }else if(s.phase==='return'){
  const d=wrap(s.origin-s.angle);if(Math.abs(d)>.04)s.angle+=Math.sign(d)*Math.min(Math.abs(d),dt*2);else{s.perimeterStart=Math.atan2(s.z,s.x);s.perimeterDelta=s.perimeterDirection*Math.PI*2/10;s.perimeterT=0;s.perimeterHeading=s.perimeterStart+(s.perimeterDelta>0?Math.PI:0);change('perimeter-align');}
 }else if(s.phase==='perimeter-align'){
  const d=wrap(s.perimeterHeading-s.angle);if(Math.abs(d)>.04)s.angle+=Math.sign(d)*Math.min(Math.abs(d),dt*2);else{s.angle=s.perimeterHeading;change('perimeter');}
 }else if(s.phase==='perimeter'){
  const nextT=Math.min(1,s.perimeterT+dt/.4),theta=s.perimeterStart+s.perimeterDelta*nextT,r=Math.hypot(s.x,s.z),x=r*Math.cos(theta),z=r*Math.sin(theta),heading=theta+(s.perimeterDelta>0?Math.PI:0);
  if(!clearTravel(s,x,z,objects)){change('obstructed');s.running=false;}
  else{s.x=x;s.z=z;s.perimeterT=nextT;s.angle=heading;if(nextT===1){s.outwardHeading=Math.atan2(s.x,-s.z);change('perimeter-face');}}
 }else if(s.phase==='perimeter-face'){
  const d=wrap(s.outwardHeading-s.angle);if(Math.abs(d)>.04)s.angle+=Math.sign(d)*Math.min(Math.abs(d),dt*2);else{s.angle=s.outwardHeading;if(s.trial>=10){change('done');s.running=false;}else change('approach');}
 }
 // Physical dynamics are omitted; preserve a safe illustrated footprint.
 sense(s,objects);s.bodyClearance=Math.min(...objects.map(([x,z])=>Math.hypot(s.x-x,s.z-z)-BODY_RADIUS-OBJECT_RADIUS));
 return s;
}
export function advanceZumo(s,dt,objects){for(let remaining=Math.min(dt,1);remaining>1e-8;remaining-=.025)stepZumo(s,Math.min(.025,remaining),objects);return s;}

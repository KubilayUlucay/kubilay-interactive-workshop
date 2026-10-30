import { Euler, Quaternion } from 'three';
export const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
export const threshold=.01/.9;
export function createGimbal(){return {kind:'gimbal',age:0,user:false,base:[0,0,0],target:[0,0,0],servo:[0,0,0],disturbance:null,stabilized:true,inspect:false,explode:0,paused:false,moving:true,revision:0};}
export function createBMS(){return {kind:'bms',age:0,user:false,cells:[.68,.68,.68,.68],cap:0,pair:-1,donor:-1,receiver:-1,phase:'idle',phaseTime:0,flowPhase:0,load:0,current:0,temperature:25,fault:false,balancing:true,inspect:false,explode:0,paused:false,moving:true,revision:0,demo:false};}
export function refund(s){if(s.cap&&s.donor>=0)s.cells[s.donor]+=s.cap;s.cap=0;s.pair=-1;s.donor=-1;s.receiver=-1;s.phase='idle';s.phaseTime=0;}
let previousImbalance='';
export function imbalance(s){refund(s);let next,key;for(let attempt=0;attempt<32;attempt++){const spread=.12+Math.random()*.08,noise=(Math.random()-.5)*.05,values=[.68+spread,.68-spread,.68+noise,.68-noise];for(let i=values.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[values[i],values[j]]=[values[j],values[i]];}next=values.map(v=>clamp(v));key=next.map(v=>v.toFixed(3)).join(',');if(key!==previousImbalance)break;}previousImbalance=key;s.cells=next;s.user=true;s.demo=true;s.revision++;}
export const wrapAngle=v=>Math.atan2(Math.sin(v),Math.cos(v));
export function disturb(s,reduced=false){const seed=Math.random()*6.28;s.disturbance=reduced?null:{time:0,seed,origin:[...s.base]};s.target=reduced?[.2*Math.sin(seed),.2*Math.cos(seed),.2*Math.sin(seed+1)]:[...s.base];}
export function setCell(s,index,volts){refund(s);s.cells[index]=clamp((volts-3.3)/.9);s.user=true;s.demo=true;}
const euler=new Euler(0,0,0,'YXZ'),quat=new Quaternion();
export function advanceExhibit(s,delta,reduced=false){
 if(s.paused){s.moving=false;return false;}
 const dt=clamp(delta,0,.05);s.age=reduced?Math.max(s.age,5):s.age+dt;if(s.user&&s.age<1.1)s.age=1.1;
 const goal=s.inspect?1:0;s.explode=reduced?goal:s.explode+(goal-s.explode)*(1-Math.exp(-8*dt));if(Math.abs(s.explode-goal)<.001)s.explode=goal;
 if(s.kind==='gimbal'){
  if(!reduced&&!s.user&&s.age>1.2&&s.age<4.8){const p=(s.age-1.2)/3.6*Math.PI;s.target=[.27*Math.sin(p),.19*Math.sin(p),.22*Math.sin(p)];}
  if(!s.user&&s.age>=4.8)s.target=[0,0,0];
  if(s.disturbance){const d=s.disturbance;d.time+=dt;const envelope=Math.sin(Math.PI*Math.min(1,d.time/4));s.target=d.origin.map((v,i)=>v+envelope*.32*Math.sin(d.seed+d.time*(2+i*.7)+i));if(d.time>=4){s.target=[...d.origin];s.disturbance=null;}}
  if(reduced)s.base=[...s.target];else{const current=new Quaternion().setFromEuler(new Euler(...s.base,'YXZ')),target=new Quaternion().setFromEuler(new Euler(...s.target,'YXZ'));if(current.angleTo(target)<.0003)s.base=[...s.target];else{current.slerp(target,1-Math.exp(-9*dt));const pose=new Euler().setFromQuaternion(current,'YXZ');s.base=[pose.x,pose.y,pose.z];}}
  if(s.stabilized){euler.set(...s.base,'YXZ');quat.setFromEuler(euler).invert();euler.setFromQuaternion(quat,'YXZ');s.servo=[euler.x,euler.y,euler.z];}else s.servo=[0,0,0];
  s.moving=(s.age<1.1||(!s.user&&s.age<5))||Boolean(s.disturbance)||s.base.some((v,i)=>v!==s.target[i])||s.explode!==goal;
 }else{
  if(!reduced&&!s.user&&!s.demo&&s.age>1.2){imbalance(s);s.user=false;s.demo=true;}
  s.fault=s.temperature>55;s.current=s.fault||Math.min(...s.cells)<=0?0:s.load;
  if(s.fault||!s.balancing)refund(s);
  if(s.current){const draw=Math.min(.003*s.current*dt,Math.min(...s.cells));s.cells=s.cells.map(v=>v-draw);}
  if(!s.fault&&s.balancing){
   if(s.pair<0){const gaps=s.cells.slice(0,3).map((v,i)=>Math.abs(v-s.cells[i+1])),m=Math.max(...gaps);if(m>threshold){s.pair=gaps.indexOf(m);s.donor=s.cells[s.pair]>s.cells[s.pair+1]?s.pair:s.pair+1;s.receiver=s.donor===s.pair?s.pair+1:s.pair;s.phase='collect';s.phaseTime=0;}}
   if(s.pair>=0){
    s.phaseTime+=dt;
    if(s.phase==='collect'){
     const amount=Math.min(.04*dt,Math.max(0,(s.cells[s.donor]-s.cells[s.receiver]-s.cap)/2));s.cells[s.donor]-=amount;s.cap+=amount;
     if(s.phaseTime>=.45){s.phase='deliver';s.phaseTime=0;}
    }else{const amount=Math.min(s.cap,.08*dt);s.cells[s.receiver]+=amount;s.cap-=amount;if(s.cap<1e-10){s.cap=0;s.phaseTime=0;if(Math.abs(s.cells[s.pair]-s.cells[s.pair+1])<=threshold)refund(s);else s.phase='collect';}}
   }
  }
  if(!reduced&&(s.current||s.pair>=0))s.flowPhase=(s.flowPhase+dt*.7)%1;
  s.moving=(s.age<1.1||(!s.user&&s.age<5))||s.current>0||s.pair>=0||s.explode!==goal;
 }
 return s.moving;
}

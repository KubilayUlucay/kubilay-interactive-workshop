// Exhibit feedback only. No measured voltage, torque, or RPM is represented.
export const createSimulation = () => ({held:false,dragging:false,dragImpulse:0,lastDrag:-1000,power:0,speed:0,crankAngle:-.72,motorAngle:0,explode:0,inspect:false});
const damp=(a,b,lambda,dt)=>b+(a-b)*Math.exp(-lambda*dt);
export function advanceSimulation(s,delta,{inspection,reduced,now}){
 const dt=Math.max(0,Math.min(delta,.05));
 const dragging=now-s.lastDrag<160;
 const target=inspection?0:s.held?6:dragging?s.dragImpulse:0;
 s.speed=damp(s.speed,target,target?9:2,dt);
 s.power=damp(s.power,Math.min(1,s.speed/5.8),3,dt);
 if(s.speed<.0005)s.speed=0;if(s.power<.0005)s.power=0;
 // Less motion preserves power feedback without continuous mechanical spinning.
 if(!reduced&&(s.held||!s.dragging))s.crankAngle+=s.speed*dt;
 if(!inspection&&!reduced)s.motorAngle+=s.power*dt*9;
 s.explode=reduced?Number(inspection):damp(s.explode,Number(inspection),3.6,dt);
 if(Math.abs(s.explode-Number(inspection))<.0005)s.explode=Number(inspection);
 return s.held||dragging||s.speed>0||s.power>0||s.explode!==Number(inspection);
}

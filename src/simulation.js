// Exhibit feedback only. No measured voltage, torque, or RPM is represented.
export const createSimulation = () => ({powered:false,command:.55,power:0,speed:0,motorAngle:0,effectPhase:0,explode:0,inspect:false});
const damp=(a,b,lambda,dt)=>b+(a-b)*Math.exp(-lambda*dt);
export function advanceSimulation(s,delta,{inspection,reduced}){
 const dt=Math.max(0,Math.min(delta,.05));
 const command=Number.isFinite(s.command)?Math.max(0,Math.min(1,s.command)):0;
 const target=inspection||!s.powered?0:command*9;
 s.speed=damp(s.speed,target,target?9:2,dt);
 s.power=damp(s.power,s.speed/9,3,dt);
 if(s.speed<.0005)s.speed=0;if(s.power<.0005)s.power=0;
 if(Math.abs(s.speed-target)<.0005)s.speed=target;
 if(Math.abs(s.power-command)<.0005&&target)s.power=command;
 if(!inspection&&!reduced)s.motorAngle+=s.speed*dt;
 if(!inspection&&!reduced&&s.power>.0005)s.effectPhase=(s.effectPhase+dt*(.30+s.power*.80))%1;
 s.explode=reduced?Number(inspection):damp(s.explode,Number(inspection),3.6,dt);
 if(Math.abs(s.explode-Number(inspection))<.0005)s.explode=Number(inspection);
 return (!reduced&&s.speed>0)||s.speed!==target||Math.abs(s.power-s.speed/9)>.0005||s.explode!==Number(inspection);
}

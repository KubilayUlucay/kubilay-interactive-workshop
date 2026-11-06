import assert from 'node:assert/strict';
import { createSimulation, advanceSimulation } from '../src/simulation.js';

function step(state,inspection=false,reduced=false,count=400){
 for(let frame=0;frame<count;frame++)advanceSimulation(state,.05,{inspection,reduced});
 return state;
}

const off=step(createSimulation());
assert.equal(off.power,0);assert.equal(off.speed,0);assert.equal(off.motorAngle,0);

const active=step({...createSimulation(),powered:true});
assert.equal(active.power,.55);assert.ok(active.motorAngle>0);
assert.ok(active.effectPhase>=0&&active.effectPhase<1);
active.command=.25;step(active);assert.equal(active.power,.25);
active.powered=false;step(active);assert.equal(active.power,0);assert.equal(active.speed,0);

const inspected={...createSimulation(),powered:true,motorAngle:1,effectPhase:.4};
step(inspected,true);assert.equal(inspected.explode,1);assert.equal(inspected.power,0);
assert.equal(inspected.motorAngle,1);assert.equal(inspected.effectPhase,.4);
step(inspected,false);assert.equal(inspected.explode,0);assert.ok(inspected.motorAngle>1);

const reduced=step({...createSimulation(),powered:true,command:.75},false,true);
assert.equal(reduced.power,.75);assert.equal(reduced.motorAngle,0);assert.equal(reduced.effectPhase,0);
assert.equal(advanceSimulation(reduced,.05,{inspection:false,reduced:true}),false);
step(reduced,true,true,1);assert.equal(reduced.explode,1);
step(reduced,false,true,1);assert.equal(reduced.explode,0);

for(const [command,power]of [[2,1],[-1,0],[NaN,0]]){
 assert.equal(step({...createSimulation(),powered:true,command}).power,power);
}
const delayed={...createSimulation(),powered:true},regular={...delayed};
advanceSimulation(delayed,100,{inspection:false,reduced:false});
advanceSimulation(regular,.05,{inspection:false,reduced:false});
assert.deepEqual(delayed,regular);
assert.deepEqual(createSimulation(),{powered:false,command:.55,power:0,speed:0,motorAngle:0,effectPhase:0,explode:0,inspect:false});
console.log('PASS: power off, command tracking, shutdown, bounded phase, inspection/reassembly, static reduced-motion feedback, command limits, delayed-frame clamp and reset defaults.');

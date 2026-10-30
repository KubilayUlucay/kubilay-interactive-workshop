import assert from 'node:assert/strict';
import { Euler, Quaternion } from 'three';
import { createGimbal, createBMS, advanceExhibit, imbalance, threshold } from '../src/exhibitSimulation.js';
let seed=104729;
const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/2**32;};
const sum=s=>s.cells.reduce((a,b)=>a+b,0)+s.cap;
for(let n=0;n<300;n++){
 const s=createGimbal();s.user=true;s.target=Array.from({length:3},()=>.8*(random()-.5));advanceExhibit(s,.05,true);
 const q=new Quaternion().setFromEuler(new Euler(...s.base,'YXZ')).multiply(new Quaternion().setFromEuler(new Euler(...s.servo,'YXZ')));
 assert(q.angleTo(new Quaternion())<1e-7);
 s.stabilized=false;advanceExhibit(s,.05,true);assert.deepEqual(s.servo,[0,0,0]);
}
for(let n=0;n<40;n++){
 const s=createBMS();s.user=true;s.cells=Array.from({length:4},()=>.2+.6*random());const initial=sum(s);
 for(let k=0;k<14000;k++){advanceExhibit(s,.05,true);assert(Math.abs(sum(s)-initial)<1e-9);assert(s.cells.every(v=>v>=0&&v<=1));}
 assert(Math.max(...s.cells.slice(0,3).map((v,i)=>Math.abs(v-s.cells[i+1])))<=threshold+1e-8);
}
for(const mode of ['temperature','off']){
 const s=createBMS();imbalance(s);for(let k=0;k<5;k++)advanceExhibit(s,.05,true);assert(s.cap>0);const initial=sum(s);
 if(mode==='temperature'){s.temperature=60;s.load=1;}else s.balancing=false;
 advanceExhibit(s,.05,true);assert(s.cap===0&&s.pair===-1);assert(Math.abs(sum(s)-initial)<1e-10);
 if(mode==='temperature'){assert(s.fault&&s.current===0);s.temperature=25;advanceExhibit(s,.05,true);assert(!s.fault&&s.current===1);}
}
const load=createBMS();load.user=true;load.load=.74;const before=[...load.cells];for(let k=0;k<100;k++)advanceExhibit(load,.05,true);assert(load.current===.74&&load.cells.every((v,i)=>v<before[i]));assert.equal(load.flowPhase,0);
const a=createBMS(),b=createBMS();a.user=b.user=true;a.load=b.load=1;advanceExhibit(a,100);advanceExhibit(b,.05);assert.deepEqual(a,b);
const paused=createGimbal();paused.paused=true;paused.target=[.2,.3,.1];advanceExhibit(paused,.05);assert.deepEqual(paused.base,[0,0,0]);assert.equal(paused.age,0);
console.log('PASS: 300 compound gimbal poses; 40 randomized 14k-step BMS conservation/bounds/convergence runs; fault/off refund, reconnect, load, reduced phase, dt clamp and pause.');

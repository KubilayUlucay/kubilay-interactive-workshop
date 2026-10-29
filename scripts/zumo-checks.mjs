import assert from 'node:assert/strict';
import{advanceZumo,newZumo,presets,sense}from'../src/zumoSimulation.js';
for(const points of Object.values(presets)){const s=newZumo();s.running=true;let frames=0;while(s.running&&frames++<15000){advanceZumo(s,.025,points);assert(Math.hypot(s.x,s.z)<=2.660001);assert(s.counts.length<=10);assert(s.counts.every(Number.isInteger));}assert.equal(s.phase,'done');assert.equal(s.trial,10);assert.equal(s.counts.length,10);const snapshot=JSON.stringify(s);advanceZumo(s,.5,points);assert.equal(JSON.stringify(s),snapshot);}
const clear=newZumo();sense(clear,[]);assert.equal(clear.ir,false);sense(clear,[[0,-1]]);assert.equal(clear.ir,true);sense(clear,[[1,-1]]);assert.equal(clear.ir,false);clear.z=-2.6;sense(clear,[]);assert(clear.white.some(Boolean));
const empty=newZumo();empty.running=true;for(let i=0;i<15000&&empty.running;i++)advanceZumo(empty,.025,[]);assert(empty.counts.every(v=>v===0));
const pause=newZumo();assert.equal(JSON.stringify(advanceZumo(pause,1,presets.three)),JSON.stringify(newZumo()));
console.log('PASS Zumo: ten trials, safe footprint, counts, IR direction, boundary, empty arena, paused/done determinism');

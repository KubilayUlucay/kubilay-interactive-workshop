import { useMemo, useRef, useEffect, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer, RoundedBox, OrbitControls, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { advanceSimulation } from './simulation';
import { plateGeometry, windingGeometry, statorGeometry } from './motorGeometry';

const TAU = Math.PI * 2;
const colors = { graphite: '#464b49', steel: '#bdc7c3', copper: '#bd7241', rubber: '#1b201e', teal: '#658c81' };
function ringGeometry(outer, inner, depth, bevel = .015) {
  const s = new THREE.Shape(); s.absarc(0, 0, outer, 0, TAU, false);
  if (inner) { const h = new THREE.Path(); h.absarc(0, 0, inner, 0, TAU, true); s.holes.push(h); }
  const g = new THREE.ExtrudeGeometry(s, { depth, bevelEnabled: !!bevel, bevelSegments: 3, steps: 1, bevelSize: bevel, bevelThickness: bevel, curveSegments: 72 });
  g.translate(0,0,-depth/2); return g;
}
function brushedTexture() {
  const n=128, data=new Uint8Array(n*n*4); let seed=73;
  for(let y=0;y<n;y++) for(let x=0;x<n;x++){ seed=(seed*16807)%2147483647; const v=235+Math.round((seed/2147483647-.5)*12+Math.sin(y*2.17)*9); const i=(y*n+x)*4;data[i]=data[i+1]=data[i+2]=v;data[i+3]=255; }
  const t=new THREE.DataTexture(data,n,n,THREE.RGBAFormat);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(3,3);t.needsUpdate=true; return t;
}
function useMaterials() {
  const materials=useMemo(()=>{
    const texture=brushedTexture();
    return {
      graphite:new THREE.MeshStandardMaterial({color:colors.graphite,metalness:.65,roughness:.48,roughnessMap:texture}),
      steel:new THREE.MeshStandardMaterial({color:colors.steel,metalness:.92,roughness:.29,roughnessMap:texture}),
      copper:new THREE.MeshPhysicalMaterial({color:colors.copper,metalness:.95,roughness:.3,clearcoat:.16,clearcoatRoughness:.28}),
      rubber:new THREE.MeshStandardMaterial({color:colors.rubber,roughness:.84,metalness:.03}),
      teal:new THREE.MeshStandardMaterial({color:colors.teal,roughness:.54,metalness:.1}),
      dark:new THREE.MeshStandardMaterial({color:'#29312d',metalness:.3,roughness:.62}),
      redWire:new THREE.MeshStandardMaterial({color:'#ae5947',metalness:.02,roughness:.74}),
      platform:new THREE.MeshStandardMaterial({color:'#2c3230',metalness:.22,roughness:.68}),
      magnet:new THREE.MeshStandardMaterial({color:'#4c6081',metalness:.70,roughness:.32}),
    };
  },[]);
  useEffect(()=>()=>{const textures=new Set();Object.values(materials).forEach(m=>{if(m.roughnessMap)textures.add(m.roughnessMap);m.dispose();});textures.forEach(t=>t.dispose());},[materials]);
  return materials;
}
function Ring({outer,inner,depth=.08,position=[0,0,0],material,bevel=.015,...props}) {
  const geometry=useMemo(()=>ringGeometry(outer,inner,depth,bevel),[outer,inner,depth,bevel]);
  useEffect(()=>()=>geometry.dispose(),[geometry]);
  return <mesh geometry={geometry} material={material} position={position} castShadow receiveShadow {...props}/>;
}
function Bolt({position,material,scale=1}) {
  return <group position={position} scale={scale}>
    <mesh rotation={[Math.PI/2,0,0]} material={material} castShadow><cylinderGeometry args={[.042,.042,.03,6]}/></mesh>
    <mesh position={[0,0,.017]}><boxGeometry args={[.043,.008,.002]}/><meshStandardMaterial color="#111816" roughness={.7}/></mesh>
  </group>;
}
function RadialBolts({z=0,r=1.43,material,n=12}) {
  return Array.from({length:n},(_,i)=>{const a=i/n*TAU;return <Bolt key={i} position={[Math.cos(a)*r,Math.sin(a)*r,z]} material={material}/>;});
}
function Plate({geometry,material,...props}){return <mesh geometry={geometry} material={material} castShadow receiveShadow {...props}/>;}
function Rotor({materials:m,front=true,geometry}){
 const face=front?-1:1;
 return <>
  <Plate geometry={geometry} material={m.graphite}/>
  <Ring outer={1.43} inner={1.37} depth={.015} material={m.steel} position={[0,0,face*.053]}/>
  <Ring outer={1.33} inner={.31} depth={.018} material={m.dark} position={[0,0,face*.058]}/>
  {Array.from({length:12},(_,i)=><group rotation={[0,0,i/12*TAU]} key={i}>
   <RoundedBox args={[.25,.54,.065]} radius={.012} smoothness={2} position={[0,.94,face*.106]} material={i%2?m.magnet:m.steel} castShadow/>
   <Bolt position={[0,.47,face*.086]} material={m.steel} scale={.65}/>
  </group>)}
 </>;
}
function BearingCarrier({materials:m,geometry,front=true}){
 const face=front?1:-1;
 return <>
  <Plate geometry={geometry} material={m.steel}/>
  <Ring outer={.34} inner={.22} depth={.11} material={m.graphite} position={[0,0,face*.048]}/>
  <Ring outer={.27} inner={.16} depth={.075} material={m.steel} position={[0,0,face*.10]}/>
  <Ring outer={.215} inner={.165} depth={.02} material={m.rubber} position={[0,0,face*.147]}/>
  <RadialBolts r={.40} n={4} z={face*.066} material={m.graphite}/>
 </>;
}
function Motor({sim,inspection,part,onPart,materials:m}){
 const front=useRef(),rear=useRef(),rotor=useRef(),hub=useRef(),backRotor=useRef(),highlight=useRef();
 const geometry=useMemo(()=>({coil:windingGeometry(),plate:plateGeometry(),carrier:plateGeometry({radius:.46,ears:.10,lobes:4,bore:.24,depth:.075}),stator:statorGeometry()}),[]);
 useEffect(()=>()=>Object.values(geometry).forEach(g=>g.dispose()),[geometry]);
 const accent=useMemo(()=>Object.fromEntries(Object.entries(m).map(([key,material])=>{const copy=material.clone();copy.emissive.set('#d7a16d');copy.emissiveIntensity=key==='teal'?.09:.20;return[key,copy];})),[m]);
 useEffect(()=>()=>Object.values(accent).forEach(material=>material.dispose()),[accent]);
 const chosen=id=>inspection&&part===id?accent:m;
 const housing=chosen('housing'),shaft=chosen('shaft'),winding=chosen('stator');
 useFrame(()=>{
  const e=sim.current.explode;
  front.current.position.z=.62+e*1.94;
  rear.current.position.z=-.62-e*1.65;
  rotor.current.position.z=.31+e*1.07;
  backRotor.current.position.z=-.31-e*1.07;
  hub.current.position.z=.89+e*2.30;
  rotor.current.rotation.z=backRotor.current.rotation.z=hub.current.rotation.z=sim.current.motorAngle;
  highlight.current.visible=inspection&&e>.45;
  const locations={stator:[.15,1.52],rotor:[.38+e*1.07,1.57],housing:[.79+e*1.94,.59],shaft:[1.19+e*2.30,.30]};
  const [z,r]=locations[part]||locations.stator;
  highlight.current.position.z=z;highlight.current.scale.set(r,r,1);
 });
 const click=id=>ev=>{if(inspection){ev.stopPropagation();onPart(id);}};
 return <group name="motor" position={[.85,1.86,0]} rotation={[0,-.30,0]}>
  <group name="housing-rear" ref={rear} onClick={click('housing')}><BearingCarrier materials={housing} geometry={geometry.carrier} front={false}/></group>
  <group name="rotor-rear" ref={backRotor} onClick={click('rotor')}><Rotor materials={chosen('rotor')} geometry={geometry.plate} front={false}/></group>
  <group name="stator" onClick={click('stator')}>
   <Plate geometry={geometry.stator} material={winding.teal}/>
   <Ring outer={1.48} inner={1.44} depth={.075} material={m.steel}/>
   {Array.from({length:9},(_,i)=><group rotation={[0,0,i/9*TAU]} key={i}>
    <mesh geometry={geometry.coil} material={winding.copper} position={[0,.96,.043]} castShadow/>
    <Bolt position={[0,1.39,.048]} material={m.steel} scale={.65}/>
   </group>)}
  </group>
  <group name="rotor-front" ref={rotor} onClick={click('rotor')}><Rotor materials={chosen('rotor')} geometry={geometry.plate}/></group>
  <group name="housing-front" ref={front} onClick={click('housing')}><BearingCarrier materials={housing} geometry={geometry.carrier}/></group>
  <group name="shaft" ref={hub} onClick={click('shaft')}>
   <Ring outer={.16} inner={0} depth={.46} material={shaft.steel}/>
   <Ring outer={.22} inner={.08} depth={.08} material={shaft.steel} position={[0,0,.23]}/>
   <RadialBolts n={4} r={.16} z={.279} material={shaft.graphite}/>
  </group>
  <group ref={highlight} visible={false}><mesh renderOrder={5} raycast={()=>null}><ringGeometry args={[.987,1.012,96]}/><meshBasicMaterial color="#edbd8e" transparent opacity={.9} depthTest={false} depthWrite={false} side={THREE.DoubleSide} toneMapped={false}/></mesh></group>
  <RoundedBox args={[1.40,.18,1.30]} radius={.06} smoothness={3} position={[0,-1.53,0]} material={m.graphite} castShadow receiveShadow/>
  {[-.68,.68].map((x,i)=><RoundedBox key={i} args={[.14,.65,.60]} radius={.04} smoothness={3} position={[x,-1.24,-.08]} rotation={[0,0,x>0?-.27:.27]} material={m.graphite} castShadow/>)}
 </group>;
}
function Cable({points,material,radius=.025,name='surface-cable'}){
 const geometry=useMemo(()=>new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p))),60,radius,8,false),[points,radius]);
 useEffect(()=>()=>geometry.dispose(),[geometry]);
 return <mesh name={name} geometry={geometry} material={material} castShadow/>;
}
const supplyPositive=[[-2.59,.63,.18],[-2.44,.47,.45],[-2.23,.38,.72],[-2.19,.42,.92]];
const supplyNegative=[[-2.11,.63,.18],[-1.93,.48,.36],[-2.10,.38,.69],[-2.19,.42,1.08]];
const phaseLead=[[-.81,.42,1.0],[-.25,.36,1.02],[.34,.38,.90],[.64,.60,.45],[.65,.82,.19]];
const potentiometerTravel=Math.PI*1.5;
function PowerSupply({sim,materials,onPower,disabled}){
 const indicator=useRef(),rocker=useRef();const {gl,invalidate}=useThree();
 useEffect(()=>()=>{gl.domElement.style.cursor='auto';},[gl]);
 useFrame(()=>{indicator.current.material.emissiveIntensity=sim.current.powered?1.1:.05;rocker.current.rotation.x=sim.current.powered?-.16:.16;});
 return <group name="dc-power-supply" position={[-2.35,.92,-.42]} onClick={event=>{if(disabled)return;event.stopPropagation();onPower();invalidate();}} onPointerOver={()=>{gl.domElement.style.cursor=disabled?'auto':'pointer';}} onPointerOut={()=>{gl.domElement.style.cursor='auto';}}>
  <RoundedBox args={[1.4,1.18,1.1]} radius={.08} smoothness={3} material={materials.graphite} castShadow/>
  <RoundedBox args={[1.27,1.04,.04]} radius={.025} position={[0,0,.568]} material={materials.dark}/>
  <RoundedBox args={[.74,.26,.015]} radius={.025} position={[-.13,.22,.599]} material={materials.rubber}/>
  <mesh ref={indicator} position={[-.35,.22,.61]}><planeGeometry args={[.24,.035]}/><meshStandardMaterial color="#afc5ac" emissive="#8eb49d" emissiveIntensity={.05}/></mesh>
  <Ring outer={.14} inner={0} depth={.10} position={[.38,.19,.64]} material={materials.steel}/>
  <Ring outer={.095} inner={0} depth={.12} position={[.38,.19,.71]} material={materials.rubber}/>
  {[-.24,.24].map((horizontal,index)=><group key={horizontal} position={[horizontal,-.28,.61]}>
   <Ring outer={.08} inner={0} depth={.10} material={materials.rubber}/>
  <mesh position={[0,0,.064]} rotation={[Math.PI/2,0,0]}><cylinderGeometry args={[.043,.043,.04,20]}/><meshStandardMaterial color={index?'#383f3c':'#a45743'}/></mesh>
  </group>)}
  <group name="supply-power-switch" position={[.49,-.22,.61]}>
   <RoundedBox args={[.18,.28,.055]} radius={.018} material={materials.rubber}/>
   <group name="supply-power-rocker" ref={rocker} position={[0,0,.046]}>
    <RoundedBox args={[.13,.22,.04]} radius={.012} material={materials.graphite}/>
    <RoundedBox args={[.012,.055,.004]} radius={.002} position={[0,.055,.024]} material={materials.steel}/>
    <mesh position={[0,-.051,.025]}><ringGeometry args={[.024,.031,24]}/><meshBasicMaterial color="#bdc7c3"/></mesh>
   </group>
   <mesh position={[0,0,.05]}><sphereGeometry args={[.15,16,12]}/><meshBasicMaterial transparent opacity={0} depthWrite={false}/></mesh>
  </group>
  {Array.from({length:5},(_,index)=><RoundedBox key={index} args={[.70,.025,.008]} radius={.005} position={[-.1,-.02-index*.06,-.558]} material={materials.rubber}/>)}
 </group>;
}
function ArduinoNanoBoard({name,position=[0,0,0],materials}){
 return <group name={name} position={position}>
  <RoundedBox args={[.31,.045,.84]} radius={.012} castShadow><meshStandardMaterial color="#35598a" roughness={.7} metalness={.12}/></RoundedBox>
  <RoundedBox name="nano-microcontroller" args={[.145,.035,.145]} radius={.005} position={[0,.039,-.09]} rotation={[0,Math.PI/4,0]} material={materials.rubber}/>
  <RoundedBox args={[.105,.026,.105]} radius={.004} position={[0,.034,.19]} rotation={[0,Math.PI/4,0]} material={materials.rubber}/>
  <RoundedBox name="nano-reset-button" args={[.10,.035,.075]} radius={.006} position={[0,.043,.06]} material={materials.steel}/>
  <RoundedBox args={[.06,.009,.035]} radius={.003} position={[0,.064,.06]} material={materials.teal}/>
  <RoundedBox name="nano-mini-usb" args={[.18,.10,.16]} radius={.01} position={[0,.056,-.41]} material={materials.steel}/>
  <RoundedBox args={[.12,.046,.007]} radius={.004} position={[0,.056,-.493]} material={materials.rubber}/>
  {[-.135,.135].map(horizontal=>Array.from({length:15},(_,index)=><mesh key={horizontal+':'+index} position={[horizontal,.035,-.35+index*.05]} material={materials.steel}><boxGeometry args={[.018,.10,.018]}/></mesh>))}
  <RoundedBox args={[.055,.015,.035]} radius={.004} position={[-.06,.031,.29]} material={materials.copper}/>
  <RoundedBox args={[.055,.015,.035]} radius={.004} position={[.06,.031,.29]} material={materials.teal}/>
 </group>;
}
function WirelessModule({name,position,materials}){
 const antenna=[[-.105,-.23],[.105,-.23],[.105,-.195],[-.075,-.195],[-.075,-.16],[.075,-.16],[.075,-.125],[-.075,-.125],[-.075,-.09],[.025,-.09],[.025,-.045]];
 return <group name={name} position={position} userData={{component:'NRF24L01'}}>
  <RoundedBox name="nrf24l01-pcb" args={[.27,.035,.52]} radius={.007} castShadow><meshStandardMaterial color="#18211d" roughness={.72} metalness={.1}/></RoundedBox>
  <RoundedBox name="nrf24l01-transceiver" args={[.10,.026,.10]} radius={.003} position={[.025,.032,.04]} material={materials.rubber}/>
  <RoundedBox name="nrf24l01-crystal" args={[.055,.024,.075]} radius={.006} position={[-.075,.032,.025]} material={materials.steel}/>
  <group name="nrf24l01-pcb-antenna">{antenna.slice(0,-1).map((point,index)=>{
   const next=antenna[index+1];
   return <mesh key={index} position={[(point[0]+next[0])/2,.022,(point[1]+next[1])/2]} material={materials.copper}><boxGeometry args={[Math.max(.009,Math.abs(next[0]-point[0])),.006,Math.max(.009,Math.abs(next[1]-point[1]))]}/></mesh>;
  })}</group>
  <RoundedBox name="nrf24l01-header" args={[.245,.055,.105]} radius={.003} position={[0,.043,.19]} material={materials.rubber}/>
  <group name="nrf24l01-pins">{[-.03,.03].flatMap(depth=>Array.from({length:4},(_,index)=><mesh key={depth+':'+index} position={[-.09+index*.06,.088,.19+depth]} material={materials.steel}><boxGeometry args={[.014,.06,.014]}/></mesh>))}</group>
  {[-.055,.075].map(horizontal=><RoundedBox key={horizontal} args={[.025,.012,.035]} radius={.002} position={[horizontal,.025,.115]} material={materials.steel}/>)}
 </group>;
}
function WirelessController({sim,materials,onCommand,disabled,resetKey}){
 const base=useRef(),knob=useRef(),last=useRef(null),capture=useRef(null);
 const {gl,invalidate,size}=useThree();
 const plane=useMemo(()=>new THREE.Plane(),[]),centre=useMemo(()=>new THREE.Vector3(),[]),point=useMemo(()=>new THREE.Vector3(),[]);
 const normal=useMemo(()=>new THREE.Vector3(0,1,0),[]);
 const release=useCallback(()=>{
  last.current=null;gl.domElement.style.cursor='auto';
  if(capture.current){const saved=capture.current;capture.current=null;try{saved.target.releasePointerCapture(saved.id);}catch{last.current=null;}}
 },[gl]);
 useEffect(()=>{if(disabled)release();},[disabled,release]);
 useEffect(()=>{release();},[resetKey,release]);
 useEffect(()=>{const canvas=gl.domElement;const hidden=()=>{if(document.hidden)release();};window.addEventListener('pointerup',release);window.addEventListener('pointercancel',release);window.addEventListener('blur',release);canvas.addEventListener('lostpointercapture',release);document.addEventListener('visibilitychange',hidden);return()=>{release();window.removeEventListener('pointerup',release);window.removeEventListener('pointercancel',release);window.removeEventListener('blur',release);canvas.removeEventListener('lostpointercapture',release);document.removeEventListener('visibilitychange',hidden);};},[gl,release]);
 useFrame(()=>{knob.current.rotation.y=-potentiometerTravel/2+sim.current.command*potentiometerTravel;});
 function angle(event){
  base.current.updateWorldMatrix(true,false);
  base.current.localToWorld(centre.set(0,.065,0));normal.set(0,1,0).transformDirection(base.current.matrixWorld);plane.setFromNormalAndCoplanarPoint(normal,centre);
  if(!event.ray.intersectPlane(plane,point))return null;
  base.current.worldToLocal(point);
  return Math.atan2(point.x,-point.z);
 }
 function begin(event){if(disabled)return;const initial=angle(event);if(initial===null)return;event.stopPropagation();last.current=initial;capture.current={target:event.target,id:event.pointerId};event.target.setPointerCapture(event.pointerId);gl.domElement.style.cursor='grabbing';invalidate();}
 function turn(event){if(disabled||last.current===null||capture.current?.id!==event.pointerId)return;const next=angle(event);if(next===null)return;event.stopPropagation();let delta=next-last.current;if(delta>Math.PI)delta-=TAU;if(delta< -Math.PI)delta+=TAU;onCommand(sim.current.command*100-delta*100/potentiometerTravel);last.current=next;invalidate();}
 return <group name="wireless-controller" position={[size.width<=700?-.7:-1.7,size.width<=700?.55:.28,3.1]} rotation={[.72,0,-.43]} scale={.9}>
  <RoundedBox args={[1.6,.08,1.1]} radius={.025} smoothness={2} castShadow><meshStandardMaterial color="#b9783d" roughness={.7} metalness={.15}/></RoundedBox>
  {Array.from({length:9},(_,row)=>Array.from({length:12},(_,column)=><mesh key={row+':'+column} position={[-.69+column*.123,.042,-.45+row*.11]} rotation={[-Math.PI/2,0,0]}><circleGeometry args={[.019,8]}/><meshBasicMaterial color="#503d29"/></mesh>))}
  <ArduinoNanoBoard name="transmitter-arduino-nano" position={[.38,.10,0]} materials={materials}/>
  <WirelessModule name="transmitter-radio" position={[-.03,.13,-.30]} materials={materials}/>
  <group name="controller-potentiometer" ref={base} position={[-.39,.15,.06]} onPointerDown={begin} onPointerMove={turn} onPointerUp={event=>{event.stopPropagation();release();}} onPointerCancel={release} onPointerOver={()=>{gl.domElement.style.cursor=disabled?'auto':'grab';}} onPointerOut={()=>{if(!capture.current)gl.domElement.style.cursor='auto';}}>
   <mesh position={[0,-.075,0]} material={materials.steel}><cylinderGeometry args={[.14,.14,.10,24]}/></mesh>
  <group name="potentiometer-knob" ref={knob}><mesh material={materials.rubber}><cylinderGeometry args={[.24,.24,.12,40]}/></mesh><RoundedBox args={[.035,.008,.18]} radius={.005} position={[0,.065,-.085]} material={materials.copper}/></group>
  <mesh position={[0,.02,0]}><sphereGeometry args={[.7,20,16]}/><meshBasicMaterial transparent opacity={0} depthWrite={false}/></mesh>
  </group>
  <Cable name="controller-potentiometer-signal" points={[[-.39,.08,.17],[-.19,.09,.28],[.06,.09,.20],[.18,.12,.19]]} material={materials.teal} radius={.01}/>
 </group>;
}
function MotorReceiver({materials}){
 return <group name="motor-receiver" position={[-.67,.34,.16]}>
  <RoundedBox args={[.99,.07,1.0]} radius={.025} position={[-.10,0,0]} material={materials.teal} castShadow/>
  <ArduinoNanoBoard name="receiver-arduino-nano" position={[0,.10,0]} materials={materials}/>
  <WirelessModule name="receiver-radio" position={[-.36,.15,.20]} materials={materials}/>
 </group>;
}
function ESC({materials}){
 const sticker=useMemo(()=>{
  const canvas=document.createElement('canvas');canvas.width=256;canvas.height=128;const context=canvas.getContext('2d');
  context.fillStyle='#222b27';context.fillRect(0,0,256,128);context.fillStyle='#dbb48a';context.fillRect(12,10,232,4);
  context.font='600 20px "DM Sans",sans-serif';context.fillText('BRUSHLESS',16,42);context.font='700 64px "DM Sans",sans-serif';context.fillText('ESC',14,104);
  const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;return texture;
 },[]);
 useEffect(()=>()=>sticker.dispose(),[sticker]);
 return <group name="motor-esc" position={[-1.50,.42,1.0]}>
  <RoundedBox name="esc-heatshrink-sleeve" args={[1.18,.15,.52]} radius={.055} smoothness={3} material={materials.rubber} castShadow/>
  <RoundedBox args={[.32,.035,.40]} radius={.017} position={[-.37,.07,0]} material={materials.rubber}/>
  <RoundedBox name="esc-battery-strain-relief" args={[.18,.075,.32]} radius={.03} position={[-.62,-.012,0]} material={materials.rubber}/>
  <RoundedBox name="esc-phase-strain-relief" args={[.18,.075,.34]} radius={.03} position={[.62,-.012,0]} material={materials.rubber}/>
  <mesh name="esc-label" position={[.045,.078,0]} rotation={[-Math.PI/2,0,0]}><planeGeometry args={[.61,.33]}/><meshStandardMaterial map={sticker} roughness={.88} metalness={0}/></mesh>
  {[-1,0,1].map(offset=><mesh key={offset} position={[.72,0,offset*.08]} rotation={[0,0,Math.PI/2]} material={materials.steel}><cylinderGeometry args={[.024,.024,.08,16]}/></mesh>)}
 </group>;
}
const studioEnvironment=<Environment resolution={256}>
   <Lightformer form="rect" intensity={4.5} color="#fff3e5" position={[-4,5,4]} rotation={[0,0,-Math.PI/4]} scale={[7,5,1]}/>
   <Lightformer form="rect" intensity={2.3} color="#d6e4ec" position={[4,2,-3]} rotation={[0,Math.PI/2,0]} scale={[2,6,1]}/>
   <Lightformer form="rect" intensity={1.3} position={[0,6,-2]} rotation={[Math.PI/2,0,0]} scale={[7,.6,1]}/>
   <Lightformer form="rect" intensity={2.5} position={[1,2,7]} scale={[7,5,1]}/>
   <Lightformer form="rect" intensity={1.2} position={[0,-3,4]} scale={[6,2,1]}/>
  </Environment>;
function Scene({sim,inspection,part,onPart,orbit,reduced,onTelemetry,onCommand,onPower,resetKey,powered,command,suspended}){
 const m=useMaterials(),rig=useRef(),controls=useRef();const {camera,size,invalidate,gl}=useThree();
 const counter=useRef(0),shadowPose=useRef([]);const mobile=size.width<=700;
 const desired=useMemo(()=>new THREE.Vector3(),[]);
 useEffect(()=>{if(controls.current){controls.current.target.set(-.35,1.45,.1);controls.current.update();}invalidate();},[resetKey,invalidate]);
 useEffect(()=>{invalidate();},[inspection,part,orbit,reduced,resetKey,powered,command,suspended,size.width,size.height,invalidate]);
 useFrame((state,delta)=>{
  const s=sim.current,dt=Math.min(delta,.05);
  if(suspended)return;
  const moving=advanceSimulation(s,delta,{inspection,reduced,now:performance.now()});
  rig.current.position.x=!mobile&&size.width<1100?.95:0;
  const pose=[s.explode,s.motorAngle,rig.current.position.x];
  if(pose.some((value,i)=>value!==shadowPose.current[i]))gl.shadowMap.needsUpdate=true;
  shadowPose.current=pose;
  if(moving)invalidate();
  if(!orbit){
   const e=s.explode;
   // Fit the full platform and separated covers inside the actual canvas aspect.
  const fit=mobile?Math.max(1,1.2/(size.width/size.height)):size.width<1100?1.11:1.04;
    const framing=!mobile&&!inspection?.66:1;
   desired.set(mobile?5.5:6.6,mobile?3.65:4.7,mobile?10.0:10.3);
    desired.multiplyScalar(fit*framing*(1+e*(mobile?.13:.20)));
   if(reduced)camera.position.copy(desired);else camera.position.lerp(desired,1-Math.exp(-3*dt));
   if(camera.position.distanceTo(desired)>.001)invalidate();
  const aimY=mobile?1.45:!inspection?(size.width<1100?.78:.9):Math.max(.25,1.1-Math.max(0,(895-size.height)/895)*3.0);
   camera.lookAt(-.35,aimY,.1);
  }
  counter.current+=dt;
  if(counter.current>.12||!moving){counter.current=0;onTelemetry({power:Math.round(s.power*100),running:s.power>.08});}
 }, -2);
 return <>
  {/* Transparent sky and a bottom fade let the floor meet the page continuously. */}
  <fog attach="fog" args={['#141518',16,36]}/>
  <ambientLight intensity={.4}/>
  <hemisphereLight args={['#e4e9e6','#4c514e',.8]}/>
  <spotLight position={[-4,7,5]} intensity={100} angle={.72} penumbra={1} color="#fff2df" castShadow shadow-mapSize={[1024,1024]} shadow-radius={4} shadow-bias={-.0002}/>
  <spotLight position={[4,4,-4]} intensity={70} angle={.7} penumbra={1} color="#ccdfed"/>
  {studioEnvironment}
  <group name="exhibit" ref={rig}>
   <RoundedBox args={[7.1,.22,3.30]} radius={.11} smoothness={4} position={[-.35,.12,0]} material={m.dark} castShadow receiveShadow/>
   <RoundedBox args={[7.02,.055,3.23]} radius={.02} smoothness={3} position={[-.35,.25,0]} material={m.platform} receiveShadow/>
   <Motor sim={sim} inspection={inspection} part={part} onPart={onPart} materials={m}/>
    <PowerSupply sim={sim} materials={m} onPower={onPower} disabled={inspection||orbit||suspended}/>
    <WirelessController sim={sim} materials={m} onCommand={onCommand} disabled={inspection||orbit||suspended} resetKey={resetKey}/>
    <MotorReceiver materials={m}/>
    <ESC materials={m}/>
    <Cable name="supply-to-esc-positive" points={supplyPositive} material={m.redWire} radius={.024}/>
    <Cable name="supply-to-esc-negative" points={supplyNegative} material={m.rubber} radius={.025}/>
    <Cable name="receiver-to-esc-signal" points={[[-.45,.45,.41],[-.90,.36,.40],[-1.65,.35,.52],[-2.17,.42,.85]]} material={m.teal} radius={.012}/>
    {[-1,0,1].map((offset,index)=><Cable name={'esc-to-motor-phase-'+index} key={offset} points={phaseLead.map(([horizontal,vertical,depth])=>[horizontal,vertical+.008*index,depth+offset*.08])} material={m.rubber} radius={.021}/>)}
  </group>
  <ContactShadows position={[0,-.014,0]} opacity={.64} scale={13} blur={2.3} far={5} resolution={mobile?256:512} frames={Infinity}/>
  <OrbitControls ref={controls} enabled={orbit&&!suspended} target={[-.35,1.45,.1]} enablePan={false} minDistance={mobile?11:7} maxDistance={22} minPolarAngle={.35} maxPolarAngle={Math.PI/2-.04} enableDamping={!reduced} dampingFactor={.08}/>
 </>;
}
export default function MotorScene(props){
 return <Canvas frameloop="demand" shadows dpr={[1,1.6]} camera={{position:[6.6,4.7,10.3],fov:35,near:.1,far:80}} gl={{alpha:true,antialias:true,powerPreference:'high-performance',toneMapping:THREE.ACESFilmicToneMapping,toneMappingExposure:1.1}} onCreated={({gl,camera})=>{camera.layers.enable(1);gl.setClearColor('#141518',0);gl.shadowMap.type=THREE.PCFShadowMap;gl.shadowMap.autoUpdate=false;gl.shadowMap.needsUpdate=true;}}><Scene {...props}/></Canvas>;
}

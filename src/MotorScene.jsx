import { useMemo, useRef, useEffect, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer, RoundedBox, OrbitControls, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { advanceSimulation } from './simulation';
import EnergyEffects from './EnergyEffects';
import EnergyLamp from './EnergyLamp';
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
function Cable({points,material,radius=.025}){
 const geometry=useMemo(()=>new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p))),60,radius,8,false),[points,radius]);
 useEffect(()=>()=>geometry.dispose(),[geometry]);
 return <mesh name="surface-cable" geometry={geometry} material={material} castShadow/>;
}
// All interpolated tubes and their widest glow remain above the beveled slab.
const cableA=[[-2.22,.72,.70],[-1.78,.42,1.02],[-1.17,.38,1.10],[-.48,.41,.92],[.12,.52,.55],[.58,.74,.20]];
const lampCableA=[[.58,.74,.20],[1.12,.39,.82],[1.70,.36,1.14],[2.14,.36,1.20],[2.40,.38,1.02]];
const lampCableB=lampCableA.map(([x,y,z])=>[x,y+.018,z+.055]);
const cableB=cableA.map(([x,y,z])=>[x,y+.018,z+.075]);
function Crank({sim,materials:m,onDrag,inspection,resetKey}){
 const handle=useRef(),root=useRef();const {camera,gl,invalidate}=useThree();const last=useRef(null),capture=useRef(null);
 const cancel=useCallback(()=>{last.current=null;sim.current.dragging=false;sim.current.lastDrag=-1000;onDrag(false);if(capture.current){const captured=capture.current;capture.current=null;try{captured.target.releasePointerCapture(captured.id);}catch{/* Capture may already have been released by the browser. */}}},[sim,onDrag]);
 useEffect(()=>{cancel();},[inspection,resetKey,cancel]);
 useEffect(()=>{const canvas=gl.domElement;const hidden=()=>{if(document.hidden)cancel();};document.addEventListener("visibilitychange",hidden);window.addEventListener("pointercancel",cancel);window.addEventListener("pointerup",cancel);window.addEventListener("blur",cancel);canvas.addEventListener("lostpointercapture",cancel);return()=>{cancel();document.removeEventListener("visibilitychange",hidden);window.removeEventListener("pointercancel",cancel);window.removeEventListener("pointerup",cancel);window.removeEventListener("blur",cancel);canvas.removeEventListener("lostpointercapture",cancel);};},[cancel,gl]);
 useFrame(()=>{handle.current.rotation.z=sim.current.crankAngle;});
 function angle(ev){
  const p=new THREE.Vector3();root.current.getWorldPosition(p);p.project(camera);
  const rect=gl.domElement.getBoundingClientRect();
  return Math.atan2(-(ev.nativeEvent.clientY-rect.top)+(1-p.y)*rect.height/2,(ev.nativeEvent.clientX-rect.left)-(p.x+1)*rect.width/2);
 }
 function down(ev){ev.stopPropagation();if(inspection)return;last.current=angle(ev);sim.current.dragging=true;ev.target.setPointerCapture(ev.pointerId);capture.current={target:ev.target,id:ev.pointerId};onDrag(true);invalidate();}
 function move(ev){if(last.current===null||inspection||ev.pointerId!==capture.current?.id)return;ev.stopPropagation();const a=angle(ev);let d=a-last.current;if(d>Math.PI)d-=TAU;if(d< -Math.PI)d+=TAU;sim.current.crankAngle+=d;sim.current.dragImpulse=Math.min(9,Math.abs(d)*50);sim.current.lastDrag=performance.now();last.current=a;invalidate();}
 function up(ev){ev.stopPropagation();cancel();}
 return <group position={[-2.22,1.0,.50]} rotation={[0,.13,0]}>
  <Ring outer={.53} inner={0} depth={.63} material={m.graphite}/>
  <Ring outer={.55} inner={.44} depth={.09} material={m.steel} position={[0,0,.33]}/>
  <Ring outer={.33} inner={0} depth={.08} material={m.dark} position={[0,0,.38]}/>
  <RadialBolts z={.386} r={.46} n={6} material={m.steel}/>
  <Ring outer={.10} inner={0} depth={.33} material={m.steel} position={[0,0,.43]}/>
  <RoundedBox args={[.79,.12,.75]} radius={.055} smoothness={3} position={[0,-.67,0]} material={m.graphite} castShadow/>
  <RoundedBox args={[.3,.28,.4]} radius={.045} smoothness={3} position={[0,-.48,0]} material={m.graphite} castShadow/>
  <group name="crank-axis" position={[0,0,.61]} ref={root}>
   <group name="crank-handle" ref={handle} rotation={[0,0,-.72]} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} onPointerOver={()=>{gl.domElement.style.cursor=inspection?'default':'grab';}} onPointerOut={()=>{gl.domElement.style.cursor='auto';}}>
    <Ring outer={.16} inner={0} depth={.08} material={m.steel}/>
    <RoundedBox args={[.14,.68,.10]} radius={.04} smoothness={4} position={[0,.32,0]} material={m.steel} castShadow/>
    <Ring outer={.12} inner={0} depth={.37} position={[0,.62,.15]} material={m.rubber} bevel={.05}/>
    <Ring outer={.105} inner={0} depth={.025} position={[0,.62,.37]} material={m.steel}/>
    <mesh position={[0,.62,.2]} visible={false}><sphereGeometry args={[.28,12,12]}/><meshBasicMaterial/></mesh>
   </group>
  </group>
 </group>;
}
const studioEnvironment=<Environment resolution={256}>
   <Lightformer form="rect" intensity={4.5} color="#fff3e5" position={[-4,5,4]} rotation={[0,0,-Math.PI/4]} scale={[7,5,1]}/>
   <Lightformer form="rect" intensity={2.3} color="#d6e4ec" position={[4,2,-3]} rotation={[0,Math.PI/2,0]} scale={[2,6,1]}/>
   <Lightformer form="rect" intensity={1.3} position={[0,6,-2]} rotation={[Math.PI/2,0,0]} scale={[7,.6,1]}/>
   <Lightformer form="rect" intensity={2.5} position={[1,2,7]} scale={[7,5,1]}/>
   <Lightformer form="rect" intensity={1.2} position={[0,-3,4]} scale={[6,2,1]}/>
  </Environment>;
function Scene({sim,inspection,part,onPart,orbit,reduced,onTelemetry,onDrag,resetKey,held,suspended}){
 const m=useMaterials(),rig=useRef(),led=useRef(),controls=useRef();const {camera,size,invalidate,gl}=useThree();
 const counter=useRef(0),shadowPose=useRef([]);const mobile=size.width<=700;
 const desired=useMemo(()=>new THREE.Vector3(),[]);
 useEffect(()=>{if(controls.current){controls.current.target.set(-.35,1.45,.1);controls.current.update();}invalidate();},[resetKey,invalidate]);
 useEffect(()=>{invalidate();},[inspection,part,orbit,reduced,resetKey,held,suspended,size.width,size.height,invalidate]);
 useFrame((state,delta)=>{
  const s=sim.current,dt=Math.min(delta,.05);
  if(suspended)return;
  const moving=advanceSimulation(s,delta,{inspection,reduced,now:performance.now()});
  // Also catches direct pointer-driven crank changes between demand frames.
  const pose=[s.explode,s.crankAngle,s.motorAngle];
  if(pose.some((value,i)=>value!==shadowPose.current[i]))gl.shadowMap.needsUpdate=true;
  shadowPose.current=pose;
  if(moving)invalidate();
  led.current.material.emissiveIntensity=.1+s.power*3;
  if(!orbit){
   const e=s.explode;
   // Fit the full platform and separated covers inside the actual canvas aspect.
   const fit=mobile?Math.max(1,1.2/(size.width/size.height)):1.04;
   desired.set(mobile?5.5:6.6,mobile?3.65:4.7,mobile?10.0:10.3);
   desired.multiplyScalar(fit*(1+e*(mobile?.13:.20)));
   if(reduced)camera.position.copy(desired);else camera.position.lerp(desired,1-Math.exp(-3*dt));
   if(camera.position.distanceTo(desired)>.001)invalidate();
   const aimY=mobile?1.45:Math.max(.25,1.1-Math.max(0,(895-size.height)/895)*3.0);
   camera.lookAt(-.35,aimY,.1);
  }
  counter.current+=dt;
  if(counter.current>.12||!moving){counter.current=0;onTelemetry({power:Math.round(s.power*100),running:s.power>.08});}
 }, -2);
 return <>
  {/* Transparent sky and a bottom fade let the floor meet the page continuously. */}
  <fog attach="fog" args={['#171918',16,36]}/>
  <ambientLight intensity={.4}/>
  <hemisphereLight args={['#e4e9e6','#4c514e',.8]}/>
  <spotLight position={[-4,7,5]} intensity={100} angle={.72} penumbra={1} color="#fff2df" castShadow shadow-mapSize={[1024,1024]} shadow-radius={4} shadow-bias={-.0002}/>
  <spotLight position={[4,4,-4]} intensity={70} angle={.7} penumbra={1} color="#ccdfed"/>
  {studioEnvironment}
  <group name="exhibit" ref={rig}>
   <RoundedBox args={[7.1,.22,3.30]} radius={.11} smoothness={4} position={[-.35,.12,0]} material={m.dark} castShadow receiveShadow/>
   <RoundedBox args={[7.02,.055,3.23]} radius={.02} smoothness={3} position={[-.35,.25,0]} material={m.platform} receiveShadow/>
   <Motor sim={sim} inspection={inspection} part={part} onPart={onPart} materials={m}/>
    <Crank sim={sim} materials={m} onDrag={onDrag} inspection={inspection||orbit||suspended} resetKey={resetKey}/>
   <Cable points={cableA} material={m.rubber}/><Cable points={cableB} material={m.copper} radius={.015}/>
   <Cable points={lampCableA} material={m.rubber} radius={.020}/><Cable points={lampCableB} material={m.copper} radius={.015}/>
   <EnergyLamp sim={sim} inspection={inspection} suspended={suspended} materials={m}/>
   <EnergyEffects sim={sim} points={cableA} inspection={inspection} reduced={reduced} suspended={suspended}/>
   <mesh ref={led} position={[-1.11,.293,1.27]} rotation={[-Math.PI/2,0,0]}><circleGeometry args={[.04,24]}/><meshStandardMaterial color="#afdbb0" emissive="#adcc96" emissiveIntensity={.1}/></mesh>
   <RoundedBox args={[1.08,.018,.16]} radius={.012} smoothness={2} position={[-.34,.296,1.30]} material={m.dark}/>
   {Array.from({length:12},(_,i)=><EnergyBar key={i} index={i} sim={sim}/>)}
  </group>
  <mesh rotation={[-Math.PI/2,0,0]} position={[0,-.025,0]} receiveShadow><planeGeometry args={[100,100]}/><meshStandardMaterial color="#1b1e1c" roughness={.6} metalness={.18}/></mesh>
  <ContactShadows position={[0,-.014,0]} opacity={.64} scale={13} blur={2.3} far={5} resolution={mobile?256:512} frames={Infinity}/>
  <OrbitControls ref={controls} enabled={orbit&&!suspended} target={[-.35,1.45,.1]} enablePan={false} minDistance={mobile?11:7} maxDistance={22} minPolarAngle={.35} maxPolarAngle={Math.PI/2-.04} enableDamping={!reduced} dampingFactor={.08}/>
 </>;
}
function EnergyBar({index,sim}){
 const ref=useRef();useFrame(()=>{const active=sim.current.power>(index+1)/13;ref.current.material.emissiveIntensity=active?2:.02;ref.current.material.color.set(active?'#dca471':'#34403a');});
 return <mesh ref={ref} position={[-.80+index*.08,.307,1.30]} rotation={[-Math.PI/2,0,0]}><planeGeometry args={[.045,.085]}/><meshStandardMaterial color="#34403a" emissive="#da985d" emissiveIntensity={.02}/></mesh>;
}
export default function MotorScene(props){
 return <Canvas frameloop="demand" shadows dpr={[1,1.6]} camera={{position:[6.6,4.7,10.3],fov:35,near:.1,far:80}} gl={{alpha:true,antialias:true,powerPreference:'high-performance',toneMapping:THREE.ACESFilmicToneMapping,toneMappingExposure:1.1}} onCreated={({gl,camera})=>{camera.layers.enable(1);gl.setClearColor('#171918',0);gl.shadowMap.type=THREE.PCFShadowMap;gl.shadowMap.autoUpdate=false;gl.shadowMap.needsUpdate=true;}}><Scene {...props}/></Canvas>;
}

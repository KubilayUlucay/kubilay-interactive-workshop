import { useMemo, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer, RoundedBox, OrbitControls, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { advanceSimulation } from './simulation';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

const TAU = Math.PI * 2;
const colors = { graphite: '#303735', steel: '#abb4b1', copper: '#c07846', rubber: '#151a18', teal: '#658c81' };
function ringGeometry(outer, inner, depth, bevel = .015) {
  const s = new THREE.Shape(); s.absarc(0, 0, outer, 0, TAU, false);
  if (inner) { const h = new THREE.Path(); h.absarc(0, 0, inner, 0, TAU, true); s.holes.push(h); }
  const g = new THREE.ExtrudeGeometry(s, { depth, bevelEnabled: !!bevel, bevelSegments: 3, steps: 1, bevelSize: bevel, bevelThickness: bevel, curveSegments: 72 });
  g.translate(0,0,-depth/2); return g;
}
function coilGeometry() {
  const shapes=[];
  for(let i=0;i<14;i++) {
    const w=.19+i*.009, h=.225+i*.009, r=.09+i*.004;
    const pts=[];
    const corners=[[w-r,h-r,0],[-w+r,h-r,Math.PI/2],[-w+r,-h+r,Math.PI],[w-r,-h+r,Math.PI*1.5]];
    for(const [cx,cy,start] of corners) for(let j=0;j<=14;j++){const a=start+j/14*Math.PI/2; pts.push(new THREE.Vector3(cx+Math.cos(a)*r,cy+Math.sin(a)*r,Math.sin(i*.22)*.008));}
    pts.push(pts[0].clone());
    const path=new THREE.CatmullRomCurve3(pts,true,'centripetal');
    shapes.push(new THREE.TubeGeometry(path,64,.0084,5,true));
  }
  const geo=mergeGeometries(shapes); shapes.forEach(g=>g.dispose()); return geo;
}
function brushedTexture() {
  const n=128, data=new Uint8Array(n*n*4); let seed=73;
  for(let y=0;y<n;y++) for(let x=0;x<n;x++){ seed=(seed*16807)%2147483647; const v=175+Math.round((seed/2147483647-.5)*25+Math.sin(y*2.17)*16); const i=(y*n+x)*4;data[i]=data[i+1]=data[i+2]=v;data[i+3]=255; }
  const t=new THREE.DataTexture(data,n,n,THREE.RGBAFormat);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(3,3);t.needsUpdate=true; return t;
}
function useMaterials() {
  return useMemo(()=>{
    const texture=brushedTexture();
    return {
      graphite:new THREE.MeshStandardMaterial({color:colors.graphite,metalness:.78,roughness:.32,roughnessMap:texture}),
      steel:new THREE.MeshStandardMaterial({color:colors.steel,metalness:.98,roughness:.23,roughnessMap:texture}),
      copper:new THREE.MeshPhysicalMaterial({color:colors.copper,metalness:1,roughness:.23,clearcoat:.28,clearcoatRoughness:.18}),
      rubber:new THREE.MeshStandardMaterial({color:colors.rubber,roughness:.84,metalness:.03}),
      teal:new THREE.MeshStandardMaterial({color:colors.teal,roughness:.54,metalness:.1}),
      dark:new THREE.MeshStandardMaterial({color:'#141b19',metalness:.74,roughness:.33}),
      magnet:new THREE.MeshStandardMaterial({color:'#6e7776',metalness:.91,roughness:.25}),
    };
  },[]);
}
function Ring({outer,inner,depth=.08,position=[0,0,0],material,bevel=.015,...props}) {
  const geometry=useMemo(()=>ringGeometry(outer,inner,depth,bevel),[outer,inner,depth,bevel]);
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
function Rotor({materials:m,front=true,rotationRef}) {
  return <group ref={rotationRef}>
    <Ring outer={1.38} inner={1.22} depth={.085} material={m.graphite}/>
    <Ring outer={.45} inner={.14} depth={.10} material={m.steel}/>
    {Array.from({length:9},(_,i)=>{const a=i/9*TAU;return <group rotation={[0,0,a]} key={i}>
      <mesh position={[0,.84,0]} material={m.graphite} castShadow><boxGeometry args={[.065,.92,.06]}/></mesh>
      <mesh position={[0,1.19,front?-.045:.045]} material={i%2?m.magnet:m.steel} castShadow><boxGeometry args={[.29,.21,.06]}/></mesh>
      <Bolt position={[0,.36,.058]} material={m.graphite} scale={.75}/>
    </group>;})}
  </group>;
}
function Motor({sim,inspection,part,onPart,materials:m}) {
  const front=useRef(),rear=useRef(),stator=useRef(),rotor=useRef(),hub=useRef(),backRotor=useRef(),highlight=useRef();
  const coil=useMemo(coilGeometry,[]);
  useFrame((_,dt)=>{
    const e=sim.current.explode;
    front.current.position.z=.56+e*1.65;
    rear.current.position.z=-.52-e*1.40;
    rotor.current.position.z=.30+e*.88;
    backRotor.current.position.z=-.30-e*.78;
    hub.current.position.z=.71+e*2.02;
    rotor.current.rotation.z=sim.current.motorAngle;
    backRotor.current.rotation.z=sim.current.motorAngle;
    highlight.current.visible=inspection&&e>.45;
    const locations={stator:[.12,1.60],rotor:[.35+e*.88,1.47],housing:[.65+e*1.65,1.67],shaft:[.99+e*2.02,.30]};
    const [z,r]=locations[part]||locations.stator;
    highlight.current.position.z=z;highlight.current.scale.set(r,r,1);
  });
  const click=(id)=>(ev)=>{if(inspection){ev.stopPropagation();onPart(id);}};
  return <group position={[.85,1.86,0]} rotation={[0,-.30,0]}>
    {/* Satin outer rim with machining grooves; the face is windowed for the exhibit. */}
    <group ref={rear} onClick={click('housing')}>
      <Ring outer={1.54} inner={.25} depth={.14} material={m.graphite}/>
      <Ring outer={1.57} inner={1.49} depth={.10} material={m.steel} position={[0,0,.065]}/>
      <RadialBolts z={-.085} material={m.steel}/>
      <Ring outer={.56} inner={.14} depth={.16} material={m.steel} position={[0,0,-.1]}/>
    </group>
    <group ref={backRotor} onClick={click('rotor')}><Rotor materials={m} front={false}/></group>
    <group ref={stator} onClick={click('stator')}>
      <Ring outer={1.50} inner={1.36} depth={.22} material={m.teal}/>
      <Ring outer={.38} inner={.20} depth={.20} material={m.teal}/>
      {Array.from({length:9},(_,i)=>{
        const a=i/9*TAU;
        return <group rotation={[0,0,a]} key={i}>
          <RoundedBox args={[.49,.59,.11]} radius={.055} smoothness={3} position={[0,.87,0]} material={m.teal} castShadow/>
          <mesh geometry={coil} material={m.copper} position={[0,.90,.077]} castShadow/>
          <mesh geometry={coil} material={m.copper} position={[0,.90,-.077]} castShadow/>
          <RoundedBox args={[.065,.67,.019]} radius={.008} smoothness={2} position={[0,.9,.094]} material={m.rubber}/>
          <mesh position={[0,.5,0]} material={m.teal}><boxGeometry args={[.11,.33,.08]}/></mesh>
        </group>;
      })}
      <RadialBolts z={.125} r={1.42} material={m.steel} n={9}/>
    </group>
    <group ref={rotor} onClick={click('rotor')}><Rotor materials={m}/></group>
    <group ref={front} onClick={click('housing')}>
      <Ring outer={1.57} inner={1.37} depth={.135} material={m.graphite}/>
      <Ring outer={1.58} inner={1.555} depth={.025} material={m.steel} position={[0,0,.07]}/>
      <Ring outer={1.47} inner={1.455} depth={.008} material={m.steel} position={[0,0,.083]}/>
      <RadialBolts z={.084} r={1.49} material={m.steel}/>
      {Array.from({length:6},(_,i)=><group rotation={[0,0,i/6*TAU]} key={i}>
        <RoundedBox args={[.11,1.11,.11]} radius={.025} smoothness={3} position={[0,.90,0]} material={m.graphite} castShadow/>
      </group>)}
      <Ring outer={.47} inner={.24} depth={.15} material={m.graphite}/>
      <Ring outer={.27} inner={.13} depth={.09} material={m.steel} position={[0,0,.082]}/>
      <Ring outer={.23} inner={.15} depth={.016} material={m.dark} position={[0,0,.136]}/>
    </group>
    <group ref={hub} onClick={click('shaft')}>
      <Ring outer={.16} inner={0} depth={.46} material={m.steel}/>
      <Ring outer={.20} inner={0} depth={.06} material={m.graphite} position={[0,0,.23]}/>
      <Bolt position={[0,0,.268]} material={m.steel} scale={1.5}/>
    </group>
    <group ref={highlight} visible={false}><mesh><ringGeometry args={[.997,1.002,96]}/><meshBasicMaterial color="#dbad79" transparent opacity={.65} side={THREE.DoubleSide}/></mesh></group>
    {/* Supporting cradle */}
    <RoundedBox args={[1.40,.18,1.30]} radius={.06} smoothness={3} position={[0,-1.53,0]} material={m.graphite} castShadow receiveShadow/>
    {[-.68,.68].map((x,i)=><RoundedBox key={i} args={[.14,.65,.60]} radius={.04} smoothness={3} position={[x,-1.24,-.08]} rotation={[0,0,x>0?-.27:.27]} material={m.graphite} castShadow/>)}
  </group>;
}
function Cable({points,material,radius=.025}){
 const geometry=useMemo(()=>new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p))),60,radius,8,false),[points,radius]);
 return <mesh geometry={geometry} material={material} castShadow/>;
}
const cableA=[[-2.35,.66,.2],[-2,.35,-.25],[-1.45,.24,-.65],[-.45,.25,-.72],[.25,.47,-.48],[.62,.65,-.3]];
const cableB=cableA.map(([x,y,z])=>[x,y+.018,z+.075]);
function Crank({sim,materials:m,onDrag,inspection,resetKey}){
 const handle=useRef(),root=useRef();const {camera,gl,invalidate}=useThree();const last=useRef(null),capture=useRef(null);
 const cancel=()=>{last.current=null;sim.current.dragging=false;sim.current.lastDrag=-1000;onDrag(false);if(capture.current){try{capture.current.target.releasePointerCapture(capture.current.id);}catch{}capture.current=null;}};
 useEffect(()=>{cancel();},[inspection,resetKey]);
 useEffect(()=>{window.addEventListener("pointercancel",cancel);window.addEventListener("pointerup",cancel);window.addEventListener("blur",cancel);gl.domElement.addEventListener("lostpointercapture",cancel);return()=>{cancel();window.removeEventListener("pointercancel",cancel);window.removeEventListener("pointerup",cancel);window.removeEventListener("blur",cancel);gl.domElement.removeEventListener("lostpointercapture",cancel);};},[]);
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
  <group position={[0,0,.61]} ref={root}>
   <group ref={handle} rotation={[0,0,-.72]} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} onPointerOver={()=>{gl.domElement.style.cursor=inspection?'default':'grab';}} onPointerOut={()=>{gl.domElement.style.cursor='auto';}}>
    <Ring outer={.16} inner={0} depth={.08} material={m.steel}/>
    <RoundedBox args={[.14,.68,.10]} radius={.04} smoothness={4} position={[0,.32,0]} material={m.steel} castShadow/>
    <Ring outer={.12} inner={0} depth={.37} position={[0,.62,.15]} material={m.rubber} bevel={.05}/>
    <Ring outer={.105} inner={0} depth={.025} position={[0,.62,.37]} material={m.steel}/>
    <mesh position={[0,.62,.2]} visible={false}><sphereGeometry args={[.28,12,12]}/><meshBasicMaterial/></mesh>
   </group>
  </group>
 </group>;
}
function Scene({sim,inspection,part,onPart,orbit,reduced,onTelemetry,onDrag,resetKey,held}){
 const m=useMaterials(),rig=useRef(),light=useRef(),led=useRef(),controls=useRef();const {camera,size,invalidate,gl}=useThree();
 const counter=useRef(0);const mobile=window.matchMedia("(max-width: 700px)").matches;
 useEffect(()=>{if(controls.current){controls.current.target.set(-.1,1.3,.2);controls.current.update();}invalidate();},[resetKey]);
 useEffect(()=>{invalidate();},[inspection,orbit,reduced,resetKey,held]);
 useFrame((state,delta)=>{
  const s=sim.current,dt=Math.min(delta,.05);
  const previousExplode=s.explode;
  const moving=advanceSimulation(s,delta,{inspection,reduced,now:performance.now()});
  if(previousExplode!==s.explode)gl.shadowMap.needsUpdate=true;
  if(moving)invalidate();
  light.current.intensity=.05+s.power*2.2;
  led.current.material.emissiveIntensity=.1+s.power*3;
  if(!orbit){
   const e=s.explode;
   const desired=new THREE.Vector3(mobile?4.6:5.8, mobile?3.5:4.1, mobile?9.0:9.0);
   desired.multiplyScalar(1+e*(mobile?.07:.18));
   if(reduced)camera.position.copy(desired);else camera.position.lerp(desired,1-Math.exp(-3*dt));
   if(camera.position.distanceTo(desired)>.001)invalidate();
   camera.lookAt(mobile?-.25:-.10,1.33,.15+e*.07);
  }
  counter.current+=dt;
  if(counter.current>.12||!moving){counter.current=0;onTelemetry({power:Math.round(s.power*100),running:s.power>.08});}
 }, -2);
 return <>
  <color attach="background" args={['#171918']}/>
  <fog attach="fog" args={['#171918',16,36]}/>
  <ambientLight intensity={.24}/>
  <spotLight position={[-4,7,5]} intensity={95} angle={.65} penumbra={1} color="#fff2df" castShadow shadow-mapSize={mobile?[1024,1024]:[2048,2048]} shadow-bias={-.0002}/>
  <spotLight position={[4,4,-4]} intensity={70} angle={.7} penumbra={1} color="#ccdfed"/>
  <pointLight ref={light} position={[1,2.0,1.0]} color="#dda06d" intensity={.1} distance={5}/>
  <Environment resolution={256}>
   <Lightformer form="rect" intensity={3.7} color="#fff3e5" position={[-4,5,4]} rotation={[0,0,-Math.PI/4]} scale={[5,4,1]}/>
   <Lightformer form="rect" intensity={2.3} color="#d6e4ec" position={[4,2,-3]} rotation={[0,Math.PI/2,0]} scale={[2,6,1]}/>
   <Lightformer form="rect" intensity={1.3} position={[0,6,-2]} rotation={[Math.PI/2,0,0]} scale={[7,.6,1]}/>
   <Lightformer form="rect" intensity={.6} position={[0,-3,4]} scale={[6,2,1]}/>
  </Environment>
  <group ref={rig}>
   <RoundedBox args={[7.1,.22,3.30]} radius={.11} smoothness={4} position={[-.35,.12,0]} material={m.dark} castShadow receiveShadow/>
   <RoundedBox args={[7.02,.055,3.23]} radius={.08} smoothness={3} position={[-.35,.25,0]} material={m.graphite} receiveShadow/>
   <Motor sim={sim} inspection={inspection} part={part} onPart={onPart} materials={m}/>
   <Crank sim={sim} materials={m} onDrag={onDrag} inspection={inspection||orbit} resetKey={resetKey}/>
   <Cable points={cableA} material={m.rubber}/><Cable points={cableB} material={m.copper} radius={.015}/>
   <mesh ref={led} position={[-1.11,.293,1.27]} rotation={[-Math.PI/2,0,0]}><circleGeometry args={[.04,24]}/><meshStandardMaterial color="#afdbb0" emissive="#adcc96" emissiveIntensity={.1}/></mesh>
   <RoundedBox args={[1.08,.018,.16]} radius={.012} smoothness={2} position={[-.34,.296,1.30]} material={m.dark}/>
   {Array.from({length:12},(_,i)=><EnergyBar key={i} index={i} sim={sim}/>)}
  </group>
  <mesh rotation={[-Math.PI/2,0,0]} position={[0,-.025,0]} receiveShadow><planeGeometry args={[100,100]}/><meshStandardMaterial color="#1b1e1c" roughness={.6} metalness={.18}/></mesh>
  <ContactShadows position={[0,-.014,0]} opacity={.64} scale={13} blur={2.3} far={5} resolution={mobile?256:512} frames={Infinity}/>
  <OrbitControls ref={controls} enabled={orbit} target={[-.1,1.3,.2]} enablePan={false} minDistance={6} maxDistance={16} minPolarAngle={.35} maxPolarAngle={Math.PI/2-.04} enableDamping dampingFactor={.08}/>
 </>;
}
function EnergyBar({index,sim}){
 const ref=useRef();useFrame(()=>{const active=sim.current.power>(index+1)/13;ref.current.material.emissiveIntensity=active?2:.02;ref.current.material.color.set(active?'#dca471':'#34403a');});
 return <mesh ref={ref} position={[-.80+index*.08,.307,1.30]} rotation={[-Math.PI/2,0,0]}><planeGeometry args={[.045,.085]}/><meshStandardMaterial color="#34403a" emissive="#da985d" emissiveIntensity={.02}/></mesh>;
}
export default function MotorScene(props){
 return <Canvas frameloop="demand" shadows dpr={[1,1.6]} camera={{position:[5.8,4.1,9],fov:35,near:.1,far:80}} gl={{antialias:true,powerPreference:'high-performance',toneMapping:THREE.ACESFilmicToneMapping,toneMappingExposure:1.1}} onCreated={({gl})=>{gl.setClearColor('#171918');gl.shadowMap.autoUpdate=false;gl.shadowMap.needsUpdate=true;}}><Scene {...props}/></Canvas>;
}

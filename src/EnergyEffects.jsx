import { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const TAU=Math.PI*2;
const noPick=()=>null;
// Stylized exhibit feedback, not a model of current direction or magnetic flux.
export default function EnergyEffects({sim,points,inspection,reduced,suspended}){
 const root=useRef(),trace=useRef(),haze=useRef(),beads=useRef([]),arcs=useRef([]),rim=useRef();
 const curve=useMemo(()=>new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p))),[points]);
 const geometry=useMemo(()=>({trace:new THREE.TubeGeometry(curve,60,.020,6,false),haze:new THREE.TubeGeometry(curve,60,.049,6,false),bead:new THREE.SphereGeometry(.048,10,8),arc:new THREE.TorusGeometry(1.60,.016,6,64,TAU*.18),rim:new THREE.TorusGeometry(1.50,.026,6,96)}),[curve]);
 useEffect(()=>()=>Object.values(geometry).forEach(g=>g.dispose()),[geometry]);
 useEffect(()=>{root.current.traverse(o=>o.layers.set(1));},[]);
 useFrame(()=>{
  const s=sim.current,p=inspection||suspended?0:s.power;
  root.current.visible=p>.003;
  trace.current.material.opacity=p*.65;haze.current.material.opacity=p*.11;
  rim.current.material.opacity=p*.38;
  beads.current.forEach((mesh,i)=>{
   // Preference changes freeze the existing phase rather than catching up.
   curve.getPointAt((s.effectPhase+i/4)%1,mesh.position);
   mesh.material.opacity=p*(reduced?.65:.92);
  });
  arcs.current.forEach((mesh,i)=>{
   mesh.rotation.z=s.effectPhase*TAU+i/3*TAU;
   mesh.material.opacity=p*(reduced?.55:.85);
  });
 });
 return <group name="electrical-effects" ref={root} visible={false}>
  <mesh name="energy-trace" ref={trace} geometry={geometry.trace} raycast={noPick}><meshBasicMaterial color="#84e9f2" transparent opacity={0} toneMapped={false} depthWrite={false}/></mesh>
  <mesh ref={haze} geometry={geometry.haze} raycast={noPick}><meshBasicMaterial color="#42cddd" transparent opacity={0} toneMapped={false} depthWrite={false}/></mesh>
  {Array.from({length:4},(_,i)=><mesh name={'energy-bead-'+i} key={i} ref={o=>{beads.current[i]=o;}} geometry={geometry.bead} raycast={noPick}><meshBasicMaterial color="#d6ffff" transparent opacity={0} toneMapped={false} depthWrite={false}/></mesh>)}
  <group position={[.85,1.86,0]} rotation={[0,-.30,0]}>
   <mesh ref={rim} geometry={geometry.rim} raycast={noPick}><meshBasicMaterial color="#ffba7e" transparent opacity={0} toneMapped={false} depthWrite={false}/></mesh>
   {Array.from({length:3},(_,i)=><mesh name={'energy-arc-'+i} key={i} ref={o=>{arcs.current[i]=o;}} geometry={geometry.arc} position={[0,0,.39]} raycast={noPick}><meshBasicMaterial color="#8eeafa" transparent opacity={0} toneMapped={false} depthWrite={false}/></mesh>)}
  </group>
 </group>;
}

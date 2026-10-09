import { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

// A visible exhibit load: illustrative feedback, not measured electrical output.
export default function EnergyLamp({sim,inspection,suspended,materials:m}){
 const filament=useRef(),glass=useRef(),glow=useRef(),light=useRef();
 const geometry=useMemo(()=>{
  const points=Array.from({length:65},(_,i)=>{const t=i/64;return new THREE.Vector3((t-.5)*.19,.68+Math.sin(t*Math.PI*12)*.022,Math.cos(t*Math.PI*12)*.022);});
  return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),80,.008,6,false);
 },[]);
 useEffect(()=>()=>geometry.dispose(),[geometry]);
 useEffect(()=>{glow.current.layers.set(1);},[]);
 useFrame(()=>{
  const p=inspection||suspended?0:sim.current.power;
  filament.current.material.emissiveIntensity=p*7;
  glass.current.material.emissiveIntensity=p*.8;
  glow.current.material.opacity=p*.13;
  glow.current.visible=p>.003;
  light.current.intensity=p*9;
 });
 return <group name="energy-lamp" position={[2.40,.28,1.02]}>
  <RoundedBox args={[.58,.08,.56]} radius={.025} smoothness={3} position={[0,.04,0]} material={m.graphite} castShadow receiveShadow/>
  <mesh position={[0,.16,0]} material={m.rubber} castShadow><cylinderGeometry args={[.14,.17,.16,24]}/></mesh>
  <mesh position={[0,.31,0]} material={m.steel} castShadow><cylinderGeometry args={[.115,.115,.18,24]}/></mesh>
  {[.25,.29,.33,.37].map(y=><mesh key={y} position={[0,y,0]} rotation={[Math.PI/2,0,0]} material={m.graphite}><torusGeometry args={[.116,.009,6,24]}/></mesh>)}
  <mesh name="lamp-glass" ref={glass} position={[0,.68,0]} scale={[1,1.20,1]}><sphereGeometry args={[.25,32,24]}/><meshPhysicalMaterial color="#c2cbc1" transparent opacity={.30} roughness={.16} metalness={0} clearcoat={1} emissive="#ffc474" emissiveIntensity={0} depthWrite={false}/></mesh>
  {[-.085,.085].map(x=><mesh key={x} position={[x,.54,0]} material={m.steel}><cylinderGeometry args={[.005,.005,.26,8]}/></mesh>)}
  <mesh name="lamp-filament" ref={filament} geometry={geometry}><meshStandardMaterial color="#a77c45" emissive="#fff0b9" emissiveIntensity={0} toneMapped={false}/></mesh>
  <mesh name="lamp-glow" ref={glow} position={[0,.68,0]} scale={[1,1.20,1]} visible={false} raycast={()=>null}><sphereGeometry args={[.30,24,16]}/><meshBasicMaterial color="#ffca7a" transparent opacity={0} depthWrite={false} toneMapped={false}/></mesh>
  <pointLight name="lamp-light" ref={light} position={[0,.68,0]} color="#ffcb86" intensity={0} distance={2.15} decay={2}/>
 </group>;
}

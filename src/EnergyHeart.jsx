import { useMemo, useRef, useLayoutEffect, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

const COUNT=28,TAU=Math.PI*2,noPick=()=>null;
const vertex=`attribute float aLEDIndex; varying float vIndex; varying float vFacing;
void main(){vIndex=aLEDIndex;vFacing=.65+.35*max(normal.z,0.0);gl_Position=projectionMatrix*modelViewMatrix*instanceMatrix*vec4(position,1.0);}`;
const fragment=`uniform float uPower;uniform float uPhase;uniform float uReduced;varying float vIndex;varying float vFacing;
void main(){float d=abs(fract(vIndex/${COUNT.toFixed(1)}-uPhase+.5)-.5);
float sweep=(1.0-uReduced)*pow(max(0.0,1.0-d*8.0),2.0);
vec3 idle=vec3(.16,.025,.035)*vFacing;
vec3 lit=mix(vec3(1.0,.10,.19),vec3(1.0,.56,.40),sweep*.65)*(.95+sweep*.28);
gl_FragColor=vec4(mix(idle,lit,uPower),1.0);}`;

// An illustrative LED load, not photographed project hardware or electrical data.
export default function EnergyHeart({sim,inspection,reduced,suspended,materials:m}){
 const pads=useRef(),leds=useRef(),glow=useRef(),light=useRef();
 const resources=useMemo(()=>{
  const curve=new THREE.CatmullRomCurve3(Array.from({length:200},(_,i)=>{
   const t=i/200*TAU;return new THREE.Vector3(.40*Math.sin(t)**3,.023*(13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t))+.045,.080);
  }),true);
  const positions=curve.getSpacedPoints(COUNT).slice(0,COUNT);
  const core=new THREE.SphereGeometry(.030,12,8);
  core.setAttribute('aLEDIndex',new THREE.InstancedBufferAttribute(new Float32Array(Array.from({length:COUNT},(_,i)=>i)),1));
  const pad=new THREE.TorusGeometry(.036,.005,6,16);
  const material=new THREE.ShaderMaterial({vertexShader:vertex,fragmentShader:fragment,uniforms:{uPower:{value:0},uPhase:{value:0},uReduced:{value:0}},toneMapped:false});
  // Gaussian halos aligned to the board: no hard enclosing sphere or bloom pass.
  const size=128,data=new Uint8Array(size*size*4);
  for(let y=0;y<size;y++)for(let x=0;x<size;x++){
   const px=(x/(size-1)-.5)*.95,py=(y/(size-1)-.5)*.95;
   let alpha=0;for(const p of positions)alpha+=Math.exp(-((px-p.x)**2+(py-p.y)**2)/.0011);
   const i=(y*size+x)*4;data[i]=255;data[i+1]=113;data[i+2]=127;data[i+3]=Math.round(Math.min(1,alpha)*255);
  }
  const texture=new THREE.DataTexture(data,size,size,THREE.RGBAFormat);texture.needsUpdate=true;
  texture.magFilter=texture.minFilter=THREE.LinearFilter;
  return{positions,core,pad,material,texture};
 },[]);
 useLayoutEffect(()=>{
  const matrix=new THREE.Matrix4();resources.positions.forEach((p,i)=>{
   matrix.makeTranslation(p.x,p.y,.066);pads.current.setMatrixAt(i,matrix);
   matrix.makeTranslation(p.x,p.y,p.z);leds.current.setMatrixAt(i,matrix);
  });pads.current.instanceMatrix.needsUpdate=leds.current.instanceMatrix.needsUpdate=true;
  pads.current.computeBoundingSphere();leds.current.computeBoundingSphere();glow.current.layers.set(1);
  const padMesh=pads.current,ledMesh=leds.current;return()=>{padMesh.dispose();ledMesh.dispose();};
 },[resources]);
 useEffect(()=>()=>{resources.core.dispose();resources.pad.dispose();resources.material.dispose();resources.texture.dispose();},[resources]);
 useFrame(()=>{
  const p=inspection||suspended?0:sim.current.power;
  const u=resources.material.uniforms;u.uPower.value=p;u.uPhase.value=sim.current.effectPhase;u.uReduced.value=Number(reduced);
  glow.current.material.opacity=p*.70;glow.current.visible=p>.003;light.current.intensity=p*4.5;
 });
 return <group name="energy-heart" position={[2.40,.28,1.02]}>
  <RoundedBox args={[.72,.075,.60]} radius={.025} smoothness={3} position={[0,.0375,0]} material={m.graphite} castShadow receiveShadow/>
  <RoundedBox args={[.14,.31,.16]} radius={.025} smoothness={3} position={[0,.23,-.02]} material={m.steel} castShadow/>
  <group position={[0,.74,0]} rotation={[-.16,.34,0]}>
   <RoundedBox name="heart-board" args={[1.00,1.12,.09]} radius={.035} smoothness={3} material={m.graphite} castShadow receiveShadow/>
   <RoundedBox args={[.90,1.02,.018]} radius={.008} smoothness={3} position={[0,0,.054]}><meshStandardMaterial color="#23342d" roughness={.76} metalness={.12}/></RoundedBox>
   {[-1,1].flatMap(x=>[-1,1].map(y=><mesh key={x+','+y} position={[x*.42,y*.47,.066]} rotation={[Math.PI/2,0,0]} material={m.steel}><cylinderGeometry args={[.024,.024,.012,8]}/></mesh>))}
   {[-1,1].map(side=><group key={side}>
    <mesh position={[side*.20,-.43,.066]}><boxGeometry args={[.30,.009,.004]}/><meshStandardMaterial color="#739087" roughness={.7}/></mesh>
    <mesh position={[side*.34,-.37,.066]}><boxGeometry args={[.009,.12,.004]}/><meshStandardMaterial color="#739087" roughness={.7}/></mesh>
   </group>)}
   <RoundedBox args={[.18,.065,.06]} radius={.012} position={[0,-.45,.068]} material={m.dark}/>
   <instancedMesh name="heart-led-pads" ref={pads} args={[resources.pad,m.steel,COUNT]} dispose={null}/>
   <instancedMesh name="heart-leds" ref={leds} args={[resources.core,resources.material,COUNT]} dispose={null}/>
   <mesh name="heart-glow" ref={glow} position={[0,0,.116]} visible={false} raycast={noPick}><planeGeometry args={[.95,.95]}/><meshBasicMaterial map={resources.texture} transparent opacity={0} depthWrite={false} toneMapped={false} blending={THREE.AdditiveBlending}/></mesh>
   <pointLight name="heart-light" ref={light} position={[0,.08,.24]} color="#ff717b" intensity={0} distance={1.8} decay={2}/>
  </group>
 </group>;
}

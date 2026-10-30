import { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const noPick=()=>null;
const vertex=`varying float vAlong;varying vec3 vNormal;varying vec3 vView;
uniform float uLength;uniform float uOffset;
void main(){vAlong=uv.x*uLength+uOffset;vec4 view=modelViewMatrix*vec4(position,1.0);
vNormal=normalize(normalMatrix*normal);vView=-view.xyz;gl_Position=projectionMatrix*view;}`;
const fragment=`uniform float uPower;uniform float uPhase;uniform float uReduced;uniform float uHalo;
varying float vAlong;varying vec3 vNormal;varying vec3 vView;
void main(){
 // Shared world-distance phase keeps a pulse continuous across both cable runs.
 float behind=fract(uPhase-vAlong/.90);
 float tail=1.0-smoothstep(.015,.32,behind);
 float head=1.0-smoothstep(.005,.055,behind);
 float pulse=tail*tail*smoothstep(0.0,.012,behind);
 float strength=mix(.12+.88*pulse,.52,uReduced);
 float facing=pow(max(dot(normalize(vNormal),normalize(vView)),0.0),uHalo>.5?2.0:.6);
 vec3 color=mix(vec3(.14,.67,.80),vec3(.78,1.0,1.0),head);
 float alpha=uPower*strength*facing*(uHalo>.5?.20:.94);
 gl_FragColor=vec4(color,alpha);
}`;

// Designed feedback streams, not literal electron trajectories/current readings.
export default function EnergyEffects({sim,points,outputPoints,inspection,reduced,suspended}){
 const root=useRef();
 const routes=useMemo(()=>{
  let offset=0;
  return [points,outputPoints].map((positions,index)=>{
   const curve=new THREE.CatmullRomCurve3(positions.map(p=>new THREE.Vector3(...p))),length=curve.getLength();
   const uniforms={uPower:{value:0},uPhase:{value:0},uReduced:{value:0},uLength:{value:length},uOffset:{value:offset}};
   offset+=length;
   const makeMaterial=halo=>new THREE.ShaderMaterial({vertexShader:vertex,fragmentShader:fragment,uniforms:{...uniforms,uHalo:{value:Number(halo)}},transparent:true,depthWrite:false,toneMapped:false,blending:THREE.AdditiveBlending});
   return{index,core:new THREE.TubeGeometry(curve,96,.029,8,false),halo:new THREE.TubeGeometry(curve,96,.045,8,false),material:makeMaterial(false),haloMaterial:makeMaterial(true)};
  });
 },[points,outputPoints]);
 useEffect(()=>{root.current.traverse(o=>o.layers.set(1));},[]);
 useEffect(()=>()=>{routes.forEach(r=>{r.core.dispose();r.halo.dispose();r.material.dispose();r.haloMaterial.dispose();});},[routes]);
 useFrame(()=>{
  const s=sim.current,p=inspection||suspended?0:s.power;root.current.visible=p>.003;
  routes.forEach(r=>{const u=r.material.uniforms;u.uPower.value=p;u.uPhase.value=s.effectPhase;u.uReduced.value=Number(reduced);});
 });
 return <group name="electrical-effects" ref={root} visible={false}>
  {routes.map(r=><group key={r.index}>
   <mesh name={r.index?'energy-output-trace':'energy-trace'} geometry={r.core} material={r.material} raycast={noPick} dispose={null}/>
   <mesh name={r.index?'energy-output-halo':'energy-input-halo'} geometry={r.halo} material={r.haloMaterial} raycast={noPick} dispose={null}/>
  </group>)}
 </group>;
}

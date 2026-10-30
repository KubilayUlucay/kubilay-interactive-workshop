import {useEffect,useMemo,useRef} from 'react';
import {useFrame} from '@react-three/fiber';
import {RoundedBox} from '@react-three/drei';
import * as THREE from 'three';
export function Box({size,position,rotation,color='#36463f',metalness=.45,roughness=.38,...props}){return <RoundedBox args={size} radius={Math.min(.035,...size.map(v=>v/5))} smoothness={3} position={position} rotation={rotation} castShadow receiveShadow {...props}><meshStandardMaterial color={color} metalness={metalness} roughness={roughness}/></RoundedBox>;}
export function Bolt({position,rotation=[Math.PI/2,0,0],scale=1}){return <mesh position={position} rotation={rotation} scale={scale} castShadow><cylinderGeometry args={[.045,.045,.025,6]}/><meshStandardMaterial color="#acb5ad" metalness={.9} roughness={.27}/></mesh>;}
export function Wire({points,color='#99bdb0',radius=.018,sim,flow=false}){
 const ref=useRef();const key=JSON.stringify(points);
 const resources=useMemo(()=>{const p=JSON.parse(key).map(v=>new THREE.Vector3(...v)),curve=new THREE.CatmullRomCurve3(p);const geometry=new THREE.TubeGeometry(curve,40,radius,6,false);const material=flow?new THREE.ShaderMaterial({uniforms:{uPhase:{value:0},uPower:{value:0},uColor:{value:new THREE.Color(color)}},vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:'uniform float uPhase;uniform float uPower;uniform vec3 uColor;varying vec2 vUv;void main(){float p=pow(max(0.,sin((vUv.x-uPhase)*25.)),8.);vec3 c=mix(uColor*.24,uColor*(1.+p*1.7),uPower);gl_FragColor=vec4(c,uPower*.9);}',toneMapped:false,transparent:true,depthWrite:false}):new THREE.MeshStandardMaterial({color,metalness:.35,roughness:.5});return{geometry,material};},[key,radius,flow,color]);
 useEffect(()=>()=>{resources.geometry.dispose();resources.material.dispose();},[resources]);
 useFrame(()=>{if(flow&&sim){const s=sim.current;let power=s.current,direction=1;if(flow!=='load'){const [,pair,cell]=flow.split(':').map(Number);power=s.pair===pair&&((s.phase==='collect'&&s.donor===cell)||(s.phase==='deliver'&&s.receiver===cell))?1:0;direction=s.phase==='deliver'?-1:1;}resources.material.uniforms.uPhase.value=s.flowPhase*direction;resources.material.uniforms.uPower.value=power;}},-1);
 return <mesh ref={ref} geometry={resources.geometry} material={resources.material} castShadow={!flow}/>;
}

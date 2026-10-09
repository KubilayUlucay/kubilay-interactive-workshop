import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

const TAU=Math.PI*2;
function extrude(shape,depth,bevel=.012){
 const g=new THREE.ExtrudeGeometry(shape,{depth,bevelEnabled:!!bevel,bevelSegments:3,steps:1,bevelSize:bevel,bevelThickness:bevel,curveSegments:48});
 g.translate(0,0,-depth/2);return g;
}
// Dimensionless silhouettes reconstructed from the supplied CAD image.
export function plateGeometry({radius=1.47,ears=.085,lobes=6,bore=.30,depth=.095,holes=true}={}){
 const shape=new THREE.Shape();
 for(let i=0;i<=192;i++){
  const a=i/192*TAU,r=radius+ears*Math.pow((1+Math.cos(a*lobes))/2,4);
  if(i===0)shape.moveTo(r*Math.cos(a),r*Math.sin(a));else shape.lineTo(r*Math.cos(a),r*Math.sin(a));
 }
 const center=new THREE.Path();center.absarc(0,0,bore,0,TAU,false);shape.holes.push(center);
 if(holes)for(let i=0;i<lobes;i++){
  const a=i/lobes*TAU,hole=new THREE.Path();
  hole.absarc(Math.cos(a)*(radius+ears*.30),Math.sin(a)*(radius+ears*.30),radius>.8?.033:.028,0,TAU,false);shape.holes.push(hole);
 }
 return extrude(shape,depth);
}
function trapezoid(wide,narrow,height,inset=0){
 const vertices=[[-narrow+inset,-height+inset],[narrow-inset,-height+inset],[wide-inset,height-inset],[-wide+inset,height-inset]];
 const path=new THREE.Shape(),round=.065;
 for(let i=0;i<4;i++){
  const previous=vertices[(i+3)%4],v=vertices[i],next=vertices[(i+1)%4];
  const toward=p=>{const length=Math.hypot(p[0]-v[0],p[1]-v[1]);return[v[0]+(p[0]-v[0])*round/length,v[1]+(p[1]-v[1])*round/length];};
  const a=toward(previous),b=toward(next);
  if(i===0)path.moveTo(...a);else path.lineTo(...a);
  path.quadraticCurveTo(...v,...b);
 }
 path.closePath();return path;
}
export function windingGeometry(){
 const turns=[];
 for(let i=0;i<14;i++){
  const path=trapezoid(.245+i*.0048,.143+i*.0048,.275+i*.0048);
  const points=path.getPoints(48).map(p=>new THREE.Vector3(p.x,p.y,(i%3)*.007));
  const curve=new THREE.CatmullRomCurve3(points,true,'centripetal');
  turns.push(new THREE.TubeGeometry(curve,80,.0074,5,true));
 }
 const merged=mergeGeometries(turns);turns.forEach(g=>g.dispose());return merged;
}
export function statorGeometry(){
 const shape=new THREE.Shape();shape.absarc(0,0,1.46,0,TAU,false);
 const bore=new THREE.Path();bore.absarc(0,0,.37,0,TAU,false);shape.holes.push(bore);
 for(let i=0;i<9;i++){
  const angle=i/9*TAU,aperture=new THREE.Path();
  const points=trapezoid(.21,.112,.24).getPoints(32);
  points.forEach((p,j)=>{const y=p.y+.96,x=p.x*Math.cos(angle)-y*Math.sin(angle),rotY=p.x*Math.sin(angle)+y*Math.cos(angle);if(j===0)aperture.moveTo(x,rotY);else aperture.lineTo(x,rotY);});
  aperture.closePath();shape.holes.push(aperture);
 }
 return extrude(shape,.055,.006);
}

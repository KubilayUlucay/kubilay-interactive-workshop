import * as THREE from 'three';
export function fitGimbal(root,camera,direction,applyCamera=true){
 root.position.y=.48;root.updateWorldMatrix(true,true);const bounds=new THREE.Box3();root.traverse(o=>{if(o.isMesh&&o.geometry){if(!o.geometry.boundingBox)o.geometry.computeBoundingBox();bounds.union(o.geometry.boundingBox.clone().applyMatrix4(o.matrixWorld));}});
 const lift=Math.max(0,.08-bounds.min.y);root.position.copy(root.parent.worldToLocal(root.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0,lift,0))));bounds.translate(new THREE.Vector3(0,lift,0));root.updateWorldMatrix(true,true);
 const center=bounds.getCenter(new THREE.Vector3());center.y=Math.max(bounds.max.y,1)/2;const radius=Math.max(bounds.max.y/2,2.5),distance=radius/Math.sin(camera.fov*Math.PI/360)*Math.max(1,1/camera.aspect)*1.08;
 if(applyCamera){camera.position.copy(center).addScaledVector(direction,distance);camera.lookAt(center);camera.updateMatrixWorld();}bounds.frameCenter=center;return bounds;
}

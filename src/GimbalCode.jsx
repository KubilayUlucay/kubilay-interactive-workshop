import {useState} from 'react';
const code=`// Educational equivalent — NOT the original project firmware.
// Explains the exhibit's ideal stabilization; no verified pin mapping.
struct Orientation { float pitch, yaw, roll; };

float shortestAngle(float radians) {
  return atan2(sin(radians), cos(radians));
}

// In the exhibit, nested Y-X-Z joints apply the inverse quaternion.
// These adapter functions represent hardware-specific implementation.
void stabilize() {
  Quaternion base = readCalibratedOrientation();
  Quaternion correction = stabilizationEnabled ? inverse(base)
                                               : Quaternion::identity();
  Orientation joint = toEulerYXZ(correction);
  commandYawServo(joint.yaw);
  commandPitchServo(joint.pitch);
  commandRollServo(joint.roll);
}

// A real build must respect servo travel and calibrated safe limits.
// The website's full-turn orientation is an illustrative demo range.
`;
export default function GimbalCode(){const[open,setOpen]=useState(false),[copied,setCopied]=useState(false);return <section className="gimbal-code"><button className="text-link" aria-expanded={open} onClick={()=>setOpen(v=>!v)}>{open?'Hide code −':'Explore the code +'}</button>{open&&<><h2>How the correction works.</h2><p>Educational equivalent, not the original firmware. The original presentation describes Arduino Nano, MPU6050 and three servos; its repository contains no firmware file. This sketch explains ideal correction and leaves hardware adapters unspecified.</p><div className="code-actions"><button onClick={async()=>{try{await navigator.clipboard.writeText(code);setCopied(true);}catch{setCopied(false);}}}>{copied?'Copied':'Copy code'}</button><a download="gimbal-educational.cpp" href={'data:text/plain;charset=utf-8,'+encodeURIComponent(code)}>Download sketch</a><a href="https://github.com/KubilayUlucay/website2/tree/main/public/projects/gimbal" target="_blank" rel="noreferrer">Original project ↗</a></div><pre tabIndex={0} aria-label="Educational gimbal code"><code>{code.split('\n').map((line,i)=><span className={line.trim().startsWith('//')?'code-comment':'code-line'} key={i}><i>{i+1}</i>{line.split(/(void|float|struct|return|Quaternion|Orientation|bool)/g).map((part,j)=>/^(void|float|struct|return|Quaternion|Orientation|bool)$/.test(part)?<b key={j}>{part}</b>:part)}{'\n'}</span>)}</code></pre></>}</section>;}

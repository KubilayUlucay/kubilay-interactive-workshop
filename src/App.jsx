import React, { useState, useRef, useEffect, useCallback } from 'react';
import { RotateCcw, Move, X, Plus, Layers3, ExternalLink, Download, MousePointer2 } from 'lucide-react';
import MotorScene from './MotorScene';
import { createSimulation } from './simulation';

const PARTS = [
 {id:'stator',n:'01',name:'Copper windings',detail:'Nine coils stay fixed in the stator. Current through the windings creates the magnetic field that drives the rotor.'},
 {id:'rotor',n:'02',name:'Magnet rotors',detail:'The rotor plates turn around the same shaft. Permanent magnets face the stator across a small air gap.'},
 {id:'housing',n:'03',name:'Bearing supports',detail:'Separate bearing carriers sit outside the rotor plates and keep the shaft aligned. This model follows the visible layout of the project CAD.'},
 {id:'shaft',n:'04',name:'Output shaft',detail:'The shaft transfers rotation to a load. The crank on the left is a separate, illustrative generator input.'},
];
class SceneBoundary extends React.Component {
 constructor(p){super(p);this.state={failed:false};}static getDerivedStateFromError(){return {failed:true};}
 render(){return this.state.failed?<div className="scene-fallback"><img src="/projects/motor/motor_3d.jpg" alt="Original CAD rendering of the axial-flux motor"/><p>3D is unavailable in this browser. You can still explore the real project below.</p></div>:this.props.children;}
}
function Dialog({kind,onClose}) {
 const ref=useRef();
 useEffect(()=>{const node=ref.current;node.showModal();return()=>node.close();},[]);
 return <dialog ref={ref} className={'dialog '+(kind==='cv'?'cv-dialog':'')} onCancel={onClose} onClick={e=>{if(e.target===ref.current)onClose();}}>
  <div className="dialog-head"><span className="eyebrow">{kind==='motor'?'PROJECT 01 · AXIAL FLUX':kind==='projects'?'SELECTED WORK':kind==='cv'?'CV · REPOSITORY DOCUMENT':'ABOUT KUBILAY'}</span><button className="icon-btn" aria-label="Close panel" onClick={onClose} autoFocus><X size={22}/></button></div>
  {kind==='motor'?<>
   <h2>From CAD to copper.</h2><p className="lead">A motor I designed, wound, and assembled during my electrical engineering degree.</p>
   <div className="evidence-grid"><figure><img src="/projects/motor/motor-inside-wiring.jpeg" alt="Nine hand-wound copper coils on turquoise stator supports"/><figcaption>Hand-wound stator</figcaption></figure><figure><img src="/projects/motor/overall-motor.jpeg" alt="Assembled axial-flux motor on a university lab bench"/><figcaption>The assembled hardware</figcaption></figure></div>
   <div className="video-row"><video controls playsInline preload="metadata" poster="/projects/motor/overall-motor.jpeg"><source src="/projects/motor/motor-preview.webm" type="video/webm"/><source src="/projects/motor/motor-video.mp4" type="video/mp4"/></video><div><h3>The lab test.</h3><p>The original footage from the repository. The interactive scene is an illustrative model inspired by this hardware; the hand crank and electrical glow are illustrative additions.</p><a className="text-link" href="https://github.com/KubilayUlucay/website2/tree/main/public/projects/motor" target="_blank" rel="noreferrer">View project material <ExternalLink size={15}/></a></div></div>
  </>:kind==='projects'?<>
   <h2>Things I’ve made.</h2><p className="lead">Hardware, controls, and the software between them.</p>
   <div className="project-list">
   {[['01','Axial-flux motor','Copper windings, printed mechanics, and a working lab build.','motor/motor-inside-wiring.jpeg','motor'],['02','Battery management','PCB design, simulation, and battery balancing.','bms/pcb.png','bms'],['03','Camera gimbal','A physical stabilization prototype and its control electronics.','gimbal/stabilizer.jpeg','gimbal']].map(([n,title,desc,img,id])=><a key={id} href={'https://github.com/KubilayUlucay/website2/tree/main/public/projects/'+id} target="_blank" rel="noreferrer"><img src={'/projects/'+img} alt={title}/><span><small>{n}</small><h3>{title}</h3><p>{desc}</p><span className="text-link">Project material <ExternalLink size={14}/></span></span></a>)}
   </div><a className="plain-link" href="https://kubilay-engineering.kubiulucay.chatgpt.site/" target="_blank" rel="noreferrer">Visit my current portfolio <ExternalLink size={15}/></a>
  </>:kind==='cv'?<><h2>Curriculum vitae.</h2><div className="cv-links"><a href="/documents/CV_DUZ.pdf" download="Kubilay-Ulucay-CV.pdf" className="text-link">Download PDF <Download size={16}/></a><a href="/documents/CV_DUZ.pdf" target="_blank" rel="noreferrer" className="text-link">Open PDF <ExternalLink size={16}/></a></div><p className="document-note">The existing CV from my repository. For my current role, see About.</p><iframe title="Kubilay Uluçay curriculum vitae" src="/documents/CV_DUZ.pdf#view=FitH"/></>:<>
   <h2>Hi, I’m Kubilay.</h2><p className="lead">I’m an Electrical & Electronics Engineer who likes making things work—and understanding why they don’t.</p><p>I graduated from Özyeğin University in June 2025, with a minor in Computer Science. My projects sit where mechanics, electronics, and code meet.</p><p>Since January 2026, I’ve been a Test Engineer at Accenture, working on lab equipment verification with Python and a PyTAF-based framework. I enjoy testing, and my heart is still with R&D and building things.</p><div className="about-links"><a href="mailto:kubilay.ulucay@ozu.edu.tr">kubilay.ulucay@ozu.edu.tr</a><a href="https://github.com/KubilayUlucay" target="_blank" rel="noreferrer">GitHub <ExternalLink size={14}/></a><a href="https://linkedin.com/in/kubilayulucay" target="_blank" rel="noreferrer">LinkedIn <ExternalLink size={14}/></a></div>
  </>}
 </dialog>;
}
export default function App(){
 const [inspection,setInspection]=useState(false),[orbit,setOrbit]=useState(false),[part,setPart]=useState('stator'),[dialog,setDialog]=useState(null),[drag,setDrag]=useState(false),[telemetry,setTelemetry]=useState({power:0,running:false}),[resetKey,setResetKey]=useState(0),[held,setHeld]=useState(false);
 const [reduced,setReduced]=useState(()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches);
 const [webgl]=useState(()=>{try{const c=document.createElement('canvas');const gl=c.getContext('webgl2');if(!gl)return false;gl.getExtension('WEBGL_lose_context')?.loseContext();return true;}catch{return false;}});
 const sim=useRef(createSimulation());
 const updateTelemetry=useCallback(value=>setTelemetry(old=>old.power===value.power&&old.running===value.running?old:value),[]);
 useEffect(()=>{const media=window.matchMedia('(prefers-reduced-motion: reduce)');const change=e=>setReduced(e.matches);media.addEventListener('change',change);return()=>media.removeEventListener('change',change);},[]);
 const toggleInspection=useCallback((value)=>{if(!webgl)return;setInspection(value);sim.current.inspect=value;sim.current.held=false;sim.current.dragging=false;sim.current.lastDrag=-1000;setHeld(false);setDrag(false);setOrbit(false);},[webgl]);
 const reset=useCallback(()=>{Object.assign(sim.current,createSimulation());setTelemetry({power:0,running:false});setHeld(false);setDrag(false);setInspection(false);setOrbit(false);setPart('stator');setResetKey(k=>k+1);},[]);
 const release=useCallback(()=>{sim.current.held=false;setHeld(false);},[]);
 const start=useCallback(()=>{if(webgl&&!sim.current.inspect){setOrbit(false);sim.current.held=true;setHeld(true);}},[webgl]);
 useEffect(()=>{
  const up=e=>{if(e.type!=='keyup'||e.code==='Space')release();};
  const key=e=>{const el=e.target; if(dialog||el.isContentEditable||/INPUT|TEXTAREA|BUTTON|A|SELECT/.test(el.tagName))return;if(e.code==='Space'){e.preventDefault();start();}else if(!e.repeat&&e.code==='KeyI')toggleInspection(!sim.current.inspect);else if(!e.repeat&&e.code==='KeyR')reset();};
  window.addEventListener('keydown',key);window.addEventListener('keyup',up);window.addEventListener('pointerup',up);window.addEventListener('pointercancel',up);window.addEventListener('blur',release);
  const hidden=()=>{if(document.hidden){release();sim.current.dragging=false;}};document.addEventListener('visibilitychange',hidden);
  return()=>{window.removeEventListener('keydown',key);window.removeEventListener('keyup',up);window.removeEventListener('pointerup',up);window.removeEventListener('pointercancel',up);window.removeEventListener('blur',release);document.removeEventListener('visibilitychange',hidden);};
 },[dialog,release,start,reset,toggleInspection]);
 useEffect(()=>{if(dialog){release();sim.current.dragging=false;sim.current.lastDrag=-1000;setDrag(false);}},[dialog,release]);
 useEffect(()=>{
  const context=document.modelContext;if(!webgl||!context?.registerTool)return;const lifecycle=new AbortController();
  Promise.resolve(context.registerTool({name:'set_motor_inspection',title:'Inspect motor',description:'Open or close the exploded motor inspection in the visible scene.',inputSchema:{type:'object',properties:{open:{type:'boolean'}},required:['open'],additionalProperties:false},annotations:{readOnlyHint:false},execute:async input=>{if(typeof input?.open!=='boolean'||Object.keys(input).some(k=>k!=='open'))throw new Error('open must be a boolean');toggleInspection(input.open);return {inspection:input.open};}},{signal:lifecycle.signal})).catch(()=>{});return()=>lifecycle.abort();
 },[toggleInspection,webgl]);
 const selected=PARTS.find(p=>p.id===part);
 return <main className={"workshop "+(reduced?"reduced":"")}>
  <a className="skip-link" href="#scene-controls">Skip to controls</a>
  <header className="nav"><button className="brand" onClick={reset}><img src="/favicon.svg" alt=""/>Kubilay Uluçay<span className="brand-note">ENGINEER / MAKER</span></button><nav aria-label="Portfolio"><button onClick={()=>setDialog('projects')}>Projects</button><button onClick={()=>setDialog('about')}>About</button><button onClick={()=>setDialog('cv')}>CV</button><a href="mailto:kubilay.ulucay@ozu.edu.tr">Contact</a></nav></header>
  <div className="scene" aria-label="Interactive crank generator and axial-flux motor"><SceneBoundary>{webgl?<MotorScene sim={sim} inspection={inspection} part={part} onPart={setPart} orbit={orbit} reduced={reduced} held={held} suspended={Boolean(dialog)} onTelemetry={updateTelemetry} onDrag={setDrag} resetKey={resetKey}/>:<div className="scene-fallback"><img src="/projects/motor/motor_3d.jpg" alt="Original CAD rendering of the axial-flux motor"/><button className="text-link" onClick={()=>setDialog('motor')}>Explore the real build <Plus size={16}/></button></div>}</SceneBoundary></div>
  <div className="intro"><span className="eyebrow">THE WORKSHOP / 01</span><h1>{!webgl?<>Inside<br/><span>the real build.</span></>:inspection?<>Motion,<br/><span>from inside.</span></>:<>It starts<br/><span>with a turn.</span></>}</h1><p>{!webgl?'3D is unavailable in this browser.\nThe project photographs and video are here.':inspection?'A closer look at what makes a motor move.':'A small input. A visible response.\nTurn the crank and wake the motor.'}</p></div>
  <div className="scene-caption"><span>AXIAL-FLUX MOTOR</span><button className="text-link" onClick={()=>setDialog('motor')}>See the real build <Plus size={16}/></button></div>
  {inspection&&<aside className="inspection-panel" aria-label="Motor components"><span className="eyebrow">EXPLODED INSPECTION</span><div className="parts-tabs">{PARTS.map(p=><button key={p.id} className={part===p.id?'selected':''} aria-pressed={part===p.id} aria-describedby={part===p.id?'part-detail':undefined} onClick={()=>setPart(p.id)}><span>{p.n}</span>{p.name}<Plus size={14}/></button>)}</div><p id="part-detail" className="part-detail" aria-live="polite"><strong>{selected.name}</strong>{selected.detail}</p></aside>}
  {webgl&&<div className="scene-tools"><button className={'icon-btn '+(orbit?'active':'')} aria-label={orbit?'Lock camera':'Orbit camera'} title="Orbit camera" aria-pressed={orbit} onClick={()=>setOrbit(v=>!v)}><Move size={19}/></button><button className="icon-btn" aria-label="Reset scene" title="Reset scene (R)" onClick={reset}><RotateCcw size={19}/></button><button className="motion-toggle" aria-pressed={reduced} onClick={()=>setReduced(v=>!v)}>{reduced?'Less motion':'Motion on'}</button></div>}
  <section id="scene-controls" className="control-dock" aria-label="Scene controls">
   {webgl?<div className="power"><div className="power-heading"><span className="eyebrow">POWER</span><strong>{String(telemetry.power).padStart(2,'0')}<small>%</small></strong></div><div className="power-track"><div style={{transform:`scaleX(${telemetry.power/100})`}}/></div><span className="power-status">{!webgl?'3D unavailable':inspection?'Paused for inspection':telemetry.running?'Motor energized':'Waiting for a turn'}</span></div>:<div className="fallback-description"><span className="eyebrow">PROJECT 01</span><span>Axial-flux motor</span></div>}
   <div className="main-controls">{!webgl?<><button className="turn-button" onClick={()=>setDialog('motor')}>View motor project</button><button className="inspect-button" onClick={()=>setDialog('projects')}>Other projects</button></>:<><button className={'turn-button '+(held||drag?'turning':'')} disabled={inspection||!webgl} onPointerDown={e=>{e.currentTarget.setPointerCapture(e.pointerId);start();}} onPointerUp={release} onPointerCancel={release} onLostPointerCapture={release} onKeyDown={e=>{if(e.code==='Space'||e.code==='Enter'){e.preventDefault();start();}}} onKeyUp={e=>{if(e.code==='Space'||e.code==='Enter')release();}} onBlur={release}><RotateCcw size={18}/><span>{held||drag?'Turning…':'Hold to turn'}</span></button><button disabled={!webgl} className={'inspect-button '+(inspection?'selected':'')} aria-pressed={inspection} onClick={()=>toggleInspection(!inspection)}><Layers3 size={18}/>{inspection?'Reassemble':'Inspect motor'}</button></>}</div>
   <div className="instructions"><MousePointer2 size={15}/><span>{!webgl?'Explore project photos and video':orbit?'Drag to orbit · scroll to zoom':inspection?'Select a part · I to reassemble':'Drag the handle · hold Space to turn'}<small>R resets the scene</small></span></div>
  </section>
  <footer><span>SEYIT KUBILAY ULUÇAY</span><span className="model-note">Illustrative mechanism · real project behind it</span>{webgl&&<div className="chapter-nav"><button onClick={()=>toggleInspection(false)} aria-current={!inspection?'step':undefined}>01 <span>Motion</span></button><i/><button disabled={!webgl} onClick={()=>toggleInspection(true)} aria-current={inspection?'step':undefined}>02 <span>Inside</span></button></div>}</footer>
  {dialog&&<Dialog kind={dialog} onClose={()=>setDialog(null)}/>}
 </main>;
}
